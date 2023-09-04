/*
  Warnings:

  - Changed the type of `estimated_time` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `estimated_time`,
    ADD COLUMN `estimated_time` INTEGER NOT NULL;
