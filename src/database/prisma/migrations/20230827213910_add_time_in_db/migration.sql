-- AlterTable
ALTER TABLE `schedules` MODIFY `start_time` TIME NOT NULL,
    MODIFY `end_time` TIME NOT NULL;

-- AlterTable
ALTER TABLE `shifts` MODIFY `start_time` TIME NOT NULL,
    MODIFY `end_time` TIME NOT NULL;
