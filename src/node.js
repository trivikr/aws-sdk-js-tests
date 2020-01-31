const AWS = require("aws-sdk");
const { CloudFront } = require("@aws-sdk/client-cloudfront");
const { REGION } = require("./config");

(async () => {
  let response;

  const v2Client = new AWS.CloudFront({ region: REGION });
  response = await v2Client.listDistributions().promise();
  console.log("Data returned by v2:");
  console.log(JSON.stringify(response, null, 2));

  const v3Client = new CloudFront({ region: REGION });
  response = await v3Client.listDistributions({});
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));
})();
