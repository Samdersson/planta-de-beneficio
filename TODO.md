# TODO: Implementar Reportes con Chart.js

## Información Recopilada
- Base de datos: tablas decomiso, animal, guia_movilizacion, productor, cliente.
- Relaciones: decomiso -> animal (numero_animal) -> guia_movilizacion (numero_guia) -> productor (cedula_productor); animal -> cliente (marca).
- Frontend: Reportes.html como menú, decomisos.html existente.

## Plan General
- Crear 5 scripts PHP en back/ para consultas de datos.
- Crear 5 páginas HTML en front/ para cada reporte, con Chart.js.
- Modificar Reportes.html para añadir botones a cada reporte.
- Crear scripts JS en front/Script/ para fetch y renderizado.

## Pasos Detallados
1. Crear back/listar_decomisos_por_productor.php: Consulta para decomisos agrupados por productor.
2. Crear back/listar_animales_por_fecha.php: Animales por fecha, con filtros.
3. Crear back/listar_clientes_top.php: Clientes con más ingresos.
4. Crear back/listar_animales_por_productor_tipo.php: Animales por productor y tipo.
5. Crear back/listar_decomisos_por_mes.php: Decomisos por mes.
6. Crear front/reporte_decomisos_productor.html: Página con tabla y gráfico de barras.
7. Crear front/reporte_animales_fecha.html: Página con gráfico de líneas y filtros.
8. Crear front/reporte_clientes_top.html: Página con gráfico de pastel.
9. Crear front/reporte_animales_productor_tipo.html: Página con gráfico de barras agrupadas.
10. Crear front/reporte_decomisos_mes.html: Página con gráfico de líneas.
11. Crear front/Script/reporte_decomisos_productor.js: JS para fetch y Chart.js.
12. Crear front/Script/reporte_animales_fecha.js: JS con filtros.
13. Crear front/Script/reporte_clientes_top.js: JS para gráfico.
14. Crear front/Script/reporte_animales_productor_tipo.js: JS para gráfico.
15. Crear front/Script/reporte_decomisos_mes.js: JS para gráfico.
16. Modificar front/Reportes.html: Añadir botones para cada reporte.
17. Probar cada reporte ejecutando en local.

## Seguimiento
- [ ] Paso 1
- [ ] Paso 2
- etc.
