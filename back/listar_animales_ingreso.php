<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $fechaFin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';
    $especie = isset($_GET['especie']) ? $_GET['especie'] : '';

    if ($fechaFin && $especie) {
        $query = "
            SELECT marca, numero_animal, sexo, peso, numero_tiquete, fecha_sacrificio, numero_guia, fecha_guia, numero_corral, hora_caida, especie
            FROM animal
            WHERE fecha_sacrificio = ? AND especie = ?
            ORDER BY numero_animal
        ";
        $stmt = mysqli_prepare($conexion, $query);
        if (!$stmt) {
            $error = "Error en la preparación de la consulta: " . mysqli_error($conexion);
            error_log($error);
            throw new Exception($error);
        }
        mysqli_stmt_bind_param($stmt, "ss", $fechaFin, $especie);
        if (!mysqli_stmt_execute($stmt)) {
            $error = "Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt);
            error_log($error);
            throw new Exception($error);
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
