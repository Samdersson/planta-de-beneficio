<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
    $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';
    $cliente = isset($_GET['cliente']) ? $_GET['cliente'] : '';

    $where = [];
    $params = [];
    $types = '';

    if ($fecha_inicio) {
        $where[] = "a.fecha_sacrificio >= ?";
        $params[] = $fecha_inicio;
        $types .= 's';
    }
    if ($fecha_fin) {
        $where[] = "a.fecha_sacrificio <= ?";
        $params[] = $fecha_fin;
        $types .= 's';
    }
    if ($cliente) {
        $where[] = "a.marca = ?";
        $params[] = $cliente;
        $types .= 's';
    }

    $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Consulta para cantidades por fecha
    $query_fecha = "
        SELECT a.fecha_sacrificio as fecha, COUNT(a.numero_animal) as cantidad
        FROM animal a
        $where_clause
        GROUP BY a.fecha_sacrificio
        ORDER BY a.fecha_sacrificio
    ";
    $stmt_fecha = mysqli_prepare($conexion, $query_fecha);
    if ($stmt_fecha) {
        if (!empty($params)) {
            mysqli_stmt_bind_param($stmt_fecha, $types, ...$params);
        }
        mysqli_stmt_execute($stmt_fecha);
        $result_fecha = mysqli_stmt_get_result($stmt_fecha);
        $cantidades_fecha = [];
        while ($row = mysqli_fetch_assoc($result_fecha)) {
            $row = array_map(function($value) {
                return is_null($value) ? "" : (string)$value;
            }, $row);
            $cantidades_fecha[] = $row;
        }
    } else {
        $cantidades_fecha = [];
    }

    // Consulta para cantidades por cliente, especie, sexo
    $query_detalle = "
        SELECT c.nombre as cliente, a.especie, a.sexo, COUNT(a.numero_animal) as cantidad
        FROM animal a
        JOIN cliente c ON a.marca = c.marca
        $where_clause
        GROUP BY c.nombre, a.especie, a.sexo
        ORDER BY c.nombre, a.especie, a.sexo
    ";
    $stmt_detalle = mysqli_prepare($conexion, $query_detalle);
    if ($stmt_detalle) {
        if (!empty($params)) {
            mysqli_stmt_bind_param($stmt_detalle, $types, ...$params);
        }
        mysqli_stmt_execute($stmt_detalle);
        $result_detalle = mysqli_stmt_get_result($stmt_detalle);
        $detalles = [];
        while ($row = mysqli_fetch_assoc($result_detalle)) {
            $row = array_map(function($value) {
                return is_null($value) ? "" : (string)$value;
            }, $row);
            $detalles[] = $row;
        }
    } else {
        $detalles = [];
    }

    echo json_encode([
        'cantidades_fecha' => $cantidades_fecha,
        'detalles' => $detalles
    ], JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
