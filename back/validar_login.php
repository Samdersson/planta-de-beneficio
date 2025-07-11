<?php
// Paso 1: Incluir la conexión a la base de datos
include 'Conexion.php';

// Paso 2: Recibir los datos enviados desde el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = trim($_POST['usuario']);
    $contrasena = trim($_POST['contrasena']);

    // Validar que los campos no estén vacíos
    if (empty($usuario) || empty($contrasena)) {
        die("Por favor, complete todos los campos.");
    }

    // Paso 3: Consultar la base de datos para verificar el usuario

    // Depuración: mostrar el usuario recibido
    // echo "Usuario recibido: " . $usuario;

    $sql = "SELECT * FROM usuarios WHERE nombre = '$usuario'";
    $resultado = mysqli_query($conexion, $sql);

    if (!$resultado) {
        die("Error en la consulta SQL: " . mysqli_error($conexion));
    }

    if (mysqli_num_rows($resultado) == 1) {
        $fila = mysqli_fetch_assoc($resultado);

        // Depuración: mostrar el usuario encontrado en la base de datos
        // echo "Usuario en DB: " . $fila['usuario'];

        // Paso 4: Verificar la contraseña (asumiendo que está almacenada en texto plano, ideal usar hash)
        if ($contrasena === $fila['contrasena']) {
            // Paso 5: Iniciar sesión y redirigir
            session_start();
            $_SESSION['usuario'] = $usuario;
            header("Location: ../front/principal.html");
            exit();
        } else {
            die("Contraseña incorrecta.");
        }
    } else {
        die("Usuario no encontrado.");
    }
} else {
    // Si no es método POST, redirigir al formulario de inicio
    header("Location: ../front/inicio.html");
    exit();
}
?>
