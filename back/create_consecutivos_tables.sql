-- Tabla para manejar consecutivos independientes para porcinos y bovinos

CREATE TABLE consecutivos_porcinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anio YEAR NOT NULL,
    numero_incremental INT NOT NULL,
    UNIQUE KEY (anio)
);

CREATE TABLE consecutivos_bovinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anio YEAR NOT NULL,
    numero_incremental INT NOT NULL,
    UNIQUE KEY (anio)
);

-- Tabla principal de remisiones que referencia los consecutivos

CREATE TABLE remisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_animal ENUM('porcino', 'bovino') NOT NULL,
    prefijo VARCHAR(10) NOT NULL, -- '150 P' para porcino, '567 B' para bovino
    numero_incremental INT NOT NULL,
    anio YEAR NOT NULL,
    numero_remision VARCHAR(50) NOT NULL UNIQUE, -- Ejemplo: '567 B - 498-25' o '150 P - 498-25'
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre VARCHAR(255),
    cliente_direccion VARCHAR(255),
    cliente_telefono VARCHAR(50),
    planta_beneficio VARCHAR(255),
    codigo_invima VARCHAR(50),
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    direccion_planta VARCHAR(255),
    telefono_planta VARCHAR(50),
    conductor_nombre VARCHAR(255),
    conductor_cedula VARCHAR(50),
    veterinario_nombre VARCHAR(255),
    veterinario_cedula VARCHAR(50),
    detalles_producto JSON,
    decomisos JSON,
    otros_detalles JSON
);

CREATE INDEX idx_anio_tipo ON remisiones(anio, tipo_animal);
