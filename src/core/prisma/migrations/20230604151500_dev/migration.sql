/*
  Warnings:

  - You are about to drop the column `pics` on the `chapters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "chapters" DROP COLUMN "pics",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "sale" DROP NOT NULL,
ALTER COLUMN "sale" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
