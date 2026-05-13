CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
