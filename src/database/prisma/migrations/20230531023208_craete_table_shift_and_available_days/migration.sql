-- CreateTable
CREATE TABLE `shifts` (
    `id` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `employee_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `days_available` (
    `id` VARCHAR(191) NOT NULL,
    `day` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AvailableDaysToShift` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AvailableDaysToShift_AB_unique`(`A`, `B`),
    INDEX `_AvailableDaysToShift_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shifts` ADD CONSTRAINT `shifts_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AvailableDaysToShift` ADD CONSTRAINT `_AvailableDaysToShift_A_fkey` FOREIGN KEY (`A`) REFERENCES `days_available`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AvailableDaysToShift` ADD CONSTRAINT `_AvailableDaysToShift_B_fkey` FOREIGN KEY (`B`) REFERENCES `shifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
