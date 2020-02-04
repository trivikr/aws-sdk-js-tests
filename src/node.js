const { SQS } = require("@aws-sdk/client-sqs");
const { REGION } = require("./config");

const deleteQueuesIfPresent = async (client, queueUrls) => {
  if (Array.isArray(queueUrls)) {
    console.log(`Deleting existing queues`);
    await Promise.all(
      queueUrls.map(QueueUrl => {
        console.log(`* Deleting ${QueueUrl}`);
        return client.deleteQueue({
          QueueUrl
        });
      })
    );
  }
};

const getRandomString = () =>
  Math.random()
    .toString(36)
    .substring(2);

(async () => {
  let response;
  const QueueNamePrefix = "test-queue-";

  const v3Client = new SQS({ region: REGION });

  response = await v3Client.listQueues({ QueueNamePrefix });
  await deleteQueuesIfPresent(v3Client, response.QueueUrls);

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nlistQueues outout with zero results:");
  console.log(JSON.stringify(response, null, 2));

  await v3Client.createQueue({
    QueueName: `${QueueNamePrefix}${getRandomString()}`
  });

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nlistQueues outout with one result:");
  console.log(JSON.stringify(response, null, 2));

  await v3Client.createQueue({
    QueueName: `${QueueNamePrefix}${getRandomString()}`
  });

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nlistQueues outout with two results:");
  console.log(JSON.stringify(response, null, 2));

  await deleteQueuesIfPresent(v3Client, response.QueueUrls);
})();
