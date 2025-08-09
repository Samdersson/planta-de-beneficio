<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $token = isset($_POST['token']) ? $_POST['token'] : '';
    $contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';

    if (empty($token) || empty($contrasena)) {
        echo "❌ Error: Token y contraseña son obligatorios.";
        exit;
    }

    // Buscar token válido y no expirado
    $sql = "SELECT user_id FROM restablecimiento_contrasena WHERE token = ? AND expiry > NOW()";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
        exit;
    }
    mysqli_stmt_bind_param($stmt, "s", $token);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $userId = $row['user_id'];
        $hashed_password = password_hash($contrasena, PASSWORD_DEFAULT);

        // Actualizar contraseña
        $sqlUpdate = "UPDATE usuarios SET contrasena = ? WHERE id = ?";
        $stmtUpdate = mysqli_prepare($conexion, $sqlUpdate);
        if ($stmtUpdate === false) {
            echo "❌ Error en la preparación de la consulta de actualización: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmtUpdate, "si", $hashed_password, $userId);

        if (mysqli_stmt_execute($stmtUpdate)) {
            // Eliminar token
            $sqlDelete = "DELETE FROM restablecimiento_contrasena WHERE token = ?";
            $stmtDelete = mysqli_prepare($conexion, $sqlDelete);
            if ($stmtDelete !== false) {
                mysqli_stmt_bind_param($stmtDelete, "s", $token);
                mysqli_stmt_execute($stmtDelete);
                mysqli_stmt_close($stmtDelete);
            }
            echo "✅ Contraseña actualizada exitosamente.";
        } else {
            echo "❌ Error al actualizar la contraseña: " . mysqli_stmt_error($stmtUpdate);
        }
        mysqli_stmt_close($stmtUpdate);
    } else {
        echo "❌ Token inválido o expirado.";
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
