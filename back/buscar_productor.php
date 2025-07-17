<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $cedula = isset($_GET['cedula']) ? intval($_GET['cedula']) : 0;

    if ($cedula <= 0) {
        echo json_encode(['error' => 'Cédula inválida']);
        exit;
    }

    $sql = "SELECT cedula, Nombre, predio, departamento, ciudad, animal FROM productor WHERE cedula = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    mysqli_stmt_bind_param($stmt, "i", $cedula);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Productor no encontrado']);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
