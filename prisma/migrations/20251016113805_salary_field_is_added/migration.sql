/*
  Warnings:

  - You are about to drop the column `salary` on the `ScrapedJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrapedJob" DROP COLUMN "salary",
ADD COLUMN     "fixedSalary" TEXT;
