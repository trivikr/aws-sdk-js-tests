const AWS = require("aws-sdk");

const {
  fromCognitoIdentityPool
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { Kinesis } = require("@aws-sdk/client-kinesis");

const { REGION, IDENTITY_POOL_ID } = require("./config");

let ShardIterator;

const v2Client = new AWS.Kinesis({ region: REGION });
const v3Client = new Kinesis({ region: REGION });
const StreamName = `test-stream-${Math.floor(Math.random() * 10 ** 10)}`;

const params = {
  Records: [
    {
      Data: "Data",
      PartitionKey: "PartitionKey"
    }
  ],
  StreamName
};

const beforeAll = async () => {
  const ShardCount = 1;
  await v2Client.createStream({ StreamName, ShardCount }).promise();
  await v2Client.waitFor("streamExists", { StreamName }).promise();

  let response = await v2Client.listShards({ StreamName }).promise();
  const { ShardId } = response.Shards[0];
  const ShardIteratorType = "LATEST";
  response = await v2Client
    .getShardIterator({ ShardId, StreamName, ShardIteratorType })
    .promise();
  ShardIterator = response.ShardIterator;
};

const getV2Response = async clientParams => {
  await v2Client.putRecords(params).promise();
  return v2Client.getRecords({ ShardIterator }).promise();
};

const getV3Response = async clientParams => {
  await v3Client.putRecords(params);
  return v3Client.getRecords({ ShardIterator });
};

const getV2BrowserResponse = async () => {
  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
  });

  return getV2Response({ region: REGION });
};

const getV3BrowserResponse = async () =>
  getV3Response({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: REGION
      }),
      identityPoolId: IDENTITY_POOL_ID
    })
  });

const afterAll = async () => {
  await v3Client.deleteStream({ StreamName });
};

module.exports = {
  beforeAll,
  afterAll,
  getV2Response,
  getV3Response,
  getV2BrowserResponse,
  getV3BrowserResponse
};
