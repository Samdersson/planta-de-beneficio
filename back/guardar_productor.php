<?php
include 'Conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get POST data and sanitize
    $cedula = isset($_POST['cedula']) ? intval($_POST['cedula']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $predio = isset($_POST['predio']) ? mysqli_real_escape_string($conexion, $_POST['predio']) : '';
    $departamento = isset($_POST['departamento']) ? mysqli_real_escape_string($conexion, $_POST['departamento']) : '';
    $ciudad = isset($_POST['ciudad']) ? mysqli_real_escape_string($conexion, $_POST['ciudad']) : '';
    $animal_str = isset($_POST['animal']) ? $_POST['animal'] : '';
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    // Map animal string to int
    $animal_map = [
        'bovino' => 1,
        'porcino' => 2
    ];
    $animal = isset($animal_map[$animal_str]) ? $animal_map[$animal_str] : 0;

    // Basic validation
    if ($cedula <= 0 || empty($nombre) || empty($predio) || empty($departamento) || empty($ciudad) || $animal === 0) {
        echo "❌ Error: Todos los campos son obligatorios y deben ser válidos.";
        exit;
    }

    if ($isUpdate === 1) {
        // Prepare update query
        $sql = "UPDATE productor SET Nombre = ?, predio = ?, departamento = ?, ciudad = ?, animal = ? WHERE cedula = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssii", $nombre, $predio, $departamento, $ciudad, $animal, $cedula);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Productor actualizado exitosamente.";
        } else {
            echo "❌ Error al actualizar el productor: " . mysqli_stmt_error($stmt);
        }
    } else {
        // Prepare insert query
        $sql = "INSERT INTO productor (cedula, Nombre, predio, departamento, ciudad, animal) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "❌ Error en la preparación de la consulta: " . mysqli_error($conexion);
            exit;
        }
        mysqli_stmt_bind_param($stmt, "issssi", $cedula, $nombre, $predio, $departamento, $ciudad, $animal);

        if (mysqli_stmt_execute($stmt)) {
            echo "✅ Productor creado exitosamente.";
        } else {
            echo "❌ Error al insertar el productor: " . mysqli_stmt_error($stmt);
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "❌ Método no permitido.";
}
?>
