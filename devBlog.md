# 15/04/23
- Comienza el desarrollo con electronjs

# 16/04/23
- [x] Obtener la mac(investigar segun plataforma y obtenerla segun ella con un if).
- [x] Pasarle la mac al metodo de la api para poder llamar al detalle segun la mac.
- [x] Se consulta a la api sin problemas.
- [x] resolucion de respuestas con la api.

# 18/05/23
- [x] Asignarse el número de totem.
- [x] Registrarse, si su mac no está registrada en el sistema (Dependiendo de la respuesta de registro, volverá a consultar o se asignará el número de totem).
- Se cumple el proceso también para windows(sin probar).

# 21/05/23
- Se agrega gran parte de manejo de errores, ahora al momento de tener errores de conexion se inicia el archivo **connectionError.html**, si hay errores en la consulta http por la mac
    También lanzará un error y abrirá el archivo **httpError.html**

# Ideas:
- Generar localmente un numero de caja especifico para detectar compras hechas en la caja designada para errores de conexión.
- Generar una tabla de incidencias con sqlite para estadisticas o generar un reporte y tener un observer de conexion que mande al backend ya registrado previamente en el momento de incidencia, el reporte donde quedarán almacenados.

# To do:
- Probar el sistema en windows.
- Crear una base de datos local con sqlite
- Consulte a la api con la mac propia y que localmente la guarde en sqlite
- Al consultar a la api, si los datos coinciden ok.
- Si los datos no coinciden, se actualizarán siguiendo los registros de la api.
- Si existe la posibilidad de que la pagina esta funcionando pero el bloque de local no
    generar una tabla de provisión que registrará la mac del totem y al numero autoasignado.
    - Si este evento se gatilla, se generará un registro en una tabla de errores para mantener la integridad de los datos y boletas generadas en ese lapsus de tiempo.