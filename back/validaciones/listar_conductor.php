<?php
include_once '../Conexion.php';

$sql = "SELECT nombre, cedula, telefono FROM conductor";
$result = mysqli_query($conexion, $sql);

$conductores = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $conductores[] = $row;
    }
    echo json_encode($conductores);
} else {
    echo json_encode(['error' => 'Error al obtener los conductores']);
}

mysqli_close($conexion);
?>
