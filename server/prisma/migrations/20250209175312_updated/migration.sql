/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `deviceInfo` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `emailSendingTime` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `fillTimeSeconds` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionDate` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionEndTime` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionStartTime` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionType` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CheckinSession` table. All the data in the column will be lost.
  - You are about to drop the column `adminEmail` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `colorScheme` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlan` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `checkinSessionId` on the `ConversationMessage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ConversationMessage` table. All the data in the column will be lost.
  - You are about to drop the column `messageContent` on the `ConversationMessage` table. All the data in the column will be lost.
  - You are about to drop the column `checkInTime` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutTime` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EmployeeLeave` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `EmployeeLeave` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `EmployeeLeave` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `EmployeeLeave` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `NonWorkingDay` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NonWorkingDay` table. All the data in the column will be lost.
  - You are about to drop the column `dateValue` on the `NonWorkingDay` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `NonWorkingDay` table. All the data in the column will be lost.
  - You are about to drop the column `checkinSessionId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `taskDetails` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `taskTitle` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_id` to the `CheckinSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_date` to the `CheckinSession` table without a default value. This is not possible if the table is not empty.
  - The required column `session_id` was added to the `CheckinSession` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `session_type` to the `CheckinSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CheckinSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkin_session_id` to the `ConversationMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_content` to the `ConversationMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_in_time` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out_time` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manager_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_zone` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `EmployeeLeave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `EmployeeLeave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `EmployeeLeave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `NonWorkingDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkin_session_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_title` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CheckinSession` DROP FOREIGN KEY `CheckinSession_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `ConversationMessage` DROP FOREIGN KEY `ConversationMessage_checkinSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `EmployeeLeave` DROP FOREIGN KEY `EmployeeLeave_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `Manager` DROP FOREIGN KEY `Manager_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `NonWorkingDay` DROP FOREIGN KEY `NonWorkingDay_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_checkinSessionId_fkey`;

-- DropIndex
DROP INDEX `CheckinSession_employeeId_fkey` ON `CheckinSession`;

-- DropIndex
DROP INDEX `CheckinSession_sessionId_key` ON `CheckinSession`;

-- DropIndex
DROP INDEX `Company_adminEmail_key` ON `Company`;

-- DropIndex
DROP INDEX `Company_companyName_key` ON `Company`;

-- DropIndex
DROP INDEX `ConversationMessage_checkinSessionId_fkey` ON `ConversationMessage`;

-- DropIndex
DROP INDEX `Employee_managerId_fkey` ON `Employee`;

-- DropIndex
DROP INDEX `EmployeeLeave_employeeId_fkey` ON `EmployeeLeave`;

-- DropIndex
DROP INDEX `Manager_companyId_fkey` ON `Manager`;

-- DropIndex
DROP INDEX `NonWorkingDay_companyId_fkey` ON `NonWorkingDay`;

-- DropIndex
DROP INDEX `Task_checkinSessionId_fkey` ON `Task`;

-- AlterTable
ALTER TABLE `CheckinSession` DROP COLUMN `createdAt`,
    DROP COLUMN `deviceInfo`,
    DROP COLUMN `emailSendingTime`,
    DROP COLUMN `employeeId`,
    DROP COLUMN `fillTimeSeconds`,
    DROP COLUMN `ipAddress`,
    DROP COLUMN `sessionDate`,
    DROP COLUMN `sessionEndTime`,
    DROP COLUMN `sessionId`,
    DROP COLUMN `sessionStartTime`,
    DROP COLUMN `sessionType`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `device_info` VARCHAR(191) NULL,
    ADD COLUMN `email_sending_time` DATETIME(3) NULL,
    ADD COLUMN `employee_id` INTEGER NOT NULL,
    ADD COLUMN `fill_time_seconds` INTEGER NULL,
    ADD COLUMN `ip_address` VARCHAR(191) NULL,
    ADD COLUMN `session_date` DATETIME(3) NOT NULL,
    ADD COLUMN `session_end_time` DATETIME(3) NULL,
    ADD COLUMN `session_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `session_start_time` DATETIME(3) NULL,
    ADD COLUMN `session_type` ENUM('morning', 'evening') NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Company` DROP COLUMN `adminEmail`,
    DROP COLUMN `colorScheme`,
    DROP COLUMN `companyName`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `logoUrl`,
    DROP COLUMN `passwordHash`,
    DROP COLUMN `subscriptionPlan`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `admin_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `color_scheme` VARCHAR(191) NULL,
    ADD COLUMN `company_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `logo_url` VARCHAR(191) NULL,
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscription_plan` VARCHAR(191) NOT NULL DEFAULT 'Free',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ConversationMessage` DROP COLUMN `checkinSessionId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `messageContent`,
    ADD COLUMN `checkin_session_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `message_content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `checkInTime`,
    DROP COLUMN `checkOutTime`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `managerId`,
    DROP COLUMN `timeZone`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `check_in_time` DATETIME(3) NOT NULL,
    ADD COLUMN `check_out_time` DATETIME(3) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `manager_id` INTEGER NOT NULL,
    ADD COLUMN `time_zone` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `EmployeeLeave` DROP COLUMN `createdAt`,
    DROP COLUMN `employeeId`,
    DROP COLUMN `endDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `employee_id` INTEGER NOT NULL,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Manager` DROP COLUMN `companyId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `isActive`,
    DROP COLUMN `passwordHash`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `company_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `NonWorkingDay` DROP COLUMN `companyId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `dateValue`,
    DROP COLUMN `dayOfWeek`,
    ADD COLUMN `company_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `date_value` DATETIME(3) NULL,
    ADD COLUMN `day_of_week` INTEGER NULL;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `checkinSessionId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `taskDetails`,
    DROP COLUMN `taskTitle`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `checkin_session_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `task_details` VARCHAR(191) NULL,
    ADD COLUMN `task_title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_admin_email_key` ON `Company`(`admin_email`);

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `Manager`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NonWorkingDay` ADD CONSTRAINT `NonWorkingDay_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeLeave` ADD CONSTRAINT `EmployeeLeave_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CheckinSession` ADD CONSTRAINT `CheckinSession_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_checkin_session_id_fkey` FOREIGN KEY (`checkin_session_id`) REFERENCES `CheckinSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationMessage` ADD CONSTRAINT `ConversationMessage_checkin_session_id_fkey` FOREIGN KEY (`checkin_session_id`) REFERENCES `CheckinSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
