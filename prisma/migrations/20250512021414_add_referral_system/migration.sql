/*
  Warnings:

  - You are about to drop the column `startDate` on the `Investment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `dailyReturn` on the `Investment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `status` column on the `Investment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `balance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `withdrawalBalance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amount` on the `WithdrawalRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "startDate",
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "dailyReturn" SET DATA TYPE INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredBy" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "referralBalance" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER,
ALTER COLUMN "withdrawalBalance" SET DEFAULT 0,
ALTER COLUMN "withdrawalBalance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "WithdrawalRequest" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- DropEnum
DROP TYPE "InvestmentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
