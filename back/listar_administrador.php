<?php
include_once 'Conexion.php';

$sql = "SELECT cedula, nombre, rol FROM usuario WHERE rol = 'administrador'";
$result = mysqli_query($conexion, $sql);

$veterinarios = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $veterinarios[] = $row;
    }
    echo json_encode($veterinarios);
} else {
    echo json_encode(['error' => 'Error al obtener los administradores.']);
}

mysqli_close($conexion);
?>
