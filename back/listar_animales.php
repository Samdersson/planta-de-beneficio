<?php
header('Content-Type: application/json');
require_once 'Conexion.php';

try {
    global $conexion;

    // Obtener parámetros de filtrado
    $fecha = isset($_GET['fecha']) ? $_GET['fecha'] : null;
    $marca = isset($_GET['marca']) ? $_GET['marca'] : null;

    // Construir consulta base
    $sql = "SELECT 
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
            WHERE 1=1";

    if ($fecha) {
        $fecha_esc = mysqli_real_escape_string($conexion, $fecha);
        $sql .= " AND a.fecha = '$fecha_esc'";
    }

    if ($marca) {
        $marca_esc = mysqli_real_escape_string($conexion, $marca);
        $sql .= " AND a.marca = '$marca_esc'";
    }

    $sql .= " ORDER BY a.fecha DESC";

    $result = mysqli_query($conexion, $sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }

    $resultados = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $resultados[] = $row;
    }

    echo json_encode($resultados);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
