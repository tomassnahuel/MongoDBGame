# AGENTS.md — MongoDB Quest

## 1. Rol y objetivo

Actuá como un desarrollador frontend senior especializado en React, diseño de videojuegos web, UX/UI y aprendizaje interactivo.

El proyecto consiste en desarrollar un RPG educativo breve, amigable e intuitivo para que un nuevo integrante de un equipo de desarrollo aprenda los fundamentos de MongoDB y Mongoose jugando.

La prioridad es construir una experiencia educativa coherente y divertida, no un cuestionario convencional ni un juego complejo.

Antes de implementar funcionalidades, revisá la estructura existente, las instrucciones del repositorio y las skills disponibles. Reutilizá el trabajo existente y evitá reescribir componentes sin necesidad.

## 2. Stack tecnológico y restricciones

Stack obligatorio:

- React.
- Vite.
- JavaScript.
- HTML5.
- CSS3.

Restricciones:

- Desarrollo exclusivamente frontend.
- No implementar backend, servidores propios ni API.
- No conectar el juego a una base de datos real.
- No instalar MongoDB ni Mongoose como dependencias de la aplicación.
- No implementar autenticación, registro de usuarios ni funcionalidades ajenas al objetivo educativo.
- Utilizar datos locales para los ejemplos, desafíos y simulaciones.
- Utilizar `localStorage` únicamente si resulta útil para conservar el progreso.
- Evitar dependencias, abstracciones y arquitecturas innecesariamente complejas.

MongoDB y Mongoose son los contenidos que se enseñan, no tecnologías que deban integrarse funcionalmente en el juego.

## 3. Documentación y fuentes técnicas

La documentación oficial de MongoDB es la fuente de referencia obligatoria para todo contenido relacionado con MongoDB y Mongoose.

Fuentes principales:

- MongoDB Manual: https://www.mongodb.com/docs/manual/
- MongoDB CRUD Operations: https://www.mongodb.com/docs/manual/crud/
- MongoDB Query Documents: https://www.mongodb.com/docs/manual/tutorial/query-documents/
- MongoDB Data Modeling: https://www.mongodb.com/docs/manual/data-modeling/
- Mongoose Documentation: https://mongoosejs.com/docs/
- Mongoose Schemas: https://mongoosejs.com/docs/guide.html
- Mongoose Models: https://mongoosejs.com/docs/models.html
- Mongoose Validation: https://mongoosejs.com/docs/validation.html

Reglas para consultar la documentación:

1. Consultá la documentación oficial antes de diseñar o modificar contenido técnico.
2. Utilizá las páginas específicas correspondientes al concepto que se enseña.
3. Verificá que los ejemplos y las operaciones sean correctos y compatibles con la versión documentada.
4. No inventes métodos, propiedades, comportamientos ni reglas.
5. Diferenciá las características propias de MongoDB de las que aporta Mongoose.
6. No presentes como restricciones universales de MongoDB las validaciones que dependen de un esquema de Mongoose.
7. Si una característica cambia según la versión, utilizá documentación correspondiente a una versión identificada o explicá la diferencia cuando sea relevante.
8. Si no podés verificar una afirmación técnica, no la presentes como un hecho confirmado.

Siempre que sea posible, asociá los módulos educativos con enlaces a la documentación oficial pertinente. Los enlaces deben ser útiles para ampliar conocimientos, sin interrumpir el ritmo del juego.

No es necesario mostrar citas técnicas extensas dentro de la aventura. La precisión debe reflejarse en el contenido, los ejemplos y las explicaciones.

## 4. Principios pedagógicos

El diseño debe aplicar los siguientes principios:

- Aprendizaje progresivo, desde los conceptos básicos hasta su aplicación.
- Aprendizaje activo mediante decisiones, exploración y resolución de problemas.
- Recuperación activa: permitir que el jugador intente resolver un desafío antes de mostrar la solución.
- Feedback inmediato, explicando por qué una respuesta es correcta o incorrecta.
- Aprendizaje sin castigos frustrantes: los errores deben ser oportunidades para comprender.
- Ejemplos concretos y consistentes a lo largo de toda la experiencia.
- Refuerzo de los conceptos importantes mediante su aplicación en distintas situaciones.
- Explicaciones breves, lenguaje claro y terminología técnica correctamente utilizada.

No exigir conocimientos previos. Introducir cada término técnico con una explicación sencilla y un ejemplo.

Evitar textos extensos, memorización mecánica y preguntas de relleno.

## 5. Diseño del RPG

La aplicación debe sentirse como una pequeña aventura interactiva, no como una plataforma de cursos convencional.

Se pueden utilizar:

- Exploración de zonas.
- Personajes no jugables (NPC).
- Diálogos y decisiones.
- Misiones principales y desafíos secundarios breves.
- Objetos y recompensas simbólicas.
- Experiencia y progresión.
- Desbloqueo de nuevas zonas.
- Desafíos finales que integren lo aprendido.

Cada mecánica debe contribuir a la experiencia o al aprendizaje. No agregar sistemas complejos únicamente para hacer que el juego parezca más grande.

Mantener un alcance reducido, con una duración orientativa de entre 5 y 10 minutos por recorrido.

El jugador debe poder completar la aventura aunque cometa errores.

## 6. Contenidos educativos

Organizar el aprendizaje de forma progresiva. Adaptar la cantidad de niveles al alcance real del proyecto.

### Fundamentos de MongoDB

Enseñar:

- Qué es MongoDB y cómo funciona una base de datos documental.
- Bases de datos, colecciones y documentos.
- Estructura de los documentos y relación con JSON y BSON.
- Operaciones CRUD.
- Consultas y filtros básicos.
- Modificación y eliminación de documentos.

Utilizar ejemplos pequeños y coherentes con la documentación oficial.

### Fundamentos de Mongoose

Enseñar:

- Qué es Mongoose y para qué se utiliza desde Node.js.
- Diferencia entre MongoDB y Mongoose.
- Esquemas (`Schema`).
- Modelos (`Model`).
- Creación y consulta de documentos.
- Validaciones y sus limitaciones.
- Relación entre los esquemas, los modelos y los documentos.

No presentar Mongoose como un reemplazo de MongoDB. Explicar que es una biblioteca ODM que facilita el trabajo con documentos mediante esquemas, modelos y otras abstracciones.

### Aplicación práctica

Utilizar un único dominio de ejemplo durante toda la aventura, como un catálogo de productos, una biblioteca o un inventario.

Los desafíos deben plantear situaciones reconocibles de desarrollo y permitir aplicar los conceptos aprendidos.

Incluir al menos una misión integradora que combine operaciones de MongoDB con el uso de esquemas, modelos o validaciones de Mongoose.

Los ejemplos de código deben ser cortos, legibles y técnicamente correctos.

## 7. Diseño visual y UX

Crear una identidad visual propia, coherente con un RPG educativo.

Prioridades:

- Interfaz atractiva, inmersiva y amigable.
- Jerarquía visual clara.
- Tipografía legible y contraste adecuado.
- Escenarios, personajes y elementos visuales coherentes.
- Diálogos fáciles de leer.
- Indicadores de progreso comprensibles.
- Animaciones discretas y funcionales.
- Diseño responsive para escritorio, tablet y móvil.
- Estados visibles para respuestas, decisiones y recompensas.
- Navegación intuitiva y accesible mediante teclado.

Evitar:

- Apariencia de dashboard administrativo.
- Tarjetas genéricas sin identidad visual.
- Exceso de colores, efectos y animaciones.
- Pantallas saturadas de información.
- Mecánicas que obliguen a repetir contenido innecesariamente.

Utilizar las skills de diseño y desarrollo de juegos disponibles cuando sean pertinentes, respetando sus instrucciones y evitando duplicar responsabilidades.

## 8. Arquitectura y calidad del código

- Mantener componentes React pequeños y con responsabilidades claras.
- Separar el contenido educativo de la presentación cuando aporte claridad.
- Gestionar el estado con herramientas nativas de React, salvo que exista una necesidad concreta de otra solución.
- Evitar duplicación de código.
- Reutilizar componentes visuales y patrones consistentes.
- Mantener una estructura de carpetas sencilla y comprensible.
- Utilizar HTML semántico y buenas prácticas de accesibilidad.
- Evitar dependencias innecesarias y soluciones sobreingenierizadas.
- No modificar configuraciones existentes sin una razón concreta.
- No introducir TypeScript, frameworks adicionales ni herramientas de infraestructura sin autorización.

La arquitectura debe facilitar la incorporación de nuevas misiones y contenidos sin obligar a reescribir el juego.

## 9. Verificación y pruebas

Antes de dar por terminado un cambio:

1. Verificar que la aplicación compile correctamente.
2. Ejecutar las comprobaciones disponibles en el proyecto.
3. Probar la navegación entre pantallas y niveles.
4. Comprobar las decisiones, respuestas, reintentos y recompensas.
5. Verificar las condiciones de desbloqueo y el progreso.
6. Revisar que los ejemplos técnicos y las explicaciones sean correctos.
7. Probar el diseño en distintos tamaños de pantalla.
8. Revisar errores de consola y problemas de interacción.
9. Confirmar que la experiencia se pueda completar sin quedar bloqueado por una respuesta incorrecta.

No afirmar que una prueba se ejecutó si no se realizó realmente.

## 10. Forma de trabajo del agente

Antes de implementar:

1. Inspeccionar el repositorio, `AGENTS.md`, las skills instaladas y las dependencias existentes.
2. Identificar qué está implementado y qué falta.
3. Consultar la documentación oficial de MongoDB y Mongoose para definir los contenidos técnicos.
4. Proponer brevemente la estructura del RPG, su recorrido y sus principales mecánicas.
5. Priorizar una versión funcional y completa de alcance reducido.

Durante el desarrollo:

- Respetar el stack y las decisiones existentes.
- Implementar de forma incremental.
- Priorizar funcionalidad, claridad pedagógica y calidad visual.
- Evitar cambios ajenos al objetivo.
- Consultar la documentación antes de resolver dudas técnicas.
- No reemplazar decisiones existentes sin justificar la necesidad.

Al finalizar:

- Resumir las funcionalidades implementadas.
- Indicar cómo ejecutar el proyecto.
- Informar las verificaciones realizadas y sus resultados.
- Identificar las limitaciones pendientes, si existen.

## 11. Criterio general de decisión

Ante cualquier duda, priorizar en este orden:

1. Exactitud técnica del contenido educativo.
2. Comprensión y aprendizaje del jugador.
3. Experiencia RPG coherente y entretenida.
4. Usabilidad y accesibilidad.
5. Calidad y mantenibilidad del código.
6. Simplicidad y alcance controlado.

**Principio rector:** crear un RPG pequeño, funcional y visualmente atractivo que enseñe correctamente MongoDB y Mongoose mediante la exploración y la resolución de problemas, utilizando la documentación oficial como referencia técnica y sin convertir el proyecto en una aplicación innecesariamente compleja.