<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include 'Conexion.php';

// Validar que la sesión tenga id_usuarios y rol_id
if (!isset($_SESSION['id_usuarios']) || !isset($_SESSION['rol_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado o sesión expirada']);
    exit;
}

// Obtener datos enviados por POST
$numero_guia = isset($_POST['numero_guia']) ? $_POST['numero_guia'] : null;
$cantidad = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : null;
$fecha_ica = isset($_POST['fecha_ica']) ? $_POST['fecha_ica'] : null;
$cedula = isset($_POST['cedula']) ? $_POST['cedula'] : null;
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;

// Obtener id_usuarios desde la sesión
$id_usuarios = intval($_SESSION['id_usuarios']);

// Validar campos obligatorios
if (!$numero_guia || !$cantidad || !$fecha_ica || !$cedula || !$id_usuarios || !$nombre) {
    echo json_encode(['error' => 'Faltan datos obligatorios']);
    exit;
}

// Preparar la consulta SQL para insertar
$sql = "INSERT INTO guias_movilizacion (numero_guia, cantidad, fecha_ica, cedula, id_usuarios, nombre) VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Error en la preparación de la consulta']);
    exit;
}

$stmt->bind_param("sissis", $numero_guia, $cantidad, $fecha_ica, $cedula, $id_usuarios, $nombre);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Guía registrada correctamente']);
} else {
    echo json_encode(['error' => 'Error al registrar la guía']);
}

$stmt->close();
$conexion->close();
?>
