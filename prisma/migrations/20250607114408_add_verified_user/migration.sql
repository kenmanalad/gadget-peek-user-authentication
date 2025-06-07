-- CreateTable
CREATE TABLE `VerifiedUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emailAddress` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userType` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VerifiedUser_emailAddress_key`(`emailAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
