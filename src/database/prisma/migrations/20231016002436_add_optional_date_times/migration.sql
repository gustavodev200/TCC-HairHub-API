-- AlterTable
ALTER TABLE `schedules` MODIFY `attend_status_date_time` DATETIME(3) NULL,
    MODIFY `awaiting_status_date_time` DATETIME(3) NULL,
    MODIFY `confirmed_status_date_time` DATETIME(3) NULL,
    MODIFY `finished_status_date_time` DATETIME(3) NULL;
