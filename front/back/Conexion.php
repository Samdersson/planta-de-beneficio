<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$base_datos = "planta_sacrificio";

$conn = new mysqli($host, $usuario, $contrasena, $base_datos);

if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
