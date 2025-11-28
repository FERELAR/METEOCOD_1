let currentEncodeExercise = null;
let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;

unction parseMetar(metar) {
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
        while (/^R\d{2}[LCR]?\/.*/.test(parts[i])) {
            const rvr = parts[i].match(/^R(\d{2}[LCR]?)\/(P|M)?(\d{4})(V(\d{4}))?(U|D|N)?$/);
            if (rvr) {
                let vis = rvr[3];
                const prefix = rvr[2] === 'P' ? 'более ' : rvr[2] === 'M' ? 'менее ' : '';
                const varVis = rvr[5] ? ` изменяется до ${rvr[5]}` : '';
                const trend = rvr[6] === 'U' ? ' улучшается' : rvr[6] === 'D' ? ' ухудшается' : rvr[6] === 'N' ? ' без изменений' : '';
                out.push(`RVR на ВПП ${rvr[1]}: ${prefix}${vis} м${varVis}${trend}`);
            } else {
                out.push(`Дальность видимости на ВПП: ${parts[i]}`);
            }
            i++;
        }
        while (/^[+-]?(VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS|DS)?$/.test(parts[i])) {
            let code = parts[i];
            let intensity = code[0] === '+' ? 'сильный ' : code[0] === '-' ? 'слабый ' : '';
            if ('+-'.includes(code[0])) code = code.slice(1);
            let descr = '', precip = '', obsc = '', other = '';
            if (code.startsWith('VC')) { descr += 'в окрестностях '; code = code.slice(2); }
            for (const key of ['MI','BC','PR','DR','BL','SH','TS','FZ']) if (code.startsWith(key)) { descr += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['DZ','RA','SN','SG','IC','PL','GR','GS','UP']) if (code.startsWith(key)) { precip += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['BR','FG','FU','VA','DU','SA','HZ','PY']) if (code.startsWith(key)) { obsc += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['PO','SQ','FC','SS','DS']) if (code.startsWith(key)) { other += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            if (code) out.push('Ошибка: Неизвестный код погоды ' + parts[i]);
            else out.push(`Текущая погода: ${intensity}${descr}${precip}${obsc}${other}`.trim());
            i++;
        }
        while (/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)\d{3}(CB|TCU|\/\/\/)?$/.test(parts[i]) || /^VV\d{3}$/.test(parts[i])) {
            if (/^VV\d{3}$/.test(parts[i])) {
                out.push(`Вертикальная видимость: ${parseInt(parts[i].slice(2))*30} м`);
                i++;
                continue;
            }
            const m = parts[i].match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
            const cov = CLOUD_TYPES[m[1]] || m[1];
            const height = m[2] === '///' ? '' : `${parseInt(m[2])*30} м (${parseInt(m[2])*100} футов)`;
            const type = m[3] && m[3] !== '///' ? CLOUD_SUFFIX[m[3]] : '';
            out.push(`Облачность: ${cov}${height ? ', высота ' + height : ''}${type ? ', ' + type : ''}`);
            i++;
        }
        if (/^(M?\d{2})\/(M?\d{2})$/.test(parts[i])) {
            let [t, td] = parts[i].split('/');
            t = t.startsWith('M') ? '-' + t.slice(1) : t;
            td = td.startsWith('M') ? '-' + td.slice(1) : td;
            out.push(`Температура воздуха: ${t}°C, точка росы: ${td}°C`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат температуры');
            i++;
        }
        if (/^[QA]\d{4}$/.test(parts[i])) {
            if (parts[i].startsWith('Q')) {
                out.push(`Давление QNH: ${parts[i].slice(1)} гПа`);
            } else {
                const inches = parts[i].slice(1,3) + '.' + parts[i].slice(3);
                out.push(`Давление: ${inches} дюймов рт. ст.`);
            }
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат давления');
            i++;
        }
        while (i < parts.length) {
            if (parts[i].startsWith('RE')) {
                out.push(`Недавняя погода: ${parseWeather(parts[i].slice(2))}`);
                i++;
            } else if (parts[i].startsWith('WS')) {
                out.push(`Сдвиг ветра: ${parts[i]}`);
                i++;
            } else if (parts[i] === 'RMK') {
                out.push(`Замечания: ${parts.slice(i+1).join(' ')}`);
                break;
            } else {
                out.push(`Тренд или дополнительно: ${parts[i]}`);
                i++;
            }
        }
        return out.join('\n');
    } catch (e) {
        return 'Ошибка парсинга METAR: ' + e.message;
    }
}

function parseWeather(code) {
    return code.split(/(?=[A-Z]{2})/).map(c => WEATHER_CODES[c] || c).join(' ');
}

function parseMetarFields(metar) {
    const parts = metar.trim().toUpperCase().replace(/=+$/,'').split(/\s+/);
    const out = { wind: '', vis: '', temp: '', qnh: '' };
    for (let i = 0; i < parts.length; i++) {
        if (/^(VRB|\d{3}|\/\/\/)\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/.test(parts[i])) {
            out.wind = parts[i];
            continue;
        }
    }
    const visMatch = parts.find(p => p === 'CAVOK' || /^\d{4}$/.test(p));
    out.vis = visMatch || '';
    const tempMatch = parts.find(p => /^(M?\d{2})\/(M?\d{2})$/.test(p));
    out.temp = tempMatch || '';
    const qMatch = parts.find(p => /^[QA]\d{4}$/.test(p));
    out.qnh = qMatch || '';
    return out;
}
function parseTaf(taf) {
    try {
        const parts = taf.trim().toUpperCase().split(/\s+/);
        let i = 0;
        const out = ['Прогноз погоды по аэродрому (TAF)'];
        if (parts[i] === 'TAF') i++;
        if (parts[i] === 'AMD' || parts[i] === 'COR') { out.push(`Статус: ${parts[i] === 'AMD' ? 'исправленный' : 'корректированный'}`); i++; }
        if (/^[A-Z]{4}$/.test(parts[i])) { out.push(`Аэродром: ${parts[i]}`); i++; }
        if (/^\d{6}Z/.test(parts[i])) {
            const d = parts[i];
            out.push(`Выпущен: ${d.slice(0,2)} число, ${d.slice(2,4)}:${d.slice(4,6)} UTC`);
            i++;
        }
        if (/^\d{4}\/\d{4}$/.test(parts[i])) {
            const [from, to] = parts[i].split('/');
            out.push(`Действует: с ${from.slice(0,2)} ${from.slice(2)}:00 до ${to.slice(0,2)} ${to.slice(2)}:00 UTC`);
            i++;
        }
        let temp = [];
        while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
            temp.push(parts[i++]);
        }
        out.push('Основной прогноз:');
        out.push(parseMetar(temp.join(' ')));
        while (i < parts.length) {
            let line = '';
            let prob = '';
            if (parts[i].startsWith('PROB')) {
                prob = parts[i] + ' вероятность ';
                i++;
            }
            const type = parts[i++];
            if (type === 'FM') {
                const time = parts[i++];
                line += `${prob}С ${time.slice(0,2)} числа ${time.slice(2,4)}:${time.slice(4,6)} UTC: `;
            } else if (type === 'TEMPO' || type === 'BECMG') {
                const period = parts[i++];
                const [f,t] = period.split('/');
                line += `${prob}${type === 'TEMPO' ? 'Временно' : 'Становясь'} с ${f.slice(0,2)} ${f.slice(2)}:00 до ${t.slice(0,2)} ${t.slice(2)}:00: `;
            }
            temp = [];
            while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
                temp.push(parts[i++]);
            }
            out.push(line);
            out.push(parseMetar(temp.join(' ')));
        }
        return out.join('\n');
    } catch (e) {
        return 'Ошибка парсинга TAF: ' + e.message;
    }
}

function parseKn01(kn01) {
    try {
        const groups = kn01.split(/\s+/);
        if (groups.length < 10) return 'Ошибка: Недостаточно групп в KN-01';
        let decoded = '';
        let i = 0;
        decoded += `• Станция: ${groups[i++]}\n`;
        decoded += `• Тип: ${groups[i++]}\n`;
        decoded += `• Облачность малая: ${groups[i++]}\n`;
        decoded += `• Облачность средняя/верхняя: ${groups[i++]}\n`;
        decoded += `• Нижняя облачность: ${groups[i++]}\n`;
        decoded += `• Давление на уровне станции: ${groups[i++]}\n`;
        decoded += `• Тенденция давления: ${groups[i++]}\n`;
        decoded += `• Осадки за 6 ч: ${groups[i++]}\n`;
        decoded += `• Осадки за 3 ч: ${groups[i++]}\n`;
        decoded += `• Погода в срок и между сроками: ${groups[i++]}\n`;
        while (i < groups.length) {
            decoded += `• Дополнительно: ${groups[i++]}\n`;
        }
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга KN-01: ' + e.message;
    }
}

function parseGamet(gamet) {
    try {
        const sections = gamet.split(/SEC\s+I:/);
        let decoded = '';
        decoded += '• Секция I: Опасности\n' + (sections[1] ? sections[1] : 'Нет данных');
        const sec2 = gamet.split(/SEC\s+II:/);
        decoded += '\n• Секция II: Прогноз по маршруту\n' + (sec2[1] ? sec2[1] : 'Нет данных');
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга GAMET: ' + e.message;
    }
}

function parseSigmet(sigmet) {
    try {
        const groups = sigmet.split(/\s+/);
        if (groups.length < 5) return 'Ошибка: Недостаточно групп в SIGMET';
        let decoded = '';
        let i = 0;
        decoded += `• Тип: ${groups[i++]}\n`;
        decoded += `• FIR: ${groups[i++]}\n`;
        while (i < groups.length) {
            if (groups[i] === 'VALID') {
                decoded += `• Действует: ${groups[++i]}\n`;
                i++;
            } else if (groups[i].match(/TS|CB|TURB|ICE|VA|MTW/)) {
                decoded += `• Феномен: ${groups[i]}\n`;
                i++;
            } else if (groups[i] === 'OBS') decoded += `• Наблюдается: ${groups[++i]}\n`;
            else if (groups[i] === 'FCST') decoded += `• Прогноз: ${groups[++i]}\n`;
            else if (groups[i] === 'MOV') decoded += `• Движение: ${groups[++i]} ${groups[++i]}\n`;
            else i++;
        }
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга SIGMET: ' + e.message;
    }
}

function parseWarep(warep) {
    try {
        const groups = warep.split(/\s+/);
        if (groups.length < 3) return 'Ошибка: Недостаточно групп в WAREP';
        let decoded = '';
        let i = 0;
        if (groups[i] === 'WAREP') i++;
        decoded += `• Тип репорта: ${groups[i++]}\n`;
        decoded += parseMetar(groups.slice(i).join(' '));
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга WAREP: ' + e.message;
    }
}

function parseKn04(kn04) {
    try {
        const groups = kn04.split(/\s+/);
        if (groups.length < 4) return 'Ошибка: Недостаточно групп в KN-04';
        let decoded = '';
        let i = 0;
        decoded += `• Тип предупреждения: ${groups[i++]}\n`;
        decoded += `• Зона: ${groups[i++]}\n`;
        const timeMatch = groups[i]?.match(/VALID (\d{6})\/(\d{6})/);
        if (timeMatch) {
            decoded += `• Действует с ${timeMatch[1]} до ${timeMatch[2]}\n`;
            i++;
        }
        while (i < groups.length) {
            if (groups[i].match(/WIND|RAIN|STORM|TS|GR|SQ/)) decoded += `• Феномен: ${groups[i]}\n`;
            i++;
        }
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга KN-04: ' + e.message;
    }
}

function parseAirmet(airmet) {
    try {
        const groups = airmet.split(/\s+/);
        if (groups.length < 5) return 'Ошибка: Недостаточно групп в AIRMET';
        let decoded = '';
        let i = 0;
        decoded += `• Тип: AIRMET ${groups[i++]}\n`;
        decoded += `• FIR: ${groups[i++]}\n`;
        while (i < groups.length) {
            if (groups[i] === 'VALID') decoded += `• Действует: ${groups[++i]}\n`;
            else if (groups[i].match(/MTN|OBSC|ICG|TURB|WIND|MOD|ICE|BKN|CLD|SFC|VIS|ISOL|TS|OCNL|RA/)) decoded += `• Феномен (умеренный): ${groups[i]}\n`;
            i++;
        }
        return decoded;
    } catch (e) {
        return 'Ошибка парсинга AIRMET: ' + e.message;
    }
}

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
    kn01: {
        title: "КН-01 (Синоптический код)",
        decode: `<strong>КН-01 — наземные метеонаблюдения</strong><br>Расшифровка по группам: идентификатор, ветер, видимость, ...`,
        hints: `• 34580 — индекс станции<br>
                        • 11012 — облачность малая<br>
                        • 21089 — облачность средняя/верхняя<br>
                        • 30012 — нижняя облачность<br>
                        • 40123 — давление на уровне станции<br>
                        • 52015 — тенденция давления<br>
                        • 60022 — осадки за 6 ч<br>
                        • 70033 — осадки за 3 ч<br>
                        • 91012 — погода в срок и между сроками`
    },
    taf: {
        title: "TAF (Прогноз по аэродрому)",
        decode: `<strong>TAF — прогноз погоды</strong><br>Включает период действия, изменения FM, TEMPO, BECMG, PROB.`,
        hints: `• TAF AMD, COR<br>
                        • Период: 151200/161200<br>
                        • FM151300 — с 13:00<br>
                        • TEMPO 1514/1518 — временно<br>
                        • BECMG 1520/1522 — постепенное изменение<br>
                        • PROB30, PROB40 — вероятность`
    },
    gamet: {
        title: "GAMET (Прогноз для низких уровней)",
        decode: `<strong>GAMET — прогноз опасных явлений</strong><br>Секции: SEC I (опасности), SEC II (прогноз по маршруту).`,
        hints: `• VA — вулканический пепел<br>
                        • TC — тропический циклон<br>
                        • TURB, ICE, MTW<br>
                        • SFC WIND, VIS, SIG CLD<br>
                        • FL050-100 — уровень`
    },
    sigmet: {
        title: "SIGMET (Значительное явление)",
        decode: `<strong>SIGMET — предупреждение о значительных явлениях</strong><br>TS, TC, TURB, ICE, VA, MTW и др.`,
        hints: `• WS — SIGMET по ветру<br>
                        • WV — по турбулентности<br>
                        • WC — по обледенению<br>
                        • VALID 151200/151600<br>
                        • VA ERUPTION, TC NAME<br>
                        • OBS, FCST, MOV E 30KT`
    },
    airmet: {
        title: "AIRMET (Умеренные явления)",
        decode: `<strong>AIRMET — умеренные явления</strong><br>Аналог SIGMET, но менее интенсивные.`,
        hints: `• MOD TURB, MOD ICE<br>
                        • MT OBSC, BKN CLD<br>
                        • SFC VIS <5000M<br>
                        • ISOL TS, OCNL RA`
    },
    kn04: {
        title: "КН-04 (Штормовое предупреждение)",
        decode: `<strong>КН-04 — штормовое предупреждение по району</strong><br>Для метеорологических районов РФ.`,
        hints: `• VALID 151200/152400<br>
                        • WIND 20020MPS G35MPS<br>
                        • VIS 1000M RA<br>
                        • TS, GR, SQ<br>
                        • Район: Северо-Запад, Урал и т.д.`
    },
    warep: {
        title: "WAREP (Особый репорт)",
        decode: `<strong>WAREP — особый репорт пилота</strong><br>О турбулентности, обледенении, вулканическом пепле.`,
        hints: `• TURB SEV, ICE MOD<br>
                        • VA OBS, TC REPORT<br>
                        • FL180, POSITION<br>
                        • TIME 1230Z`
    }
};

document.addEventListener('DOMContentLoaded', function () {
    newEncodeExercise();
    updateTrainerStats();
    const devTypes = ['kn01', 'taf', 'gamet', 'sigmet', 'warep', 'kn04', 'airmet'];
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
                if (modeSelectorEl) modeSelectorEl.style.display = 'none';
                if (inputSectionEl) inputSectionEl.style.display = 'none';
                if (devMessageEl) {
                    devMessageEl.style.display = 'block';
                    devMessageEl.textContent = 'В разработке';
                }
                if (document.getElementById('sidebar-hints')) {
                    document.getElementById('sidebar-hints').innerHTML = `<strong>${type.toUpperCase()}</strong> — Модуль находится в разработке.`;
                }
                return;
            }
            if (modeSelectorEl) modeSelectorEl.style.display = '';
            if (inputSectionEl) inputSectionEl.style.display = '';
            if (devMessageEl) devMessageEl.style.display = 'none';
            const info = codeInstructions[type];
            if (info) {
                document.getElementById('decode-instructions').innerHTML = info.decode;
                document.getElementById('sidebar-hints').innerHTML = `<strong>${info.title}</strong><br><br>` + info.hints.replace(/\n/g, '<br>');
            }
        });
    });
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
});

function decodeCode() {
    const code = document.getElementById('metar-input').value.trim();
    const type = document.querySelector('.code-type-btn.active').dataset.type;
    let result;
    switch (type) {
        case 'metar': result = parseMetar(code); break;
        case 'taf': result = parseTaf(code); break;
        case 'kn01': result = parseKn01(code); break;
        case 'gamet': result = parseGamet(code); break;
        case 'sigmet': result = parseSigmet(code); break;
        case 'warep': result = parseWarep(code); break;
        case 'kn04': result = parseKn04(code); break;
        case 'airmet': result = parseAirmet(code); break;
        default: result = 'Выберите тип кода';
    }
    document.getElementById('decode-result').textContent = result;
    trainerStats.sessionDecoded++;
    trainerStats.totalDecoded++;
    updateTrainerStats();
}

function checkDecode() {
    const userDecode = document.getElementById('user-decode').value.trim();
    const correctDecode = parseMetar(currentPracticeCode); // Пример для METAR
    if (userDecode.toLowerCase().includes(correctDecode.toLowerCase())) {
        document.getElementById('practice-decode-result').textContent = 'Правильно!';
        trainerStats.sessionCorrect++;
    } else {
        document.getElementById('practice-decode-result').textContent = 'Неправильно. Правильная расшифровка: ' + correctDecode;
    }
    updateTrainerStats();
}

function newPracticeCode() {
    currentPracticeCode = 'UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG'; // Пример, заменить на рандом
    document.getElementById('practice-code').textContent = currentPracticeCode;
}

function checkEncode() {
    const userEncode = document.getElementById('user-encode').value.trim();
    const correctEncode = currentEncodeExercise.code; // Предполагается, что в gameData.js есть данные
    if (userEncode === correctEncode) {
        document.getElementById('practice-encode-result').textContent = 'Правильно!';
        trainerStats.sessionCorrect++;
    } else {
        document.getElementById('practice-encode-result').textContent = 'Неправильно. Правильный код: ' + correctEncode;
    }
    updateTrainerStats();
}

function newEncodeExercise() {
    currentEncodeExercise = { description: 'Описание погоды', code: 'Код' }; // Пример, заменить на рандом из gameData
    document.getElementById('weather-description').textContent = currentEncodeExercise.description;
}

function showEncodeHint() {
    document.getElementById('encode-hint').textContent = 'Подсказка: ...';
    document.getElementById('encode-hint').style.display = 'block';
}

function showNextHint() {
    hintStep++;
    // Логика для следующей подсказки
}

function updateTrainerStats() {
    document.getElementById('decoded-count').textContent = trainerStats.sessionDecoded;
    document.getElementById('correct-percent').textContent = trainerStats.sessionDecoded > 0 ? Math.round((trainerStats.sessionCorrect / trainerStats.sessionDecoded) * 100) + '%' : '0%';
    document.getElementById('trainer-level').textContent = trainerStats.level;
    localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
}

function resetStats() {
    trainerStats = {level:1, totalDecoded:0, correctDecoded:0, sessionDecoded:0, sessionCorrect:0, errorsByType:{metar:0,kn01:0,taf:0,gamet:0,sigmet:0,warep:0,kn04:0,airmet:0}};
    updateTrainerStats();
}

function clearFields() {
    document.getElementById('metar-input').value = '';
    document.getElementById('decode-result').textContent = 'Здесь появится расшифровка кода...';
}

function copyCode(id) {
    const text = document.getElementById(id).textContent || document.getElementById(id).value;
    navigator.clipboard.writeText(text);
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

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

function toggleAccordion(el) {
    const expanded = el.getAttribute('aria-expanded') === 'true';
    el.setAttribute('aria-expanded', !expanded);
    el.nextElementSibling.style.display = expanded ? 'none' : 'block';
}