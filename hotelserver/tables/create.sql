-- Customers
CREATE TABLE `Customers` (
`customer_id` int(11) AUTO_INCREMENT NOT NULL,
`email_address`, varchar(255), NOT NULL,
`first_name` varchar(255) NOT NULL,
`last_name` varchar(255) NOT NULL,
PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Bookings
CREATE TABLE `Bookings` (
`booking_id` int(11) AUTO_INCREMENT NOT NULL,
`cid` int,
`booking_date` varchar(255), NOT NULL
FOREIGN KEY (cid) REFERENCES Customers(customer_id),
PRIMARY KEY (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Booking_Details
CREATE TABLE `Booking_Details` (
`bid` int,
`rid` int,
`booking_price` int, NOT NULL
FOREIGN KEY (bid) REFERENCES Bookings(booking_id),
FOREIGN KEY (rid) REFERENCES Rooms(room_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Rooms
CREATE TABLE `Rooms` (
`room_id` int NOT NULL,
`room_price` int NOT NULL,
`is_clean` boolean NOT NULL,
`is_occupied` boolean NOT NULL,
PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
