# Sports-Management-System

# Backend Requirements

node.js
Nodemon
Navigate to directory BackEnd
Code to start backend : npm start

# Frontend Requirements

React.js
Navigate to directory src
Code to start frontend : npm start

# Database Connections

mysql
username is the database name and host is the database host name
password is the database password
Port number is 5001
Run the Database.sql first

# About Project

The application is now navigating to the login page. The login page contains two options for either a player or an admin login. The player login page also contains an option to register for a new player. When a new player registers, it gets updated in the database. After getting updated, a new player can log into the system. It is a requirement to input both username and password in order to login. On successful login, a player is redirected to their dashboard. Here, one can see his statistics, as well as scheduled matches.

Admins, once logged in successfully, get redirected to the admin dashboard. It contains Team Management and Schedule Games options here. The newly registered player or a player without his assigned team will be viewed along with his sport at the Team Management section. Admin can use this option to form teams. Under the Schedule Games tab, admins can schedule matches between two teams at a specified venue and time slot. If another match is already scheduled for the same slot and venue, there is a conflict, and the system does not allow scheduling; it shows a message saying that the slot is already booked.

Use of Triggers
A trigger is triggered when a player is added to a team.
A match scheduling conflict triggers also.

Usage of Views
Player Stats View reports detailed statistics about individual players.

Login examples for both player and admin present in the database
Player : DavidJohnson
Password : password123

Admin : admin
Password : adminpassword