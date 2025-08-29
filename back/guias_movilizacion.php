<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include 'Conexion.php';

if (!isset($_SESSION['cedula']) || !isset($_SESSION['rol'])) {
    echo json_encode(['error' => 'Usuario no autenticado o sesión expirada']);
    exit;
}

// Determinar la acción (insertar o eliminar)
$accion = isset($_POST['accion']) ? $_POST['accion'] : 'insertar';

if ($accion === 'eliminar') {
    // Lógica para eliminar guía
    $numero_guia = isset($_POST['numero_guia']) ? $_POST['numero_guia'] : null;
    
    if (!$numero_guia) {
        echo json_encode(['error' => 'Número de guía requerido para eliminar']);
        exit;
    }

    // Verificar que la guía existe
    $sql_check = "SELECT numero_guia FROM guia_movilizacion WHERE numero_guia = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("s", $numero_guia);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows === 0) {
        echo json_encode(['error' => 'La guía no existe']);
        $stmt_check->close();
        exit;
    }
    $stmt_check->close();

    // Eliminar la guía
    $sql = "DELETE FROM guia_movilizacion WHERE numero_guia = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta de eliminación']);
        exit;
    }

    $stmt->bind_param("s", $numero_guia);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Guía eliminada correctamente']);
    } else {
        echo json_encode(['error' => 'Error al eliminar la guía']);
    }

    $stmt->close();
    
} elseif ($accion === 'editar') {
    // Lógica para editar guía
    $numero_guia = isset($_POST['numero_guia']) ? $_POST['numero_guia'] : null;
    $cantidad_animales = isset($_POST['cantidad_animales']) ? intval($_POST['cantidad_animales']) : null;
    $fecha_guia = isset($_POST['fecha_guia']) ? $_POST['fecha_guia'] : null;
    $cedula_productor = isset($_POST['cedula_productor']) ? $_POST['cedula_productor'] : null;

    // Validar campos obligatorios
    if (!$numero_guia || !$cantidad_animales || !$fecha_guia || !$cedula_productor) {
        echo json_encode(['error' => 'Faltan datos obligatorios para editar']);
        exit;
    }

    // Verificar que la guía existe
    $sql_check = "SELECT numero_guia FROM guia_movilizacion WHERE numero_guia = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("s", $numero_guia);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows === 0) {
        echo json_encode(['error' => 'La guía no existe']);
        $stmt_check->close();
        exit;
    }
    $stmt_check->close();

    // Actualizar la guía
    $sql = "UPDATE guia_movilizacion SET cantidad_animales = ?, fecha_guia = ?, cedula_productor = ? WHERE numero_guia = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta de actualización']);
        exit;
    }

    $stmt->bind_param("isss", $cantidad_animales, $fecha_guia, $cedula_productor, $numero_guia);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Guía actualizada correctamente']);
    } else {
        echo json_encode(['error' => 'Error al actualizar la guía']);
    }

    $stmt->close();
    
} else {
    // Lógica para insertar guía (código original)
    error_log("Datos recibidos: " . json_encode($_POST));
    $numero_guia = isset($_POST['numero_guia']) ? $_POST['numero_guia'] : null;
    $cantidad_animales = isset($_POST['cantidad_animales']) ? intval($_POST['cantidad_animales']) : null;
    $fecha_guia = isset($_POST['fecha_guia']) ? $_POST['fecha_guia'] : null;
    $cedula_productor = isset($_POST['cedula_productor']) ? $_POST['cedula_productor'] : null;

    // Obtener cedula_usuarios desde la sesión
    $cedula_usuario = intval($_SESSION['cedula']);

    // Validar campos obligatorios
    if (!$numero_guia || !$cantidad_animales || !$fecha_guia || !$cedula_productor || !$cedula_usuario) {
        echo json_encode(['error' => 'Faltan datos obligatorios']);
        exit;
    }

    $sql_check = "SELECT numero_guia FROM guia_movilizacion WHERE numero_guia = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("s", $numero_guia);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['error' => 'La guía ya está registrada']);
        $stmt_check->close();
        exit;
    }
    $stmt_check->close();

    $sql = "INSERT INTO guia_movilizacion (numero_guia, cantidad_animales, fecha_guia, cedula_productor, cedula_usuario) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => 'Error en la preparación de la consulta']);
        exit;
    }

    $stmt->bind_param("sissi", $numero_guia, $cantidad_animales, $fecha_guia, $cedula_productor, $cedula_usuario);

    if ($stmt->execute()) {
        error_log("Guía registrada correctamente: numero_guia=$numero_guia, cantidad_animales=$cantidad_animales, fecha_guia=$fecha_guia, cedula_productor=$cedula_productor, cedula_usuario=$cedula_usuario");
        echo json_encode(['success' => 'Guía registrada correctamente']);
    } else {
        echo json_encode(['error' => 'Error al registrar la guía']);
    }

    $stmt->close();
}

$conexion->close();
?>
