-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3600
-- Generation Time: Oct 04, 2022 at 02:58 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `swap-ar-uni`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `ID` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `EN_Name` varchar(255) NOT NULL,
  `AR_Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`ID`, `country_id`, `EN_Name`, `AR_Name`) VALUES
(1, 1, 'Tullkarem', 'طولكرم');

-- --------------------------------------------------------

--
-- Table structure for table `college`
--

CREATE TABLE `college` (
  `University_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `ID` int(11) NOT NULL,
  `EN_Name` varchar(255) NOT NULL,
  `AR_Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`ID`, `EN_Name`, `AR_Name`) VALUES
(1, 'Palestine ', 'فلسطين');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `college_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evaluated by the student`
--

CREATE TABLE `evaluated by the student` (
  `Was the training according to the offer?` varchar(255) NOT NULL,
  `id` int(11) NOT NULL,
  `Was there a training program?` varchar(255) NOT NULL,
  `How would you rate the training program and its implementation?` varchar(255) NOT NULL,
  `How would you rate your relationship with the management ?` varchar(255) NOT NULL,
  `How do you rate your relationship with employees?` varchar(255) NOT NULL,
  `Is training part of graduation requirements?` varchar(255) NOT NULL,
  `Did the trained body provide facilities in terms of housing?` varchar(255) NOT NULL,
  `Did the trained body provide facilities for food?` varchar(255) NOT NULL,
  `Did you find it difficult to find accommodation?` varchar(255) NOT NULL,
  `How were you received from the receiving university?` varchar(255) NOT NULL,
  `How were you received by the coach?` varchar(255) NOT NULL,
  `Do you recommend training in this institution?` varchar(255) NOT NULL,
  `Offer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evaluation by the university`
--

CREATE TABLE `evaluation by the university` (
  `id` int(11) NOT NULL,
  `Student's general performance` varchar(255) NOT NULL,
  `Student's relationship with co-workers` varchar(255) NOT NULL,
  `The student’s relationship with the training officer` varchar(255) NOT NULL,
  `His ability to perform the duties assigned to him` varchar(255) NOT NULL,
  `His ability to learn` varchar(255) NOT NULL,
  `The ability to document what he has learned` varchar(255) NOT NULL,
  `Offer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `id` int(11) NOT NULL,
  `offer_date` date NOT NULL,
  `university_id_src` int(11) NOT NULL,
  `requirement` varchar(255) NOT NULL,
  `work_description` varchar(255) NOT NULL,
  `work_type` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `Financial_support` varchar(255) NOT NULL,
  `offer_dead_line` date NOT NULL,
  `University_id_des` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `work_address` varchar(255) NOT NULL,
  `work_day` varchar(255) NOT NULL,
  `weekly_hours` int(11) NOT NULL,
  `daily_hours` int(11) NOT NULL,
  `collage` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `major` varchar(255) NOT NULL,
  `student_level` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `work_field` varchar(255) NOT NULL,
  `provide_food` tinyint(1) NOT NULL,
  `provide_dorm` tinyint(1) NOT NULL,
  `provide_transportation` tinyint(1) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `offer`
--

INSERT INTO `offer` (`id`, `offer_date`, `university_id_src`, `requirement`, `work_description`, `work_type`, `start_date`, `end_date`, `Financial_support`, `offer_dead_line`, `University_id_des`, `organization_id`, `user_id`, `work_address`, `work_day`, `weekly_hours`, `daily_hours`, `collage`, `department`, `major`, `student_level`, `gender`, `work_field`, `provide_food`, `provide_dorm`, `provide_transportation`, `status`) VALUES
(1, '2022-08-10', 1, 'non', 'non', 'non', '2022-08-02', '2029-08-16', 'non', '2022-08-17', 1, 1, 1, 'non', 'non', 19, 19, 'non', 'non', 'non', 'non', 'male', 'non', 5, 5, 5, 'non');

-- --------------------------------------------------------

--
-- Table structure for table `org`
--

CREATE TABLE `org` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `supervisor` varchar(255) NOT NULL,
  `phone` int(15) NOT NULL,
  `fax` int(15) NOT NULL,
  `city_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `org`
--

INSERT INTO `org` (`id`, `name`, `address`, `supervisor`, `phone`, `fax`, `city_id`) VALUES
(1, 'asal tecnolgy', 'tulkarem', 'null', 595098952, 595098952, 1);

-- --------------------------------------------------------

--
-- Table structure for table `representative(user)`
--

CREATE TABLE `representative(user)` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `university_id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `phone` int(11) NOT NULL,
  `fax` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `representative(user)`
--

INSERT INTO `representative(user)` (`ID`, `Name`, `university_id`, `Email`, `phone`, `fax`, `start_date`, `end_date`, `status`, `user_id`) VALUES
(1, 'motamad', 1, 'motamad.ptuk.ps', 595098952, 595098952, '2022-07-20', '2027-07-14', 'active', 2);

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `arrive_date` date NOT NULL,
  `arrive_time` varchar(255) NOT NULL,
  `arrive_place` varchar(255) NOT NULL,
  `lines_number` int(11) NOT NULL,
  `lines_name` varchar(255) NOT NULL,
  `dorm_choose` tinyint(1) NOT NULL,
  `dorm_start_date` date NOT NULL,
  `dorm_end_date` date NOT NULL,
  `student_id` int(11) NOT NULL,
  `Offer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student_e`
--

CREATE TABLE `student_e` (
  `ID` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `university_id` int(11) NOT NULL,
  `collage` varchar(255) NOT NULL,
  `study_field` varchar(255) NOT NULL,
  `birth_place` varchar(255) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `passport_end_date` date NOT NULL,
  `phone` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `passport_id` int(11) NOT NULL,
  `Section` varchar(255) NOT NULL,
  `Scientific_level` varchar(255) NOT NULL,
  `health_status` varchar(255) NOT NULL,
  `study_year` int(11) NOT NULL,
  `total_study_year` int(11) NOT NULL,
  `fluency_in_English` varchar(255) NOT NULL,
  `total_hour` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `university`
--

CREATE TABLE `university` (
  `ID` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `EN_Name` varchar(255) NOT NULL,
  `AR_Name` varchar(255) NOT NULL,
  `Location_O` varchar(255) NOT NULL,
  `Study_business` varchar(255) NOT NULL,
  `work_day` varchar(255) NOT NULL,
  `hour_no_week` int(11) NOT NULL,
  `phone` int(11) NOT NULL,
  `Fax` int(11) NOT NULL,
  `hour_no_day` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `university`
--

INSERT INTO `university` (`ID`, `city_id`, `EN_Name`, `AR_Name`, `Location_O`, `Study_business`, `work_day`, `hour_no_week`, `phone`, `Fax`, `hour_no_day`, `url`, `email`) VALUES
(1, 1, 'Palestine university kodoorie  ', 'جامعة خضوري', 'طولكرم', 'اكاديمي', 'احد-الحميس', 45, 595098952, 2693256, 9, 'https://ptuk.edu.ps/ar', 'ptuk.ps');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `type`) VALUES
(1, 'Ahmad Osama', 'Ahmad2000$', 'Admin'),
(2, 'motamad', 'aoh123456', 'supervisor ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `college`
--
ALTER TABLE `college`
  ADD PRIMARY KEY (`id`),
  ADD KEY `University_id` (`University_id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `college_id` (`college_id`);

--
-- Indexes for table `evaluated by the student`
--
ALTER TABLE `evaluated by the student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Offer_id` (`Offer_id`);

--
-- Indexes for table `evaluation by the university`
--
ALTER TABLE `evaluation by the university`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Offer_id` (`Offer_id`);

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `university_id_src` (`university_id_src`),
  ADD KEY `University_id_des` (`University_id_des`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `org`
--
ALTER TABLE `org`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `representative(user)`
--
ALTER TABLE `representative(user)`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `university_id_2` (`university_id`),
  ADD KEY `university_id` (`university_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `Offer_id` (`Offer_id`);

--
-- Indexes for table `student_e`
--
ALTER TABLE `student_e`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `university`
--
ALTER TABLE `university`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `college`
--
ALTER TABLE `college`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluated by the student`
--
ALTER TABLE `evaluated by the student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evaluation by the university`
--
ALTER TABLE `evaluation by the university`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `org`
--
ALTER TABLE `org`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `representative(user)`
--
ALTER TABLE `representative(user)`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_e`
--
ALTER TABLE `student_e`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `university`
--
ALTER TABLE `university`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `country` (`ID`);

--
-- Constraints for table `college`
--
ALTER TABLE `college`
  ADD CONSTRAINT `college_ibfk_1` FOREIGN KEY (`University_id`) REFERENCES `university` (`ID`);

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`college_id`) REFERENCES `college` (`id`);

--
-- Constraints for table `evaluated by the student`
--
ALTER TABLE `evaluated by the student`
  ADD CONSTRAINT `evaluated by the student_ibfk_1` FOREIGN KEY (`Offer_id`) REFERENCES `offer` (`id`);

--
-- Constraints for table `evaluation by the university`
--
ALTER TABLE `evaluation by the university`
  ADD CONSTRAINT `evaluation by the university_ibfk_1` FOREIGN KEY (`Offer_id`) REFERENCES `offer` (`id`);

--
-- Constraints for table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`university_id_src`) REFERENCES `university` (`ID`),
  ADD CONSTRAINT `offer_ibfk_2` FOREIGN KEY (`University_id_des`) REFERENCES `university` (`ID`),
  ADD CONSTRAINT `offer_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `org` (`id`),
  ADD CONSTRAINT `offer_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `representative(user)` (`ID`);

--
-- Constraints for table `org`
--
ALTER TABLE `org`
  ADD CONSTRAINT `org_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city` (`ID`);

--
-- Constraints for table `representative(user)`
--
ALTER TABLE `representative(user)`
  ADD CONSTRAINT `representative(user)_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`ID`),
  ADD CONSTRAINT `representative(user)_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`Offer_id`) REFERENCES `offer` (`id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student_e` (`ID`);

--
-- Constraints for table `student_e`
--
ALTER TABLE `student_e`
  ADD CONSTRAINT `student_e_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `university` (`ID`);

--
-- Constraints for table `university`
--
ALTER TABLE `university`
  ADD CONSTRAINT `university_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
