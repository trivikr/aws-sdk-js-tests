const { S3 } = require("@aws-sdk/client-s3");
const { REGION } = require("./config");

const { promisify } = require("util");
const sleep = promisify(setTimeout);

(async () => {
  const bucketName =
    "test-bucket-" +
    Math.random()
      .toString(36)
      .substring(2);
  const params = {
    Bucket: bucketName
  };
  const objectName = "ExampleObject.jpg";

  const v3Client = new S3({ region: REGION });

  console.log(`Creating bucket ${bucketName}`);
  await v3Client.createBucket(params);

  console.log(`Waiting for "${bucketName}" bucket creation`);
  // waiter not available yet, just sleep for 5 seconds
  await sleep(5000);

  console.log(`Putting object ${objectName} in ${bucketName}...`);
  await v3Client.putObject({
    Body: "000000",
    Bucket: bucketName,
    Key: objectName
  });

  const response = await v3Client.listObjects(params);
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));

  console.log(`\nDeleting ${objectName} from ${bucketName}`);
  await v3Client.deleteObject({
    Bucket: bucketName,
    Key: objectName
  });

  console.log(`Deleting bucket ${bucketName}`);
  await v3Client.deleteBucket(params);
})();
