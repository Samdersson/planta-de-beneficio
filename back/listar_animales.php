<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $date = isset($_GET['fecha']) ? $_GET['fecha'] : '';

    if ($date) {
        $query = "
            
        SELECT cliente_id, cedula, marca, sexo, especie

            FROM animales
            WHERE fecha_ingreso = ?
            ORDER BY marca
        ";
        $stmt = mysqli_prepare($conexion, $query);
        if (!$stmt) {
            error_log("Error en la preparación de la consulta: " . mysqli_error($conexion));
            throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conexion));
        }
        mysqli_stmt_bind_param($stmt, "s", $date);
        if (!mysqli_stmt_execute($stmt)) {
            error_log("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt));
            throw new Exception("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt));
        }
        $result = mysqli_stmt_get_result($stmt);
    } else {
        $result = [];
    }

    if (!$result) {
        throw new Exception("Error en la consulta a la base de datos: " . mysqli_error($conexion));
    }

    $animales = [];

    while ($row = mysqli_fetch_assoc($result)) {
        // Convert all values to string and ensure proper JSON encoding
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $animales[] = $row;
    }

    echo json_encode($animales, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
