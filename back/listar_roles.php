<?php
include 'Conexion.php';

header('Content-Type: application/json');

$sql = "SELECT id, nombre FROM roles ORDER BY nombre";
$result = mysqli_query($conexion, $sql);

$roles = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $roles[] = $row;
    }
}

mysqli_close($conexion);

echo json_encode($roles);
?>
