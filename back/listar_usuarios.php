<?php
include_once 'Conexion.php';

$sql = "SELECT  cedula, nombre, correo_electronico, rol, estado, fecha_registro FROM usuario";
$result = mysqli_query($conexion, $sql);

$usuarios = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $usuarios[] = $row;
    }
    echo json_encode($usuarios);
} else {
    echo json_encode(['error' => 'Error al obtener los usuarios.']);
}

mysqli_close($conexion);
?>
