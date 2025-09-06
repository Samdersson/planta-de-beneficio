<?php
header('Content-Type: application/json');
try {
    include_once 'Conexion.php';

    $numero_animal = isset($_GET['numero_animal']) ? $_GET['numero_animal'] : '';

    if (!$numero_animal) {
        echo json_encode(['error' => 'Número de animal no proporcionado']);
        exit;
    }

    $query = "
        SELECT marca
        FROM animal
        WHERE numero_animal = ?
        LIMIT 1
    ";

    $stmt = mysqli_prepare($conexion, $query);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conexion));
    }

    mysqli_stmt_bind_param($stmt, "i", $numero_animal);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt));
    }

    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);

    if (!$row) {
        echo json_encode(['error' => 'Marca no encontrada para este número de animal']);
        exit;
    }

    echo json_encode(['marca' => $row['marca']], JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
