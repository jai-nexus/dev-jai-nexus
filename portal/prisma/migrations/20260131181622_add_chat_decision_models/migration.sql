-- AlterTable
ALTER TABLE "SotEvent" ADD COLUMN     "chatId" INTEGER;

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "chatDate" TIMESTAMP(3) NOT NULL,
    "filepath" TEXT,
    "contentHash" TEXT,
    "fullText" TEXT NOT NULL,
    "model" TEXT,
    "nhId" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" JSONB,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "context" TEXT,
    "chatId" INTEGER NOT NULL,
    "lineNumber" INTEGER,
    "decisionDate" TIMESTAMP(3),
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "nhId" TEXT NOT NULL DEFAULT '',
    "supersededById" INTEGER,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatId_key" ON "Chat"("chatId");

-- CreateIndex
CREATE INDEX "Chat_chatDate_idx" ON "Chat"("chatDate");

-- CreateIndex
CREATE INDEX "Chat_source_idx" ON "Chat"("source");

-- CreateIndex
CREATE INDEX "Chat_nhId_idx" ON "Chat"("nhId");

-- CreateIndex
CREATE INDEX "Chat_chatId_idx" ON "Chat"("chatId");

-- CreateIndex
CREATE INDEX "Decision_chatId_idx" ON "Decision"("chatId");

-- CreateIndex
CREATE INDEX "Decision_status_idx" ON "Decision"("status");

-- CreateIndex
CREATE INDEX "Decision_category_idx" ON "Decision"("category");

-- CreateIndex
CREATE INDEX "Decision_decisionDate_idx" ON "Decision"("decisionDate");

-- AddForeignKey
ALTER TABLE "SotEvent" ADD CONSTRAINT "SotEvent_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
