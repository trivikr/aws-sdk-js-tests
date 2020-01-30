const AWS = require("aws-sdk");
const { ElastiCache } = require("@aws-sdk/client-elasticache");
const { REGION } = require("./config");

(async () => {
  let response;
  const name =
    "TestCacheParameterGroup-" +
    Math.random()
      .toString(36)
      .substring(2);

  const params = {
    Description: "TestCacheParameterGroup",
    CacheParameterGroupFamily: "memcached1.4"
  };

  const v2Client = new AWS.ElastiCache({ region: REGION });
  response = await v2Client
    .createCacheParameterGroup({
      ...params,
      CacheParameterGroupName: name
    })
    .promise();
  console.log("Data returned by v2:");
  console.log(response);

  const v3Client = new ElastiCache({ region: REGION });
  response = await v3Client.createCacheParameterGroup({
    ...params,
    CacheParameterGroupName: `${name}-V3`
  });
  console.log("\nData returned by v3:");
  console.log(response);
})();
