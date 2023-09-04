/*
  Warnings:

  - You are about to alter the column `appointment_date` on the `schedules` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.

*/
-- AlterTable
ALTER TABLE `schedules` MODIFY `appointment_date` DATE NOT NULL;
