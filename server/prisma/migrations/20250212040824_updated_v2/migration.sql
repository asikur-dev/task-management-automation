-- AlterTable
ALTER TABLE `checkin_sessions` ADD COLUMN `session_type` ENUM('morning', 'evening') NULL;
