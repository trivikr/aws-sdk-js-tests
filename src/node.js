const AWS = require("aws-sdk");
const { CloudSearch } = require("@aws-sdk/client-cloudsearch");
const { REGION } = require("./config");

(async () => {
  let response;

  const v2Client = new AWS.CloudSearch({ region: REGION });
  response = await v2Client.describeDomains().promise();
  console.log("Data returned by v2:");
  console.log(JSON.stringify(response, null, 2));

  const v3Client = new CloudSearch({ region: REGION });
  response = await v3Client.describeDomains({});
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));
})();
