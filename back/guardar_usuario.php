<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $cedula = isset($_POST['cedula']) ? mysqli_real_escape_string($conexion, $_POST['cedula']) : '';
    $correo_electronico = isset($_POST['correo_electronico']) ? mysqli_real_escape_string($conexion, $_POST['correo_electronico']) : '';
    $contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';
    $rol = isset($_POST['rol_id']) ? intval($_POST['rol_id']) : 0;
    $estado = isset($_POST['activo']) ? 1 : 0;
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre) || empty($cedula) || empty($correo_electronico) || empty($contrasena) || $rol <= 0) {
        echo "❌ Error: Todos los campos son obligatorios y deben ser válidos.";
        exit;
    }

    // Hashear la contraseña
    // $contrasena = password_hash($contrasena, PASSWORD_DEFAULT);
    // // $contrasena = contraseña
    //si la vamos a implementar conenvio de correos para restablecer contraseña se puede activar 
    // o para aumentar la seguridad de ataques sql inyection

    if ($isUpdate === 1 && $id > 0) {
        $sql = "UPDATE usuario SET nombre = ?, cedula = ?, correo_electronico = ?, contraseña = ?, rol = ?, estado = ? WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssiii", $nombre, $cedula, $correo_electronico, $contrasena, $rol, $estado, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Usuario actualizado exitosamente.";
        } else {
            if (mysqli_errno($conexion) == 1062) { // Duplicate entry
                echo "❌ Error: La cédula ya existe.";
            } else {
                echo "❌ Error al actualizar el usuario: " . mysqli_stmt_error($stmt);
            }
        }
    } else {
        $sql = "INSERT INTO usuario (nombre, cedula, correo_electronico, contraseña, rol, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssii", $nombre, $cedula, $correo_electronico, $contrasena, $rol, $estado);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Usuario creado exitosamente.";
        } else {
            if (mysqli_errno($conexion) == 1062) { // Duplicate entry
                echo "❌ Error: La cédula ya existe.";
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
