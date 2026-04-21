-- =============================================
-- Inicialización de la base de datos Agenda
-- =============================================

CREATE DATABASE IF NOT EXISTS agenda_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agenda_db;

CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE,
  phone       VARCHAR(30),
  phone2      VARCHAR(30),
  company     VARCHAR(150),
  address     VARCHAR(255),
  city        VARCHAR(100),
  country     VARCHAR(100),
  notes       TEXT,
  photo_url   VARCHAR(512),
  is_favorite TINYINT(1) DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT INTO contacts (first_name, last_name, email, phone, company, city, country, is_favorite)
VALUES
  ('María', 'García', 'maria.garcia@example.com', '+34 600 111 222', 'TechCorp SL', 'Madrid', 'España', 1),
  ('Carlos', 'López', 'carlos.lopez@example.com', '+34 611 333 444', 'Freelance', 'Barcelona', 'España', 0),
  ('Ana', 'Martínez', 'ana.martinez@example.com', '+34 622 555 666', 'Innovatech', 'Sevilla', 'España', 1);
