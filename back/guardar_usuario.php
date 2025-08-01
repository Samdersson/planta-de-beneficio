<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $usuario = isset($_POST['usuario']) ? mysqli_real_escape_string($conexion, $_POST['usuario']) : '';
    $correo_electronico = isset($_POST['correo_electronico']) ? mysqli_real_escape_string($conexion, $_POST['correo_electronico']) : '';
    $contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';
    $rol_id = isset($_POST['rol_id']) ? intval($_POST['rol_id']) : 0;
    $activo = isset($_POST['activo']) ? intval($_POST['activo']) : 1;
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre) || empty($usuario) || empty($correo_electronico) || empty($contrasena) || $rol_id <= 0) {
        echo "❌ Error: Todos los campos son obligatorios y deben ser válidos.";
        exit;
    }

    // Hashear la contraseña
    // $contrasena = password_hash($contrasena, PASSWORD_DEFAULT);
    // // $contrasena = contraseña
    //si la vamos a implementar conenvio de correos para restablecer contraseña se puede activar 
    // o para aumentar la seguridad de ataques sql inyection

    if ($isUpdate === 1 && $id > 0) {
        $sql = "UPDATE usuarios SET nombre = ?, usuario = ?, correo_electronico = ?, contrasena = ?, rol_id = ?, activo = ? WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssiii", $nombre, $usuario, $correo_electronico, $contrasena, $rol_id, $activo, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Usuario actualizado exitosamente.";
        } else {
            if (mysqli_errno($conexion) == 1062) { // Duplicate entry
                echo "❌ Error: El nombre de usuario ya existe.";
            } else {
                echo "❌ Error al actualizar el usuario: " . mysqli_stmt_error($stmt);
            }
        }
    } else {
        $sql = "INSERT INTO usuarios (nombre, usuario, correo_electronico, contrasena, rol_id, activo) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssis", $nombre, $usuario, $correo_electronico, $contrasena, $rol_id, $activo);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Usuario creado exitosamente.";
        } else {
            if (mysqli_errno($conexion) == 1062) { // Duplicate entry
                echo "❌ Error: El nombre de usuario ya existe.";
            } else {
                echo "❌ Error al insertar el usuario: " . mysqli_stmt_error($stmt);
            }
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
