// Datos del juego educativo: Zonas, NPCs, Misiones y Desafíos Pedagógicos

export const OFFICIAL_DOCS = [
  {
    title: "Documentos en MongoDB (Manual Oficial)",
    url: "https://www.mongodb.com/es/docs/manual/core/document/",
    desc: "Estructura BSON, tipos de datos, límite de 16MB y campo _id."
  },
  {
    title: "Operaciones CRUD en MongoDB",
    url: "https://www.mongodb.com/docs/manual/crud/",
    desc: "Creación, lectura (find), actualización ($set, $push) y borrado."
  },
  {
    title: "Modelado de Datos (Embedding vs Referencing)",
    url: "https://www.mongodb.com/docs/manual/data-modeling/",
    desc: "Patrones de diseño: subdocumentos vs referencias con ObjectId."
  },
  {
    title: "Guía de Esquemas de Mongoose",
    url: "https://mongoosejs.com/docs/guide.html",
    desc: "Cómo definir tipos de datos, opciones y compilación de modelos."
  },
  {
    title: "Validación en Mongoose",
    url: "https://mongoosejs.com/docs/validation.html",
    desc: "Reglas required, min, max, enum, match y validadores personalizados."
  },
  {
    title: "Poblado de Referencias (.populate)",
    url: "https://mongoosejs.com/docs/populate.html",
    desc: "Cómo Mongoose une documentos referenciados de distintas colecciones."
  }
];

export const RANKS = [
  { level: 1, title: "Aprendiz de Escriba", xpNeeded: 100 },
  { level: 2, title: "Iniciado del Códice BSON", xpNeeded: 250 },
  { level: 3, title: "Modelador de Mongoose", xpNeeded: 450 },
  { level: 4, title: "Arquitecto NoSQL", xpNeeded: 700 },
  { level: 5, title: "Gran Maestro del Archivo", xpNeeded: 1000 }
];

export const INITIAL_ITEMS_COLLECTION = [
  {
    _id: "65a1f01c9b1d8e001a111111",
    nombre: "Poción de Maná Antiguo",
    tipo: "pocion",
    rareza: "magica",
    stock: 5,
    precio: 25
  },
  {
    _id: "65a1f01c9b1d8e001a222222",
    nombre: "Espada de Obsidiana",
    tipo: "arma",
    rareza: "epica",
    stock: 2,
    precio: 350
  },
  {
    _id: "65a1f01c9b1d8e001a333333",
    nombre: "Poción de Curación Mayor",
    tipo: "pocion",
    rareza: "magica",
    stock: 8,
    precio: 30
  },
  {
    _id: "65a1f01c9b1d8e001a444444",
    nombre: "Escudo Rúnico de Piedra",
    tipo: "armadura",
    rareza: "rara",
    stock: 3,
    precio: 180
  }
];

export const ZONES = [
  {
    id: "zone_bson",
    name: "Valle de los Documentos",
    icon: "📜",
    subtitle: "Fundamentos de MongoDB y BSON",
    description: "Donde los datos fluyen libremente sin las ataduras de las tablas rígidas de piedra.",
    color: "#10b981",
    npcId: "npc_bsonia"
  },
  {
    id: "zone_mongoose",
    name: "La Forja de Esquemas",
    icon: "⚒️",
    subtitle: "Mongoose ODM y Validación de Datos",
    description: "El taller arcano donde se forjan contratos de datos y validaciones para Node.js.",
    color: "#f59e0b",
    npcId: "npc_schemiel"
  },
  {
    id: "zone_relations",
    name: "La Aguja de las Relaciones",
    icon: "🏛️",
    subtitle: "Embebido vs Referenciado",
    description: "La torre donde se tejen vínculos entre documentos: subdocumentos o referencias con ObjectId.",
    color: "#38bdf8",
    npcId: "npc_relatia"
  },
  {
    id: "zone_sanctum",
    name: "El Sanctum del Gran Custodio",
    icon: "👑",
    subtitle: "Prueba Integradora y Graduación",
    description: "El santuario final donde pondrás a prueba todo tu conocimiento ante el Custodio.",
    color: "#a855f7",
    npcId: "npc_atlas"
  }
];

export const NPCS = {
  npc_bsonia: {
    id: "npc_bsonia",
    name: "Maestra Bsonia",
    title: "Escriba Mayor de Documentos BSON",
    avatar: "🧙‍♀️",
    zoneId: "zone_bson",
    questId: "quest_1",
    dialogue: {
      initial: {
        text: "¡Bienvenido a la Ciudadela del Archivo, joven aprendiz! Antes de que llegaras, este reino intentaba guardar cada detalle en tablas rígidas de SQL con columnas fijas. Pero aquí en MongoDB trabajamos con Códices Documentales en formato BSON (Binary JSON).",
        options: [
          { text: "¿Qué es exactamente un documento BSON?", next: "explain_bson" },
          { text: "¿Por qué no usamos tablas relacionales aquí?", next: "explain_sql_diff" },
          { text: "Estoy listo para ayudar con el archivo.", next: "offer_quest" }
        ]
      },
      explain_bson: {
        text: "Un documento BSON es un objeto clave-valor flexible. Puede contener texto, números, fechas y hasta arreglos y otros documentos anidados dentro. Cada documento posee un identificador único e inmutable llamado '_id', generado por MongoDB si tú no lo provees.",
        options: [
          { text: "Entiendo. ¿Y en qué se diferencia de una tabla SQL?", next: "explain_sql_diff" },
          { text: "¡Muéstrame la tarea que debo resolver!", next: "offer_quest" }
        ]
      },
      explain_sql_diff: {
        text: "En SQL tienes Tablas, Filas y Columnas estrictas. Si una fila no tiene un dato, queda en NULL. En MongoDB tienes Colecciones y Documentos: cada documento puede tener campos diferentes según lo necesite tu aplicación, adaptándose a la evolución ágil de tu código.",
        options: [
          { text: "Tiene mucho más sentido para APIs modernas.", next: "offer_quest" }
        ]
      },
      offer_quest: {
        text: "Nuestro catálogo de objetos mágicos está desordenado. Necesito que filtres las pociones mágicas y reabastezcas su stock usando una consulta CRUD real de MongoDB.",
        options: [
          { text: "¡Acepto la misión, Maestra!", action: "start_challenge" }
        ]
      },
      completed: {
        text: "¡Excelente trabajo! Has demostrado dominar los documentos BSON y el filtrado con db.collection.find(). Guarda este pergamino con orgullo.",
        options: [
          { text: "Gracias, Maestra Bsonia. Seguiré mi viaje.", next: "farewell" }
        ]
      },
      farewell: {
        text: "El Forjador Schemiel te espera en la Forja de Esquemas. Te enseñará a proteger los datos con Mongoose."
      }
    }
  },

  npc_schemiel: {
    id: "npc_schemiel",
    name: "Forjador Schemiel",
    title: "Maestro Herrero de Mongoose ODM",
    avatar: "🧝‍♂️",
    zoneId: "zone_mongoose",
    questId: "quest_2",
    dialogue: {
      initial: {
        text: "¡Por las barbas de Turing! Un aprendiz llega a mi fragua. Ya viste la libertad de MongoDB: puedes guardar lo que quieras... ¡Y ese es exactamente el peligro si no tienes cuidado!",
        options: [
          { text: "¿A qué te refieres con que es un peligro?", next: "explain_problem" },
          { text: "¿Para qué sirve Mongoose en Node.js?", next: "explain_mongoose" }
        ]
      },
      explain_problem: {
        text: "La flexibilidad sin orden es caos. Si un desarrollador guarda un usuario con 'mail' y otro con 'correo_electronico', tu sistema colapsará. Aquí es donde entra Mongoose: nos permite modelar la información con Esquemas (Schema) y compilar Modelos en Node.js.",
        options: [
          { text: "¿MongoDB no valida datos por sí mismo?", next: "explain_validation_truth" }
        ]
      },
      explain_mongoose: {
        text: "Mongoose es una biblioteca ODM (Object Data Modeling) para Node.js. Traduce tus documentos de MongoDB a objetos JavaScript enriquecidos con validaciones, valores por defecto, métodos y middleware.",
        options: [
          { text: "Dime: ¿la validación la hace MongoDB o Mongoose?", next: "explain_validation_truth" }
        ]
      },
      explain_validation_truth: {
        text: "¡La pregunta del millón! Ambas cosas son reales: MongoDB posee validación NATIVA en el motor mediante $jsonSchema. Pero en Node.js usamos Mongoose a nivel de APLICACIÓN porque nos permite validar tipos, campos requeridos (required) y formatos antes de que la consulta viaje a la base de datos.",
        options: [
          { text: "¡Gran clarificación! ¿Cuál es mi misión?", next: "offer_quest" }
        ]
      },
      offer_quest: {
        text: "Necesito que configures el Esquema de Mongoose para el registro de nuevos Aventureros. Debes asegurarte de que el nombre sea obligatorio, el nivel mínimo sea 1 y la clase pertenezca a un enum válido.",
        options: [
          { text: "¡Manos a la obra, Forjador!", action: "start_challenge" }
        ]
      },
      completed: {
        text: "¡Impecable! Con ese Schema de Mongoose, ningún dato corrupto podrá entrar en nuestra base de datos. Te otorgo el Amuleto de Validación.",
        options: [
          { text: "¡Un honor! Iré a la Torre de Relatia.", next: "farewell" }
        ]
      },
      farewell: {
        text: "Visita a la Arquitecta Relatia en la Aguja de las Relaciones. Ella te revelará el arte de conectar documentos."
      }
    }
  },

  npc_relatia: {
    id: "npc_relatia",
    name: "Arquitecta Relatia",
    title: "Guardiana de la Aguja de Relaciones",
    avatar: "🧙‍♂️",
    zoneId: "zone_relations",
    questId: "quest_3",
    dialogue: {
      initial: {
        text: "Bienvenido a las alturas, caminante. Muchos que provienen del mundo SQL sufren aquí porque buscan la palabra 'JOIN' o claves foráneas automáticas... y no las encuentran.",
        options: [
          { text: "¿Cómo se relacionan los datos en MongoDB entonces?", next: "explain_strategies" },
          { text: "¿Por qué no hay JOINs tradicionales?", next: "explain_joins" }
        ]
      },
      explain_joins: {
        text: "Los JOINs de SQL unen tablas en tiempo real en el servidor de base de datos, lo que en sistemas distribuidos a gran escala penaliza el rendimiento. En MongoDB preferimos diseñar según cómo la aplicación consulta los datos.",
        options: [
          { text: "¿Cuáles son las dos grandes estrategias?", next: "explain_strategies" }
        ]
      },
      explain_strategies: {
        text: "Existen dos caminos sagrados: 1) Embebido (Subdocumentos): guardas el objeto dentro del documento padre (ideal para relaciones 1:1 o 1:pocos que se leen juntos). 2) Referenciado (Normalización): guardas solo el ObjectId y usas .populate() en Mongoose para unir los datos cuando sea necesario.",
        options: [
          { text: "¿Y cuándo usar cada una?", next: "explain_rules" }
        ]
      },
      explain_rules: {
        text: "¡Regla de oro! Si los datos se consultan siempre juntos y el arreglo es pequeño, embebe. Pero si la relación es 1 a Muchos grande (como miles de comentarios o logs) o Muchos a Muchos, ¡referencia con ObjectId! Recuerda que un documento tiene un límite estricto de 16 MB.",
        options: [
          { text: "Comprendo a la perfección. ¿Cuál es mi prueba?", next: "offer_quest" }
        ]
      },
      offer_quest: {
        text: "Debes ayudarme a modelar la ficha de un Aventurero: embeber sus estadísticas fijas (1:1) y referenciar sus Misiones Asignadas mediante ObjectId, probando una consulta con .populate().",
        options: [
          { text: "¡Conectemos los códices!", action: "start_challenge" }
        ]
      },
      completed: {
        text: "¡Magistral! Comprendes el balance entre velocidad de lectura con subdocumentos y escalabilidad con referencias ObjectId.",
        options: [
          { text: "¡Gracias, Arquitecta! Estoy listo para el Sanctum.", next: "farewell" }
        ]
      },
      farewell: {
        text: "El Gran Custodio Atlas te espera en el Sanctum. Es hora de tu graduación."
      }
    }
  },

  npc_atlas: {
    id: "npc_atlas",
    name: "Gran Custodio Atlas",
    title: "Custodio Supremo del Archivo",
    avatar: "👑",
    zoneId: "zone_sanctum",
    questId: "quest_4",
    dialogue: {
      initial: {
        text: "Te he estado observando, aprendiz. Has recorrido el Valle de los Documentos, forjado esquemas con Schemiel y aprendido los secretos de las relaciones con Relatia. Ha llegado el momento del Examen Final del Escriba.",
        options: [
          { text: "Estoy preparado para demostrar lo aprendido.", next: "explain_trial" },
          { text: "¿En qué consistirá la prueba integradora?", next: "explain_trial" }
        ]
      },
      explain_trial: {
        text: "Resolverás un caso de arquitectura real: diagnosticar y solucionar una mala práctica de modelado, validar un documento crítico y ejecutar la consulta final que salvará la integridad del Gran Archivo.",
        options: [
          { text: "¡Iniciemos la prueba final!", action: "start_challenge" }
        ]
      },
      completed: {
        text: "¡Felicidades, Maestro del Códice! Has demostrado criterio técnico, dominio de MongoDB y maestría en Mongoose. Todo el equipo de desarrollo te da la más cálida bienvenida.",
        options: [
          { text: "¡Ver pergamino de graduación y resumen!", action: "view_victory" }
        ]
      },
      farewell: {
        text: "Tu nombre quedará grabado en la colección de Escribas de Honor del Reino."
      }
    }
  }
};

export const QUESTS = {
  quest_1: {
    id: "quest_1",
    title: "Misión I: El Catálogo Desordenado",
    zoneId: "zone_bson",
    npcId: "npc_bsonia",
    xpReward: 150,
    itemReward: {
      id: "item_scroll_bson",
      name: "Códice de BSON",
      icon: "📜",
      type: "relic",
      desc: "Pergamino arcano que describe la estructura BSON, documentos y el identificador _id."
    },
    instructions: "Utiliza las operaciones de consulta y actualización de MongoDB para encontrar y ajustar los suministros de pociones mágicas.",
    type: "mongodb_query"
  },

  quest_2: {
    id: "quest_2",
    title: "Misión II: El Sello de Validación",
    zoneId: "zone_mongoose",
    npcId: "npc_schemiel",
    xpReward: 200,
    itemReward: {
      id: "item_amulet_validation",
      name: "Amuleto de Validación Mongoose",
      icon: "🧿",
      type: "amulet",
      desc: "Protege las colecciones impidiendo la entrada de datos corruptos mediante Schemas."
    },
    instructions: "Configura las reglas del Schema de Mongoose para el nuevo Aventurero (required, enum y min) y ponlo a prueba.",
    type: "mongoose_schema"
  },

  quest_3: {
    id: "quest_3",
    title: "Misión III: El Dilema de las Relaciones",
    zoneId: "zone_relations",
    npcId: "npc_relatia",
    xpReward: 250,
    itemReward: {
      id: "item_key_references",
      name: "Llave de las Referencias",
      icon: "🗝️",
      type: "key",
      desc: "Permite enlazar colecciones mediante ObjectId y resolverlas fluidamente con .populate()."
    },
    instructions: "Elige cuándo embeber subdocumentos y cuándo referenciar con ObjectId, y ejecuta un populate simulado.",
    type: "relations_modeling"
  },

  quest_4: {
    id: "quest_4",
    title: "Misión Final: El Juicio del Custodio",
    zoneId: "zone_sanctum",
    npcId: "npc_atlas",
    xpReward: 400,
    itemReward: {
      id: "item_master_diploma",
      name: "Pergamino de Maestro MongoDB & Mongoose",
      icon: "📜✨",
      type: "diploma",
      desc: "Acredita tu conocimiento y preparación técnica para sumarte al equipo de desarrollo."
    },
    instructions: "Prueba integradora: toma decisiones arquitectónicas, valida esquemas y ejecuta la consulta de honor.",
    type: "integrator_trial"
  }
};
