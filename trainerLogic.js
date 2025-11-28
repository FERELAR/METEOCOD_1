let currentEncodeExercise = null;
let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;

// ==================== ПАРСЕР METAR ====================
function parseMetar(metar) {
    try {
        const parts = metar.trim().toUpperCase().replace(/=+$/,'').split(/\s+/);
        let i = 0;
        const out = [];

        if (parts[i] === 'METAR' || parts[i] === 'SPECI') { out.push(`Тип: ${parts[i]}`); i++; }

        if (/^[A-Z]{4}$/.test(parts[i])) {
            out.push(`Аэродром: ${parts[i]}`);
            i++;
        } else {
            out.push('Ошибка: Неверный код аэродрома');
        }

        if (/^\d{6}Z$/.test(parts[i])) {
            const d = parts[i];
            out.push(`Время наблюдения: ${d.slice(0,2)} число, ${d.slice(2,4)}:${d.slice(4,6)} UTC`);
            i++;
        } else {
            out.push('Ошибка: Неверный формат времени');
        }

        if (parts[i] === 'AUTO') { out.push('Отчёт автоматический'); i++; }
        if (parts[i] === 'COR') { out.push('Отчёт исправленный'); i++; }

        const windRe = /^(VRB|\d{3}|\/\/\/)(\d{2,3})(G(\d{2,3}))?(KT|MPS|KMH)$/;
        if (windRe.test(parts[i])) {
            const m = parts[i].match(windRe);
            const dir = m[1] === 'VRB' ? 'переменного направления' : m[1] === '000' ? 'штиль' : `${m[1]}°`;
            const speed = m[2];
            const gust = m[4] ? `, порывы до ${m[4]} ${m[5]}` : '';
            const unit = m[5] === 'KT' ? 'узлов' : m[5] === 'MPS' ? 'м/с' : 'км/ч';
            out.push(`Ветер: ${dir}, ${speed} ${unit}${gust}`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат ветра');
            i++;
        }

        if (/^\d{3}V\d{3}$/.test(parts[i])) {
            out.push(`Изменение направления ветра: от ${parts[i].slice(0,3)}° до ${parts[i].slice(5,8)}°`);
            i++;
        }

        if (parts[i] === 'CAVOK') {
            out.push('CAVOK — видимость ≥10 км, нет значимой погоды и облачности ниже 1500 м (5000 ft), нет CB/TCU');
            i++;
        } else if (/^\d{4}$/.test(parts[i])) {
            out.push(`Преобладающая видимость: ${parseInt(parts[i])} метров`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат видимости');
            i++;
        }

        // RVR
        while (/^R\d{2}[LCR]?\/.*/.test(parts[i])) {
            const rvr = parts[i].match(/^R(\d{2}[LCR]?)\/(P|M)?(\d{4})(V(\d{4}))?(U|D|N)?$/);
            if (rvr) {
                const prefix = rvr[2] === 'P' ? 'более ' : rvr[2] === 'M' ? 'менее ' : '';
                const varVis = rvr[5] ? ` изменяется до ${rvr[5]}` : '';
                const trend = rvr[6] === 'U' ? ' улучшается' : rvr[6] === 'D' ? ' ухудшается' : rvr[6] === 'N' ? ' без изменений' : '';
                out.push(`RVR на ВПП ${rvr[1]}: ${prefix}${rvr[3]} м${varVis}${trend}`);
            } else {
                out.push(`RVR: ${parts[i]}`);
            }
            i++;
        }

        // Погода
        while (/^[+-]?(VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS|DS)?$/.test(parts[i])) {
            let code = parts[i];
            let intensity = code[0] === '+' ? 'сильный ' : code[0] === '-' ? 'слабый ' : '';
            if ('+-'.includes(code[0])) code = code.slice(1);

            let descr = '', precip = '', obsc = '', other = '';
            if (code.startsWith('VC')) { descr += 'в окрестностях '; code = code.slice(2); }

            const keys = ['MI','BC','PR','DR','BL','SH','TS','FZ','DZ','RA','SN','SG','IC','PL','GR','GS','UP','BR','FG','FU','VA','DU','SA','HZ','PY','PO','SQ','FC','SS','DS'];
            for (const k of keys) {
                if (code.startsWith(k)) {
                    descr += (WEATHER_CODES[k] || k) + ' ';
                    code = code.slice(k.length);
                }
            }
            if (code) out.push('Ошибка: Неизвестный код погоды ' + parts[i]);
            else out.push(`Текущая погода: ${intensity}${descr}${precip}${obsc}${other}`.trim());
            i++;
        }

        // Облачность
        while (/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)\d{3}(CB|TCU|\/\/\/)?$/.test(parts[i]) || /^VV\d{3}$/.test(parts[i])) {
            if (/^VV\d{3}$/.test(parts[i])) {
                out.push(`Вертикальная видимость: ${parseInt(parts[i].slice(2)) * 30} м`);
                i++;
                continue;
            }
            const m = parts[i].match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
            const cov = CLOUD_TYPES[m[1]] || m[1];
            const height = m[2] === '///' ? '' : `${parseInt(m[2]) * 30} м (${parseInt(m[2]) * 100} футов)`;
            const type = m[3] && m[3] !== '///' ? (CLOUD_SUFFIX[m[3]] || m[3]) : '';
            out.push(`Облачность: ${cov}${height ? ', высота ' + height : ''}${type ? ', ' + type : ''}`);
            i++;
        }

        // Температура / точка росы
        if (/^(M?\d{2})\/(M?\d{2})$/.test(parts[i])) {
            let [t, td] = parts[i].split('/');
            t = t.startsWith('M') ? '-' + t.slice(1) : t;
            td = td.startsWith('M') ? '-' + td.slice(1) : td;
            out.push(`Температура воздуха: ${t}°C, точка росы: ${td}°C`);
            i++;
        }

        // Давление
        if (/^[QA]\d{4}$/.test(parts[i])) {
            if (parts[i].startsWith('Q')) {
                out.push(`Давление QNH: ${parts[i].slice(1)} гПа`);
            } else {
                const inches = parts[i].slice(1,3) + '.' + parts[i].slice(3);
                out.push(`Давление: ${inches} дюймов рт. ст.`);
            }
            i++;
        }

        // Остальное (NOSIG, RMK и т.д.)
        while (i < parts.length) {
            out.push(`Дополнительно: ${parts[i]}`);
            i++;
        }

        return out.join('\n');
    } catch (e) {
        return 'Ошибка парсинга: ' + e.message;
    }
}

// ==================== Остальные функции ====================

function newPracticeCode() {
    const idx = Math.floor(Math.random() * speedDecodeData.length);
    currentPracticeCode = speedDecodeData[idx];
    document.getElementById('practice-code').textContent = currentPracticeCode;
}

function newEncodeExercise() {
    const idx = Math.floor(Math.random() * weatherDatabase.length);
    currentEncodeExercise = weatherDatabase[idx];
    document.getElementById('weather-description').textContent = currentEncodeExercise.description;
}

function decodeCode() {
    const code = document.getElementById('metar-input').value.trim();
    const type = document.querySelector('.code-type-btn.active').dataset.type;
    let result = '';
    if (type === 'metar') result = parseMetar(code);
    else result = 'Поддерживается только METAR (остальные в разработке)';
    document.getElementById('decode-result').textContent = result;
    trainerStats.sessionDecoded++;
    trainerStats.totalDecoded++;
    updateTrainerStats();
}

function checkDecode() {
    const user = document.getElementById('user-decode').value.trim().toLowerCase();
    const correct = parseMetar(currentPracticeCode).toLowerCase();
    const ok = user.length > 20 && correct.includes(user) || user.includes(correct.split('\n')[0].toLowerCase());
    document.getElementById('practice-decode-result').textContent = ok ? 'Правильно!' : 'Неправильно';
    if (ok) trainerStats.sessionCorrect++;
    updateTrainerStats();
}

function checkEncode() {
    const user = document.getElementById('user-encode').value.trim();
    const correct = currentEncodeExercise.code;
    const ok = user === correct;
    document.getElementById('practice-encode-result').textContent = ok ? 'Правильно!' : `Неправильно. Правильно: ${correct}`;
    if (ok) trainerStats.sessionCorrect++;
    updateTrainerStats();
}

function updateTrainerStats() {
    document.getElementById('decoded-count').textContent = trainerStats.sessionDecoded;
    const percent = trainerStats.sessionDecoded > 0 ? Math.round((trainerStats.sessionCorrect / trainerStats.sessionDecoded) * 100) : 0;
    document.getElementById('correct-percent').textContent = percent + '%';
    document.getElementById('trainer-level').textContent = trainerStats.level;
    localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
}

function clearFields() {
    document.getElementById('metar-input').value = '';
    document.getElementById('decode-result').textContent = 'Здесь появится расшифровка кода...';
}

function copyCode(id) {
    const el = document.getElementById(id);
    const text = el.value || el.textContent;
    navigator.clipboard.writeText(text);
}

// ТЕМА
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    newEncodeExercise();
    updateTrainerStats();

    // Переключение типов кодов
    document.querySelectorAll('.code-type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.code-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Переключение режимов (авторасшифровка / практика)
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
            document.getElementById(this.dataset.mode + '-content').classList.add('active');
        });
    });
});
