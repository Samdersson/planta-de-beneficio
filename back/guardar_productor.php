<?php
include 'Conexion.php';

session_start(); // Asegúrate de que la sesión esté iniciada

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get POST data and sanitize
    $cedula = isset($_POST['cedula']) ? intval($_POST['cedula']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($conexion, $_POST['nombre']) : '';
    $predio = isset($_POST['predio']) ? mysqli_real_escape_string($conexion, $_POST['predio']) : '';
    $departamento = isset($_POST['departamento']) ? mysqli_real_escape_string($conexion, $_POST['departamento']) : '';
    $ciudad = isset($_POST['ciudad']) ? mysqli_real_escape_string($conexion, $_POST['ciudad']) : '';
    $cedula_usuario = isset($_SESSION['cedula']) ? $_SESSION['cedula'] : null; // Obtener la cédula del usuario de la sesión
    $isUpdate = isset($_POST['isUpdate']) ? intval($_POST['isUpdate']) : 0;

    // Basic validation
    if ($cedula <= 0 || empty($nombre) || empty($predio) || empty($departamento) || empty($ciudad)) {
       echo "<script>
      alert('todos los campos son obligatorios.');
      window.location.href = '../front/inicio.html';
      </script>";
        exit;
    }

    // Verificar que la cédula del usuario exista en la tabla usuario
    $checkUserQuery = "SELECT * FROM usuario WHERE cedula = ?";
    $stmtCheck = mysqli_prepare($conexion, $checkUserQuery);
    mysqli_stmt_bind_param($stmtCheck, "i", $cedula_usuario);
    mysqli_stmt_execute($stmtCheck);
    $resultCheck = mysqli_stmt_get_result($stmtCheck);

    if (mysqli_num_rows($resultCheck) === 0) {
        echo "<script>
      alert('Error: La cédula del usuario no existe en la tabla usuario.');
      window.location.href = '../front/inicio.html';
      </script>";
        exit();
    }
    if ($isUpdate === 1) {
        // Prepare update query
        $sql = "UPDATE productor SET Nombre = ?, predio = ?, departamento = ?, ciudad = ? WHERE cedula = ?";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "<script>alert('❌ Error en la preparación de la consulta: " . mysqli_error($conexion) . "');</script>";
            exit;
        }
        mysqli_stmt_bind_param($stmt, "ssssi", $nombre, $predio, $departamento, $ciudad, $cedula);

        if (mysqli_stmt_execute($stmt)) {
            echo "<script>alert('Productor actualizado con éxito.');</script>";
        } else {
            echo "<script>alert('❌ Error al actualizar el productor: " . mysqli_stmt_error($stmt) . "');</script>";
        }
    } else {
        // Prepare insert query
        $sql = "INSERT INTO productor (cedula, Nombre, predio, departamento, ciudad, cedula_usuario) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conexion, $sql);
        if ($stmt === false) {
            echo "<script>alert('❌ Error en la preparación de la consulta: " . mysqli_error($conexion) . "');</script>";
            exit;
        }
        mysqli_stmt_bind_param($stmt, "issssi", $cedula, $nombre, $predio, $departamento, $ciudad, $cedula_usuario);

        if (mysqli_stmt_execute($stmt)) {
            echo "<script>
      alert('productor creado con exito');
      window.location.href = '../front/crear_nuevo.html';
      </script>";
            exit();
        } else {
            echo "<script>alert('❌ Error al insertar el productor: " . mysqli_stmt_error($stmt) . "');</script>";
        }
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
} else {
    echo "<script>alert('❌ Método no permitido.');</script>";
}
?>
