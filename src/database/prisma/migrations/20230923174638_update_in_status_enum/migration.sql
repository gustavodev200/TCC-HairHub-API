-- AlterTable
ALTER TABLE `schedules` MODIFY `schedule_status` ENUM('scheduled', 'confirmed', 'awaiting_service', 'attend', 'finished', 'canceled') NOT NULL DEFAULT 'scheduled';
