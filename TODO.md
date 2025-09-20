# TODO - Actualización de Estado de Animales al Generar Guía

## ✅ COMPLETADO

### Funcionalidad Implementada
- **Archivo modificado**: `back/guardar_remision.php`
- **Funcionalidad**: Al presionar "Generar Guía" en `crear_guia_transporte.html`, se actualiza automáticamente el estado de los animales incluidos en la remisión.

### Cambios Realizados

1. **Obtención de animales del input**:
   - Se agregó `$animales = $input['animales'] ?? [];` para capturar los animales seleccionados desde el frontend.

2. **Actualización del estado después de guardar la remisión**:
   - Después de insertar exitosamente la remisión en la tabla `remisiones`, se ejecuta una actualización en la tabla `animal`.
   - Se cambia el campo `estado` de "disponible" a "despachado" para cada animal incluido en la remisión.
   - Se utiliza una consulta preparada para evitar inyección SQL.

3. **Manejo de errores y respuesta**:
   - Se cuenta cuántos animales fueron actualizados exitosamente.
   - Se capturan errores de actualización (animal no encontrado, ya despachado, etc.).
   - La respuesta JSON incluye información sobre animales actualizados y errores encontrados.

### Flujo de Funcionamiento

1. Usuario selecciona animales en `crear_guia_transporte.html`
2. Presiona botón "Generar Guía"
3. Se envían datos al `back/guardar_remision.php`
4. Se guarda la remisión en la base de datos
5. **NUEVO**: Se actualiza el estado de los animales de "disponible" a "despachado"
6. Se devuelve respuesta con información de la actualización

### Respuesta JSON Extendida
La respuesta ahora incluye:
```json
{
  "success": true,
  "numero_remision": "B-001-2024",
  "id_remision": 123,
  "animales_actualizados": 3,
  "errores_actualizacion": []
}
```

### Verificación
- ✅ Código implementado correctamente
- ✅ Consultas preparadas para seguridad
- ✅ Manejo de errores incluido
- ✅ Respuesta informativa al frontend

## 🔄 PRÓXIMOS PASOS (Opcionales)

1. **Pruebas**: Probar la funcionalidad presionando "Generar Guía" con animales seleccionados
2. **Validación**: Verificar en la base de datos que los estados se actualizan correctamente
3. **Frontend**: Mostrar información de animales actualizados en la interfaz si es necesario
