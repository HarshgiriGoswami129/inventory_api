-- =======================================================
-- Database Migration: undo_actions Table
-- Description: Stores action history for safe enterprise undo rollbacks
-- =======================================================

CREATE TABLE IF NOT EXISTS `undo_actions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_name` VARCHAR(100) NULL,
  `module` VARCHAR(50) NOT NULL,
  `action_type` VARCHAR(50) NOT NULL,
  `record_id` INT NULL,
  `record_identifier` VARCHAR(255) NULL,
  `description` VARCHAR(255) NOT NULL,
  `action_data` LONGTEXT NULL,
  `status` ENUM('ACTIVE', 'UNDONE', 'FAILED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `undone_at` TIMESTAMP NULL,
  INDEX `idx_user_created` (`user_id`, `created_at`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
