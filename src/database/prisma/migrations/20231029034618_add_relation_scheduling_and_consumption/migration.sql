/*
  Warnings:

  - A unique constraint covering the columns `[scheduling_id]` on the table `consumptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduling_id` to the `consumptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `consumptions` ADD COLUMN `scheduling_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `consumptions_scheduling_id_key` ON `consumptions`(`scheduling_id`);

-- AddForeignKey
ALTER TABLE `consumptions` ADD CONSTRAINT `consumptions_scheduling_id_fkey` FOREIGN KEY (`scheduling_id`) REFERENCES `schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
