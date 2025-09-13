<?php
include("conexion.php"); // importa tu archivo de conexión

// Si llega aquí es porque no hubo error en la conexión
echo "<h2>✅ Conexión correcta a la base de datos</h2>";

// Opcional: prueba hacer una consulta
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result) {
    echo "<h3>Tablas en la base de datos:</h3><ul>";
    while ($row = $result->fetch_array()) {
        echo "<li>" . $row[0] . "</li>";
    }
    echo "</ul>";
} else {
    echo "❌ Error al consultar: " . $conn->error;
}
?>
