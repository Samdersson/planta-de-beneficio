<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'Conexion.php';

header('Content-Type: application/json');

if (!isset($_GET['marca']) || empty($_GET['marca'])) {
    echo json_encode(['error' => 'Parámetro marca es requerido']);
    exit;
}

$marca = mysqli_real_escape_string($conexion, $_GET['marca']);
$especie = isset($_GET['especie']) ? mysqli_real_escape_string($conexion, $_GET['especie']) : '';

if ($especie) {
    $sql = "SELECT numero_animal, marca FROM animal WHERE marca = '$marca' AND especie = '$especie' ORDER BY numero_animal ASC";
} else {
    $sql = "SELECT numero_animal, marca FROM animal WHERE marca = '$marca' ORDER BY numero_animal ASC";
}

$result = mysqli_query($conexion, $sql);

$animales = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $animales[] = $row;
    }
    echo json_encode($animales);
} else {
    echo json_encode(['error' => 'Error en la consulta']);
}

mysqli_close($conexion);
?>
