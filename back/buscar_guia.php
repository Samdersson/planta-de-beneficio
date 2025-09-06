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
        SELECT numero_guia, cantidad_animales, fecha_guia, cedula_productor, cedula_usuario
        FROM guia_movilizacion
        WHERE numero_guia = ?
        LIMIT 1
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
    $guia = mysqli_fetch_assoc($result);

    if (!$guia) {
        echo json_encode(['error' => 'Guía no encontrada']);
        exit;
    }

    echo json_encode($guia, JSON_UNESCAPED_UNICODE);

    mysqli_close($conexion);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
