<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $telefono = isset($_POST['telefono']) ? mysqli_real_escape_string($conexion, $_POST['telefono']) : '';
    $empresa = isset($_POST['empresa']) ? mysqli_real_escape_string($conexion, $_POST['empresa']) : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre)) {
        echo "❌ Error: El campo nombre es obligatorio.";
        exit;
    }

    if ($isUpdate === 1 && $id > 0) {
        $sql = "UPDATE conductores SET nombre = ?, telefono = ?, empresa = ? WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "sssi", $nombre, $telefono, $empresa, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Conductor actualizado exitosamente.";
        } else {
            echo "❌ Error al actualizar el conductor: " . mysqli_stmt_error($stmt);
        }
    } else {
        $sql = "INSERT INTO conductores (nombre, telefono, empresa) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "sss", $nombre, $telefono, $empresa);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Conductor creado exitosamente.";
        } else {
            echo "❌ Error al insertar el conductor: " . mysqli_stmt_error($stmt);
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
