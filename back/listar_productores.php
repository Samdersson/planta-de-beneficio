<?php
include 'Conexion.php';

$sql = "SELECT cedula, Nombre FROM productor";
$result = mysqli_query($conexion, $sql);

$productores = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $productores[] = $row;
    }
    echo json_encode($productores);
} else {
    echo json_encode(['error' => 'Error al obtener los productores']);
}

mysqli_close($conexion);
?>
