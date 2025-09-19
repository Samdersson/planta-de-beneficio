<?php
header('Content-Type: application/json');
try {
    include_once 'Conexion.php';

    $numero_guia = isset($_GET['numero_guia']) ? $_GET['numero_guia'] : '';
    $marca = isset($_GET['marca']) ? $_GET['marca'] : '';

    if (!$numero_guia || !$marca) {
        echo json_encode(['error' => 'Parámetros numero_guia y marca son requeridos']);
        exit;
    }

    $query = "
        SELECT numero_animal
        FROM animal
        WHERE numero_guia = ? AND marca = ?
        ORDER BY numero_animal ASC
    ";

    $stmt = mysqli_prepare($conexion, $query);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conexion));
    }

    mysqli_stmt_bind_param($stmt, "ss", $numero_guia, $marca);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Error en la ejecución de la consulta: " . mysqli_stmt_error($stmt));
    }

    $result = mysqli_stmt_get_result($stmt);
    $animales = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $animales[] = $row['numero_animal'];
    }

    echo json_encode($animales, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
