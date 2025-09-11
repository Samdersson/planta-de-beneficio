<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $cedula = isset($_GET['cedula']) ? mysqli_real_escape_string($conexion, $_GET['cedula']) : '';

    if (empty($cedula)) {
        echo json_encode(['error' => 'Debe proporcionar una cédula para buscar.']);
        exit;
    }

    $sql = "SELECT nombre, cedula FROM veterinario WHERE cedula = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo json_encode(['error' => 'Error en la preparación de la consulta: ' . mysqli_error($conexion)]);
        exit;
    }

    mysqli_stmt_bind_param($stmt, "i", $cedula);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Veterinario no encontrado.']);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo json_encode(['error' => 'Método no permitido.']);
}
?>
