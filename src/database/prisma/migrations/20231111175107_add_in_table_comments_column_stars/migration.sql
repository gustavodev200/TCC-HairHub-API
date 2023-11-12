/*
  Warnings:

  - Added the required column `star` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `star` INTEGER NOT NULL;
