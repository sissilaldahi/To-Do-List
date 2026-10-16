-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2026 at 02:13 PM
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
-- Database: `todo_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `category` varchar(50) DEFAULT 'General',
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `due_date`, `priority`, `category`, `is_completed`, `created_at`) VALUES
(2, 1, 'Colors web', 'change the design colors', '2026-09-28', 'High', 'Work', 1, '2026-09-28 18:01:49'),
(3, 1, 'Meeting', 'VWE 1to1 meeting ', '2026-09-30', 'Urgent', 'Meeting', 0, '2026-09-28 18:55:25'),
(5, 1, 'Developing website', 'vwe', '2026-10-05', 'Medium', 'Work', 0, '2026-10-05 08:04:58'),
(6, 1, 'Finish To do list', '', '2026-10-13', 'Urgent', 'Work', 1, '2026-10-13 09:17:46'),
(8, 1, 'VWE', '', '2026-10-14', 'High', 'Work', 1, '2026-10-14 07:38:49'),
(9, 1, 'ddd', '', '2026-10-15', 'Medium', 'General', 0, '2026-10-15 11:01:05'),
(10, 1, 'aaa', '', '2026-10-15', 'Medium', 'General', 0, '2026-10-15 11:01:13'),
(11, 1, 'dddff', '', '2026-10-15', 'Medium', 'Personal', 0, '2026-10-15 11:01:44'),
(12, 1, 'gggg', '', '2026-10-15', 'Medium', 'Health', 0, '2026-10-15 11:01:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Sissil Aldahi', 'saso.aldahi@gmail.com', '$2y$10$agwMnqVuU8T7oVVHyrm90.krVNBw6J9t5kW5VWsQ9u7emdovJbkEW', '2026-09-28 17:47:40'),
(6, 'Sissil', 'sisi.aldahi@gmail.com', '$2y$10$lvGAk13YApJk.NFciFqaGOjT5tR.q1HxYmeYPYeZlfRcEBZFXlcu.', '2026-10-13 09:59:29'),
(7, 'Sisi', 'sisi.dahi@gmail.com', '$2y$10$hSN.cFQ7cyXYDX8QFcA.oO6LIy/ls4FzalsHioth2Y1aZyHM5qQxq', '2026-10-15 11:53:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
