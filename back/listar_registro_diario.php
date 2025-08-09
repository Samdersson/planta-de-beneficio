<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once 'Conexion.php';

try {
    global $conexion;

    // Obtener parámetros de filtro
    $fecha = isset($_GET['fecha']) ? $_GET['fecha'] : null;
    $destino = isset($_GET['destino']) ? $_GET['destino'] : null;

$sql = "SELECT 
                c.nombre,
                c.id as cedula,
                c.destino,
                SUM(CASE WHEN a.sexo = 'M' AND a.especie = 1 THEN 1 ELSE 0 END) AS machos_bovinos,
                SUM(CASE WHEN a.sexo = 'H' AND a.especie = 1 THEN 1 ELSE 0 END) AS hembras_bovinos,
                SUM(CASE WHEN a.sexo = 'M' AND a.especie = 0 THEN 1 ELSE 0 END) AS machos_porcinos,
                SUM(CASE WHEN a.sexo = 'H' AND a.especie = 0 THEN 1 ELSE 0 END) AS hembras_porcinos
            FROM animales a
            LEFT JOIN clientes c ON a.cliente_id = c.id
            WHERE 1=1";

    $params = [];
    $types = "";
    $values = [];

    if ($fecha) {
        // Cambiar filtro para rango de fecha con hora
        $sql .= " AND a.fecha_ingreso >= ? AND a.fecha_ingreso <= ?";
        $types .= "ss";
        $values[] = $fecha . " 00:00:00";
        $values[] = $fecha . " 23:59:59";
    }

    if ($destino) {
        $sql .= " AND c.destino = ?";
        $types .= "s";
        $values[] = $destino;
    }

    $sql .= " GROUP BY c.nombre, c.id, c.destino";

    $stmt = mysqli_prepare($conexion, $sql);
    if ($types) {
        mysqli_stmt_bind_param($stmt, $types, ...$values);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $resultados = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $resultados[] = $row;
    }

    echo json_encode($resultados);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
