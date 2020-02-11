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
  const prefix = "test-";
  const suffix = ".jpg";

  // Refs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
  const rfc3986ExtendedChars = "!'()*";

  const v2Client = new AWS.S3({ region: REGION });
  const v3Client = new S3({ region: REGION });

  console.log(`Creating bucket ${bucketName}`);
  await v3Client.createBucket(params);

  // Using v2 waiter, as v3 one is not available
  console.log(`\nWaiting for "${bucketName}" bucket creation\n`);
  await v2Client.waitFor("bucketExists", params).promise();

  for (let i = 0; i < rfc3986ExtendedChars.length; i++) {
    const Key = `${prefix}${rfc3986ExtendedChars.charAt(i)}${suffix}`;
    console.log(`Putting "${Key}" in ${bucketName}`);
    try {
      await v3Client.putObject({
        Body: "000000",
        Bucket: bucketName,
        Key
      });
    } catch (e) {
      console.log(`PutObject "${Key}" failed...`);
    }
  }

  response = await v3Client.listObjects(params);
  console.log("\nlistObjects:");
  console.log(JSON.stringify(response, null, 2));
  console.log("\n");

  if (response.Contents) {
    for (let i = 0; i < response.Contents.length; i++) {
      const { Key } = response.Contents[i];
      console.log(`Deleting "${Key}" from ${bucketName}`);
      await v3Client.deleteObject({
        Bucket: bucketName,
        Key
      });
    }
  }

  console.log(`\nDeleting bucket ${bucketName}`);
  await v3Client.deleteBucket(params);
})();
