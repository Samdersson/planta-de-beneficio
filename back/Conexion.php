<?php

// $server = "sql307.infinityfree.com";
// $username = "ifo_40075263";
// $password = "plantaevc2025";
// $database = "ifo_40075263_planta_de_beneficio";



// $conexion = mysqli_connect($server, $username, $password, $database);

// if (!$conexion) {
//     die("Conexión fallida: " . mysqli_connect_error());
// }
?>

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

