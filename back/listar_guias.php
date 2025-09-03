<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once 'Conexion.php';

try {
    global $conexion;

    // Obtener parámetros de fecha
    $fechaInicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : '';
    $fechaFin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : '';

    // Consulta para obtener las guías de movilización filtradas por rango de fechas
    if ($fechaInicio && $fechaFin) {
        $sql = "SELECT numero_guia, cantidad_animales, fecha_guia, cedula_productor, cedula_usuario
                FROM guia_movilizacion
                WHERE fecha_guia BETWEEN ? AND ?
                ORDER BY fecha_guia DESC";

        $stmt = mysqli_prepare($conexion, $sql);
        if (!$stmt) {
            throw new Exception('Error en la preparación de la consulta: ' . mysqli_error($conexion));
        }
        mysqli_stmt_bind_param($stmt, "ss", $fechaInicio, $fechaFin);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } else {
        $sql = "SELECT numero_guia, cantidad_animales, fecha_guia, cedula_productor, cedula_usuario
                FROM guia_movilizacion
                ORDER BY fecha_guia DESC";
        $result = mysqli_query($conexion, $sql);
    }

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
