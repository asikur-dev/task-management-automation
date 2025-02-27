/*
  Warnings:

  - You are about to drop the column `session_id` on the `checkin_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checkin_sessions` DROP COLUMN `session_id`;

-- AlterTable
ALTER TABLE `employees` MODIFY `check_in_time` VARCHAR(191) NOT NULL,
    MODIFY `check_out_time` VARCHAR(191) NOT NULL;
