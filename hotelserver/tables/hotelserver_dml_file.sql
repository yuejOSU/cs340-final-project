-- get all customer information and populate it in the customer table
SELECT Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM Customers;

-- get all booking information and populate it in the booking table
SELECT Bookings.booking_id, Customers.customer_id, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Customers.email_address, Bookings.booking_date FROM Bookings
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid;

-- get all room information and populate it in the rooms table
SELECT Rooms.room_id, Rooms.room_price, Rooms.is_clean, Rooms.is_occupied FROM Rooms;

-- get all booking_detail information and populate it in the booking_detail table
SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details
LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid
RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid
WHERE Customers.first_name != '';

-- get all booking_detail information for a specific customer and populate it in the booking_detail table
SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details
LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid
RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid
WHERE Customers.first_name = "'+params.searchFirstName+'" AND Customers.last_name = "'+params.searchLastName+'";

-- get all booking_detail information for a specific range of booking prices and populate it in the booking_detail table
SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details
LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid
RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid
WHERE Customers.first_name != '' AND Booking_Details.booking_price >= "'+params.searchMinPrice+'" AND Booking_Details.booking_price <= "'+params.searchMaxPrice+'";


-- adds a new customer
INSERT INTO Customers (first_name, last_name, email_address, age) VALUES ("'+params.first_name+'", "'+params.last_name+'", "'+params.email_address+'", "'+params.age+'");

-- adds a new booking when a new customer is created
INSERT INTO Bookings (cid, booking_date) VALUES ((SELECT AUTO_INCREMENT-1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'cs340_yuej' AND TABLE_NAME = 'Customers'), curdate());

-- adds a new booking given existing customer
INSERT INTO Bookings (cid, booking_date) VALUES ("'+params.customer_id+'", "'+params.booking_date+'");

-- adds a new room
INSERT INTO Rooms (room_price, is_clean, is_occupied) VALUES ("'+params.room_price+'", "'+params.is_clean+'", "'+params.is_occupied+'");

-- associate a customer with a certificate (M-to-M relationship addition)
INSERT INTO Booking_Details (bid, rid, booking_price) VALUES ((SELECT AUTO_INCREMENT-1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'cs340_yuej' AND TABLE_NAME = 'Bookings'), "'+params.room_id+'", (SELECT Rooms.room_price FROM Rooms WHERE Rooms.room_id="'+params.room_id+'"));

-- update a customer's data based on submission of the Update customer form
UPDATE Customers SET Customers.first_name = "'+params.first_name+'", Customers.last_name = "'+params.last_name+'", Customers.email_address = "'+params.email_address+'", Customers.age = "'+params.age+'" WHERE Customers.customer_id = "'+params.customer_id+'"

-- delete a customer
DELETE FROM ' + params.table + ' WHERE ' + params.table_id_clause + '=' + params.id';