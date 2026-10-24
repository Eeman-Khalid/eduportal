CREATE DATABASE EduPortal;
GO
USE EduPortal;
GO

CREATE LOGIN eduportal WITH PASSWORD = 'Eduportal#123';
GO
CREATE USER eduportal FOR LOGIN eduportal;
ALTER ROLE db_owner ADD MEMBER eduportal;
GO

CREATE TABLE users (
  id       INT IDENTITY(1,1) PRIMARY KEY,
  username NVARCHAR(50)  NOT NULL,
  password NVARCHAR(100) NOT NULL,
  email    NVARCHAR(100),
  role     NVARCHAR(20)  DEFAULT 'student'
);
GO
CREATE TABLE courses (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  title       NVARCHAR(100),
  description NVARCHAR(400)
);
GO
CREATE TABLE comments (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  author     NVARCHAR(50),
  body       NVARCHAR(MAX),
  created_at DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO users (username, password, email, role) VALUES
('admin',  'admin123',  'admin@eduportal.test',  'admin'),
('eeman',   'eeman123',   'eeman@eduportal.test',   'student'),
('abeera', 'abeera123', 'abeera@eduportal.test', 'student');
GO
INSERT INTO courses (title, description) VALUES
('Information Security', 'Learn web security'),
('Database Systems',     'Relational modeling, SQL, and transactions.'),
('Computer Networks',    'TCP/IP, routing, and network security basics.'),
('Operating Systems',    'Processes, memory, and scheduling.');
GO