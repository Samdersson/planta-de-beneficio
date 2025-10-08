<?php
// Archivo: guardar_remision.php
// Este script recibe datos de la remisión, genera el número incremental y guarda la remisión en la base de datos

require_once 'generar_numero_remision.php';

// Configuración de conexión a la base de datos
$mysqli = new mysqli('localhost', 'root', '', 'prueba_software');
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos JSON del frontend
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos JSON inválidos']);
    exit;
}

$tipo_animal = $input['tipo_animal'] ?? null; // 'porcino' o 'bovino'
$cliente_nombre = $input['cliente_nombre'] ?? '';
$cliente_direccion = $input['cliente_direccion'] ?? '';
$cliente_telefono = $input['cliente_telefono'] ?? '';
$animales = $input['animales'] ?? []; // Array de animales incluidos en la remisión



if (!$tipo_animal) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de animal es requerido']);
    exit;
}

try {
    // Obtener número incremental y número completo de remisión
    $numeroData = obtenerSiguienteConsecutivo($mysqli, $tipo_animal);

    // Preparar insert en tabla remisiones
    $stmt = $mysqli->prepare("INSERT INTO remisiones 
        (tipo_animal, prefijo, numero_incremental, anio, numero_remision, cliente_nombre, cliente_direccion, cliente_telefono, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

    $stmt->bind_param(
        'ssisssss',
        $tipo_animal,
        $numeroData['prefijo'],
        $numeroData['numero_incremental'],
        $numeroData['anio'],
        $numeroData['numero_remision'],
        $cliente_nombre ,
        $cliente_direccion,
        $cliente_telefono,
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $id_remision = $stmt->insert_id;
        $animales_actualizados = 0;
        $errores_actualizacion = [];

        // Actualizar el estado de los animales incluidos en la remisión
        if (!empty($animales)) {
            $update_stmt = $mysqli->prepare("UPDATE animal SET estado = 'despachado' WHERE numero_animal = ?");

            foreach ($animales as $animal) {
                $numero_animal = $animal['numeroAnimal'] ?? null;
                if ($numero_animal) {
                    $update_stmt->bind_param("s", $numero_animal);
                    if ($update_stmt->execute()) {
                        if ($update_stmt->affected_rows > 0) {
                            $animales_actualizados++;
                        } else {
                            $errores_actualizacion[] = "Animal $numero_animal no encontrado o ya despachado";
                        }
                    } else {
                        $errores_actualizacion[] = "Error al actualizar animal $numero_animal: " . $update_stmt->error;
                    }
                }
            }
            $update_stmt->close();
        }

        echo json_encode([
            'success' => true,
            'numero_remision' => $numeroData['numero_remision'],
            'id_remision' => $id_remision,
            'animales_actualizados' => $animales_actualizados,
            'errores_actualizacion' => $errores_actualizacion
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo guardar la remisión']);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$mysqli->close();
?>
