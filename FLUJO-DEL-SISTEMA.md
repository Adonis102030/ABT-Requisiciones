# Memoria de Flujos del Sistema ABT Requisiciones

Este documento describe cómo funciona cada flujo del sistema, en qué orden se ejecutan las acciones y qué decisiones toma la aplicación para validar, transformar y exportar la información.

---

## 1. Visión general

La aplicación tiene tres pantallas principales:

1. Procesar Requisiciones
2. Tarifarios
3. Ajustes

La lógica principal se mueve en base a estos datos persistidos en localStorage:

- tarifarios
- mapeo de camión a categoría
- mapeo de paraje a zona
- próximo folio

La app no usa backend ni base de datos. Todo el proceso se mantiene en el navegador y se reutiliza entre sesiones.

---

## 2. Flujo principal: cargar viajes y preparar requisiciones

### 2.1. Inicio

Cuando el usuario abre la app:

- Se inicializan los tarifarios desde localStorage o desde valores por defecto.
- Se cargan los mapeos de camión a categoría.
- Se cargan los mapeos aprendidos de paraje a zona.
- Se lee el próximo folio a usar.
- Se renderizan las tablas de tarifarios y los ajustes iniciales.

### 2.2. Cargar Excel de viajes

El usuario entra a la pestaña Procesar Requisiciones y selecciona el archivo Excel del control de viajes.

La app realiza esta secuencia:

- Lee el archivo con SheetJS.
- Recorre cada hoja del workbook.
- Busca la fila donde aparece la columna con encabezado Fecha.
- A partir de esa fila, toma las filas con fecha válida.
- Descarta filas vacías, resúmenes y totales sin fecha.
- Guarda cada registro como un viaje con estos campos:
  - fecha
  - zonaExcel
  - paraje
  - camion
  - qqs
  - cantCl
  - contratista
  - chofer
  - precio
  - sheet

Si se cargó correctamente, la app deja disponible la sección de rangos de fecha y activa la posibilidad de buscar viajes por periodo.

### 2.3. Buscar por fechas

Cuando el usuario define una fecha inicial y opcionalmente una fecha final:

- Se convierten los valores del formulario en objetos Date.
- Se valida que la fecha final no sea menor que la fecha inicial.
- Se filtran los viajes cargados con inDateRange.
- Si no existen resultados: mostrar error y ocultar la tabla de trabajo.
- Si existen: construir las filas de trabajo para revisión.

---

## 3. Flujo de revisión de cada fila

### 3.1. Construcción de filas de trabajo

Cada viaje filtrado pasa a una fila de trabajo con estos campos adicionales:

- categoria
- zonaTarifario
- aplica
- descargas
- transportista
- destino

La categoría se determina así:

- busca el tipo de camión en el mapeo camionMap
- si existe, usa esa categoría
- si no existe, deja la fila sin categoría

La zona tarifario se resuelve de la siguiente manera:

1. Se verifica si ya existe un mapeo aprendido para ese paraje y esa categoría.
2. Si no, busca una zona exacta con el mismo nombre del paraje.
3. Si no, intenta coincidencias por tokens, tomando nombres parecidos o separando por /.
4. Si aún no encuentra nada, la fila queda sin zona asignada y se marca con error.

### 3.2. Estado visual de cada fila

La fila puede entrar en dos estados:

- correcta: tiene categoría y zona tarifaria
- incompleta: falta categoría o falta zona

Si la fila está incompleta, aparece resaltada como error y no puede generar requisición.

### 3.3. Ajustes manuales sobre la fila

El usuario puede:

- cambiar la categoría del viaje,
- elegir otra zona del tarifario,
- marcar o desmarcar si aplica +5%,
- editar transportista,
- editar destino,
- agregar descargas con monto y descripción.

Cuando el usuario cambia la zona manualmente:

- se actualiza la fila,
- se guarda la relación Paraje → Zona en zonaMap,
- se actualiza la vista del mapeo aprendido.

### 3.4. Acciones masivas

En la parte superior de la tabla existe una acción masiva para:

- aplicar +5% a toda la selección,
- desactivar +5% en todas las filas.

Esto permite ahorrar tiempo cuando la mayoría de los viajes siguen la misma regla.

---

## 4. Flujo de cálculo tarifario

### 4.1. Identificación de la tarifa base

La app busca la zona tarifario dentro de la categoría elegida, y toma la fila correspondiente en la tabla tarifaria.

La estructura esperada es:

- zona
- menos5
- tarifa
- mas5

Luego:

- si aplica +5%, usa el valor de la columna mas5
- si no aplica, usa el valor de la columna menos5

### 4.2. Cálculo del neto

El total neto de la requisición se calcula así:

- tarifa aplicada menos la suma de descargas

Es decir:

- total neto = tarifa efectiva - descargas

La tarifa efectiva viene del valor seleccionado según +5% o -5%.

### 4.3. Descargas

La descarga funciona como ajuste adicional del documento. Cada descarga incluye:

- monto
- descripción

Se puede agregar más de una por requisición, y se suma automáticamente para mostrar el total de descargas y afectar el monto final neto.

---

## 5. Flujo de tarifarios

### 5.1. Mapeo de camión a categoría

En la pestaña Tarifarios se define el tipo de camión que corresponde a cada categoría. Esto hace que cada viaje pueda ser clasificado automáticamente.

El mapeo se guarda localmente y puede editarse manualmente en la tabla.

### 5.2. Editar tabla tarifaria

Cada categoría tiene su propia tabla.

El usuario puede:

- editar zona,
- editar -5%,
- editar tarifa,
- editar +5%,
- borrar filas,
- agregar filas nuevas.

Todo cambia en tiempo real y se persiste en localStorage.

### 5.3. Importar archivo Excel

Cuando se sube un Excel:

- se lee la hoja principal,
- se detecta la fila con encabezados de zona y tarifa,
- se transforma en filas de formato [zona, menos5, tarifa, mas5],
- se reemplaza la tabla completa de esa categoría,
- se guarda la nueva configuración.

### 5.4. Importar PDF o imagen

Cuando se sube un PDF o imagen:

- se extraen líneas de texto con pdf.js o con OCR por Tesseract
- se convierten líneas a zonas y valores numéricos
- se presentan en una modal de revisión
- el usuario puede corregir o eliminar filas
- al confirmar, se actualizan zonas existentes o se agregan nuevas

La regla clave es evitar duplicados y reemplazar solo lo necesario.

### 5.5. Si no hay coincidencia

Si la app no detecta una zona válida, muestra un aviso y no aplica cambios.

Esto evita que una importación incompleta destruye la tabla existente sin control.

---

## 6. Flujo de mapeo Paraje → Zona aprendido

La aplicación intenta recordar las decisiones humanas para ahorrar trabajo.

Cuando el usuario elige una zona manualmente:

- se normaliza el nombre del paraje,
- se guarda la relación en zonaMap,
- se reutiliza en la próxima vez que aparezca ese paraje.

Esto ocurre por categoría, porque el mismo paraje puede tener significado distinto según el tipo de tarifa.

La vista Ajustes permite:

- consultar los mapeos aprendidos,
- borrar registros individuales,
- limpiar todo el mapeo si se desea.

---

## 7. Flujo de generación de requisiciones

### 7.1. Validación final

Antes de generar requisiciones, la app verifica:

- que existan filas de trabajo,
- que cada fila tenga categoría asignada,
- que cada fila tenga zona tarifaria asignada,
- que no haya datos inválidos.

Si alguna fila no cumple, se bloquea la generación y se informa al usuario.

### 7.2. Confirmación

La app muestra un mensaje de confirmación con el rango de folios que se va a utilizar.

Ejemplo:

- se van a generar 15 requisiciones,
- folios desde 104 hasta 118.

Esto ayuda a evitar errores de numeración.

### 7.3. Creación de requerimientos

Por cada fila valida:

- toma la tarifa base de la zona seleccionada,
- identifica si aplica +5% o -5%,
- calcula el total neto restando descargas,
- guarda transportista, camion, destino, contrato, chofer y observación,
- asigna folio consecutivo.

El sistema luego actualiza:

- el próximo folio disponible,
- la lista de requisiciones generadas,
- la vista previa visual.

### 7.4. Resumen final

La vista previa muestra:

- suma de tarifas (monto final),
- suma de total neto,
- diferencia entre ambos,
- cantidad total de requisiciones.

Esto permite revisar la operación global antes de exportar.

---

## 8. Flujo de exportación

### 8.1. Exportación a PDF

Cuando el usuario presiona Descargar PDF (Listado Completo):

- toma todas las requisiciones generadas,
- arma una grilla de tarjetas en la página PDF,
- dibuja cada requisición en formato compacto,
- agrega un resumen final con totales.

La idea es que el PDF se parezca al formulario de papel de la empresa y que el listado completo quede listo para entregar o archivar.

### 8.2. Exportación a Excel

Cuando el usuario presiona Descargar Excel:

- arma un arreglo con todos los campos relevantes,
- agrega filas con resumen final de costo,
- genera un workbook con la hoja Requisiciones,
- guarda el archivo con el nombre basado en la fecha de las requisiciones.

---

## 9. Flujo de folios y persistencia

### 9.1. Folio

La numeración se maneja desde Ajustes.

El usuario puede modificar el valor del próximo folio. Esto se guarda en localStorage para que el sistema no vuelva a empezar desde 1.

### 9.2. Persistencia

La app guarda automáticamente:

- tarifarios
- categorías por camión
- mapeos de paraje a zona
- próximo folio

Esto permite continuar la operación en otra sesión o al cerrar y abrir el navegador.

---

## 10. Regla de negocio resumida

El sistema se comporta como una herramienta para convertir viajes de transporte en requisiciones validadas mediante esta lógica:

- cada viaje se clasifica por tipo de camión,
- cada viaje se asigna a una zona tarifaria,
- cada zona tiene su tarifa en tres variantes,
- la selección +5% o -5% afecta el valor final,
- las descargas reducen el total neto,
- cada requisición usa un folio consecutivo,
- la operación solo se completa si toda la fila es válida,
- los datos exportados deben reflejar el estado final revisado por el usuario.

---

## 11. Orden recomendado de trabajo real

Para operar la herramienta de forma estable, el flujo ideal es:

1. Cargar Excel de viajes.
2. Revisar fechas y seleccionar el periodo.
3. Confirmar categorías y zonas.
4. Ajustar +5% o -5% por fila.
5. Registrar descargas.
6. Validar que no haya filas incompletas.
7. Generar requisiciones.
8. Revisar resumen y vista previa.
9. Exportar PDF o Excel.
10. Mantener tarifarios y mapeos actualizados.

---

## 12. Conclusión

La aplicación funciona como un flujo de revisión y control operativo, no solo como una calculadora. Su valor real está en que cada viaje queda validado, categorizado, tarifado y documentado antes de convertirse en una requisición oficial.

La “memoria” del sistema está en los mapeos aprendidos, los tarifarios persistidos y la secuencia de folios, que permiten mantener continuidad operativa y consistencia de negocio.
