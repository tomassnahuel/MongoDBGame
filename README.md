<div align="center">

# ⚔️ MongoDB Quest: El Archivo del Reino

**Un RPG educativo de fantasía oscura para aprender MongoDB y Mongoose desde cero**

[![Deploy](https://img.shields.io/badge/DEPLOY%20LIVE-mongodbgame.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://mongodbgame.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-ffffff?style=for-the-badge&logo=threedotjs&logoColor=black)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 🌑 ¿Qué es MongoDB Quest?

**MongoDB Quest** es una experiencia RPG inmersiva ambientada en un mundo de fantasía oscura inspirado en Dark Souls, donde los jugadores aprenden **MongoDB, Mongoose y modelado de datos NoSQL** completando misiones, resolviendo desafíos y explorando un mundo 3D en tiempo real.

> *"Nadie avanza en el Archivo del Reino sin comprender primero las almas de los documentos."*

---

## 🎮 Características Principales

### 🗺️ Mundo 3D Interactivo
- Exploración libre en un entorno **WebGL con Three.js** totalmente construido en código
- Personaje animado con **ciclo de caminar, correr e idle** generado proceduralmente
- NPCs con modelos 3D cargados desde archivos `.glb` (caballeros, magos, villanos)
- Colisiones, física y detección de proximidad para activar diálogos

### ⚔️ Sistema RPG Completo
- **Barras de estado estilo Dark Souls**: Salud (HP), Concentración (FP) y Sabiduría/EXP
- **Sistema de rangos y niveles**: desde *Latente* hasta *Archivista Supremo*
- **Inventario de armas y artefactos** desbloqueables al completar misiones
- **Muerte y respawn**: morir reduce HP; acumulación de errores lleva a la pantalla de derrota
- **Pantalla de Victoria / Graduación** al completar todas las misiones

### 📜 Sistema de Misiones (Roadmap)
- **Misiones Principales** (quest_1 a quest_4): narrativa central de MongoDB
- **Misiones Secundarias** (quest_5 a quest_10): profundización en Mongoose y agregaciones
- Panel lateral con progreso, filtros por tipo, barra de completado y badges

### 🧠 Desafíos Educativos
- **Preguntas interactivas** con retroalimentación inmediata
- Temas cubiertos: documentos, colecciones, CRUD, índices, agregaciones, esquemas, Mongoose, GridFS y más
- Cada respuesta incorrecta reduce HP — ¡aprende o muere!

### 🛒 Bazar del Archivista (Tienda)
- Compra cosméticos con oro ganado en misiones
- Personaliza color de túnica, capa, cabello y gemas del personaje

### 📡 Mini-Mapa y Brújula
- Radar dinámico que muestra la zona actual y puntos de interés
- Mapa táctico 2D alternativo para navegación estratégica

### 🕹️ Controles Táctiles
- D-pad virtual en pantalla para jugar desde dispositivos móviles y tablets
- Botones de acción: Interactuar, Sprint, Esquivar
- Totalmente responsivo

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** | UI reactiva y gestión de estado |
| **Three.js 0.186** | Motor 3D WebGL, modelos, animaciones, luces y sombras |
| **Vite 8** | Bundler y dev server ultrarrápido |
| **Oxlint** | Linting estático de alta velocidad |
| **Vercel** | Deploy automático desde `main` |

---

## 📁 Estructura del Proyecto

```
mongodb-quest/
├── public/
│   ├── models/          # Modelos 3D (.glb): caballeros, magos, NPCs
│   └── Audio/           # Banda sonora épica estilo Elder Scrolls
├── src/
│   ├── components/
│   │   ├── GameCanvas3D.jsx     # Motor WebGL: mundo, personaje, NPCs, física
│   │   ├── HUD.jsx              # Barras HP/FP/EXP estilo Dark Souls
│   │   ├── QuestRoadmap.jsx     # Panel lateral de misiones
│   │   ├── ChallengeModal.jsx   # Desafíos educativos interactivos
│   │   ├── DialogueBox.jsx      # Sistema de diálogos con NPCs
│   │   ├── ShopModal.jsx        # Bazar de cosméticos
│   │   ├── WorldMap.jsx         # Mapa táctico 2D
│   │   ├── RadarCompass.jsx     # Mini-radar / brújula
│   │   ├── TouchControls.jsx    # Controles táctiles en pantalla
│   │   ├── NPCModelPreview.jsx  # Preview de modelos 3D en diálogos
│   │   ├── InventoryModal.jsx   # Inventario de artefactos
│   │   ├── CodexModal.jsx       # Grimorio: documentación oficial
│   │   └── VictoryScreen.jsx    # Pantalla de victoria / graduación
│   ├── data/
│   │   └── gameData.js          # NPCs, quests, ítems, rangos
│   ├── hooks/
│   │   └── useGameState.js      # Estado global del juego
│   └── utils/
│       ├── audio.js             # Gestión de banda sonora y efectos
│       └── soulsTextures.js     # Texturas procedurales Dark Souls
```

---

## 🚀 Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/tomassnahuel/MongoDBGame.git
cd MongoDBGame

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# → http://localhost:5173
```

```bash
# Compilar para producción
npm run build

# Previsualizar build
npm run preview

# Lint
npm run lint
```

---

## 🎓 Contenido Educativo

El juego cubre el siguiente temario de MongoDB:

| Misión | Tema |
|---|---|
| **La Forja de los Documentos** | Estructura de documentos JSON/BSON |
| **El Laberinto de Colecciones** | Colecciones, bases de datos, `insertOne/Many` |
| **Las Runas del Índice** | Índices, optimización y `explain()` |
| **El Oráculo de Agregaciones** | Pipelines de agregación (`$match`, `$group`, `$sort`) |
| **El Grimorio de Mongoose** | Schemas, Models y validaciones |
| **Los Fragmentos de GridFS** | Almacenamiento de archivos grandes |
| **El Pacto del Replica Set** | Alta disponibilidad y replicación |
| **La Coraza del Sharding** | Escalado horizontal |
| **El Rito de las Transacciones** | ACID y sesiones multi-documento |
| **La Ascensión del Archivista** | Repaso integral y proyecto final |

---

## 🌐 Deploy

El proyecto está desplegado en Vercel con CI/CD automático desde la rama `main`.

**🔗 [mongodbgame.vercel.app](https://mongodbgame.vercel.app)**

---

## 📝 Licencia

Proyecto educativo. Todos los modelos 3D son de uso libre (CC0 / CC-BY). La música es de dominio público / uso educativo.

---

<div align="center">

*Forjado en las brasas del conocimiento. Que las almas de los documentos te guíen, Archivista.*

⚔️ · 🔥 · 📜

</div>
