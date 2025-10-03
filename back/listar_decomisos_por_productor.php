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

    // Preparar y ejecutar consulta para obtener todos los decomisos con productor
    $query_all = "
        SELECT d.id, d.producto, d.motivo, d.cantidad, d.cedula_veterinario, d.numero_animal, p.Nombre as productor
        FROM decomiso d
        JOIN animal a ON d.numero_animal = a.numero_animal
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
    ";
    if (!empty($where_clause)) {
        $query_all .= " $where_clause ";
    }
    $query_all .= " ORDER BY d.id ";

    $stmt_all = mysqli_prepare($conexion, $query_all);
    if ($stmt_all === false) {
        throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conexion));
    }
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt_all, $types, ...$params);
    }
    if (!mysqli_stmt_execute($stmt_all)) {
        throw new Exception("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt_all));
    }
    $result_all = mysqli_stmt_get_result($stmt_all);
    $decomisos = [];
    while ($row = mysqli_fetch_assoc($result_all)) {
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $decomisos[] = $row;
    }

    // Preparar y ejecutar consulta para contar decomisos por productor
    $query_count = "
        SELECT p.Nombre as productor, COUNT(d.id) as cantidad
        FROM decomiso d
        JOIN animal a ON d.numero_animal = a.numero_animal
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
    ";
    if (!empty($where_clause)) {
        $query_count .= " $where_clause ";
    }
    $query_count .= " GROUP BY p.cedula, p.Nombre ORDER BY cantidad DESC ";

    $stmt_count = mysqli_prepare($conexion, $query_count);
    if ($stmt_count === false) {
        throw new Exception("Error en la preparación de la consulta de conteo: " . mysqli_error($conexion));
    }
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt_count, $types, ...$params);
    }
    if (!mysqli_stmt_execute($stmt_count)) {
        throw new Exception("Error en la ejecución de la consulta de conteo: " . mysqli_stmt_error($stmt_count));
    }
    $result_count = mysqli_stmt_get_result($stmt_count);
    $conteo = [];
    while ($row = mysqli_fetch_assoc($result_count)) {
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $conteo[] = $row;
    }

    $max_productor = !empty($conteo) ? $conteo[0]['productor'] : '';

    echo json_encode([
        'decomisos' => $decomisos,
        'conteo' => $conteo,
        'max_productor' => $max_productor
    ], JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
