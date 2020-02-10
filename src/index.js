const AWS = require("aws-sdk");
const { LexRuntimeService } = require("@aws-sdk/client-lex-runtime-service");
const {
  fromCognitoIdentityPool
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { REGION, IDENTITY_POOL_ID } = require("./config");

const getTextToPost = () => ({
  botAlias: "$LATEST",
  botName: "BookTrip_devoa",
  inputText: "Book My Hotel",
  userId: "random"
});

const getHTMLElement = (title, content) => {
  const element = document.createElement("div");
  element.style.margin = "30px";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = title;
  const contentDiv = document.createElement("textarea");
  contentDiv.rows = 20;
  contentDiv.cols = 50;
  contentDiv.innerHTML = content;

  element.appendChild(titleDiv);
  element.appendChild(contentDiv);

  return element;
};

const componentV2 = async () => {
  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
  });
  const v2Client = new AWS.LexRuntime();
  const response = await v2Client.postText(getTextToPost()).promise();

  return getHTMLElement(
    "Data returned by v2:",
    JSON.stringify(response, null, 2)
  );
};

const componentV3 = async () => {
  const v3Client = new LexRuntimeService({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: REGION,
        credentials: () => Promise.resolve({})
      }),
      identityPoolId: IDENTITY_POOL_ID
    })
  });
  const response = await v3Client.postText(getTextToPost());

  return getHTMLElement(
    "Data returned by v3:",
    JSON.stringify(response, null, 2)
  );
};

(async () => {
  document.body.appendChild(await componentV2());
  document.body.appendChild(await componentV3());
})();