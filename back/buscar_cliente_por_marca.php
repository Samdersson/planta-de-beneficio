<?php
header('Content-Type: application/json');
include 'Conexion.php';

$marca = isset($_GET['marca']) ? $_GET['marca'] : '';

if (!$marca) {
    echo json_encode(['error' => 'Marca no especificada']);
    exit;
}

$stmt = $conexion->prepare("SELECT Nombre, cedula FROM clientes WHERE marca = ? LIMIT 1");
$stmt->bind_param("s", $marca);
$stmt->execute();
$stmt->bind_result($nombre, $cedula);
if ($stmt->fetch()) {
    echo json_encode(['nombre' => $nombre, 'cedula' => $cedula]);
} else {
    echo json_encode(['error' => 'Cliente no encontrado']);
}
$stmt->close();
$conexion->close();
?>
