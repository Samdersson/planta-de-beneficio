<?php
include 'Conexion.php';

$sql = "SELECT marca, cedula, nombre FROM cliente";
$result = mysqli_query($conexion, $sql);

$cliente = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $cliente[] = $row;
    }
    echo json_encode($cliente);
} else {
    echo json_encode(['error' => 'Error al obtener los clientes']);
}

mysqli_close($conexion);
?>
