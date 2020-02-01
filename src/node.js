const AWS = require("aws-sdk");
const { EC2 } = require("@aws-sdk/client-ec2");
const { REGION } = require("./config");

(async () => {
  let response;

  // const v2Client = new AWS.EC2({ region: REGION });
  // response = await v2Client.describeInstances().promise();
  // console.log("Data returned by v2:");
  // console.log(JSON.stringify(response, null, 2));

  const v3Client = new EC2({ region: REGION });
  response = await v3Client.describeInstances({});
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));
})();
