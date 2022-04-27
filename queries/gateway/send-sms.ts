import fetch from "node-fetch"; // npm install node-fetch
import util from "util";

const { GATEWAY_API_TOKEN } = process.env;

export type SMSRecipientType = {
  msisdn: number;
};

type SendSMSParamTypes = {
  sender: string;
  message: string;
  recipients: SMSRecipientType[];
};

export default async function sendSMS({
  sender,
  message,
  recipients,
}: SendSMSParamTypes) {
  if (!GATEWAY_API_TOKEN) throw new Error();

  const payload = {
    sender,
    message,
    recipients,
  };

  const apiToken = GATEWAY_API_TOKEN;
  const encodedAuth = Buffer.from(`${apiToken}:`).toString("base64");

  const response = await fetch("https://gatewayapi.com/rest/mtsms", {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Basic ${encodedAuth}`,
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await response.json();
  console.log(util.inspect(jsonResponse, { showHidden: false, depth: null }));

  if (response.ok) {
    console.log("congrats! messages are on their way!");
  } else {
    console.log("oh-no! something went wrong...");
  }
}
