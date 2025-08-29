<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once 'Conexion.php';

try {
    global $conexion;

    // Consulta para obtener todas las guías de movilización
    $sql = "SELECT numero_guia, cantidad_animales, fecha_guia, cedula_productor, cedula_usuario 
            FROM guia_movilizacion 
            ORDER BY fecha_guia DESC";

    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception('Error en la consulta: ' . mysqli_error($conexion));
    }

    $guias = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $guias[] = $row;
    }

    echo json_encode($guias);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
