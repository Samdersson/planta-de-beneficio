<?php
include 'Conexion.php';

$fecha = $_GET['fecha'];

try {
    $sql = "SELECT a.*, c.nombre, c.cedula 
            FROM animales a 
            LEFT JOIN clientes c ON a.marca = c.marca 
            WHERE a.fecha = :fecha";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':fecha', $fecha);
    $stmt->execute();
    
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resultados);
    
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
