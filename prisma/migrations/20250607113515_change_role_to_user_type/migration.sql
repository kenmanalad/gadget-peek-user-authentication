/*
  Warnings:

  - You are about to drop the column `role` on the `UnverifiedUser` table. All the data in the column will be lost.
  - Added the required column `userType` to the `UnverifiedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UnverifiedUser` DROP COLUMN `role`,
    ADD COLUMN `userType` VARCHAR(191) NOT NULL;
