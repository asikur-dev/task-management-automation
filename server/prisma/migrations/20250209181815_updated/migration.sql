/*
  Warnings:

  - The primary key for the `CheckinSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ConversationMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EmployeeLeave` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `NonWorkingDay` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `CheckinSession` DROP FOREIGN KEY `CheckinSession_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `ConversationMessage` DROP FOREIGN KEY `ConversationMessage_checkin_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `EmployeeLeave` DROP FOREIGN KEY `EmployeeLeave_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `Manager` DROP FOREIGN KEY `Manager_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `NonWorkingDay` DROP FOREIGN KEY `NonWorkingDay_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_checkin_session_id_fkey`;

-- DropIndex
DROP INDEX `CheckinSession_employee_id_fkey` ON `CheckinSession`;

-- DropIndex
DROP INDEX `ConversationMessage_checkin_session_id_fkey` ON `ConversationMessage`;

-- DropIndex
DROP INDEX `Employee_manager_id_fkey` ON `Employee`;

-- DropIndex
DROP INDEX `EmployeeLeave_employee_id_fkey` ON `EmployeeLeave`;

-- DropIndex
DROP INDEX `Manager_company_id_fkey` ON `Manager`;

-- DropIndex
DROP INDEX `NonWorkingDay_company_id_fkey` ON `NonWorkingDay`;

-- DropIndex
DROP INDEX `Task_checkin_session_id_fkey` ON `Task`;

-- AlterTable
ALTER TABLE `CheckinSession` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `employee_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Company` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ConversationMessage` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `checkin_session_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Employee` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `manager_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `EmployeeLeave` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `employee_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Manager` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `company_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `NonWorkingDay` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `company_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Task` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `checkin_session_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

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
