/*
  Warnings:

  - You are about to drop the column `amount` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceNumber` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPackageId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userProductAccountId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_categoryId_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `amount`,
    DROP COLUMN `categoryId`,
    DROP COLUMN `date`,
    DROP COLUMN `description`,
    DROP COLUMN `type`,
    ADD COLUMN `invoiceNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentId` INTEGER NOT NULL,
    ADD COLUMN `productPackageId` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `totalPrice` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `transactionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userProductAccountId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `category`;

-- CreateTable
CREATE TABLE `product_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `product_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_product_account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `additional` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `transaction_invoiceNumber_key` ON `transaction`(`invoiceNumber`);

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `product_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_package` ADD CONSTRAINT `product_package_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_product_account` ADD CONSTRAINT `user_product_account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_product_account` ADD CONSTRAINT `user_product_account_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_productPackageId_fkey` FOREIGN KEY (`productPackageId`) REFERENCES `product_package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_userProductAccountId_fkey` FOREIGN KEY (`userProductAccountId`) REFERENCES `user_product_account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
