const AWS = require("aws-sdk");
const { Pinpoint } = require("@aws-sdk/client-pinpoint");
const { REGION } = require("./config");

(async () => {
  let response;

  const v2Client = new AWS.Pinpoint({ region: REGION });
  response = await v2Client.listTemplates().promise();
  console.log("Data returned by v2:");
  console.log(response);

  const v3Client = new Pinpoint({ region: REGION });
  response = await v3Client.listTemplates({});
  console.log("\nData returned by v3:");
  console.log(response);
})();
