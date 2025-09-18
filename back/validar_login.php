<?php
session_start();
include ('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = mysqli_real_escape_string($conexion, $_POST['usuario']);
    $password = mysqli_real_escape_string($conexion, $_POST['password']);

    // Usar consulta preparada para mayor seguridad
    $query = "SELECT cedula, nombre, contraseña, rol, estado FROM usuario WHERE cedula = ? OR nombre = ? OR correo_electronico = ? LIMIT 1";
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "sss", $usuario, $usuario, $usuario);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result && mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        
        // Verificar estado del usuario
        if ($row['estado'] == 0) {
            header("Location: ../front/inicio.html?error=usuario_inactivo");
            exit();
        }

        // Verificar contraseña
        if ($row['contraseña'] === $password) {
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['cedula'] = $row['cedula'];
            $_SESSION['rol'] = $row['rol'];
            header("Location: ../front/principal.html");
            exit();
        } else {
            echo "<script>
            alert('Usuario  y/o contraseña incorrecta.');
            window.location.href = '../front/inicio.html';
            </script>";
            
            
            
            
            exit();
        }
    } else {
    echo "<script>
      alert('Usuario  o contraseña incorrecta.');
      window.location.href = '../front/inicio.html';
      </script>";
        exit();
    }
} else {
    echo "Método no permitido";
}
?>
