const { S3 } = require("@aws-sdk/client-s3");
const { REGION } = require("./config");

(async () => {
  let response;
  // Bucket created from console for testing
  const bucketName = "test-bucket-fast-xml-parser";
  const objectName = "test-object";

  const v3Client = new S3({ region: REGION });

  response = await v3Client.listObjects({ Bucket: bucketName });
  if (Array.isArray(response.Contents)) {
    console.log(`Emptying bucket ${bucketName}`);
    for (const obj of response.Contents) {
      console.log(`\nDeleting ${obj.Key} from ${bucketName}`);
      await v3Client.deleteObject({
        Bucket: bucketName,
        Key: obj.Key
      });
    }
  }

  response = await v3Client.listObjects({ Bucket: bucketName });
  console.log("\nResponse for empty bucket:");
  console.log(JSON.stringify(response, null, 2));

  console.log(`Putting object ${objectName} in ${bucketName}...`);
  await v3Client.putObject({
    Body: "000000",
    Bucket: bucketName,
    Key: objectName
  });

  response = await v3Client.listObjects({ Bucket: bucketName });
  console.log("\nResponse for bucket with one object:");
  console.log(JSON.stringify(response, null, 2));

  const objectName2 = `${objectName}-2`;
  console.log(`Putting object ${objectName2} in ${bucketName}...`);
  await v3Client.putObject({
    Body: "000000",
    Bucket: bucketName,
    Key: objectName2
  });

  response = await v3Client.listObjects({ Bucket: bucketName });
  console.log("\nResponse for bucket with two objects:");
  console.log(JSON.stringify(response, null, 2));

  console.log(`\nDeleting ${objectName} from ${bucketName}`);
  await v3Client.deleteObject({
    Bucket: bucketName,
    Key: objectName
  });
  console.log(`\nDeleting ${objectName2} from ${bucketName}`);
  await v3Client.deleteObject({
    Bucket: bucketName,
    Key: objectName2
  });
})();
