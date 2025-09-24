<?php

date_default_timezone_set('America/Bogota');
session_start();

include 'Conexion.php';

$numero_animal = isset($_POST['no_animal']) ? $_POST['no_animal'] : null;
$sexo = isset($_POST['sexo']) ? $_POST['sexo'] : null;
$peso = isset($_POST['peso']) ? floatval($_POST['peso']) : null;
$numero_tiquete = isset($_POST['numero_tiquete']) ? $_POST['numero_tiquete'] : null;
$fecha_sacrificio = isset($_POST['fecha_ingreso']) ? $_POST['fecha_ingreso'] : null;
$fecha_guia = isset($_POST['fecha_sacrificio']) ? $_POST['fecha_sacrificio'] : null;
$numero_corral = isset($_POST['corral']) ? $_POST['corral'] : null;
$especie = null;
if (isset($_POST['especie'])) {
    $val = strtolower(trim($_POST['especie']));
    if ($val === '0' || $val === 'porcino') {
        $especie = 'porcino';
    } elseif ($val === '1' || $val === 'bovino') {
        $especie = 'bovino';
    }
}
if (empty($especie)) {
    $especie = 'porcino'; // por defecto se carga porcino
}

if (empty($especie)) {
    $especie = 'porcino'; // valor por defecto para evitar error de columna null
}
$hora_caida = isset($_POST['hora_caida']) ? $_POST['hora_caida'] : null;
$numero_guia = isset($_POST['guia']) ? trim($_POST['guia']) : null;
$id_guia_transporte = null; 
$cedula_usuario = isset($_SESSION['cedula']) ? $_SESSION['cedula'] : null;
$marca = isset($_POST['marca']) ? $_POST['marca'] : null;
$estado = 'disponible'; 
// Valida la existencia en guias_movilizacion
if ($numero_guia) {
    $stmt = $conexion->prepare("SELECT numero_guia FROM guia_movilizacion WHERE numero_guia = ?");
    $stmt->bind_param("s", $numero_guia);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['warning' => 'La guía no existe en guias_movilizacion.']);
        $stmt->close();
        $conexion->close();
        exit;
    }
    $stmt->close();
}

// Validar que no exista la combinación de numero_animal y numero_guia
$validacion_sql = $conexion->prepare("
    SELECT numero_animal, numero_guia FROM animal WHERE numero_animal = ? AND numero_guia = ?
");
$validacion_sql->bind_param("ss", $numero_animal, $numero_guia);
$validacion_sql->execute();
$resultado_validacion = $validacion_sql->get_result();

if ($resultado_validacion->num_rows > 0) {
    $fila_existente = $resultado_validacion->fetch_assoc();
    echo json_encode(['error' => 'Ya existe un animal con el número ' . $numero_animal . ' en la guía ' . $numero_guia . '. No se pueden duplicar números dentro de la misma guía.']);
    $validacion_sql->close();
    $conexion->close();
    exit;
}
$validacion_sql->close();

// Debug: mostrar datos que se van a insertar
error_log("Intentando insertar: numero_animal=$numero_animal, numero_guia=$numero_guia, especie=$especie");

// mostrar datos recibidos
// error_log("Datos recibidos: numero_animal=$numero_animal, sexo=$sexo, peso=$peso, numero_tiquete=$numero_tiquete, fecha_guia=$fecha_guia, fecha_sacrificio=$fecha_sacrificio, numero_corral=$numero_corral, especie=$especie, hora_caida=$hora_caida, numero_guia=$numero_guia, id_guia_transporte=$id_guia_transporte, cedula_usuario=$cedula_usuario, marca=$marca");

$sql = $conexion->prepare("
    INSERT INTO animal (
        numero_animal, sexo, peso, numero_tiquete, fecha_guia, fecha_sacrificio, numero_corral, especie, hora_caida, numero_guia, cedula_usuario, marca, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
");

// Vincular parámetros (evita inyección SQL)
$sql->bind_param(
    "ssdsssssssiss",
    $numero_animal, $sexo, $peso, $numero_tiquete, $fecha_guia, $fecha_sacrificio, $numero_corral, $especie, $hora_caida, $numero_guia, $cedula_usuario, $marca, $estado
);

if ($sql->execute()) {
    echo "Datos guardados correctamente.";
} else {
    // Debug: mostrar error SQL
    error_log("Error SQL: " . $sql->error);
    echo "Error: " . $sql->error;
}

$conexion->close();
