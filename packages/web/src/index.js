const {
  utils: { getV2BrowserResponse, getV3BrowserResponse },
} = require("@aws-sdk/test-utils");

const getHTMLElement = (sdkVersion) => {
  const element = document.createElement("div");
  element.style.margin = "30px";

  const titleDiv = document.createElement("div");
  titleDiv.innerHTML = `JS SDK ${sdkVersion}`;

  const buttonDiv = document.createElement("button");
  buttonDiv.setAttribute("style", "margin: 10px 0px;");
  buttonDiv.innerHTML = `Call listTables with JS SDK ${sdkVersion}`;

  const contentDiv = document.createElement("textarea");
  contentDiv.rows = 20;
  contentDiv.cols = 50;
  contentDiv.innerHTML = "Response will populate here";

  element.appendChild(titleDiv);
  element.appendChild(buttonDiv);
  element.appendChild(document.createElement("br"));
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
  document.body.appendChild(getHTMLElement("v2"));
  document.body.appendChild(getHTMLElement("v3"));
})();
