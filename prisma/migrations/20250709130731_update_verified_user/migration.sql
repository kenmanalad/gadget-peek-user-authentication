-- AlterTable
ALTER TABLE `verifieduser` MODIFY `password` VARCHAR(191) NULL,
    MODIFY `userType` VARCHAR(191) NOT NULL DEFAULT 'buyer';
