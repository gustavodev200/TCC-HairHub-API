/*
  Warnings:

  - You are about to drop the column `appointment_date` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `end_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `appointment_date`,
    DROP COLUMN `end_time`,
    DROP COLUMN `start_time`,
    ADD COLUMN `end_date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `start_date_time` DATETIME(3) NOT NULL;
