<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    // Consulta para obtener todos los decomisos con productor
    $query_all = "
        SELECT d.id, d.producto, d.motivo, d.cantidad, d.cedula_veterinario, d.numero_animal, p.Nombre as productor
        FROM decomiso d
        JOIN animal a ON d.numero_animal = a.numero_animal
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
        ORDER BY d.id
    ";
    $result_all = mysqli_query($conexion, $query_all);
    if (!$result_all) {
        throw new Exception("Error en la consulta de todos los decomisos: " . mysqli_error($conexion));
    }
    $decomisos = [];
    while ($row = mysqli_fetch_assoc($result_all)) {
        $row = array_map(function($value) {
            return is_null($value) ? "" : (string)$value;
        }, $row);
        $decomisos[] = $row;
    }

    // Consulta para contar decomisos por productor
    $query_count = "
        SELECT p.Nombre as productor, COUNT(d.id) as cantidad
        FROM decomiso d
        JOIN animal a ON d.numero_animal = a.numero_animal
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
        GROUP BY p.cedula, p.Nombre
        ORDER BY cantidad DESC
    ";
    $result_count = mysqli_query($conexion, $query_count);
    if (!$result_count) {
        throw new Exception("Error en la consulta de conteo: " . mysqli_error($conexion));
    }
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
