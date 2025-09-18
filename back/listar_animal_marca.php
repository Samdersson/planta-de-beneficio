<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'Conexion.php';

header('Content-Type: application/json');

$especie = isset($_GET['especie']) ? mysqli_real_escape_string($conexion, $_GET['especie']) : '';

if ($especie) {
    $sql = "SELECT DISTINCT marca FROM animal WHERE marca IS NOT NULL AND marca != '' AND especie = '$especie' ORDER BY marca ASC";
} else {
    $sql = "SELECT DISTINCT marca FROM animal WHERE marca IS NOT NULL AND marca != '' ORDER BY marca ASC";
}

$result = mysqli_query($conexion, $sql);

$marcas = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $marcas[] = $row['marca'];
    }
    echo json_encode($marcas);
} else {
    echo json_encode([]);
}

mysqli_close($conexion);
?>
