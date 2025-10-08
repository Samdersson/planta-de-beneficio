<?php
session_start();
include 'conexion.php';

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
            echo "<script>
            alert('Usuario inactivo. Contacte al administrador.');
            window.location.href = '../front/inicio.html';
            </script>";
            
            exit();
        }

        // Verificar contraseña
        if ($row['contraseña'] === $password) {
            // Generar token JWT simple
            $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
            $payload = json_encode([
                'user_id' => $row['cedula'],
                'role' => $row['rol'],
                'name' => $row['nombre'],
                'exp' => time() + (60 * 60) // 1 hora de expiración
            ]);

            $token = base64_encode($header) . "." . base64_encode($payload) . "." . base64_encode(hash_hmac('sha256', $header . "." . $payload, 'tu_clave_secreta_123'));

            // Guardar datos en sesión
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['cedula'] = $row['cedula'];
            $_SESSION['rol'] = $row['rol'];
            $_SESSION['token'] = $token;

            // Redirigir con el token
            if ($row['rol'] == 'veterinario') {
                header("Location: ../front/veterinario.html?token=" . $token);
            } elseif ($row['rol'] == 'facturacion') {
                header("Location: ../front/facturacion.html?token=" . $token);
            } elseif ($row['rol'] == 'administrador') {
                header("Location: ../front/administrador.html?token=" . $token);
            }
            else {
                header("Location: ../front/principal.html?token=" . $token);
            } 
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
