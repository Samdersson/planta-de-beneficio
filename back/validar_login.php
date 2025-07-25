<?php
session_start();
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = mysqli_real_escape_string($conexion, $_POST['usuario']);
    $password = mysqli_real_escape_string($conexion, $_POST['password']);

    $query = "SELECT * FROM usuarios WHERE nombre = '$nombre' LIMIT 1";
    $result = mysqli_query($conexion, $query);

    if ($result && mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        // Verificar contraseña (asumiendo que está almacenada en texto plano, se recomienda usar hash)
        if ($row['contrasena'] === $password) {
            $_SESSION['usuario'] = $nombre;
            header("Location: ../front/principal.html");
            exit();
        } else {
            header("Location: ../front/inicio.html?error=1");
            exit();
        }
    } else {
        header("Location: ../front/inicio.html?error=1");
        exit();
    }
} else {
    echo "Método no permitido";
}
?>
