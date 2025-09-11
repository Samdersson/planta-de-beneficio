<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    include_once 'Conexion.php';

    $numero_guia = isset($_GET['numero_guia']) ? $_GET['numero_guia'] : '';

    if (!$numero_guia) {
        echo json_encode(['error' => 'Número de guía no proporcionado']);
        exit;
    }

    $query = "
        SELECT numero_animal, sexo, peso, numero_tiquete
        FROM animal
        WHERE numero_guia = ?
        ORDER BY numero_animal
    ";

    $stmt = mysqli_prepare($conexion, $query);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conexion));
    }

    mysqli_stmt_bind_param($stmt, "s", $numero_guia);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt));
    }

    $result = mysqli_stmt_get_result($stmt);

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
