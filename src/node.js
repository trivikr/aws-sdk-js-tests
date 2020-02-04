const { SQS } = require("@aws-sdk/client-sqs");
const { REGION } = require("./config");

const { promisify } = require("util");
const sleep = promisify(setTimeout);

const waitForQueueExists = async (client, createdQueueUrl) => {
  let queueExists = false;
  while (!queueExists) {
    const response = await client.listQueues({});
    const queueUrls = response.QueueUrls;
    if (Array.isArray(queueUrls)) {
      queueUrls.forEach(queueUrl => {
        if (queueUrl === createdQueueUrl) {
          queueExists = true;
        }
      });
    }
    await sleep(5000);
  }
};

const waitForQueueNotExists = async (client, deletedQueueUrl) => {
  console.log(`Deleted queueUrl: ${deletedQueueUrl}\n`);
  let queueExists = true;
  while (queueExists) {
    const response = await client.listQueues({});
    console.log(JSON.stringify(response, null, 2));
    const queueUrls = response.QueueUrls;
    if (Array.isArray(queueUrls)) {
      queueExists = false;
      queueUrls.forEach(queueUrl => {
        console.log(`Received queueUrl: ${queueUrl}`);
        if (queueUrl === deletedQueueUrl) {
          queueExists = true;
        }
      });
    } else {
      queueExists = false;
    }
    await sleep(5000);
  }
};

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
    for (let i = 0; i < queueUrls.length; i++) {
      await waitForQueueNotExists(client, queueUrls[i]);
    }
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

  response = await v3Client.createQueue({
    QueueName: `${QueueNamePrefix}${getRandomString()}`
  });
  await waitForQueueExists(v3Client, response.QueueUrl);

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nlistQueues outout with one result:");
  console.log(JSON.stringify(response, null, 2));

  await v3Client.createQueue({
    QueueName: `${QueueNamePrefix}${getRandomString()}`
  });
  await waitForQueueExists(v3Client, response.QueueUrl);

  // Waiter not present in SQS, wait for 10 seconds for operation
  console.log(`\nAwaiting 10 seconds for creation`);
  await sleep(10000);

  response = await v3Client.listQueues({ QueueNamePrefix });
  console.log("\nlistQueues outout with two results:");
  console.log(JSON.stringify(response, null, 2));

  // await deleteQueuesIfPresent(v3Client, response.QueueUrls);
})();
