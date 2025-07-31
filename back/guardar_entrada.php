<?php

date_default_timezone_set('America/Bogota');

include 'Conexion.php';

$guia = isset($_POST['guia']) ? $_POST['guia'] : null;
$cliente_id = isset($_POST['cliente_id']) ? intval($_POST['cliente_id']) : null;
$destino = isset($_POST['destino']) ? $_POST['destino'] : null;
$sexo = isset($_POST['sexo']) ? $_POST['sexo'] : null;
$peso = isset($_POST['peso']) ? floatval($_POST['peso']) : null;
$numero_tiquete = isset($_POST['numero_tiquete']) ? $_POST['numero_tiquete'] : null;
$fecha_ingreso = isset($_POST['fecha_ingreso']) ? $_POST['fecha_ingreso'] : null;
$corral = isset($_POST['corral']) ? $_POST['corral'] : null;
$no_animal = isset($_POST['no_animal']) ? $_POST['no_animal'] : null;
$hora_registro = date("Y-m-d H:i:s"); // Fecha y hora actual

// Buscar guia_id por numero_guia
$guia_id = 0;
if ($guia) {
    $stmt = $conexion->prepare("SELECT id FROM guias_movilizacion WHERE numero_guia = ?");
    $stmt->bind_param("s", $guia);
    $stmt->execute();
    $stmt->bind_result($id);
    if ($stmt->fetch()) {
        $guia_id = $id;
    }
    $stmt->close();
}

if ($guia_id === 0) {
    echo "Error: guia no existe en guias_movilizacion.";
    $conexion->close();
    exit;
}

// Debug: mostrar datos recibidos
error_log("Datos recibidos: guia_id=$guia_id, cliente_id=$cliente_id, destino=$destino, sexo=$sexo, peso=$peso, numero_tiquete=$numero_tiquete, fecha_ingreso=$fecha_ingreso, corral=$corral, hora_registro=$hora_registro");

$sql = $conexion->prepare("
    INSERT INTO animales (
        guia_id, cliente_id, destino, sexo, peso, numero_tiquete, fecha_ingreso, corral, no_animal, hora_registro
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Vincular parámetros (evita inyección SQL)
$sql->bind_param(
    "iissdsssss", 
    $guia_id, $cliente_id, $destino, $sexo, $peso, $numero_tiquete, $fecha_ingreso, $corral, $no_animal, $hora_registro
);

if ($sql->execute()) {
    echo "Datos guardados correctamente.";
} else {
    // Debug: mostrar error SQL
    error_log("Error SQL: " . $sql->error);
    echo "Error: " . $sql->error;
}

$conexion->close();
