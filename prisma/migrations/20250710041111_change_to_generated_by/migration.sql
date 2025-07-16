/*
  Warnings:

  - You are about to drop the column `loginType` on the `refreshtoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `refreshtoken` DROP COLUMN `loginType`,
    ADD COLUMN `generatedBy` VARCHAR(191) NOT NULL DEFAULT 'local';
