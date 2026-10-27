import React, { useState } from 'react';
import { QUESTS, NPCS } from '../data/gameData';
import { sound } from '../utils/audio';

export default function ChallengeModal({
  questId,
  itemsDb,
  setItemsDb,
  onCompleteQuest,
  onWrongAnswer,
  onClose
}) {
  const quest = QUESTS[questId];
  const npc = NPCS[quest?.npcId];

  // Estados específicos para Desafío 1 (MongoDB CRUD)
  const [q1QueryChoice, setQ1QueryChoice] = useState(null);
  const [q1UpdateChoice, setQ1UpdateChoice] = useState(null);
  const [q1Executed, setQ1Executed] = useState(false);

  // Estados específicos para Desafío 2 (Mongoose Validation)
  const [q2ValidationConcept, setQ2ValidationConcept] = useState(null);
  const [q2RequiredCheck, setQ2RequiredCheck] = useState(true);
  const [q2EnumCheck, setQ2EnumCheck] = useState(true);
  const [q2MinCheck, setQ2MinCheck] = useState(true);
  const [q2Tested, setQ2Tested] = useState(false);

  // Estados específicos para Desafío 3 (Relations & Populate)
  const [q3Case1, setQ3Case1] = useState(null); // 'embed' | 'ref'
  const [q3Case2, setQ3Case2] = useState(null); // 'embed' | 'ref'
  const [q3PopulateCode, setQ3PopulateCode] = useState(null);
  const [q3Executed, setQ3Executed] = useState(false);

  // Estados específicos para Desafío 4 (Sanctum Integrator)
  const [q4Step1, setQ4Step1] = useState(null);
  const [q4Step2, setQ4Step2] = useState(null);
  const [q4Step3, setQ4Step3] = useState(null);
  const [q4Tested, setQ4Tested] = useState(false);
  const [documentAnswer, setDocumentAnswer] = useState(null);
  const [documentQuizSolved, setDocumentQuizSolved] = useState(false);

  // Feedback general del desafío
  const [feedback, setFeedback] = useState(null);

  if (!quest) return null;

  const handleWrongAnswer = () => {
    sound.playError();
    onWrongAnswer();
  };

  // --- LÓGICA DE VALIDACIÓN DESAFÍO 1 ---
  const handleExecuteQ1 = () => {
    sound.playSelect();
    if (q1QueryChoice !== 'mongo_find') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Revisa tu consulta de lectura: en MongoDB utilizamos "db.coleccion.find({ filtro })", no sintaxis de SQL ni funciones en memoria de JavaScript.'
      });
      return;
    }

    if (q1UpdateChoice !== 'set_update') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: '¡Cuidado con la actualización! En MongoDB debemos usar el operador atómico "$set: { stock: 15 }". Si omites $set, correrías el riesgo de sobreescribir el documento completo perdiendo campos.'
      });
      return;
    }

    // Actualizar la base de datos simulada en vivo
    setItemsDb((prev) =>
      prev.map((it) => (it.tipo === 'pocion' ? { ...it, stock: 15 } : it))
    );

    setQ1Executed(true);
    sound.playSuccess();
    setFeedback({
      status: 'success',
      text: '¡Invocación exitosa! Las pociones mágicas fueron encontradas y su stock fue actualizado a 15 de manera atómica con $set. La Maestra Bsonia asiente satisfecha.'
    });
  };

  // --- LÓGICA DE VALIDACIÓN DESAFÍO 2 ---
  const handleExecuteQ2 = () => {
    sound.playSelect();
    if (q2ValidationConcept !== 'both') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Sobre la validación: recuerda que MongoDB SÍ soporta validación NATIVA en el motor ($jsonSchema), pero con Node.js usamos Mongoose a nivel de APLICACIÓN para definir Schemas con tipos y capturar errores antes de tocar la base de datos.'
      });
      return;
    }

    if (!q2RequiredCheck || !q2EnumCheck || !q2MinCheck) {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Asegúrate de activar todas las reglas del Schema del Aventurero: "required: true" para el nombre, "enum" para restringir la clase y "min: 1" para el nivel.'
      });
      return;
    }

    setQ2Tested(true);
    sound.playSuccess();
    setFeedback({
      status: 'success',
      text: '¡Validación de Mongoose perfecta! Tu Schema rechazó limpiamente los datos corruptos ("NINJA" y nivel negativo) con ValidationError, y permitió el registro impecable de Valeria la Maga.'
    });
  };

  // --- LÓGICA DE VALIDACIÓN DESAFÍO 3 ---
  const handleExecuteQ3 = () => {
    sound.playSelect();
    if (q3Case1 !== 'embed') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'En el Caso 1 (Estadísticas fijas del Héroe), es mejor EMBEBER (Subdocumento): se consultan siempre juntas en combate, la relación es 1:1 fija y la lectura en una sola operación maximiza la velocidad.'
      });
      return;
    }

    if (q3Case2 !== 'ref') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'En el Caso 2 (Historial de 50.000 comentarios/misiones), ¡debes REFERENCIAR con ObjectId! Si embebes arreglos que crecen indefinidamente, romperás el límite estricto de 16 MB por documento de MongoDB.'
      });
      return;
    }

    if (q3PopulateCode !== 'populate') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Para resolver las referencias en Mongoose, usamos el método .populate("misiones") para unir los documentos referenciados.'
      });
      return;
    }

    setQ3Executed(true);
    sound.playSuccess();
    setFeedback({
      status: 'success',
      text: '¡Modelado de relaciones sobresaliente! Has combinado la velocidad de los subdocumentos embebidos con la escalabilidad de las referencias ObjectId y .populate().'
    });
  };

  // --- LÓGICA DE VALIDACIÓN DESAFÍO 4 (INTEGRADOR) ---
  const handleExecuteQ4 = () => {
    sound.playSelect();
    if (q4Step1 !== 'connect') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Paso 1: Para conectar Node.js a MongoDB mediante Mongoose se utiliza "await mongoose.connect(URI)".'
      });
      return;
    }

    if (q4Step2 !== 'separate_col') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Paso 2: Si un documento corre riesgo de superar los 16 MB por un arreglo ilimitado, la solución arquitectónica correcta es separar los registros en una colección propia y relacionarlos mediante ObjectId.'
      });
      return;
    }

    if (q4Step3 !== 'query_gte') {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: 'Paso 3: Para consultar niveles mayores o iguales a 3 se usa el operador "$gte: 3" junto a .populate("misiones").'
      });
      return;
    }

    setQ4Tested(true);
    sound.playSuccess();
    setFeedback({
      status: 'success',
      text: '¡Juicio del Custodio superado con honores! Has demostrado comprensión profunda de MongoDB, diseño de Schemas con Mongoose y modelado escalable de datos.'
    });
  };

  const handleExecuteDocumentQuiz = () => {
    sound.playSelect();
    if (!documentAnswer) {
      sound.playError();
      setFeedback({
        status: 'error',
        text: 'Elige una respuesta antes de comprobar el códice.'
      });
      return;
    }

    if (documentAnswer !== quest.challenge.answer) {
      handleWrongAnswer();
      setFeedback({
        status: 'error',
        text: quest.challenge.hint
      });
      return;
    }

    setDocumentQuizSolved(true);
    sound.playSuccess();
    setFeedback({
      status: 'success',
      text: quest.challenge.explanation
    });
  };

  const handleFinishAndClaim = () => {
    onCompleteQuest(quest.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="challenge-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Desafío */}
        <div className="challenge-header">
          <div className="challenge-title-box">
            <span className="challenge-icon">⚡</span>
            <div>
              <h2 className="challenge-title">{quest.title}</h2>
              <span className="challenge-mentor">Mentor: {npc?.name} ({npc?.title})</span>
            </div>
          </div>
          <button className="btn-close-challenge" onClick={onClose} aria-label="Cerrar códice">
            ✕
          </button>
        </div>

        {/* Cuerpo del Desafío: Vista Dividida (Instrucciones & Consola) */}
        <div className="challenge-body-grid">
          {/* LADO IZQUIERDO: FORMULARIO INTERACTIVO */}
          <div className="challenge-interactive-pane">
            <div className="challenge-instructions-box">
              <span className="inst-badge">OBJETIVO PEDAGÓGICO</span>
              <p className="inst-text">{quest.instructions}</p>
            </div>

            {/* CONTENIDO ESPECÍFICO SEGÚN LA MISIÓN */}
            {quest.id === 'quest_1' && (
              <div className="challenge-form">
                <div className="form-section">
                  <label className="form-label">
                    1. Selecciona la consulta MongoDB para filtrar pociones mágicas:
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q1QueryChoice === 'mongo_find' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q1_query"
                        checked={q1QueryChoice === 'mongo_find'}
                        onChange={() => setQ1QueryChoice('mongo_find')}
                      />
                      <code>db.items.find(&#123; tipo: "pocion", rareza: "magica" &#125;)</code>
                    </label>

                    <label className={`radio-pill ${q1QueryChoice === 'sql_select' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q1_query"
                        checked={q1QueryChoice === 'sql_select'}
                        onChange={() => setQ1QueryChoice('sql_select')}
                      />
                      <code>SELECT * FROM items WHERE tipo = 'pocion' AND rareza = 'magica'</code>
                    </label>

                    <label className={`radio-pill ${q1QueryChoice === 'js_filter' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q1_query"
                        checked={q1QueryChoice === 'js_filter'}
                        onChange={() => setQ1QueryChoice('js_filter')}
                      />
                      <code>items.filter(item =&gt; item.tipo === 'pocion') // (en memoria JS)</code>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    2. Selecciona la operación atómica para reabastecer el stock a 15:
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q1UpdateChoice === 'set_update' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q1_update"
                        checked={q1UpdateChoice === 'set_update'}
                        onChange={() => setQ1UpdateChoice('set_update')}
                      />
                      <code>db.items.updateMany(&#123; tipo: "pocion" &#125;, &#123; $set: &#123; stock: 15 &#125; &#125;)</code>
                    </label>

                    <label className={`radio-pill ${q1UpdateChoice === 'plain_replace' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q1_update"
                        checked={q1UpdateChoice === 'plain_replace'}
                        onChange={() => setQ1UpdateChoice('plain_replace')}
                      />
                      <code>db.items.updateMany(&#123; tipo: "pocion" &#125;, &#123; stock: 15 &#125;) // (Sin $set)</code>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  {!q1Executed ? (
                    <button type="button" className="btn-invoke-magic" onClick={handleExecuteQ1}>
                      ⚡ Ejecutar Consulta en MongoDB
                    </button>
                  ) : (
                    <button type="button" className="btn-claim-reward" onClick={handleFinishAndClaim}>
                      🎉 Reclamar Códice BSON y +150 EXP
                    </button>
                  )}
                </div>
              </div>
            )}

            {quest.id === 'quest_2' && (
              <div className="challenge-form">
                <div className="form-section">
                  <label className="form-label">
                    1. ¿Cómo funciona la validación de datos en el stack?
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q2ValidationConcept === 'both' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q2_concept"
                        checked={q2ValidationConcept === 'both'}
                        onChange={() => setQ2ValidationConcept('both')}
                      />
                      <span>
                        <strong>Ambas:</strong> MongoDB valida en motor con <code>$jsonSchema</code>, y en Node.js usamos <strong>Mongoose</strong> en aplicación para esquemas, tipos y validación previa.
                      </span>
                    </label>

                    <label className={`radio-pill ${q2ValidationConcept === 'only_libs' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q2_concept"
                        checked={q2ValidationConcept === 'only_libs'}
                        onChange={() => setQ2ValidationConcept('only_libs')}
                      />
                      <span>MongoDB no puede validar nada; depende 100% de librerías externas.</span>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    2. Configura las reglas del Schema de Mongoose para el modelo Aventurero:
                  </label>
                  <div className="schema-switches-box">
                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={q2RequiredCheck}
                        onChange={(e) => setQ2RequiredCheck(e.target.checked)}
                      />
                      <span>
                        <code>nombre: &#123; type: String, required: true &#125;</code> (Obligatorio)
                      </span>
                    </label>

                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={q2EnumCheck}
                        onChange={(e) => setQ2EnumCheck(e.target.checked)}
                      />
                      <span>
                        <code>clase: &#123; enum: ['GUERRERO', 'MAGO', 'PICARO'] &#125;</code> (Clases válidas)
                      </span>
                    </label>

                    <label className="switch-row">
                      <input
                        type="checkbox"
                        checked={q2MinCheck}
                        onChange={(e) => setQ2MinCheck(e.target.checked)}
                      />
                      <span>
                        <code>nivel: &#123; type: Number, min: 1, default: 1 &#125;</code> (Mínimo nivel 1)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  {!q2Tested ? (
                    <button type="button" className="btn-invoke-magic" onClick={handleExecuteQ2}>
                      ⚒️ Compilar y Probar Validación de Mongoose
                    </button>
                  ) : (
                    <button type="button" className="btn-claim-reward" onClick={handleFinishAndClaim}>
                      🎉 Reclamar Amuleto Mongoose y +200 EXP
                    </button>
                  )}
                </div>
              </div>
            )}

            {quest.id === 'quest_3' && (
              <div className="challenge-form">
                <div className="form-section">
                  <label className="form-label">
                    1. ¿Embebido o Referenciado? Decide para cada escenario:
                  </label>
                  
                  <div className="scenario-card">
                    <div className="scenario-title">Escenario A: Atributos fijos de combate del Héroe (Fuerza, Vitalidad, Agilidad)</div>
                    <div className="scenario-desc">Relación 1:1 fija. Se leen siempre juntos en cada acción de batalla.</div>
                    <div className="scenario-buttons">
                      <button
                        type="button"
                        className={`btn-choice-pill ${q3Case1 === 'embed' ? 'pill-active' : ''}`}
                        onClick={() => setQ3Case1('embed')}
                      >
                        Embeber (Subdocumento)
                      </button>
                      <button
                        type="button"
                        className={`btn-choice-pill ${q3Case1 === 'ref' ? 'pill-active' : ''}`}
                        onClick={() => setQ3Case1('ref')}
                      >
                        Referenciar (ObjectId)
                      </button>
                    </div>
                  </div>

                  <div className="scenario-card">
                    <div className="scenario-title">Escenario B: Historial de 50.000 comentarios y reportes de misiones</div>
                    <div className="scenario-desc">Relación 1:Muchos que crece sin límite. Riesgo de superar los 16 MB.</div>
                    <div className="scenario-buttons">
                      <button
                        type="button"
                        className={`btn-choice-pill ${q3Case2 === 'embed' ? 'pill-active' : ''}`}
                        onClick={() => setQ3Case2('embed')}
                      >
                        Embeber (Subdocumento)
                      </button>
                      <button
                        type="button"
                        className={`btn-choice-pill ${q3Case2 === 'ref' ? 'pill-active' : ''}`}
                        onClick={() => setQ3Case2('ref')}
                      >
                        Referenciar (ObjectId + ref)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    2. ¿Qué método de Mongoose resuelve las referencias de ObjectId?:
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q3PopulateCode === 'populate' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q3_pop"
                        checked={q3PopulateCode === 'populate'}
                        onChange={() => setQ3PopulateCode('populate')}
                      />
                      <code>Aventurero.findOne(&#123; nombre: 'Valeria' &#125;).populate('misiones')</code>
                    </label>

                    <label className={`radio-pill ${q3PopulateCode === 'join' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q3_pop"
                        checked={q3PopulateCode === 'join'}
                        onChange={() => setQ3PopulateCode('join')}
                      />
                      <code>Aventurero.findOne(&#123; nombre: 'Valeria' &#125;).join('misiones') // (Inexistente)</code>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  {!q3Executed ? (
                    <button type="button" className="btn-invoke-magic" onClick={handleExecuteQ3}>
                      🏛️ Resolver Vínculos y Poblado (.populate)
                    </button>
                  ) : (
                    <button type="button" className="btn-claim-reward" onClick={handleFinishAndClaim}>
                      🎉 Reclamar Llave de Referencias y +250 EXP
                    </button>
                  )}
                </div>
              </div>
            )}

            {quest.id === 'quest_4' && (
              <div className="challenge-form">
                <div className="form-section">
                  <label className="form-label">
                    Paso 1: ¿Cómo inicializamos la conexión de Mongoose en Node.js?
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q4Step1 === 'connect' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q4_step1"
                        checked={q4Step1 === 'connect'}
                        onChange={() => setQ4Step1('connect')}
                      />
                      <code>await mongoose.connect(process.env.MONGODB_URI);</code>
                    </label>
                    <label className={`radio-pill ${q4Step1 === 'wrong_init' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q4_step1"
                        checked={q4Step1 === 'wrong_init'}
                        onChange={() => setQ4Step1('wrong_init')}
                      />
                      <code>mongoose.openDatabase('localhost');</code>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    Paso 2: Un documento superó los 16 MB por acumular un array infinito. ¿Qué hacemos?
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q4Step2 === 'separate_col' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q4_step2"
                        checked={q4Step2 === 'separate_col'}
                        onChange={() => setQ4Step2('separate_col')}
                      />
                      <span>Mover los elementos a una colección separada y guardar solo sus <code>ObjectId</code>.</span>
                    </label>
                    <label className={`radio-pill ${q4Step2 === 'compress' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q4_step2"
                        checked={q4Step2 === 'compress'}
                        onChange={() => setQ4Step2('compress')}
                      />
                      <span>Aumentar el límite de BSON a 500 MB en la configuración de MongoDB. (Falso, es fijo).</span>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    Paso 3: Consulta final para encontrar aventureros de nivel $\ge$ 3 y poblar sus misiones:
                  </label>
                  <div className="options-radio-group">
                    <label className={`radio-pill ${q4Step3 === 'query_gte' ? 'pill-selected' : ''}`}>
                      <input
                        type="radio"
                        name="q4_step3"
                        checked={q4Step3 === 'query_gte'}
                        onChange={() => setQ4Step3('query_gte')}
                      />
                      <code>Aventurero.find(&#123; nivel: &#123; $gte: 3 &#125; &#125;).populate('misiones')</code>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  {!q4Tested ? (
                    <button type="button" className="btn-invoke-magic btn-gold-trial" onClick={handleExecuteQ4}>
                      👑 Someterse al Juicio del Gran Custodio
                    </button>
                  ) : (
                    <button type="button" className="btn-claim-reward" onClick={handleFinishAndClaim}>
                      🎓 Graduarse y Recibir Pergamino de Maestro (+400 EXP)
                    </button>
                  )}
                </div>
              </div>
            )}

            {quest.type === 'document_quiz' && (
              <div className="challenge-form">
                <div className="form-section">
                  <label className="form-label">{quest.challenge.prompt}</label>
                  <div className="options-radio-group">
                    {quest.challenge.options.map((option) => (
                      <label
                        key={option.id}
                        className={`radio-pill ${documentAnswer === option.id ? 'pill-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`document-quiz-${quest.id}`}
                          checked={documentAnswer === option.id}
                          onChange={() => setDocumentAnswer(option.id)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  {!documentQuizSolved ? (
                    <button type="button" className="btn-invoke-magic" onClick={handleExecuteDocumentQuiz}>
                      🔎 Comprobar respuesta
                    </button>
                  ) : (
                    <button type="button" className="btn-claim-reward" onClick={handleFinishAndClaim}>
                      🎉 Reclamar recompensa y +{quest.xpReward} EXP
                    </button>
                  )}
                </div>
                <a
                  className="document-quiz-source"
                  href={quest.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consultar documentación oficial de MongoDB ↗
                </a>
              </div>
            )}

            {/* CAJA DE FEEDBACK INMEDIATO */}
            {feedback && (
              <div className={`feedback-alert ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                <span className="feedback-icon">{feedback.status === 'success' ? '✨' : '⚠️'}</span>
                <p className="feedback-text">{feedback.text}</p>
              </div>
            )}
          </div>

          {/* LADO DERECHO: CONSOLA / MOTOR DE DATOS EN VIVO */}
          <aside className="challenge-live-console">
            <div className="console-title-bar">
              <span className="console-dots">● ● ●</span>
              <span className="console-caption">Consola en Vivo — MongoDB / Mongoose Engine</span>
            </div>

            <div className="console-content">
              {quest.id === 'quest_1' && (
                <>
                  <div className="console-tag">Colección: `db.items` ({itemsDb.length} documentos BSON)</div>
                  <pre className="code-display">
                    {JSON.stringify(itemsDb, null, 2)}
                  </pre>
                  {q1Executed && (
                    <div className="console-note-success">
                      ✓ 2 documentos de pociones actualizados con $set: &#123; stock: 15 &#125;.
                    </div>
                  )}
                </>
              )}

              {quest.id === 'quest_2' && (
                <>
                  <div className="console-tag">Mongoose Schema Visualizer</div>
                  <pre className="code-display">
{`const aventureroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: ${q2RequiredCheck ? '[true, "El nombre es obligatorio"]' : 'false'}
  },
  clase: {
    type: String,
    enum: ${q2EnumCheck ? "['GUERRERO', 'MAGO', 'PICARO']" : '/* Sin restricción */'}
  },
  nivel: {
    type: Number,
    min: ${q2MinCheck ? '[1, "Nivel mínimo es 1"]' : '0'},
    default: 1
  }
});`}
                  </pre>
                  {q2Tested && (
                    <div className="console-validation-result">
                      <div className="log-err">
                        ❌ Payload 1: &#123; nombre: "", clase: "NINJA", nivel: -3 &#125;<br/>
                        → ValidationError: Path `nombre` is required; `NINJA` is not a valid enum value.
                      </div>
                      <div className="log-ok">
                        ✅ Payload 2: &#123; nombre: "Valeria", clase: "MAGO", nivel: 2 &#125;<br/>
                        → Guardado exitoso con _id: 65a29f...
                      </div>
                    </div>
                  )}
                </>
              )}

              {quest.id === 'quest_3' && (
                <>
                  <div className="console-tag">Documento Resultante con .populate()</div>
                  <pre className="code-display">
{q3Executed
  ? `// ¡Referencias resueltas con .populate('misiones')!
{
  "_id": "65b991a0b...",
  "nombre": "Valeria la Maga",
  "atributos": {
    "vitalidad": 120,
    "mana": 250,
    "fuerza": 45
  }, // <-- Embebido (1:1)
  "misiones": [
    {
      "_id": "65b991a0b111",
      "titulo": "Rescate del Códice Antiguo",
      "recompensa": 500
    }
  ] // <-- Referenciado y Poblado con ObjectId
}`
  : `// Antes de populate: solo contiene el ObjectId
{
  "_id": "65b991a0b...",
  "nombre": "Valeria la Maga",
  "atributos": { "vitalidad": 120, "mana": 250 },
  "misiones": [ "65b991a0b111" ] // ObjectId
}`}
                  </pre>
                </>
              )}

              {quest.id === 'quest_4' && (
                <>
                  <div className="console-tag">Sanctum Gran Registro Final</div>
                  <pre className="code-display">
{q4Tested
  ? `// Sistema del Gremio Operando en Producción
[
  {
    "status": "ONLINE",
    "db": "mongodb_quest_cluster",
    "driver": "Mongoose v8+ / MongoDB 7.0",
    "colecciones": [
      "aventureros",
      "misiones",
      "logs_independientes",
      "items"
    ],
    "escriba_graduado": "Maestro del Archivo"
  }
]`
  : `// Aguardando el veredicto del Gran Custodio...
// Revisa tus respuestas a la izquierda y presiona el botón.`}
                  </pre>
                </>
              )}

              {quest.type === 'document_quiz' && (
                <>
                  <div className="console-tag">Ejemplo del Códice — Documentos BSON</div>
                  <pre className="code-display">{quest.challenge.example}</pre>
                  <div className="console-note-success">
                    {documentQuizSolved
                      ? '✓ Respuesta correcta. El concepto quedó registrado en el códice.'
                      : 'Analiza el ejemplo y elige una respuesta para continuar.'}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
