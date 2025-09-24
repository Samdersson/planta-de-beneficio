<?php


$host = "mysql.railway.internal";  // MYSQLHOST
$usuario = "root";                            // MYSQLUSER
$password = "AvkTYSuHHqTkdIdQtZttlXgRkXUQYrkx";             // MYSQLPASSWORD
$base_datos = "railway";                      // MYSQLDATABASE
$puerto = 3306;                               // MYSQLPORT

$conexion = mysqli_connect($host, $usuario, $password, $base_datos, $puerto);

if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}
echo "✅ Conexión exitosa a Railway MySQL";



// $server = "localhost";
// $username = "root";
// $password = "";
// $database = "prueba_software";



// $conexion = mysqli_connect($server, $username, $password, $database);

// if (!$conexion) {
//     die("Conexión fallida: " . mysqli_connect_error());
// } 
?>
