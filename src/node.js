const AWS = require("aws-sdk");
// const { Glacier } = require("@aws-sdk/client-glacier");
const { REGION } = require("./config");

(async () => {
  let response;

  const v2Client = new AWS.Glacier({ region: REGION });
  // const v3Client = new Glacier({ region: REGION });

  const vaultName = "TestVault";

  const body = Buffer.alloc(0.25 * 1024 * 1024);
  body.fill("0");
  const { treeHash: checksum } = v2Client.computeChecksums(body);

  await v2Client.createVault({ vaultName }).promise();
  await v2Client.waitFor("vaultExists", { vaultName }).promise();

  response = await v2Client
    .uploadArchive({
      vaultName,
      body,
      checksum
    })
    .promise();
  console.log("\nData returned by v2:");
  console.log(response);

  const { archiveId } = response;
  await v2Client
    .deleteArchive({
      vaultName,
      archiveId
    })
    .promise();
})();
