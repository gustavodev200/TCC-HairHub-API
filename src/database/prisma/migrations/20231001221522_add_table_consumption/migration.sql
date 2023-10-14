-- AlterTable
ALTER TABLE `products` ADD COLUMN `consumption_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `consumption_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `consumptions` (
    `id` VARCHAR(191) NOT NULL,
    `payment_type` VARCHAR(191) NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `service_id` VARCHAR(191) NULL,
    `product_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `consumptions` ADD CONSTRAINT `consumptions_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumptions` ADD CONSTRAINT `consumptions_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
