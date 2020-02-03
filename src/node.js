const { S3 } = require("@aws-sdk/client-s3");
const { REGION } = require("./config");

const { promisify } = require("util");
const sleep = promisify(setTimeout);

(async () => {
  // Bucket created from console for testing
  const bucketName = "test-bucket-fast-xml-parser";
  const objectName = "ExampleObject.jpg";

  const v3Client = new S3({ region: REGION });

  console.log(`Putting object ${objectName} in ${bucketName}...`);
  await v3Client.putObject({
    Body: "000000",
    Bucket: bucketName,
    Key: objectName
  });

  const response = await v3Client.listObjects({ Bucket: bucketName });
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));

  console.log(`\nDeleting ${objectName} from ${bucketName}`);
  await v3Client.deleteObject({
    Bucket: bucketName,
    Key: objectName
  });
})();
