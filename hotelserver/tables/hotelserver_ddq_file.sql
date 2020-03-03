-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: HotelServer
-- ------------------------------------------------------
-- Server version 10.1.37-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Customers`
--
DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Customers` (
  `customer_id` int(11) AUTO_INCREMENT NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--
LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
  INSERT INTO `Customers` (`email_address`, `first_name`, `last_name`, `age`) VALUES ('boobroos@gmail.com', 'Bob', 'Ross', 27),
                                                                                     ('jjwattoffense@aol.com', 'Jay Jay', 'Watt', 99),
                                                                                     ('ballislife@yahoo.com', 'Pro', 'Baller', 18);
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bookings`
--
DROP TABLE IF EXISTS `Bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Bookings` (
  `booking_id` int(11) AUTO_INCREMENT NOT NULL,
  `cid` int(11) NOT NULL DEFAULT '0',
  `booking_date` date NOT NULL,
  PRIMARY KEY (`booking_id`),
  CONSTRAINT FOREIGN KEY (`cid`) REFERENCES Customers(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Bookings` WRITE;
/*!40000 ALTER TABLE `Bookings` DISABLE KEYS */;
INSERT INTO `Bookings` (`cid`, `booking_date`) VALUES (1, '1920-09-08'),
                                                      (2, '2020-02-20'),
                                                      (3, '2002-04-20');
/*!40000 ALTER TABLE `Bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rooms`
--
DROP TABLE IF EXISTS `Rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rooms` (
  `room_id` int(11) AUTO_INCREMENT NOT NULL,
  `room_price` int(11) NOT NULL,
  `is_clean` boolean NOT NULL,
  `is_occupied` boolean NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
INSERT INTO `Rooms` (`room_price`, `is_clean`, `is_occupied`) VALUES (98, false, true),
                                                                     (198, false, false),
                                                                     (299, true, true);
/*!40000 ALTER TABLE `Rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Booking_Details`
--
DROP TABLE IF EXISTS `Booking_Details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Booking_Details` (
  `booking_details_id` int(11) AUTO_INCREMENT NOT NULL,
  `bid` int(11),
  `rid` int(11),
  `booking_price` int NOT NULL,
  PRIMARY KEY (`booking_details_id`),
  CONSTRAINT FOREIGN KEY (`bid`) REFERENCES Bookings(`booking_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (`rid`) REFERENCES Rooms(`room_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Booking_Details` WRITE;
/*!40000 ALTER TABLE `Booking_Details` DISABLE KEYS */;
INSERT INTO `Booking_Details` (`bid`, `rid`, `booking_price`) VALUES (1, 1, 98),
                                                                     (2, 1, 98),
                                                                     (3, 2, 198);
/*!40000 ALTER TABLE `Booking_Details` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-22 18:33:00