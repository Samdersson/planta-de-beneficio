<?php

$server = "localhost";
$username = "root";
$password = "";
$database = "prueba_software";



$conexion = mysqli_connect($server, $username, $password, $database);

if (!$conexion) {
    die("Conexión fallida: " . mysqli_connect_error());
} 
?>
