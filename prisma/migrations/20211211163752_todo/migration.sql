-- CreateTable
CREATE TABLE "Todos" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id")
);
