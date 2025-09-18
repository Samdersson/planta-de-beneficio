<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'Conexion.php';

header('Content-Type: application/json');

$marca = isset($_GET['marca']) ? $_GET['marca'] : '';

if (!$marca) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT numero_animal FROM animal WHERE marca = ? ORDER BY numero_animal ASC";
$stmt = mysqli_prepare($conexion, $sql);
if (!$stmt) {
    echo json_encode([]);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $marca);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$numeros = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $numeros[] = $row['numero_animal'];
    }
}

echo json_encode($numeros);

mysqli_close($conexion);
?>
