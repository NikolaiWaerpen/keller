import sleep from "./utils/sleep";

async function dummyCalcifer() {
  console.log("I am dummy calcifer");
  await sleep(20000);
  console.log("I finished running");
}

dummyCalcifer();
