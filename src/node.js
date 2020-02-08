const AWS = require("aws-sdk");
const { CognitoSync } = require("@aws-sdk/client-cognito-sync");
const { REGION } = require("./config");

(async () => {
  const params = {
    IdentityPoolId: "INVALID",
    IdentityId: "A:B:C"
  };
  const v3Client = new CognitoSync({ region: REGION });

  console.log(`\nListing identity pools`);
  try {
    const result = await v3Client.listDatasets(params);
    console.log("success result: ", result);
  } catch (e) {
    console.log("error: ", e);
    process.exit(1);
  }
})();
