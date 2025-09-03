<?php
include 'Conexion.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $telefono = isset($_POST['telefono']) ? mysqli_real_escape_string($conexion, $_POST['telefono']) : '';
    $cedula = isset($_POST['cedula']) ? mysqli_real_escape_string($conexion, $_POST['cedula']) : '';
    $cedula_usuario = isset($_SESSION['cedula']) ? $_SESSION['cedula'] : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre)) {
        echo "❌ Error: El campo nombre es obligatorio.";
        exit;
    }

    if ($isUpdate === 1 && $id > 0) {
        $sql = "UPDATE conductor SET nombre = ?, telefono = ?, cedula_usuario = ? WHERE cedula = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssss", $nombre, $telefono, $cedula_usuario, $cedula);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Conductor actualizado exitosamente.";
        } else {
            echo "❌ Error al actualizar el conductor: " . mysqli_stmt_error($stmt);
        }
    } else {
        $sql = "INSERT INTO conductor (nombre, telefono, cedula, cedula_usuario) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssss", $nombre, $telefono, $cedula, $cedula_usuario);

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
