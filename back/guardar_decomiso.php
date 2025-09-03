<?php

date_default_timezone_set('America/Bogota');
session_start();

include_once 'Conexion.php';

header('Content-Type: application/json');

error_log("Iniciando guardar_decomiso.php");

try {
    // Verificar conexión a la base de datos
    if (!$conexion) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Verificar que el usuario esté logueado
    if (!isset($_SESSION['cedula'])) {
        error_log("Usuario no autenticado - Sesión: " . print_r($_SESSION, true));
        echo json_encode(['error' => 'Usuario no autenticado']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    error_log("Datos recibidos: " . print_r($data, true));

    $producto = isset($data['producto']) ? $data['producto'] : '';
    $motivo = isset($data['motivo']) ? $data['motivo'] : '';
    $cantidad = isset($data['cantidad']) ? $data['cantidad'] : 0;
    $cedula_veterinario = $_SESSION['cedula']; // Obtener cédula desde la sesión
    $numero_animal = isset($data['numero_animal']) ? $data['numero_animal'] : '';

    error_log("Datos procesados - Producto: $producto, Motivo: $motivo, Cantidad: $cantidad, Cedula: $cedula_veterinario, Animal: $numero_animal");

    if (!$producto || !$motivo || !$cantidad || !$numero_animal) {
        error_log("Faltan datos obligatorios");
        echo json_encode(['error' => 'Faltan datos obligatorios']);
        exit;
    }

    $query = "
        INSERT INTO decomiso (producto, motivo, cantidad, cedula_veterinario, numero_animal)
        VALUES (?, ?, ?, ?, ?)
    ";

    error_log("Query preparada: $query");

    $stmt = mysqli_prepare($conexion, $query);
    if (!$stmt) {
        $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
        error_log($error);
        throw new Exception($error);
    }

    mysqli_stmt_bind_param($stmt, "ssdss", $producto, $motivo, $cantidad, $cedula_veterinario, $numero_animal);

    if (!mysqli_stmt_execute($stmt)) {
        $error = "Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt);
        error_log($error);
        throw new Exception($error);
    }

    error_log("Decomiso guardado correctamente");
    echo json_encode(['success' => true, 'message' => 'Decomiso guardado correctamente']);

    mysqli_close($conexion);
} catch (Exception $e) {
    error_log("Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
