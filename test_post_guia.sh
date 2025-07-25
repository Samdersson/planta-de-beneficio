#!/bin/bash

# Script para probar la inserción en guardar_guia.php usando curl

curl -X POST http://localhost/planta_de_beneficio/back/guardar_guia.php \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "cedula=1234567890&nombre=Usuario%20de%20Prueba&guia=12345-6789&cantidad=10&fecha=2025-07-20"
