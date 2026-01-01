/*
  Warnings:

  - Made the column `eventId` on table `SotEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SotEvent" ALTER COLUMN "eventId" SET NOT NULL;
