-- AlterTable
ALTER TABLE `refreshtoken` ADD COLUMN `loginType` VARCHAR(191) NOT NULL DEFAULT 'manual';
