// Datos del juego educativo: Zonas, NPCs, Misiones y Desafíos Pedagógicos

export const OFFICIAL_DOCS = [
  {
    title: "Documentos en MongoDB (Manual Oficial)",
    url: "https://www.mongodb.com/es/docs/manual/core/document/",
    desc: "Estructura BSON, tipos de datos, límite de 16 MiB y campo _id."
  },
  {
    title: "GridFS (Manual Oficial)",
    url: "https://www.mongodb.com/es/docs/manual/core/gridfs/",
    desc: "Almacenamiento de archivos que superan el límite de 16 MiB por documento BSON."
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
  { level: 5, title: "Gran Maestro del Archivo", xpNeeded: 1000 },
  { level: 6, title: "Cartógrafo del Gran Archivo", xpNeeded: 1150 },
  { level: 7, title: "Custodio de los Documentos BSON", xpNeeded: 1300 }
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
    npcId: "npc_atlas",
    requiresCoreQuests: true
  },
  {
    id: "zone_document_hall",
    name: "Galería de Claves y Valores",
    icon: "🗂️",
    subtitle: "Estructura de documentos",
    description: "Descubre cómo se organizan los campos y valores de un documento.",
    color: "#f97316",
    npcId: "npc_scribe"
  },
  {
    id: "zone_bson_archive",
    name: "Archivo de Tipos BSON",
    icon: "💠",
    subtitle: "BSON y tipos de datos",
    description: "Compara JSON con la representación BSON y sus tipos adicionales.",
    color: "#eab308",
    npcId: "npc_archivist"
  },
  {
    id: "zone_nested_garden",
    name: "Jardín de Documentos Anidados",
    icon: "🌿",
    subtitle: "Documentos y arreglos",
    description: "Ordena perfiles, objetos anidados y listas dentro de una ficha.",
    color: "#22c55e",
    npcId: "npc_gardener"
  },
  {
    id: "zone_dot_tower",
    name: "Torre de la Notación de Puntos",
    icon: "🔎",
    subtitle: "Acceso a campos y arreglos",
    description: "Sigue la ruta correcta hasta un campo anidado o un elemento de arreglo.",
    color: "#06b6d4",
    npcId: "npc_pathfinder"
  },
  {
    id: "zone_id_vault",
    name: "Bóveda de Identificadores",
    icon: "🔐",
    subtitle: "_id y nombres de campo",
    description: "Protege la identidad de cada documento y evita campos duplicados.",
    color: "#8b5cf6",
    npcId: "npc_guardian"
  },
  {
    id: "zone_gridfs_gate",
    name: "Umbral de GridFS",
    icon: "📦",
    subtitle: "Tamaño de documentos",
    description: "Decide qué hacer cuando un documento supera el tamaño máximo.",
    color: "#ec4899",
    npcId: "npc_keeper"
  }
];

export const NPCS = {
  npc_bsonia: {
    id: "npc_bsonia",
    name: "Maestra Bsonia",
    title: "Escriba Mayor de Documentos BSON",
    avatar: "🧙‍♀️",
    model: "/models/witch_hunter_in_long_coat_and_wide_hat.glb",
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
    model: "/models/voidbound_necromancer.glb",
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
    model: "/models/knight_artorias_and_great_grey_wolf_sif.glb",
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
    model: "/models/knight_artorias.glb",
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
  },

  npc_scribe: {
    id: "npc_scribe",
    name: "Escriba Clavaria",
    title: "Cartógrafa de Campos y Valores",
    avatar: "🗂️",
    model: "/models/ember_winged_fallen_angel_warrior.glb",
    zoneId: "zone_document_hall",
    questId: "quest_5",
    dialogue: {
      initial: {
        text: "Cada documento MongoDB organiza sus datos como pares de campo y valor. Los campos describen la información y sus valores pueden ser de distintos tipos.",
        options: [
          { text: "¿Puede un documento guardar distintos tipos de valor?", next: "explain" },
          { text: "Quiero ordenar una ficha del archivo.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "Sí. Un mismo documento puede mezclar texto, números, arreglos y documentos anidados, según los datos que represente.",
        options: [{ text: "¡Entendido! Muéstrame el desafío.", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Elige cuál de estas fichas sigue la estructura de un documento con campos y valores.",
        options: [{ text: "¡A ordenar el archivo!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Bien hecho! Reconociste la estructura básica de los documentos.",
        options: [{ text: "Gracias, Escriba Clavaria." }]
      }
    }
  },

  npc_archivist: {
    id: "npc_archivist",
    name: "Maese Binar",
    title: "Guardián del Archivo BSON",
    avatar: "💠",
    model: "/models/knight_artorias.glb",
    zoneId: "zone_bson_archive",
    questId: "quest_6",
    dialogue: {
      initial: {
        text: "MongoDB almacena sus documentos como BSON, una representación binaria de documentos tipo JSON que también admite más tipos de datos.",
        options: [
          { text: "¿Qué diferencia práctica tiene BSON?", next: "explain" },
          { text: "Quiero poner a prueba mis conocimientos.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "Por ejemplo, los documentos pueden contener tipos como ObjectId y Date. BSON no significa que cada valor sea solamente texto JSON.",
        options: [{ text: "¡Ahora lo veo! Vamos al desafío.", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Ayúdame a escoger la descripción correcta de BSON para el registro de un aventurero.",
        options: [{ text: "¡Abramos el códice!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Excelente! Ya distingues los documentos BSON de una cadena JSON común.",
        options: [{ text: "Gracias, Maese Binar." }]
      }
    }
  },

  npc_gardener: {
    id: "npc_gardener",
    name: "Jardinera Anidalia",
    title: "Cuidadora de Arreglos y Subdocumentos",
    avatar: "🌿",
    model: "/models/lowpoly_pbr_knight_armour.glb",
    zoneId: "zone_nested_garden",
    questId: "quest_7",
    dialogue: {
      initial: {
        text: "Los documentos pueden guardar otros documentos y arreglos como valores. Así una ficha puede reflejar objetos y listas que pertenecen a la misma entidad.",
        options: [
          { text: "¿Cómo se vería un perfil con habilidades?", next: "explain" },
          { text: "Quiero reparar una ficha anidada.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "Puedes guardar el perfil como un documento anidado y las habilidades como un arreglo. La estructura debe responder a cómo la aplicación usa esos datos.",
        options: [{ text: "¡Vamos a probarlo!", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Selecciona la ficha que conserva el perfil como documento y las habilidades como arreglo.",
        options: [{ text: "¡Reordenemos las ramas!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Perfecto! Los subdocumentos y arreglos quedaron en su lugar.",
        options: [{ text: "Gracias, Jardinera Anidalia." }]
      }
    }
  },

  npc_pathfinder: {
    id: "npc_pathfinder",
    name: "Explorador Puntual",
    title: "Guía de Rutas entre Campos",
    avatar: "🔎",
    model: "/models/mastercraft_mithril_armor_set_for_beyond_skyrim2.glb",
    zoneId: "zone_dot_tower",
    questId: "quest_8",
    dialogue: {
      initial: {
        text: "La notación de puntos permite llegar a campos de documentos anidados y a elementos de arreglos usando índices que empiezan en cero.",
        options: [
          { text: "¿Cómo llego a un campo dentro de un objeto?", next: "explain" },
          { text: "Necesito trazar una ruta de consulta.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "Une los nombres con puntos: perfil.clase. Para el primer elemento de un arreglo llamado habilidades, usa habilidades.0.",
        options: [{ text: "¡Ya puedo seguir la ruta!", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Traza la ruta que alcanza el gremio anidado y la primera habilidad de la ficha.",
        options: [{ text: "¡Seguiré las pistas!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Ruta encontrada! Ya puedes apuntar a campos anidados y posiciones de arreglos.",
        options: [{ text: "Gracias, Explorador Puntual." }]
      }
    }
  },

  npc_guardian: {
    id: "npc_guardian",
    name: "Custodia Idalia",
    title: "Protectora de la Llave Primaria",
    avatar: "🔐",
    model: "/models/dark_knight_-_hitem3d_hi3d_vs_supavoxel_test.glb",
    zoneId: "zone_id_vault",
    questId: "quest_9",
    dialogue: {
      initial: {
        text: "El campo _id identifica de forma única cada documento de una colección y es inmutable. Además, cada nombre de campo debe ser único dentro del documento.",
        options: [
          { text: "¿Puedo repetir un nombre de campo?", next: "explain" },
          { text: "Quiero proteger la bóveda.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "No. Los campos duplicados pueden producir resultados inesperados en las operaciones. Conserva un solo valor por nombre de campo.",
        options: [{ text: "Entendido. Iniciemos la prueba.", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Elige la regla que mantiene identificables los documentos y evita una ficha ambigua.",
        options: [{ text: "¡Cerraré la bóveda!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Bóveda segura! Cada documento conserva una identidad clara y campos sin duplicar.",
        options: [{ text: "Gracias, Custodia Idalia." }]
      }
    }
  },

  npc_keeper: {
    id: "npc_keeper",
    name: "Guardiana Gridsa",
    title: "Vigilante del Umbral de GridFS",
    avatar: "📦",
    model: "/models/fantasy_villager.glb",
    zoneId: "zone_gridfs_gate",
    questId: "quest_10",
    dialogue: {
      initial: {
        text: "Un documento BSON tiene un tamaño máximo de 16 MiB. Si un archivo supera ese tamaño, MongoDB ofrece GridFS para almacenarlo.",
        options: [
          { text: "¿Qué hago con un archivo demasiado grande?", next: "explain" },
          { text: "Quiero resolver el caso del archivo.", next: "offer_quest" }
        ]
      },
      explain: {
        text: "No intentes guardar un documento por encima del límite. GridFS divide el archivo en fragmentos y guarda sus metadatos para poder recuperarlo.",
        options: [{ text: "¡Vamos al desafío!", next: "offer_quest" }]
      },
      offer_quest: {
        text: "Un mapa de alta resolución supera el tamaño máximo de un documento. Decide cuál es la solución adecuada.",
        options: [{ text: "¡Abramos el umbral!", action: "start_challenge" }]
      },
      completed: {
        text: "¡Caso resuelto! Para archivos mayores que el máximo de documento, recuerda GridFS.",
        options: [{ text: "Gracias, Guardiana Gridsa." }]
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
  },

  quest_5: {
    id: "quest_5",
    title: "Misión Secundaria: El Archivo de Claves",
    zoneId: "zone_document_hall",
    npcId: "npc_scribe",
    xpReward: 50,
    itemReward: { id: "item_field_quill", name: "Pluma de Campos", icon: "🪶", type: "relic", desc: "Recuerda que los documentos organizan pares de campo y valor." },
    instructions: "Identifica la estructura de campo y valor que MongoDB utiliza en un documento.",
    type: "document_quiz",
    challenge: {
      prompt: "¿Cuál ejemplo representa un documento MongoDB con pares de campo y valor?",
      options: [
        { id: "fields", label: '{ nombre: "Luna", nivel: 4, objetos: ["poción"] }' },
        { id: "table", label: "Una fila que debe tener exactamente las mismas columnas que todos los demás documentos." },
        { id: "json-string", label: '"{nombre: Luna, nivel: cuatro}" (un único texto sin valores tipados)' }
      ],
      answer: "fields",
      explanation: "Correcto. Un documento es una estructura de campos y valores. Sus valores pueden ser de distintos tipos, incluidos arreglos y documentos anidados.",
      hint: "Busca una estructura con campos nombrados y un valor asociado a cada uno.",
      example: '{ nombre: "Luna", nivel: 4, objetos: ["poción"] }'
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/document/"
  },

  quest_6: {
    id: "quest_6",
    title: "Misión Secundaria: El Espejo BSON",
    zoneId: "zone_bson_archive",
    npcId: "npc_archivist",
    xpReward: 50,
    itemReward: { id: "item_bson_crystal", name: "Cristal BSON", icon: "💠", type: "relic", desc: "Representación binaria de documentos con tipos BSON." },
    instructions: "Distingue BSON de JSON y elige qué tipos puede representar un documento.",
    type: "document_quiz",
    challenge: {
      prompt: "¿Qué afirmación describe BSON de forma correcta?",
      options: [
        { id: "binary", label: "Es una representación binaria de documentos tipo JSON y admite más tipos de datos." },
        { id: "string", label: "Es solo texto JSON y todos sus valores deben ser strings." },
        { id: "schema", label: "Es un esquema de Mongoose que MongoDB exige para guardar documentos." }
      ],
      answer: "binary",
      explanation: "Correcto. MongoDB almacena documentos como BSON. BSON es una representación binaria de documentos tipo JSON y cuenta con tipos adicionales, como ObjectId y Date.",
      hint: "Recuerda qué significa BSON y que admite más tipos que JSON.",
      example: '{ _id: ObjectId("..."), llegada: new Date(), nombre: "Luna" }'
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/document/"
  },

  quest_7: {
    id: "quest_7",
    title: "Misión Secundaria: El Jardín Anidado",
    zoneId: "zone_nested_garden",
    npcId: "npc_gardener",
    xpReward: 50,
    itemReward: { id: "item_nested_seed", name: "Semilla Anidada", icon: "🌱", type: "relic", desc: "Un documento puede contener otros documentos y arreglos como valores." },
    instructions: "Reconstruye un documento con un subdocumento de perfil y un arreglo de habilidades.",
    type: "document_quiz",
    challenge: {
      prompt: "¿Qué ficha guarda el perfil como documento anidado y las habilidades como arreglo?",
      options: [
        { id: "nested", label: '{ nombre: "Luna", perfil: { clase: "maga", nivel: 4 }, habilidades: ["cura", "escudo"] }' },
        { id: "flattened", label: '{ nombre: "Luna", "perfil.clase": "maga", "habilidades": "cura, escudo" }' },
        { id: "misplaced", label: '{ nombre: { clase: "maga" }, perfil: ["nivel", 4], habilidades: { 0: "cura" } }' }
      ],
      answer: "nested",
      explanation: "Correcto. Los valores de un documento pueden ser otros documentos y arreglos, incluido un arreglo de documentos.",
      hint: "El perfil debe ser un objeto anidado y habilidades una lista entre corchetes.",
      example: '{ perfil: { clase: "maga" }, habilidades: ["cura", "escudo"] }'
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/document/"
  },

  quest_8: {
    id: "quest_8",
    title: "Misión Secundaria: La Ruta de los Puntos",
    zoneId: "zone_dot_tower",
    npcId: "npc_pathfinder",
    xpReward: 50,
    itemReward: { id: "item_dot_compass", name: "Brújula de Puntos", icon: "🧭", type: "relic", desc: "La notación de puntos llega a campos anidados y posiciones de arreglos." },
    instructions: "Elige las rutas de notación de puntos que llegan al campo anidado y al primer elemento del arreglo.",
    type: "document_quiz",
    challenge: {
      prompt: "En { perfil: { gremio: 'Loto' }, habilidades: ['cura', 'escudo'] }, ¿qué rutas apuntan a gremio y al primer elemento de habilidades?",
      options: [
        { id: "dot", label: '"perfil.gremio" y "habilidades.0"' },
        { id: "slash", label: '"perfil/gremio" y "habilidades[1]"' },
        { id: "whole", label: '"perfil" y "habilidades"' }
      ],
      answer: "dot",
      explanation: "Correcto. La notación de puntos concatena los nombres de campos anidados; el índice del arreglo empieza en cero, así que el primer elemento es habilidades.0.",
      hint: "MongoDB separa los niveles con un punto y usa índices de arreglo basados en cero.",
      example: '"perfil.gremio"  // campo anidado\\n"habilidades.0" // primer elemento'
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/document/"
  },

  quest_9: {
    id: "quest_9",
    title: "Misión Secundaria: La Bóveda de _id",
    zoneId: "zone_id_vault",
    npcId: "npc_guardian",
    xpReward: 50,
    itemReward: { id: "item_id_key", name: "Llave de _id", icon: "🔑", type: "relic", desc: "_id identifica de forma única el documento y no puede modificarse." },
    instructions: "Protege la identidad única del documento y detecta los nombres de campo duplicados.",
    type: "document_quiz",
    challenge: {
      prompt: "¿Qué regla respeta las restricciones de los documentos MongoDB?",
      options: [
        { id: "unique-id", label: "_id es único e inmutable; los nombres de campo dentro del documento deben ser únicos." },
        { id: "mutable-id", label: "_id puede repetirse y cambiarse; los nombres de campo duplicados se resuelven usando el último valor." },
        { id: "no-id", label: "_id es un campo opcional que puede repetirse libremente en una colección." }
      ],
      answer: "unique-id",
      explanation: "Correcto. _id es la llave primaria del documento: su valor debe ser único en la colección y es inmutable. Los nombres de campo también deben ser únicos dentro de cada documento.",
      hint: "Recuerda las reglas de unicidad para _id y para los nombres de campo.",
      example: '{ _id: ObjectId("..."), nombre: "Luna" }'
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/document/"
  },

  quest_10: {
    id: "quest_10",
    title: "Misión Secundaria: El Umbral de 16 MiB",
    zoneId: "zone_gridfs_gate",
    npcId: "npc_keeper",
    xpReward: 50,
    itemReward: { id: "item_gridfs_case", name: "Estuche GridFS", icon: "📦", type: "relic", desc: "GridFS permite almacenar archivos que superan el tamaño máximo de un documento." },
    instructions: "Resuelve cómo almacenar un archivo que supera el tamaño máximo de un documento BSON.",
    type: "document_quiz",
    challenge: {
      prompt: "Un archivo supera el tamaño máximo de un documento BSON. ¿Qué opción recomienda MongoDB?",
      options: [
        { id: "gridfs", label: "Usar GridFS para almacenar archivos mayores al límite de documento." },
        { id: "oversize", label: "Guardar todo en un único documento: no existe un límite de tamaño." },
        { id: "split-json", label: "Convertir el archivo a JSON; eso elimina el límite BSON." }
      ],
      answer: "gridfs",
      explanation: "Correcto. El tamaño máximo de un documento BSON es 16 mebibytes (MiB). MongoDB ofrece GridFS para almacenar archivos mayores que ese límite.",
      hint: "El límite no desaparece al convertir el contenido a JSON; recuerda la solución de MongoDB para archivos grandes.",
      example: "Documento BSON: máximo 16 MiB\\nArchivo mayor: GridFS"
    },
    sourceUrl: "https://www.mongodb.com/es/docs/manual/core/gridfs/"
  }
};
