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
// Otros campos según necesidad...

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
        $cliente_nombre,
        $cliente_direccion,
        $cliente_telefono
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'numero_remision' => $numeroData['numero_remision'],
            'id_remision' => $stmt->insert_id
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
