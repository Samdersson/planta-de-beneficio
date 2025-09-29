<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

try {
    include_once 'Conexion.php';

    $query = "
        SELECT p.Nombre as productor, a.especie, COUNT(a.numero_animal) as cantidad
        FROM animal a
        JOIN guia_movilizacion g ON a.numero_guia = g.numero_guia
        JOIN productor p ON g.cedula_productor = p.cedula
        GROUP BY p.cedula, p.Nombre, a.especie
        ORDER BY p.Nombre, a.especie
    ";
    $result = mysqli_query($conexion, $query);
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
