const {
  utils: { getV2BrowserResponse, getV3BrowserResponse },
} = require("@aws-sdk/test-utils");

const getHTMLElement = (sdkVersion, content) => {
  const element = document.createElement("div");
  element.style.margin = "30px";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `JS SDK ${sdkVersion}`;
  const buttonDiv = document.createElement("button");
  buttonDiv.innerHTML = `Call listTables with JS SDK ${sdkVersion}`;
  const contentDiv = document.createElement("textarea");
  contentDiv.rows = 20;
  contentDiv.cols = 50;
  contentDiv.innerHTML = content;

  element.appendChild(titleDiv);
  element.appendChild(buttonDiv);
  element.appendChild(contentDiv);

  return element;
};

const componentV2 = async () => {
  const response = await getV2BrowserResponse();
  return getHTMLElement("v2", JSON.stringify(response, null, 2));
};

const componentV3 = async () => {
  const response = await getV3BrowserResponse();
  return getHTMLElement("v3", JSON.stringify(response, null, 2));
};

(async () => {
  document.body.appendChild(await componentV2());
  document.body.appendChild(await componentV3());
})();
