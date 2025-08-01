<?php
include 'Conexion.php';

function generarToken($length = 50) {
    return bin2hex(random_bytes($length));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario_o_correo = isset($_POST['usuario_o_correo']) ? mysqli_real_escape_string($conexion, $_POST['usuario_o_correo']) : '';

    if (empty($usuario_o_correo)) {
        echo "❌ Error: Debe ingresar usuario o correo.";
        exit;
    }

    // Buscar usuario por usuario o correo
    $sql = "SELECT id, usuario FROM usuarios WHERE usuario = ? OR correo_electronico = ?";
    $stmt = mysqli_prepare($conexion, $sql);
    if ($stmt === false) {
        echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
        exit;
    }
    mysqli_stmt_bind_param($stmt, "ss", $usuario_o_correo, $usuario_o_correo);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $userId = $row['id'];
        $token = generarToken(25);
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Guardar token y expiración en tabla restablecimiento_contrasena (debe existir)
        $sqlInsert = "INSERT INTO restablecimiento_contrasena (user_id, token, expiry) VALUES (?, ?, ?)";
        $stmtInsert = mysqli_prepare($conexion, $sqlInsert);
        if ($stmtInsert === false) {
            echo "❌ Error en la preparación de la consulta de token: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmtInsert, "iss", $userId, $token, $expiry);
        if (!mysqli_stmt_execute($stmtInsert)) {
            echo "❌ Error al guardar el token: " . mysqli_stmt_error($stmtInsert);
            mysqli_stmt_close($stmtInsert);
            exit;
        }

        // Enviar correo con enlace (aquí se debe configurar el envío real)
        $resetLink = "http://tu_dominio.com/front/nueva_contrasena.html?token=" . $token;
        // mail($row['email'], "Restablecer contraseña", "Para restablecer su contraseña, haga clic en el siguiente enlace: $resetLink");

        echo "Se ha enviado un enlace de restablecimiento a su correo (simulado).";
    } else {
        echo "❌ Usuario o correo no encontrado.";
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
