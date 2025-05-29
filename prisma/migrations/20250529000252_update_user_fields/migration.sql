/*
  Warnings:

  - Added the required column `date_of_birth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `date_of_birth` DATETIME(3) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL;
