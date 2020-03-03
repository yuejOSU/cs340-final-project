-- get all customer information and populate it in the customer table
SELECT Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM Customers;

-- get all booking information and populate it in the booking table
SELECT Bookings.bookings_id, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Customers.email_address, Bookings.booking_date FROM Bookings
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid;

-- get all booking_detail information and populate it in the booking_detail table
SELECT Booking_Details.booking_details_id, Booking_Details.booking_price, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details
LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid
LEFT JOIN Customers ON Customers.customer_id = Bookings.cid
LEFT JOIN Rooms ON Rooms.room_id = Booking_Details.rid
GROUP BY whole_name;

-- get all room information and populate it in the rooms table
SELECT Rooms.room_id, Rooms.room_price, Rooms.is_clean, Rooms.is_occupied FROM Rooms;

-- get booking details for a searched customer (using the search bar)
SELECT Booking_Details.booking_details_id, Booking_Details.booking_price, CONCAT_WS(' ', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details
JOIN Customers ON Customers.customer_id = Booking_Details.cid
JOIN Rooms ON Rooms.room_id = Booking_Details.rid
WHERE Customers.first_name = :fnameInput AND Customers.last_name = :lnameInput;


-- adds a new customer
INSERT INTO Customers (first_name, last_name, email_address, age) VALUES (:fnameInput, :lnameInput, :emailInput, :ageInput);

-- adds a new booking
INSERT INTO Bookings (date) VALUES (:dateInput);

-- adds a new room
INSERT INTO Rooms (is_clean, is_occupied) VALUES (:cleanInput, occupiedInput);

-- associate a customer with a certificate (M-to-M relationship addition)
INSERT INTO Booking_Details (bid, rid, booking_price) VALUES (:booking_id_to_associate, :room_id_to_associate, bookingPriceInput);

-- update a customer's data based on submission of the Update customer form
UPDATE Customers SET first_name = :fnameInput, last_name= :lnameInput, email_address = :emailInput, age= :ageInput WHERE id= :customer_ID_from_the_update_form;

-- delete a customer
DELETE FROM Customers WHERE id = :customer_ID_selected;

-- delete a room
DELETE FROM Rooms WHERE id = :room_ID_selected;

-- delete a booking
DELETE FROM Bookings WHERE id = :booking_ID_selected;

-- dis-associate a certificate from a room/booking (M-to-M relationship deletion)
DELETE FROM Booking_Details WHERE rid = :room_id_to_disassociate AND bid = :booking_id_to_disassociate;
