-- Crear base de datos
CREATE DATABASE IF NOT EXISTS huertosmart_db;
USE huertosmart_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS login_verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(128) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_codes_session (session_id),
    INDEX idx_login_codes_user (user_id),
    CONSTRAINT fk_login_codes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(500)
);

-- Insertar usuario admin de prueba (contraseña: admin123)
-- Nota: El hash debe generarse con werkzeug, este es un placeholder
INSERT INTO users (nombre, email, password_hash, rol) VALUES 
('Administrador', 'admin@huertosmart.com', 'scrypt:32768:8:1$placeholder$hash', 'admin');

-- Insertar algunos productos de ejemplo
INSERT INTO products (nombre, descripcion, precio, stock, imagen_url) VALUES 
('Sensor de Humedad', 'Sensor capacitivo para medir humedad del suelo', 150.00, 50, 'https://example.com/sensor.jpg'),
('Válvula Solenoide', 'Válvula 12V para control de riego', 280.50, 30, 'https://example.com/valvula.jpg'),
('Controlador WiFi', 'Módulo ESP32 para control remoto', 450.00, 20, 'https://example.com/esp32.jpg');
