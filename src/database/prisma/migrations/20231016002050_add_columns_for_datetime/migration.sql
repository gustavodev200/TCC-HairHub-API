/*
  Warnings:

  - Added the required column `attend_status_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `awaiting_status_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmed_status_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finished_status_date_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedules` ADD COLUMN `attend_status_date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `awaiting_status_date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `confirmed_status_date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `finished_status_date_time` DATETIME(3) NOT NULL;
