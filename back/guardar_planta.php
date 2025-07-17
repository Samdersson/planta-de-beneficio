<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre_planta = isset($_POST['nombre_planta']) ? mysqli_real_escape_string($conexion, $_POST['nombre_planta']) : '';
    $municipio = isset($_POST['municipio']) ? mysqli_real_escape_string($conexion, $_POST['municipio']) : '';
    $nit = isset($_POST['nit']) ? mysqli_real_escape_string($conexion, $_POST['nit']) : '';
    $resolucion = isset($_POST['resolucion']) ? mysqli_real_escape_string($conexion, $_POST['resolucion']) : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    if (empty($nombre_planta) || empty($municipio) || empty($nit) || empty($resolucion)) {
        echo "❌ Error: Todos los campos son obligatorios.";
        exit;
    }

    if ($isUpdate === 1 && $id > 0) {
        $sql = "UPDATE configuracion_planta SET nombre_planta = ?, municipio = ?, nit = ?, resolucion = ? WHERE id = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssi", $nombre_planta, $municipio, $nit, $resolucion, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Configuración actualizada exitosamente.";
        } else {
            echo "❌ Error al actualizar la configuración: " . mysqli_stmt_error($stmt);
        }
    } else {
        $sql = "INSERT INTO configuracion_planta (nombre_planta, municipio, nit, resolucion) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssss", $nombre_planta, $municipio, $nit, $resolucion);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Configuración guardada exitosamente.";
        } else {
            echo "❌ Error al insertar la configuración: " . mysqli_stmt_error($stmt);
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
