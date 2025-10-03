<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
    $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

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

    $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Top clientes por ingresos de animales
    $query_ingresos = "
        SELECT c.nombre as cliente, COUNT(a.numero_animal) as cantidad
        FROM animal a
        JOIN cliente c ON a.marca = c.marca
        $where_clause
        GROUP BY c.marca, c.nombre
        ORDER BY cantidad DESC
        LIMIT 10
    ";
    $stmt = mysqli_prepare($conexion, $query_ingresos);
    if ($stmt) {
        if (!empty($params)) {
            mysqli_stmt_bind_param($stmt, $types, ...$params);
        }
        mysqli_stmt_execute($stmt);
        $result_ingresos = mysqli_stmt_get_result($stmt);
    } else {
        throw new Exception("Error en preparación de consulta: " . mysqli_error($conexion));
    }
    if (!$result_ingresos) {
        throw new Exception("Error en consulta de ingresos: " . mysqli_error($conexion));
    }
    $top_ingresos = [];
    while ($row = mysqli_fetch_assoc($result_ingresos)) {
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $top_ingresos[] = $row;
    }

    // Para compras de producto, asumir tabla remision o similar, pero por ahora vacío o igual
    // Si hay tabla de ventas, ajustar. Por ahora, devolver lo mismo o vacío.
    $top_compras = []; // Placeholder

    echo json_encode([
        'top_ingresos' => $top_ingresos,
        'top_compras' => $top_compras
    ], JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
