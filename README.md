# ABT Requisiciones

Aplicación web para gestionar requisiciones de transporte externo, cargar viajes rentados, asociar cada viaje con un tarifario, revisar ajustes manuales y generar requisiciones con folios consecutivos y exportación a PDF/Excel.

El sistema está pensado para operar como una herramienta de oficina, sin backend ni base de datos local externa: guarda la configuración y los datos relevantes en localStorage del navegador.

## 1. Objetivo del proyecto

La aplicación permite:

- Cargar el archivo Excel de "Control de Viajes Rentados".
- Filtrar viajes por rango de fechas.
- Asignar cada viaje a una categoría de tarifario y a una zona del tarifario.
- Determinar si aplica el +5% o no aplica (-5%).
- Registrar descargas adicionales con monto y descripción.
- Generar requisiciones con folio correlativo.
- Exportar el listado completo a PDF o Excel.
- Mantener tablas de tarifarios, mapeo de camiones y mapeo de parajes a zonas aprendidos por la aplicación.

---

## 2. Funcionalidades principales

### 2.1. Carga de viajes

En la pestaña "Procesar Requisiciones" se puede cargar un archivo Excel del control de viajes.

La app:

- Lee todas las hojas del archivo Excel.
- Busca la fila con encabezado que contiene "FECHA".
- Recoge registros a partir de esa fila.
- Ignora filas sin fecha válida, resúmenes o totales.
- Guarda los viajes cargados en memoria para su revisión posterior.

Los datos esperados por fila son, en esencia:

- Fecha
- Zona Excel
- Paraje
- Camión
- QQS
- Cantidad de Carga/Cl
- Contratista
- Chofer
- Precio

### 2.2. Búsqueda por fecha

Después de cargar el archivo:

- El usuario selecciona una fecha de inicio y, opcionalmente, una fecha final.
- La app filtra los viajes entre ese rango.
- Si no existen viajes en ese rango, muestra un error y oculta la tabla de trabajo.
- Si existen, presenta la tabla editable para revisión.

### 2.3. Tabla de revisión de filas

La tabla de datos muestra cada viaje con:

- Fecha
- Zona del Excel
- Paraje
- Camión
- QQS
- Cantidad de carga
- Contratista
- Chofer
- Categoría
- Zona tarifario
- Tarifa RD$
- Aplicación de +5%
- Descarga RD$
- Transportista
- Destino

Cada fila puede editarse en el momento de revisión.

### 2.4. Mapeo de camión a categoría

En la pestaña "Tarifarios" se define además el mapeo:

- Tipo de camión → categoría de tarifario

Ejemplo de mapeo base:

- PATANA → Fletes de Patanas
- MACK → Camiones Medianos
- DAIHATSU → Camiones Pequeños

Esto permite que cada viaje adopte la categoría tarifaria correcta según el tipo de camión indicado en el Excel.

### 2.5. Tarifarios por categoría

El sistema maneja estas categorías:

- Camiones Pequeños
- Camiones Medianos
- Fletes de Patanas

Cada categoría contiene una tabla con filas de la forma:

- Zona
- -5%
- Tarifa
- +5%

Las columnas representan:

- Zona del tarifario
- Tarifa aplicando -5%
- Tarifa base
- Tarifa aplicando +5%

### 2.6. Carga de tarifarios desde Excel, PDF o imagen

En cada categoría es posible cargar una actualización:

- Excel (.xlsx/.xls): reemplaza por completo la tabla de la categoría.
- PDF o imagen (.pdf/.png/.jpg/.jpeg/.webp): reconoce zonas y tarifas y muestra una revisión antes de aplicar.

Reglas de importación:

- En Excel, se reemplaza la tabla entera.
- En PDF o imagen, se detectan zonas nuevas o existentes.
- Las zonas ya existentes se sobrescriben.
- Las zonas nuevas se agregan.
- No se duplican zonas.
- El usuario puede revisar y corregir cada fila antes de confirmar.

### 2.7. Mapeo Paraje → Zona aprendido

Cuando la app no encuentra una coincidencia exacta entre el paraje del viaje y una zona del tarifario, ofrece la posibilidad de elegir la zona manualmente.

Si el usuario selecciona una zona, la aplicación guarda esa relación:

- categoría
- paraje normalizado
- zona tarifario

Esto permite que la próxima vez el mismo paraje se asocie automáticamente con la misma zona.

### 2.8. Asignación de +5%

La base de la regla operativa es:

- Si la fila tiene "aplica +5%" activo, se usa la tarifa +5%.
- Si está desactivado, se usa la tarifa -5%.

Esto influye directamente en el total neto y en la observación final de la requisición.

### 2.9. Descargas

Cada requisición puede tener múltiples descargas. Cada descarga incluye:

- monto
- descripción

La app:

- suma todos los montos de descargas,
- los muestra en la vista de revisión,
- los incluye en el total neto final,
- los exporta en PDF y Excel.

### 2.10. Generación de requisiciones

Al presionar "Generar Requisiciones":

- Se valida que todas las filas tengan categoría y zona tarifaria asignadas.
- Si alguna fila queda incompleta, la generación se bloquea.
- Se solicita confirmación con el rango de folios a emitir.
- Se asigna folio consecutivo por cada requisición.
- Se guardan las requisiciones generadas en memoria.
- El siguiente folio queda actualizado automáticamente.

### 2.11. Vista previa de requisiciones

La app genera una tarjeta visual por requisición que replica el formato de papel, mostrando:

- folio
- fecha
- transportista
- tipo de camión
- destino
- tarifa RD$
- descargas
- total neto
- QQs
- observación

También incluye un resumen de:

- suma de tarifas (monto final)
- suma de total neto
- diferencia
- cantidad de requisiciones

### 2.12. Exportación

#### PDF

- Exporta el conjunto completo de requisiciones en formato PDF.
- Genera un bloque de requisiciones por página en formato compacto.
- Agrega un listado final con resumen.

#### Excel

- Exporta el listado completo como archivo Excel.
- Incluye columnas como:
  - Folio
  - Fecha
  - Transportista
  - Contratista
  - Chofer
  - Tipo de Camión
  - Destino
  - QQs
  - Categoría
  - Zona Tarifario
  - Tarifa RD$
  - Aplicación
  - Descarga RD$
  - Detalle de descargas
  - Total Neto RD$
  - Observación

---

## 3. Regla de negocio implementada

Estas son las reglas de negocio que se reflejan en la lógica del proyecto:

### 3.1. Categorización de camiones

Cada tipo de camión debe estar asociado a una categoría de tarifario para poder calcular la tarifa correspondiente.

- Si no hay categoría, la fila queda marcada como incompleta.
- Si no hay zona tarifario asociada, la fila queda en estado de error.
- No se permite generar requisiciones con filas incompletas.

### 3.2. Asociación del paraje con la zona

La zona se resuelve en este orden:

1. Mapeo aprendido previamente en la memoria.
2. Coincidencia exacta del paraje con la zona.
3. Coincidencia por token (por ejemplo, zona con denominación similar o separada por "/").
4. Selección manual del usuario si no hubo coincidencia automática.

Si el usuario confirma una zona manual, esa relación queda aprendida y se reutiliza después.

### 3.3. Tarifas por categoría y zona

Cada zona dentro del tarifario tiene una tarifa base y dos variantes:

- -5%
- tarifa normal
- +5%

La app asume que el cálculo del monto final usa la tarifa que corresponde a la elección de la fila:

- tarifa +5% cuando aplica
- tarifa -5% cuando no aplica

### 3.4. Descargas como deducción del neto

La descarga es un ajuste adicional al monto final:

- El total neto se calcula restando las descargas a la tarifa aplicada.
- El monto de descargas se suma y se muestra por separado.
- La decisión de aplicar o no descargas no invalida el registro; solo afecta al total neto.

### 3.5. Consecutividad de folios

La numeración de folios debe ser consecutiva.

- El sistema guarda el próximo folio disponible.
- Cada requisición generada consume ese folio.
- El siguiente folio se actualiza inmediatamente.
- La numeración se mantiene en localStorage del navegador.

### 3.6. Validación antes de generar

No se pueden generar requisiciones si:

- no hay filas cargadas,
- la fila no tiene categoría asignada,
- la fila no tiene zona tarifario asignada,
- el rango de fechas es inválido,
- no hay viajes en el rango seleccionado.

### 3.7. Persistencia local

La configuración se guarda automáticamente en localStorage:

- tarifarios
- mapeo de camiones
- mapeo de zonas aprendidas
- próximo folio

Esto permite que el usuario retome el trabajo sin perder sus ajustes.

### 3.8. Importación segura de tarifarios

Cuando se importa documentación externa:

- los archivos Excel reemplazan la tabla completa,
- los PDFs o imágenes no reemplazan de forma ciega,
- solo se actualizan o agregan zonas detectadas,
- el usuario tiene la última palabra antes de aplicar los cambios.

Esto ayuda a evitar errores masivos y mantiene el control de calidad del tarifario.

---

## 4. Flujo recomendado de uso

1. Entrar a la pestaña "Procesar Requisiciones".
2. Cargar el Excel de viajes de la fecha o del mes.
3. Elegir el rango de fechas para revisar los viajes.
4. Revisar cada fila y corregir:
   - categoría,
   - zona tarifario,
   - si aplica +5%,
   - transportista,
   - destino,
   - descargas.
5. Confirmar que cada viaje tiene un tarifario válido.
6. Generar requisiciones.
7. Revisar la vista previa.
8. Descargar PDF o Excel del listado completo.
9. Retomar la configuración de tarifarios en la pestaña "Tarifarios" cuando sea necesario.

---

## 5. Estructura del proyecto

- app.js: lógica principal, validaciones, renderización, generación y exportación.
- index.html: estructura de pestañas, formularios y paneles.
- style.css: estilos visuales de la aplicación.
- tess/: archivos locales para OCR de imágenes y manejo del motor Tesseract.

---

## 6. Consideraciones técnicas

- Es una aplicación de frontend puro.
- Requiere un navegador moderno con soporte para JavaScript.
- Usa librerías cargadas desde CDN para:
  - Excel: SheetJS
  - PDF: jsPDF + autoTable + pdf.js
  - OCR: Tesseract.js
- El OCR local usa archivos dentro de la carpeta tess para evitar dependencia de CDNs externos.

---

## 7. Resultado esperado

La aplicación debe comportarse como una herramienta de generación de requisiciones con:

- carga inteligente de datos,
- mapeo tarifario automatizado,
- control manual de excepciones,
- validación de datos antes de la emisión,
- generación de númeración consecutiva,
- exportación en formatos reales de negocio,
- persistencia local para continuidad operativa.

Este comportamiento refleja la regla de negocio del proceso de requisiciones: cada viaje debe quedar correctamente categorizado, tarifado y documentado antes de ser emitido oficialmente.
