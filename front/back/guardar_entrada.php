<?php
include 'Conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destino = $_POST['destino'] ?? '';
    $cedula = $_POST['cedula'] ?? '';
    $marca = $_POST['marca'] ?? '';
    $bobinos_macho = $_POST['bobinos_macho'] ?? 0;
    $bobinos_hembra = $_POST['bobinos_hembra'] ?? 0;
    $porcinos_macho = $_POST['porcinos_macho'] ?? 0;
    $porcinos_hembra = $_POST['porcinos_hembra'] ?? 0;
    $fecha = $_POST['fecha'] ?? date('Y-m-d');

    $stmt = $conn->prepare("INSERT INTO entradas (destino, cedula, marca, bobinos_macho, bobinos_hembra, porcinos_macho, porcinos_hembra, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiiiis", $destino, $cedula, $marca, $bobinos_macho, $bobinos_hembra, $porcinos_macho, $porcinos_hembra, $fecha);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Entrada guardada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar la entrada']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
