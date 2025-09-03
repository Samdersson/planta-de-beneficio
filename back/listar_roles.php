<?php
include 'Conexion.php';

header('Content-Type: application/json');

$sql = "SELECT id, nombre FROM rol ORDER BY nombre";
$result = mysqli_query($conexion, $sql);

$rol = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $rol[] = $row;
    }
}

mysqli_close($conexion);

echo json_encode($rol);
?>
