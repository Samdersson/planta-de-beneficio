<?php
include 'Conexion.php';

$sql = "SELECT marca, cedula, Nombre FROM clientes";
$result = mysqli_query($conexion, $sql);

$clientes = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $clientes[] = $row;
    }
    echo json_encode($clientes);
} else {
    echo json_encode(['error' => 'Error al obtener los clientes']);
}

mysqli_close($conexion);
?>
