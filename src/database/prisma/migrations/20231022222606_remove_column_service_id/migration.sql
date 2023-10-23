/*
  Warnings:

  - You are about to drop the column `service_id` on the `consumptions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `consumptions_service_id_fkey` ON `consumptions`;

-- AlterTable
ALTER TABLE `consumptions` DROP COLUMN `service_id`;
