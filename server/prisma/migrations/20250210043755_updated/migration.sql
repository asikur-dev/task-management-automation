/*
  Warnings:

  - You are about to alter the column `device_info` on the `checkin_sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `checkin_sessions` MODIFY `device_info` JSON NULL;
