/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[columnId,position]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `token` was added to the `Invitation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `position` on table `Issue` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "message" VARCHAR(250),
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId",
DROP COLUMN "password",
DROP COLUMN "provider",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "RefreshToken";

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_token_idx" ON "Invitation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_columnId_position_key" ON "Issue"("columnId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
