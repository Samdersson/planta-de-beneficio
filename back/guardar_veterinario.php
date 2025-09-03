<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? mysqli_real_escape_string($conexion, $_POST['id']) : '';
    $cedula = isset($_POST['cedula']) ? mysqli_real_escape_string($conexion, $_POST['cedula']) : '';
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($cedula) || empty($nombre)) {
        echo "❌ Error: Los campos cédula y nombre son obligatorios.";
        exit;
    }

    if ($isUpdate === 1) {
        $sql = "UPDATE veterinario SET nombre = ? WHERE cedula = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "si", $nombre, $cedula);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Veterinario actualizado exitosamente.";
        } else {
            echo "❌ Error al actualizar el veterinario: " . mysqli_stmt_error($stmt);
        }
    } else {
        $sql = "INSERT INTO veterinario (cedula, nombre) VALUES (?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "is", $cedula, $nombre);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Veterinario creado exitosamente.";
        } else {
            echo "❌ Error al insertar el veterinario: " . mysqli_stmt_error($stmt);
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
