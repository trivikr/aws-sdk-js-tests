const { REGION } = require("../shared/config");
const { getV2Response, getV3Response } = require("../shared/utils");

(async () => {
  let response;

  response = await getV2Response({ region: REGION });
  console.log("Data returned by v2:");
  for await (const event of response.Payload) {
    if (event.Records) {
      console.log(event.Records.Payload.toString());
    }
  }

  response = await getV3Response({ region: REGION });
  console.log("\nData returned by v3:");
  for await (const event of response.Payload) {
    if (event.Records) {
      console.log(event.Records.Payload.toString());
    }
  }
})();
