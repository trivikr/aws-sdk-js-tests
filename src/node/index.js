const {
  beforeAll,
  afterAll,
  getV2Response,
  getV3Response
} = require("../shared/utils");

(async () => {
  let response;

  await beforeAll();

  response = await getV2Response();
  console.log("Data returned by v2:");
  console.log(JSON.stringify(response, null, 2));

  response = await getV3Response();
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));

  await afterAll();
})();
