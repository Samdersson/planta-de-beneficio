<?php
include 'Conexion.php';

header('Content-Type: application/json');

$sql = "SELECT DISTINCT marca FROM clientes WHERE marca IS NOT NULL AND marca != '' ORDER BY marca ASC";
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
