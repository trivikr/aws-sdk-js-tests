const AWS = require("aws-sdk");
const { S3 } = require("@aws-sdk/client-s3");
const { REGION } = require("./config");

(async () => {
  let response;
  const bucketName =
    "test-bucket-" +
    Math.random()
      .toString(36)
      .substring(2);
  const params = {
    Bucket: bucketName
  };
  const objectName = "ExampleObject.jpg";

  const v2Client = new AWS.S3({ region: REGION });
  console.log(`Creating bucket ${bucketName}`);
  await v2Client.createBucket(params).promise();
  console.log(`Waiting for "${bucketName}" bucket creation`);
  await v2Client.waitFor("bucketExists", params).promise();

  console.log(`Putting object ${objectName} in ${bucketName}...`);
  await v2Client
    .putObject({
      Body: "000000",
      Bucket: bucketName,
      Key: objectName
    })
    .promise();

  response = await v2Client.listObjects(params).promise();
  console.log("Data returned by v2:");
  console.log(JSON.stringify(response, null, 2));

  const v3Client = new S3({ region: REGION });
  response = await v3Client.listObjects(params);
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));

  console.log(`Deleting ${objectName} from ${bucketName}`);
  await v2Client
    .deleteObject({
      Bucket: bucketName,
      Key: objectName
    })
    .promise();

  console.log(`Deleting bucket ${bucketName}`);
  await v2Client.deleteBucket(params).promise();
})();
