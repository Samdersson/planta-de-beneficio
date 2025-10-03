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
        $where[] = "g.fecha_guia >= ?";
        $params[] = $fecha_inicio;
        $types .= 's';
    }
    if ($fecha_fin) {
        $where[] = "g.fecha_guia <= ?";
        $params[] = $fecha_fin;
        $types .= 's';
    }

    $where_clause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $query = "
        SELECT p.Nombre as productor, a.especie, COUNT(a.numero_animal) as cantidad
        FROM animal a
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
        $where_clause
        GROUP BY p.cedula, p.Nombre, a.especie
        ORDER BY p.Nombre, a.especie
    ";
    $stmt = mysqli_prepare($conexion, $query);
    if ($stmt) {
        if (!empty($params)) {
            mysqli_stmt_bind_param($stmt, $types, ...$params);
        }
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } else {
        $result = false;
    }
    if (!$result) {
        throw new Exception("Error en consulta: " . mysqli_error($conexion));
    }
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $data[] = $row;
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
