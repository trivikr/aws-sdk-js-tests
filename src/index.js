const { Pinpoint } = require("@aws-sdk/client-pinpoint");
const {
  fromCognitoIdentityPool
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { REGION, IDENTITY_POOL_ID } = require("./config");

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

const componentV3 = async () => {
  const v3Client = new Pinpoint({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: REGION,
        credentials: () => Promise.resolve({})
      }),
      identityPoolId: IDENTITY_POOL_ID
    })
  });
  const response = await v3Client.createApp({
    CreateApplicationRequest: {
      Name: "TestApplication792"
    }
  });

  return getHTMLElement("Data returned:", JSON.stringify(response, null, 2));
};

(async () => {
  document.body.appendChild(await componentV3());
})();
