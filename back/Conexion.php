<?php

$server = "sql.freedb.tech";
$username = "freedb_planta";
$password = 'DV&4Bwr6$j@y7hU';
$database = "freedb_planta_evc";

// $server = "localhost";
// $username = "root";
// $password = "";
// $database = "prueba_software";



try {
    $conexion = @mysqli_connect($server, $username, $password, $database);
} catch (mysqli_sql_exception $e) {
    http_response_code(404);
    echo '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>error de conexion</title>
    <style>
        body {
            
            margin: 50px;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #ffffffff;
            font-family: Arial, sans-serif;
        }
        .error-message {
            font-size: 36px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            color: #000000ff;
            text-align: center;
            margin-top: 20px;
        }
        .error-gif {
            max-width: 900 px;
            max-height: 900px;
        }
        
    </style>
</head>
<body>
    <div class="error-message">Error 404 <br> No hay conexión con el servidor </div>
    <img src="../front/imagenes/404.gif" alt="Error 404" class="error-gif" />
    
</body>
</html>';
    exit();
}
?>



