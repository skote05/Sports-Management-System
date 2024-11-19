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
CREATE TABLE IF NOT EXISTS `Match` (
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
ALTER TABLE Player ADD COLUMN Sport_ID INT;
ALTER TABLE Player 
ADD CONSTRAINT FK_Player_Sport
FOREIGN KEY (Sport_ID) 
REFERENCES Sport(Sport_ID)
ON DELETE SET NULL
ON UPDATE CASCADE;


-- Create Stats Table with added column for distinguishing Player and Team stats
CREATE TABLE IF NOT EXISTS Stats (
    Stat_ID INT AUTO_INCREMENT PRIMARY KEY,
    Player_ID INT NULL,
    Team_ID INT NULL,
    Sport_ID INT,
    Wins INT DEFAULT 0,
    Points_scored INT DEFAULT 0,
    Goals_scored INT DEFAULT 0,
    Stat_Type VARCHAR(10) CHECK (Stat_Type IN ('Player', 'Team')), -- To distinguish between Player and Team stats
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID),
    FOREIGN KEY (Sport_ID) REFERENCES Sport(Sport_ID)
);

-- Create logs_in Table with only login_id and player_id as foreign keys
CREATE TABLE IF NOT EXISTS logs_in (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    login_id INT,   -- Foreign key referencing the Login table
    player_id INT,  -- Foreign key referencing the Player table
    FOREIGN KEY (login_id) REFERENCES Login(ID),    -- Link to Login table
    FOREIGN KEY (player_id) REFERENCES Player(Player_ID)  -- Link to Player table
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

CREATE TABLE IF NOT EXISTS `Match_Teams` (
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
AFTER UPDATE ON `Match`
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
BEFORE INSERT ON `Match`
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

INSERT INTO Sport (Sport_Name, Sport_Type)
VALUES
('Baseball', 'Team Sport'),
('Tennis', 'Individual Sport'),
('Badminton', 'Individual Sport'),
('Table Tennis', 'Individual Sport'),
('Cricket', 'Team Sport'),
('Rugby', 'Team Sport'),
('Hockey', 'Team Sport'),
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

-- Insert Data into Team Table (with Sport_IDs 1 and 2)
INSERT INTO Team (Team_ID, Team_name, Max_Team_Size, Sport_ID)
VALUES 
(3, 'Strikers', 15, 1),     -- Sport_ID = 1 (Football)
(4, 'Blaze', 15, 2),        -- Sport_ID = 2 (Basketball)
(5, 'Wizards', 20, 1),      -- Sport_ID = 1 (Football)
(6, 'Lions', 15, 2),        -- Sport_ID = 2 (Basketball)
(7, 'Falcons', 22, 1),      -- Sport_ID = 1 (Football)
(8, 'Sharks', 15, 2),       -- Sport_ID = 2 (Basketball)
(9, 'Eagles', 15, 1),       -- Sport_ID = 1 (Football)
(10, 'Titans', 20, 2);      -- Sport_ID = 2 (Basketball)

-- Insert Data into Player Table (starting with Player_ID = 15)
INSERT INTO Player (Player_ID, Player_Name, DOB, Gender, Position, Age, Email, Phone_no)
VALUES 
(15, 'David Johnson', '1995-06-20', 'Male', 'Forward', 29, 'davidjohnson@example.com', '555-0001'),
(16, 'Emily Davis', '2000-11-10', 'Female', 'Guard', 24, 'emilydavis@example.com', '555-0002'),
(17, 'Michael Brown', '1992-02-18', 'Male', 'Midfielder', 32, 'michaelbrown@example.com', '555-0003'),
(18, 'Sophia Lee', '1997-05-25', 'Female', 'Center', 27, 'sophialee@example.com', '555-0004'),
(19, 'Jack Williams', '1994-06-10', 'Male', 'Striker', 30, 'jackwilliams@example.com', '555-0005'),
(20, 'Lucas Brown', '1998-08-15', 'Male', 'Defender', 26, 'lucasbrown@example.com', '555-0006'),
(21, 'Olivia Green', '2001-09-20', 'Female', 'Goalkeeper', 23, 'oliviagreen@example.com', '555-0007'),
(22, 'James Miller', '1996-02-05', 'Male', 'Midfielder', 28, 'jamesmiller@example.com', '555-0008'),
(23, 'Ava Smith', '1999-07-12', 'Female', 'Forward', 25, 'avasmith@example.com', '555-0009'),
(24, 'Mason Taylor', '1993-11-30', 'Male', 'Striker', 31, 'masontaylor@example.com', '555-0010');

-- Insert Data into Plays_for Table (Player_IDs and Team_IDs)
INSERT INTO Plays_for (Team_ID, Player_ID)
VALUES 
(1, 15),  -- David Johnson plays for Red Devils
(2, 16),  -- Emily Davis plays for Hoopsters
(1, 17),  -- Michael Brown plays for Red Devils
(2, 18),  -- Sophia Lee plays for Hoopsters
(3, 19),  -- Jack Williams plays for Strikers
(4, 20),  -- Lucas Brown plays for Blaze
(5, 21),  -- Olivia Green plays for Wizards
(6, 22),  -- James Miller plays for Lions
(7, 23),  -- Ava Smith plays for Falcons
(8, 24);  -- Mason Taylor plays for Sharks

-- Insert Data into Stats Table (without the Stat_ID field)
INSERT INTO Stats (Player_ID, Team_ID, Sport_ID, Wins, Points_scored, Goals_scored, Stat_Type)
VALUES 
(15, 1, 1, 10, 30, 10, 'Player'),  -- David Johnson's stats for Red Devils (Football)
(16, 2, 2, 12, 25, 5, 'Player'),  -- Emily Davis's stats for Hoopsters (Basketball)
(17, 1, 1, 15, 40, 12, 'Player'),  -- Michael Brown's stats for Red Devils (Football)
(18, 2, 2, 8, 18, 3, 'Player'),   -- Sophia Lee's stats for Hoopsters (Basketball)
(19, 3, 1, 9, 35, 15, 'Player'),  -- Jack Williams's stats for Strikers (Football)
(20, 4, 2, 10, 22, 4, 'Player'),  -- Lucas Brown's stats for Blaze (Basketball)
(21, 5, 1, 13, 20, 7, 'Player'),  -- Olivia Green's stats for Wizards (Football)
(22, 6, 2, 14, 30, 9, 'Player'),  -- James Miller's stats for Lions (Basketball)
(23, 7, 1, 11, 32, 10, 'Player'), -- Ava Smith's stats for Falcons (Football)
(24, 8, 2, 7, 16, 2, 'Player');   -- Mason Taylor's stats for Sharks (Basketball)


-- Update Player's Sport_ID based on their Team_ID from the Plays_for table
UPDATE Player p
JOIN Plays_for pf ON p.Player_ID = pf.Player_ID
JOIN Team t ON pf.Team_ID = t.Team_ID
SET p.Sport_ID = t.Sport_ID;

--Latest trigger that updates stats of player after the match
DELIMITER $$

CREATE TRIGGER update_player_stats_after_match
AFTER UPDATE ON `Match`
FOR EACH ROW
BEGIN
    DECLARE team1_id INT;
    DECLARE team2_id INT;
    DECLARE goals_scored INT;
    DECLARE points_scored INT;
    
    -- Dynamically fetch the goals scored (assuming score is in the format "team1_goals-team2_goals")
    SET goals_scored = CAST(SUBSTRING_INDEX(NEW.Score, '-', 1) AS UNSIGNED);  -- Goals scored by team1
    SET points_scored = CAST(SUBSTRING_INDEX(NEW.Score, '-', -1) AS UNSIGNED); -- Goals scored by team2

    -- Get the Team_IDs from the Match_Teams table based on the Match_ID
    SELECT Team_ID INTO team1_id FROM Match_Teams WHERE Match_ID = NEW.Match_ID AND Team_ID = 1 LIMIT 1; -- Team 1
    SELECT Team_ID INTO team2_id FROM Match_Teams WHERE Match_ID = NEW.Match_ID AND Team_ID = 2 LIMIT 1; -- Team 2

    -- Update Stats for Team 1 players
    -- Loop through all players in Team 1 and update stats
    UPDATE Stats
    SET Wins = Wins + 1,
        Points_scored = Points_scored + points_scored,
        Goals_scored = Goals_scored + goals_scored
    WHERE Player_ID IN (SELECT Player_ID FROM Plays_for WHERE Team_ID = team1_id)
    AND Stat_Type = 'Player';

    -- Update Stats for Team 2 players
    -- Loop through all players in Team 2 and update stats
    UPDATE Stats
    SET Wins = Wins + 1,
        Points_scored = Points_scored + points_scored,
        Goals_scored = Goals_scored + goals_scored
    WHERE Player_ID IN (SELECT Player_ID FROM Plays_for WHERE Team_ID = team2_id)
    AND Stat_Type = 'Player';

END $$

DELIMITER ;


-- Inserting Login details for all players (starting from ID 20)
INSERT INTO Login (Username, Password, Account_Type)
VALUES
('DavidJohnson', 'password123', 'player'),  -- Player ID 1
('EmilyDavis', 'password123', 'player'),    -- Player ID 2
('MichaelBrown', 'password123', 'player'),  -- Player ID 3
('SophiaLee', 'password123', 'player'),     -- Player ID 4
('JackWilliams', 'password123', 'player'),  -- Player ID 5
('LucasBrown', 'password123', 'player'),    -- Player ID 6
('OliviaGreen', 'password123', 'player'),   -- Player ID 7
('JamesMiller', 'password123', 'player'),   -- Player ID 8
('AvaSmith', 'password123', 'player'),      -- Player ID 9
('MasonTaylor', 'password123', 'player');   -- Player ID 10

-- Create a View to get Player and Team Stats together
CREATE VIEW PlayerTeamStats AS
SELECT 
    p.Player_ID,
    p.Player_Name,
    t.Team_name,
    s.Sport_Name,
    st.Wins,
    st.Points_scored,
    st.Goals_scored,
    st.Stat_Type
FROM Stats st
JOIN Player p ON st.Player_ID = p.Player_ID
JOIN Team t ON st.Team_ID = t.Team_ID
JOIN Sport s ON st.Sport_ID = s.Sport_ID;

-- Insert for Player "David Johnson" (Player_ID 1) and Login "David Johnson" (Login_ID 1)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'David Johnson';

-- Insert for Player "Emily Davis" (Player_ID 2) and Login "Emily Davis" (Login_ID 2)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Emily Davis';

-- Insert for Player "Michael Brown" (Player_ID 3) and Login "Michael Brown" (Login_ID 3)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Michael Brown';

-- Insert for Player "Sophia Lee" (Player_ID 4) and Login "Sophia Lee" (Login_ID 4)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Sophia Lee';

-- Insert for Player "Sanathashree" (Player_ID 5) and Login "Sanathashree" (Login_ID 5)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Sanathashree';

-- Insert for Player "Player One" (Player_ID 6) and Login "Player One" (Login_ID 6)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Player One';

-- Insert for Player "Player Two" (Player_ID 7) and Login "Player Two" (Login_ID 7)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Player Two';

-- Insert for Player "nmb" (Player_ID 8) and Login "nmb" (Login_ID 8)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'nmb';

-- Insert for Player "David Johnson" (Player_ID 15) and Login "David Johnson" (Login_ID 15)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'David Johnson';

-- Insert for Player "Emily Davis" (Player_ID 16) and Login "Emily Davis" (Login_ID 16)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Emily Davis';

-- Insert for Player "Michael Brown" (Player_ID 17) and Login "Michael Brown" (Login_ID 17)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Michael Brown';

-- Insert for Player "Sophia Lee" (Player_ID 18) and Login "Sophia Lee" (Login_ID 18)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Sophia Lee';

-- Insert for Player "Jack Williams" (Player_ID 19) and Login "Jack Williams" (Login_ID 19)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Jack Williams';

-- Insert for Player "Lucas Brown" (Player_ID 20) and Login "Lucas Brown" (Login_ID 20)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Lucas Brown';

-- Insert for Player "Olivia Green" (Player_ID 21) and Login "Olivia Green" (Login_ID 21)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Olivia Green';

-- Insert for Player "James Miller" (Player_ID 22) and Login "James Miller" (Login_ID 22)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'James Miller';

-- Insert for Player "Ava Smith" (Player_ID 23) and Login "Ava Smith" (Login_ID 23)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Ava Smith';

-- Insert for Player "Mason Taylor" (Player_ID 24) and Login "Mason Taylor" (Login_ID 24)
INSERT INTO logs_in (login_id, player_id)
SELECT l.ID, p.Player_ID 
FROM Login l
JOIN Player p ON l.Username = p.Player_Name
WHERE l.Username = 'Mason Taylor';


INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('1', '4', '15');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('2', '5', '16');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('3', '6', '17');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('4', '7', '18');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('5', '8', '19');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('6', '9', '20');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('7', '10', '21');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('8', '11', '22');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('9', '12', '23');
INSERT INTO `sports_management_system`.`logs_in` (`log_id`, `login_id`, `player_id`) VALUES ('10', '13', '24');

DELIMITER $$

CREATE PROCEDURE CreateTeamWithPlayers(
    IN Team_Name VARCHAR(100),
    IN Max_Team_Size INT,
    IN Sport_ID INT,
    IN Player_Ids JSON
)
BEGIN
    DECLARE New_Team_ID INT;
    DECLARE Player_Count INT;
    DECLARE Player_ID INT;

    -- Initialize session variable @Index to 0
    SET @Index = 0;

    -- Create the team and get the new Team_ID
    INSERT INTO Team (Team_name, Max_Team_Size, Sport_ID)
    VALUES (Team_Name, Max_Team_Size, Sport_ID);
    
    -- Get the newly inserted Team_ID (last inserted ID)
    SET New_Team_ID = LAST_INSERT_ID();

    -- Get the number of players provided in the JSON array
    SET Player_Count = JSON_LENGTH(Player_Ids);

    -- Loop through each player ID and assign to the newly created team
    WHILE @Index < Player_Count DO
        -- Extract Player_ID from the JSON array
        SET Player_ID = JSON_UNQUOTE(JSON_EXTRACT(Player_Ids, CONCAT('$[', @Index, ']')));
        
        -- Insert into Plays_for table to link player to the new team
        INSERT INTO Plays_for (Team_ID, Player_ID)
        VALUES (New_Team_ID, Player_ID);

        -- Move to the next player in the array
        SET @Index = @Index + 1;
    END WHILE;
    
    -- Return the created team ID
    SELECT New_Team_ID AS Team_ID;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_insert_team
BEFORE INSERT ON Team
FOR EACH ROW
BEGIN
    -- Check if the associated sport is an individual sport
    DECLARE sport_type VARCHAR(50);
    
    -- Get the sport type based on the Sport_ID
    SELECT Sport_Type INTO sport_type
    FROM Sport
    WHERE Sport_ID = NEW.Sport_ID;

    -- If the sport is an individual sport, set Max_Team_Size to 1
    IF sport_type = 'Individual Sport' THEN
        SET NEW.Max_Team_Size = 1;
    END IF;
END $$

DELIMITER ;

-- Football (Sport_ID = 1)
INSERT INTO Player (Player_Name, DOB, Gender, Position, Age, Email, Phone_no, Sport_ID)
VALUES
('John Carter', '1992-08-15', 'Male', 'Striker', 32, 'johncarter@example.com', '5551234567', 1),
('Sarah Evans', '1997-12-05', 'Female', 'Midfielder', 27, 'sarahevans@example.com', '5552345678', 1),
('Brian Clark', '1995-02-23', 'Male', 'Defender', 29, 'brianclark@example.com', '5553456789', 1),
('Jessica King', '1998-04-02', 'Female', 'Goalkeeper', 26, 'jessicaking@example.com', '5554567890', 1),
('Chris White', '1994-10-12', 'Male', 'Forward', 30, 'chriswhite@example.com', '5555678901', 1),

-- Basketball (Sport_ID = 2)
('Robert Hall', '1996-07-25', 'Male', 'Guard', 28, 'roberthall@example.com', '5556789012', 2),
('Megan Foster', '2000-01-10', 'Female', 'Forward', 24, 'meganfoster@example.com', '5557890123', 2),
('William Harris', '1995-03-20', 'Male', 'Center', 29, 'williamharris@example.com', '5558901234', 2),
('Olivia Scott', '1997-09-30', 'Female', 'Guard', 27, 'oliviascott@example.com', '5559012345', 2),
('Liam Adams', '2001-05-16', 'Male', 'Forward', 23, 'liamadams@example.com', '5550123456', 2),

-- Baseball (Sport_ID = 3)
('George Lewis', '1993-11-22', 'Male', 'Pitcher', 31, 'georgelewis@example.com', '5551234567', 3),
('Grace Wilson', '2000-02-12', 'Female', 'Catcher', 24, 'gracewilson@example.com', '5552345678', 3),
('Henry Thompson', '1998-03-05', 'Male', 'Shortstop', 26, 'henrythompson@example.com', '5553456789', 3),
('Emma Turner', '1995-12-30', 'Female', 'Outfielder', 29, 'emmaturner@example.com', '5554567890', 3),
('David Mitchell', '1997-04-08', 'Male', 'First Baseman', 27, 'davidmitchell@example.com', '5555678901', 3),

-- Tennis (Sport_ID = 4)
('Roger Federer', '1981-08-08', 'Male', 'Singles', 43, 'rogerfederer@example.com', '5556789012', 4),
('Serena Williams', '1981-09-26', 'Female', 'Singles', 43, 'serenawilliams@example.com', '5557890123', 4),
('Naomi Osaka', '1997-10-16', 'Female', 'Singles', 27, 'naomiosaka@example.com', '5558901234', 4),
('Rafael Nadal', '1986-06-03', 'Male', 'Singles', 38, 'rafaelnadal@example.com', '5559012345', 4),
('Novak Djokovic', '1987-05-22', 'Male', 'Singles', 37, 'novakdjokovic@example.com', '5550123456', 4),

-- Swimming (Sport_ID = 5)
('Michael Phelps', '1985-06-30', 'Male', 'Freestyle', 39, 'michaelphelps@example.com', '5551234567', 5),
('Katie Ledecky', '1997-03-17', 'Female', 'Freestyle', 27, 'katieledecky@example.com', '5552345678', 5),
('Caeleb Dressel', '1996-08-16', 'Male', 'Butterfly', 28, 'caelebdressel@example.com', '5553456789', 5),
('Simone Manuel', '1996-08-02', 'Female', 'Freestyle', 28, 'simonemanuel@example.com', '5554567890', 5),
('Ryan Lochte', '1984-08-03', 'Male', 'Backstroke', 40, 'ryanlochte@example.com', '5555678901', 5),

-- Cricket (Sport_ID = 6)
('Virat Kohli', '1988-11-05', 'Male', 'Batsman', 36, 'viratkohli@example.com', '5556789012', 6),
('Mithali Raj', '1982-12-03', 'Female', 'Batsman', 42, 'mithaliraj@example.com', '5557890123', 6),
('Ben Stokes', '1991-06-04', 'Male', 'All-rounder', 33, 'benstokes@example.com', '5558901234', 6),
('Ellyse Perry', '1990-11-03', 'Female', 'All-rounder', 34, 'ellyseperry@example.com', '5559012345', 6),
('Jofra Archer', '1995-04-01', 'Male', 'Bowler', 29, 'jofraarcher@example.com', '5550123456', 6),

-- Rugby (Sport_ID = 7)
('Jonny Wilkinson', '1979-05-25', 'Male', 'Fly-half', 45, 'jonnywilkinson@example.com', '5551234567', 7),
('Alisha Butchers', '1994-04-03', 'Female', 'Back', 30, 'alishabutcher@example.com', '5552345678', 7),
('Dan Carter', '1982-03-05', 'Male', 'Fly-half', 42, 'dancarter@example.com', '5553456789', 7),
('Ruby Tui', '1993-02-09', 'Female', 'Wing', 31, 'rubytui@example.com', '5554567890', 7),
('Maro Itoje', '1994-10-28', 'Male', 'Lock', 30, 'maroitoje@example.com', '5555678901', 7),

-- Volleyball (Sport_ID = 8)
('Kerri Walsh', '1978-08-15', 'Female', 'Outside hitter', 46, 'kerriwalsh@example.com', '5556789012', 8),
('Wilfredo Leon', '1993-08-31', 'Male', 'Outside hitter', 31, 'wilfredoleon@example.com', '5557890123', 8),
('Tijana Bošković', '1997-11-8', 'Female', 'Opposite hitter', 27, 'tijanabosković@example.com', '5558901234', 8),
('Max Holt', '1987-11-12', 'Male', 'Middle blocker', 37, 'maxholt@example.com', '5559012345', 8),
('Maja Ognjenović', '1987-03-06', 'Female', 'Setter', 37, 'majaognjenović@example.com', '5550123456', 8),

-- Handball (Sport_ID = 9)
('Nikola Karabatić', '1984-04-11', 'Male', 'Center back', 40, 'nikolak@handball.com', '5551234567', 9),
('Coralie Lassource', '1991-09-23', 'Female', 'Left back', 33, 'coralie@handball.com', '5552345678', 9),
('Mikkel Hansen', '1987-10-22', 'Male', 'Right back', 37, 'mikkel@handball.com', '5553456789', 9),
('Allison Pineau', '1988-12-02', 'Female', 'Center', 36, 'allison@handball.com', '5554567890', 9),
('Valentin Porte', '1991-11-13', 'Male', 'Left wing', 33, 'valentin@handball.com', '5555678901', 9);
