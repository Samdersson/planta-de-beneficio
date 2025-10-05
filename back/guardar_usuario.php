<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = isset($_POST['cedula']) ? mysqli_real_escape_string($conexion, $_POST['cedula']) : '';
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $correo_electronico = isset($_POST['correo_electronico']) ? mysqli_real_escape_string($conexion, $_POST['correo_electronico']) : '';
    $contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';
    $rol_id = isset($_POST['rol_id']) ? intval($_POST['rol_id']) : 0;
    $estado = isset($_POST['activo']) ? 1 : 0;
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre) || empty($cedula) || empty($correo_electronico) || empty($contrasena) || $rol_id <= 0) {
        echo "❌ Error: Todos los campos son obligatorios y deben ser válidos.";
        exit;
    }

    // Obtener el nombre del rol desde la base de datos
    $rol = '';
    $rol_query = "SELECT nombre FROM rol WHERE id = ?";
    $rol_stmt = mysqli_prepare($conexion, $rol_query);
    if ($rol_stmt) {
        mysqli_stmt_bind_param($rol_stmt, "i", $rol_id);
        mysqli_stmt_execute($rol_stmt);
        mysqli_stmt_bind_result($rol_stmt, $rol_nombre);
        if (mysqli_stmt_fetch($rol_stmt)) {
            $rol = $rol_nombre;
        }
        mysqli_stmt_close($rol_stmt);
    }
    if (empty($rol)) {
        echo "❌ Error: Rol inválido.";
        exit;
    }

    // Hashear la contraseña
    // $contrasena = password_hash($contrasena, PASSWORD_DEFAULT);

    if ($isUpdate === 1 && !empty($cedula)) {
        $sql = "UPDATE usuario SET nombre = ?, correo_electronico = ?, contraseña = ?, rol = ?, estado = ? WHERE cedula = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "sssssi", $nombre, $correo_electronico, $contrasena, $rol, $estado, $cedula);

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
        mysqli_stmt_bind_param($stmt, "sssssi", $nombre, $cedula, $correo_electronico, $contrasena, $rol, $estado);

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
