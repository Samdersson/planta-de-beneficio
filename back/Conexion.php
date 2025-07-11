<?php

$server = "localhost";
$username = "root";
$password = "";
$database = "planta_sacrificio";


$conexion = mysqli_connect($server, $username, $password, $database);

if (!$conexion) {
    die("❌ Conexión fallida: " . mysqli_connect_error());
} else {
    echo "✅ Conectado correctamente a la base de datos.";
}
?>
