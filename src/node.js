const { SQS } = require("@aws-sdk/client-sqs");
const { REGION } = require("./config");

(async () => {
  let response;
  const QueueNamePrefix = "test-queue-";

  const v3Client = new SQS({ region: REGION });

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nData returned by v3:");
  console.log(JSON.stringify(response, null, 2));
  if (Array.isArray(response.QueueUrls)) {
    console.log(`Deleting existing queues`);
    await Promise.all(
      response.QueueUrls.map(QueueUrl => {
        console.log(`* Deleting ${QueueUrl}`);
        return v3Client.deleteQueue({
          QueueUrl
        });
      })
    );
  }
})();
