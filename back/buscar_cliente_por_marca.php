<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'Conexion.php';

header('Content-Type: application/json');

if (!isset($_GET['marca'])) {
    echo json_encode(['error' => 'Parámetro marca requerido']);
    exit;
}

$marca = $_GET['marca'];

$sql = "SELECT nombre, cedula as cedula, destino FROM cliente WHERE marca = ? LIMIT 1";
$stmt = mysqli_prepare($conexion, $sql);
mysqli_stmt_bind_param($stmt, "s", $marca);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Cliente no encontrado para esta marca']);
}

mysqli_close($conexion);
?>
