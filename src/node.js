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
  const objectNames = [
    "NameWithoutParentheses.jpg",
    "NameWith(Parentheses).jpg"
  ];

  const v2Client = new AWS.S3({ region: REGION });
  const v3Client = new S3({ region: REGION });

  console.log(`Creating bucket ${bucketName}`);
  await v3Client.createBucket(params);

  // Using v2 waiter, as v3 one is not available
  console.log(`\nWaiting for "${bucketName}" bucket creation\n`);
  await v2Client.waitFor("bucketExists", params).promise();

  for (let i = 0; i < objectNames.length; i++) {
    console.log(`Putting "${objectNames[i]}" in ${bucketName}`);
    await v3Client.putObject({
      Body: "000000",
      Bucket: bucketName,
      Key: objectNames[i]
    });
  }

  response = await v3Client.listObjects(params);
  console.log("\nlistObjects:");
  console.log(JSON.stringify(response, null, 2));
  console.log("\n");

  for (let i = 0; i < objectNames.length; i++) {
    console.log(`Deleting "${objectNames[i]}" from ${bucketName}`);
    await v3Client.deleteObject({
      Bucket: bucketName,
      Key: objectNames[i]
    });
  }

  console.log(`\nDeleting bucket ${bucketName}`);
  await v3Client.deleteBucket(params);
})();
