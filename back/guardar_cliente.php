<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include 'Conexion.php';

// Obtener datos enviados por POST
$cedula = isset($_POST['cedula']) ? $_POST['cedula'] : null;
$marca = isset($_POST['marca']) ? $_POST['marca'] : null;
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
$destino = isset($_POST['destino']) ? $_POST['destino'] : null;


// Obtener cédula del usuario desde la sesión
$cedula_usuario = $_SESSION['cedula'];

// Validar campos obligatorios
if (!$marca || !$nombre || !$destino || !$cedula_usuario) {
    echo json_encode(['error' => 'Faltan datos obligatorios']);
    exit;
}

// Preparar la consulta SQL para insertar
$sql = "INSERT INTO cliente (cedula,marca, nombre, cedula_usuario, destino) VALUES (?,?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Error en la preparación de la consulta']);
    exit;
}

$stmt->bind_param("issss", $cedula, $marca, $nombre, $cedula_usuario, $destino);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Cliente registrado correctamente']);
} else {
    echo json_encode(['error' => 'Error al registrar el cliente: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
