const AWS = require("aws-sdk");
// const { Glacier } = require("@aws-sdk/client-glacier");
const { REGION } = require("./config");

(async () => {
  let response;

  const v2Client = new AWS.Glacier({ region: REGION });
  //const v3Client = new Glacier({ region: REGION });

  const vaultName = "TestVault";

  const body = Buffer.alloc(0.25 * 1024 * 1024);
  body.fill("0");

  await v2Client.createVault({ vaultName: `${vaultName}V2` }).promise();
  await v2Client
    .waitFor("vaultExists", { vaultName: `${vaultName}V2` })
    .promise();

  response = await v2Client
    .uploadArchive({
      vaultName: `${vaultName}V2`,
      body
    })
    .promise();
  console.log("\nData returned by v2:");
  console.log(response);
})();
