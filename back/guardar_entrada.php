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
    $especieInput = strtolower(trim($_POST['especie']));
    if ($especieInput === 'm' || $especieInput === 'porcino') {
        $especie = 'porcino';
    } elseif ($especieInput === 'h' || $especieInput === 'bovino') {
        $especie = 'bovino';
    } else {
        $especie = $especieInput; // Guardar tal cual si no es M o H
    }
}
$hora_caida = isset($_POST['hora_caida']) ? $_POST['hora_caida'] : null;
$numero_guia = isset($_POST['guia']) ? trim($_POST['guia']) : null;
$id_guia_transporte = null; // Eliminado, ya que se usa numero_guia en su lugar
$cedula_usuario = isset($_SESSION['cedula']) ? $_SESSION['cedula'] : null;
$marca = isset($_POST['marca']) ? $_POST['marca'] : null;

// Validar que la guía exista en guias_movilizacion
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

// Debug: mostrar datos recibidos
error_log("Datos recibidos: numero_animal=$numero_animal, sexo=$sexo, peso=$peso, numero_tiquete=$numero_tiquete, fecha_guia=$fecha_guia, fecha_sacrificio=$fecha_sacrificio, numero_corral=$numero_corral, especie=$especie, hora_caida=$hora_caida, numero_guia=$numero_guia, id_guia_transporte=$id_guia_transporte, cedula_usuario=$cedula_usuario, marca=$marca");

$sql = $conexion->prepare("
    INSERT INTO animal (
        numero_animal, sexo, peso, numero_tiquete, fecha_guia, fecha_sacrificio, numero_corral, especie, hora_caida, numero_guia, cedula_usuario, marca
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Vincular parámetros (evita inyección SQL)
$sql->bind_param(
    "ssdsssssssis", 
    $numero_animal, $sexo, $peso, $numero_tiquete, $fecha_guia, $fecha_sacrificio, $numero_corral, $especie, $hora_caida, $numero_guia, $cedula_usuario, $marca
);

if ($sql->execute()) {
    echo "Datos guardados correctamente.";
} else {
    // Debug: mostrar error SQL
    error_log("Error SQL: " . $sql->error);
    echo "Error: " . $sql->error;
}

$conexion->close();
