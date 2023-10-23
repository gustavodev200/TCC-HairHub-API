/*
  Warnings:

  - You are about to drop the `_consumptiontoproduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_consumptiontoproduct` DROP FOREIGN KEY `_ConsumptionToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_consumptiontoproduct` DROP FOREIGN KEY `_ConsumptionToProduct_B_fkey`;

-- DropTable
DROP TABLE `_consumptiontoproduct`;

-- CreateTable
CREATE TABLE `products_consumption` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `consumption_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_consumption` ADD CONSTRAINT `products_consumption_consumption_id_fkey` FOREIGN KEY (`consumption_id`) REFERENCES `consumptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
