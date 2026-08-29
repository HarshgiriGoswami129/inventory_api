-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2026 at 08:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `code` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `account_name`, `balance`, `code`, `created_by`, `created_at`, `updated_at`) VALUES
(5, 'NO_1', 172820.04, 'ICI-02', 18, '2025-10-23 20:50:38', '2026-05-11 15:34:58'),
(7, 'NO_2', -16928.67, 'ICI-03', 18, '2025-11-04 20:05:54', '2026-05-11 15:34:30');

-- --------------------------------------------------------

--
-- Table structure for table `account_history`
--

CREATE TABLE `account_history` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `transaction_type` enum('CREDIT','DEBIT') NOT NULL COMMENT 'CREDIT = Receipt (money added), DEBIT = Payment (money subtracted)',
  `amount` decimal(15,2) NOT NULL,
  `contact_id` int(11) DEFAULT NULL COMMENT 'ID from contacts table (customer or supplier)',
  `contact_name` varchar(255) DEFAULT NULL COMMENT 'Name of customer/supplier for easy display',
  `contact_type` varchar(50) DEFAULT NULL COMMENT 'Customer or Supplier',
  `date` date NOT NULL,
  `description` text DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `receipt_id` int(11) DEFAULT NULL COMMENT 'Link to receipts table if transaction is from receipt',
  `payment_id` int(11) DEFAULT NULL COMMENT 'Link to payments table if transaction is from payment',
  `balance_after` decimal(15,2) DEFAULT NULL COMMENT 'Account balance after this transaction',
  `user_id` int(11) DEFAULT NULL COMMENT 'User who created the transaction',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_history`
--

INSERT INTO `account_history` (`id`, `account_id`, `transaction_type`, `amount`, `contact_id`, `contact_name`, `contact_type`, `date`, `description`, `reference`, `receipt_id`, `payment_id`, `balance_after`, `user_id`, `created_at`, `updated_at`) VALUES
(4, 7, 'DEBIT', 66565.00, NULL, 'SHIV', 'Supplier', '2025-12-30', '6546546', NULL, NULL, 2, -66115.00, 18, '2025-12-29 19:22:48', '2025-12-29 19:22:48'),
(5, 5, 'DEBIT', 50000.00, 64, 'KHUS', 'Supplier', '2026-03-10', 'Payment for Invoice 541', NULL, NULL, NULL, -48770.00, 18, '2026-03-10 05:47:49', '2026-03-10 05:47:49'),
(7, 7, 'CREDIT', 100000.00, NULL, 'Karan der', 'Customer', '2026-05-11', '5000', NULL, NULL, NULL, 33435.00, 18, '2026-05-11 15:27:34', '2026-05-11 15:27:34'),
(8, 7, 'CREDIT', 99066.67, NULL, 'Karan der', 'Customer', '2026-05-11', '54654654', NULL, NULL, NULL, 132501.67, 18, '2026-05-11 15:28:29', '2026-05-11 15:28:29'),
(9, 5, 'CREDIT', 198133.34, NULL, 'Karan der', 'Customer', '2026-05-11', NULL, NULL, NULL, NULL, 149363.34, 18, '2026-05-11 15:29:24', '2026-05-11 15:29:24'),
(10, 7, 'CREDIT', -199430.34, NULL, 'Karan der', 'Customer', '2026-05-11', '	-199430.34', NULL, NULL, NULL, -66928.67, 18, '2026-05-11 15:30:49', '2026-05-11 15:30:49'),
(11, 7, 'CREDIT', 50000.00, NULL, 'Karan der', 'Customer', '2026-05-11', '5121', NULL, NULL, NULL, -16928.67, 18, '2026-05-11 15:34:30', '2026-05-11 15:34:30'),
(12, 5, 'CREDIT', 23456.70, NULL, 'Karan der', 'Customer', '2026-05-11', NULL, NULL, NULL, NULL, 172820.04, 18, '2026-05-11 15:34:58', '2026-05-11 15:34:58');

-- --------------------------------------------------------

--
-- Table structure for table `box_inventory`
--

CREATE TABLE `box_inventory` (
  `id` int(11) NOT NULL,
  `box_name` varchar(255) NOT NULL,
  `box_quantity` decimal(12,4) DEFAULT 0.0000,
  `box_wt` decimal(10,4) DEFAULT 0.0000,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `box_inventory`
--

INSERT INTO `box_inventory` (`id`, `box_name`, `box_quantity`, `box_wt`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'BX001', 755.0000, 0.0510, NULL, '2026-08-27 06:45:47', '2026-08-29 06:36:48'),
(2, 'BX', 45.0000, 0.0051, NULL, '2026-08-27 06:47:04', '2026-08-27 06:47:04');

-- --------------------------------------------------------

--
-- Table structure for table `carton_inventory`
--

CREATE TABLE `carton_inventory` (
  `id` int(11) NOT NULL,
  `carton_name` varchar(255) NOT NULL,
  `carton_quantity` int(11) NOT NULL DEFAULT 0,
  `ctn_wt` decimal(10,2) DEFAULT 0.00,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carton_inventory`
--

INSERT INTO `carton_inventory` (`id`, `carton_name`, `carton_quantity`, `ctn_wt`, `created_by`) VALUES
(5, 'CTN', 193, 0.00, 18),
(8, 'CTN A', 198, 0.00, 18),
(9, 'CTN 1', 199, 0.00, 18),
(10, 'CTNDEMO', 14, 0.50, 18);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `type` enum('Customer','Supplier','Other') NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `code` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `contact_name`, `type`, `created_by`, `created_at`, `updated_at`, `code`, `email`, `image_url`, `address`, `updated_by`) VALUES
(63, 'AKSH', 'Supplier', 18, '2025-12-14 10:04:11', '2025-12-14 10:04:11', 'AKSH', '', NULL, '', NULL),
(64, 'KHUS', 'Supplier', 18, '2025-12-14 10:04:28', '2025-12-14 10:04:28', 'KHUS', '', NULL, '', NULL),
(65, 'TISA', 'Supplier', 18, '2025-12-14 10:04:50', '2025-12-14 10:04:50', 'TISA', '', NULL, '', NULL),
(68, 'DEEP', 'Supplier', 18, '2025-12-14 10:16:30', '2025-12-14 10:16:30', 'DEEP', '', NULL, '', NULL),
(72, 'Karan der', 'Customer', 18, '2026-05-11 15:38:25', '2026-05-11 15:38:25', 'DER5', 'derkaran359@gmail.com', NULL, 'NEAR RAVI PROVISION STORE', NULL),
(73, 'WSESTOYTF', 'Customer', 18, '2026-08-06 04:27:49', '2026-08-06 04:27:49', 'WSESTOYTF', 'derkaran359@gmail.com', NULL, 'NEAR RAVI PROVISION STORE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_details`
--

CREATE TABLE `customer_details` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `credit_period` varchar(50) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `pan` varchar(10) DEFAULT NULL,
  `place_of_supply` varchar(100) DEFAULT NULL,
  `reverse_charge` varchar(10) DEFAULT NULL,
  `type_of_registration` varchar(100) DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `order_follow_up` text DEFAULT NULL,
  `no_1` decimal(10,2) DEFAULT NULL,
  `no_2` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_details`
--

INSERT INTO `customer_details` (`id`, `contact_id`, `credit_period`, `billing_address`, `delivery_address`, `gstin`, `pan`, `place_of_supply`, `reverse_charge`, `type_of_registration`, `total_amount`, `notes`, `payment`, `date`, `order_follow_up`, `no_1`, `no_2`) VALUES
(19, 72, '10', 'NEAR RAVI PROVISION STORE', 'NILKAMAL SOCIETY STREET 6', '', '', '', 'No', 'Regular', 26101.05, NULL, NULL, NULL, NULL, 6726.05, 19375.00),
(20, 73, '45', 'NEAR RAVI PROVISION STORE', 'NILKAMAL SOCIETY STREET 6', '22ABCDE1234F1Z5', '', '', 'No', 'Regular', 345937.50, NULL, NULL, NULL, NULL, 345932.50, 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `document_photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `daily_salary` decimal(10,2) NOT NULL COMMENT 'Fixed pay for a standard 10-hour day',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `age`, `gender`, `mobile`, `profile_photo`, `document_photos`, `daily_salary`, `created_at`) VALUES
(10, 'ASAD', 22, 'Female', '11111 11100', NULL, NULL, 350.00, '2025-12-14 09:57:44');

-- --------------------------------------------------------

--
-- Table structure for table `employee_advances`
--

CREATE TABLE `employee_advances` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL COMMENT 'Original advance amount given',
  `remaining_balance` decimal(15,2) NOT NULL COMMENT 'Amount still pending repayment',
  `reason` varchar(255) DEFAULT NULL COMMENT 'Reason for advance (e.g., emergency, personal)',
  `date` date NOT NULL COMMENT 'Date when advance was given',
  `status` enum('PENDING','PARTIAL','PAID') DEFAULT 'PENDING' COMMENT 'PENDING=No repayment, PARTIAL=Some repaid, PAID=Fully repaid',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_advances`
--

INSERT INTO `employee_advances` (`id`, `employee_id`, `amount`, `remaining_balance`, `reason`, `date`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 10, 500.00, 150.00, 'xyz', '2025-12-16', 'PARTIAL', 18, '2025-12-16 19:20:18', '2025-12-16 19:49:19'),
(2, 10, 500.00, 500.00, '132', '2025-12-16', 'PENDING', 18, '2025-12-16 19:49:08', '2025-12-16 19:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `employee_advance_repayments`
--

CREATE TABLE `employee_advance_repayments` (
  `id` int(11) NOT NULL,
  `advance_id` int(11) NOT NULL COMMENT 'Link to employee_advances table',
  `employee_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL COMMENT 'Amount repaid in this transaction',
  `date` date NOT NULL COMMENT 'Date of repayment',
  `notes` varchar(255) DEFAULT NULL COMMENT 'Additional notes for repayment',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_advance_repayments`
--

INSERT INTO `employee_advance_repayments` (`id`, `advance_id`, `employee_id`, `amount`, `date`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 10, 200.00, '2025-12-16', 'xyz', 18, '2025-12-16 19:34:45'),
(2, 1, 10, 150.00, '2025-12-16', '356', 18, '2025-12-16 19:49:19');

-- --------------------------------------------------------

--
-- Stand-in structure for view `employee_advance_summary`
-- (See below for the actual view)
--
CREATE TABLE `employee_advance_summary` (
`employee_id` int(11)
,`employee_name` varchar(255)
,`total_advances` bigint(21)
,`pending_amount` decimal(37,2)
,`total_remaining_balance` decimal(37,2)
,`total_repaid` decimal(37,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `employee_weekly_salary`
--

CREATE TABLE `employee_weekly_salary` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `week_start_date` date NOT NULL,
  `week_end_date` date NOT NULL,
  `mon_days` decimal(3,1) DEFAULT 0.0,
  `mon_ot` decimal(5,2) DEFAULT 0.00,
  `tue_days` decimal(3,1) DEFAULT 0.0,
  `tue_ot` decimal(5,2) DEFAULT 0.00,
  `wed_days` decimal(3,1) DEFAULT 0.0,
  `wed_ot` decimal(5,2) DEFAULT 0.00,
  `thu_days` decimal(3,1) DEFAULT 0.0,
  `thu_ot` decimal(5,2) DEFAULT 0.00,
  `fri_days` decimal(3,1) DEFAULT 0.0,
  `fri_ot` decimal(5,2) DEFAULT 0.00,
  `sat_days` decimal(3,1) DEFAULT 0.0,
  `sat_ot` decimal(5,2) DEFAULT 0.00,
  `sun_days` decimal(3,1) DEFAULT 0.0,
  `sun_ot` decimal(5,2) DEFAULT 0.00,
  `total_days` decimal(4,1) DEFAULT 0.0,
  `total_ot` decimal(6,2) DEFAULT 0.00,
  `total_salary` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_weekly_salary`
--

INSERT INTO `employee_weekly_salary` (`id`, `employee_id`, `employee_name`, `week_start_date`, `week_end_date`, `mon_days`, `mon_ot`, `tue_days`, `tue_ot`, `wed_days`, `wed_ot`, `thu_days`, `thu_ot`, `fri_days`, `fri_ot`, `sat_days`, `sat_ot`, `sun_days`, `sun_ot`, `total_days`, `total_ot`, `total_salary`, `created_at`, `updated_at`) VALUES
(16, NULL, 'RAJ ghaadiya', '2025-12-08', '2025-12-14', 1.0, 0.00, 1.0, 1.00, 1.0, 3.00, 1.0, -2.00, 0.0, 0.00, 1.0, 0.00, 1.0, -3.00, 6.0, -1.00, 2950.00, '2025-12-14 09:56:49', '2025-12-18 17:49:34'),
(18, 10, 'ASAD', '2025-12-08', '2025-12-14', 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.0, 0.00, 0.00, '2025-12-14 09:57:51', '2025-12-18 17:49:34');

-- --------------------------------------------------------

--
-- Table structure for table `employee_work_records`
--

CREATE TABLE `employee_work_records` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `working_hours` decimal(4,2) NOT NULL,
  `overtime_hours` decimal(4,2) DEFAULT 0.00,
  `daily_salary_paid` decimal(10,2) NOT NULL COMMENT 'Calculated gross pay for the day',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finishes_table`
--

CREATE TABLE `finishes_table` (
  `id` int(11) NOT NULL,
  `finish` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finishes_table`
--

INSERT INTO `finishes_table` (`id`, `finish`) VALUES
(4, 'SS'),
(5, 'ANT'),
(6, 'JET BLACK'),
(7, 'PVD RG'),
(8, 'MATT SS'),
(9, 'MATT ANT');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` int(11) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `user` varchar(100) DEFAULT NULL,
  `code_user` varchar(100) DEFAULT NULL,
  `stock_quantity` decimal(10,2) DEFAULT 0.00,
  `finish` varchar(255) DEFAULT NULL,
  `scrap` decimal(10,2) DEFAULT 0.00,
  `labour` decimal(10,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `kg_dzn` decimal(10,2) DEFAULT 0.00,
  `pcs_box` int(11) DEFAULT 0,
  `box_ctn` int(11) DEFAULT 0,
  `pcs_ctn` int(11) DEFAULT 0,
  `kg_box` decimal(10,2) DEFAULT 0.00,
  `empty_wt` decimal(10,2) DEFAULT 0.00,
  `actual_wt` decimal(10,2) DEFAULT 0.00,
  `rate_pcs` decimal(10,2) DEFAULT 0.00,
  `base_rate_pcs` decimal(12,4) DEFAULT NULL,
  `rate_adjustment` varchar(20) DEFAULT NULL,
  `rate_kg` decimal(10,2) DEFAULT 0.00,
  `total_kg` decimal(10,2) DEFAULT 0.00,
  `actual_net_kg` decimal(10,2) DEFAULT 0.00,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pic_or_kg` int(11) DEFAULT NULL,
  `box_name` varchar(255) DEFAULT NULL,
  `shrink_name` varchar(255) DEFAULT NULL,
  `ld_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `item_code`, `user`, `code_user`, `stock_quantity`, `finish`, `scrap`, `labour`, `description`, `kg_dzn`, `pcs_box`, `box_ctn`, `pcs_ctn`, `kg_box`, `empty_wt`, `actual_wt`, `rate_pcs`, `base_rate_pcs`, `rate_adjustment`, `rate_kg`, `total_kg`, `actual_net_kg`, `created_by`, `created_at`, `updated_at`, `pic_or_kg`, `box_name`, `shrink_name`, `ld_name`) VALUES
(101, 'STEEL5', 'DER5', 'STEEL5DER5', 45.00, 'SS', 45.00, 120.00, 'STEEL 5', 0.50, 4, 5, 20, 5.00, 41.00, 41.00, 58.88, 6.8750, '52', 165.00, 5.00, 1.00, 18, '2026-08-06 03:53:21', '2026-08-06 03:53:21', 0, NULL, NULL, NULL),
(104, 'STEEL5', 'DER5', 'STEEL5DER5_JETBLACK', 74.00, 'JET BLACK', 74.00, 145.00, 'STEEL 5', 0.50, 70, 74, 5180, 7.00, 7.00, 7.00, 79.13, 9.1250, '70', 219.00, 70.00, 7.00, 18, '2026-08-06 03:57:50', '2026-08-06 03:57:50', 0, NULL, NULL, NULL),
(105, 'STEEL5', 'DEEP', 'STEEL5DEEP_PVDRG', 50.00, 'PVD RG', 5.00, 5.00, 'STEEL 5', 0.50, 54, 50, 2700, 5.00, 5.00, 5.00, 4500.42, 0.4167, '4500', 10.00, 45.00, 0.00, 18, '2026-08-06 04:01:28', '2026-08-06 04:01:28', 0, NULL, NULL, NULL),
(106, 'STEEL5', 'DER5', 'STEEL5DER5_ANT', 45.00, 'ANT', 80.00, 80.00, 'STEEL 5', 0.50, 80, 80, 6400, 80.00, 80.00, 80.00, 86.67, 6.6667, '80', 160.00, 80.00, 80.00, 18, '2026-08-06 04:02:15', '2026-08-06 04:02:15', 0, NULL, NULL, NULL),
(107, 'STEEL5', 'WSESTOYTF', 'STEEL5WSESTOYTF', 90.00, NULL, 90.00, 90.00, 'STEEL 5', 0.50, 78, 84, 6552, 54.00, 52.00, 89.00, 96.50, 7.5000, '89', 180.00, 87.00, 87.00, 18, '2026-08-06 04:28:45', '2026-08-06 04:28:45', 0, NULL, NULL, NULL),
(108, 'S5112316', 'WSESTOYTF', 'S5112316WSESTOYTF', 40.00, NULL, 40.00, 40.00, 'SMOOTH HINGES 5X1.1/2X3/16', 4.80, 40, 40, 1600, 40.00, 40.00, 40.00, 72.00, 32.0000, '40', 80.00, 40.00, 40.00, 18, '2026-08-06 04:36:11', '2026-08-06 04:36:11', 0, NULL, NULL, NULL),
(109, '31219', 'DEEP', '31219DEEP', 0.00, '', 0.00, 0.00, 'L HINGES 3X1/2-19 - SILVER', 1.10, 0, 0, 0, 0.00, 0.00, 0.01, 0.00, 0.0000, NULL, 0.00, 0.00, 0.00, 18, '2026-08-27 07:10:49', '2026-08-27 07:11:05', 0, NULL, NULL, NULL),
(110, 'R4008', 'DER5', 'R4008DER5_ANT', 45.00, 'ANT', 50.00, 50.00, 'TOWER BOLT ROUND 8X1/2', 3.30, 50, 50, 2500, 50.00, 50.00, 0.00, 77.50, 27.5000, '50', 100.00, 50.00, 50.00, 18, '2026-08-27 07:28:24', '2026-08-27 07:28:24', 0, NULL, NULL, NULL),
(116, 'BX001', 'KHUS', 'BX001KHUS', 700.00, NULL, 0.00, 0.00, '000', 0.00, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.0000, NULL, 0.00, 0.00, 0.00, 18, '2026-08-29 06:34:45', '2026-08-29 06:36:48', 0, NULL, NULL, NULL),
(117, 'SH001', 'TISA', 'SH001TISA', 0.00, '', 0.00, 0.00, '54654', 5.50, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.0000, NULL, 0.00, 0.00, 0.00, 18, '2026-08-29 06:34:59', '2026-08-29 06:39:56', 0, NULL, NULL, NULL),
(118, 'LD001', 'TISA', 'LD001TISA', 0.00, NULL, 0.00, 0.00, 'NNJ', 0.00, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, 0.0000, NULL, 0.00, 0.00, 0.00, 18, '2026-08-29 06:35:10', '2026-08-29 06:35:10', 0, NULL, NULL, NULL),
(120, 'SH001', 'SH001TISA', 'SH001SH001TISA', 0.00, NULL, 0.00, 0.00, '54654', 0.00, 0, 0, 0, 0.00, 0.00, 0.00, 0.00, NULL, NULL, 0.00, 500.00, 0.00, NULL, '2026-08-29 06:40:18', '2026-08-29 06:40:18', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `invoice_date` date NOT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `reference_no_1` varchar(100) DEFAULT NULL,
  `reference_no_2` varchar(100) DEFAULT NULL,
  `sub_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `gst_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `other_charge` varchar(255) DEFAULT NULL,
  `other_charge_amount` decimal(12,2) DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `remaining_amount` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tr_number` varchar(50) DEFAULT NULL,
  `lr_number` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `invoice_date`, `customer_id`, `reference_no_1`, `reference_no_2`, `sub_total`, `gst_amount`, `other_charge`, `other_charge_amount`, `grand_total`, `remaining_amount`, `created_at`, `updated_at`, `tr_number`, `lr_number`) VALUES
(88, 'INV-2026-734', '2026-08-27', 'DER5', '5', '19370', 19375.00, 0.00, NULL, 0.00, 19375.00, 19375, '2026-08-27 07:37:27', '2026-08-27 07:37:27', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `item_description` text DEFAULT NULL,
  `item_size` varchar(50) DEFAULT NULL,
  `item_finish` varchar(50) DEFAULT NULL,
  `pcs_per_box` int(11) DEFAULT 0,
  `total_boxes` int(11) DEFAULT 0,
  `extra_pcs` int(11) DEFAULT 0,
  `total_pcs` int(11) DEFAULT 0,
  `pcs_rate` decimal(10,2) DEFAULT NULL,
  `rate_kg` decimal(10,2) DEFAULT NULL,
  `total_rs` decimal(12,2) DEFAULT NULL,
  `total_weight` decimal(10,3) DEFAULT NULL,
  `scrap_lb` decimal(10,3) DEFAULT NULL,
  `brass` decimal(10,3) DEFAULT NULL,
  `kg_box` decimal(10,3) DEFAULT NULL,
  `lb` decimal(10,3) DEFAULT NULL,
  `box_wt` decimal(10,3) DEFAULT NULL,
  `tmp_wt` decimal(10,3) DEFAULT NULL,
  `net_kg` decimal(10,3) DEFAULT NULL,
  `box_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_code`, `item_description`, `item_size`, `item_finish`, `pcs_per_box`, `total_boxes`, `extra_pcs`, `total_pcs`, `pcs_rate`, `rate_kg`, `total_rs`, `total_weight`, `scrap_lb`, `brass`, `kg_box`, `lb`, `box_wt`, `tmp_wt`, `net_kg`, `box_name`) VALUES
(121, 88, 'R4008', 'TOWER BOLT ROUND 8X1/2', NULL, 'ANT', 50, 5, 0, 250, 77.50, NULL, 19375.00, 0.000, 100.000, 50.000, 50.000, 50.000, 50.000, 0.051, 249.745, 'BX001');

-- --------------------------------------------------------

--
-- Table structure for table `journal_customers`
--

CREATE TABLE `journal_customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_customers`
--

INSERT INTO `journal_customers` (`id`, `name`, `notes`, `created_at`, `updated_at`) VALUES
(2, 'kjkj', NULL, '2026-04-18 14:48:15', '2026-04-18 14:48:15');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `entry_type_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('Payment','Receipt') NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `method_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `note_1` text DEFAULT NULL,
  `note_2` text DEFAULT NULL,
  `note_3` text DEFAULT NULL,
  `note_4` text DEFAULT NULL,
  `attachment` varchar(500) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `entry_type_id`, `date`, `type`, `customer_name`, `method_id`, `amount`, `notes`, `note_1`, `note_2`, `note_3`, `note_4`, `attachment`, `user_id`, `created_at`, `updated_at`) VALUES
(9, 2, '2026-04-28', 'Receipt', 'kjkj', 2, 500.00, 'hsbdshb', 'demo', '700', 'demo', 'demo', 'uploads\\attachment-1777404164790.pdf', 18, '2026-04-28 19:22:44', '2026-04-28 19:22:44'),
(10, 2, '2026-04-29', 'Receipt', 'kjkj', 2, 400.00, 'shdiucnhih', 'text', '780', 'text', 'text', NULL, 18, '2026-04-28 19:23:08', '2026-04-28 19:23:08'),
(11, 2, '2026-04-30', 'Payment', 'kjkj', 5, 440.00, 'aixamij', 'demo', '500', 'demo', 'demo', NULL, 18, '2026-04-28 19:23:36', '2026-04-28 19:23:36'),
(12, 2, '2026-04-28', 'Receipt', 'kjkj', 2, 56546.00, '465465', '465', '46', '465', '465', 'uploads\\attachment-1777404906883.pdf', 18, '2026-04-28 19:35:06', '2026-04-28 19:35:06'),
(13, 2, '2026-04-30', 'Receipt', 'kjkj', 3, 654654.00, '546546', '54654', '6656', '65465', '4654654', 'uploads\\attachment-1777404956560.pdf', 18, '2026-04-28 19:35:56', '2026-04-28 19:35:56'),
(14, 5, '2026-05-02', 'Receipt', 'kjkj', 2, 45121.00, '54512', NULL, NULL, NULL, NULL, 'uploads\\attachment-1777743595183.jpg', 18, '2026-05-02 17:39:55', '2026-05-02 17:40:06');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_types`
--

CREATE TABLE `journal_entry_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entry_types`
--

INSERT INTO `journal_entry_types` (`id`, `name`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'JUNARL etnary', 'JUNARL etnaryJUNARL etnary', 18, '2026-04-18 14:46:27', '2026-04-18 14:46:27'),
(2, 'junray entary', 'junray entaryjunray entaryjunray entary', 18, '2026-04-18 14:47:03', '2026-04-18 14:47:03'),
(3, 'ABC2', 'KJHUBBN', 18, '2026-04-18 14:49:15', '2026-04-18 14:49:15'),
(4, '5464', '65465', 18, '2026-05-02 17:34:35', '2026-05-02 17:34:35'),
(5, '351654654654', '5465465', 18, '2026-05-02 17:34:59', '2026-05-02 17:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_type_permissions`
--

CREATE TABLE `journal_entry_type_permissions` (
  `id` int(11) NOT NULL,
  `entry_type_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entry_type_permissions`
--

INSERT INTO `journal_entry_type_permissions` (`id`, `entry_type_id`, `user_id`, `created_at`) VALUES
(1, 1, 7, '2026-04-18 14:46:27'),
(2, 1, 9, '2026-04-18 14:46:27'),
(3, 1, 15, '2026-04-18 14:46:27'),
(4, 2, 18, '2026-04-18 14:47:03'),
(5, 2, 15, '2026-04-18 14:47:03'),
(6, 3, 2, '2026-04-18 14:49:15'),
(8, 4, 15, '2026-05-02 17:34:35'),
(9, 5, 18, '2026-05-02 17:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `ld_inventory`
--

CREATE TABLE `ld_inventory` (
  `id` int(11) NOT NULL,
  `ld_name` varchar(255) NOT NULL,
  `ld_quantity` decimal(12,4) DEFAULT 0.0000,
  `ld_wt` decimal(10,4) DEFAULT 0.0000,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `kg_dzn` decimal(10,4) DEFAULT 0.0000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ld_inventory`
--

INSERT INTO `ld_inventory` (`id`, `ld_name`, `ld_quantity`, `ld_wt`, `created_by`, `created_at`, `updated_at`, `kg_dzn`) VALUES
(1, 'LD001', 45.0000, 0.0000, NULL, '2026-08-29 06:26:11', '2026-08-29 06:27:48', 0.0000);

-- --------------------------------------------------------

--
-- Table structure for table `master_items`
--

CREATE TABLE `master_items` (
  `id` int(11) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `kg_dz` decimal(10,2) NOT NULL,
  `stock_quantity` decimal(10,2) DEFAULT 0.00,
  `stock_kg` decimal(15,3) NOT NULL DEFAULT 0.000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_items`
--

INSERT INTO `master_items` (`id`, `item_code`, `description`, `created_by`, `created_at`, `updated_at`, `kg_dz`, `stock_quantity`, `stock_kg`) VALUES
(13, 'S5118532H//3.400', 'SMOOTH HINGES 5X1.1/8X5/32H', 18, '2025-12-14 10:01:37', '2025-12-14 11:06:25', 3.40, 690.91, 190.000),
(14, 'S5114316', 'SMOOTH HINGES. 5X1.1/4X3/16', 18, '2025-12-14 10:02:44', '2026-04-19 15:41:30', 4.20, -1054.55, -290.000),
(15, 'S5112316', 'SMOOTH HINGES 5X1.1/2X3/16', 18, '2025-12-14 10:03:50', '2026-08-06 04:48:20', 4.80, 128.11, 77.440),
(16, 'R4006', 'TOWER BOLT ROUND 6X1/2', 18, '2025-12-14 10:05:31', '2025-12-14 10:05:31', 2.50, 0.00, 0.000),
(17, 'R4008', 'TOWER BOLT ROUND 8X1/2', 18, '2025-12-14 10:06:06', '2026-08-27 07:37:27', 3.30, -320.00, -265.645),
(18, '3126', 'L HINGES 3X1/2-6 - SILVER', 18, '2025-12-14 10:06:29', '2026-05-11 15:25:22', 0.90, -550.00, 9972.096),
(19, '31212', 'L HINGES 3X12-12 - SILVER', 18, '2025-12-14 10:07:07', '2026-05-11 15:32:15', 1.00, -2000.00, -1519.900),
(20, '31219', 'L HINGES 3X1/2-19 - SILVER', 18, '2025-12-14 10:08:19', '2025-12-14 10:08:19', 1.10, 0.00, 0.000),
(21, 'STEEL5', 'STEEL 5', 18, '2025-12-14 11:58:08', '2026-08-06 04:48:20', 0.50, -3590.00, 1566.500);

-- --------------------------------------------------------

--
-- Table structure for table `order_stock`
--

CREATE TABLE `order_stock` (
  `id` int(11) NOT NULL,
  `order_stock` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_stock`
--

INSERT INTO `order_stock` (`id`, `order_stock`) VALUES
(4, 'PLAN'),
(7, 'STOCK');

-- --------------------------------------------------------

--
-- Table structure for table `pati_table`
--

CREATE TABLE `pati_table` (
  `id` int(11) NOT NULL,
  `pati_type` varchar(255) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pati_table`
--

INSERT INTO `pati_table` (`id`, `pati_type`, `created_by`, `created_at`, `updated_at`) VALUES
(6, 'OTIX-700', 18, '2025-12-14 10:15:42', '2025-12-14 10:15:42'),
(7, 'OTIX-750', 18, '2025-12-14 10:15:53', '2025-12-14 10:15:53');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `date`, `amount`, `account_id`, `contact_id`, `description`, `reference`, `note`, `image_url`, `user_id`, `created_at`) VALUES
(2, '2025-12-30', 66565.00, 7, NULL, '6546546', '', '6+5+65+5+', NULL, 18, '2025-12-29 19:22:48');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Cash', '2025-12-05 19:13:48', '2025-12-05 19:13:48'),
(2, 'Bank Transfer', '2025-12-05 19:13:48', '2025-12-05 19:13:48'),
(3, 'Cheque', '2025-12-05 19:13:48', '2025-12-05 19:13:48'),
(4, 'UPI', '2025-12-05 19:13:48', '2025-12-05 19:13:48'),
(5, 'Card', '2025-12-05 19:13:48', '2025-12-05 19:13:48');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_invoices`
--

CREATE TABLE `purchase_invoices` (
  `id` int(11) NOT NULL,
  `code_user` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `issue_date` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `total_amount` decimal(12,2) DEFAULT 0.00,
  `balance_due` decimal(12,2) DEFAULT 0.00,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_invoices`
--

INSERT INTO `purchase_invoices` (`id`, `code_user`, `user`, `invoice_number`, `issue_date`, `due_date`, `total_amount`, `balance_due`, `image_url`, `created_at`, `updated_at`) VALUES
(13, 'KHUS', 'KHUS', '65654', '2026-08-29', '0000-00-00', 70000.00, 70000.00, '', '2026-08-29 06:36:48', '2026-08-29 06:36:48'),
(14, 'SH001TISA', 'TISA', '', '2026-08-29', '0000-00-00', 2500000.00, 2500000.00, '', '2026-08-29 06:40:17', '2026-08-29 06:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_invoice_items`
--

CREATE TABLE `purchase_invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `item_code` varchar(100) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stock_kg` decimal(10,2) DEFAULT 0.00,
  `scrap` decimal(10,2) DEFAULT 0.00,
  `labour` decimal(10,2) DEFAULT 0.00,
  `kg_dzn` decimal(10,2) DEFAULT 0.00,
  `actual_dzn_wt` decimal(10,2) DEFAULT 0.00,
  `total_per_6a` decimal(10,2) DEFAULT 0.00,
  `rate_pcr` decimal(10,2) DEFAULT 0.00,
  `total_kg` decimal(10,2) DEFAULT 0.00,
  `no_of_peti` int(11) DEFAULT 0,
  `peti_wt` decimal(10,2) DEFAULT 0.00,
  `peti_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `ret_peti_no` decimal(10,2) NOT NULL DEFAULT 0.00,
  `peti_Type` varchar(50) DEFAULT NULL,
  `net_kg` decimal(10,2) DEFAULT 0.00,
  `amount` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `pati_status` varchar(50) DEFAULT 'Active',
  `pic_or_kg` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_psc` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_invoice_items`
--

INSERT INTO `purchase_invoice_items` (`id`, `invoice_id`, `item_code`, `code`, `description`, `stock_kg`, `scrap`, `labour`, `kg_dzn`, `actual_dzn_wt`, `total_per_6a`, `rate_pcr`, `total_kg`, `no_of_peti`, `peti_wt`, `peti_balance`, `ret_peti_no`, `peti_Type`, `net_kg`, `amount`, `notes`, `pati_status`, `pic_or_kg`, `created_at`, `updated_at`, `total_psc`) VALUES
(13, 13, 'BX001KHUS', 'BX001', '000', 70.00, 0.00, 0.00, 0.00, 0.00, 0.00, 100.00, 0.00, 0, 0.00, 0.00, 0.00, 'WD', 0.00, 70000.00, '', '0', 1, '2026-08-29 06:36:48', '2026-08-29 06:36:48', 700.00),
(14, 14, 'SH001TISA', 'SH001', '54654', 5.00, 0.00, 0.00, 5.50, 0.00, 0.00, 5000.00, 500.00, 0, 0.00, 0.00, 0.00, 'WD', 500.00, 2500000.00, '', '0', 1, '2026-08-29 06:40:17', '2026-08-29 06:40:17', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_invoice`
--

CREATE TABLE `sales_invoice` (
  `id` int(11) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `invoice_no` varchar(50) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `no1` int(11) NOT NULL,
  `no2` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sr_no` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `item_description_size` text DEFAULT NULL,
  `item_finish` varchar(255) DEFAULT NULL,
  `pcs_per_box` int(11) DEFAULT 0,
  `extra_pcs` int(11) DEFAULT 0,
  `total_pcs` int(11) DEFAULT 0,
  `total_weight` decimal(10,2) DEFAULT 0.00,
  `scrap_lb` decimal(10,2) DEFAULT 0.00,
  `total_rs` decimal(10,2) DEFAULT 0.00,
  `brass` decimal(10,2) DEFAULT 0.00,
  `lb` decimal(10,2) DEFAULT 0.00,
  `kg_per_box` decimal(10,2) DEFAULT 0.00,
  `pcs_rate` decimal(10,2) DEFAULT 0.00,
  `box_wt` decimal(10,2) DEFAULT 0.00,
  `tmp_wt` decimal(10,2) DEFAULT 0.00,
  `net_kg` decimal(10,2) DEFAULT 0.00,
  `ctn_no` int(11) DEFAULT 0,
  `ctn_wt` decimal(10,2) DEFAULT 0.00,
  `weight_per_ctn` decimal(10,2) DEFAULT 0.00,
  `gst` decimal(5,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `grand_total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_lock`
--

CREATE TABLE `sales_lock` (
  `id` int(11) NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `locked_by` int(11) DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `unlocked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_lock`
--

INSERT INTO `sales_lock` (`id`, `module_name`, `display_name`, `is_locked`, `locked_by`, `locked_at`, `unlocked_at`, `created_at`, `updated_at`) VALUES
(1, 'all', 'All Pages', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(2, 'dashboard', 'Dashboard', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(3, 'accounts', 'Bank and Cash Accounts', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(4, 'receipts', 'Receipts', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(5, 'payments', 'Payments', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(6, 'customers', 'Customers', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(7, 'suppliers', 'Suppliers', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(8, 'sales_orders', 'Sales Orders', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(9, 'sales_invoices', 'Sales Invoices', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(10, 'purchase_invoices', 'Purchase Invoices', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(11, 'inventory_items', 'Inventory Items', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(12, 'master_items', 'Master Product', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(13, 'employees', 'Employees', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50'),
(14, 'journal_entries', 'Journal Entries', 0, NULL, NULL, NULL, '2026-04-24 19:34:50', '2026-04-24 19:34:50');

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `id` int(11) NOT NULL,
  `order_number` int(11) DEFAULT NULL,
  `order_date` varchar(255) DEFAULT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `finish` varchar(255) DEFAULT NULL,
  `stock_qty` decimal(10,2) DEFAULT NULL,
  `initial_qty` decimal(12,2) DEFAULT NULL,
  `scrap` decimal(10,2) DEFAULT NULL,
  `labour` decimal(10,2) DEFAULT NULL,
  `kg_dzn` decimal(10,2) DEFAULT NULL,
  `pcs_box` int(11) DEFAULT NULL,
  `box_ctn` int(11) DEFAULT NULL,
  `pcs_ctn` int(11) DEFAULT NULL,
  `kg_box` decimal(10,2) DEFAULT NULL,
  `qty_ctn` decimal(10,2) DEFAULT NULL,
  `total_kg` decimal(10,2) DEFAULT NULL,
  `quantity_pcs` int(11) DEFAULT NULL,
  `order_stock` varchar(255) DEFAULT NULL,
  `manufacturer_name` varchar(255) DEFAULT NULL,
  `po_vr` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `invoice_status` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `customer_code` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `rate_pcs` decimal(10,2) DEFAULT NULL,
  `rate_kz` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `order_number`, `order_date`, `customer_id`, `item_code`, `finish`, `stock_qty`, `initial_qty`, `scrap`, `labour`, `kg_dzn`, `pcs_box`, `box_ctn`, `pcs_ctn`, `kg_box`, `qty_ctn`, `total_kg`, `quantity_pcs`, `order_stock`, `manufacturer_name`, `po_vr`, `note`, `invoice_status`, `created_by`, `created_at`, `updated_at`, `customer_code`, `customer_name`, `rate_pcs`, `rate_kz`) VALUES
(77, 1, '2026-08-27', 'STEEL5DER5', 'STEEL5', 'JET BLACK', 74.00, 2131.00, 74.00, 145.00, 0.50, 70, 74, 5180, 7.00, 0.41, 88.79, 2131, 'PLAN', 'DEEP', 'ok', '554', NULL, 18, '2026-08-27 07:27:32', '2026-08-27 07:27:32', 'DER5', NULL, 79.13, 219.00),
(78, 1, '2026-08-27', 'R4008DER5', 'R4008', 'ANT', 45.00, 56.00, 50.00, 50.00, 3.30, 50, 50, 2500, 50.00, 0.02, 15.40, 0, 'PLAN', 'TISA', 'ok', NULL, 'over_invoiced', 18, '2026-08-27 07:28:44', '2026-08-27 07:37:27', 'DER5', NULL, 77.50, 100.00);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_cartons`
--

CREATE TABLE `shipping_cartons` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `carton_number` varchar(100) NOT NULL,
  `carton_weight` decimal(10,3) DEFAULT 0.000,
  `weight_per_ctn` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_cartons`
--

INSERT INTO `shipping_cartons` (`id`, `invoice_id`, `carton_number`, `carton_weight`, `weight_per_ctn`) VALUES
(64, 88, 'CTN A', 1.000, 1.000);

-- --------------------------------------------------------

--
-- Table structure for table `shrink_inventory`
--

CREATE TABLE `shrink_inventory` (
  `id` int(11) NOT NULL,
  `shrink_name` varchar(255) NOT NULL,
  `shrink_quantity` decimal(12,4) DEFAULT 0.0000,
  `shrink_wt` decimal(10,4) DEFAULT 0.0000,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `kg_dzn` decimal(10,4) DEFAULT 0.0000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shrink_inventory`
--

INSERT INTO `shrink_inventory` (`id`, `shrink_name`, `shrink_quantity`, `shrink_wt`, `created_by`, `created_at`, `updated_at`, `kg_dzn`) VALUES
(1, 'SH001', 500.0000, 0.4583, NULL, '2026-08-29 06:26:17', '2026-08-29 06:40:18', 5.5000);

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `id` int(11) NOT NULL,
  `item_code` varchar(191) NOT NULL,
  `transaction_type` enum('CREDIT','DEBIT') NOT NULL COMMENT 'CREDIT = Stock In, DEBIT = Stock Out',
  `invoice_type` enum('PURCHASE','SALES') NOT NULL,
  `invoice_number` varchar(191) DEFAULT NULL,
  `quantity_pcs` decimal(15,3) NOT NULL DEFAULT 0.000,
  `quantity_kg` decimal(15,3) NOT NULL DEFAULT 0.000,
  `movement_date` date NOT NULL,
  `note` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_history`
--

INSERT INTO `stock_history` (`id`, `item_code`, `transaction_type`, `invoice_type`, `invoice_number`, `quantity_pcs`, `quantity_kg`, `movement_date`, `note`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 'S5114316', 'CREDIT', 'PURCHASE', '12-003', 986.520, 337.060, '2025-12-14', NULL, NULL, '2025-12-14 11:01:38', '2025-12-14 11:01:38'),
(3, 'S5112316', 'CREDIT', 'PURCHASE', '12-009', 485.110, 190.000, '2025-12-14', NULL, NULL, '2025-12-14 11:04:03', '2025-12-14 11:04:03'),
(4, 'S5118532H//3.400', 'CREDIT', 'PURCHASE', '12=006', 690.910, 190.000, '2025-12-14', NULL, NULL, '2025-12-14 11:06:25', '2025-12-14 11:06:25'),
(5, '31212', 'DEBIT', 'SALES', '6565', 24.000, 19.900, '2025-12-15', NULL, NULL, '2025-12-15 09:56:06', '2025-12-15 09:56:06'),
(6, 'R4008', 'DEBIT', 'SALES', 'inv0123', 70.000, 15.900, '2025-12-16', NULL, NULL, '2025-12-16 19:53:46', '2025-12-16 19:53:46'),
(7, 'S5112316', 'DEBIT', 'SALES', '22', 150.000, 20.100, '2026-03-09', NULL, NULL, '2026-03-09 17:16:01', '2026-03-09 17:16:01'),
(8, 'S5112316', 'DEBIT', 'SALES', '323', 80.000, 28.140, '2026-03-09', NULL, NULL, '2026-03-09 17:17:24', '2026-03-09 17:17:24'),
(9, 'S5112316', 'DEBIT', 'SALES', '032131', 87.000, 64.320, '2026-03-09', NULL, NULL, '2026-03-09 17:19:05', '2026-03-09 17:19:05'),
(10, '3126', 'DEBIT', 'SALES', '121', 250.000, 18.100, '2026-03-09', NULL, NULL, '2026-03-09 17:25:44', '2026-03-09 17:25:44'),
(11, '3126', 'DEBIT', 'SALES', '232', 62.000, 9.804, '2026-03-09', NULL, NULL, '2026-03-09 17:27:22', '2026-03-09 17:27:22'),
(12, '3126', 'CREDIT', 'PURCHASE', '541', 794.700, 10000.000, '2026-03-09', NULL, NULL, '2026-03-09 17:30:40', '2026-03-09 17:30:40'),
(13, '31212', 'DEBIT', 'SALES', '321321131', 1000100.000, 10000.000, '2026-03-21', NULL, NULL, '2026-03-21 19:36:42', '2026-03-21 19:36:42'),
(14, '31212', 'CREDIT', '', '321321131', 1000100.000, 10000.000, '2026-03-22', 'Undo invoice 321321131', 18, '2026-03-21 19:38:08', '2026-03-21 19:38:08'),
(15, '31212', 'DEBIT', 'SALES', '21213321', 110.000, 0.000, '2026-03-25', NULL, NULL, '2026-03-25 04:56:24', '2026-03-25 04:56:24'),
(16, '31212', 'CREDIT', '', '21213321', 110.000, 0.000, '2026-03-25', 'Undo invoice 21213321', 18, '2026-03-25 05:21:36', '2026-03-25 05:21:36'),
(17, '31212', 'DEBIT', 'SALES', '211313', 55.000, 52.250, '2026-03-25', NULL, NULL, '2026-03-25 05:25:58', '2026-03-25 05:25:58'),
(18, '3126', 'DEBIT', 'SALES', '211313', 55.000, 50.000, '2026-03-25', NULL, NULL, '2026-03-25 05:25:58', '2026-03-25 05:25:58'),
(19, '31212', 'CREDIT', '', '211313', 55.000, 52.250, '2026-03-25', 'Undo invoice 211313', 18, '2026-03-25 05:34:15', '2026-03-25 05:34:15'),
(20, '3126', 'CREDIT', '', '211313', 55.000, 50.000, '2026-03-25', 'Undo invoice 211313', 18, '2026-03-25 05:34:15', '2026-03-25 05:34:15'),
(21, '31212', 'DEBIT', 'SALES', '51651', 55.000, 495.000, '2026-03-25', NULL, NULL, '2026-03-25 05:37:56', '2026-03-25 05:37:56'),
(22, '31212', 'CREDIT', '', '51651', 55.000, 495.000, '2026-03-25', 'Undo invoice 51651', 18, '2026-03-25 05:39:17', '2026-03-25 05:39:17'),
(23, '3126', 'DEBIT', 'SALES', '21121', 210.000, 99.750, '2026-03-25', NULL, NULL, '2026-03-25 05:41:54', '2026-03-25 05:41:54'),
(24, '31212', 'DEBIT', 'SALES', '21121', 30.000, 540.000, '2026-03-25', NULL, NULL, '2026-03-25 05:41:54', '2026-03-25 05:41:54'),
(25, '3126', 'CREDIT', '', '21121', 210.000, 99.750, '2026-03-25', 'Undo invoice 21121', 18, '2026-03-25 05:51:00', '2026-03-25 05:51:00'),
(26, '31212', 'CREDIT', '', '21121', 30.000, 540.000, '2026-03-25', 'Undo invoice 21121', 18, '2026-03-25 05:51:00', '2026-03-25 05:51:00'),
(27, '3126', 'DEBIT', 'SALES', '332', 510.000, 102.000, '2026-03-25', NULL, NULL, '2026-03-25 05:51:58', '2026-03-25 05:51:58'),
(28, '3126', 'CREDIT', '', '332', 510.000, 102.000, '2026-03-25', 'Undo invoice 332', 18, '2026-03-25 05:52:13', '2026-03-25 05:52:13'),
(30, '3126', 'DEBIT', 'SALES', '2121', 550.000, 0.000, '2026-03-25', NULL, NULL, '2026-03-25 05:54:05', '2026-03-25 05:54:05'),
(31, '31212', 'DEBIT', 'SALES', '2121', 55.000, 1000.000, '2026-03-25', NULL, NULL, '2026-03-25 05:54:05', '2026-03-25 05:54:05'),
(32, '3126', 'CREDIT', 'SALES', '2121', 250.000, 0.000, '2026-03-24', 'Invoice update stock adjustment', NULL, '2026-03-25 05:54:31', '2026-03-25 05:54:31'),
(33, '31212', 'DEBIT', 'SALES', '2121', 10.000, 0.000, '2026-03-24', 'Invoice update stock adjustment', NULL, '2026-03-25 05:54:31', '2026-03-25 05:54:31'),
(34, '3126', 'DEBIT', 'SALES', '2121', 350.000, 0.000, '2026-03-23', 'Invoice update stock adjustment', NULL, '2026-03-25 05:55:13', '2026-03-25 05:55:13'),
(35, '31212', 'CREDIT', 'SALES', '2121', 20.000, 0.000, '2026-03-23', 'Invoice update stock adjustment', NULL, '2026-03-25 05:55:13', '2026-03-25 05:55:13'),
(36, '3126', 'CREDIT', '', '2121', 650.000, 0.000, '2026-03-25', 'Undo invoice 2121', 18, '2026-03-25 05:55:47', '2026-03-25 05:55:47'),
(37, '31212', 'CREDIT', '', '2121', 45.000, 1000.000, '2026-03-25', 'Undo invoice 2121', 18, '2026-03-25 05:55:47', '2026-03-25 05:55:47'),
(38, '31212', 'DEBIT', 'SALES', '4445', 10.000, 0.000, '2026-04-19', NULL, NULL, '2026-04-19 15:00:57', '2026-04-19 15:00:57'),
(39, '31212', 'CREDIT', 'SALES', '4445', 10.000, 0.000, '2026-04-19', 'Undo invoice 4445', 18, '2026-04-19 15:01:02', '2026-04-19 15:01:02'),
(40, 'S5114316', 'DEBIT', 'PURCHASE', '12-003', 986.520, 337.060, '2026-04-19', 'Undo invoice', 18, '2026-04-19 15:41:16', '2026-04-19 15:41:16'),
(41, 'S5114316', 'DEBIT', 'PURCHASE', '12006', 1054.550, 290.000, '2026-04-19', 'Undo invoice', 18, '2026-04-19 15:41:30', '2026-04-19 15:41:30'),
(46, '3126', 'DEBIT', 'SALES', '656546', 550.000, 0.000, '2026-05-11', NULL, NULL, '2026-05-11 15:25:22', '2026-05-11 15:25:22'),
(47, '31212', 'DEBIT', 'SALES', 'INV-2026-188', 2010.000, 1500.000, '2026-05-11', NULL, NULL, '2026-05-11 15:32:15', '2026-05-11 15:32:15'),
(48, 'STEEL5', 'DEBIT', 'SALES', '789498', 85.000, 8.500, '2026-08-06', NULL, NULL, '2026-08-06 04:21:48', '2026-08-06 04:21:48'),
(49, 'S5112316', 'DEBIT', 'SALES', 'INV-2026-465', 40.000, 0.000, '2026-08-06', NULL, NULL, '2026-08-06 04:48:20', '2026-08-06 04:48:20'),
(50, 'STEEL5', 'DEBIT', 'SALES', 'INV-2026-465', 3555.000, -1575.000, '2026-08-06', NULL, NULL, '2026-08-06 04:48:20', '2026-08-06 04:48:20'),
(51, 'R4008', 'DEBIT', 'SALES', 'INV-2026-734', 250.000, 249.745, '2026-08-27', NULL, NULL, '2026-08-27 07:37:27', '2026-08-27 07:37:27');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_details`
--

CREATE TABLE `supplier_details` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `credit_limit` varchar(50) DEFAULT NULL,
  `division` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `order_follow_up` text DEFAULT NULL,
  `note_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_details`
--

INSERT INTO `supplier_details` (`id`, `contact_id`, `credit_limit`, `division`, `due_date`, `payment_status`, `note`, `total_amount`, `notes`, `payment`, `date`, `order_follow_up`, `note_date`) VALUES
(29, 63, '0', 'PLAN', '2025-12-14', 'Pending', '', -20223.60, NULL, NULL, NULL, NULL, NULL),
(30, 64, '0', 'PLAN', '2025-12-14', 'Pending', '', 70000.00, NULL, NULL, NULL, NULL, NULL),
(31, 65, '0', 'PLAN', '2025-12-14', 'Pending', '', NULL, NULL, NULL, NULL, NULL, NULL),
(32, 68, '0', 'PLAN', '2025-12-29', 'Pending', '', -14500.00, NULL, NULL, NULL, NULL, '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('global_field_controls', '{\"sales_orders\":{\"scrap\":true,\"labour\":true,\"ratePcs\":true,\"qtyCtn\":true,\"kgBox\":true},\"purchase_invoices\":{\"scrap\":false,\"labour\":false,\"ratePcr\":true,\"netKg\":true,\"actualDznWt\":true},\"sales_invoices\":{\"ratePcs\":false,\"scrapPlusLabour\":false,\"actualWt\":true,\"boxWt\":true,\"totalRs\":true}}', '2026-08-26 06:27:36');

-- --------------------------------------------------------

--
-- Table structure for table `transport`
--

CREATE TABLE `transport` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport`
--

INSERT INTO `transport` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'GAJANAND', '2025-10-17 11:04:35', '2025-10-27 06:32:38'),
(3, 'VRL', '2025-10-27 06:32:25', '2025-10-27 06:32:25'),
(4, 'EAGLE', '2025-12-14 10:15:32', '2025-12-14 10:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `email`, `password`, `created_at`) VALUES
(1, 'johndoe', 'john.doe@example.com', '$2b$10$htl8Op89PyDYKSo40AngXeRZ0QEK5fjVGtIKKe5LyKkI6aW/BBWOW', '2025-08-16 06:48:32'),
(2, 'harsh', 'harsh@example.com', '$2b$10$MRCzks/PUQBoRDgTiigquO6QeqkG/VhUBwNPppSKSBavhyGVd.YGS', '2025-08-16 07:36:00'),
(4, 'harshgiri', 'harshgiri@example.com', '$2b$10$LGlgtrzLyFdZmXNBJsotZOAauap5jBOcTpLiC0.1RKYTFxDE2n5Fa', '2025-08-16 07:44:59'),
(5, 'karan', 'karan@example.com', '$2b$10$7FIrRDP065DOInYAaORpEejIPuiWWOVT6ZB/PHp2yGHnKnAXADkOy', '2025-08-16 07:47:50'),
(6, 'test_receipt_user', 'receipts@example.com', '$2b$10$ZAe3RM0qsD6XEdwesxKmVekH8goyHawjU3v7BUKItDoRQr4fga50a', '2025-08-23 10:13:52'),
(7, 'admin_user', 'admin@example.com', '$2b$10$IsiAsxoHgdFo1jvgngRZUebc6mBIYImF1Rfu5ardSKwJaFzaEModu', '2025-08-24 05:58:42'),
(8, 'kevin', 'kevin@example.com', '$2b$10$4QpTOJY8zEG2/e6kyuz79OT/4gmEmzqzaBMKd6JRFIgnS/dEmVu0K', '2025-08-27 13:33:39'),
(9, 'dheyu', 'dheyu@example.com', '$2b$10$xIP6OGf5UPLC/2GAISYkCOLP4HFfR/caKhJFy3QXX.myby8AhlR8m', '2025-08-28 06:27:45'),
(15, 'doller1', 'doller1@gmail.com', '$2b$10$d23adw6/9hNipRv/qY97X.wVZTzqvNcTrkR/0mJRaVyQbGGBz4NEm', '2025-09-13 13:48:58'),
(17, 'smi', 'smt@example.com', '$2b$10$AfF.rOTHudl24CcJyavexu53rnIZPNwxJ6UmmE8CdzW1.qaHOMOaq', '2025-10-16 20:41:12'),
(18, 'doller2', 'doller2@gmail.com', '$2b$10$9ExwW3ymIgpBcMeXPMKoBup79CvCqF.U8XhXrj7p.ButykaIb2OOi', '2025-10-23 15:05:00'),
(19, 'demo@gmail.com', 'demo@gmail.com', '$2b$10$DB2Zky3qu3RA3Xfad2PWhOMS11ca0HNCOoBXxu4vGCOaH1N0geK3a', '2025-10-24 10:05:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(191) NOT NULL,
  `model_name` varchar(191) NOT NULL COMMENT 'Page / model name (e.g., accounts, inventory_items)',
  `action_type` enum('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `record_id` int(11) DEFAULT NULL COMMENT 'Affected record primary key (if available)',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON object storing old and new values for UPDATE actions' CHECK (json_valid(`changes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `user_name`, `model_name`, `action_type`, `record_id`, `description`, `created_at`, `changes`) VALUES
(1, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-04 19:14:01', NULL),
(2, 18, 'doller2', 'employees', 'CREATE', 4, 'Created new employee: Dhrumit', '2025-12-04 19:30:55', NULL),
(3, 18, 'doller2', 'employees', 'CREATE', 5, 'Created new employee: Karan', '2025-12-05 15:31:23', NULL),
(4, 18, 'doller2', 'payment_methods', 'DELETE', 6, 'Deleted payment method', '2025-12-05 19:22:38', NULL),
(5, 18, 'doller2', 'journal_entries', 'CREATE', 1, 'Created Receipt entry for Sagar: ₹1000000', '2025-12-05 19:23:30', NULL),
(6, 18, 'doller2', 'journal_entries', 'CREATE', 2, 'Created Receipt entry for dev: ₹100000', '2025-12-05 19:24:44', NULL),
(7, 18, 'doller2', 'journal_entries', 'CREATE', 3, 'Created Payment entry for gg: ₹11111', '2025-12-05 19:28:57', NULL),
(8, 18, 'doller2', 'journal_entries', 'UPDATE', 3, 'Updated journal entry', '2025-12-05 19:29:23', NULL),
(9, 18, 'doller2', 'journal_entries', 'CREATE', 4, 'Created Payment entry for Hello: ₹10000', '2025-12-07 13:03:59', NULL),
(10, 18, 'doller2', 'employees', 'CREATE', 8, 'Created new employee: dhruv', '2025-12-07 18:39:34', NULL),
(11, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-13 10:04:13', NULL),
(12, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-13 10:04:32', NULL),
(13, 18, 'doller2', 'journal_entries', 'CREATE', 5, 'Created Receipt entry for ee: ₹333', '2025-12-13 10:10:06', NULL),
(14, 18, 'doller2', 'journal_entries', 'DELETE', 5, 'Deleted journal entry', '2025-12-13 10:10:15', NULL),
(15, 18, 'doller2', 'journal_entries', 'DELETE', 4, 'Deleted journal entry', '2025-12-13 10:10:18', NULL),
(16, 18, 'doller2', 'journal_entries', 'DELETE', 3, 'Deleted journal entry', '2025-12-13 10:10:22', NULL),
(17, 18, 'doller2', 'journal_entries', 'DELETE', 2, 'Deleted journal entry', '2025-12-13 10:10:25', NULL),
(18, 18, 'doller2', 'journal_entries', 'DELETE', 1, 'Deleted journal entry', '2025-12-13 10:10:28', NULL),
(19, 18, 'doller2', 'sales_orders', 'UPDATE', 30, 'Updated sales order', '2025-12-13 10:12:15', '{\"scrap\": {\"new\": 540, \"old\": \"640.00\"}, \"kg_box\": {\"new\": 1.55, \"old\": \"1.55\"}, \"kg_dzn\": {\"new\": 3.6, \"old\": \"3.60\"}, \"labour\": {\"new\": 120, \"old\": \"120.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 660, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 198, \"old\": \"228.00\"}, \"total_kg\": {\"new\": 60, \"old\": \"60.00\"}, \"stock_qty\": {\"new\": -60, \"old\": \"-60.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(20, 18, 'doller2', 'master_items', 'UPDATE', 11, 'Updated master item', '2025-12-13 13:22:11', '{\"kg_dz\": {\"new\": 3.6, \"old\": \"3.60\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"-166.00\"}}'),
(21, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-13 18:13:29', NULL),
(22, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-13 18:15:42', NULL),
(23, 18, 'doller2', 'employees', 'CREATE', 9, 'Created new employee: RAJ ghaadiya', '2025-12-14 09:54:22', NULL),
(24, 18, 'doller2', 'employees', 'CREATE', 10, 'Created new employee: ASAD', '2025-12-14 09:57:44', NULL),
(25, 18, 'doller2', 'employees', 'CREATE', 11, 'Created new employee: DIPPAK', '2025-12-14 09:59:09', NULL),
(26, 18, 'doller2', 'master_items', 'CREATE', 13, 'Created master item', '2025-12-14 10:01:37', NULL),
(27, 18, 'doller2', 'master_items', 'UPDATE', 13, 'Updated master item', '2025-12-14 10:01:47', '{\"kg_dz\": {\"new\": 3.4, \"old\": \"3.40\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(28, 18, 'doller2', 'master_items', 'CREATE', 14, 'Created master item', '2025-12-14 10:02:44', NULL),
(29, 18, 'doller2', 'master_items', 'UPDATE', 13, 'Updated master item', '2025-12-14 10:03:11', '{\"kg_dz\": {\"new\": 3.4, \"old\": \"3.40\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(30, 18, 'doller2', 'master_items', 'CREATE', 15, 'Created master item', '2025-12-14 10:03:50', NULL),
(31, 18, 'doller2', 'contacts', 'CREATE', 63, 'Created contact', '2025-12-14 10:04:11', NULL),
(32, 18, 'doller2', 'contacts', 'CREATE', 64, 'Created contact', '2025-12-14 10:04:28', NULL),
(33, 18, 'doller2', 'contacts', 'CREATE', 65, 'Created contact', '2025-12-14 10:04:50', NULL),
(34, 18, 'doller2', 'master_items', 'CREATE', 16, 'Created master item', '2025-12-14 10:05:31', NULL),
(35, 18, 'doller2', 'master_items', 'CREATE', 17, 'Created master item', '2025-12-14 10:06:06', NULL),
(36, 18, 'doller2', 'master_items', 'CREATE', 18, 'Created master item', '2025-12-14 10:06:29', NULL),
(37, 18, 'doller2', 'master_items', 'CREATE', 19, 'Created master item', '2025-12-14 10:07:07', NULL),
(38, 18, 'doller2', 'master_items', 'UPDATE', 18, 'Updated master item', '2025-12-14 10:07:17', '{\"kg_dz\": {\"new\": 0.9, \"old\": \"0.90\"}, \"description\": {\"new\": \"L HINGES 3X1/2-6 - SILVER\", \"old\": \"L HINGES 3X1/2-6\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(39, 18, 'doller2', 'master_items', 'UPDATE', 19, 'Updated master item', '2025-12-14 10:07:51', '{\"kg_dz\": {\"new\": 1, \"old\": \"1.00\"}, \"item_code\": {\"new\": \"31212\", \"old\": \"311212\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(40, 18, 'doller2', 'master_items', 'CREATE', 20, 'Created master item', '2025-12-14 10:08:19', NULL),
(41, 18, 'doller2', 'contacts', 'CREATE', 66, 'Created contact', '2025-12-14 10:08:37', NULL),
(42, 18, 'doller2', 'contacts', 'CREATE', 67, 'Created contact', '2025-12-14 10:08:48', NULL),
(43, 18, 'doller2', 'inventory_items', 'CREATE', 65, 'Created inventory item', '2025-12-14 10:10:24', NULL),
(44, 18, 'doller2', 'inventory_items', 'CREATE', 66, 'Created inventory item', '2025-12-14 10:10:47', NULL),
(45, 18, 'doller2', 'inventory_items', 'CREATE', 67, 'Created inventory item', '2025-12-14 10:11:15', NULL),
(46, 18, 'doller2', 'inventory_items', 'UPDATE', 66, 'Updated inventory item', '2025-12-14 10:11:24', '{\"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 4.2, \"old\": \"4.20\"}, \"labour\": {\"new\": 60, \"old\": \"0.00\"}, \"rate_kg\": {\"new\": 60, \"old\": \"0.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 21, \"old\": \"0.00\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(47, 18, 'doller2', 'inventory_items', 'CREATE', 68, 'Created inventory item', '2025-12-14 10:11:44', NULL),
(48, 18, 'doller2', 'inventory_items', 'CREATE', 69, 'Created inventory item', '2025-12-14 10:12:06', NULL),
(49, 18, 'doller2', 'inventory_items', 'CREATE', 70, 'Created inventory item', '2025-12-14 10:12:48', NULL),
(50, 18, 'doller2', 'inventory_items', 'CREATE', 71, 'Created inventory item', '2025-12-14 10:13:07', NULL),
(51, 18, 'doller2', 'inventory_items', 'CREATE', 72, 'Created inventory item', '2025-12-14 10:13:38', NULL),
(52, 18, 'doller2', 'finishes', 'CREATE', 4, 'Created finish', '2025-12-14 10:14:16', NULL),
(53, 18, 'doller2', 'finishes', 'CREATE', 5, 'Created finish', '2025-12-14 10:14:28', NULL),
(54, 18, 'doller2', 'finishes', 'CREATE', 6, 'Created finish', '2025-12-14 10:14:38', NULL),
(55, 18, 'doller2', 'finishes', 'CREATE', 7, 'Created finish', '2025-12-14 10:14:48', NULL),
(56, 18, 'doller2', 'finishes', 'CREATE', 8, 'Created finish', '2025-12-14 10:15:00', NULL),
(57, 18, 'doller2', 'finishes', 'CREATE', 9, 'Created finish', '2025-12-14 10:15:06', NULL),
(58, 18, 'doller2', 'transport', 'CREATE', 4, 'Created transport EAGLE', '2025-12-14 10:15:32', NULL),
(59, 18, 'doller2', 'pati', 'CREATE', 6, 'Created PATI record', '2025-12-14 10:15:42', NULL),
(60, 18, 'doller2', 'pati', 'CREATE', 7, 'Created PATI record', '2025-12-14 10:15:53', NULL),
(61, 18, 'doller2', 'contacts', 'CREATE', 68, 'Created contact', '2025-12-14 10:16:30', NULL),
(62, 18, 'doller2', 'inventory_items', 'CREATE', 73, 'Created inventory item', '2025-12-14 10:16:59', NULL),
(63, 18, 'doller2', 'inventory_items', 'CREATE', 74, 'Created inventory item', '2025-12-14 10:17:17', NULL),
(64, 18, 'doller2', 'inventory_items', 'CREATE', 75, 'Created inventory item', '2025-12-14 10:17:37', NULL),
(65, 18, 'doller2', 'inventory_items', 'UPDATE', 75, 'Updated inventory item', '2025-12-14 10:18:02', '{\"user\": {\"new\": \"DEEP\", \"old\": null}, \"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 3.4, \"old\": \"3.40\"}, \"labour\": {\"new\": 50, \"old\": \"50.00\"}, \"rate_kg\": {\"new\": 50, \"old\": \"50.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 14.17, \"old\": \"14.17\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(66, 18, 'doller2', 'sales_orders', 'CREATE', 31, 'Created sales order', '2025-12-14 10:18:51', NULL),
(67, 18, 'doller2', 'sales_orders', 'DELETE', 31, 'Deleted sales order', '2025-12-14 10:19:18', NULL),
(68, 18, 'doller2', 'inventory_items', 'UPDATE', 69, 'Updated inventory item', '2025-12-14 10:21:34', '{\"user\": {\"new\": \"TISA\", \"old\": null}, \"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 3.3, \"old\": \"3.30\"}, \"labour\": {\"new\": 70, \"old\": \"70.00\"}, \"rate_kg\": {\"new\": 70, \"old\": \"70.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 19.25, \"old\": \"19.25\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(69, 18, 'doller2', 'inventory_items', 'CREATE', 76, 'Created inventory item', '2025-12-14 10:25:12', NULL),
(70, 18, 'doller2', 'inventory_items', 'CREATE', 78, 'Created inventory item', '2025-12-14 10:26:15', NULL),
(71, 18, 'doller2', 'inventory_items', 'CREATE', 79, 'Created inventory item', '2025-12-14 10:27:35', NULL),
(72, 18, 'doller2', 'inventory_items', 'CREATE', 80, 'Created inventory item', '2025-12-14 10:28:28', NULL),
(73, 18, 'doller2', 'inventory_items', 'CREATE', 81, 'Created inventory item', '2025-12-14 10:29:56', NULL),
(74, 18, 'doller2', 'inventory_items', 'CREATE', 82, 'Created inventory item', '2025-12-14 10:30:57', NULL),
(75, 18, 'doller2', 'inventory_items', 'CREATE', 83, 'Created inventory item', '2025-12-14 10:31:56', NULL),
(76, 18, 'doller2', 'inventory_items', 'CREATE', 84, 'Created inventory item', '2025-12-14 10:32:50', NULL),
(77, 18, 'doller2', 'sales_orders', 'CREATE', 32, 'Created sales order', '2025-12-14 10:34:13', NULL),
(78, 18, 'doller2', 'sales_orders', 'UPDATE', 32, 'Updated sales order', '2025-12-14 10:34:35', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 1.86, \"old\": \"1.86\"}, \"kg_dzn\": {\"new\": 0.9, \"old\": \"0.90\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"1.00\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 52.5, \"old\": \"52.50\"}, \"total_kg\": {\"new\": 86.4, \"old\": \"43.20\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-01\"}, \"quantity_pcs\": {\"new\": 1152, \"old\": null}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(79, 18, 'doller2', 'sales_orders', 'UPDATE', 32, 'Updated sales order', '2025-12-14 10:34:52', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 1.86, \"old\": \"1.86\"}, \"kg_dzn\": {\"new\": 0.9, \"old\": \"0.90\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 52.5, \"old\": \"52.50\"}, \"total_kg\": {\"new\": 86.4, \"old\": \"86.40\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"order_number\": {\"new\": 2, \"old\": 1}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(80, 18, 'doller2', 'sales_orders', 'UPDATE', 32, 'Updated sales order', '2025-12-14 10:35:00', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 1.86, \"old\": \"1.86\"}, \"kg_dzn\": {\"new\": 0.9, \"old\": \"0.90\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 52.5, \"old\": \"52.50\"}, \"total_kg\": {\"new\": 86.4, \"old\": \"86.40\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(81, 18, 'doller2', 'sales_orders', 'UPDATE', 32, 'Updated sales order', '2025-12-14 10:35:10', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 1.86, \"old\": \"1.86\"}, \"kg_dzn\": {\"new\": 0.9, \"old\": \"0.90\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 52.5, \"old\": \"52.50\"}, \"total_kg\": {\"new\": 86.4, \"old\": \"86.40\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(82, 18, 'doller2', 'sales_orders', 'UPDATE', 32, 'Updated sales order', '2025-12-14 10:35:17', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 1.86, \"old\": \"1.86\"}, \"kg_dzn\": {\"new\": 0.9, \"old\": \"0.90\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 52.5, \"old\": \"52.50\"}, \"total_kg\": {\"new\": 86.4, \"old\": \"86.40\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(83, 18, 'doller2', 'sales_orders', 'CREATE', 33, 'Created sales order', '2025-12-14 10:35:41', NULL),
(84, 18, 'doller2', 'sales_orders', 'DELETE', 32, 'Deleted sales order (batch)', '2025-12-14 10:35:51', NULL),
(85, 18, 'doller2', 'sales_orders', 'CREATE', 34, 'Created sales order', '2025-12-14 10:36:20', NULL),
(86, 18, 'doller2', 'sales_orders', 'UPDATE', 33, 'Updated sales order', '2025-12-14 10:36:29', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.07, \"old\": \"2.07\"}, \"kg_dzn\": {\"new\": 1, \"old\": \"1.00\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2.6, \"old\": \"2.60\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 58.33, \"old\": \"58.33\"}, \"total_kg\": {\"new\": 125, \"old\": \"125.00\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(87, 18, 'doller2', 'sales_orders', 'UPDATE', 33, 'Updated sales order', '2025-12-14 10:36:46', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.07, \"old\": \"2.07\"}, \"kg_dzn\": {\"new\": 1, \"old\": \"1.00\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2.6, \"old\": \"2.60\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 58.33, \"old\": \"58.33\"}, \"total_kg\": {\"new\": 125, \"old\": \"125.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(88, 18, 'doller2', 'sales_orders', 'UPDATE', 33, 'Updated sales order', '2025-12-14 10:37:02', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.07, \"old\": \"2.07\"}, \"kg_dzn\": {\"new\": 1, \"old\": \"1.00\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2.6, \"old\": \"2.60\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 58.33, \"old\": \"58.33\"}, \"total_kg\": {\"new\": 125, \"old\": \"125.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(89, 18, 'doller2', 'sales_orders', 'UPDATE', 33, 'Updated sales order', '2025-12-14 10:37:42', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.07, \"old\": \"2.07\"}, \"kg_dzn\": {\"new\": 1, \"old\": \"1.00\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2.6, \"old\": \"2.60\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 58.33, \"old\": \"58.33\"}, \"total_kg\": {\"new\": 125, \"old\": \"125.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(90, 18, 'doller2', 'sales_orders', 'UPDATE', 33, 'Updated sales order', '2025-12-14 10:38:02', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.07, \"old\": \"2.07\"}, \"kg_dzn\": {\"new\": 1, \"old\": \"1.00\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2.6, \"old\": \"2.60\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 58.33, \"old\": \"58.33\"}, \"total_kg\": {\"new\": 125, \"old\": \"125.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(91, 18, 'doller2', 'sales_orders', 'DELETE', 33, 'Deleted sales order', '2025-12-14 10:38:08', NULL),
(92, 18, 'doller2', 'sales_orders', 'CREATE', 35, 'Created sales order', '2025-12-14 10:38:42', NULL),
(93, 18, 'doller2', 'sales_orders', 'CREATE', 36, 'Created sales order', '2025-12-14 10:39:27', NULL),
(94, 18, 'doller2', 'sales_orders', 'CREATE', 37, 'Created sales order', '2025-12-14 10:40:25', NULL),
(95, 18, 'doller2', 'sales_orders', 'UPDATE', 37, 'Updated sales order', '2025-12-14 10:40:32', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 760, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 304, \"old\": \"304.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(96, 18, 'doller2', 'sales_orders', 'UPDATE', 37, 'Updated sales order', '2025-12-14 10:40:45', '{\"scrap\": {\"new\": 0, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 140, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 56, \"old\": \"304.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(97, 18, 'doller2', 'sales_orders', 'DELETE', 37, 'Deleted sales order', '2025-12-14 10:40:58', NULL),
(98, 18, 'doller2', 'sales_orders', 'CREATE', 38, 'Created sales order', '2025-12-14 10:41:16', NULL),
(99, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order', '2025-12-14 10:42:03', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 0, \"old\": null}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 140, \"old\": \"140.00\"}, \"rate_pcs\": {\"new\": 56, \"old\": \"56.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(100, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order', '2025-12-14 10:42:09', '{\"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 140, \"old\": \"140.00\"}, \"rate_pcs\": {\"new\": 56, \"old\": \"56.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(101, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order', '2025-12-14 10:43:21', '{\"scrap\": {\"new\": 620, \"old\": \"0.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 760, \"old\": \"140.00\"}, \"rate_pcs\": {\"new\": 304, \"old\": \"56.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"order_number\": {\"new\": 2, \"old\": 1}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(102, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order', '2025-12-14 10:43:34', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 760, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 304, \"old\": \"304.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(103, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order (batch)', '2025-12-14 10:43:59', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 760, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 304, \"old\": \"304.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(104, 18, 'doller2', 'sales_orders', 'UPDATE', 38, 'Updated sales order', '2025-12-14 10:44:09', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 140, \"old\": \"140.00\"}, \"qty_ctn\": {\"new\": 2.4, \"old\": \"2.40\"}, \"rate_kz\": {\"new\": 760, \"old\": \"760.00\"}, \"rate_pcs\": {\"new\": 304, \"old\": \"304.00\"}, \"total_kg\": {\"new\": 96, \"old\": \"96.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(105, 18, 'doller2', 'sales_orders', 'DELETE', 38, 'Deleted sales order', '2025-12-14 10:44:21', NULL),
(106, 18, 'doller2', 'sales_orders', 'CREATE', 39, 'Created sales order', '2025-12-14 10:46:30', NULL),
(107, 18, 'doller2', 'sales_orders', 'DELETE', 39, 'Deleted sales order', '2025-12-14 10:52:01', NULL),
(108, 18, 'doller2', 'sales_orders', 'CREATE', 40, 'Created sales order', '2025-12-14 10:52:27', NULL),
(109, 18, 'doller2', 'sales_orders', 'CREATE', 41, 'Created sales order', '2025-12-14 10:53:56', NULL),
(110, 18, 'doller2', 'sales_orders', 'CREATE', 42, 'Created sales order', '2025-12-14 10:54:24', NULL),
(111, 18, 'doller2', 'sales_orders', 'CREATE', 43, 'Created sales order', '2025-12-14 10:54:51', NULL),
(112, 18, 'doller2', 'sales_orders', 'CREATE', 44, 'Created sales order', '2025-12-14 10:55:18', NULL),
(113, 18, 'doller2', 'sales_orders', 'DELETE', 44, 'Deleted sales order', '2025-12-14 10:55:26', NULL),
(114, 18, 'doller2', 'master_items', 'UPDATE', 13, 'Updated master item', '2025-12-14 10:55:40', '{\"kg_dz\": {\"new\": 3.4, \"old\": \"3.40\"}, \"item_code\": {\"new\": \"S5118532H//3.400\", \"old\": \"S5118532H\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(115, 18, 'doller2', 'inventory_items', 'UPDATE', 82, 'Updated inventory item', '2025-12-14 10:56:25', '{\"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 1.46, \"old\": \"1.46\"}, \"kg_dzn\": {\"new\": 3.4, \"old\": \"3.40\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"rate_kg\": {\"new\": 100, \"old\": \"100.00\"}, \"empty_wt\": {\"new\": 0.05, \"old\": \"0.05\"}, \"rate_pcs\": {\"new\": 28.33, \"old\": \"28.33\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.04, \"old\": \"0.04\"}, \"item_code\": {\"new\": \"S5118532H//3.400\", \"old\": \"S5118532H\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(116, 18, 'doller2', 'inventory_items', 'UPDATE', 75, 'Updated inventory item', '2025-12-14 10:56:30', '{\"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 3.4, \"old\": \"3.40\"}, \"labour\": {\"new\": 50, \"old\": \"50.00\"}, \"rate_kg\": {\"new\": 50, \"old\": \"50.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 14.17, \"old\": \"14.17\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"item_code\": {\"new\": \"S5118532H//3.400\", \"old\": \"S5118532H\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(117, 18, 'doller2', 'inventory_items', 'UPDATE', 67, 'Updated inventory item', '2025-12-14 10:56:36', '{\"scrap\": {\"new\": 0, \"old\": \"0.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 3.4, \"old\": \"3.40\"}, \"labour\": {\"new\": 60, \"old\": \"60.00\"}, \"rate_kg\": {\"new\": 60, \"old\": \"60.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 17, \"old\": \"17.00\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"item_code\": {\"new\": \"S5118532H//3.400\", \"old\": \"S5118532H\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.00\"}}'),
(118, 18, 'doller2', 'sales_orders', 'CREATE', 45, 'Created sales order', '2025-12-14 10:57:42', NULL),
(119, 18, 'doller2', 'sales_orders', 'DELETE', 45, 'Deleted sales order', '2025-12-14 10:57:51', NULL),
(120, 18, 'doller2', 'purchase_invoices', 'CREATE', 1, 'Created purchase invoice 12-003', '2025-12-14 11:01:38', NULL),
(121, 18, 'doller2', 'purchase_invoices', 'CREATE', 2, 'Created purchase invoice 12-009', '2025-12-14 11:04:03', NULL),
(122, 18, 'doller2', 'purchase_invoices', 'CREATE', 3, 'Created purchase invoice 12=006', '2025-12-14 11:06:25', NULL),
(123, 18, 'doller2', 'purchase_invoices', 'UPDATE', 3, 'Updated purchase invoice', '2025-12-14 11:06:36', '{\"user\": {\"new\": \"DEEP\", \"old\": \"AKSH\"}, \"due_date\": {\"new\": \"2025-12-15\", \"old\": \"2025-12-15T00:00:00.000Z\"}}'),
(124, 18, 'doller2', 'purchase_invoices', 'UPDATE', 3, 'Updated purchase invoice', '2025-12-14 11:07:28', '{\"due_date\": {\"new\": \"2025-12-15\", \"old\": \"2025-12-15T00:00:00.000Z\"}, \"invoice_number\": {\"new\": \"12006\", \"old\": \"12=006\"}}'),
(125, 18, 'doller2', 'purchase_invoices', 'UPDATE', 3, 'Updated purchase invoice', '2025-12-14 11:07:58', '{\"due_date\": {\"new\": \"2025-12-15\", \"old\": \"2025-12-15T00:00:00.000Z\"}}'),
(126, 18, 'doller2', 'sales_orders', 'UPDATE', 43, 'Updated sales order', '2025-12-14 11:38:12', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 608, \"old\": \"608.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 708, \"old\": \"708.00\"}, \"rate_pcs\": {\"new\": 283.2, \"old\": \"283.20\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"TISA\", \"old\": null}}'),
(127, 18, 'doller2', 'sales_orders', 'DELETE', 43, 'Deleted sales order (batch)', '2025-12-14 11:38:27', NULL),
(128, 18, 'doller2', 'sales_orders', 'DELETE', 42, 'Deleted sales order (batch)', '2025-12-14 11:38:27', NULL),
(129, 18, 'doller2', 'sales_orders', 'DELETE', 41, 'Deleted sales order (batch)', '2025-12-14 11:38:27', NULL),
(130, 18, 'doller2', 'sales_orders', 'CREATE', 46, 'Created sales order', '2025-12-14 11:38:45', NULL),
(131, 18, 'doller2', 'sales_orders', 'DELETE', 46, 'Deleted sales order', '2025-12-14 11:39:08', NULL),
(132, 18, 'doller2', 'sales_orders', 'CREATE', 47, 'Created sales order', '2025-12-14 11:40:04', NULL),
(133, 18, 'doller2', 'sales_orders', 'CREATE', 48, 'Created sales order', '2025-12-14 11:40:31', NULL),
(134, 18, 'doller2', 'sales_orders', 'CREATE', 49, 'Created sales order', '2025-12-14 11:41:01', NULL),
(135, 18, 'doller2', 'contacts', 'CREATE', 69, 'Created contact', '2025-12-14 11:57:09', NULL),
(136, 18, 'doller2', 'master_items', 'CREATE', 21, 'Created master item', '2025-12-14 11:58:08', NULL),
(137, 18, 'doller2', 'inventory_items', 'CREATE', 85, 'Created inventory item', '2025-12-14 11:59:04', NULL),
(138, 18, 'doller2', 'order_stock', 'CREATE', 4, 'Created order stock', '2025-12-14 12:00:57', NULL),
(139, 18, 'doller2', 'order_stock', 'CREATE', 5, 'Created order stock', '2025-12-14 12:00:57', NULL),
(140, 18, 'doller2', 'order_stock', 'CREATE', 6, 'Created order stock', '2025-12-14 12:00:57', NULL),
(141, 18, 'doller2', 'order_stock', 'CREATE', 7, 'Created order stock', '2025-12-14 12:00:57', NULL),
(142, 18, 'doller2', 'order_stock', 'DELETE', 5, 'Deleted order stock', '2025-12-14 12:01:01', NULL),
(143, 18, 'doller2', 'order_stock', 'DELETE', 6, 'Deleted order stock', '2025-12-14 12:01:04', NULL),
(144, 18, 'doller2', 'order_stock', 'UPDATE', 7, 'Updated order stock', '2025-12-14 12:01:11', '{\"order_stock\": {\"new\": \"STOCK\", \"old\": \"PLAN\"}}'),
(145, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-14 14:56:35', NULL),
(146, 18, 'doller2', 'sales_orders', 'UPDATE', 34, 'Updated sales order', '2025-12-14 15:01:49', '{\"note\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.28, \"old\": \"2.28\"}, \"kg_dzn\": {\"new\": 1.1, \"old\": \"1.10\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 3.33, \"old\": \"3.33\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 64.17, \"old\": \"64.17\"}, \"total_kg\": {\"new\": 110, \"old\": \"110.00\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"order_date\": {\"old\": \"2025-12-01\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(147, 18, 'doller2', 'sales_orders', 'UPDATE', 34, 'Updated sales order', '2025-12-14 15:02:30', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.28, \"old\": \"2.28\"}, \"kg_dzn\": {\"new\": 1.1, \"old\": \"1.10\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 3.33, \"old\": \"3.33\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 64.17, \"old\": \"64.17\"}, \"total_kg\": {\"new\": 110, \"old\": \"110.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(148, 18, 'doller2', 'sales_orders', 'UPDATE', 49, 'Updated sales order', '2025-12-14 15:52:46', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 720, \"old\": \"720.00\"}, \"rate_pcs\": {\"new\": 288, \"old\": \"288.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 485.11, \"old\": \"485.11\"}, \"order_date\": {\"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(149, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-14 18:05:53', NULL),
(150, 18, 'doller2', 'employees', 'UPDATE', 9, 'Updated employee ID: 9', '2025-12-14 18:12:21', NULL),
(151, 18, 'doller2', 'sales_orders', 'UPDATE', 49, 'Updated sales order', '2025-12-14 18:26:34', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 720, \"old\": \"720.00\"}, \"rate_pcs\": {\"new\": 288, \"old\": \"288.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 485.11, \"old\": \"485.11\"}, \"order_date\": {\"new\": \"2025-12-14\", \"old\": null}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(152, 18, 'doller2', 'sales_orders', 'UPDATE', 49, 'Updated sales order', '2025-12-14 18:48:13', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 720, \"old\": \"720.00\"}, \"rate_pcs\": {\"new\": 288, \"old\": \"288.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 485.11, \"old\": \"485.11\"}, \"order_date\": {\"new\": \"2025-12-13\", \"old\": \"2025-12-14\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(153, 18, 'doller2', 'sales_orders', 'UPDATE', 49, 'Updated sales order', '2025-12-14 18:48:23', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 720, \"old\": \"720.00\"}, \"rate_pcs\": {\"new\": 288, \"old\": \"288.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 485.11, \"old\": \"485.11\"}, \"order_date\": {\"new\": \"2025-12-14\", \"old\": \"2025-12-13\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(154, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2025-12-15 09:38:22', NULL),
(155, 18, 'doller2', 'carton_inventory', 'CREATE', 5, 'Created carton CTN', '2025-12-15 09:41:02', NULL),
(156, 18, 'doller2', 'sales_orders', 'UPDATE', 49, 'Updated sales order', '2025-12-15 09:47:46', '{\"scrap\": {\"new\": 620, \"old\": \"620.00\"}, \"finish\": {\"new\": \"SS\", \"old\": \"\"}, \"kg_box\": {\"new\": 2.05, \"old\": \"2.05\"}, \"kg_dzn\": {\"new\": 4.8, \"old\": \"4.80\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 720, \"old\": \"720.00\"}, \"rate_pcs\": {\"new\": 288, \"old\": \"288.00\"}, \"total_kg\": {\"new\": 80, \"old\": \"80.00\"}, \"stock_qty\": {\"new\": 485.11, \"old\": \"485.11\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(157, 18, 'doller2', 'sales_orders', 'UPDATE', 34, 'Updated sales order', '2025-12-15 09:48:04', '{\"scrap\": {\"new\": 600, \"old\": \"600.00\"}, \"kg_box\": {\"new\": 2.28, \"old\": \"2.28\"}, \"kg_dzn\": {\"new\": 1.1, \"old\": \"1.10\"}, \"labour\": {\"new\": 100, \"old\": \"100.00\"}, \"qty_ctn\": {\"new\": 3.33, \"old\": \"3.33\"}, \"rate_kz\": {\"new\": 700, \"old\": \"700.00\"}, \"rate_pcs\": {\"new\": 64.17, \"old\": \"64.17\"}, \"total_kg\": {\"new\": 110, \"old\": \"110.00\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"order_date\": {\"new\": \"2025-12-14\", \"old\": null}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(158, 18, 'doller2', 'invoices', 'CREATE', 64, 'Created invoice 6565', '2025-12-15 09:56:06', NULL),
(159, 18, 'doller2', 'employee_advances', 'CREATE', 1, 'Created advance payment of ₹500 for employee: ASAD', '2025-12-16 19:20:18', NULL),
(160, 18, 'doller2', 'employee_advance_repayments', 'CREATE', 2147483647, 'Added repayment of ₹200 for employee: ASAD', '2025-12-16 19:34:45', NULL),
(161, 18, 'doller2', 'employee_advances', 'CREATE', 2, 'Created advance payment of ₹500 for employee: ASAD', '2025-12-16 19:49:08', NULL),
(162, 18, 'doller2', 'employee_advance_repayments', 'CREATE', 2147483647, 'Added repayment of ₹150 for employee: ASAD', '2025-12-16 19:49:19', NULL),
(163, 18, 'doller2', 'invoices', 'CREATE', 65, 'Created invoice inv0123', '2025-12-16 19:53:46', NULL),
(164, 18, 'doller2', 'employees', 'CREATE', 12, 'Created new employee: demeo@12w', '2025-12-18 18:33:39', NULL),
(165, 18, 'doller2', 'employees', 'DELETE', 12, 'Deleted employee ID: 12', '2025-12-18 18:34:10', NULL),
(166, 18, 'doller2', 'employees', 'DELETE', 9, 'Deleted employee ID: 9', '2025-12-18 18:34:14', NULL),
(167, 18, 'doller2', 'employees', 'DELETE', 11, 'Deleted employee ID: 11', '2025-12-18 18:34:32', NULL),
(168, 18, 'doller2', 'carton_inventory', 'CREATE', 8, 'Created carton CTN A', '2025-12-28 17:36:12', NULL),
(169, 18, 'doller2', 'carton_inventory', 'CREATE', 9, 'Created carton CTN 1', '2025-12-28 17:37:16', NULL),
(170, 18, 'doller2', 'contacts', 'UPDATE', 68, 'Updated contact', '2025-12-28 18:00:50', NULL),
(171, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-28 18:59:55', NULL),
(172, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-28 19:00:01', NULL),
(173, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-28 19:00:04', NULL),
(174, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-28 19:00:07', NULL),
(175, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:22', NULL),
(176, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:26', NULL),
(177, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:30', NULL),
(178, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:35', NULL),
(179, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:39', NULL),
(180, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:44', NULL),
(181, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-28 19:00:56', NULL),
(182, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 18:57:19', NULL),
(183, 18, 'doller2', 'contacts', 'UPDATE', 66, 'Updated contact', '2025-12-29 18:57:24', NULL),
(184, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 18:57:55', NULL),
(185, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 18:57:59', NULL),
(186, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 19:03:22', NULL),
(187, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 19:03:25', NULL),
(188, 18, 'doller2', 'contacts', 'UPDATE', 67, 'Updated contact', '2025-12-29 19:03:29', NULL),
(189, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:08:44', NULL),
(190, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:08:46', NULL),
(191, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:08:53', NULL),
(192, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:11:36', NULL),
(193, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:16:26', NULL),
(194, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:23', NULL),
(195, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:24', NULL),
(196, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:25', NULL),
(197, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:26', NULL),
(198, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:34', NULL),
(199, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:19:40', NULL),
(200, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:20:48', NULL),
(201, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:20:48', NULL),
(202, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:20:56', NULL),
(203, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2025-12-29 19:20:56', NULL),
(204, 18, 'doller2', 'receipts', 'CREATE', 15, 'Created receipt', '2025-12-29 19:22:14', NULL),
(205, 18, 'doller2', 'payments', 'CREATE', 2, 'Created payment', '2025-12-29 19:22:48', NULL),
(206, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:17:41', NULL),
(207, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:17:44', NULL),
(208, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:20:09', NULL),
(209, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:20:17', NULL),
(210, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:21:25', NULL),
(211, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:21:28', NULL),
(212, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:26:09', NULL),
(213, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:26:13', NULL),
(214, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:58:06', NULL),
(215, 18, 'doller2', 'contacts', 'UPDATE', 68, 'Updated contact', '2026-01-01 07:58:10', NULL),
(216, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 07:58:18', NULL),
(217, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 08:01:21', NULL),
(218, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 08:01:23', NULL),
(219, 18, 'doller2', 'contacts', 'UPDATE', 69, 'Updated contact', '2026-01-01 11:14:07', NULL),
(220, 18, 'doller2', 'invoices', 'UPDATE', 65, 'Updated invoice', '2026-03-01 07:10:27', '{\"invoice_date\":{\"old\":\"2025-12-15T18:30:00.000Z\",\"new\":\"2025-12-15\"},\"reference_no_1\":{\"old\":\"REF-001\",\"new\":\"\"},\"reference_no_2\":{\"old\":\"17604.13\",\"new\":\"17660.13\"},\"sub_total\":{\"old\":\"14918.75\",\"new\":14918.75},\"gst_amount\":{\"old\":\"2685.38\",\"new\":2685.38},\"other_charge\":{\"old\":null,\"new\":\"51651\"},\"other_charge_amount\":{\"old\":\"0.00\",\"new\":56},\"grand_total\":{\"old\":\"17604.13\",\"new\":17660.13}}'),
(221, 18, 'doller2', 'carton_inventory', 'CREATE', 10, 'Created carton CTNDEMO', '2026-03-06 08:45:33', NULL),
(222, 18, 'doller2', 'sales_orders', 'CREATE', 50, 'Created sales order', '2026-03-09 17:14:40', NULL),
(223, 18, 'doller2', 'invoices', 'CREATE', 66, 'Created invoice 22', '2026-03-09 17:16:01', NULL),
(224, 18, 'doller2', 'invoices', 'CREATE', 67, 'Created invoice 323', '2026-03-09 17:17:24', NULL),
(225, 18, 'doller2', 'invoices', 'CREATE', 68, 'Created invoice 032131', '2026-03-09 17:19:05', NULL),
(226, 18, 'doller2', 'sales_orders', 'CREATE', 51, 'Created sales order', '2026-03-09 17:24:46', NULL),
(227, 18, 'doller2', 'invoices', 'CREATE', 69, 'Created invoice 121', '2026-03-09 17:25:44', NULL),
(228, 18, 'doller2', 'invoices', 'CREATE', 70, 'Created invoice 232', '2026-03-09 17:27:22', NULL),
(229, 18, 'doller2', 'purchase_invoices', 'CREATE', 4, 'Created purchase invoice lmlklk', '2026-03-09 17:28:42', NULL),
(230, 18, 'doller2', 'purchase_invoices', 'CREATE', 5, 'Created purchase invoice 541', '2026-03-09 17:30:40', NULL),
(231, 18, 'doller2', 'sales_orders', 'DELETE', 51, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(232, 18, 'doller2', 'sales_orders', 'DELETE', 50, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(233, 18, 'doller2', 'sales_orders', 'DELETE', 49, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(234, 18, 'doller2', 'sales_orders', 'DELETE', 48, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(235, 18, 'doller2', 'sales_orders', 'DELETE', 47, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(236, 18, 'doller2', 'sales_orders', 'DELETE', 40, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(237, 18, 'doller2', 'sales_orders', 'DELETE', 36, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(238, 18, 'doller2', 'sales_orders', 'DELETE', 35, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(239, 18, 'doller2', 'sales_orders', 'DELETE', 34, 'Deleted sales order (batch)', '2026-03-09 17:30:57', NULL),
(240, 18, 'doller2', 'sales_orders', 'CREATE', 52, 'Created sales order', '2026-03-09 17:31:32', NULL),
(241, 18, 'doller2', 'sales_orders', 'UPDATE', 52, 'Updated sales order', '2026-03-09 17:32:10', '{\"order_number\":{\"old\":1,\"new\":2},\"customer_name\":{\"old\":null,\"new\":\"\"},\"stock_qty\":{\"old\":\"482.70\",\"new\":482.7},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"100.00\",\"new\":100},\"kg_dzn\":{\"old\":\"0.90\",\"new\":0.9},\"kg_box\":{\"old\":\"1.86\",\"new\":1.86},\"qty_ctn\":{\"old\":\"0.17\",\"new\":0.17},\"total_kg\":{\"old\":\"7.50\",\"new\":7.5},\"rate_pcs\":{\"old\":\"8.25\",\"new\":8.25},\"rate_kz\":{\"old\":\"110.00\",\"new\":110}}'),
(242, 18, 'doller2', 'invoices', 'DELETE', 70, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(243, 18, 'doller2', 'invoices', 'DELETE', 69, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(244, 18, 'doller2', 'invoices', 'DELETE', 68, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(245, 18, 'doller2', 'invoices', 'DELETE', 67, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(246, 18, 'doller2', 'invoices', 'DELETE', 66, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(247, 18, 'doller2', 'invoices', 'DELETE', 65, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(248, 18, 'doller2', 'invoices', 'DELETE', 64, 'Deleted invoice (batch)', '2026-03-09 17:33:04', NULL),
(249, 18, 'doller2', 'sales_orders', 'CREATE', 53, 'Created sales order', '2026-03-09 17:33:46', NULL),
(250, 18, 'doller2', 'inventory_items', 'CREATE', 86, 'Created inventory item', '2026-03-09 17:36:56', NULL),
(251, 18, 'doller2', 'sales_orders', 'DELETE', 53, 'Deleted sales order (batch)', '2026-03-09 17:37:48', NULL),
(252, 18, 'doller2', 'sales_orders', 'DELETE', 52, 'Deleted sales order (batch)', '2026-03-09 17:37:48', NULL),
(253, 18, 'doller2', 'sales_orders', 'CREATE', 54, 'Created sales order', '2026-03-09 17:38:12', NULL),
(254, 18, 'doller2', 'inventory_items', 'UPDATE', 86, 'Updated inventory item', '2026-03-09 17:38:29', '{\"stock_quantity\":{\"old\":\"10.00\",\"new\":450},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"120.00\",\"new\":120},\"kg_dzn\":{\"old\":\"0.90\",\"new\":0.9},\"kg_box\":{\"old\":\"210.00\",\"new\":210},\"empty_wt\":{\"old\":\"120.00\",\"new\":120},\"actual_wt\":{\"old\":\"10.00\",\"new\":10},\"rate_pcs\":{\"old\":\"9.75\",\"new\":9.75},\"rate_kg\":{\"old\":\"130.00\",\"new\":130},\"total_kg\":{\"old\":\"120.00\",\"new\":120},\"actual_net_kg\":{\"old\":\"120.00\",\"new\":120}}'),
(255, 18, 'doller2', 'sales_orders', 'CREATE', 55, 'Created sales order', '2026-03-09 17:40:07', NULL),
(256, 18, 'doller2', 'inventory_items', 'CREATE', 87, 'Created inventory item', '2026-03-09 17:40:46', NULL),
(257, 18, 'doller2', 'inventory_items', 'UPDATE', 87, 'Updated inventory item', '2026-03-09 17:40:53', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":120},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"1.10\",\"new\":1.1},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"empty_wt\":{\"old\":\"10.00\",\"new\":10},\"actual_wt\":{\"old\":\"10.00\",\"new\":10},\"rate_pcs\":{\"old\":\"1.83\",\"new\":1.83},\"rate_kg\":{\"old\":\"20.00\",\"new\":20},\"total_kg\":{\"old\":\"10.00\",\"new\":10},\"actual_net_kg\":{\"old\":\"10.00\",\"new\":10}}'),
(258, 18, 'doller2', 'payments', 'CREATE', 3, 'Created payment', '2026-03-10 05:47:49', NULL),
(259, 18, 'doller2', 'payments', 'CREATE', 4, 'Created payment', '2026-03-10 05:48:23', NULL),
(260, 18, 'doller2', 'contacts', 'DELETE', 67, 'Deleted contact (batch)', '2026-03-15 14:59:26', NULL),
(261, 18, 'doller2', 'contacts', 'DELETE', 69, 'Deleted contact (batch)', '2026-03-15 14:59:36', NULL),
(262, 18, 'doller2', 'receipts', 'DELETE', 15, 'Deleted receipt (batch)', '2026-03-15 14:59:41', NULL),
(263, 18, 'doller2', 'payments', 'DELETE', 4, 'Deleted payment (batch)', '2026-03-15 14:59:45', NULL),
(264, 18, 'doller2', 'contacts', 'DELETE', 66, 'Deleted contact (batch)', '2026-03-15 15:02:58', NULL),
(265, 18, 'doller2', 'sales_orders', 'UPDATE', 55, 'Updated sales order (batch)', '2026-03-17 05:47:35', '{\"scrap\":{\"old\":\"10.00\",\"new\":\"20\"},\"rate_kz\":{\"old\":\"130.00\",\"new\":140},\"rate_pcs\":{\"old\":\"9.75\",\"new\":10.5},\"order_date\":{\"old\":\"2026-03-09\"}}'),
(266, 18, 'doller2', 'payments', 'DELETE', NULL, 'Deleted payments by contact_id 64 (1 payments, 2 purchase invoices)', '2026-03-17 05:49:48', NULL),
(267, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-03-17 12:09:50', NULL),
(268, 18, 'doller2', 'inventory_items', 'CREATE', 88, 'Created inventory item', '2026-03-17 12:14:11', NULL),
(269, 18, 'doller2', 'inventory_items', 'CREATE', 89, 'Created inventory item', '2026-03-17 12:19:12', NULL),
(270, 18, 'doller2', 'contacts', 'CREATE', 70, 'Created contact', '2026-03-17 12:38:14', NULL);
INSERT INTO `user_activity` (`id`, `user_id`, `user_name`, `model_name`, `action_type`, `record_id`, `description`, `created_at`, `changes`) VALUES
(271, 18, 'doller2', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for KADE (created: 0, skipped: 0, failed: 6)', '2026-03-17 12:39:46', NULL),
(272, 18, 'doller2', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for KADE (created: 0, skipped: 0, failed: 6)', '2026-03-17 12:40:09', NULL),
(273, 18, 'doller2', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for KADE (created: 6, skipped: 0, failed: 0)', '2026-03-17 12:42:47', NULL),
(274, 18, 'doller2', 'sales_orders', 'CREATE', 56, 'Created sales order', '2026-03-21 19:30:56', NULL),
(275, 18, 'doller2', 'sales_orders', 'CREATE', 57, 'Created sales order', '2026-03-21 19:35:23', NULL),
(276, 18, 'doller2', 'sales_orders', 'UPDATE', 57, 'Updated sales order', '2026-03-21 19:36:13', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"finish\":{\"old\":null,\"new\":\"SS\"},\"stock_qty\":{\"old\":\"-24.00\",\"new\":-24},\"scrap\":{\"old\":null,\"new\":0},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"10.00\",\"new\":10},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"qty_ctn\":{\"old\":null,\"new\":0},\"total_kg\":{\"old\":null,\"new\":0},\"quantity_pcs\":{\"old\":null,\"new\":0},\"manufacturer_name\":{\"old\":null,\"new\":\"\"},\"po_vr\":{\"old\":null,\"new\":\"\"},\"rate_pcs\":{\"old\":\"8.33\",\"new\":8.33},\"rate_kz\":{\"old\":\"100.00\",\"new\":100}}'),
(277, 18, 'doller2', 'invoices', 'CREATE', 71, 'Created invoice 321321131', '2026-03-21 19:36:42', NULL),
(278, 18, 'doller2', 'invoices', 'DELETE', 71, 'Undo invoice 321321131', '2026-03-21 19:38:08', NULL),
(279, 18, 'doller2', 'sales_orders', 'UPDATE', 56, 'Updated sales order', '2026-03-25 04:55:10', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"finish\":{\"old\":null,\"new\":\"SS\"},\"stock_qty\":{\"old\":null,\"new\":0},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"0.90\",\"new\":0.9},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"qty_ctn\":{\"old\":null,\"new\":0},\"total_kg\":{\"old\":null,\"new\":0},\"quantity_pcs\":{\"old\":null,\"new\":0},\"manufacturer_name\":{\"old\":null,\"new\":\"\"},\"po_vr\":{\"old\":null,\"new\":\"\"},\"rate_pcs\":{\"old\":\"1.50\",\"new\":1.5},\"rate_kz\":{\"old\":\"120.00\",\"new\":120}}'),
(280, 18, 'doller2', 'inventory_items', 'UPDATE', 93, 'Updated inventory item', '2026-03-25 04:55:31', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"finish\":{\"old\":null,\"new\":\"ANT\"},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.30\",\"new\":3.3},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"pic_or_kg\":{\"old\":null,\"new\":0}}'),
(281, 18, 'doller2', 'invoices', 'CREATE', 72, 'Created invoice 21213321', '2026-03-25 04:56:24', NULL),
(282, 18, 'doller2', 'invoices', 'UPDATE', 72, 'Updated invoice', '2026-03-25 04:59:16', '{\"invoice_date\":{\"old\":\"2026-03-24T18:30:00.000Z\",\"new\":\"2026-03-24\"},\"sub_total\":{\"old\":\"183.33\",\"new\":183.33333333333334},\"gst_amount\":{\"old\":\"0.00\",\"new\":0},\"other_charge\":{\"old\":null,\"new\":\"\"},\"other_charge_amount\":{\"old\":\"0.00\",\"new\":0},\"grand_total\":{\"old\":\"183.33\",\"new\":183.33}}'),
(283, 18, 'doller2', 'invoices', 'DELETE', 72, 'Undo invoice 21213321', '2026-03-25 05:21:36', NULL),
(284, 18, 'doller2', 'invoices', 'CREATE', 73, 'Created invoice 211313', '2026-03-25 05:25:58', NULL),
(285, 18, 'doller2', 'invoices', 'DELETE', 73, 'Undo invoice 211313', '2026-03-25 05:34:15', NULL),
(286, 18, 'doller2', 'sales_orders', 'DELETE', 57, 'Deleted sales order (batch)', '2026-03-25 05:35:16', NULL),
(287, 18, 'doller2', 'sales_orders', 'DELETE', 56, 'Deleted sales order (batch)', '2026-03-25 05:35:16', NULL),
(288, 18, 'doller2', 'sales_orders', 'DELETE', 55, 'Deleted sales order (batch)', '2026-03-25 05:35:16', NULL),
(289, 18, 'doller2', 'sales_orders', 'DELETE', 54, 'Deleted sales order (batch)', '2026-03-25 05:35:16', NULL),
(290, 18, 'doller2', 'sales_orders', 'CREATE', 58, 'Created sales order', '2026-03-25 05:36:27', NULL),
(291, 18, 'doller2', 'sales_orders', 'CREATE', 59, 'Created sales order', '2026-03-25 05:37:10', NULL),
(292, 18, 'doller2', 'invoices', 'CREATE', 74, 'Created invoice 51651', '2026-03-25 05:37:56', NULL),
(293, 18, 'doller2', 'invoices', 'DELETE', 74, 'Undo invoice 51651', '2026-03-25 05:39:17', NULL),
(294, 18, 'doller2', 'invoices', 'CREATE', 75, 'Created invoice 21121', '2026-03-25 05:41:54', NULL),
(295, 18, 'doller2', 'invoices', 'DELETE', 75, 'Undo invoice 21121', '2026-03-25 05:51:00', NULL),
(296, 18, 'doller2', 'invoices', 'CREATE', 76, 'Created invoice 332', '2026-03-25 05:51:58', NULL),
(297, 18, 'doller2', 'invoices', 'DELETE', 76, 'Undo invoice 332', '2026-03-25 05:52:13', NULL),
(298, 18, 'doller2', 'invoices', 'CREATE', 78, 'Created invoice 2121', '2026-03-25 05:54:05', NULL),
(299, 18, 'doller2', 'invoices', 'UPDATE', 78, 'Updated invoice', '2026-03-25 05:54:31', '{\"invoice_date\":{\"old\":\"2026-03-24T18:30:00.000Z\",\"new\":\"2026-03-24\"},\"reference_no_1\":{\"old\":\"10\",\"new\":\"12\"},\"reference_no_2\":{\"old\":\"1285.33\",\"new\":\"991.67\"},\"sub_total\":{\"old\":\"1283.33\",\"new\":991.6666666666667},\"gst_amount\":{\"old\":\"12.00\",\"new\":12},\"other_charge\":{\"old\":null,\"new\":\"\"},\"other_charge_amount\":{\"old\":\"0.00\",\"new\":0},\"grand_total\":{\"old\":\"1295.33\",\"new\":1003.67}}'),
(300, 18, 'doller2', 'invoices', 'UPDATE', 78, 'Updated invoice', '2026-03-25 05:55:13', '{\"invoice_date\":{\"old\":\"2026-03-23T18:30:00.000Z\",\"new\":\"2026-03-23\"},\"reference_no_1\":{\"old\":\"12\",\"new\":\"1357\"},\"reference_no_2\":{\"old\":\"991.67\",\"new\":\"5\"},\"sub_total\":{\"old\":\"991.67\",\"new\":1350},\"gst_amount\":{\"old\":\"12.00\",\"new\":12},\"other_charge_amount\":{\"old\":\"0.00\",\"new\":0},\"grand_total\":{\"old\":\"1003.67\",\"new\":1362}}'),
(301, 18, 'doller2', 'invoices', 'DELETE', 78, 'Undo invoice 2121', '2026-03-25 05:55:47', NULL),
(302, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-01 07:35:56', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"finish\":{\"old\":null,\"new\":\"\"},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"pic_or_kg\":{\"old\":null,\"new\":0}}'),
(303, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-01 07:36:42', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(304, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-01 07:38:20', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":500},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":null,\"new\":\"500\"}}'),
(305, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-01 07:38:29', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"500.00\",\"new\":510},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"500\",\"new\":\"10\"}}'),
(306, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-01 07:38:44', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"510.00\",\"new\":561},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"10\",\"new\":\"10%\"}}'),
(307, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-04 05:49:17', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"561.00\",\"new\":571},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"10%\",\"new\":\"10\"}}'),
(308, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-04 05:49:39', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"571.00\",\"new\":570},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"10\",\"new\":\"9\"}}'),
(309, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-04 05:54:21', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"570.00\",\"new\":569},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"9\",\"new\":\"8\"}}'),
(310, 18, 'doller2', 'inventory_items', 'UPDATE', 95, 'Updated inventory item', '2026-04-04 05:54:34', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"3.40\",\"new\":3.4},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"569.00\",\"new\":570},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"8\",\"new\":\"9\"}}'),
(311, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-04-09 08:50:21', NULL),
(312, 18, 'doller2', 'inventory_items', 'UPDATE', 94, 'Updated inventory item', '2026-04-09 08:52:03', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":10},\"finish\":{\"old\":null,\"new\":\"\"},\"scrap\":{\"old\":\"0.00\",\"new\":101},\"labour\":{\"old\":\"0.00\",\"new\":185},\"kg_dzn\":{\"old\":\"4.20\",\"new\":4.2},\"pcs_box\":{\"old\":0,\"new\":10},\"box_ctn\":{\"old\":0,\"new\":10},\"pcs_ctn\":{\"old\":0,\"new\":100},\"kg_box\":{\"old\":\"0.00\",\"new\":10},\"empty_wt\":{\"old\":\"0.00\",\"new\":10},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":100.1},\"rate_kg\":{\"old\":\"0.00\",\"new\":286},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"pic_or_kg\":{\"old\":null,\"new\":0}}'),
(313, 18, 'doller2', 'inventory_items', 'UPDATE', 94, 'Updated inventory item', '2026-04-09 08:52:22', '{\"stock_quantity\":{\"old\":\"10.00\",\"new\":10},\"scrap\":{\"old\":\"101.00\",\"new\":101},\"labour\":{\"old\":\"185.00\",\"new\":185},\"kg_dzn\":{\"old\":\"4.20\",\"new\":4.2},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"empty_wt\":{\"old\":\"10.00\",\"new\":10},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"100.10\",\"new\":5},\"rate_kg\":{\"old\":\"286.00\",\"new\":286},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":null,\"new\":\"5\"}}'),
(314, 18, 'doller2', 'inventory_items', 'UPDATE', 94, 'Updated inventory item', '2026-04-09 08:52:49', '{\"stock_quantity\":{\"old\":\"10.00\",\"new\":10},\"scrap\":{\"old\":\"101.00\",\"new\":101},\"labour\":{\"old\":\"185.00\",\"new\":185},\"kg_dzn\":{\"old\":\"4.20\",\"new\":4.2},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"empty_wt\":{\"old\":\"10.00\",\"new\":10},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"5.00\",\"new\":100},\"rate_kg\":{\"old\":\"286.00\",\"new\":286},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"5\",\"new\":\"100\"}}'),
(315, 18, 'doller2', 'inventory_items', 'UPDATE', 94, 'Updated inventory item', '2026-04-09 08:53:27', '{\"user\":{\"old\":\"KADE\",\"new\":\"DEEP\"},\"stock_quantity\":{\"old\":\"10.00\",\"new\":1000},\"finish\":{\"old\":\"\",\"new\":\"SS\"},\"scrap\":{\"old\":\"101.00\",\"new\":120},\"labour\":{\"old\":\"185.00\",\"new\":145},\"kg_dzn\":{\"old\":\"4.20\",\"new\":4.2},\"pcs_box\":{\"old\":10,\"new\":122},\"box_ctn\":{\"old\":10,\"new\":120},\"pcs_ctn\":{\"old\":100,\"new\":14640},\"kg_box\":{\"old\":\"10.00\",\"new\":120},\"empty_wt\":{\"old\":\"10.00\",\"new\":12},\"actual_wt\":{\"old\":\"0.00\",\"new\":120},\"rate_pcs\":{\"old\":\"100.00\",\"new\":0},\"rate_kg\":{\"old\":\"286.00\",\"new\":265},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"100\",\"new\":\"0\"}}'),
(316, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 08:54:21', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":45},\"finish\":{\"old\":null,\"new\":\"SS\"},\"scrap\":{\"old\":\"0.00\",\"new\":45},\"labour\":{\"old\":\"0.00\",\"new\":45},\"kg_dzn\":{\"old\":\"1.10\",\"new\":41},\"pcs_box\":{\"old\":0,\"new\":24},\"box_ctn\":{\"old\":0,\"new\":21},\"pcs_ctn\":{\"old\":0,\"new\":504},\"kg_box\":{\"old\":\"0.00\",\"new\":42},\"empty_wt\":{\"old\":\"0.00\",\"new\":421},\"actual_wt\":{\"old\":\"0.00\",\"new\":42},\"rate_pcs\":{\"old\":\"0.00\",\"new\":307.5},\"rate_kg\":{\"old\":\"0.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"pic_or_kg\":{\"old\":null,\"new\":0}}'),
(317, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 08:54:59', '{\"stock_quantity\":{\"old\":\"45.00\",\"new\":45},\"scrap\":{\"old\":\"45.00\",\"new\":45},\"labour\":{\"old\":\"45.00\",\"new\":45},\"kg_dzn\":{\"old\":\"41.00\",\"new\":41},\"kg_box\":{\"old\":\"42.00\",\"new\":42},\"empty_wt\":{\"old\":\"421.00\",\"new\":421},\"actual_wt\":{\"old\":\"42.00\",\"new\":42},\"rate_pcs\":{\"old\":\"307.50\",\"new\":50},\"rate_kg\":{\"old\":\"90.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":null,\"new\":\"50\"}}'),
(318, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 08:57:10', '{\"stock_quantity\":{\"old\":\"45.00\",\"new\":45},\"scrap\":{\"old\":\"45.00\",\"new\":45},\"labour\":{\"old\":\"45.00\",\"new\":45},\"kg_dzn\":{\"old\":\"41.00\",\"new\":41},\"kg_box\":{\"old\":\"42.00\",\"new\":42},\"empty_wt\":{\"old\":\"421.00\",\"new\":421},\"actual_wt\":{\"old\":\"42.00\",\"new\":42},\"rate_pcs\":{\"old\":\"50.00\",\"new\":307.5},\"rate_kg\":{\"old\":\"90.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(319, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 08:57:31', '{\"stock_quantity\":{\"old\":\"45.00\",\"new\":45},\"scrap\":{\"old\":\"45.00\",\"new\":45},\"labour\":{\"old\":\"45.00\",\"new\":45},\"kg_dzn\":{\"old\":\"41.00\",\"new\":41},\"kg_box\":{\"old\":\"42.00\",\"new\":42},\"empty_wt\":{\"old\":\"421.00\",\"new\":421},\"actual_wt\":{\"old\":\"42.00\",\"new\":42},\"rate_pcs\":{\"old\":\"307.50\",\"new\":10},\"rate_kg\":{\"old\":\"90.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0},\"rate_adjustment\":{\"old\":\"50\",\"new\":\"10\"}}'),
(320, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:43:41', '{\"rate_adjustment\":{\"old\":\"10\",\"new\":\"0\"},\"base_rate_pcs\":{\"old\":\"0.0000\",\"new\":10},\"rate_pcs\":{\"old\":\"10.00\",\"new\":10}}'),
(321, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:43:58', '{\"base_rate_pcs\":{\"old\":\"10.0000\",\"new\":0},\"rate_adjustment\":{\"old\":\"0\",\"new\":null},\"rate_pcs\":{\"old\":\"10.00\",\"new\":0}}'),
(322, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:10', '{\"base_rate_pcs\":{\"old\":\"0.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"0.00\",\"new\":100}}'),
(323, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:16', '{\"rate_adjustment\":{\"old\":null,\"new\":\"50\"},\"base_rate_pcs\":{\"old\":\"100.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"100.00\",\"new\":150}}'),
(324, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:22', '{\"rate_adjustment\":{\"old\":\"50\",\"new\":\"0\"},\"base_rate_pcs\":{\"old\":\"100.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"150.00\",\"new\":100}}'),
(325, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:31', '{\"rate_adjustment\":{\"old\":\"0\",\"new\":\"50%\"},\"base_rate_pcs\":{\"old\":\"100.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"100.00\",\"new\":150}}'),
(326, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:37', '{\"rate_adjustment\":{\"old\":\"50%\",\"new\":\"0\"},\"base_rate_pcs\":{\"old\":\"100.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"150.00\",\"new\":100}}'),
(327, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:50', '{\"rate_adjustment\":{\"old\":\"0\",\"new\":\"10\"},\"base_rate_pcs\":{\"old\":\"100.0000\",\"new\":100},\"rate_pcs\":{\"old\":\"100.00\",\"new\":110}}'),
(328, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:44:58', '{\"stock_quantity\":{\"old\":\"45.00\",\"new\":45},\"scrap\":{\"old\":\"45.00\",\"new\":45},\"labour\":{\"old\":\"45.00\",\"new\":45},\"kg_dzn\":{\"old\":\"41.00\",\"new\":41},\"kg_box\":{\"old\":\"42.00\",\"new\":42},\"empty_wt\":{\"old\":\"421.00\",\"new\":421},\"actual_wt\":{\"old\":\"42.00\",\"new\":42},\"rate_pcs\":{\"old\":\"110.00\",\"new\":110},\"rate_kg\":{\"old\":\"90.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(329, 18, 'doller2', 'inventory_items', 'UPDATE', 91, 'Updated inventory item', '2026-04-09 09:45:06', '{\"stock_quantity\":{\"old\":\"45.00\",\"new\":45},\"scrap\":{\"old\":\"45.00\",\"new\":45},\"labour\":{\"old\":\"45.00\",\"new\":45},\"kg_dzn\":{\"old\":\"41.00\",\"new\":41},\"kg_box\":{\"old\":\"42.00\",\"new\":42},\"empty_wt\":{\"old\":\"421.00\",\"new\":421},\"actual_wt\":{\"old\":\"42.00\",\"new\":42},\"rate_pcs\":{\"old\":\"110.00\",\"new\":110},\"rate_kg\":{\"old\":\"90.00\",\"new\":90},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(330, 18, 'doller2', 'users', 'UPDATE', 7, 'Updated user admin_user', '2026-04-18 14:45:44', NULL),
(331, 18, 'doller2', 'journal_entry_types', 'CREATE', 1, 'Created journal entry type: JUNARL etnary', '2026-04-18 14:46:27', NULL),
(332, 18, 'doller2', 'journal_entry_types', 'CREATE', 2, 'Created journal entry type: junray entary', '2026-04-18 14:47:03', NULL),
(333, 18, 'doller2', 'journal_customers', 'CREATE', 1, 'Created journal customer: jhshhjh', '2026-04-18 14:48:05', NULL),
(334, 18, 'doller2', 'journal_customers', 'DELETE', 1, 'Deleted journal customer', '2026-04-18 14:48:07', NULL),
(335, 18, 'doller2', 'journal_customers', 'CREATE', 2, 'Created journal customer: kjkj', '2026-04-18 14:48:15', NULL),
(336, 18, 'doller2', 'journal_entries', 'CREATE', 6, 'Created Receipt entry for kjkj: ₹5656565', '2026-04-18 14:48:29', NULL),
(337, 18, 'doller2', 'journal_entry_types', 'CREATE', 3, 'Created journal entry type: ABC2', '2026-04-18 14:49:15', NULL),
(338, 18, 'doller2', 'journal_entry_types', 'UPDATE', 3, 'Removed 1 user(s) from journal entry type', '2026-04-18 14:54:51', NULL),
(339, 18, 'doller2', 'invoices', 'CREATE', 79, 'Created invoice 4445', '2026-04-19 15:00:57', NULL),
(340, 18, 'doller2', 'invoices', 'DELETE', 79, 'Undo invoice 4445', '2026-04-19 15:01:02', NULL),
(341, 18, 'doller2', 'purchase_invoices', 'DELETE', 1, 'Undo purchase invoice 12-003: Undo invoice', '2026-04-19 15:41:16', NULL),
(342, 18, 'doller2', 'purchase_invoices', 'DELETE', 3, 'Undo purchase invoice 12006: Undo invoice', '2026-04-19 15:41:30', NULL),
(343, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-04-24 18:37:48', NULL),
(344, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-04-28 18:48:00', NULL),
(345, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-04-28 19:01:30', NULL),
(346, 18, 'doller2', 'journal_entries', 'CREATE', 7, 'Created Receipt entry for kjkj: ₹4500', '2026-04-28 19:04:23', NULL),
(347, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-04-28 19:07:50', NULL),
(348, 18, 'doller2', 'journal_entries', 'CREATE', 8, 'Created Receipt entry for kjkj: ₹75054', '2026-04-28 19:13:49', NULL),
(349, 18, 'doller2', 'journal_entries', 'DELETE', 8, 'Deleted journal entry', '2026-04-28 19:21:50', NULL),
(350, 18, 'doller2', 'journal_entries', 'DELETE', 7, 'Deleted journal entry', '2026-04-28 19:21:52', NULL),
(351, 18, 'doller2', 'journal_entries', 'DELETE', 6, 'Deleted journal entry', '2026-04-28 19:21:55', NULL),
(352, 18, 'doller2', 'journal_entries', 'CREATE', 9, 'Created Receipt entry for kjkj: ₹500', '2026-04-28 19:22:44', NULL),
(353, 18, 'doller2', 'journal_entries', 'CREATE', 10, 'Created Receipt entry for kjkj: ₹400', '2026-04-28 19:23:08', NULL),
(354, 18, 'doller2', 'journal_entries', 'CREATE', 11, 'Created Payment entry for kjkj: ₹440', '2026-04-28 19:23:36', NULL),
(355, 18, 'doller2', 'journal_entries', 'CREATE', 12, 'Created Receipt entry for kjkj: ₹56546', '2026-04-28 19:35:06', NULL),
(356, 18, 'doller2', 'journal_entries', 'CREATE', 13, 'Created Receipt entry for kjkj: ₹654654', '2026-04-28 19:35:56', NULL),
(357, 18, 'doller2', 'inventory_items', 'CREATE', 96, 'Created inventory item', '2026-05-02 17:31:17', NULL),
(358, 18, 'doller2', 'inventory_items', 'UPDATE', 96, 'Updated inventory item', '2026-05-02 17:31:37', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"1.10\",\"new\":1.1},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"empty_wt\":{\"old\":\"4.05\",\"new\":4.051},\"actual_wt\":{\"old\":\"4.61\",\"new\":4.61},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(359, 18, 'doller2', 'journal_entry_types', 'CREATE', 4, 'Created journal entry type: 5464', '2026-05-02 17:34:35', NULL),
(360, 18, 'doller2', 'journal_entry_types', 'CREATE', 5, 'Created journal entry type: 351654654654', '2026-05-02 17:34:59', NULL),
(361, 18, 'doller2', 'journal_entries', 'CREATE', 14, 'Created Receipt entry for kjkj: ₹45121', '2026-05-02 17:39:55', NULL),
(362, 18, 'doller2', 'journal_entries', 'UPDATE', 14, 'Updated journal entry', '2026-05-02 17:40:06', NULL),
(363, 18, 'doller2', 'sales_orders', 'DELETE', 59, 'Deleted sales order (batch)', '2026-05-02 17:42:38', NULL),
(364, 18, 'doller2', 'sales_orders', 'DELETE', 58, 'Deleted sales order (batch)', '2026-05-02 17:42:38', NULL),
(365, 18, 'doller2', 'inventory_items', 'CREATE', 97, 'Created inventory item', '2026-05-02 17:52:10', NULL),
(366, 18, 'doller2', 'inventory_items', 'CREATE', 98, 'Created inventory item', '2026-05-02 17:53:38', NULL),
(367, 18, 'doller2', 'inventory_items', 'UPDATE', 98, 'Updated inventory item', '2026-05-02 17:54:20', '{\"user\":{\"old\":\"KHUS\",\"new\":\"KADE\"},\"stock_quantity\":{\"old\":\"10.00\",\"new\":10},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"1.00\",\"new\":1},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"empty_wt\":{\"old\":\"10.00\",\"new\":10},\"actual_wt\":{\"old\":\"10.00\",\"new\":10},\"rate_pcs\":{\"old\":\"501.67\",\"new\":501.67},\"rate_kg\":{\"old\":\"20.00\",\"new\":20},\"total_kg\":{\"old\":\"2.00\",\"new\":2},\"actual_net_kg\":{\"old\":\"2.00\",\"new\":2}}'),
(368, 18, 'doller2', 'sales_orders', 'CREATE', 60, 'Created sales order', '2026-05-02 17:55:33', NULL),
(369, 18, 'doller2', 'sales_orders', 'UPDATE', 60, 'Updated sales order', '2026-05-02 17:55:46', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"finish\":{\"old\":null,\"new\":\"ANT\"},\"stock_qty\":{\"old\":\"10.00\",\"new\":10},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"1.00\",\"new\":1},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"qty_ctn\":{\"old\":null,\"new\":0},\"total_kg\":{\"old\":null,\"new\":0},\"quantity_pcs\":{\"old\":null,\"new\":0},\"manufacturer_name\":{\"old\":null,\"new\":\"\"},\"po_vr\":{\"old\":null,\"new\":\"\"},\"note\":{\"old\":null,\"new\":\"\"},\"rate_pcs\":{\"old\":\"501.67\",\"new\":501.67},\"rate_kz\":{\"old\":\"20.00\",\"new\":20}}'),
(370, 18, 'doller2', 'sales_orders', 'UPDATE', 60, 'Updated sales order', '2026-05-02 17:56:08', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"stock_qty\":{\"old\":\"10.00\",\"new\":10},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"1.00\",\"new\":1},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"qty_ctn\":{\"old\":\"0.00\",\"new\":4.5},\"total_kg\":{\"old\":\"0.00\",\"new\":37.5},\"quantity_pcs\":{\"old\":0,\"new\":450},\"rate_pcs\":{\"old\":\"501.67\",\"new\":501.67},\"rate_kz\":{\"old\":\"20.00\",\"new\":20}}'),
(371, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-05-02 18:03:05', NULL),
(372, 18, 'doller2', 'inventory_items', 'CREATE', 99, 'Created inventory item', '2026-05-02 18:07:43', NULL),
(373, 18, 'doller2', 'sales_orders', 'CREATE', 61, 'Created sales order', '2026-05-02 18:08:08', NULL),
(374, 18, 'doller2', 'sales_orders', 'UPDATE', 61, 'Updated sales order', '2026-05-02 18:15:18', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"finish\":{\"old\":null,\"new\":\"SS\"},\"stock_qty\":{\"old\":null,\"new\":0},\"scrap\":{\"old\":\"10.00\",\"new\":10},\"labour\":{\"old\":\"10.00\",\"new\":10},\"kg_dzn\":{\"old\":\"0.90\",\"new\":0.9},\"kg_box\":{\"old\":\"10.00\",\"new\":10},\"qty_ctn\":{\"old\":\"0.45\",\"new\":0.45},\"total_kg\":{\"old\":\"3.38\",\"new\":3.38},\"rate_pcs\":{\"old\":\"11.50\",\"new\":11.5},\"rate_kz\":{\"old\":\"20.00\",\"new\":20}}'),
(375, 18, 'doller2', 'sales_orders', 'DELETE', 61, 'Deleted sales order (batch)', '2026-05-11 15:15:03', NULL),
(376, 18, 'doller2', 'sales_orders', 'DELETE', 60, 'Deleted sales order (batch)', '2026-05-11 15:15:03', NULL),
(377, 18, 'doller2', 'sales_orders', 'CREATE', 62, 'Created sales order', '2026-05-11 15:15:21', NULL),
(378, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-05-11 15:24:42', NULL),
(379, 18, 'doller2', 'invoices', 'CREATE', 84, 'Created invoice 656546', '2026-05-11 15:25:22', NULL),
(380, 18, 'doller2', 'receipts', 'CREATE', 16, 'Created receipt', '2026-05-11 15:27:34', NULL),
(381, 18, 'doller2', 'receipts', 'CREATE', 17, 'Created receipt', '2026-05-11 15:28:29', NULL),
(382, 18, 'doller2', 'receipts', 'CREATE', 18, 'Created receipt', '2026-05-11 15:29:24', NULL),
(383, 18, 'doller2', 'receipts', 'CREATE', 19, 'Created receipt', '2026-05-11 15:30:49', NULL),
(384, 18, 'doller2', 'receipts', 'DELETE', NULL, 'Deleted receipts by contact_id 70 (4 receipts, 1 sales invoices)', '2026-05-11 15:30:58', NULL),
(385, 18, 'doller2', 'contacts', 'DELETE', 70, 'Deleted contact (batch)', '2026-05-11 15:31:04', NULL),
(386, 18, 'doller2', 'contacts', 'CREATE', 71, 'Created contact', '2026-05-11 15:31:16', NULL),
(387, 18, 'doller2', 'inventory_items', 'CREATE', 100, 'Created inventory item', '2026-05-11 15:31:39', NULL),
(388, 18, 'doller2', 'sales_orders', 'CREATE', 63, 'Created sales order', '2026-05-11 15:31:56', NULL),
(389, 18, 'doller2', 'invoices', 'CREATE', 85, 'Created invoice INV-2026-188', '2026-05-11 15:32:15', NULL),
(390, 18, 'doller2', 'receipts', 'CREATE', 20, 'Created receipt', '2026-05-11 15:34:30', NULL),
(391, 18, 'doller2', 'receipts', 'CREATE', 21, 'Created receipt', '2026-05-11 15:34:58', NULL),
(392, 18, 'doller2', 'sales_orders', 'CREATE', 64, 'Created sales order', '2026-05-11 15:37:05', NULL),
(393, 18, 'doller2', 'invoices', 'UPDATE', 85, 'Updated invoice', '2026-05-11 15:37:08', '{\"invoice_date\":{\"old\":\"2026-05-10T18:30:00.000Z\",\"new\":\"2026-05-10\"},\"sub_total\":{\"old\":\"23456.70\",\"new\":23456.7},\"gst_amount\":{\"old\":\"0.00\",\"new\":0},\"other_charge\":{\"old\":null,\"new\":\"\"},\"other_charge_amount\":{\"old\":\"0.00\",\"new\":0},\"grand_total\":{\"old\":\"23456.70\",\"new\":23456.7},\"tr_number\":{\"old\":null,\"new\":\"\"},\"lr_number\":{\"old\":null,\"new\":\"\"}}'),
(394, 18, 'doller2', 'receipts', 'DELETE', NULL, 'Deleted receipts by contact_id 71 (2 receipts, 1 sales invoices)', '2026-05-11 15:37:49', NULL),
(395, 18, 'doller2', 'contacts', 'DELETE', 71, 'Deleted contact (batch)', '2026-05-11 15:38:11', NULL),
(396, 18, 'doller2', 'contacts', 'CREATE', 72, 'Created contact', '2026-05-11 15:38:25', NULL),
(397, 18, 'doller2', 'inventory_items', 'CREATE', 101, 'Created inventory item', '2026-08-06 03:53:21', NULL),
(398, 18, 'doller2', 'inventory_items', 'CREATE', 104, 'Created inventory item', '2026-08-06 03:57:50', NULL),
(399, 18, 'doller2', 'sales_orders', 'DELETE', 64, 'Deleted sales order (batch)', '2026-08-06 03:58:20', NULL),
(400, 18, 'doller2', 'sales_orders', 'DELETE', 63, 'Deleted sales order (batch)', '2026-08-06 03:58:20', NULL),
(401, 18, 'doller2', 'sales_orders', 'DELETE', 62, 'Deleted sales order (batch)', '2026-08-06 03:58:20', NULL),
(402, 18, 'doller2', 'sales_orders', 'CREATE', 65, 'Created sales order', '2026-08-06 03:59:21', NULL),
(403, 18, 'doller2', 'inventory_items', 'CREATE', 105, 'Created inventory item', '2026-08-06 04:01:28', NULL),
(404, 18, 'doller2', 'inventory_items', 'CREATE', 106, 'Created inventory item', '2026-08-06 04:02:15', NULL),
(405, 18, 'doller2', 'sales_orders', 'CREATE', 66, 'Created sales order', '2026-08-06 04:06:11', NULL),
(406, 18, 'doller2', 'sales_orders', 'CREATE', 67, 'Created sales order', '2026-08-06 04:07:07', NULL),
(407, 18, 'doller2', 'sales_orders', 'UPDATE', 67, 'Updated sales order', '2026-08-06 04:07:24', '{\"customer_name\":{\"old\":null,\"new\":\"\"},\"stock_qty\":{\"old\":\"50.00\",\"new\":50},\"scrap\":{\"old\":\"80.00\",\"new\":80},\"labour\":{\"old\":\"80.00\",\"new\":80},\"kg_dzn\":{\"old\":\"0.50\",\"new\":0.5},\"kg_box\":{\"old\":\"80.00\",\"new\":80},\"qty_ctn\":{\"old\":null,\"new\":0.00109375},\"total_kg\":{\"old\":null,\"new\":0.29166666666666663},\"quantity_pcs\":{\"old\":null,\"new\":7},\"manufacturer_name\":{\"old\":null,\"new\":\"\"},\"po_vr\":{\"old\":null,\"new\":\"\"},\"note\":{\"old\":null,\"new\":\"\"},\"rate_pcs\":{\"old\":\"86.67\",\"new\":86.67},\"rate_kz\":{\"old\":\"160.00\",\"new\":160}}'),
(408, 18, 'doller2', 'sales_orders', 'DELETE', 67, 'Deleted sales order', '2026-08-06 04:07:43', NULL),
(409, 18, 'doller2', 'sales_orders', 'CREATE', 68, 'Created sales order', '2026-08-06 04:08:00', NULL),
(410, 18, 'doller2', 'sales_orders', 'CREATE', 69, 'Created sales order', '2026-08-06 04:17:22', NULL),
(411, 18, 'doller2', 'sales_orders', 'DELETE', 69, 'Deleted sales order (batch)', '2026-08-06 04:18:52', NULL),
(412, 18, 'doller2', 'sales_orders', 'DELETE', 68, 'Deleted sales order (batch)', '2026-08-06 04:18:52', NULL),
(413, 18, 'doller2', 'sales_orders', 'DELETE', 66, 'Deleted sales order (batch)', '2026-08-06 04:18:52', NULL),
(414, 18, 'doller2', 'sales_orders', 'DELETE', 65, 'Deleted sales order (batch)', '2026-08-06 04:18:52', NULL),
(415, 18, 'doller2', 'sales_orders', 'CREATE', 70, 'Created sales order', '2026-08-06 04:19:08', NULL),
(416, 18, 'doller2', 'sales_orders', 'CREATE', 71, 'Created sales order', '2026-08-06 04:19:27', NULL),
(417, 18, 'doller2', 'sales_orders', 'CREATE', 72, 'Created sales order', '2026-08-06 04:19:49', NULL),
(418, 18, 'doller2', 'sales_orders', 'CREATE', 73, 'Created sales order', '2026-08-06 04:20:03', NULL),
(419, 18, 'doller2', 'invoices', 'CREATE', 86, 'Created invoice 789498', '2026-08-06 04:21:48', NULL),
(420, 18, 'doller2', 'contacts', 'CREATE', 73, 'Created contact', '2026-08-06 04:27:49', NULL),
(421, 18, 'doller2', 'inventory_items', 'CREATE', 107, 'Created inventory item', '2026-08-06 04:28:45', NULL),
(422, 18, 'doller2', 'inventory_items', 'CREATE', 108, 'Created inventory item', '2026-08-06 04:36:11', NULL),
(423, 18, 'doller2', 'sales_orders', 'CREATE', 74, 'Created sales order', '2026-08-06 04:46:09', NULL),
(424, 18, 'doller2', 'sales_orders', 'CREATE', 75, 'Created sales order', '2026-08-06 04:46:33', NULL),
(425, 18, 'doller2', 'sales_orders', 'CREATE', 76, 'Created sales order', '2026-08-06 04:47:09', NULL),
(426, 18, 'doller2', 'invoices', 'CREATE', 87, 'Created invoice INV-2026-465', '2026-08-06 04:48:20', NULL),
(427, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 06:29:25', NULL),
(428, 18, 'doller2', 'sales_orders', 'DELETE', 76, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(429, 18, 'doller2', 'sales_orders', 'DELETE', 75, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(430, 18, 'doller2', 'sales_orders', 'DELETE', 74, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(431, 18, 'doller2', 'sales_orders', 'DELETE', 73, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(432, 18, 'doller2', 'sales_orders', 'DELETE', 72, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(433, 18, 'doller2', 'sales_orders', 'DELETE', 71, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(434, 18, 'doller2', 'sales_orders', 'DELETE', 70, 'Deleted sales order (batch)', '2026-08-27 06:31:58', NULL),
(435, 18, 'doller2', 'invoices', 'DELETE', 87, 'Deleted invoice (batch)', '2026-08-27 06:32:06', NULL),
(436, 18, 'doller2', 'invoices', 'DELETE', 86, 'Deleted invoice (batch)', '2026-08-27 06:32:06', NULL),
(437, 18, 'doller2', 'purchase_invoices', 'DELETE', 2, 'Deleted purchase invoice (batch)', '2026-08-27 06:32:15', NULL),
(438, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 06:35:25', NULL),
(439, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 07:10:01', NULL),
(440, 18, 'doller2', 'inventory_items', 'CREATE', 109, 'Created inventory item', '2026-08-27 07:10:49', NULL),
(441, 18, 'doller2', 'inventory_items', 'UPDATE', 109, 'Updated inventory item', '2026-08-27 07:11:05', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"finish\":{\"old\":null,\"new\":\"\"},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"1.10\",\"new\":1.1},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.05\",\"new\":0.0051},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(442, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 07:17:05', NULL),
(443, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 07:26:53', NULL),
(444, 18, 'doller2', 'sales_orders', 'CREATE', 77, 'Created sales order', '2026-08-27 07:27:32', NULL),
(445, 18, 'doller2', 'inventory_items', 'CREATE', 110, 'Created inventory item', '2026-08-27 07:28:24', NULL),
(446, 18, 'doller2', 'sales_orders', 'CREATE', 78, 'Created sales order', '2026-08-27 07:28:44', NULL),
(447, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 07:36:19', NULL),
(448, 18, 'doller2', 'invoices', 'CREATE', 88, 'Created invoice INV-2026-734', '2026-08-27 07:37:27', NULL),
(449, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 11:55:11', NULL),
(450, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-27 12:59:26', NULL),
(451, 18, 'doller2', 'users', 'LOGIN', 18, 'User doller2 logged in', '2026-08-29 06:08:24', NULL),
(452, 18, 'doller2', 'inventory_items', 'CREATE', 111, 'Created inventory item', '2026-08-29 06:17:05', NULL),
(453, 18, 'doller2', 'purchase_invoices', 'CREATE', 8, 'Created purchase invoice ', '2026-08-29 06:25:41', NULL),
(454, 18, 'doller2', 'inventory_items', 'CREATE', 113, 'Created inventory item', '2026-08-29 06:26:34', NULL),
(455, 18, 'doller2', 'inventory_items', 'CREATE', 114, 'Created inventory item', '2026-08-29 06:26:49', NULL),
(456, 18, 'doller2', 'purchase_invoices', 'CREATE', 9, 'Created purchase invoice ', '2026-08-29 06:27:48', NULL),
(457, 18, 'doller2', 'purchase_invoices', 'DELETE', 8, 'Deleted purchase invoice (batch)', '2026-08-29 06:31:52', NULL),
(458, 18, 'doller2', 'purchase_invoices', 'DELETE', 9, 'Deleted purchase invoice (batch)', '2026-08-29 06:31:52', NULL),
(459, 18, 'doller2', 'inventory_items', 'CREATE', 116, 'Created inventory item', '2026-08-29 06:34:45', NULL),
(460, 18, 'doller2', 'inventory_items', 'CREATE', 117, 'Created inventory item', '2026-08-29 06:34:59', NULL),
(461, 18, 'doller2', 'inventory_items', 'CREATE', 118, 'Created inventory item', '2026-08-29 06:35:10', NULL),
(462, 18, 'doller2', 'purchase_invoices', 'CREATE', 13, 'Created purchase invoice 65654', '2026-08-29 06:36:48', NULL),
(463, 18, 'doller2', 'inventory_items', 'UPDATE', 117, 'Updated inventory item', '2026-08-29 06:39:56', '{\"stock_quantity\":{\"old\":\"0.00\",\"new\":0},\"finish\":{\"old\":null,\"new\":\"\"},\"scrap\":{\"old\":\"0.00\",\"new\":0},\"labour\":{\"old\":\"0.00\",\"new\":0},\"kg_dzn\":{\"old\":\"0.00\",\"new\":5.5},\"kg_box\":{\"old\":\"0.00\",\"new\":0},\"empty_wt\":{\"old\":\"0.00\",\"new\":0},\"actual_wt\":{\"old\":\"0.00\",\"new\":0},\"rate_pcs\":{\"old\":\"0.00\",\"new\":0},\"rate_kg\":{\"old\":\"0.00\",\"new\":0},\"total_kg\":{\"old\":\"0.00\",\"new\":0},\"actual_net_kg\":{\"old\":\"0.00\",\"new\":0}}'),
(464, 18, 'doller2', 'purchase_invoices', 'CREATE', 14, 'Created purchase invoice ', '2026-08-29 06:40:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`id`, `user_id`, `permission_name`) VALUES
(172, 1, 'employee_management'),
(175, 1, 'journal_entries'),
(1, 6, 'receipts'),
(178, 7, 'accounts'),
(191, 7, 'contacts'),
(189, 7, 'create_user'),
(181, 7, 'customers'),
(177, 7, 'dashboard'),
(188, 7, 'employees'),
(186, 7, 'inventory_items'),
(190, 7, 'journal_entries'),
(187, 7, 'master_items'),
(180, 7, 'payments'),
(185, 7, 'purchase_invoices'),
(179, 7, 'receipts'),
(184, 7, 'sales_invoices'),
(183, 7, 'sales_orders'),
(182, 7, 'suppliers'),
(17, 8, 'accounts'),
(20, 8, 'contacts'),
(21, 8, 'customers'),
(30, 8, 'custom_items'),
(16, 8, 'dashboard'),
(27, 8, 'employees'),
(26, 8, 'inventory_items'),
(28, 8, 'journal_entries'),
(19, 8, 'payments'),
(25, 8, 'purchase_invoices'),
(18, 8, 'receipts'),
(29, 8, 'reports'),
(24, 8, 'sales_invoices'),
(23, 8, 'sales_orders'),
(22, 8, 'suppliers'),
(32, 9, 'accounts'),
(35, 9, 'contacts'),
(36, 9, 'customers'),
(31, 9, 'dashboard'),
(42, 9, 'employees'),
(41, 9, 'inventory_items'),
(43, 9, 'journal_entries'),
(45, 9, 'master_items'),
(34, 9, 'payments'),
(40, 9, 'purchase_invoices'),
(33, 9, 'receipts'),
(44, 9, 'reports'),
(39, 9, 'sales_invoices'),
(38, 9, 'sales_orders'),
(37, 9, 'suppliers'),
(111, 15, 'accounts'),
(114, 15, 'contacts'),
(110, 15, 'create_user'),
(115, 15, 'customers'),
(121, 15, 'employees'),
(120, 15, 'inventory_items'),
(122, 15, 'journal_entries'),
(124, 15, 'master_items'),
(113, 15, 'payments'),
(119, 15, 'purchase_invoices'),
(112, 15, 'receipts'),
(123, 15, 'reports'),
(118, 15, 'sales_invoices'),
(117, 15, 'sales_orders'),
(116, 15, 'suppliers'),
(126, 17, 'accounts'),
(129, 17, 'contacts'),
(130, 17, 'customers'),
(125, 17, 'dashboard'),
(136, 17, 'employees'),
(135, 17, 'inventory_items'),
(137, 17, 'journal_entries'),
(139, 17, 'master_items'),
(128, 17, 'payments'),
(134, 17, 'purchase_invoices'),
(127, 17, 'receipts'),
(138, 17, 'reports'),
(133, 17, 'sales_invoices'),
(132, 17, 'sales_orders'),
(131, 17, 'suppliers'),
(141, 18, 'accounts'),
(155, 18, 'contacts'),
(152, 18, 'create_user'),
(144, 18, 'customers'),
(140, 18, 'dashboard'),
(151, 18, 'employees'),
(174, 18, 'employee_management'),
(149, 18, 'inventory_items'),
(153, 18, 'journal_entries'),
(150, 18, 'master_items'),
(143, 18, 'payments'),
(148, 18, 'purchase_invoices'),
(142, 18, 'receipts'),
(154, 18, 'reports'),
(147, 18, 'sales_invoices'),
(146, 18, 'sales_orders'),
(145, 18, 'suppliers'),
(157, 19, 'accounts'),
(171, 19, 'contacts'),
(168, 19, 'create_user'),
(160, 19, 'customers'),
(156, 19, 'dashboard'),
(167, 19, 'employees'),
(165, 19, 'inventory_items'),
(169, 19, 'journal_entries'),
(166, 19, 'master_items'),
(159, 19, 'payments'),
(164, 19, 'purchase_invoices'),
(158, 19, 'receipts'),
(170, 19, 'reports'),
(163, 19, 'sales_invoices'),
(162, 19, 'sales_orders'),
(161, 19, 'suppliers');

-- --------------------------------------------------------

--
-- Structure for view `employee_advance_summary`
--
DROP TABLE IF EXISTS `employee_advance_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `employee_advance_summary`  AS SELECT `e`.`id` AS `employee_id`, `e`.`name` AS `employee_name`, count(distinct `ea`.`id`) AS `total_advances`, coalesce(sum(case when `ea`.`status` = 'PENDING' then `ea`.`amount` else 0 end),0) AS `pending_amount`, coalesce(sum(case when `ea`.`status` in ('PENDING','PARTIAL') then `ea`.`remaining_balance` else 0 end),0) AS `total_remaining_balance`, coalesce(sum(`ear`.`amount`),0) AS `total_repaid` FROM ((`employees` `e` left join `employee_advances` `ea` on(`e`.`id` = `ea`.`employee_id`)) left join `employee_advance_repayments` `ear` on(`ea`.`id` = `ear`.`advance_id`)) GROUP BY `e`.`id`, `e`.`name` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `account_history`
--
ALTER TABLE `account_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_contact_id` (`contact_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_transaction_type` (`transaction_type`),
  ADD KEY `idx_receipt_id` (`receipt_id`),
  ADD KEY `idx_payment_id` (`payment_id`),
  ADD KEY `idx_account_date` (`account_id`,`date`),
  ADD KEY `idx_account_type` (`account_id`,`transaction_type`);

--
-- Indexes for table `box_inventory`
--
ALTER TABLE `box_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carton_inventory`
--
ALTER TABLE `carton_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carton_name` (`carton_name`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_id` (`contact_id`),
  ADD UNIQUE KEY `contact_id_2` (`contact_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- Indexes for table `employee_advances`
--
ALTER TABLE `employee_advances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_employee_status` (`employee_id`,`status`),
  ADD KEY `idx_advance_date` (`employee_id`,`date`);

--
-- Indexes for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_advance_id` (`advance_id`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_week` (`employee_id`,`week_start_date`),
  ADD KEY `idx_week_dates` (`week_start_date`,`week_end_date`),
  ADD KEY `idx_employee_week` (`employee_id`,`week_start_date`);

--
-- Indexes for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_employee_date` (`employee_id`,`work_date`);

--
-- Indexes for table `finishes_table`
--
ALTER TABLE `finishes_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_user` (`code_user`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `journal_customers`
--
ALTER TABLE `journal_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `method_id` (`method_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_customer` (`customer_name`),
  ADD KEY `idx_entry_type` (`entry_type_id`);

--
-- Indexes for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type_user` (`entry_type_id`,`user_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_type` (`entry_type_id`);

--
-- Indexes for table `ld_inventory`
--
ALTER TABLE `ld_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master_items`
--
ALTER TABLE `master_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_code` (`item_code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `order_stock`
--
ALTER TABLE `order_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pati_table`
--
ALTER TABLE `pati_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `contact_id` (`contact_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `purchase_invoices`
--
ALTER TABLE `purchase_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_id` (`contact_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sales_invoice`
--
ALTER TABLE `sales_invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_lock`
--
ALTER TABLE `sales_lock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `module_name` (`module_name`),
  ADD KEY `locked_by` (`locked_by`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `shrink_inventory`
--
ALTER TABLE `shrink_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_item_code` (`item_code`),
  ADD KEY `idx_movement_date` (`movement_date`),
  ADD KEY `idx_invoice_number` (`invoice_number`),
  ADD KEY `idx_transaction_type` (`transaction_type`),
  ADD KEY `idx_invoice_type` (`invoice_type`);

--
-- Indexes for table `supplier_details`
--
ALTER TABLE `supplier_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_id` (`contact_id`),
  ADD UNIQUE KEY `contact_id_2` (`contact_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `transport`
--
ALTER TABLE `transport`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_model_name` (`model_name`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`permission_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `account_history`
--
ALTER TABLE `account_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `box_inventory`
--
ALTER TABLE `box_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carton_inventory`
--
ALTER TABLE `carton_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `customer_details`
--
ALTER TABLE `customer_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employee_advances`
--
ALTER TABLE `employee_advances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `finishes_table`
--
ALTER TABLE `finishes_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `journal_customers`
--
ALTER TABLE `journal_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ld_inventory`
--
ALTER TABLE `ld_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_items`
--
ALTER TABLE `master_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order_stock`
--
ALTER TABLE `order_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pati_table`
--
ALTER TABLE `pati_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `purchase_invoices`
--
ALTER TABLE `purchase_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sales_invoice`
--
ALTER TABLE `sales_invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_lock`
--
ALTER TABLE `sales_lock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `shrink_inventory`
--
ALTER TABLE `shrink_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `supplier_details`
--
ALTER TABLE `supplier_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `transport`
--
ALTER TABLE `transport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=465;

--
-- AUTO_INCREMENT for table `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `account_history`
--
ALTER TABLE `account_history`
  ADD CONSTRAINT `fk_account_history_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_account_history_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_account_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_account_history_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD CONSTRAINT `customer_details_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_advances`
--
ALTER TABLE `employee_advances`
  ADD CONSTRAINT `employee_advances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  ADD CONSTRAINT `employee_advance_repayments_ibfk_1` FOREIGN KEY (`advance_id`) REFERENCES `employee_advances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_advance_repayments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  ADD CONSTRAINT `fk_weekly_salary_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  ADD CONSTRAINT `employee_work_records_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `journal_entries_ibfk_3` FOREIGN KEY (`entry_type_id`) REFERENCES `journal_entry_types` (`id`);

--
-- Constraints for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  ADD CONSTRAINT `journal_entry_types_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  ADD CONSTRAINT `journal_entry_type_permissions_ibfk_1` FOREIGN KEY (`entry_type_id`) REFERENCES `journal_entry_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entry_type_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `master_items`
--
ALTER TABLE `master_items`
  ADD CONSTRAINT `master_items_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  ADD CONSTRAINT `purchase_invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `receipts_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `receipts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_lock`
--
ALTER TABLE `sales_lock`
  ADD CONSTRAINT `sales_lock_ibfk_1` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD CONSTRAINT `sales_orders_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  ADD CONSTRAINT `shipping_cartons_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `fk_stock_history_item` FOREIGN KEY (`item_code`) REFERENCES `master_items` (`item_code`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_details`
--
ALTER TABLE `supplier_details`
  ADD CONSTRAINT `supplier_details_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
