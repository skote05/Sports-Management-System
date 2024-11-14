-- Create Database
CREATE DATABASE IF NOT EXISTS sports_management_system;
USE sports_management_system;

-- Create Login Table
CREATE TABLE IF NOT EXISTS Login (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(100),
    Account_Type VARCHAR(10) NOT NULL -- 'player' or 'admin'
);

-- Create Sport Table
CREATE TABLE IF NOT EXISTS Sport (
    Sport_ID INT AUTO_INCREMENT PRIMARY KEY,
    Sport_Name VARCHAR(100),
    Sport_Type VARCHAR(50)
);

-- Create Team Table
CREATE TABLE IF NOT EXISTS Team (
    Team_ID INT AUTO_INCREMENT PRIMARY KEY,
    Team_name VARCHAR(100),
    Max_Team_Size INT,
    Sport_ID INT,
    FOREIGN KEY (Sport_ID) REFERENCES Sport(Sport_ID)
);

-- Create Match Table
CREATE TABLE IF NOT EXISTS Match (
    Match_ID INT AUTO_INCREMENT PRIMARY KEY,
    Date_of_match DATE,
    Location VARCHAR(100),
    Score VARCHAR(50),
    Sport_ID INT,
    FOREIGN KEY (Sport_ID) REFERENCES Sport(Sport_ID)
);

-- Create Tournament Table
CREATE TABLE IF NOT EXISTS Tournament (
    Tournament_ID INT AUTO_INCREMENT PRIMARY KEY,
    Tournament_Name VARCHAR(100),
    Start_date DATE,
    End_date DATE,
    Location VARCHAR(100)
);

-- Create Venue Table
CREATE TABLE IF NOT EXISTS Venue (
    Venue_ID INT AUTO_INCREMENT PRIMARY KEY,
    Venue_Name VARCHAR(100),
    Location VARCHAR(100),
    Capacity_of_Spectators INT
);

-- Create Sponsor Table
CREATE TABLE IF NOT EXISTS Sponsor (
    Sponsor_ID INT AUTO_INCREMENT PRIMARY KEY,
    Sponsor_Name VARCHAR(100),
    Phone_no VARCHAR(15),
    Email VARCHAR(100)
);

-- Create Coach Table
CREATE TABLE IF NOT EXISTS Coach (
    Coach_ID INT AUTO_INCREMENT PRIMARY KEY,
    Coach_Name VARCHAR(100),
    DOB DATE,
    Years_of_Experience INT,
    Email VARCHAR(100),
    Phone_no VARCHAR(15)
);

-- Create Manager Table
CREATE TABLE IF NOT EXISTS Manager (
    Manager_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Phone_no VARCHAR(15)
);

-- Create Player Table
CREATE TABLE IF NOT EXISTS Player (
    Player_ID INT AUTO_INCREMENT PRIMARY KEY,
    Player_Name VARCHAR(100),
    DOB DATE,
    Gender VARCHAR(10),
    Position VARCHAR(50),
    Email VARCHAR(100),
    Age INT,
    Phone_no VARCHAR(15)
);

-- Create Stats Table
CREATE TABLE IF NOT EXISTS Stats (
    Stat_ID INT AUTO_INCREMENT PRIMARY KEY,
    Player_ID INT,
    Sport_ID INT,
    Wins INT,
    Points_scored INT,
    Goals_scored INT,
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
    FOREIGN KEY (Sport_ID) REFERENCES Sport(Sport_ID)
);

-- Create Payment Table
CREATE TABLE IF NOT EXISTS Payment (
    Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Amount DECIMAL(10, 2),
    Player_ID INT,
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID)
);

-- Create Sponsorship Table
CREATE TABLE IF NOT EXISTS Sponsorship (
    Sponsorship_ID INT AUTO_INCREMENT PRIMARY KEY,
    Amount DECIMAL(10, 2),
    Contract_date DATE,
    Sponsor_ID INT,
    Team_ID INT,
    FOREIGN KEY (Sponsor_ID) REFERENCES Sponsor(Sponsor_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID)
);

-- Create Player_Phone Table (Multi-valued attribute for Player)
CREATE TABLE IF NOT EXISTS Player_Phone (
    Phone_ID INT AUTO_INCREMENT PRIMARY KEY,
    Player_ID INT,
    Phone_no VARCHAR(15),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID)
);

-- Create Sponsor_Email Table (Multi-valued attribute for Sponsor)
CREATE TABLE IF NOT EXISTS Sponsor_Email (
    Email_ID INT AUTO_INCREMENT PRIMARY KEY,
    Sponsor_ID INT,
    Email VARCHAR(100),
    FOREIGN KEY (Sponsor_ID) REFERENCES Sponsor(Sponsor_ID)
);

-- Create Manages Table (Relationship between Manager and Team)
CREATE TABLE IF NOT EXISTS Manages (
    Manager_ID INT,
    Team_ID INT,
    Start_Date DATE,
    End_Date DATE,
    PRIMARY KEY (Manager_ID, Team_ID),
    FOREIGN KEY (Manager_ID) REFERENCES Manager(Manager_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID)
);

-- Create Plays_for Table (Relationship between Player and Team)
CREATE TABLE IF NOT EXISTS Plays_for (
    Team_ID INT,
    Player_ID INT,
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
    PRIMARY KEY (Team_ID, Player_ID)
);

-- Create Involves Table (Relationship between Tournament and Match)
CREATE TABLE IF NOT EXISTS Involves (
    Tournament_ID INT,
    Match_ID INT,
    FOREIGN KEY (Tournament_ID) REFERENCES Tournament(Tournament_ID),
    FOREIGN KEY (Match_ID) REFERENCES Match(Match_ID),
    PRIMARY KEY (Tournament_ID, Match_ID)
);

CREATE TABLE IF NOT EXISTS Match_Teams (
    Match_Team_ID INT AUTO_INCREMENT PRIMARY KEY,
    Match_ID INT,
    Team_ID INT,
    FOREIGN KEY (Match_ID) REFERENCES `Match`(Match_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID)
);

-- Modify the `Match_ID` column to AUTO_INCREMENT
ALTER TABLE `Match` MODIFY COLUMN Match_ID INT AUTO_INCREMENT;


-- Insert player 1 with username before password
INSERT INTO Login (Username, Password, Account_Type)
VALUES ('player1', 'password123', 'player');

-- Insert player 2 with username before password
INSERT INTO Login (Username, Password, Account_Type)
VALUES ('player2', 'password456', 'player');

-- Insert admin with username before password
INSERT INTO Login (Username, Password, Account_Type)
VALUES ('admin', 'adminpassword', 'admin');

---

-- **Trigger to Update Player Stats After Each Match**
DELIMITER $$

CREATE TRIGGER update_player_stats_after_match
AFTER UPDATE ON Match
FOR EACH ROW
BEGIN
    DECLARE player_id INT;
    DECLARE goals INT;
    DECLARE points INT;
    
    -- Assuming we have player info and goals scored in match score
    SET player_id = 1;  -- Placeholder, update with actual logic to fetch player_id
    SET goals = 2;      -- Placeholder, update with actual logic to fetch goals
    SET points = 5;     -- Placeholder, update with actual logic to fetch points
    
    INSERT INTO Stats (Player_ID, Sport_ID, Wins, Points_scored, Goals_scored)
    VALUES (player_id, NEW.Sport_ID, 1, points, goals);
END $$

DELIMITER ;

---

-- **Trigger to Automatically Set Player's Age from DOB**
DELIMITER $$

CREATE TRIGGER set_player_age
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    SET NEW.Age = TIMESTAMPDIFF(YEAR, NEW.DOB, CURDATE());
END $$

DELIMITER ;

---

-- **Stored Procedure to Add a New Player**
DELIMITER $$

CREATE PROCEDURE AddNewPlayer(
    IN p_name VARCHAR(100),
    IN p_dob DATE,
    IN p_gender VARCHAR(10),
    IN p_position VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone_no VARCHAR(15)
)
BEGIN
    INSERT INTO Player (Player_Name, DOB, Gender, Position, Email, Phone_no)
    VALUES (p_name, p_dob, p_gender, p_position, p_email, p_phone_no);
END $$

DELIMITER ;

---

-- **Stored Procedure to Update Match Score**
DELIMITER $$

CREATE PROCEDURE UpdateMatchScore(
    IN p_match_id INT,
    IN p_score VARCHAR(50)
)
BEGIN
    UPDATE Match
    SET Score = p_score
    WHERE Match_ID = p_match_id;
END $$

DELIMITER ;

---

-- **Stored Procedure to Add a New Sponsor**
DELIMITER $$

CREATE PROCEDURE AddNewSponsor(
    IN s_name VARCHAR(100),
    IN s_phone_no VARCHAR(15),
    IN s_email VARCHAR(100)
)
BEGIN
    INSERT INTO Sponsor (Sponsor_Name, Phone_no, Email)
    VALUES (s_name, s_phone_no, s_email);
END $$

DELIMITER ;

---

-- **Stored Procedure to Add a New Team**
DELIMITER $$

CREATE PROCEDURE AddNewTeam(
    IN t_name VARCHAR(100),
    IN max_size INT,
    IN sport_id INT
)
BEGIN
    INSERT INTO Team (Team_name, Max_Team_Size, Sport_ID)
    VALUES (t_name, max_size, sport_id);
END $$

DELIMITER ;

-- Create Database and Tables (You already have this part from the previous SQL file)

-- Additional Triggers

-- Trigger to automatically update player stats when a match is inserted
DELIMITER $$

CREATE TRIGGER update_player_stats_after_match
AFTER INSERT ON Match
FOR EACH ROW
BEGIN
    DECLARE player_wins INT;
    DECLARE player_goals INT;

    -- Assuming the score is stored as "team1_goals-team2_goals" format, you may need to adjust this logic
    SET player_wins = CASE 
                         WHEN NEW.Score LIKE CONCAT('%', '1', '%') THEN 1
                         ELSE 0
                       END;
    
    SET player_goals = CAST(SUBSTRING_INDEX(NEW.Score, '-', 1) AS INT);

    -- Update stats for players in the teams
    -- You should have the logic for how players' stats are updated based on match results (e.g., goals scored, points, etc.)
    -- Update the player's win and goal count based on match outcome

    -- This is a simple example, you'd need to adjust it based on actual match result processing
    UPDATE Stats
    SET Wins = Wins + player_wins, Goals_scored = Goals_scored + player_goals
    WHERE Player_ID IN (SELECT Player_ID FROM Plays_for WHERE Team_ID IN (SELECT Team_ID FROM Team WHERE Sport_ID = NEW.Sport_ID));

END $$

DELIMITER ;

-- Trigger to check if the sponsorship contract is expired before insertion or update
DELIMITER $$

CREATE TRIGGER check_sponsorship_expiration
BEFORE INSERT ON Sponsorship
FOR EACH ROW
BEGIN
    DECLARE current_date DATE;
    SET current_date = CURDATE();
    
    -- Ensure contract date is not in the future and end date is valid
    IF NEW.Contract_date > current_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contract date cannot be in the future';
    END IF;
    
    IF NEW.Contract_date > NEW.End_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Contract end date cannot be before the contract start date';
    END IF;
END $$

DELIMITER ;

-- Trigger to update manager assignment dates and prevent overlap
DELIMITER $$

CREATE TRIGGER prevent_manager_overlap
BEFORE INSERT ON Manages
FOR EACH ROW
BEGIN
    DECLARE conflicting_assignments INT;
    
    -- Check for overlap in team assignments for the same manager
    SELECT COUNT(*) INTO conflicting_assignments
    FROM Manages
    WHERE Manager_ID = NEW.Manager_ID
      AND Team_ID = NEW.Team_ID
      AND (
          (NEW.Start_Date BETWEEN Start_Date AND End_Date) 
          OR (NEW.End_Date BETWEEN Start_Date AND End_Date)
          OR (Start_Date BETWEEN NEW.Start_Date AND NEW.End_Date)
      );

    IF conflicting_assignments > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Manager already assigned to this team during the specified period';
    END IF;
END $$

DELIMITER ;

-- Trigger to ensure that the team size does not exceed the maximum size
DELIMITER $$

CREATE TRIGGER check_team_size_before_insert
BEFORE INSERT ON Plays_for
FOR EACH ROW
BEGIN
    DECLARE team_size INT;
    
    -- Get the current size of the team
    SELECT COUNT(*) INTO team_size FROM Plays_for WHERE Team_ID = NEW.Team_ID;
    
    -- Check if the current team size exceeds the maximum team size
    IF team_size >= (SELECT Max_Team_Size FROM Team WHERE Team_ID = NEW.Team_ID) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team size exceeds the maximum allowed';
    END IF;
END $$

DELIMITER ;

---

-- Additional Stored Procedures

-- Stored procedure to add a new team
DELIMITER $$

CREATE PROCEDURE Add_Team(
    IN p_team_name VARCHAR(100),
    IN p_max_team_size INT,
    IN p_sport_id INT
)
BEGIN
    -- Insert the new team
    INSERT INTO Team (Team_name, Max_Team_Size, Sport_ID) 
    VALUES (p_team_name, p_max_team_size, p_sport_id);
    
END $$

DELIMITER ;

-- Stored procedure to calculate and update sponsorship amount (adjust as needed)
DELIMITER $$

CREATE PROCEDURE Update_Sponsorship_Amount(
    IN p_sponsorship_id INT,
    IN p_new_amount DECIMAL(10, 2)
)
BEGIN
    -- Update the sponsorship amount
    UPDATE Sponsorship 
    SET Amount = p_new_amount 
    WHERE Sponsorship_ID = p_sponsorship_id;
    
END $$

DELIMITER ;

-- Stored procedure to assign a coach to a team
DELIMITER $$

CREATE PROCEDURE Assign_Coach_To_Team(
    IN p_coach_id INT,
    IN p_team_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Check if the coach is already assigned to another team during the same period
    DECLARE coach_assigned INT;
    SELECT COUNT(*) INTO coach_assigned 
    FROM Manages 
    WHERE Manager_ID = p_coach_id 
      AND End_Date > p_start_date 
      AND Start_Date < p_end_date;
    
    IF coach_assigned > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Coach is already assigned to another team during this period';
    END IF;
    
    -- Assign the coach to the team
    INSERT INTO Manages (Manager_ID, Team_ID, Start_Date, End_Date) 
    VALUES (p_coach_id, p_team_id, p_start_date, p_end_date);
    
END $$

DELIMITER ;

-- Stored procedure to transfer a player to a new team
DELIMITER $$

CREATE PROCEDURE Transfer_Player_To_New_Team(
    IN p_player_id INT,
    IN p_old_team_id INT,
    IN p_new_team_id INT
)
BEGIN
    -- Check if the player is already in the new team
    DECLARE player_in_new_team INT;
    SELECT COUNT(*) INTO player_in_new_team
    FROM Plays_for
    WHERE Player_ID = p_player_id 
      AND Team_ID = p_new_team_id;
    
    IF player_in_new_team > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Player is already in the new team';
    END IF;

    -- Remove player from the old team
    DELETE FROM Plays_for WHERE Player_ID = p_player_id AND Team_ID = p_old_team_id;

    -- Add player to the new team
    INSERT INTO Plays_for (Player_ID, Team_ID) 
    VALUES (p_player_id, p_new_team_id);

END $$

DELIMITER ;

-- Stored procedure to get total earnings from a sponsor (all teams they sponsor)
DELIMITER $$

CREATE PROCEDURE Get_Total_Sponsorship_From_Sponsor(
    IN p_sponsor_id INT
)
BEGIN
    SELECT SUM(Amount) AS Total_Sponsorship
    FROM Sponsorship
    WHERE Sponsor_ID = p_sponsor_id;
END $$

DELIMITER ;


-- Trigger to detect if the team already has a match scheduled at the same time
DELIMITER $$

CREATE TRIGGER check_schedule_conflict
BEFORE INSERT ON Match
FOR EACH ROW
BEGIN
  DECLARE conflict INT;

  -- Check if the team is already scheduled for the same time
  SELECT COUNT(*) INTO conflict
  FROM Match
  WHERE (Team_A = NEW.Team_A OR Team_B = NEW.Team_A)
  AND Date_of_match = NEW.Date_of_match
  AND TIME(Date_of_match) = TIME(NEW.Date_of_match);

  IF conflict > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team already has a match scheduled at this time.';
  END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER calculate_age_before_insert
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    DECLARE current_date DATE;
    
    -- Get the current date
    SET current_date = CURDATE();
    
    -- Calculate the age based on DOB and current date
    SET NEW.Age = TIMESTAMPDIFF(YEAR, NEW.DOB, current_date) - 
                  (DATE_FORMAT(current_date, '%m%d') < DATE_FORMAT(NEW.DOB, '%m%d'));
END $$

DELIMITER ;

-- Inserting data into Sport Table (with explicit Sport_IDs)
INSERT INTO Sport (Sport_ID, Sport_Name, Sport_Type)
VALUES 
(1, 'Football', 'Team Sport'),   -- Sport_ID = 1
(2, 'Basketball', 'Team Sport');  -- Sport_ID = 2

-- Inserting data into Coach Table (with explicit Coach_IDs)
INSERT INTO Coach (Coach_ID, Coach_Name, DOB, Years_of_Experience, Email, Phone_no)
VALUES 
(1, 'John Doe', '1980-03-15', 15, 'johndoe@example.com', '555-1234'),   -- Coach_ID = 1
(2, 'Alice Smith', '1975-07-22', 20, 'alicesmith@example.com', '555-5678'); -- Coach_ID = 2

-- Inserting data into Team Table (with explicit Team_IDs and Sport_IDs)
INSERT INTO Team (Team_ID, Team_name, Max_Team_Size, Sport_ID)
VALUES 
(1, 'Red Devils', 22, 1),   -- Team_ID = 1, Sport_ID = 1 (Football)
(2, 'Hoopsters', 15, 2);     -- Team_ID = 2, Sport_ID = 2 (Basketball)

-- Inserting data into Player Table (with explicit Player_IDs)
INSERT INTO Player (Player_ID, Player_Name, DOB, Gender, Position, Age, Email, Phone_no)
VALUES 
(1, 'David Johnson', '1995-06-20', 'Male', 'Forward', 29, 'davidjohnson@example.com', '555-0001'),  -- Player_ID = 1
(2, 'Emily Davis', '2000-11-10', 'Female', 'Guard', 24, 'emilydavis@example.com', '555-0002'),    -- Player_ID = 2
(3, 'Michael Brown', '1992-02-18', 'Male', 'Midfielder', 32, 'michaelbrown@example.com', '555-0003'), -- Player_ID = 3
(4, 'Sophia Lee', '1997-05-25', 'Female', 'Center', 27, 'sophialee@example.com', '555-0004');  -- Player_ID = 4

-- Inserting data into Plays_for Table (with explicit Team_IDs and Player_IDs)
INSERT INTO Plays_for (Team_ID, Player_ID)
VALUES 
(1, 1),  -- David Johnson plays for Red Devils (Team_ID = 1, Player_ID = 1)
(2, 2),  -- Emily Davis plays for Hoopsters (Team_ID = 2, Player_ID = 2)
(1, 3),  -- Michael Brown plays for Red Devils (Team_ID = 1, Player_ID = 3)
(2, 4);  -- Sophia Lee plays for Hoopsters (Team_ID = 2, Player_ID = 4)
