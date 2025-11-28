let currentEncodeExercise = null;
let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;

// Mini-game state
let mode = 'METAR';
let difficulty = '';
let currentCode = '';
let errors = [];
let selected = new Set();
let attempts = 3;
let hintsLeft = 0;
let currentHint = 1;

// Guess game state
let guessMode = 'metar';
let currentGuess = null;

// Speed Decode state
let currentSpeedMetar;
let timerInterval;
let timerSpeeds = {slow: 1.5, normal: 1, fast: 0.5};
let currentTimerSpeed = 'normal';

// Builder state
let currentBuilderCorrect;
let builderTimerInterval;

// Quiz state
let currentQuizCorrect;
let quizProgress = 0;

// TAF Predictor state
let currentTafItem;

// Flight Planner state
let currentPlannerItem;

// Stats for mini-games
let stats = JSON.parse(localStorage.getItem('meteoGameStats') || '{"score":0,"level":1,"games":0,"wins":0}');
let miniStats = {}; 

// --- PARSING ENGINE (TOKENIZERS) ---

/**
 * Main function to parse METAR/SPECI using a non-positional tokenizer approach.
 */
function parseMetar(codeString) {
    if (!codeString) return "";
    
    const cleanCode = codeString.trim().replace(/=+$/, ''); // Remove trailing =
    const tokens = cleanCode.split(/\s+/);
    const result = [];
    let isRemarkSection = false;
    let remarksTokens = [];

    // Iterate through tokens
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        // 1. Handle Remarks Section (Grab everything after RMK)
        if (token === 'RMK') {
            isRemarkSection = true;
            continue;
        }
        if (isRemarkSection) {
            remarksTokens.push(token);
            continue;
        }

        // 2. Token Identification Strategies
        // We check specific patterns. Order matters for ambiguous tokens.

        // Keywords
        if (['METAR', 'SPECI'].includes(token)) { result.push(`Тип сводки: ${token}`); continue; }
        if (token === 'COR') { result.push('COR: Исправленная сводка'); continue; }
        if (token === 'AUTO') { result.push('AUTO: Автоматическая станция'); continue; }
        if (token === 'NIL') { result.push('NIL: Нет данных'); continue; }
        if (token === 'CAVOK') { result.push('CAVOK: Видимость >10км, нет облаков <1500м, нет явлений'); continue; }
        if (token === 'NOSIG') { result.push('NOSIG: Без существенных изменений в ближайшие 2 часа'); continue; }

        // ICAO Station Code (4 uppercase letters, usually start)
        // Avoid confusing with weather codes like "RA" or cloud "FEW" by checking strictly 4 chars
        // and ensuring it's not a common weather/cloud keyword if ambiguous.
        if (/^[A-Z]{4}$/.test(token) && !['TEMPO', 'BECMG', 'AUTO'].includes(token)) {
            // A heuristic: Station usually comes early. 
            // But strict regex is usually safe for non-weather codes.
            result.push(`Аэропорт: ${token}`);
            continue;
        }

        // Date/Time (6 digits + Z)
        if (/^\d{6}Z$/.test(token)) {
            const day = token.substring(0, 2);
            const hour = token.substring(2, 4);
            const min = token.substring(4, 6);
            result.push(`Время наблюдения: ${day} числа, ${hour}:${min} UTC`);
            continue;
        }

        // Wind (e.g., 27005MPS, VRB02KT, ///05KMH)
        const windMatch = token.match(/^(VRB|\d{3}|\/\/\/)(P?\d{2,3}|\/\/)(G(P?\d{2,3}))?(KT|MPS|KMH)$/);
        if (windMatch) {
            const dir = windMatch[1] === 'VRB' ? 'Переменный' : (windMatch[1] === '///' ? 'Неизвестный' : `${windMatch[1]}°`);
            const speed = windMatch[2];
            const gust = windMatch[4] ? `, порывы ${windMatch[4]}` : '';
            const unit = windMatch[5];
            result.push(`Ветер: ${dir} ${speed}${gust} ${unit}`);
            continue;
        }

        // Variable Wind (e.g., 240V300)
        if (/^\d{3}V\d{3}$/.test(token)) {
            result.push(`Вариация ветра: от ${token.split('V')[0]}° до ${token.split('V')[1]}°`);
            continue;
        }

        // Visibility (4 digits, e.g. 9999, 0500)
        if (/^\d{4}$/.test(token)) {
            const vis = parseInt(token, 10);
            const desc = vis === 9999 ? '10 км и более' : (vis === 0 ? 'менее 50 м' : `${vis} метров`);
            result.push(`Видимость: ${desc}`);
            continue;
        }
        // Visibility (Statute Miles, e.g. 10SM, 1/2SM)
        if (/^(\d{1,2}|M\d{1,4})(\/\d)?SM$/.test(token)) {
            result.push(`Видимость: ${token.replace('SM', '')} миль`);
            continue;
        }

        // Directional Visibility (e.g. 4000NE)
        if (/^\d{4}[NSEW]{1,2}$/.test(token)) {
            result.push(`Видимость: ${parseInt(token)}м (${token.replace(/\d/g, '')})`);
            continue;
        }

        // RVR (Runway Visual Range) e.g., R10/1000, R28L/P2000
        if (/^R\d{2}[LCR]?\/.+$/.test(token)) {
            // Basic parsing of RVR
            const [runway, value] = token.split('/');
            let desc = `ВПП ${runway.substring(1)}`;
            
            if (value.includes('V')) {
                const [v1, v2] = value.split('V');
                desc += `: от ${v1.replace(/[PM]/,'')} до ${v2.replace(/[PM]/,'')} м`;
            } else {
                let prefix = value.includes('P') ? 'более ' : (value.includes('M') ? 'менее ' : '');
                let trend = value.includes('U') ? ' (улучшается)' : (value.includes('D') ? ' (ухудшается)' : (value.includes('N') ? ' (без изм.)' : ''));
                let valNum = value.replace(/[PMUDN]/g, '');
                desc += `: ${prefix}${valNum} м${trend}`;
            }
            result.push(`RVR: ${desc}`);
            continue;
        }

        // Weather Phenomena (e.g., +RA, -SN, FG, VCTS)
        // Matches standard format: Intensity/Proximity + Descriptor + Phenomenon
        const wxRegex = /^([-+]|VC|RE)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS)+$/;
        if (wxRegex.test(token)) {
            result.push(`Явление: ${decodeWeatherToken(token)}`);
            continue;
        }

        // Cloud Layers (e.g., SCT030, BKN020CB, VV002)
        const cloudMatch = token.match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|VV)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
        if (cloudMatch) {
            const type = cloudMatch[1];
            const heightCode = cloudMatch[2];
            const cloudType = cloudMatch[3] ? ` (${CLOUD_SUFFIX[cloudMatch[3]] || cloudMatch[3]})` : '';
            
            let typeDesc = CLOUD_TYPES[type] || type;
            let heightDesc = heightCode === '///' ? 'высота не определена' : `${parseInt(heightCode, 10) * 100} футов`;
            
            if (type === 'VV') {
                result.push(`Вертикальная видимость: ${heightDesc}`);
            } else {
                result.push(`Облачность: ${typeDesc} на ${heightDesc}${cloudType}`);
            }
            continue;
        }

        // Temperature / Dew Point (e.g. 12/10, M02/M05, 10/, //)
        if (/^(M?\d{2}|\/\/)\/(M?\d{2}|\/\/)?$/.test(token)) {
            const [t, d] = token.split('/');
            const formatT = (val) => val === '//' ? 'Н/Д' : parseInt(val.replace('M', '-')) + '°C';
            result.push(`Температура: ${formatT(t)}${d ? `, Точка росы: ${formatT(d)}` : ''}`);
            continue;
        }

        // Pressure (QNH) e.g. Q1013, A2992
        if (/^[QA]\d{4}$/.test(token)) {
            if (token.startsWith('Q')) {
                result.push(`Давление (QNH): ${parseInt(token.substring(1))} гПа`);
            } else {
                const hg = token.substring(1);
                result.push(`Давление: ${hg.substring(0,2)}.${hg.substring(2)} дюймов рт.ст.`);
            }
            continue;
        }

        // Wind Shear (e.g. WS R24)
        if (token.startsWith('WS')) {
            if (token === 'WS') {
                // Look ahead for runway? Or just push and wait for next token?
                // Simple approach: just mark it
                result.push('Сдвиг ветра (WS)');
            } else if (token === 'WSALL') {
                result.push('Сдвиг ветра на всех ВПП');
            } else {
                result.push(`Сдвиг ветра: ${token}`);
            }
            continue;
        }

        // If no match
        result.push(`Нераспознанная группа: ${token}`);
    }

    if (remarksTokens.length > 0) {
        result.push(`RMK (Замечания): ${remarksTokens.join(' ')}`);
    }

    return result.join('\n');
}

/**
 * Main function to parse TAF using a Group-based tokenizer approach.
 */
function parseTaf(codeString) {
    if (!codeString) return "";

    const cleanCode = codeString.trim().replace(/=+$/, '');
    const rawTokens = cleanCode.split(/\s+/);
    
    // Structure:
    // Header -> Period -> [Main Body] -> [Changes (TEMPO/BECMG...)]
    
    const output = [];
    let currentGroupTokens = [];
    let currentGroupLabel = "Основной прогноз (или начало)";
    
    // Helper to flush current group
    const processGroup = (label, tokens) => {
        if (tokens.length === 0) return;
        output.push(`\n--- ${label} ---`);
        // Use a mini-metar parser for the body of the TAF group
        // We reuse logic but need to be careful with TAF specific tokens like NSW, P6SM
        const decoded = parseTafBody(tokens);
        output.push(decoded);
    };

    const changeKeywords = ['TEMPO', 'BECMG', 'FM', 'PROB30', 'PROB40', 'INTER'];

    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];

        // Check if this token starts a new change group
        // Note: FM is tricky because it's FM123456 (attached)
        let isChange = false;
        let changeLabel = "";

        if (['TEMPO', 'BECMG', 'INTER'].includes(token)) {
            isChange = true;
            changeLabel = `${token} (Изменение/Временно)`;
        } else if (['PROB30', 'PROB40'].includes(token)) {
            isChange = true;
            changeLabel = `${token} (Вероятность ${token.replace('PROB', '')}%)`;
        } else if (token.startsWith('FM') && token.length > 4 && /\d/.test(token)) {
            isChange = true;
            const time = token.substring(2);
            changeLabel = `FM (C ${time.substring(0,2)} числа ${time.substring(2,4)}:${time.substring(4,6)} UTC)`;
        }

        if (isChange) {
            // Process previous group
            processGroup(currentGroupLabel, currentGroupTokens);
            // Reset for new group
            currentGroupLabel = changeLabel;
            currentGroupTokens = [];
            
            // If it was PROB+TEMPO (e.g. PROB30 TEMPO), we might need to handle the next token if it's also a keyword
            // But usually they are separate tokens. PROB30 TEMPO...
            // If this token is just PROB30, the NEXT might be TEMPO.
            // Our logic handles them as separate triggers, which splits them. 
            // Better: Check lookahead.
            
            // Special handling for PROB + TEMPO combo in display
            if (token.startsWith('PROB')) {
                // Just add to label, don't consume next token yet if it's TEMPO
                // Actually, standard TAF is "PROB30 TEMPO".
                // Let's just keep the token in the group for now? No, they define the block.
            }
        } else {
            currentGroupTokens.push(token);
        }
    }
    // Process last group
    processGroup(currentGroupLabel, currentGroupTokens);

    return output.join('\n');
}

/**
 * Parses the body of a TAF group (Wind, Vis, Wx, Clouds)
 * Similar to METAR but handles TAF specifics like time ranges (1812/1912), NSW, TX/TN
 */
function parseTafBody(tokens) {
    const result = [];
    
    for (let token of tokens) {
        // Skip keywords if they ended up here
        if (['TEMPO', 'BECMG', 'PROB30', 'PROB40'].includes(token)) {
            result.push(`>> ${token}`); 
            continue;
        }

        // TAF Time Range (e.g. 0512/0612)
        if (/^\d{4}\/\d{4}$/.test(token)) {
            const [start, end] = token.split('/');
            result.push(`Период действия: ${start.substring(0,2)} числа ${start.substring(2)}:00 -> ${end.substring(0,2)} числа ${end.substring(2)}:00 UTC`);
            continue;
        }

        // Max/Min Temp (TX30/1512Z)
        if (token.startsWith('TX') || token.startsWith('TN')) {
            const type = token.startsWith('TX') ? 'Макс. темп.' : 'Мин. темп.';
            const val = token.substring(2).split('/')[0];
            result.push(`${type}: ${val}°C`);
            continue;
        }

        // NSW (No Significant Weather)
        if (token === 'NSW') {
            result.push('NSW: Без особых явлений погоды');
            continue;
        }

        // P6SM (Plus 6 Statute Miles)
        if (token === 'P6SM') {
            result.push('Видимость: Более 6 миль');
            continue;
        }

        // Reuse METAR token logic for common elements
        const metarParsed = parseMetarToken(token);
        if (metarParsed) {
            result.push(metarParsed);
        } else if (!['TAF', 'AMD', 'COR'].includes(token)) {
            // If it's the station code or time
            if (/^[A-Z]{4}$/.test(token)) result.push(`Аэропорт: ${token}`);
            else if (/^\d{6}Z$/.test(token)) result.push(`Выпущено: ${token.substring(2,4)}:${token.substring(4,6)} UTC`);
            else result.push(`${token}`);
        }
    }
    return result.join('\n');
}

/**
 * Single token parser reused by TAF
 */
function parseMetarToken(token) {
    if (token === 'CAVOK') return 'CAVOK';
    if (token === 'SKC' || token === 'CLR') return 'Ясно';
    
    // Wind
    const windMatch = token.match(/^(VRB|\d{3}|\/\/\/)(P?\d{2,3}|\/\/)(G(P?\d{2,3}))?(KT|MPS|KMH)$/);
    if (windMatch) {
         const speed = windMatch[2];
         const unit = windMatch[5];
         return `Ветер: ${windMatch[1]}°, ${speed} ${unit}` + (windMatch[4] ? ` порывы ${windMatch[4]}` : '');
    }

    // Vis
    if (/^\d{4}$/.test(token)) return `Видимость: ${token}м`;
    
    // Wx
    if (/^([-+]|VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS)+$/.test(token)) {
        return `Погода: ${decodeWeatherToken(token)}`;
    }

    // Cloud
    if (/^(FEW|SCT|BKN|OVC|VV)(\d{3}|\/\/\/)/.test(token)) {
        const type = token.substring(0,3);
        const h = token.substring(3,6);
        return `Облака: ${type} ${h === '///' ? '' : (parseInt(h)*100)+'ft'}`;
    }

    return null;
}

function decodeWeatherToken(code) {
    // Break down weather code
    // Iterate specific 2-letter codes.
    // Note: This relies on WEATHER_CODES being available in gameData.js
    let desc = "";
    let tempCode = code;
    
    if (tempCode.startsWith('+')) { desc += "Сильный "; tempCode = tempCode.substring(1); }
    else if (tempCode.startsWith('-')) { desc += "Слабый "; tempCode = tempCode.substring(1); }
    else if (tempCode.startsWith('VC')) { desc += "В окрестностях: "; tempCode = tempCode.substring(2); }
    else if (tempCode.startsWith('RE')) { desc += "Недавний: "; tempCode = tempCode.substring(2); }

    // Try to match 2-letter chunks
    while (tempCode.length >= 2) {
        let chunk = tempCode.substring(0, 2);
        if (WEATHER_CODES[chunk]) {
            desc += WEATHER_CODES[chunk] + " ";
            tempCode = tempCode.substring(2);
        } else {
            // Safety break to prevent infinite loop on unknown codes
            desc += chunk + "? ";
            tempCode = tempCode.substring(2);
        }
    }
    return desc.trim();
}

// Fallback parsers for other types (placeholders or basic regex)
function parseKn01(code) { return "Расшифровка КН-01: См. справочник (Модуль в разработке)"; }
function parseGamet(code) { return "GAMET: Прогноз для низких высот. " + code; }
function parseSigmet(code) { return "SIGMET: Информация об опасных явлениях. " + code; }
function parseWarep(code) { return "WAREP: Сводка с радара. " + code; }
function parseKn04(code) { return "КН-04: Штормовое оповещение. " + code; }
function parseAirmet(code) { return "AIRMET: Опасные явления для низких полетов. " + code; }


// --- APP & GAME LOGIC ---

document.addEventListener('DOMContentLoaded', function () {
    newEncodeExercise();
    updateTrainerStats();
    loadMiniStats(); 
    
    const devTypes = ['kn01', 'gamet', 'sigmet', 'warep', 'kn04', 'airmet'];
    
    // Tab switching logic for Trainer
    document.querySelectorAll('.code-type-selector .code-type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const devMessageEl = document.getElementById('dev-message');
            const modeSelectorEl = document.querySelector('.mode-selector');
            const inputSectionEl = document.querySelector('.input-section');
            
            document.querySelectorAll('.code-type-selector .code-type-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            const type = this.dataset.type;
            
            if (devTypes.includes(type)) {
                // Simplified view for dev types
                if (modeSelectorEl) modeSelectorEl.style.display = 'none';
                if (devMessageEl) {
                    devMessageEl.style.display = 'block';
                    devMessageEl.textContent = 'Модуль в базовом режиме';
                }
            } else {
                if (modeSelectorEl) modeSelectorEl.style.display = '';
                if (devMessageEl) devMessageEl.style.display = 'none';
            }
            if (inputSectionEl) inputSectionEl.style.display = '';

            const info = codeInstructions[type];
            if (info) {
                document.getElementById('decode-instructions').innerHTML = info.decode;
                document.getElementById('sidebar-hints').innerHTML = `<strong>${info.title}</strong><br><br>` + info.hints.replace(/\n/g, '<br>');
            }
        });
    });

    // Mode switching (Decode/Practice/Encode)
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.mode-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const mode = this.dataset.mode;
            document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
            document.getElementById(mode + '-content').classList.add('active');
        });
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    
    initTopMenu();
    initGameSelector();
    if (document.getElementById('score')) updateStats();
});

const codeInstructions = {
    metar: {
        title: "METAR / SPECI",
        decode: `<strong>Режим авторасшифровки METAR:</strong><br>Вставьте код — получите полную расшифровку.<br>
                         Поддерживается: ветер, видимость, RVR, погода, облачность, температура, давление, тренд, RMK.`,
        hints: `• ICAO код аэродрома<br>
                        • День и время (Z)<br>
                        • Ветер: 05007MPS или 18015G25KT<br>
                        • Видимость: 9999, 6000, CAVOK<br>
                        • Погода: RA, TS, +SHRA<br>
                        • Облачность: BKN020CB<br>
                        • Температура/точка росы: 15/12 или M02/M04<br>
                        • Q1013, A2992<br>
                        • NOSIG, BECMG, TEMPO`
    },
    taf: {
        title: "TAF (Прогноз по аэродрому)",
        decode: `<strong>TAF — прогноз погоды</strong><br>Включает период действия, изменения FM, TEMPO, BECMG, PROB.`,
        hints: ` TAF AMD, COR<br>
                        • Период: 151200/161200<br>
                        • FM151300 — с 13:00<br>
                        • TEMPO 1514/1518 — временно<br>
                        • BECMG 1520/1522 — постепенное изменение<br>
                        • PROB30, PROB40 — вероятность`
    },
};

// --- STATS LOGIC ---

function loadMiniStats() {
    try {
        miniStats = JSON.parse(localStorage.getItem('miniGameStats') || '{}');
    } catch (e) {
        miniStats = {};
    }
    const games = ['find-error','guess-code','speed-decode','code-builder','quiz-bowl','taf-predictor','flight-planner'];
    games.forEach(k => {
        if (!miniStats[k]) miniStats[k] = { games:0, wins:0, totalPoints:0, bestPoints:0, lastPoints:0 };
    });
    localStorage.setItem('miniGameStats', JSON.stringify(miniStats));
    renderMiniStatsForAll();
}

function saveMiniStats() {
    localStorage.setItem('miniGameStats', JSON.stringify(miniStats));
}

function updateMiniStats(gameKey, outcome, points) {
    if (!miniStats[gameKey]) miniStats[gameKey] = { games:0, wins:0, totalPoints:0, bestPoints:0, lastPoints:0 };
    miniStats[gameKey].games++;
    if (outcome) miniStats[gameKey].wins++;
    miniStats[gameKey].totalPoints += (points || 0);
    miniStats[gameKey].lastPoints = (points || 0);
    if (!miniStats[gameKey].bestPoints || (points || 0) > miniStats[gameKey].bestPoints) miniStats[gameKey].bestPoints = (points || 0);
    saveMiniStats();
    renderMiniStats(gameKey);
}

function renderMiniStats(gameKey) {
    try {
        const statsMap = {
            'find-error': { scoreId: 'score', levelId: 'level' },
            'guess-code': { scoreId: 'guess-score', levelId: 'guess-level' },
            'speed-decode': { scoreId: 'speed-score', levelId: 'speed-level' },
            'code-builder': { scoreId: 'builder-score', levelId: 'builder-level' },
            'quiz-bowl': { scoreId: 'quiz-score', levelId: 'quiz-level' },
            'taf-predictor': { scoreId: 'taf-score', levelId: 'taf-level' },
            'flight-planner': { scoreId: 'planner-score', levelId: 'planner-level' }
        };

        const ids = statsMap[gameKey];
        if (ids) {
            const el = document.getElementById(ids.scoreId);
            if (el) el.textContent = miniStats[gameKey].lastPoints || 0; // Show last points or total? Usually total for session is nice
            // Actually let's show Total Points for score in the UI to be addictive
            if (el) el.textContent = miniStats[gameKey].totalPoints || 0;
            
            const lvl = document.getElementById(ids.levelId);
            if (lvl) lvl.textContent = Math.max(1, Math.floor((miniStats[gameKey].totalPoints||0)/150) + 1);
        }
    } catch(e) { console.warn('renderMiniStats error', e); }
}

function renderMiniStatsForAll() {
    ['find-error','guess-code','speed-decode','code-builder','quiz-bowl','taf-predictor','flight-planner']
        .forEach(k => renderMiniStats(k));
}

// --- GAME RESET & UI HELPERS ---

function resetMiniGame() {
    try { clearInterval(timerInterval); } catch(e){}
    try { clearInterval(builderTimerInterval); } catch(e){}
    const hideIds = ['new-task-speed-decode','new-task-code-builder','new-task-taf-predictor','new-task-quiz-bowl'];
    hideIds.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    
    // Clear Speed Decode
    try {
        ['speed-wind','speed-vis','speed-temp','speed-qnh'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = ''; el.classList.remove('correct-input','incorrect-input'); }
        });
        const speedResult = document.getElementById('speed-result'); if (speedResult) speedResult.innerHTML = '';
    } catch(e){}

    // Clear Builder
    try {
        const pool = document.getElementById('group-pool'); if (pool) pool.innerHTML = '';
        const dz = document.getElementById('builder-dropzone'); if (dz) dz.innerHTML = '';
        const builderResult = document.getElementById('builder-result'); if (builderResult) builderResult.innerHTML = '';
    } catch(e){}

    // Clear Quiz
    try {
        const qopts = document.getElementById('quiz-options'); if (qopts) qopts.innerHTML = '';
        const qres = document.getElementById('quiz-result'); if (qres) qres.innerHTML = '';
        document.getElementById('quiz-progress') && (document.getElementById('quiz-progress').textContent = '0/10');
    } catch(e){}

    // Clear Guess
    try {
        const gres = document.getElementById('guess-result'); if (gres) gres.innerHTML = '';
        const ginput = document.getElementById('guess-input'); if (ginput) ginput.value = '';
        document.getElementById('guess-check') && (document.getElementById('guess-check').disabled = false);
        document.getElementById('guess-check') && (document.getElementById('guess-check').textContent = 'Проверить');
    } catch(e){}

    // Clear Planner/Taf
    try {
        document.querySelector('#planner-result') && (document.querySelector('#planner-result').textContent = '');
        document.querySelector('#planner-decision') && (document.querySelector('#planner-decision').value = '');
        document.querySelector('#taf-result') && (document.querySelector('#taf-result').textContent = '');
        document.querySelector('#taf-answer') && (document.querySelector('#taf-answer').value = '');
    } catch(e){}

    // Clear Find Error
    try {
        document.querySelectorAll('#meteo-code span').forEach(span => {
            span.style.background = '';
            span.style.color = '';
            span.style.transform = '';
            span.onclick = () => {};
            span.classList.remove('selected');
        });
        const attemptsEl = document.getElementById('attempts'); if (attemptsEl) attemptsEl.textContent = '3';
        const resultEl = document.getElementById('result'); if (resultEl) resultEl.innerHTML = '';
        const correctGroupsEl = document.getElementById('correct-groups'); if (correctGroupsEl) { correctGroupsEl.style.display = 'none'; correctGroupsEl.innerHTML = ''; }
        const checkBtn = document.getElementById('check-btn'); if (checkBtn) { checkBtn.disabled = true; checkBtn.textContent = 'Проверить'; }
    } catch(e){}

    // Clear Effects
    try {
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display = 'none'; }
    } catch(e){}
    const animContainer = document.getElementById('animation-container');
    if (animContainer) {
        animContainer.innerHTML = '';
        animContainer.style.display = 'none';
    }
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => reel.textContent = '');
    const slotResult = document.getElementById('slot-result');
    if (slotResult) slotResult.textContent = '';
    const lever = document.getElementById('lever');
    if (lever) lever.disabled = false;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function toggleAccordion(element) {
    const expanded = element.getAttribute('aria-expanded') === 'true';
    element.setAttribute('aria-expanded', !expanded);
    const panel = element.nextElementSibling;
    panel.style.display = expanded ? 'none' : 'block';
}

// --- TRAINER LOGIC (DECODE/ENCODE) ---

function decodeCode() {
    document.getElementById('loading-decode').style.display = 'block';
    setTimeout(() => {
        const input = document.getElementById('metar-input').value.trim().toUpperCase();
        const resultDiv = document.getElementById('decode-result');
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let decoded = '';
        
        if (codeType === 'metar') decoded = parseMetar(input);
        else if (codeType === 'taf') decoded = parseTaf(input);
        else if (codeType === 'kn01') decoded = parseKn01(input);
        else if (codeType === 'gamet') decoded = parseGamet(input);
        else if (codeType === 'sigmet') decoded = parseSigmet(input);
        else if (codeType === 'warep') decoded = parseWarep(input);
        else if (codeType === 'kn04') decoded = parseKn04(input);
        else if (codeType === 'airmet') decoded = parseAirmet(input);
        
        resultDiv.textContent = decoded || 'Ошибка: Пожалуйста, введите код';
        resultDiv.className = decoded.startsWith('Ошибка') ? 'result error' : 'result';
        document.getElementById('loading-decode').style.display = 'none';
        
        // Fun feature: Update background based on code content?
        // (Not fully implemented to keep CSS simple, but logic is ready)
    }, 500);
}

function checkDecode() {
    document.getElementById('loading-practice-decode').style.display = 'block';
    setTimeout(() => {
        const userAnswer = document.getElementById('user-decode').value.trim().toLowerCase();
        const resultDiv = document.getElementById('practice-decode-result');
        const comparisonDiv = document.getElementById('decode-comparison');
        
        if (!userAnswer) {
            resultDiv.textContent = 'Ошибка: Введите вашу расшифровку';
            resultDiv.className = 'result error';
            document.getElementById('loading-practice-decode').style.display = 'none';
            return;
        }
        
        currentPracticeCode = document.getElementById('practice-code').textContent.trim();
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let correctDecoded = '';
        
        // Use our new parsers
        if (codeType === 'metar') correctDecoded = parseMetar(currentPracticeCode).toLowerCase();
        else if (codeType === 'taf') correctDecoded = parseTaf(currentPracticeCode).toLowerCase();
        else correctDecoded = "Расшифровка не поддерживается в этом режиме";

        const userLines = userAnswer.split('\n').map(line => line.trim()).filter(line => line);
        const correctLines = correctDecoded.split('\n').map(line => line.trim()).filter(line => line);
        let matchCount = 0;
        
        // Heuristic matching
        correctLines.forEach((correct, idx) => {
            // Check if user has this info somewhere
            if (userLines.some(ul => ul.includes(correct) || correct.includes(ul))) matchCount++;
        });
        
        const accuracy = correctLines.length > 0 ? (matchCount / correctLines.length) * 100 : 0;
        
        if (accuracy > 70) {
            resultDiv.textContent = 'Отлично! Расшифровка верная! (Точность: ' + accuracy.toFixed(0) + '%)';
            resultDiv.className = 'result success';
            comparisonDiv.style.display = 'none';
            trainerStats.correctDecoded++;
            trainerStats.sessionCorrect++;
        } else {
            resultDiv.textContent = 'Есть ошибки. Точность: ' + accuracy.toFixed(0) + '%. Сравните с правильной расшифровкой:';
            resultDiv.className = 'result error';
            displayLineComparison(userLines, correctLines, 'decode');
            comparisonDiv.style.display = 'grid';
            const codeTypeKey = document.querySelector('.code-type-btn.active').dataset.type;
            trainerStats.errorsByType[codeTypeKey]++;
        }
        trainerStats.totalDecoded++;
        trainerStats.sessionDecoded++;
        updateTrainerStats();
        document.getElementById('loading-practice-decode').style.display = 'none';
    }, 500);
}

function displayLineComparison(userLines, correctLines, mode) {
    const userDisplay = document.getElementById(mode === 'decode' ? 'user-decode-display' : 'user-answer-display');
    const correctDisplay = document.getElementById(mode === 'decode' ? 'correct-decode-display' : 'correct-answer-display');
    userDisplay.innerHTML = '';
    correctDisplay.innerHTML = '';
    
    // Display all correct lines
    correctLines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'comparison-group correct';
        div.textContent = line;
        correctDisplay.appendChild(div);
    });

    // Display user lines
    userLines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'comparison-group'; // We don't color user lines red/green to avoid complexity in logic
        div.textContent = line;
        userDisplay.appendChild(div);
    });
}

function newEncodeExercise() {
    const randomIndex = Math.floor(Math.random() * weatherDatabase.length);
    currentEncodeExercise = weatherDatabase[randomIndex];
    document.getElementById('weather-description').textContent = currentEncodeExercise.description;
    document.getElementById('user-encode').value = '';
    document.getElementById('practice-encode-result').textContent = 'Результат проверки кодирования...';
    document.getElementById('practice-encode-result').className = 'result';
    document.getElementById('encode-comparison').style.display = 'none';
    document.getElementById('encode-hint').style.display = 'none';
    hintStep = 0;
    document.getElementById('next-hint-btn').style.display = 'none';
}

function checkEncode() {
    document.getElementById('loading-practice-encode').style.display = 'block';
    setTimeout(() => {
        const userCode = document.getElementById('user-encode').value.trim();
        const resultDiv = document.getElementById('practice-encode-result');
        const comparisonDiv = document.getElementById('encode-comparison');
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        
        if (!userCode) {
            resultDiv.textContent = 'Ошибка: Введите ваш код';
            resultDiv.className = 'result error';
            document.getElementById('loading-practice-encode').style.display = 'none';
            return;
        }
        
        const normalizeCode = code => code.trim().toUpperCase().replace(/\s+/g, ' ').replace(/=+$/, '');
        const userNorm = normalizeCode(userCode);
        const correctNorm = normalizeCode(currentEncodeExercise.code);
        
        if (userNorm === correctNorm) {
            resultDiv.textContent = 'Отлично! Код закодирован верно!';
            resultDiv.className = 'result success';
            comparisonDiv.style.display = 'none';
            trainerStats.correctDecoded++;
            trainerStats.sessionCorrect++;
        } else {
            resultDiv.textContent = 'Есть ошибки.';
            resultDiv.className = 'result error';
            comparisonDiv.style.display = 'grid';
            
            // Simple comparison
            document.getElementById('user-answer-display').textContent = userNorm;
            document.getElementById('correct-answer-display').textContent = correctNorm;
            
            const codeTypeKey = document.querySelector('.code-type-btn.active').dataset.type;
            trainerStats.errorsByType[codeTypeKey]++;
        }
        trainerStats.totalDecoded++;
        trainerStats.sessionDecoded++;
        updateTrainerStats();
        document.getElementById('loading-practice-encode').style.display = 'none';
    }, 500);
}

function showEncodeHint() {
    if (!currentEncodeExercise) return;
    hintStep = 1;
    updateHint();
    document.getElementById('next-hint-btn').style.display = 'inline-block';
}

function showNextHint() {
    hintStep++;
    updateHint();
}

function updateHint() {
    const code = currentEncodeExercise.code.trim();
    const groups = code.split(/\s+/);
    let hint = '';
    for (let i = 0; i < groups.length; i++) {
        if (i < hintStep) {
            hint += groups[i] + ' ';
        } else {
            hint += '-'.repeat(groups[i].length) + ' ';
        }
    }
    document.getElementById('encode-hint').textContent = hint.trim();
    document.getElementById('encode-hint').style.display = 'block';
    if (hintStep >= groups.length) {
        document.getElementById('next-hint-btn').style.display = 'none';
    }
}

function newPracticeCode() {
    const codes = {
        metar: ['UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG', 'UUDD 141600Z 03005MPS 9999 BKN015 15/10 Q1012'],
        taf: ['TAF UUWW 141600Z 1418/1524 03005MPS 9999 BKN015 TX15/1412Z TN10/1503Z'],
    };
    const codeType = document.querySelector('.code-type-btn.active').dataset.type;
    const typeCodes = codes[codeType] || codes.metar;
    const randomCode = typeCodes[Math.floor(Math.random() * typeCodes.length)];
    document.getElementById('practice-code').textContent = randomCode;
    document.getElementById('user-decode').value = '';
    document.getElementById('practice-decode-result').textContent = 'Результат проверки...';
    document.getElementById('practice-decode-result').className = 'result';
    document.getElementById('decode-comparison').style.display = 'none';
}

function clearFields() {
    document.getElementById('metar-input').value = '';
    document.getElementById('decode-result').textContent = 'Здесь появится расшифровка кода...';
    document.getElementById('decode-result').className = 'result';
}

function copyCode(elementId) {
    const el = document.getElementById(elementId);
    const text = (el.value !== undefined) ? el.value : el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Код скопирован!');
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
    });
}

function updateTrainerStats() {
    const percent = trainerStats.sessionDecoded > 0 ? Math.round((trainerStats.sessionCorrect / trainerStats.sessionDecoded) * 100) : 0;
    document.getElementById('trainer-level').textContent = trainerStats.level;
    document.getElementById('decoded-count').textContent = trainerStats.sessionDecoded;
    document.getElementById('correct-percent').textContent = percent + '%';
    document.getElementById('level-progress').value = trainerStats.totalDecoded % 50;
    const badge = percent > 90 ? 'Эксперт' : percent > 70 ? 'Профи' : 'Новичок';
    document.getElementById('badge').textContent = `Бейдж: ${badge}`;
    
    const errorsList = document.getElementById('errors-by-type');
    errorsList.innerHTML = '';
    for (const type in trainerStats.errorsByType) {
        if (trainerStats.errorsByType[type] > 0) {
            const li = document.createElement('li');
            li.textContent = `${type.toUpperCase()}: ${trainerStats.errorsByType[type]}`;
            errorsList.appendChild(li);
        }
    }
    
    if (trainerStats.totalDecoded >= trainerStats.level * 50) {
        trainerStats.level++;
    }
    localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
}

function resetStats() {
    if (confirm('Сбросить статистику?')) {
        trainerStats = {"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}};
        localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
        updateTrainerStats();
    }
}

function updateStats() {
    document.querySelectorAll('.score').forEach(el => el.textContent = stats.score);
    document.querySelectorAll('.level').forEach(el => el.textContent = stats.level);
    localStorage.setItem('meteoGameStats', JSON.stringify(stats));
    if (stats.score >= stats.level * 150) stats.level++;
}

function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// --- MINI GAMES ---

function initGameSelector() {
    document.querySelectorAll('.game-selector button').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.game-selector button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.game-container').forEach(c => c.classList.remove('active'));
            document.getElementById('game-' + this.dataset.game).classList.add('active');
            resetMiniGame();
            renderMiniStatsForAll();
            if (this.dataset.game === 'weather-slot') {
                document.getElementById('lever').onclick = startSlotMachine;
            }
        });
    });
}

// Button listeners for Find Error Modes
document.getElementById('btn-metar')?.addEventListener('click', () => { mode = 'METAR'; updateActiveBtn(); if (difficulty) startGame(difficulty); });
document.getElementById('btn-taf')?.addEventListener('click', () => { mode = 'TAF'; updateActiveBtn(); if (difficulty) startGame(difficulty); });

function updateActiveBtn() {
    document.querySelectorAll('.mode-buttons .btn').forEach(b => b.classList.remove('active'));
    const btnId = `btn-${mode.toLowerCase()}`;
    document.getElementById(btnId)?.classList.add('active');
}

function startGame(diff) {
    resetMiniGame();
    difficulty = diff;
    attempts = 3;
    hintsLeft = (difficulty === 'hard') ? 2 : 1;
    currentHint = 1;
    selected.clear();
    
    document.getElementById('attempts').textContent = String(attempts);
    document.getElementById('result').innerHTML = '';
    
    const checkBtn = document.getElementById('check-btn');
    checkBtn.disabled = false;
    checkBtn.onclick = checkAnswer;
    checkBtn.textContent = 'Проверить';
    
    const list = gameData[mode][diff];
    const item = list[Math.floor(Math.random() * list.length)];
    currentCode = item.code;
    errors = item.errors;
    displayCode();
    renderMiniStats('find-error');
}

function displayCode() {
    const div = document.getElementById('meteo-code');
    div.innerHTML = '';
    const words = currentCode.split(' ');
    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.onclick = () => toggleSelect(span, i);
        div.appendChild(span);
        div.appendChild(document.createTextNode(' '));
    });
}

function toggleSelect(span, index) {
    const maxSelect = (difficulty === 'hard') ? 3 : 4;
    if (selected.has(index)) {
        selected.delete(index);
        span.style.background = '';
        span.style.transform = '';
        span.style.color = '';
        span.classList.remove('selected');
    } else if (selected.size < maxSelect) {
        selected.add(index);
        span.style.background = '#f1c40f';
        span.style.transform = 'scale(1.15)';
        span.style.color = 'white';
        span.classList.add('selected');
    }
}

function checkAnswer() {
    if (!currentCode) return;
    const correct = errors.length === selected.size && errors.every(e => selected.has(e));
    
    document.querySelectorAll('#meteo-code span').forEach((span, i) => {
        if (selected.has(i)) {
            if (errors.includes(i)) {
                span.style.background = '#27ae60';
                span.style.color = 'white';
                span.onclick = null;
            } else {
                span.style.background = '#e74c3c';
                span.style.color = 'white';
                span.onclick = null;
                selected.delete(i);
            }
        }
    });

    if (correct) {
        const points = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 40 : 80;
        stats.score += points;
        stats.wins++;
        stats.games++;
        updateStats();
        document.getElementById('result').innerHTML = `<span style="color:#27ae60;font-weight:bold">Правильно! +${points} очков!</span>`;
        document.getElementById('check-btn').disabled = true;
        playSound('ding');
        showConfetti();
        updateMiniStats('find-error', true, points);
    } else {
        attempts--;
        document.getElementById('attempts').textContent = attempts;
        if (attempts === 0) {
            stats.games++;
            document.getElementById('result').innerHTML = '<span style="color:#e74c3c;font-weight:bold">Поражение!</span>';
            // Show correct
            document.querySelectorAll('#meteo-code span').forEach((span, i) => {
                if (errors.includes(i)) {
                    span.style.background = '#27ae60';
                    span.style.color = 'white';
                }
            });
            document.getElementById('check-btn').textContent = 'Заново';
            document.getElementById('check-btn').onclick = () => startGame(difficulty);
            playSound('buzz');
            updateMiniStats('find-error', false, 0);
        } else {
            document.getElementById('result').innerHTML = `<span style="color:#e67e22">Неправильно!</span>`;
            playSound('buzz');
        }
    }
}

function showHintFindError() {
    if (hintsLeft > 0) {
        hintsLeft--;
        const item = gameData[mode][difficulty].find(i => i.code === currentCode);
        const hint = item?.hint || "Внимательно проверь формат!";
        document.getElementById('result').innerHTML = `<span style="color:#e67e22">Подсказка: ${hint}</span>`;
    } else {
        alert("Подсказки закончились!");
    }
}

function startGuessGame() {
    resetMiniGame();
    const list = guessGameData.metar;
    currentGuess = list[Math.floor(Math.random() * list.length)];
    attempts = 3;
    document.getElementById('attempts-guess').textContent = '3';
    document.getElementById('phenomenon-desc').textContent = `Явление: ${currentGuess.desc}`;
    document.getElementById('guess-check').disabled = false;
    document.getElementById('guess-check').onclick = checkGuess;
    renderMiniStats('guess-code');
}

function checkGuess() {
    const userGuess = document.getElementById('guess-input').value.trim().toUpperCase();
    const inputEl = document.getElementById('guess-input');
    if (userGuess === currentGuess.code) {
        const points = 30;
        stats.score += points;
        updateStats();
        document.getElementById('guess-result').innerHTML = `<span style="color:#27ae60;font-weight:bold">Правильно! +${points}</span>`;
        document.getElementById('guess-check').disabled = true;
        playSound('ding');
        showConfetti();
        updateMiniStats('guess-code', true, points);
    } else {
        attempts--;
        document.getElementById('attempts-guess').textContent = attempts;
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
        if (attempts === 0) {
            document.getElementById('guess-result').innerHTML = `Поражение. Код: ${currentGuess.code}`;
            document.getElementById('guess-check').textContent = 'Заново';
            document.getElementById('guess-check').onclick = startGuessGame;
            playSound('buzz');
            updateMiniStats('guess-code', false, 0);
        } else {
            playSound('buzz');
        }
    }
}

function startSpeedDecode() {
    resetMiniGame();
    clearInterval(timerInterval);
    const randomMetar = getRandomItem(speedDecodeData);
    document.getElementById('speed-metar').textContent = randomMetar;
    currentSpeedMetar = randomMetar;
    
    let timeLeft = 30 * timerSpeeds[currentTimerSpeed];
    document.getElementById('speed-timer').textContent = Math.ceil(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('speed-timer').textContent = Math.ceil(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkSpeedDecode(true);
        }
    }, 1000);
    renderMiniStats('speed-decode');
}

// Basic field parser for speed decode validation
function parseMetarFields(metar) {
    const parts = metar.trim().toUpperCase().replace(/=+$/,'').split(/\s+/);
    const out = { wind: '', vis: '', temp: '', qnh: '' };
    for (let i = 0; i < parts.length; i++) {
        // Wind
        if (/^(VRB|\d{3}|\/\/\/)\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/.test(parts[i])) {
            out.wind = parts[i];
        }
        // Vis
        if (parts[i] === 'CAVOK' || /^\d{4}$/.test(parts[i])) {
            out.vis = parts[i];
        }
        // Temp
        if (/^(M?\d{2})\/(M?\d{2})$/.test(parts[i])) {
            out.temp = parts[i];
        }
        // QNH
        if (/^[QA]\d{4}$/.test(parts[i])) {
            out.qnh = parts[i];
        }
    }
    return out;
}

function checkSpeedDecode(timeout = false) {
    clearInterval(timerInterval);
    const parsed = parseMetarFields(currentSpeedMetar);
    
    const checkField = (id, valid) => {
        const el = document.getElementById(id);
        const val = el.value.trim().toUpperCase();
        const isCorrect = val === (valid || '').toUpperCase();
        el.classList.add(isCorrect ? 'correct-input' : 'incorrect-input');
        return isCorrect;
    };
    
    const r1 = checkField('speed-wind', parsed.wind);
    const r2 = checkField('speed-vis', parsed.vis);
    const r3 = checkField('speed-temp', parsed.temp);
    const r4 = checkField('speed-qnh', parsed.qnh);
    
    let count = (r1?1:0) + (r2?1:0) + (r3?1:0) + (r4?1:0);
    
    if (!timeout && count > 0) {
        stats.score += count * 10;
        updateStats();
        playSound('ding');
        if (count === 4) showConfetti();
    } else {
        playSound('buzz');
    }
    
    document.getElementById('speed-result').innerHTML = `Правильно: ${count}/4`;
    if (count === 4) document.getElementById('new-task-speed-decode').style.display = 'block';
    updateMiniStats('speed-decode', count === 4, count * 10);
}

function clearSpeedDecode() {
    ['speed-wind','speed-vis','speed-temp','speed-qnh'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function startCodeBuilder() {
    resetMiniGame();
    clearInterval(builderTimerInterval);
    const item = getRandomItem(codeBuilderData);
    document.getElementById('builder-description').textContent = item.description;
    const correctGroups = item.code.split(' ');
    // Add distractors
    const extraGroups = ['XXXX', '9999', 'NOSIG', 'CAVOK', 'Q9999', 'M01/M01', 'OVC005'];
    const allGroups = [...correctGroups, ...extraGroups.slice(0, 3)].sort(() => Math.random() - 0.5);
    
    const pool = document.getElementById('group-pool');
    pool.innerHTML = '';
    document.getElementById('builder-dropzone').innerHTML = '';
    
    allGroups.forEach((group, index) => {
        const span = document.createElement('span');
        span.className = 'draggable';
        span.draggable = true;
        span.textContent = group;
        span.id = 'drag-item-' + index;
        span.ondragstart = (ev) => { ev.dataTransfer.setData("text", ev.target.id); };
        pool.appendChild(span);
    });
    
    currentBuilderCorrect = item.code;
    let timeLeft = 60 * timerSpeeds[currentTimerSpeed];
    document.getElementById('builder-timer').textContent = Math.ceil(timeLeft);
    builderTimerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('builder-timer').textContent = Math.ceil(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(builderTimerInterval);
            checkCodeBuilder(true);
        }
    }, 1000);
    renderMiniStats('code-builder');
}

function allowDrop(ev) { ev.preventDefault(); }
function dropToZone(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const el = document.getElementById(data);
    if (el) document.getElementById('builder-dropzone').appendChild(el);
}
function dropToPool(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const el = document.getElementById(data);
    if (el) document.getElementById('group-pool').appendChild(el);
}
function clearBuilderZone() {
    const dropzone = document.getElementById('builder-dropzone');
    const pool = document.getElementById('group-pool');
    while (dropzone.firstChild) pool.appendChild(dropzone.firstChild);
}

function checkCodeBuilder(timeout = false) {
    clearInterval(builderTimerInterval);
    const dropzone = document.getElementById('builder-dropzone');
    const userCode = Array.from(dropzone.children).map(span => span.textContent).join(' ');
    const resultEl = document.getElementById('builder-result');
    
    if (userCode === currentBuilderCorrect) {
        const points = timeout ? 0 : 50;
        stats.score += points;
        updateStats();
        resultEl.innerHTML = `<span style="color:#27ae60; font-weight:bold;">Правильно! +${points}</span>`;
        playSound('ding');
        showConfetti();
        document.getElementById('new-task-code-builder').style.display = 'block';
        updateMiniStats('code-builder', true, points);
    } else {
        resultEl.innerHTML = `<span style="color:#e74c3c;">Неправильно!</span>`;
        resultEl.classList.add('shake');
        setTimeout(() => resultEl.classList.remove('shake'), 500);
        playSound('buzz');
        updateMiniStats('code-builder', false, 0);
    }
}

function startQuizBowl() { resetMiniGame(); quizProgress = 0; nextQuizQuestion(); renderMiniStats('quiz-bowl'); }
function nextQuizQuestion() {
    const item = getRandomItem(quizQuestions);
    document.getElementById('quiz-question').textContent = item.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    item.options.forEach((opt, idx) => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz-option';
        radio.value = idx;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(opt));
        optionsDiv.appendChild(label);
    });
    
    document.getElementById('quiz-progress').textContent = `${quizProgress + 1}/10`;
    currentQuizCorrect = item.correct;
}

function checkQuiz() {
    const selected = document.querySelector('input[name="quiz-option"]:checked');
    const resultEl = document.getElementById('quiz-result');
    if (selected) {
        if (parseInt(selected.value) === currentQuizCorrect) {
            stats.score += 10; updateStats(); 
            resultEl.innerHTML = '<span style="color:#27ae60">Верно!</span>'; 
            playSound('ding'); 
            showConfetti();
            updateMiniStats('quiz-bowl', true, 10);
        } else { 
            resultEl.innerHTML = '<span style="color:#e74c3c">Ошибка!</span>'; 
            resultEl.classList.add('shake');
            setTimeout(() => resultEl.classList.remove('shake'), 500); 
            playSound('buzz'); 
            updateMiniStats('quiz-bowl', false, 0); 
        }
        setTimeout(() => {
            quizProgress++;
            if (quizProgress < 10) nextQuizQuestion();
            else resultEl.innerHTML = 'Серия завершена!';
        }, 1000);
    }
}

function startTafPredictor() {
    resetMiniGame();
    currentTafItem = getRandomItem(tafPredictorData);
    document.getElementById('taf-metar').textContent = currentTafItem.metar;
    document.getElementById('taf-taf').textContent = currentTafItem.taf;
    document.getElementById('taf-question').textContent = currentTafItem.question;
    renderMiniStats('taf-predictor');
}

function checkTafPredictor() {
    const userAnswer = document.getElementById('taf-answer').value.trim().toLowerCase();
    const resultEl = document.getElementById('taf-result');
    if (userAnswer === currentTafItem.answer.toLowerCase()) {
        resultEl.textContent = 'Правильно!';
        stats.score += 25; updateStats(); playSound('ding'); showConfetti();
        document.getElementById('new-task-taf-predictor').style.display = 'block';
        updateMiniStats('taf-predictor', true, 25);
    } else {
        resultEl.textContent = 'Неправильно. Ответ: ' + currentTafItem.answer;
        playSound('buzz');
        updateMiniStats('taf-predictor', false, 0);
    }
}

function startFlightPlanner() {
    resetMiniGame();
    currentPlannerItem = getRandomItem(flightPlannerData);
    document.getElementById('planner-route').textContent = currentPlannerItem.route;
    renderMiniStats('flight-planner');
}

function checkFlightPlanner() {
    const decision = document.getElementById('planner-decision').value;
    const resultEl = document.getElementById('planner-result');
    if (decision === currentPlannerItem.expected) {
        stats.score += currentPlannerItem.points; updateStats(); resultEl.textContent = 'Правильно!'; playSound('ding'); showConfetti();
        updateMiniStats('flight-planner', true, currentPlannerItem.points);
    } else { 
        resultEl.textContent = 'Неправильно!'; 
        resultEl.classList.add('shake');
        setTimeout(() => resultEl.classList.remove('shake'), 500); 
        playSound('buzz'); 
        updateMiniStats('flight-planner', false, 0); 
    }
}

function startSlotMachine() {
    resetMiniGame();
    const lever = document.getElementById('lever');
    lever.disabled = true;
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => {
        reel.classList.add('spinning');
        reel.textContent = '';
    });
    setTimeout(() => {
        const symbols = ['❄️', '☀️', '🌧️'];
        const result = Array.from({length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)]);
        reels.forEach((reel, i) => {
            reel.textContent = result[i];
            reel.classList.remove('spinning');
        });
        
        let message = '';
        if (result.every(s => s === '❄️')) {
            message = 'Мороз и солнце, день чудесный!';
            snowAnimation();
        } else if (result.every(s => s === '☀️')) {
            message = 'Ясно, CAVOK!';
            sunAnimation();
        } else if (result.every(s => s === '🌧️')) {
            message = 'Ливневый дождь, возможно гроза!';
            rainAnimation();
        } else {
            message = 'Переменная облачность.';
        }
        document.getElementById('slot-result').textContent = message;
        lever.disabled = false;
    }, 2000);
}

// Visual Effects
function snowAnimation() {
    const c = document.getElementById('animation-container');
    c.style.display = 'block';
    for(let i=0;i<50;i++) {
        const f = document.createElement('div'); f.className='snowflake';
        f.style.left = Math.random()*100+'vw'; 
        f.style.animationDuration = (Math.random()*3+2)+'s';
        c.appendChild(f);
    }
    setTimeout(()=>c.innerHTML='', 3000);
}
function rainAnimation() {
    const c = document.getElementById('animation-container');
    c.style.display = 'block';
    for(let i=0;i<50;i++) {
        const f = document.createElement('div'); f.className='raindrop';
        f.style.left = Math.random()*100+'vw';
        c.appendChild(f);
    }
    setTimeout(()=>c.innerHTML='', 3000);
}
function sunAnimation() {
    const c = document.getElementById('animation-container');
    c.style.display = 'block';
    const s = document.createElement('div'); s.className='sun';
    c.appendChild(s);
    setTimeout(()=>c.innerHTML='', 3000);
}

function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    let p = Array.from({length:100}, () => ({
        x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        r: Math.random()*4+1, c: `hsl(${Math.random()*360},100%,50%)`,
        vx: Math.random()*2-1, vy: Math.random()*2-1
    }));
    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        p.forEach(pt => {
            ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2);
            ctx.fillStyle = pt.c; ctx.fill();
            pt.x+=pt.vx; pt.y+=pt.vy;
        });
        requestAnimationFrame(draw);
    }
    draw();
    setTimeout(()=>canvas.style.display='none', 2000);
}

function playSound(type) {
    const sound = document.getElementById(type + '-sound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed', e));
    }
}

// Hints
function showHintGuessCode() { alert('Подсказка: Вспомните стандартные коды погоды (RA, SN, BR...).'); }
function showHintSpeedDecode() { alert('Подсказка: Ветер=KT/MPS, Видимость=4 цифры, QNH=Q...'); }
function showHintCodeBuilder() { alert('Подсказка: Аэропорт -> Время -> Ветер -> Видимость -> Облака -> T/Td -> QNH'); }
function showHintQuizBowl() { alert('Подсказка: Подумайте логически!'); }
function showHintTafPredictor() { alert('Подсказка: Сравните время и условия в TAF с текущим METAR.'); }
function showHintFlightPlanner() { alert('Подсказка: Туман и низкая облачность опасны для посадки.'); }

// Settings
let currentSettingsGame = '';
function openSettings(game) { currentSettingsGame = game; document.getElementById('settings-panel').style.display = 'block'; }
function applySettings() {
    currentTimerSpeed = document.getElementById('timer-speed').value;
    closeSettings();
    if (currentSettingsGame === 'speed-decode') startSpeedDecode();
    if (currentSettingsGame === 'code-builder') startCodeBuilder();
}
function closeSettings() { document.getElementById('settings-panel').style.display = 'none'; }

function initTopMenu() {
    document.querySelectorAll('.top-menu button').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) return;
            document.querySelectorAll('.top-menu button').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const pageId = 'page-' + this.dataset.page;
            if (document.getElementById(pageId)) {
                document.getElementById(pageId).classList.add('active');
            }
        });
    });
}