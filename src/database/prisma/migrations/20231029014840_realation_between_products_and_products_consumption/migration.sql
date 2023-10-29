/*
  Warnings:

  - You are about to drop the column `name` on the `products_consumption` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products_consumption` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `products_consumption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `consumptions` MODIFY `payment_type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products_consumption` DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `products_consumption` ADD CONSTRAINT `products_consumption_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
