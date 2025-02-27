/*
  Warnings:

  - You are about to drop the column `device_info` on the `checkin_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `checkin_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `session_type` on the `checkin_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checkin_sessions` DROP COLUMN `device_info`,
    DROP COLUMN `ip_address`,
    DROP COLUMN `session_type`;

-- CreateTable
CREATE TABLE `device_info` (
    `id` VARCHAR(191) NOT NULL,
    `checkin_session_id` VARCHAR(191) NOT NULL,
    `session_type` ENUM('morning', 'evening') NOT NULL,
    `device_info` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `device_info` ADD CONSTRAINT `device_info_checkin_session_id_fkey` FOREIGN KEY (`checkin_session_id`) REFERENCES `checkin_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
