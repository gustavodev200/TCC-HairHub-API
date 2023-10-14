/*
  Warnings:

  - You are about to drop the column `product_id` on the `consumptions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `consumptions` DROP FOREIGN KEY `consumptions_product_id_fkey`;

-- AlterTable
ALTER TABLE `consumptions` DROP COLUMN `product_id`;

-- CreateTable
CREATE TABLE `_ConsumptionToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ConsumptionToProduct_AB_unique`(`A`, `B`),
    INDEX `_ConsumptionToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ConsumptionToProduct` ADD CONSTRAINT `_ConsumptionToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `consumptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConsumptionToProduct` ADD CONSTRAINT `_ConsumptionToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
