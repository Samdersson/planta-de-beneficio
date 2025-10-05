<?php
include_once 'Conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get cedula from query parameter instead of request body
    $cedula = isset($_GET['cedula']) ? $_GET['cedula'] : '';

    if (empty($cedula)) {
        echo "❌ Cédula de usuario inválida.";
        exit;
    }

    $sql = "DELETE FROM usuario WHERE cedula = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
        exit;
    }

    mysqli_stmt_bind_param($stmt, "s", $cedula);

    if (mysqli_stmt_execute($stmt)) {
        echo "✅ Usuario eliminado exitosamente.";
    } else {
        echo "❌ Error al eliminar el usuario: " . mysqli_stmt_error($stmt);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
