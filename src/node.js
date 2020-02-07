const AWS = require("aws-sdk");
const { Glacier } = require("@aws-sdk/client-glacier");
const { REGION } = require("./config");

(async () => {
  const v2Client = new AWS.Glacier({ region: REGION });
  const v3Client = new Glacier({ region: REGION });

  const vaultName = "TestVault";

  const body = Buffer.alloc(0.25 * 1024 * 1024);
  body.fill("0");
  const incorrectChecksum = "00000000000000000000000000000000";

  await v2Client.createVault({ vaultName }).promise();
  await v2Client.waitFor("vaultExists", { vaultName }).promise();

  try {
    await v2Client
      .uploadArchive({
        vaultName,
        body,
        checksum: incorrectChecksum
      })
      .promise();
  } catch (error) {
    console.log(`Error from v2:`);
    console.log(error);
  }

  try {
    await v3Client.uploadArchive({
      vaultName,
      body,
      checksum: incorrectChecksum
    });
  } catch (error) {
    console.log(`\nError from v3:`);
    console.log(error);
  }
})();
