import fetch from "node-fetch"; // npm install node-fetch
import util from "util";

const { GATEWAY_API_TOKEN } = process.env;

async function sendSMS() {
  if (!GATEWAY_API_TOKEN) throw new Error();

  const payload = {
    sender: "Trump Quote",
    message: "Whomen",
    recipients: [{ msisdn: 4745293539 }],
  };

  const apiToken = GATEWAY_API_TOKEN;
  const encodedAuth = Buffer.from(`${apiToken}:`).toString("base64");

  const resp = await fetch("https://gatewayapi.com/rest/mtsms", {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Basic ${encodedAuth}`,
      "Content-Type": "application/json",
    },
  });
  const json = await resp.json();
  console.log(util.inspect(json, { showHidden: false, depth: null }));
  if (resp.ok) {
    console.log("congrats! messages are on their way!");
  } else {
    console.log("oh-no! something went wrong...");
  }
}

sendSMS();
