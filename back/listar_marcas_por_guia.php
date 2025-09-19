<?php
header('Content-Type: application/json');
try {
    include_once 'Conexion.php';

    $numero_guia = isset($_GET['numero_guia']) ? $_GET['numero_guia'] : '';

    if (!$numero_guia) {
        echo json_encode(['error' => 'Número de guía no proporcionado']);
        exit;
    }

    $query = "
        SELECT DISTINCT marca
        FROM animal
        WHERE numero_guia = ?
        ORDER BY marca ASC
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
    $marcas = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $marcas[] = $row['marca'];
    }

    echo json_encode($marcas, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
