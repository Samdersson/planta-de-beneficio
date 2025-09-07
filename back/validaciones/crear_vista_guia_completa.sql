CREATE VIEW vista_guia_completa AS
SELECT 
    g.numero_guia,
    g.cantidad_animales,
    g.fecha_guia,
    g.cedula_productor,
    g.cedula_usuario AS cedula_usuario_guia,
    a.numero_animal,
    a.sexo,
    a.peso,
    a.numero_tiquete,
    a.fecha_guia AS fecha_guia_animal,
    a.fecha_sacrificio,
    a.numero_corral,
    a.especie,
    a.hora_caida,
    a.cedula_usuario AS cedula_usuario_animal,
    a.marca,
    d.producto,
    d.motivo,
    d.cantidad,
    d.cedula_veterinario,
    d.numero_animal AS numero_animal_decomiso,
    c.cedula AS cedula_cliente,
    c.marca AS marca_cliente,
    c.nombre AS nombre_cliente,
    c.destino AS destino_cliente,
    co.cedula AS cedula_conductor,
    co.nombre AS nombre_conductor,
    co.telefono AS telefono_conductor,
    de.nombre AS nombre_destino,
    de.direccion AS direccion_destino,
    de.ciudad AS ciudad_destino,
    de.departamento AS departamento_destino,
    p.cedula AS cedula_productor,
    p.nombre AS nombre_productor,
    p.predio AS predio_productor,
    p.ciudad AS ciudad_productor,
    p.departamento AS departamento_productor,
    vt.fecha_despacho,
    vt.observaciones,
    vt.placa_vehiculo,
    vt.cedula_cliente AS cedula_cliente_guia_transporte,
    pr.placa,
    pr.tipo,
    pr.refrigerado,
    pr.cedula_conductor AS cedula_conductor_vehiculo,
    pr.cedula_usuario AS cedula_usuario_vehiculo,
    v.nombre AS nombre_veterinario,
    u.nombre AS nombre_usuario
FROM guia_movilizacion g
LEFT JOIN animal a ON g.numero_guia = a.numero_guia
LEFT JOIN decomiso d ON a.numero_animal = d.numero_animal
LEFT JOIN cliente c ON g.cedula_productor = c.cedula
LEFT JOIN conductor co ON co.cedula = co.cedula
LEFT JOIN destino de ON c.cedula = de.cedula_cliente
LEFT JOIN productor p ON g.cedula_productor = p.cedula
LEFT JOIN guia_transporte vt ON vt.cedula_cliente = c.cedula
LEFT JOIN vehiculo pr ON vt.placa_vehiculo = pr.placa
LEFT JOIN veterinario v ON d.cedula_veterinario = v.cedula
LEFT JOIN usuario u ON g.cedula_usuario = u.cedula;
