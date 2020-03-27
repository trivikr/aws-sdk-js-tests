const AWS = require("aws-sdk");

const {
  fromCognitoIdentityPool
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { Kinesis } = require("@aws-sdk/client-kinesis");

const { REGION, IDENTITY_POOL_ID } = require("./config");

const StreamName = "test-stream";
const ShardIterator =
  "AAAAAAAAAAEAqD2OGB6wHG2uwXAz3Hr1WyhHRd4ocvI5nPOH/VNVWhK1qidnZXPgBlxODvTFXWO44QoIUObXnecPExg1qvfA5rapr3EuxZzYLyt6Mzh4PJzahNinNXNs4soZkQ7cQY8nXix/dtNaqRwvxzt+NT2C6XFBreTClXGY7nUcfTqA9rVEY5Of3TFxOPcGczxS/A/yuhlGeOVQtR01YvKLUZaK";
const params = {
  Records: [
    {
      Data: "Data",
      PartitionKey: "PartitionKey"
    }
  ],
  StreamName
};

const getV2Response = async clientParams => {
  const v2Client = new AWS.Kinesis(clientParams);
  await v2Client.putRecords(params).promise();
  return v2Client.getRecords({ ShardIterator }).promise();
};

const getV3Response = async clientParams => {
  const v3Client = new Kinesis(clientParams);
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

module.exports = {
  getV2Response,
  getV3Response,
  getV2BrowserResponse,
  getV3BrowserResponse
};
