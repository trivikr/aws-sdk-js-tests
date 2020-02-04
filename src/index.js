const AWS = require("aws-sdk");
const Pinpoint = require("aws-sdk/clients/pinpoint");

const {
  PinpointClient,
  UpdateEndpointCommand
} = require("@aws-sdk/client-pinpoint");
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

const componentV2 = async () => {
  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = REGION;
  const creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
  });
  AWS.config.credentials = creds;
  const v2Client = new Pinpoint({ REGION, creds });
  const response = await v2Client
    .updateEndpoint({
      ApplicationId: "1e53bcfd862d45fc882a32cc0e20172a",
      EndpointId: "268910f3-46ea-11ea-943f-d73c2ef9bb3b",
      EndpointRequest: {}
    })
    .promise();

  return getHTMLElement(
    "Data returned by v2:",
    JSON.stringify(response, null, 2)
  );
};

const componentV3 = async () => {
  const v3Client = new PinpointClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: REGION,
        credentials: () => Promise.resolve({})
      }),
      identityPoolId: IDENTITY_POOL_ID
    })
  });
  const response = await v3Client.send(
    new UpdateEndpointCommand({
      ApplicationId: "1e53bcfd862d45fc882a32cc0e20172a",
      EndpointId: "268910f3-46ea-11ea-943f-d73c2ef9bb3b",
      EndpointRequest: {}
    })
  );

  return getHTMLElement(
    "Data returned by v3:",
    JSON.stringify(response, null, 2)
  );
};

(async () => {
  document.body.appendChild(await componentV2());
  document.body.appendChild(await componentV3());
})();
