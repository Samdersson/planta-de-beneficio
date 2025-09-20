<?php

function obtenerSiguienteConsecutivo($mysqli, $tipo_animal) {
    $anio_actual = date('Y');

    if ($tipo_animal === 'porcino') {
        $tabla = 'consecutivos_porcinos';
        $prefijo = '150 P';
    } elseif ($tipo_animal === 'bovino') {
        $tabla = 'consecutivos_bovinos';
        $prefijo = '567 B';
    } else {
        throw new Exception("Tipo de animal inválido");
    }


    $mysqli->query("LOCK TABLES $tabla WRITE");


    $stmt = $mysqli->prepare("SELECT numero_incremental FROM $tabla WHERE anio = ?");
    $stmt->bind_param('i', $anio_actual);
    $stmt->execute();
    $stmt->bind_result($numero_incremental);
    $existe = $stmt->fetch();
    $stmt->close();

    if ($existe) {
        // Incrementar el número
        $numero_incremental++;
        $stmt = $mysqli->prepare("UPDATE $tabla SET numero_incremental = ? WHERE anio = ?");
        $stmt->bind_param('ii', $numero_incremental, $anio_actual);
        $stmt->execute();
        $stmt->close();
    } else {
        // Insertar nuevo registro para el año actual con número 1
        $numero_incremental = 1;
        $stmt = $mysqli->prepare("INSERT INTO $tabla (anio, numero_incremental) VALUES (?, ?)");
        $stmt->bind_param('ii', $anio_actual, $numero_incremental);
        $stmt->execute();
        $stmt->close();
    }

    // Formatear el número incremental con ceros a la izquierda (ejemplo: 001)
    $numero_formateado = str_pad($numero_incremental, 3, '0', STR_PAD_LEFT);

    // Obtener los dos últimos dígitos del año
    $anio_corto = substr($anio_actual, 2, 2);

    // Construir el número completo de remisión
    $numero_remision = sprintf("%s - %s-%s", $prefijo, $numero_formateado, $anio_corto);

    // Desbloquear la tabla
    $mysqli->query("UNLOCK TABLES");

    return [
        'numero_incremental' => $numero_incremental,
        'numero_remision' => $numero_remision,
        'anio' => $anio_actual,
        'prefijo' => $prefijo
    ];
}



?>
