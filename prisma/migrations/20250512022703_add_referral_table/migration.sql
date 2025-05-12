/*
  Warnings:

  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referredBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referralBalance` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referredBy_fkey";

-- DropIndex
DROP INDEX "User_referralCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralCode",
DROP COLUMN "referredBy";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "referralBalance";

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referralCode_key" ON "Referral"("referralCode");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
