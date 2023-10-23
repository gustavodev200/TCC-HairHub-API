-- DropForeignKey
ALTER TABLE `consumptions` DROP FOREIGN KEY `consumptions_service_id_fkey`;

-- CreateTable
CREATE TABLE `_ConsumptionToService` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ConsumptionToService_AB_unique`(`A`, `B`),
    INDEX `_ConsumptionToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ConsumptionToService` ADD CONSTRAINT `_ConsumptionToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `consumptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConsumptionToService` ADD CONSTRAINT `_ConsumptionToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
