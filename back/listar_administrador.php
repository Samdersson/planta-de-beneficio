<?php
include_once 'Conexion.php';

$sql = "SELECT cedula, nombre, rol, telefono FROM usuario WHERE rol = '3'";
$result = mysqli_query($conexion, $sql);

$veterinarios = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $veterinarios[] = $row;
    }
    echo json_encode($veterinarios);
} else {
    echo json_encode(['error' => 'Error al obtener los veterinarios']);
}

mysqli_close($conexion);
?>
