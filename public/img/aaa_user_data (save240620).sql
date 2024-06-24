-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 20, 2024 at 05:10 PM
-- Server version: 5.5.68-MariaDB
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aaa23_`
--

-- --------------------------------------------------------

--
-- Table structure for table `aaa_user_data`
--

CREATE TABLE `aaa_user_data` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `user_email` varchar(256) DEFAULT NULL,
  `klarname` tinyint(1) NOT NULL DEFAULT '1',
  `vorname` varchar(255) NOT NULL,
  `nachname` varchar(255) NOT NULL,
  `spitzname` varchar(255) DEFAULT NULL,
  `geburtstdatum` date DEFAULT NULL,
  `handynr` varchar(20) DEFAULT NULL,
  `wieOftDabei` int(11) DEFAULT NULL,
  `essen` varchar(50) DEFAULT NULL,
  `ordner` tinyint(1) DEFAULT NULL,
  `kurier` tinyint(1) DEFAULT NULL,
  `aufbau` tinyint(1) DEFAULT NULL,
  `festival` tinyint(1) DEFAULT NULL,
  `schicht` tinyint(1) DEFAULT NULL,
  `abbau` tinyint(1) DEFAULT NULL,
  `veteranen` tinyint(1) DEFAULT NULL,
  `userPicLink` varchar(128) DEFAULT NULL,
  `tshirtSize` varchar(10) DEFAULT NULL,
  `hoodieSize` varchar(10) DEFAULT NULL,
  `schicht_viererSchicht` int(11) NOT NULL DEFAULT '0',
  `schicht_eingangshäuschen` int(11) NOT NULL DEFAULT '0',
  `schicht_greencamping` int(11) NOT NULL DEFAULT '0',
  `schicht_nachtwache` int(11) NOT NULL DEFAULT '0',
  `schicht_küche` int(11) NOT NULL DEFAULT '0',
  `schicht_künstlerbetreuung` int(11) NOT NULL DEFAULT '0',
  `schicht_personalbüro` int(11) NOT NULL DEFAULT '0',
  `schicht_kassenbüro` int(11) NOT NULL DEFAULT '0',
  `schicht_parkplatz` int(11) NOT NULL DEFAULT '0',
  `schicht_flaschensammeln` int(11) NOT NULL DEFAULT '0',
  `schicht_ausschank` int(11) NOT NULL DEFAULT '0',
  `anmerkung` varchar(512) DEFAULT NULL,
  `fr_da_ab` int(2) DEFAULT NULL,
  `fr_da_bis` int(2) DEFAULT NULL,
  `sa_da_ab` int(2) DEFAULT NULL,
  `sa_da_bis` int(2) DEFAULT NULL,
  `so_da_ab` int(2) DEFAULT NULL,
  `so_da_bis` int(2) DEFAULT NULL,
  `aufbau_ids` varchar(256) DEFAULT NULL,
  `wunschkollegen_ids` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `aaa_user_data`
--

INSERT INTO `aaa_user_data` (`id`, `userId`, `user_email`, `klarname`, `vorname`, `nachname`, `spitzname`, `geburtstdatum`, `handynr`, `wieOftDabei`, `essen`, `ordner`, `kurier`, `aufbau`, `festival`, `schicht`, `abbau`, `veteranen`, `userPicLink`, `tshirtSize`, `hoodieSize`, `schicht_viererSchicht`, `schicht_eingangshäuschen`, `schicht_greencamping`, `schicht_nachtwache`, `schicht_küche`, `schicht_künstlerbetreuung`, `schicht_personalbüro`, `schicht_kassenbüro`, `schicht_parkplatz`, `schicht_flaschensammeln`, `schicht_ausschank`, `anmerkung`, `fr_da_ab`, `fr_da_bis`, `sa_da_ab`, `sa_da_bis`, `so_da_ab`, `so_da_bis`, `aufbau_ids`, `wunschkollegen_ids`) VALUES
(375, 12, NULL, 1, 'Christoph', 'Gergele', 'GG', '1996-04-30', '01608032057', 9, 'halal', 0, 0, 0, 1, 1, 0, 0, NULL, 'm_xl', 'xxl', 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 'B', 17, 24, 0, 24, 0, 14, '17,6', '8,17,18,60,70,99'),
(378, 13, NULL, 1, 'André', 'Lang', 'Andrew', '1986-07-19', '01799790916', 1337, 'alles', 0, 0, 1, 1, 1, 1, 1, 'userPics/13_Lang_André.jpg', 'm_l', 'l', 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 'Fahrradführerschein 0 Fehler', 10, 18, 11, 18, 12, 16, NULL, NULL),
(433, 15, NULL, 1, 'Robert', 'Goß', 'Goß', '1986-11-11', '004917657913481', 10, 'alles', 0, 0, 0, 1, 1, 0, 1, NULL, 'm_m', '0', 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, '', 18, 24, 14, 24, 0, 0, '', NULL),
(440, 16, NULL, 1, 'Lukas', 'Wecker', '', '2000-12-14', '01758595979', 1, 'vegetarisch', 0, 0, 1, 1, 1, 0, 0, 'userPics/16_Wecker_Lukas.jpeg', 'm_xxxl', '0', 1, 1, 2, 0, 0, 2, 1, 1, 1, 0, 1, '', 17, 3, 10, 3, 10, 14, NULL, NULL),
(444, 17, NULL, 1, 'Anna', 'Gorbunov ', '', '1986-11-10', '017631622499', 11, 'alles', 0, 0, NULL, 1, 1, NULL, NULL, NULL, 'm_m', 'l', 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, '', 13, 20, 13, 20, 12, 12, '', NULL),
(447, 18, NULL, 1, 'Lukas ', 'Heckl', 'Mr Schwachesfleisch', '1997-02-21', '015772964355', 5, 'alles', 1, 0, 1, 1, 1, 1, 0, 'userPics/18_Heckl_Lukas_.jpeg', 'm_xl', 'xxl', 2, 0, 2, 0, 0, 0, 1, 2, 0, 0, 0, 'LKW + ich mach einen Workshop schicht', 0, 24, 0, 24, 0, 24, '8,10,18,5,13,15', NULL),
(449, 19, NULL, 1, 'Julia', 'Rappl', '', '1994-11-11', '01738092977', 3, 'alles', 1, 0, 1, 1, 1, 0, NULL, 'userPics/19_Rappl_Julia.jpg', 'g_xxl', 'xl', 1, 1, 1, 0, 0, 0, 2, 1, 1, 0, 2, '', 12, 2, 13, 2, 13, 2, NULL, '39,80,99,114'),
(470, 24, NULL, 1, 'Stefan ', 'Schütz ', 'Dohse', '1986-08-07', '015257664274', 1, 'alles', 0, 0, 1, 1, 1, 0, 0, NULL, 'm_xl', '0', 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 1, 24, 0, 24, 0, 24, NULL, NULL),
(474, 20, NULL, 1, 'Caroline', 'Rind', 'Line Trine', '1984-09-29', '01601832297', 12, 'alles', 0, 0, 0, 1, 1, 0, 1, 'userPics/20_Rind_Caroline.jpeg', 'g_m', 'm', 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, '', 16, 20, 12, 24, 12, 12, '', NULL),
(479, 27, NULL, 1, 'Hayan', 'Hakimeh', '', '1997-08-02', '015735931259', 0, 'alles', NULL, NULL, 1, 1, NULL, NULL, NULL, 'userPics/27_Hakimeh_Hayan.jpg', 'g_xxl', 'l', 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 2, 'Nein', 12, 18, 12, 18, 12, 18, NULL, NULL),
(485, 21, NULL, 1, 'Michael', 'Wollschläger', '', '1996-09-28', '017660808701', 2, 'alles', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'userPics/21_Wollschläger_Michael.jpeg', 'm_xl', '0', 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, '', 0, 0, 0, 0, 0, 0, NULL, NULL),
(488, 28, NULL, 1, 'Andreas', 'Eibl', 'Andi', '1985-04-03', '015787831961', 6, 'alles', 0, 0, 0, 1, 1, 0, 1, 'userPics/28_Eibl_Andi.jpg', 'm_xxl', 'xxl', 0, 2, 1, 0, 2, 1, 1, 1, 2, 2, 2, '', 11, 24, 0, 24, 0, 16, NULL, NULL),
(494, 29, NULL, 1, 'Florian', 'Saß', 'Flo', '1983-04-27', '017624435902', 20, 'alles', 0, 0, 0, 1, 1, 0, 1, NULL, 'm_m', 'm', 0, 2, 1, 0, 2, 0, 1, 1, 2, 2, 2, '', 11, 24, 0, 24, 0, 16, '', NULL),
(498, 30, NULL, 1, 'Sabrina ', 'Schweiger', 'Sabi', '1999-04-15', '017643327150', 3, 'vegan', 0, 0, 1, 1, 1, 0, 0, 'userPics/30_Schweiger_Sabrina_.jpeg', 'm_m', 'm', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'X', 9, 24, 0, 24, 0, 20, '8,13', NULL),
(502, 9, NULL, 1, 'Max-Josef', 'Wurmer', 'Kosi', '1996-09-29', '015155222561', 0, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/9_Wurmer_Max-Josef.jpg', 'm_l', 'l', 1, 1, 2, 0, 0, 2, 1, 1, 1, 0, 2, '', 18, 1, 11, 24, 10, 14, NULL, NULL),
(503, 10, NULL, 1, 'Leonie', 'Maierbacher', 'Leonie ', '1997-03-17', '017636365693', 0, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/10_Maierbacher_Leonie.jpg', 'm_l', 'm', 1, 1, 2, 0, 0, 2, 1, 1, 1, 0, 2, '', 18, 1, 11, 24, 10, 14, NULL, NULL),
(543, 33, NULL, 1, 'Anna', 'Schweiger ', '', '2001-02-21', '015112804904', 1, 'vegetarisch', 1, 0, 1, 1, 1, 0, 0, NULL, 'm_m', 'm', 2, 2, 2, 0, 2, 1, 2, 2, 0, 1, 2, '', 9, 1, 9, 1, 9, 1, NULL, NULL),
(550, 35, NULL, 0, 'Sebastian', 'Hasselmann', 'Sebisn', '1986-01-03', '01749547780', 20, 'alles', NULL, NULL, 1, 1, 1, 0, 1, 'userPics/35_Hasselmann_Sebastian.jpg', 'm_m', 'm', 0, 2, 2, 0, 1, 2, 2, 2, 2, 2, 2, '', 0, 0, 0, 0, 0, 17, NULL, NULL),
(558, 37, NULL, 1, 'Christina ', 'Schweiger', '', '1975-09-11', '017643654654', 2, 'vegetarisch', NULL, NULL, NULL, 1, NULL, NULL, NULL, 'userPics/37_Schweiger_Christina_.jpg', 'm_m', 'm', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, 0, 0, 0, 0, 0, NULL, NULL),
(569, 38, NULL, 1, 'Alex', 'Schweiger ', '', '1972-09-07', '01608600492', 2, 'alles', NULL, 1, NULL, 1, NULL, NULL, NULL, 'userPics/38_Schweiger__Alex.jpg', 'm_xl', 'xl', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '3 Alt', 0, 0, 0, 0, 0, 0, NULL, NULL),
(576, 40, NULL, 1, 'Anna', 'Scheinberger', 'Anna', '2004-01-22', '015233661766', 1, 'alles', NULL, 0, 0, NULL, 1, NULL, 0, NULL, 'm_s', '0', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 15, 19, 15, 19, 0, 0, '', NULL),
(577, 39, NULL, 1, 'Katharina', 'Gmeiner', 'Kathi', '1994-08-24', '017656897446', 6, 'vegetarisch', 1, 0, 1, 1, 1, 0, 0, 'userPics/39_Gmeiner_Katharina.jpg', 'm_xl', 'xl', 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 2, '', 0, 0, 0, 0, 0, 12, '4,17,3', NULL),
(579, 31, NULL, 1, 'Christl', 'Gassner', 'Distl', '1980-10-05', '01757753478', 24, 'alles', 0, 0, 1, 1, 1, 0, 1, 'userPics/31_Gassner_Christl.jpeg', 'g_s', '0', 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 2, '', 17, 24, 0, 24, 0, 13, '1,11,6,8,10,5,15', NULL),
(581, 41, NULL, 1, 'Christine', 'Berzl', 'Christl', '2021-02-08', '017676777462', 15, 'alles', 1, 0, 0, 1, 1, 0, 0, 'userPics/41_Berzl_Christine.jpeg', 'g_l', '0', 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 'B/BE', 10, 24, 10, 17, 9, 17, '1', NULL),
(583, 42, NULL, 1, 'Reinhold', 'Schrecker', 'Egbert', '1978-07-26', '015121226551', 5, 'alles', 1, 0, 1, 1, 1, 1, 1, 'userPics/42_Schrecker_Reinhold.jpeg', 'm_m', 'm', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 'Schwerhörig', 0, 24, 0, 24, 0, 24, '3,11,14,6,7,8,10', NULL),
(588, 43, NULL, 1, 'Emilia', 'Stark ', 'Emilia', '2002-06-02', '015754464568', 3, 'vegetarisch', 0, 0, 1, 1, 1, 0, 0, 'userPics/43_Stark__Emilia.jpeg', 'm_l', '0', 1, 1, 0, 0, 0, 2, 2, 1, 0, 0, 2, '', 10, 3, 10, 3, 10, 3, '', NULL),
(594, 45, NULL, 1, 'Manuel', 'Kraus', 'Mane', '1996-02-04', '01753858418', 4, 'fleisch', 0, 0, 1, 1, 1, 0, 0, 'userPics/45_Kraus_Manuel.jpeg', 'm_xl', 'xl', 0, 2, 1, 0, 0, 2, 0, 0, 0, 1, 2, '/', 0, 24, 0, 24, 0, 12, '13', NULL),
(602, 47, NULL, 1, 'Nina', 'Scheidl', '', '1986-11-29', '01608743447', 5, 'alles', 0, 0, 1, 1, 1, 0, 0, NULL, 'm_l', 'xl', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Hängerschein BE', 0, 24, 0, 24, 0, 20, '12,4,18', NULL),
(611, 48, NULL, 1, 'Angelina ', 'Metzler', 'Angie', '1993-03-24', '015127708014', 1, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/48_Metzler_Angelina_.jpeg', 'g_m', 'xl', 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 18, 0, 16, 0, 0, 0, NULL, NULL),
(613, 50, NULL, 1, 'Anton ', 'Müller', 'Toni', '1987-12-27', '01748926072', 1, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/50_Müller_Anton_.jpg', 'm_m', '0', 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 'Elektriker', 18, 0, 0, 24, 0, 24, NULL, NULL),
(615, 51, NULL, 1, 'Nina', 'Gruber', '', '2001-04-21', '015736417995', 2, 'fleisch', 1, 0, 0, 1, 1, 0, 0, 'userPics/51_Gruber_Nina.jpeg', 'm_m', 'm', 2, 1, 0, 0, 0, 1, 2, 2, 0, 0, 0, '', 15, 24, 13, 24, 13, 24, NULL, NULL),
(623, 52, NULL, 1, 'Niclas ', 'Poulet', 'Nic', '2000-08-27', '017657868605', 0, 'vegan', 1, 0, 0, 1, 0, 0, 0, 'userPics/52_Poulet_Niclas_.jpg', 'm_l', 'l', 2, 1, 0, 0, 1, 1, 0, 1, 1, 1, 2, '', 19, 0, 0, 0, 0, 8, NULL, NULL),
(632, 53, NULL, 1, 'Lisa-maria', 'Bauer', 'Pinky ', '2000-02-10', '015168199354', 1, 'alles', 0, 0, 0, 1, 1, 0, 0, NULL, 'g_xl', 'xxl', 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, '', 0, 0, 0, 0, 0, 0, NULL, NULL),
(638, 54, NULL, 1, 'Diana', 'Guraspashvili ', 'Diana', '2004-03-08', '01629386792', 0, 'alles', NULL, 0, 0, NULL, 1, 0, NULL, NULL, 'm_s', '0', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 15, 19, 15, 19, 0, 0, '', NULL),
(650, 55, NULL, 1, 'Linus', 'Lanzendörfer', 'Bärchen', '1997-11-16', '017672384861', 2, 'alles', 1, 0, 1, 1, 1, 0, 0, NULL, 'm_xl', 'xxl', 1, 1, 2, 0, 0, 0, 0, 0, 2, 0, 2, '', 1, 1, 1, 1, 1, 3, NULL, NULL),
(655, 56, NULL, 1, 'Franz', 'Heiß', 'Fänti', '1987-05-04', '01711457274', 10, 'fleisch', 0, 0, 0, 1, 1, 0, 0, NULL, 'm_xxxl', 'xxxl', 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, '', 20, 24, 0, 24, 0, 12, '12,4,6', NULL),
(661, 57, NULL, 1, 'Anna', 'Sedlmeier', 'Anna ', '1988-02-23', '015753293364', 4, 'vegetarisch', 0, 0, 0, 1, 1, 1, 1, 'userPics/57_Sedlmeier_Anna.jpg', '0', '0', 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 'Mache Orga \"Team grün\" und Workshop zum Upcycling (Leder, Tetrapacks) am Sonntag, gerne Betreuung unseres Pavillons/Stands. Zwei kleine Kinder, deshalb sind weitere Schichten schwer zu planen, aber ein/zwei Schichten (nach)mittags möglich. Auch gerne spontan als Aushilfe, wenn die Kinderbetreuung gut klappt. Beim Abbau am Sonntag und Montag dabei (evtl mit Kind)', 17, 19, 11, 18, 11, 18, '', NULL),
(664, 58, NULL, 1, 'René', 'Battermann', 'Mr. Ronni', '1989-07-02', '017640431452', 69, 'alles', 1, 0, 1, 1, 0, 1, 1, NULL, 'm_l', 'xl', 1, 1, 0, 0, 0, 1, 2, 2, 0, 0, 2, '', 14, 3, 11, 3, 11, 3, '12,4,6,7', '8'),
(666, 59, NULL, 1, 'korbinian', 'kiendl', 'Korbi', '1990-05-21', '01782875900', 10, 'vegetarisch', 0, 0, 0, 1, 1, 0, 0, 'userPics/59_kiendl_korbinian.jpg', 'm_m', 'm', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(667, 60, NULL, 1, 'Miro', 'Lazic', 'Miro', '1984-01-06', '01791461679', 10, 'vegetarisch', 0, 0, 0, 1, 0, 0, 0, 'userPics/60_Lazic_Miro.jpeg', 'm_l', 'l', 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 'Da ich frisch Papa bin, weiss ich nicht ob/wie ich da sein werde - daher bitte nur für Büro/Finanzen einplanen.', 12, 0, 0, 0, 0, 0, NULL, NULL),
(669, 61, NULL, 1, 'Tobias', 'Breundl', 'Tobi', '1995-12-31', '015259850486', 0, 'vegetarisch', 0, 0, 0, 1, 1, 0, 0, 'userPics/61_Breundl_Tobias.jpg', 'm_l', 'l', 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, '', 16, 24, 10, 24, 0, 0, NULL, NULL),
(673, 62, NULL, 1, 'Sabrina ', 'Kuffer', 'Brina', '1986-02-17', '01608030197', 7, 'vegetarisch', 0, 1, 0, 1, 1, 0, 0, 'userPics/62_Kuffer_Sabrina_.jpeg', 'm_m', 'm', 1, 1, 0, 0, 0, 0, 2, 1, 0, 0, 0, '', 10, 24, 0, 24, 0, 14, '4', NULL),
(684, 64, NULL, 1, 'Florian', 'Sedlmeier', 'Flori', '1981-02-03', '01789757017', 19, 'vegetarisch', 0, 0, 0, 1, 1, 0, 1, 'userPics/64_Sedlmeier_Florian.jpg', '0', '0', 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 'Leider wenig Zeit wegen Kindern ', 16, 20, 12, 18, 10, 18, NULL, NULL),
(686, 65, NULL, 1, 'Michael ', 'Trübswetter ', 'Fiedler', '1991-07-15', '01757366950', 2, 'vegetarisch', 0, 0, 0, 1, 0, 0, 0, 'userPics/65_Trübswetter__Michael_.jpg', 'm_l', '0', 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, '', 18, 2, 14, 2, 0, 0, NULL, NULL),
(691, 36, NULL, 0, 'Kathleen', 'Busse ', 'Bussi ', '1989-03-25', '015253486173', 0, 'vegetarisch', 1, 0, 1, 1, 1, 0, NULL, 'userPics/36_Busse__Kathleen.jpeg', 'g_m', 'm', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Führerschein da ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(692, 67, NULL, 1, 'Markus', 'Schmidt ', '', '1953-06-01', '015775332927', 2, 'alles', 0, 0, 0, 1, 1, 0, 1, NULL, 'm_l', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Ich mach Kinderbetreuung für Flo und Anna, damit die mitarbeiten können', 16, 7, 10, 6, 12, 4, NULL, NULL),
(702, 68, NULL, 1, 'Christian', 'Wittl', 'Bruce', '1989-08-11', '01753262103', 3, 'alles', 1, 0, 1, 1, 1, 0, 0, 'userPics/68_Wittl_Christian.jpeg', 'm_l', 'l', 2, 2, 0, 2, 0, 0, 2, 2, 2, 2, 0, '', 12, 24, 10, 24, 0, 0, '12,4,18', ''),
(708, 69, NULL, 1, 'Veronika', 'Dotzauer', 'Vroni', '1983-02-01', '01773953914', 1, 'vegetarisch', 0, 1, 1, 0, 0, 1, 0, NULL, '0', '0', 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, '', 0, 0, 8, 14, 0, 0, NULL, NULL),
(710, 70, NULL, 1, 'Maria-Anna', 'Kopp', 'Anna', '1989-03-31', '017662421784', 10, 'vegetarisch', 0, 0, 1, 1, 1, 1, 0, 'userPics/70_Kopp_Maria-Anna.jpeg', 'm_s', 'm', 1, 0, 1, 0, 1, 2, 2, 1, 0, 0, 2, '', 15, 24, 12, 24, 12, 18, NULL, NULL),
(712, 71, NULL, 1, 'Sebastian ', 'Harter', 'Don Harter', '1987-08-07', '01711661065', 21, 'vegetarisch', 0, 0, 1, 1, 1, 1, 1, NULL, 'm_l', '0', 0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 0, '', 10, 24, 0, 24, 0, 24, NULL, NULL),
(716, 46, NULL, 1, 'Sophie', 'Riepl', '', '1999-06-17', '01704154669', 3, 'vegetarisch', 0, 0, 0, 1, 1, 0, 0, 'userPics/46_Riepl_Sophie.jpeg', 'm_m', '0', 0, 2, 1, 0, 0, 2, 1, 1, 0, 0, 2, 'Schichtleiter gleich mit Elli Frank, Sonntag nicht da', 17, 23, 11, 23, 10, 11, NULL, NULL),
(717, 44, NULL, 1, 'Elli', 'Frank', 'Elli', '1998-11-24', '01607541733', 3, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/44_Frank_Elli.jpeg', 'm_s', '0', 0, 2, 1, 0, 0, 2, 1, 1, 0, 0, 2, 'Schichtzeiten bitte gleich wie Sophie Riepl.', 17, 23, 11, 23, 10, 11, NULL, NULL),
(724, 72, NULL, 1, 'Julian ', 'Baumgartner ', '', '1995-03-16', '015788242080', 2, 'alles', 1, 0, 0, 1, 0, 0, 0, 'userPics/72_Baumgartner__Julian_.jpg', 'm_m', '0', 1, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, '', 20, 24, 0, 24, 0, 10, NULL, NULL),
(730, 75, NULL, 1, 'Peter ', 'Schweiger', '', '1992-10-18', '01601510916', 6, 'fleisch', 0, 0, 1, 1, 1, 1, 1, 'userPics/75_Schweiger_Peter_.jpeg', 'm_m', 'm', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 15, 21, 15, 21, 0, 0, '9', NULL),
(736, 76, NULL, 1, 'Martina', 'Kießwetter ', '', '1976-02-18', '017662033719', 4, 'vegetarisch', 0, 0, 1, 1, 1, 1, NULL, 'userPics/76_Kießwetter__Martina.jpg', 'm_l', 'l', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Mithilfe in der \"Mamahütte\" ', 10, 17, 6, 12, 6, 12, '', NULL),
(738, 77, NULL, 1, 'Luis', 'Brixner', 'Luis', '1998-04-22', '01786515690', 1, 'alles', 0, 0, 1, 1, 1, 1, 0, NULL, 'm_m', 'm', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 8, 20, 8, 20, 8, 20, NULL, NULL),
(740, 78, NULL, 1, 'Julian ', 'Schmitzer', 'Schmitzer', '2008-03-15', '01608991015', 0, 'alles', 0, 0, 1, 1, 0, 1, 0, NULL, 'm_m', 'm', 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 'Nein', 8, 24, 8, 24, 8, 20, NULL, NULL),
(745, 80, NULL, 1, 'Anna', 'Bauer', 'Anna', '1993-06-13', '01605652386', 4, 'vegetarisch', 1, NULL, NULL, 1, 1, NULL, NULL, 'userPics/80_Bauer_Anna.jpg', 'g_xl', 'xl', 1, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, '', 10, 22, 8, 24, 10, 15, NULL, NULL),
(790, 82, NULL, 1, 'Patrick', 'Mudrack', 'Mudi', '1986-07-18', '01737545532', 20, 'alles', 0, 0, 1, 1, 1, 0, 1, 'userPics/82_Mudrack_Patrick.jpeg', 'm_l', '0', 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, '', 0, 24, 0, 24, 0, 18, '4,12', NULL),
(841, 83, NULL, 1, 'Stefan', 'Triebswetter', 'Triebi', '1989-12-25', '017634370792', 13, 'alles', 0, 0, 1, 1, 0, 1, 1, 'userPics/83_Triebswetter_Stefan.jpg', 'm_xl', '0', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '', 0, 24, 0, 24, 0, 24, '18', NULL),
(849, 81, NULL, 1, 'Simon ', 'Kiendl', '', '1986-03-08', '015155335514', 2, 'alles', 1, 0, 1, 1, 0, 1, 0, NULL, 'm_xl', 'xl', 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, '', 0, 0, 0, 0, 0, 0, '', NULL),
(853, 84, NULL, 0, 'Alina', 'Halbritter', 'Alina', '2001-04-08', '01601148166', 0, 'vegetarisch', 0, 0, 0, 1, 1, 0, 0, 'userPics/84_Halbritter_Alina.jpeg', 'm_l', 'm', 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, '', 12, 24, 12, 24, 12, 18, '', NULL),
(882, 86, NULL, 1, 'Kevin', 'Corrigan', 'Kev', '1992-04-22', '015141907135', 3, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/86_Corrigan_Kevin.jpg', 'g_xl', 'xl', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'keinerlei einschränkungen', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(883, 89, NULL, 1, 'Clemens ', 'Koller', 'Clemens ', '1995-11-03', '015172187606', 0, 'alles', 0, 0, 0, 1, 1, 0, 0, 'userPics/89_Koller_Clemens_.jpeg', 'm_l', '0', 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 2, '', 14, 24, 10, 20, 18, 18, '', NULL),
(889, 92, NULL, 1, 'Günter', 'Stark', 'Güni', '1995-08-02', '015172665075', 4, 'alles', 1, 0, 1, 1, 1, 0, 0, 'userPics/92_Stark_Günter.jpeg', 'm_m', 'l', 1, 1, 1, 0, 0, 2, 2, 1, 1, 1, 2, '', 10, 0, 0, 0, 0, 14, '12,4,2,3,11,14,7,10,13,15', NULL),
(895, 94, NULL, 1, 'Josef', 'Schmailzl', '', '1957-02-12', '015757471944', 0, 'vegetarisch', 1, 0, 0, 1, 1, 0, 0, NULL, 'm_xl', '0', 0, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, '', 18, 24, 18, 24, 0, 0, '', NULL),
(914, 8, NULL, 1, 'Michael', 'Lang', 'Michi', '1989-11-17', '015153587706', 23, 'vegetarisch', 0, 0, 1, 1, 1, 1, 0, 'userPics\\8_Lang_Michael.jpg', 'm_l', 'xl', 2, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, '', 12, 24, 0, 24, 0, 24, '12,4,11,6,7,5', '12,58'),
(927, 96, NULL, 1, 'Michael', 'Herzog', 'Michi', '2007-11-29', '015125007537', 0, 'fleisch', 0, 0, 1, 1, 0, 1, 0, NULL, 'm_l', 'l', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Nein ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(948, 90, NULL, 0, 'Steffi', 'Schrödl', 'Steffi', '1992-04-01', '01782786676', 5, 'alles', 1, 0, 0, 1, 1, 0, 1, 'userPics/90_Schrödl_Steffi.jpg', '', '', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'nein', 0, 0, 20, 0, 0, 14, '', NULL),
(965, 99, NULL, 1, 'Kati', 'Baumann', 'Kati ', '1994-04-01', '017696284626', 1000, 'alles', 1, 0, 0, 1, 1, 0, 1, NULL, 'm_m', 'l', 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 2, 'Nix', 0, 0, 0, 0, 0, 11, '17,3,6,5,13,15', NULL),
(978, 26, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(993, 100, NULL, 1, 'Katja ', 'Geiger', 'Katja', '1999-02-02', '015168489487', 0, 'alles', 0, 0, 0, 1, 1, 0, 0, NULL, '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Starke Rückenbeschwerden ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(996, 101, NULL, 1, 'Sebastian', 'Rind', 'Rindi', '1986-01-05', '017645854117', 18, 'alles', 0, 0, 1, 0, 1, NULL, 1, NULL, 'm_m', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'BE, Staplerschein ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1006, 102, NULL, 1, 'Tom', 'Herzog', '', '1970-01-02', '01704164566', 1, 'fleisch', 0, 0, 0, 0, 0, 0, 1, NULL, 'm_l', 'l', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1008, 103, NULL, 1, 'Stephan', 'Dietz', 'Dietzi', '1988-02-09', '015226267758', 10, 'alles', 0, 0, 0, 1, 1, 0, 1, 'userPics/103_Dietz_Stephan.jpg', 'm_l', '', 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, '', 0, 0, 14, 23, 0, 0, '', NULL),
(1009, 104, NULL, 1, 'Peter', 'Schels', 'Schelsi', '1987-06-02', '017664088408', 12, 'alles', 0, NULL, 0, 1, 1, 0, 1, 'userPics/104_Schels_Peter.jpg', 'm_xl', '', 0, 2, 2, 0, 0, 0, 2, 0, 2, 0, 2, '', 0, 0, 12, 24, 0, 0, '', NULL),
(1010, 105, NULL, 1, 'Sebastian', 'Kolbinger', 'Kolly', '1986-09-18', '01703158837', 20, 'alles', 0, 0, 0, 1, 1, 0, 1, 'userPics/105_Kolbinger_Sebastian.jpeg', 'm_m', '0', 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 'Bitte Schichten mit Schelsi', 0, 0, 12, 23, 0, 0, '', NULL),
(1030, 106, NULL, 0, 'Stefan', 'Schmid', 'Sched', '1996-05-10', '01621807311', 0, 'fleisch', 0, 0, 0, 1, 1, 0, 1, NULL, 'm_xl', 'xl', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1036, 107, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1037, 108, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1038, 109, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1041, 110, NULL, 1, 'Theresa', 'Weigert', '', '1994-04-18', '015141694402', 2, 'vegetarisch', 0, 0, NULL, 1, 1, NULL, NULL, 'userPics/110_Weigert_Theresa.jpeg', 'g_xs', 's', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, '', 16, 24, 14, 24, 14, 17, '', NULL),
(1046, 22, NULL, 1, 'Bastian ', 'Haust', '', '1983-03-29', '01705770896', 10, 'alles', 1, 1, 1, 1, 1, NULL, 1, 'userPics/22_Haust_Bastian_.jpg', '0', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'FSKl CE', 14, 22, 8, 22, 8, 22, '9,12,16,4,17,1,2,3,11,14,7,8,10,18,5,13,15', NULL),
(1054, 111, NULL, 1, 'Eva', 'Mader', '', '1998-12-21', '01733991675', 0, 'vegetarisch', 0, 0, 0, 1, 0, 0, 0, NULL, 'g_xxs', 's', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'PKW Führerschein', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1060, 112, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1076, 113, NULL, 1, 'Selina', 'Hirsch', 'Seli', '2003-05-03', '015155484838', 0, 'vegetarisch', NULL, 0, 0, 1, 1, 0, 0, 'userPics/113_Hirsch_Selina.jpg', 'm_s', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1084, 114, NULL, 1, 'Cheryl', 'Rackwitz', 'Tante Berti', '1993-05-26', '016094682365', 0, 'alles', 1, 0, 0, 1, 1, 0, 0, 'userPics/114_Rackwitz_Cheryl.jpeg', 'm_s', '0', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'bissl fett', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1100, 115, NULL, 1, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1107, 116, NULL, 1, 'Florian ', 'Danner', 'flimo films', '1995-06-24', '017631229129', 0, 'alles', 0, 0, 0, 1, 0, 0, NULL, 'userPics/116_Danner_Florian_.jpg', 'm_xxl', 'xl', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Filmproduktion. Simon Haseneder & Florian Danner. Reservierter Parkplatz beim Eingang für Equipment. 2 Tickets 3Tage mit Camping. T-Shirt Größe S für Simon. Danke!', 17, 24, 0, 24, 0, 0, '', NULL),
(1115, 117, NULL, 1, 'Michael', 'Schmid', 'Michi', '1990-08-29', '017650880405', 1, 'alles', 0, 1, 0, 1, 1, 0, 0, 'userPics/117_Schmid_Michael.jpeg', 'g_m', '0', 1, 1, 1, 0, 2, 2, 2, 2, 2, 0, 2, '-', 10, 20, 10, 20, 9, 12, '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aaa_user_data`
--
ALTER TABLE `aaa_user_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aaa_user_data`
--
ALTER TABLE `aaa_user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1276;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
