-- AlterTable
ALTER TABLE `categories` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
