const AWS = require("aws-sdk");
const { S3 } = require("@aws-sdk/client-s3");
const { REGION } = require("./config");

(async () => {
  const bucketName =
    "test-bucket-" +
    Math.random()
      .toString(36)
      .substring(2);
  const params = {
    Bucket: bucketName
  };

  const v2Client = new AWS.S3({ region: REGION });

  console.log(`Creating bucket ${params.Bucket}`);
  await v2Client.createBucket(params).promise();

  console.log(`\nWaiting for "${params.Bucket}" bucket creation`);
  await v2Client.waitFor("bucketExists", params).promise();

  console.log(`\nDeleting bucket ${params.Bucket}`);
  await v2Client.deleteBucket(params).promise();

  params.Bucket = `${bucketName}-v3`;
  const v3Client = new S3({ region: REGION });

  console.log(`\nCreating bucket ${params.Bucket}`);
  await v3Client.createBucket(params);

  console.log(`\nWaiting for "${params.Bucket}" bucket creation`);
  // Use waiters from v3, as v2 waiters are not available
  await v2Client.waitFor("bucketExists", params).promise();

  console.log(`\nDeleting bucket ${params.Bucket}`);
  await v3Client.deleteBucket(params);
})();
