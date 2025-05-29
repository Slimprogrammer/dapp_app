-- phpMyAdmin SQL Dump
-- version 5.2.2deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 23, 2025 at 07:59 PM
-- Server version: 11.8.1-MariaDB-4
-- PHP Version: 8.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dappDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
CREATE TABLE IF NOT EXISTS `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `total_asset_available` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_staked` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_unstaked` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_withdrawn` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_deposited` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_pending` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_traded` decimal(20,8) DEFAULT 0.00000000,
  `total_asset_earned` decimal(20,8) DEFAULT 0.00000000,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Assets Table';

--
-- RELATIONSHIPS FOR TABLE `assets`:
--

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`id`, `user_id`, `asset_name`, `total_asset_available`, `total_asset_staked`, `total_asset_unstaked`, `total_asset_withdrawn`, `total_asset_deposited`, `total_asset_pending`, `total_asset_traded`, `total_asset_earned`) VALUES
(12, 'c3e9e609368c11f0976068a3c4b525b5', 'USDT', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(13, 'c3e9e609368c11f0976068a3c4b525b5', 'BCH', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(14, 'c3e9e609368c11f0976068a3c4b525b5', 'DOGE', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(15, 'c3e9e609368c11f0976068a3c4b525b5', 'SHIB', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(16, 'c3e9e609368c11f0976068a3c4b525b5', 'ETC', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(17, 'c3e9e609368c11f0976068a3c4b525b5', 'XRP', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(18, 'c3e9e609368c11f0976068a3c4b525b5', 'SOL', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(19, 'c3e9e609368c11f0976068a3c4b525b5', 'BNB', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(20, 'c3e9e609368c11f0976068a3c4b525b5', 'PEPE', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(21, 'c3e9e609368c11f0976068a3c4b525b5', 'ETH', 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000, 0.00000000);

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` text NOT NULL COMMENT 'setting name',
  `value` text NOT NULL COMMENT 'setting value',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT=' table contains configuration settings';

--
-- RELATIONSHIPS FOR TABLE `config`:
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` char(36) NOT NULL DEFAULT replace(uuid(),'-','') COMMENT 'User ID',
  `wallet_address` text NOT NULL COMMENT 'Wallet Address',
  `has_joined` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Has Joined',
  `create_time` datetime DEFAULT current_timestamp() COMMENT 'Create Time',
  `role` enum('client','admin') DEFAULT 'client',
  `socket_id` varchar(255) DEFAULT NULL,
  `connected_time` datetime DEFAULT current_timestamp(),
  `disconnected_time` datetime DEFAULT NULL,
  `total_asset_available` decimal(20,2) DEFAULT 0.00,
  `total_asset_staked` decimal(20,2) DEFAULT 0.00,
  `total_asset_unstaked` decimal(20,2) DEFAULT 0.00,
  `total_asset_withdrawn` decimal(20,2) DEFAULT 0.00,
  `total_asset_deposited` decimal(20,2) DEFAULT 0.00,
  `total_asset_pending` decimal(20,2) DEFAULT 0.00,
  `total_asset_traded` decimal(20,2) DEFAULT 0.00,
  `total_asset_earned` decimal(20,2) DEFAULT 0.00,
  `current_asset_staked` decimal(20,2) DEFAULT 0.00,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Users Table';

--
-- RELATIONSHIPS FOR TABLE `users`:
--

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `wallet_address`, `has_joined`, `create_time`, `role`, `socket_id`, `connected_time`, `disconnected_time`, `total_asset_available`, `total_asset_staked`, `total_asset_unstaked`, `total_asset_withdrawn`, `total_asset_deposited`, `total_asset_pending`, `total_asset_traded`, `total_asset_earned`, `current_asset_staked`) VALUES
('c3e9e609368c11f0976068a3c4b525b5', '0x02f40240b966a4b507a541e0c4e7ec0b488156a7', 0, '2025-05-22 00:44:25', 'client', '9KVMQGft3-HTLKC1AAAD', '2025-05-22 02:55:34', '2025-05-22 02:03:05', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00);

--
-- Triggers `users`
--
DROP TRIGGER IF EXISTS `trg_update_connection_times`;
DELIMITER $$
CREATE TRIGGER `trg_update_connection_times` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
  IF NEW.socket_id IS NOT NULL AND OLD.socket_id IS NULL THEN
    SET NEW.connected_time = CURRENT_TIMESTAMP;
  ELSEIF NEW.socket_id IS NULL AND OLD.socket_id IS NOT NULL THEN
    SET NEW.disconnected_time = CURRENT_TIMESTAMP;
  END IF;
END
$$
DELIMITER ;


--
-- Metadata
--
USE `phpmyadmin`;

--
-- Metadata for table assets
--

--
-- Metadata for table config
--

--
-- Metadata for table users
--

--
-- Metadata for database dappDB
--
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
