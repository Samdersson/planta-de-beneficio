<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $numero_animal = isset($_GET['numero_animal']) ? $_GET['numero_animal'] : '';

    if ($numero_animal !== '') {
        $query = "
            SELECT id, producto, motivo, cantidad, cedula_veterinario, numero_animal
            FROM decomiso
            WHERE numero_animal = ?
            ORDER BY numero_animal
        ";
        $stmt = mysqli_prepare($conexion, $query);
        if (!$stmt) {
            $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
            error_log($error);
            throw new Exception($error);
        }
        mysqli_stmt_bind_param($stmt, "i", $numero_animal);
    } else {
        $query = "
            SELECT id, producto, motivo, cantidad, cedula_veterinario, numero_animal
            FROM decomiso
            ORDER BY numero_animal
        ";
        $stmt = mysqli_prepare($conexion, $query);
        if (!$stmt) {
            $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
            error_log($error);
            throw new Exception($error);
        }
    }

    if (!mysqli_stmt_execute($stmt)) {
        $error = "Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt);
        error_log($error);
        throw new Exception($error);
    }

    $result = mysqli_stmt_get_result($stmt);

    if (!$result) {
        throw new Exception("Error en la consulta a la base de datos: " . mysqli_error($conexion));
    }

    $decomisos = [];

    while ($row = mysqli_fetch_assoc($result)) {
        // Convertir todos los valores a string para asegurar codificación JSON correcta
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $decomisos[] = $row;
    }

    echo json_encode($decomisos, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
