<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos POST y sanitizar
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $destino = isset($_POST['destino']) ? mysqli_real_escape_string($conexion, $_POST['destino']) : '';
    $marca = isset($_POST['marca']) ? mysqli_real_escape_string($conexion, $_POST['marca']) : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    // Validación básica
    if ($id <= 0 || empty($nombre) || empty($destino) || empty($marca)) {
        echo "❌ Error: Todos los campos son obligatorios y deben ser válidos.";
        exit;
    }

    if ($isUpdate === 1) {
        // Preparar consulta UPDATE
        $sql = "UPDATE clientes SET nombre = ?, destino = ?, marca = ? WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "sssi", $nombre, $destino, $marca, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Cliente actualizado exitosamente.";
        } else {
            echo "❌ Error al actualizar el cliente: " . mysqli_stmt_error($stmt);
        }
    } else {
        // Preparar consulta INSERT
        $sql = "INSERT INTO clientes (id, nombre, destino, marca) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "isss", $id, $nombre, $destino, $marca);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Cliente creado exitosamente.";
        } else {
            echo "❌ Error al insertar el cliente: " . mysqli_stmt_error($stmt);
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
