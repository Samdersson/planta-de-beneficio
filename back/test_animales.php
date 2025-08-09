<?php
// Archivo de prueba para verificar la funcionalidad de listar animales
header('Content-Type: application/json');
require_once 'Conexion.php';

// Habilitar todos los errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $conexion = new Conexion();
    $pdo = $conexion->conectar();

    // Verificar si la tabla existe
    $sql = "SHOW TABLES LIKE 'animales'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if (!$tableExists) {
        echo json_encode(['error' => 'La tabla animales no existe']);
        exit;
    }

    // Verificar estructura de la tabla
    $sql = "DESCRIBE animales";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener datos de prueba
    $sql = "SELECT 
                a.id,
                c.nombre,
                c.cedula,
                a.marca,
                a.machos_bovinos,
                a.hembras_bovinos,
                a.machos_porcinos,
                a.hembras_porcinos,
                a.fecha
            FROM animales a
            INNER JOIN clientes c ON a.cliente_id = c.id
            ORDER BY a.fecha DESC
            LIMIT 10";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'columns' => $columns,
        'data' => $resultados,
        'count' => count($resultados)
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
