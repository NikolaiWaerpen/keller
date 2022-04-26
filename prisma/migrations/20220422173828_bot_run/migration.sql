-- CreateTable
CREATE TABLE "BotRun" (
    "id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "running" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotRun_pkey" PRIMARY KEY ("id")
);
