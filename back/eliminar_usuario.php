<?php
include_once 'Conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get cedula from query parameter instead of request body
    $cedula = isset($_GET['cedula']) ? $_GET['cedula'] : '';

    if (empty($cedula)) {
        echo "❌ Cédula de usuario inválida.";
        exit;
    }

    // Obtener el estado actual del usuario
    $sql_select = "SELECT estado FROM usuario WHERE cedula = ?";
    $stmt_select = mysqli_prepare($conexion, $sql_select);
    if ($stmt_select === false) {
        echo "❌ Error en la preparación de la consulta de selección: " . mysqli_error($conexion);
        exit;
    }

    mysqli_stmt_bind_param($stmt_select, "s", $cedula);
    mysqli_stmt_execute($stmt_select);
    mysqli_stmt_bind_result($stmt_select, $current_estado);
    mysqli_stmt_fetch($stmt_select);
    mysqli_stmt_close($stmt_select);

    if ($current_estado === null) {
        echo "❌ Usuario no encontrado.";
        exit;
    }

    // Alternar el estado
    $new_estado = $current_estado == 1 ? 0 : 1;

    $sql_update = "UPDATE usuario SET estado = ? WHERE cedula = ?";
    $stmt_update = mysqli_prepare($conexion, $sql_update);
    if ($stmt_update === false) {
        echo "❌ Error en la preparación de la consulta de actualización: " . mysqli_error($conexion);
        exit;
    }

    mysqli_stmt_bind_param($stmt_update, "is", $new_estado, $cedula);

    if (mysqli_stmt_execute($stmt_update)) {
        $mensaje = $new_estado == 1 ? "✅ Usuario activado exitosamente." : "✅ Usuario inactivado exitosamente.";
        echo $mensaje;
    } else {
        echo "❌ Error al actualizar el usuario: " . mysqli_stmt_error($stmt_update);
    }

    mysqli_stmt_close($stmt_update);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
