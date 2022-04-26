import { spawn } from "child_process";
import { extendType, inputObjectType, objectType } from "nexus";
import { AssetEvent } from "../types/bot/event-type";
import sleep from "../utils/sleep";

type GroupedEventsType = { sell: AssetEvent[]; buy: AssetEvent[] };

export const runBotObjectType = objectType({
  name: "RunBot",
  definition(t) {
    t.nonNull.boolean("running");
  },
});

export const runBot = inputObjectType({
  name: "RunBotInput",
  definition: (t) => {
    t.nonNull.boolean("run");
  },
});

const longArray = new Array(20);

export const runBotMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("runBot", {
      type: runBotObjectType.name,
      resolve: async (_, __, { prisma, user }) => {
        // CHECK IF USER IS NIKOLAI
        const dummyCalcifer = spawn("npx", ["tsnd", "dummy-calcifer.ts"]);

        const pid = dummyCalcifer.pid;

        if (!pid) throw new Error("No PID");

        console.log(pid);

        await prisma.botRun.create({
          data: {
            pid,
          },
        });

        dummyCalcifer.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });

        dummyCalcifer.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        dummyCalcifer.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
        });

        return {
          running: true,
        };
      },
    });
    t.field("killBot", {
      type: runBotObjectType.name,
      resolve: async (_, __, { prisma, user }) => {
        // CHECK IF USER IS NIKOLAI

        const lastRun = await prisma.botRun.findFirst();

        if (!lastRun) throw new Error("no process running");

        console.log(`kill -15 ${lastRun.pid}`);

        spawn("kill", ["-15", `${lastRun.pid}`]);

        return {
          running: false,
        };
      },
    });
  },
});
