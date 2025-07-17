<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        echo json_encode(['error' => 'ID inválido']);
        exit;
    }

    $sql = "SELECT id, nombre, usuario, rol_id, activo FROM usuarios WHERE id = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
