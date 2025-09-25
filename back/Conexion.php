<?php
// // Configuración de la base de datos remota en Railway
// $dbHost = 'switchback.proxy.rlwy.net';
// $dbPort = 27915;
// $dbUser = 'root';
// $dbPassword = 'MGKEJyKrDHtVcNAAlGXSWqeZeFuQZOyU'; // Reemplaza con el valor real
// $dbName = 'railway';

// // Crear la conexión
// $conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName, $dbPort);

// // Verificar la conexión
// if ($conn->connect_error) {
//   die("Error de conexión: " . $conn->connect_error);
// }
// echo "Conexión exitosa a la base de datos remota en Railway";

// ?>

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
