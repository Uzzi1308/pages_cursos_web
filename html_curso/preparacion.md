

---

# ✅ **Planificación: Módulo 1 — Lección 3: Etiquetas de texto y encabezados**

## **1) Título de la lección**

**Etiquetas de texto y encabezados en HTML: estructura, jerarquía y uso correcto**

---

## **2) Objetivo de la lección**

Que el alumno aprenda a estructurar contenido mediante encabezados y etiquetas de texto, entendiendo su jerarquía, semántica y usos adecuados.

Al finalizar la lección, el estudiante será capaz de:

* Utilizar correctamente encabezados (`h1` a `h6`).
* Crear párrafos (`p`).
* Aplicar negritas, cursivas y otras etiquetas básicas de texto.
* Comprender la importancia semántica de la jerarquía de encabezados.
* Organizar contenido de forma clara y ordenada.

---

# ✅ **Contenido de la Lección**

---

## **3) Sección 1 — ¿Qué son las etiquetas de texto en HTML?**

Explicación clara:

* HTML define diferentes tipos de texto mediante etiquetas especializadas.
* No todo el texto es igual: hay títulos, subtítulos, párrafos, resaltes, citas, etc.
* Estas etiquetas permiten que el navegador, buscadores y lectores de pantalla entiendan el contenido de forma correcta.

Comparación sugerida:

* Son como los estilos de un documento de Word: Título grande, subtítulo más pequeño, texto normal... pero con intención semántica.

---

## **4) Sección 2 — Encabezados (`h1` a `h6`)**

Explicar:

* Representan la estructura jerárquica de un documento.
* `h1` es el título principal de la página (solo uno recomendado).
* `h2` a `h6` son subtítulos de diferentes niveles.
* Importancia para SEO y accesibilidad.

Ejemplo visual sugerido:

* Mostrar escalera: `h1` arriba → `h6` abajo.

Ejemplo de código con sistema Better Comments:

```html
<body>
    //* Encabezado principal (solo debe haber uno por página)
    <h1>Bienvenidos a mi sitio</h1>

    //* Subtítulo de segundo nivel
    <h2>Acerca de mí</h2>

    //* Subtítulo dentro de la sección anterior
    <h3>Mis pasatiempos</h3>
</body>
```

---

## **5) Sección 3 — Buenas prácticas con encabezados**

* Mantener la jerarquía correcta: no saltar de `h1` a `h4` sin razón.
* No usar encabezados para hacer texto grande (eso se hace con CSS).
* `h1` representa el tema principal del documento.
* Importancia para SEO: Google entiende la estructura del contenido.

---

## **6) Sección 4 — Etiquetas básicas de texto**

Aquí se presentan los tipos de texto más usados:

### **A) `<p>` — Párrafos**

* Elemento base para texto normal.
* Siempre que quieras un bloque de texto largo, se usa `<p>`.

```html
//* Párrafo de texto común
<p>Este es un ejemplo de un párrafo en HTML.</p>
```

### **B) `<b>` y `<strong>` — Negritas**

* `<b>` solo resalta visualmente.
* `<strong>` añade importancia semántica (Google lo toma en cuenta).

```html
<p>Este es un texto en <strong>negritas importantes</strong>.</p>
```

### **C) `<i>` y `<em>` — Cursivas**

* `<i>` = visual, sin semántica.
* `<em>` = énfasis real en el significado.

```html
<p>Este texto tiene <em>énfasis especial</em> para destacarlo.</p>
```

### **D) `<small>` — Texto pequeño**

```html
<small>Nota pequeña o aclaración legal.</small>
```

### **E) `<br>` — Saltos de línea**

* Se usa para saltos simples, no para separar párrafos completos.

---

## **7) Sección 5 — Combinando etiquetas para estructurar contenido**

Mini ejemplo que muestra cómo se organiza un artículo simple:

```html
<body>
    //* Título principal del artículo
    <h1>Guía para usar etiquetas de texto</h1>

    //* Sección introductoria
    <h2>Introducción</h2>
    <p>Las etiquetas de texto permiten organizar el contenido de manera clara.</p>

    //* Sección secundaria
    <h2>Tipos de texto</h2>
    <p>Puedes usar <strong>negritas</strong>, <em>cursivas</em> o texto más <small>pequeño</small>.</p>

    //* Evitar múltiples saltos de línea, usar <br> solo cuando sea necesario
    <p>Texto con salto lineal<br>en esta parte.</p>
</body>
```

---

## **8) Sección 6 — Errores comunes que se deben evitar**

* Usar `<br>` repetidos para separar bloques (mala práctica).
* Tener varios `<h1>` sin razón.
* Usar encabezados solo por apariencia (CSS se explicará después).
* Mezclar niveles de encabezados sin orden lógico.

---

## **9) Sección 7 — Actividad práctica de la lección**

### **Actividad: Estructurar un mini artículo personal**

En el archivo `mi-biografia.html`:

1. Crear un `<h1>` con tu nombre.
2. Agregar una sección “Sobre mí” con `<h2>`.
3. Añadir un párrafo explicando quién eres.
4. Crear una sección “Mis hobbies” con `<h2>`.
5. Listar tus hobbies usando `<p>` o subtítulos `<h3>`.
6. Aplicar `<strong>`, `<em>` y `<small>` en partes clave.
7. Comentar cada sección con tu sistema:

```html
//* Sección de hobbies
```

Objetivo: aprender jerarquía + orden + semántica.

---

## **10) Resumen final de la lección**

Breve recordatorio:

* Los encabezados ordenan el contenido y crean jerarquía.
* Los párrafos se usan para texto estructurado.
* Algunas etiquetas cambian el significado del texto, no solo su apariencia.
* Una buena organización ayuda a que usuarios y buscadores entiendan la página.

---

