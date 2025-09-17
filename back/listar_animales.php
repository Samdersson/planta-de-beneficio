<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $fechaInicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
    $fechaFin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

    if ($fechaInicio && $fechaFin) {
        
        if ($fechaInicio === $fechaFin) {
            $query = "
                SELECT marca, sexo, especie
                FROM animal
                WHERE fecha_sacrificio = ?
                ORDER BY marca
            ";
            $stmt = mysqli_prepare($conexion, $query);
            if (!$stmt) {
                $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
                error_log($error);
                throw new Exception($error);
            }
            mysqli_stmt_bind_param($stmt, "s", $fechaInicio);
            if (!mysqli_stmt_execute($stmt)) {
                $error = "Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt);
                error_log($error);
                throw new Exception($error);
            }
            $result = mysqli_stmt_get_result($stmt);
        } else {
            $query = "
                SELECT marca, sexo, especie
                FROM animal
                WHERE fecha_sacrificio BETWEEN ? AND ?
                ORDER BY marca
            ";
            $stmt = mysqli_prepare($conexion, $query);
            if (!$stmt) {
                $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
                error_log($error);
                throw new Exception($error);
            }
            mysqli_stmt_bind_param($stmt, "ss", $fechaInicio, $fechaFin);
            if (!mysqli_stmt_execute($stmt)) {
                $error = "Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt);
                error_log($error);
                throw new Exception($error);
            }
            $result = mysqli_stmt_get_result($stmt);
        }
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

