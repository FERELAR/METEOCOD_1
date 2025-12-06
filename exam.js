// ====================== БАЗА ДАННЫХ ДЛЯ КОНТРОЛЬНОГО БЛОКА ======================

const examDatabase = {
  // Базовый тест (множественный выбор)
  basicTest: [
    {
      question: "Что означает код METAR?",
      options: [
        "Авиационная регулярная сводка погоды на аэродроме",
        "Прогноз погоды на аэродроме",
        "Штормовое предупреждение",
        "Синоптический код для наземных наблюдений"
      ],
      correct: 0,
      topic: "Общие знания",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Как расшифровывается группа 05007MPS?",
      options: [
        "Ветер 050°, 7 метров в секунду",
        "Ветер 500°, 7 метров в секунду",
        "Ветер 050°, 7 миль в час",
        "Видимость 5000 метров, скорость ветра 7 м/с"
      ],
      correct: 0,
      topic: "Ветер",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Что означает видимость 9999?",
      options: [
        "Видимость 10 километров или более",
        "Видимость 9999 метров",
        "Видимость не определена",
        "Видимость ограничена до 9999 футов"
      ],
      correct: 0,
      topic: "Видимость",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Какой код означает рассеянную облачность на 2000 футов?",
      options: [
        "SCT020",
        "BKN020",
        "FEW020",
        "OVC020"
      ],
      correct: 0,
      topic: "Облачность",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Что означает код NOSIG?",
      options: [
        "Без значительных изменений",
        "Значительные изменения ожидаются",
        "Наблюдается туман",
        "Требуется особая осторожность"
      ],
      correct: 0,
      topic: "Тренды",
      difficulty: "easy",
      time: 20
    },
    {
      question: "Как записывается температура -5°C и точка росы -7°C?",
      options: [
        "-05/-07",
        "M05/M07",
        "05/07",
        "M5/M7"
      ],
      correct: 1,
      topic: "Температура",
      difficulty: "medium",
      time: 30
    },
    {
      question: "Что означает CAVOK?",
      options: [
        "Видимость ≥10 км, нет облаков ниже 5000 ft, нет особых явлений",
        "Облачность отсутствует полностью",
        "Отличная видимость и хорошая погода",
        "Все параметры в норме"
      ],
      correct: 0,
      topic: "Специальные коды",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Какой код соответствует сильному дождю?",
      options: [
        "+RA",
        "-RA",
        "RA",
        "SHRA"
      ],
      correct: 0,
      topic: "Погодные явления",
      difficulty: "easy",
      time: 20
    },
    {
      question: "Что означает код VRB02KT?",
      options: [
        "Ветер переменный 2 узла",
        "Ветер 200° 2 узла",
        "Видимость переменная 200 метров",
        "Вертикальная видимость 200 футов"
      ],
      correct: 0,
      topic: "Ветер",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Как записывается давление 1013 гПа?",
      options: [
        "Q1013",
        "A1013",
        "P1013",
        "H1013"
      ],
      correct: 0,
      topic: "Давление",
      difficulty: "easy",
      time: 20
    }
  ],

  // Продвинутый тест
  advancedTest: [
    {
      question: "Что означает группа R24/290050 в METAR?",
      options: [
        "Состояние ВПП 24: мокрая или вода местами, коэффициент сцепления 0.5",
        "Ветер на ВПП 24: 290° 5 узлов",
        "Видимость на ВПП 24: 2900 метров, RVR 500 метров",
        "Температура на ВПП 24: 29°C, точка росы 5°C"
      ],
      correct: 0,
      topic: "Состояние ВПП",
      difficulty: "hard",
      time: 40
    },
    {
      question: "Как правильно записать видимость 800 метров с минимальной 400 метров на северо-восток?",
      options: [
        "0800 0400NE",
        "800 400NE",
        "0800NE 0400",
        "800 400 NORTHEAST"
      ],
      correct: 0,
      topic: "Видимость",
      difficulty: "hard",
      time: 45
    },
    {
      question: "Что означает группа TEMPO 4000 -RA BKN010?",
      options: [
        "Временами видимость 4000 м, слабый дождь, значительная облачность 1000 футов",
        "Температура 40°C, дождь, облачность 10/10",
        "Временные работы на ВПП, дождь ожидается",
        "Температура падает до 4°C, дождь, облачность увеличивается"
      ],
      correct: 0,
      topic: "Тренды",
      difficulty: "hard",
      time: 35
    },
    {
      question: "Какой код соответствует ливневому дождю с грозой?",
      options: [
        "+TSRA",
        "SHTSRA",
        "RA+TS",
        "TS+SHRA"
      ],
      correct: 0,
      topic: "Погодные явления",
      difficulty: "hard",
      time: 30
    },
    {
      question: "Что означает группа BECMG FM1200 25010KT?",
      options: [
        "Постепенное изменение с 12:00 UTC, ветер 250° 10 узлов",
        "Будет меняться с 12:00, температура 25°C, ветер 10 узлов",
        "Ветер становится 250° 10 узлов после 12:00",
        "Постепенный ветер 250° 10 узлов с 12:00"
      ],
      correct: 0,
      topic: "TAF",
      difficulty: "hard",
      time: 40
    }
  ],

  // Практические задания (кодирование)
  practiceTasks: [
    {
      description: "Аэропорт Внуково (UUWW), 15 число, 14:30 UTC. Ветер 120° 5 м/с. Видимость 10+ км. Рассеянная облачность на 2500 футов. Температура 18°C, точка росы 12°C. Давление QNH 1012 гПа. Без изменений.",
      answer: "UUWW 151430Z 12005MPS 9999 SCT025 18/12 Q1012 NOSIG",
      topic: "METAR",
      difficulty: "easy",
      time: 120,
      hints: [
        "Начните с идентификатора аэропорта и времени",
        "Формат времени: день(две цифры)час(две цифры)минуты(две цифры)Z",
        "Ветер: направление(три цифры)скорость(две цифры)MPS",
        "Видимость 10+ км = 9999",
        "Облачность: SCT + высота в сотнях футов (025 = 2500 ft)",
        "Температура: TT/TdTd",
        "Давление: QPPPP"
      ]
    },
    {
      description: "Аэропорт Пулково (ULLI), 10 число, 06:00 UTC. Штиль. Видимость 500 м. Туман. Вертикальная видимость 100 футов. Температура 2°C, точка росы 1°C. Давление QNH 1000 гПа. Состояние ВПП 88: мокрая или вода местами, коэффициент сцепления 0.5. Без изменений. Ремарка: препятствия закрыты.",
      answer: "METAR ULLI 100600Z 00000MPS 0500 FG VV001 02/01 Q1000 R88/290050 NOSIG RMK OBST OBSC",
      topic: "METAR",
      difficulty: "medium",
      time: 180,
      hints: [
        "Начинайте с METAR для регулярной сводки",
        "Штиль = 00000MPS",
        "Видимость 500 м = 0500",
        "Туман = FG",
        "Вертикальная видимость = VV + высота в сотнях футов",
        "Состояние ВПП: R + номер ВПП + / + данные",
        "Ремарка начинается с RMK"
      ]
    },
    {
      description: "Прогноз TAF для аэропорта Внуково. Выпущен 14 числа в 16:00 UTC. Период действия с 14-го 18:00 по 15-е 24:00. Ветер 030° 5 м/с. Видимость 10+ км. Значительная облачность на 1500 футов. Максимальная температура 15°C в 14-го 12:00 UTC. Минимальная температура 10°C в 15-го 03:00 UTC.",
      answer: "TAF UUWW 141600Z 1418/1524 03005MPS 9999 BKN015 TX15/1412Z TN10/1503Z",
      topic: "TAF",
      difficulty: "medium",
      time: 150,
      hints: [
        "Начните с TAF и идентификатора аэродрома",
        "Формат периода: деньчас/деньчас (1418/1524)",
        "TX для максимальной температуры, TN для минимальной",
        "Формат температуры: TT/времяZ"
      ]
    },
    {
      description: "Специальная сводки SPECI для аэропорта Домодедово. 25 число, 16:50 UTC. Ветер переменный 3 узла. Видимость 8000 м. Слабый дождь. Малооблачно на 3000 футов. Значительная кучево-дождевая облачность на 7000 футов. Температура 15°C, точка росы 10°C. Давление QNH 1018 гПа. Без изменений.",
      answer: "SPECI UUDD 251650Z VRB03KT 8000 -RA FEW030 BKN070CB 15/10 Q1018 NOSIG",
      topic: "SPECI",
      difficulty: "hard",
      time: 200,
      hints: [
        "Начинайте с SPECI для специальной сводки",
        "Ветер переменный: VRB + скорость + единицы (KT для узлов)",
        "Видимость в метрах: 8000",
        "Слабый дождь: -RA",
        "Кучево-дождевая облачность: CB после высоты"
      ]
    }
  ],

  // Экзаменационные билеты (комбинированные)
  examTickets: [
    {
      id: 1,
      name: "Билет №1: Базовый METAR",
      tasks: [
        {
          type: "test",
          question: "Что означает код METAR?",
          options: [
            "Авиационная регулярная сводка погоды на аэродроме",
            "Прогноз погоды на аэродроме",
            "Сводка о штормовом предупреждении",
            "Код для наземных наблюдений"
          ],
          correct: 0,
          points: 10
        },
        {
          type: "practice",
          description: "Закодируйте: Аэропорт Внуково, 14 число 16:30 UTC, ветер 050° 7 м/с, видимость 10+ км, рассеянная облачность 2000 фт, температура 17°C, точка росы 12°C, давление 1011 гПа, без изменений.",
          answer: "UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG",
          points: 30
        },
        {
          type: "decode",
          code: "METAR UUDD 141600Z 03005MPS 9999 BKN015 15/10 Q1012",
          question: "Расшифруйте данный код METAR",
          answer: "Аэропорт Домодедово, 14 число 16:00 UTC, ветер 030° 5 м/с, видимость 10+ км, значительная облачность на 1500 футов, температура 15°C, точка росы 10°C, давление 1012 гПа",
          points: 30
        },
        {
          type: "test",
          question: "Какой код соответствует видимости 10+ км?",
          options: ["9999", "CAVOK", "10000", "10KM"],
          correct: 0,
          points: 10
        },
        {
          type: "test",
          question: "Что означает NOSIG?",
          options: [
            "Без значительных изменений",
            "Значительные изменения",
            "Нет сигнала",
            "Не стандартно"
          ],
          correct: 0,
          points: 10
        }
      ],
      totalPoints: 90,
      timeLimit: 600, // 10 минут
      passingScore: 70
    },
    {
      id: 2,
      name: "Билет №2: Продвинутый METAR",
      tasks: [
        {
          type: "test",
          question: "Что означает группа R24/290050?",
          options: [
            "Состояние ВПП 24: мокрая или вода местами, коэффициент сцепления 0.5",
            "Ветер на ВПП 24: 290° 5 узлов",
            "Видимость на ВПП 24: 2900 метров",
            "Температура на ВПП 24: 29°C"
          ],
          correct: 0,
          points: 15
        },
        {
          type: "practice",
          description: "Закодируйте: Аэропорт Пулково, 10 число 06:00 UTC, штиль, видимость 500 м, туман, вертикальная видимость 100 футов, температура 2°C, точка росы 1°C, давление 1000 гПа, состояние ВПП 88: коэффициент 0.5, без изменений, ремарка: препятствия закрыты.",
          answer: "METAR ULLI 100600Z 00000MPS 0500 FG VV001 02/01 Q1000 R88/290050 NOSIG RMK OBST OBSC",
          points: 40
        },
        {
          type: "decode",
          code: "METAR UUEE 141500Z VRB02KT 0100 R28L/1000U FG VV001 08/07 Q0998",
          question: "Расшифруйте данный код METAR",
          answer: "Аэропорт Шереметьево, 14 число 15:00 UTC, ветер переменный 2 узла, видимость 100 м, RVR ВПП 28L 1000 м увеличивается, туман, вертикальная видимость 100 футов, температура 8°C, точка росы 7°C, давление 998 гПа",
          points: 35
        },
        {
          type: "test",
          question: "Что означает код CAVOK?",
          options: [
            "Видимость ≥10 км, нет облаков ниже 5000 ft, нет особых явлений",
            "Облачность отсутствует",
            "Отличная видимость",
            "Все параметры в норме"
          ],
          correct: 0,
          points: 10
        }
      ],
      totalPoints: 100,
      timeLimit: 480, // 8 минут
      passingScore: 80
    }
  ],

  // Типы сертификатов
  certificates: {
    basic: {
      name: "Базовый сертификат",
      requirements: {
        testScore: 80,
        practiceTasks: 2,
        totalTime: 600
      },
      description: "Подтверждает базовые знания метеорологических кодов METAR/SPECI"
    },
    advanced: {
      name: "Продвинутый уровень",
      requirements: {
        testScore: 85,
        practiceTasks: 4,
        totalTime: 480,
        minDifficulty: "hard"
      },
      description: "Подтверждает продвинутые навыки работы с METAR, SPECI и TAF"
    },
    expert: {
      name: "Эксперт",
      requirements: {
        testScore: 90,
        practiceTasks: 6,
        totalTime: 360,
        minDifficulty: "hard",
        allCodeTypes: true
      },
      description: "Подтверждает экспертные знания всех типов метеорологических кодов"
    }
  }
};

// ====================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ======================

let examState = {
  currentExamType: null, // 'test', 'practice', 'exam'
  currentExamData: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  startTime: null,
  timerInterval: null,
  remainingTime: 0,
  isExamActive: false,
  examResults: []
};

let examStats = JSON.parse(localStorage.getItem('examStats') || '{"attempts":[],"certificates":[],"totalScore":0,"totalTime":0}');

// ====================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ======================

function initExamPage() {
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  // Проверяем, не загружен ли уже контент
  if (dynamicContainer.children.length > 0) {
    // Если контент уже есть, просто обновляем историю
    loadExamHistory();
    updateHistoryStats();
    return;
  }
  
  // Загружаем динамический контент экзамена
  dynamicContainer.innerHTML = `
    <div class="main-content">
      <h1><i class="fas fa-file-alt"></i> КОНТРОЛЬНЫЙ БЛОК</h1>
      <p class="subtitle">Тестирование знаний метеорологических кодов</p>
      
      <!-- Основной выбор типа контроля -->
      <div class="exam-type-selector">
        <div class="exam-type-card" data-type="test">
          <i class="fas fa-clipboard-check"></i>
          <h3>ТЕСТ</h3>
          <p>Множественный выбор по теории</p>
          <div class="card-details">
            <p><i class="fas fa-clock"></i> 15-30 минут</p>
            <p><i class="fas fa-question-circle"></i> 10-30 вопросов</p>
            <p><i class="fas fa-star"></i> Базовый уровень</p>
          </div>
        </div>
        
        <div class="exam-type-card" data-type="practice">
          <i class="fas fa-pencil-alt"></i>
          <h3>ПРАКТИКА</h3>
          <p>Кодирование погодных условий</p>
          <div class="card-details">
            <p><i class="fas fa-clock"></i> 20-40 минут</p>
            <p><i class="fas fa-tasks"></i> 3-7 заданий</p>
            <p><i class="fas fa-star-half-alt"></i> Средний уровень</p>
          </div>
        </div>
        
        <div class="exam-type-card" data-type="exam">
          <i class="fas fa-graduation-cap"></i>
          <h3>ЭКЗАМЕН</h3>
          <p>Комбинированный билет</p>
          <div class="card-details">
            <p><i class="fas fa-clock"></i> 10-15 минут</p>
            <p><i class="fas fa-ticket-alt"></i> Билеты 1-2</p>
            <p><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> Сложный уровень</p>
          </div>
        </div>
      </div>
      
      <!-- Настройки контроля -->
      <div class="exam-settings" style="display: none;">
        <h3><i class="fas fa-cog"></i> Настройки контроля</h3>
        
        <!-- Настройки для теста -->
        <div id="test-settings" class="settings-section">
          <div class="setting-group">
            <label for="test-difficulty"><i class="fas fa-chart-line"></i> Уровень сложности:</label>
            <select id="test-difficulty">
              <option value="basic">Базовый (основные понятия)</option>
              <option value="advanced">Продвинутый (детальные вопросы)</option>
              <option value="mixed">Смешанный (разные уровни)</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="test-count"><i class="fas fa-list-ol"></i> Количество вопросов:</label>
            <select id="test-count">
              <option value="10">10 вопросов (быстро)</option>
              <option value="20" selected>20 вопросов (стандарт)</option>
              <option value="30">30 вопросов (полный)</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="test-topics"><i class="fas fa-book"></i> Темы:</label>
            <select id="test-topics" multiple>
              <option value="all" selected>Все темы</option>
              <option value="metar">METAR/SPECI</option>
              <option value="taf">TAF</option>
              <option value="wind">Ветер</option>
              <option value="visibility">Видимость</option>
              <option value="clouds">Облачность</option>
              <option value="weather">Погодные явления</option>
            </select>
          </div>
        </div>
        
        <!-- Настройки для практики -->
        <div id="practice-settings" class="settings-section" style="display: none;">
          <div class="setting-group">
            <label for="practice-type"><i class="fas fa-code"></i> Тип кода:</label>
            <select id="practice-type">
              <option value="METAR" selected>METAR/SPECI</option>
              <option value="TAF">TAF (Прогноз)</option>
              <option value="all">Все типы</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="practice-count"><i class="fas fa-tasks"></i> Количество заданий:</label>
            <select id="practice-count">
              <option value="3">3 задания</option>
              <option value="5" selected>5 заданий</option>
              <option value="7">7 заданий</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="practice-difficulty"><i class="fas fa-chart-line"></i> Сложность:</label>
            <select id="practice-difficulty">
              <option value="easy">Лёгкая</option>
              <option value="medium" selected>Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </div>
        </div>
        
        <!-- Настройки для экзамена -->
        <div id="exam-settings" class="settings-section" style="display: none;">
          <div class="setting-group">
            <label for="exam-ticket"><i class="fas fa-ticket-alt"></i> Выберите билет:</label>
            <select id="exam-ticket">
              <option value="1">Билет №1: Базовый METAR</option>
              <option value="2">Билет №2: Продвинутый METAR</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="exam-time"><i class="fas fa-clock"></i> Ограничение времени:</label>
            <select id="exam-time">
              <option value="10">10 минут</option>
              <option value="15" selected>15 минут</option>
              <option value="20">20 минут</option>
            </select>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" id="exam-hints" checked> 
              <i class="fas fa-lightbulb"></i> Разрешить подсказки (снижает балл)
            </label>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn-primary btn-start-exam" onclick="startExam()">
            <i class="fas fa-play"></i> НАЧАТЬ КОНТРОЛЬНУЮ РАБОТУ
          </button>
          <button class="btn btn-secondary" onclick="showExamTypeSelector()">
            <i class="fas fa-arrow-left"></i> ВЕРНУТЬСЯ К ВЫБОРУ
          </button>
        </div>
      </div>
      
      <!-- Интерфейс проведения контроля -->
      <div class="exam-interface" style="display: none;">
        <div class="exam-header">
          <div class="exam-timer" id="exam-timer">
            <i class="fas fa-clock"></i> <span id="timer-display">00:00</span>
          </div>
          <div class="exam-progress">
            <span id="current-question">1</span> из <span id="total-questions">10</span>
            <progress id="exam-progress" value="0" max="100"></progress>
          </div>
          <div class="exam-score">
            <i class="fas fa-star"></i> Баллы: <span id="current-score">0</span>
          </div>
          <button class="btn btn-warning btn-finish-exam" onclick="finishExam()">
            <i class="fas fa-flag-checkered"></i> ЗАВЕРШИТЬ ДОСРОЧНО
          </button>
        </div>
        
        <div class="exam-content" id="exam-content">
          <div class="exam-loading">
            <i class="fas fa-spinner fa-spin"></i> Загрузка задания...
          </div>
        </div>
        
        <div class="exam-navigation">
          <button class="btn btn-secondary" id="btn-prev" onclick="prevQuestion()" disabled>
            <i class="fas fa-arrow-left"></i> НАЗАД
          </button>
          
          <div class="navigation-center">
            <button class="btn btn-hint" id="btn-hint" style="display: none;" onclick="showHint()">
              <i class="fas fa-lightbulb"></i> Подсказка (-5 баллов)
            </button>
            <button class="btn" id="btn-skip" style="display: none;" onclick="skipQuestion()">
              <i class="fas fa-forward"></i> Пропустить
            </button>
          </div>
          
          <button class="btn btn-primary" id="btn-next" onclick="nextQuestion()">
            СЛЕДУЮЩИЙ <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn btn-success" id="btn-submit" style="display: none;" onclick="submitAnswer()">
            <i class="fas fa-check"></i> ЗАВЕРШИТЬ И ПРОВЕРИТЬ
          </button>
        </div>
        
        <div class="exam-hint-area" id="hint-area" style="display: none;"></div>
      </div>
      
      <!-- Результаты контроля -->
      <div class="exam-results" style="display: none;">
        <div id="results-content"></div>
        
        <div class="results-actions">
          <button class="btn btn-primary" onclick="showDetailedResults()">
            <i class="fas fa-chart-bar"></i> ДЕТАЛЬНАЯ СТАТИСТИКА
          </button>
          <button class="btn btn-secondary" onclick="restartExam()">
            <i class="fas fa-redo"></i> ПОВТОРИТЬ ЭТОТ ТЕСТ
          </button>
          <button class="btn" onclick="showCertificates()">
            <i class="fas fa-award"></i> МОИ СЕРТИФИКАТЫ
          </button>
          <button class="btn btn-success" onclick="tryAnotherType()">
            <i class="fas fa-random"></i> ПОПРОБОВАТЬ ДРУГОЙ ТИП
          </button>
        </div>
        
        <div class="results-certificate" id="certificate-notification" style="display: none;"></div>
      </div>
    </div>
  `;
  
  // Инициализируем обработчики событий
  initExamEventListeners();
  loadExamHistory();
  updateHistoryStats();
}

// ====================== ОБРАБОТЧИКИ СОБЫТИЙ ======================

function initExamEventListeners() {
  // Выбор типа контроля
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.exam-type-card');
    if (card) {
      const examType = card.dataset.type;
      selectExamType(examType);
    }
  });
}

function selectExamType(type) {
  examState.currentExamType = type;
  
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  // Показываем настройки для выбранного типа
  const examTypeSelector = dynamicContainer.querySelector('.exam-type-selector');
  const examSettings = dynamicContainer.querySelector('.exam-settings');
  
  if (examTypeSelector) examTypeSelector.style.display = 'none';
  if (examSettings) examSettings.style.display = 'block';
  
  // Скрываем все настройки
  const settingsSections = dynamicContainer.querySelectorAll('.settings-section');
  settingsSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Показываем соответствующие настройки
  const targetSettings = dynamicContainer.getElementById(`${type}-settings`);
  if (targetSettings) {
    targetSettings.style.display = 'block';
  }
}

function showExamTypeSelector() {
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  // Скрываем специализированные режимы
  document.getElementById('examiner-mode').style.display = 'none';
  document.getElementById('synoptic-mode').style.display = 'none';
  
  // Показываем основной контент
  dynamicContainer.style.display = 'block';
  
  // Показываем выбор типа контроля
  const examTypeSelector = dynamicContainer.querySelector('.exam-type-selector');
  const examSettings = dynamicContainer.querySelector('.exam-settings');
  const examInterface = dynamicContainer.querySelector('.exam-interface');
  const examResults = dynamicContainer.querySelector('.exam-results');
  
  if (examTypeSelector) examTypeSelector.style.display = 'flex';
  if (examSettings) examSettings.style.display = 'none';
  if (examInterface) examInterface.style.display = 'none';
  if (examResults) examResults.style.display = 'none';
  
  examState.currentExamType = null;
}

// ====================== ФУНКЦИИ УПРАВЛЕНИЯ РЕЖИМАМИ ======================

function toggleExaminerMode() {
  const examinerMode = document.getElementById('examiner-mode');
  const synopticMode = document.getElementById('synoptic-mode');
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  
  if (examinerMode.style.display === 'block') {
    examinerMode.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = 'block';
  } else {
    examinerMode.style.display = 'block';
    synopticMode.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = 'none';
    
    // Загружаем вопросы при показе
    loadCustomQuestions();
  }
}

function toggleSynopticMode() {
  const examinerMode = document.getElementById('examiner-mode');
  const synopticMode = document.getElementById('synoptic-mode');
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  
  if (synopticMode.style.display === 'block') {
    synopticMode.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = 'block';
  } else {
    synopticMode.style.display = 'block';
    examinerMode.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = 'none';
    
    // Генерируем карту при показе
    generateWeatherMap();
    setupMapTools();
  }
}

// ====================== ЗАПУСК ЭКЗАМЕНА ======================

function startExam() {
  const type = examState.currentExamType;
  if (!type) return;
  
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  // Получаем настройки
  let examData;
  let timeLimit;
  
  switch(type) {
    case 'test':
      const difficulty = dynamicContainer.getElementById('test-difficulty').value;
      const count = parseInt(dynamicContainer.getElementById('test-count').value);
      examData = difficulty === 'basic' 
        ? examDatabase.basicTest.slice(0, count)
        : examDatabase.advancedTest.slice(0, Math.min(count, examDatabase.advancedTest.length));
      timeLimit = count * 45; // 45 секунд на вопрос
      break;
      
    case 'practice':
      const practiceCount = parseInt(dynamicContainer.getElementById('practice-count').value);
      examData = examDatabase.practiceTasks.slice(0, Math.min(practiceCount, examDatabase.practiceTasks.length));
      timeLimit = examData.reduce((total, task) => total + task.time, 0);
      break;
      
    case 'exam':
      const ticketId = dynamicContainer.getElementById('exam-ticket').value;
      examData = examDatabase.examTickets.find(ticket => ticket.id == ticketId);
      timeLimit = examData.timeLimit;
      break;
  }
  
  // Сохраняем данные экзамена
  examState.currentExamData = examData;
  examState.currentQuestionIndex = 0;
  examState.userAnswers = [];
  examState.startTime = new Date();
  examState.remainingTime = timeLimit;
  examState.isExamActive = true;
  
  // Показываем интерфейс экзамена
  const examSettings = dynamicContainer.querySelector('.exam-settings');
  const examInterface = dynamicContainer.querySelector('.exam-interface');
  
  if (examSettings) examSettings.style.display = 'none';
  if (examInterface) examInterface.style.display = 'block';
  
  // Запускаем таймер
  startTimer();
  
  // Показываем первый вопрос
  showQuestion();
}

// ====================== ТАЙМЕР ======================

function startTimer() {
  updateTimerDisplay();
  
  examState.timerInterval = setInterval(() => {
    examState.remainingTime--;
    updateTimerDisplay();
    
    if (examState.remainingTime <= 0) {
      clearInterval(examState.timerInterval);
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(examState.remainingTime / 60);
  const seconds = examState.remainingTime % 60;
  const timerDisplay = document.getElementById('timer-display');
  
  if (timerDisplay) {
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Меняем цвет при малом времени
    if (examState.remainingTime < 60) {
      timerDisplay.style.color = '#e74c3c';
      timerDisplay.style.fontWeight = 'bold';
    }
  }
}

// ====================== ОТОБРАЖЕНИЕ ВОПРОСОВ ======================

function showQuestion() {
  const container = document.getElementById('exam-content');
  const currentIndex = examState.currentQuestionIndex;
  const examType = examState.currentExamType;
  let questionData;
  
  // Получаем данные вопроса в зависимости от типа экзамена
  if (examType === 'exam') {
    questionData = examState.currentExamData.tasks[currentIndex];
  } else {
    questionData = examState.currentExamData[currentIndex];
  }
  
  // Обновляем прогресс
  updateProgress();
  
  // Очищаем контейнер
  container.innerHTML = '';
  
  // Отображаем вопрос в зависимости от типа
  if (examType === 'test' || (examType === 'exam' && questionData.type === 'test')) {
    showTestQuestion(questionData, currentIndex);
  } else if (examType === 'practice' || (examType === 'exam' && questionData.type === 'practice')) {
    showPracticeQuestion(questionData, currentIndex);
  } else if (examType === 'exam' && questionData.type === 'decode') {
    showDecodeQuestion(questionData, currentIndex);
  }
  
  // Обновляем кнопки навигации
  updateNavigationButtons();
}

function showTestQuestion(question, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="test-question">
      <h3>Вопрос ${index + 1}</h3>
      <div class="question-text">${question.question}</div>
      <div class="question-options">
        ${question.options.map((option, i) => `
          <div class="option" data-index="${i}">
            <input type="radio" name="answer" id="option-${i}" value="${i}">
            <label for="option-${i}">${option}</label>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Восстанавливаем выбранный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    const selectedOption = container.querySelector(`input[value="${examState.userAnswers[index]}"]`);
    if (selectedOption) {
      selectedOption.checked = true;
    }
  }
  
  // Добавляем обработчики для вариантов ответов
  container.querySelectorAll('.option input').forEach(input => {
    input.addEventListener('change', function() {
      examState.userAnswers[index] = parseInt(this.value);
    });
  });
}

function showPracticeQuestion(task, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="practice-task">
      <h3>Задание ${index + 1}</h3>
      <div class="task-description">
        <p><strong>Опишите погоду:</strong></p>
        <p>${task.description}</p>
      </div>
      <div class="task-input">
        <label for="answer-input-${index}">Ваш код:</label>
        <textarea id="answer-input-${index}" placeholder="Введите код здесь..." rows="3"></textarea>
      </div>
      <button class="btn btn-hint" onclick="showHint(${index})">
        <i class="fas fa-lightbulb"></i> Подсказка
      </button>
      <div id="hint-${index}" class="hint-area" style="display: none; margin-top: 10px;"></div>
    </div>
  `;
  
  // Восстанавливаем введенный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    document.getElementById(`answer-input-${index}`).value = examState.userAnswers[index];
  }
  
  // Сохраняем ответ при вводе
  const textarea = document.getElementById(`answer-input-${index}`);
  textarea.addEventListener('input', function() {
    examState.userAnswers[index] = this.value.trim();
  });
}

function showDecodeQuestion(task, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="decode-task">
      <h3>Задание ${index + 1}: Расшифровка</h3>
      <div class="task-code">
        <p><strong>Код:</strong></p>
        <div class="code-display">${task.code}</div>
        <button class="btn btn-copy" onclick="copyToClipboard('${task.code.replace(/'/g, "\\'")}')">
          <i class="fas fa-copy"></i> Скопировать
        </button>
      </div>
      <div class="task-question">${task.question}</div>
      <div class="task-input">
        <label for="decode-input-${index}">Ваша расшифровка:</label>
        <textarea id="decode-input-${index}" placeholder="Введите расшифровку здесь..." rows="4"></textarea>
      </div>
    </div>
  `;
  
  // Восстанавливаем введенный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    document.getElementById(`decode-input-${index}`).value = examState.userAnswers[index];
  }
  
  // Сохраняем ответ при вводе
  const textarea = document.getElementById(`decode-input-${index}`);
  textarea.addEventListener('input', function() {
    examState.userAnswers[index] = this.value.trim();
  });
}

// ====================== ПОДСКАЗКИ ======================

function showHint(index) {
  const hintContainer = document.getElementById(`hint-${index}`);
  const task = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks[index]
    : examState.currentExamData[index];
  
  if (task.hints) {
    const hintIndex = examState.userAnswers[index] ? 
      Math.min(examState.userAnswers[index].length % task.hints.length, task.hints.length - 1) : 0;
    
    hintContainer.innerHTML = `<p><strong>Подсказка:</strong> ${task.hints[hintIndex]}</p>`;
    hintContainer.style.display = 'block';
  }
}

// ====================== НАВИГАЦИЯ ======================

function prevQuestion() {
  if (examState.currentQuestionIndex > 0) {
    examState.currentQuestionIndex--;
    showQuestion();
  }
}

function nextQuestion() {
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  if (examState.currentQuestionIndex < totalQuestions - 1) {
    examState.currentQuestionIndex++;
    showQuestion();
  } else {
    // Если это последний вопрос, показываем кнопку завершения
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('btn-submit').style.display = 'inline-block';
  }
}

function submitAnswer() {
  // Проверяем текущий ответ перед завершением
  const currentIndex = examState.currentQuestionIndex;
  const userAnswer = examState.userAnswers[currentIndex];
  
  if (userAnswer === undefined || userAnswer === '') {
    alert('Пожалуйста, ответьте на текущий вопрос перед завершением!');
    return;
  }
  
  finishExam();
}

function updateProgress() {
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  const progress = ((examState.currentQuestionIndex + 1) / totalQuestions) * 100;
  
  document.getElementById('current-question').textContent = examState.currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('exam-progress').value = progress;
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const submitBtn = document.getElementById('btn-submit');
  
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  prevBtn.disabled = examState.currentQuestionIndex === 0;
  
  if (examState.currentQuestionIndex === totalQuestions - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  }
}

// ====================== ЗАВЕРШЕНИЕ ЭКЗАМЕНА ======================

function finishExam() {
  clearInterval(examState.timerInterval);
  examState.isExamActive = false;
  
  // Рассчитываем результаты
  const results = calculateResults();
  
  // Сохраняем попытку
  saveExamAttempt(results);
  
  // Показываем результаты
  showResults(results);
}

function calculateResults() {
  const examType = examState.currentExamType;
  const endTime = new Date();
  const timeSpent = Math.floor((endTime - examState.startTime) / 1000);
  
  let totalScore = 0;
  let maxScore = 0;
  let correctAnswers = 0;
  let detailedResults = [];
  
  if (examType === 'test') {
    maxScore = examState.currentExamData.length * 10;
    
    examState.currentExamData.forEach((question, index) => {
      const userAnswer = examState.userAnswers[index];
      const isCorrect = userAnswer === question.correct;
      
      if (isCorrect) {
        totalScore += 10;
        correctAnswers++;
      }
      
      detailedResults.push({
        question: question.question,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Нет ответа',
        correctAnswer: question.options[question.correct],
        isCorrect: isCorrect,
        topic: question.topic
      });
    });
    
  } else if (examType === 'practice') {
    maxScore = examState.currentExamData.length * 25;
    
    examState.currentExamData.forEach((task, index) => {
      const userAnswer = examState.userAnswers[index] || '';
      const normalizedUser = normalizeText(userAnswer);
      const normalizedCorrect = normalizeText(task.answer);
      const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
      const score = Math.round(similarity * 25);
      
      if (similarity >= 0.8) correctAnswers++;
      totalScore += score;
      
      detailedResults.push({
        description: task.description,
        userAnswer: userAnswer || 'Нет ответа',
        correctAnswer: task.answer,
        similarity: Math.round(similarity * 100),
        score: score,
        topic: task.topic
      });
    });
    
  } else if (examType === 'exam') {
    maxScore = examState.currentExamData.totalPoints;
    
    examState.currentExamData.tasks.forEach((task, index) => {
      const userAnswer = examState.userAnswers[index];
      let score = 0;
      let isCorrect = false;
      
      if (task.type === 'test') {
        isCorrect = userAnswer === task.correct;
        score = isCorrect ? task.points : 0;
        if (isCorrect) correctAnswers++;
        
        detailedResults.push({
          type: 'test',
          question: task.question,
          userAnswer: userAnswer !== undefined ? task.options[userAnswer] : 'Нет ответа',
          correctAnswer: task.options[task.correct],
          isCorrect: isCorrect,
          score: score,
          maxScore: task.points
        });
        
      } else if (task.type === 'practice' || task.type === 'decode') {
        const normalizedUser = normalizeText(userAnswer || '');
        const normalizedCorrect = normalizeText(task.answer);
        const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
        score = Math.round(similarity * task.points);
        
        if (similarity >= 0.8) correctAnswers++;
        
        detailedResults.push({
          type: task.type,
          question: task.description || task.question,
          userAnswer: userAnswer || 'Нет ответа',
          correctAnswer: task.answer,
          similarity: Math.round(similarity * 100),
          isCorrect: similarity >= 0.8,
          score: score,
          maxScore: task.points
        });
      }
      
      totalScore += score;
    });
  }
  
  const percentage = Math.round((totalScore / maxScore) * 100);
  const isPassed = examType === 'exam' 
    ? percentage >= examState.currentExamData.passingScore
    : percentage >= 70;
  
  return {
    examType: examType,
    examName: examType === 'exam' ? examState.currentExamData.name : examType.toUpperCase(),
    totalScore: totalScore,
    maxScore: maxScore,
    percentage: percentage,
    correctAnswers: correctAnswers,
    totalQuestions: detailedResults.length,
    timeSpent: timeSpent,
    timeLimit: examState.remainingTime,
    isPassed: isPassed,
    detailedResults: detailedResults,
    date: new Date().toISOString()
  };
}

// ====================== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ======================

function showResults(results) {
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  const examInterface = dynamicContainer.querySelector('.exam-interface');
  const examResults = dynamicContainer.querySelector('.exam-results');
  
  if (examInterface) examInterface.style.display = 'none';
  if (examResults) examResults.style.display = 'block';
  
  const container = dynamicContainer.getElementById('results-content');
  
  let certificateHtml = '';
  const newCertificate = checkForCertificate(results);
  if (newCertificate) {
    certificateHtml = `
      <div class="certificate-notification" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
        <h3><i class="fas fa-award"></i> ПОЗДРАВЛЯЕМ!</h3>
        <p>Вы получили новый сертификат:</p>
        <h2>${newCertificate}</h2>
        <p>Сертификат добавлен в вашу коллекцию</p>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="results-summary">
      <h2><i class="fas fa-chart-line"></i> РЕЗУЛЬТАТЫ КОНТРОЛЬНОЙ</h2>
      <div class="results-stats">
        <div class="stat-card ${results.isPassed ? 'success' : 'error'}">
          <div class="stat-value">${results.percentage}%</div>
          <div class="stat-label">ОБЩИЙ РЕЗУЛЬТАТ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${results.correctAnswers}/${results.totalQuestions}</div>
          <div class="stat-label">ПРАВИЛЬНЫХ ОТВЕТОВ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatTime(results.timeSpent)}</div>
          <div class="stat-label">ЗАТРАЧЕНО ВРЕМЕНИ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${results.isPassed ? 'СДАН' : 'НЕ СДАН'}</div>
          <div class="stat-label">СТАТУС</div>
        </div>
      </div>
      
      ${certificateHtml}
      
      <div class="results-details">
        <h3>Детализация по вопросам:</h3>
        <div class="details-table">
          ${results.detailedResults.map((result, index) => `
            <div class="detail-row ${result.isCorrect ? 'correct' : 'incorrect'}">
              <div class="detail-question">
                <strong>Вопрос ${index + 1}:</strong> ${result.question || result.description || ''}
              </div>
              <div class="detail-result">
                ${result.type === 'test' ? 
                  `Ваш ответ: ${result.userAnswer}<br>Правильный: ${result.correctAnswer}` :
                  `Сходство: ${result.similarity}%<br>Баллы: ${result.score}/${result.maxScore}`
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Обновляем историю
  loadExamHistory();
  updateHistoryStats();
}

function showDetailedResults() {
  // В будущем можно сделать более детальную статистику
  alert('Детальная статистика в разработке...');
}

function showCertificates() {
  const container = document.getElementById('certificates-content');
  const certificates = examStats.certificates;
  
  if (certificates.length === 0) {
    container.innerHTML = `
      <div class="certificates-view">
        <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
        <p style="text-align: center; margin: 40px 0;">
          <i class="fas fa-certificate" style="font-size: 60px; color: #ccc;"></i><br>
          У вас пока нет сертификатов. Пройдите контрольные работы, чтобы их получить!
        </p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="certificates-view">
      <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
      <div class="certificates-grid">
        ${certificates.map(cert => `
          <div class="certificate-card">
            <div class="certificate-header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <i class="fas fa-certificate"></i>
              <h3>${cert.name}</h3>
            </div>
            <div class="certificate-body">
              <p><strong>Дата получения:</strong><br>${new Date(cert.date).toLocaleDateString('ru-RU')}</p>
              <p><strong>Результат:</strong> ${cert.score}%</p>
              <p><strong>Тип:</strong> ${cert.examType}</p>
              <button class="btn btn-copy" onclick="downloadCertificate('${cert.name}')">
                <i class="fas fa-download"></i> Скачать
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Показываем модальное окно
  document.getElementById('certificates-modal').style.display = 'block';
}

// ====================== СЕРТИФИКАТЫ ======================

function checkForCertificate(results) {
    let newCertificate = null;
    
    // Проверяем условия для каждого сертификата
    const certificates = examDatabase.certificates;
    
    if (results.percentage >= certificates.basic.requirements.testScore && 
        results.totalQuestions >= certificates.basic.requirements.practiceTasks) {
        if (!examStats.certificates.some(c => c.name === certificates.basic.name)) {
            awardCertificate(certificates.basic, results);
            newCertificate = certificates.basic.name;
        }
    }
    
    if (results.percentage >= certificates.advanced.requirements.testScore && 
        results.totalQuestions >= certificates.advanced.requirements.practiceTasks &&
        results.examType !== 'test') { // Только для практики и экзаменов
        if (!examStats.certificates.some(c => c.name === certificates.advanced.name)) {
            awardCertificate(certificates.advanced, results);
            newCertificate = certificates.advanced.name;
        }
    }
    
    if (results.percentage >= certificates.expert.requirements.testScore && 
        results.totalQuestions >= certificates.expert.requirements.practiceTasks &&
        results.examType === 'exam' && 
        results.timeSpent <= certificates.expert.requirements.totalTime) {
        if (!examStats.certificates.some(c => c.name === certificates.expert.name)) {
            awardCertificate(certificates.expert, results);
            newCertificate = certificates.expert.name;
        }
    }
    
    return newCertificate;
}

function awardCertificate(certData, results) {
    examStats.certificates.push({
        name: certData.name,
        description: certData.description,
        date: new Date().toISOString(),
        score: results.percentage,
        examType: results.examType,
        examName: results.examName,
        level: certData.name.includes('Базовый') ? 1 : 
               certData.name.includes('Продвинутый') ? 2 : 3
    });
    
    localStorage.setItem('examStats', JSON.stringify(examStats));
}

function downloadCertificate(certificateName) {
  // В будущем можно реализовать генерацию PDF
  alert(`Сертификат "${certificateName}" будет скачан в формате PDF.\n(Функция в разработке)`);
}

// ====================== ИСТОРИЯ ПОПЫТОК ======================

function saveExamAttempt(results) {
  examStats.attempts.unshift({
    id: Date.now(),
    ...results
  });
  
  // Ограничиваем историю 50 последними попытками
  if (examStats.attempts.length > 50) {
    examStats.attempts = examStats.attempts.slice(0, 50);
  }
  
  // Обновляем общую статистику
  examStats.totalScore += results.totalScore;
  examStats.totalTime += results.timeSpent;
  
  localStorage.setItem('examStats', JSON.stringify(examStats));
}

function loadExamHistory() {
  const container = document.getElementById('history-table-body');
  if (!container) return;
  
  const attempts = examStats.attempts;
  
  if (attempts.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px; color: #777;">
          История попыток пуста. Пройдите первую контрольную работу!
        </td>
      </tr>
    `;
    return;
  }
  
  container.innerHTML = attempts.slice(0, 10).map(attempt => `
    <tr onclick="showAttemptDetails(${attempt.id})" style="cursor: pointer;">
      <td>${new Date(attempt.date).toLocaleDateString('ru-RU')}</td>
      <td>${attempt.examType}</td>
      <td>${attempt.percentage}% (${attempt.totalScore}/${attempt.maxScore})</td>
      <td>${formatTime(attempt.timeSpent)}</td>
      <td>
        <span class="status-badge ${attempt.isPassed ? 'passed' : 'failed'}">
          ${attempt.isPassed ? 'Сдан' : 'Не сдан'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm" onclick="event.stopPropagation(); retryAttempt(${attempt.id})">
          <i class="fas fa-redo"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  if (attempts.length > 10) {
    const tbody = container.parentElement;
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 10px; color: #777;">
        Показано 10 из ${attempts.length} попыток
      </td>
    `;
    tbody.appendChild(newRow);
  }
}

function showAttemptDetails(attemptId) {
  const attempt = examStats.attempts.find(a => a.id === attemptId);
  if (!attempt) return;
  
  const details = attempt.detailedResults.map((result, index) => `
    <div class="attempt-detail">
      <p><strong>Вопрос ${index + 1}:</strong> ${result.question || result.description || ''}</p>
      <p>Ваш ответ: ${result.userAnswer}</p>
      <p>Правильный ответ: ${result.correctAnswer}</p>
      <p>Результат: ${result.isCorrect ? '✓ Верно' : '✗ Ошибка'}</p>
    </div>
  `).join('');
  
  alert(`Детали попытки от ${new Date(attempt.date).toLocaleString('ru-RU')}\n\n${details}`);
}

function updateHistoryStats() {
  if (!examStats.attempts) return;
  
  const totalAttempts = examStats.attempts.length;
  const averageScore = totalAttempts > 0 
    ? Math.round(examStats.attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
    : 0;
  const totalTime = Math.round(examStats.totalTime / 3600);
  const certificatesCount = examStats.certificates ? examStats.certificates.length : 0;
  
  // Обновляем статистику в истории (в статической части)
  const totalAttemptsEl = document.getElementById('total-attempts');
  const averageScoreEl = document.getElementById('average-score');
  const totalTimeEl = document.getElementById('total-time');
  const certificatesCountEl = document.getElementById('certificates-count');
  
  if (totalAttemptsEl) totalAttemptsEl.textContent = totalAttempts;
  if (averageScoreEl) averageScoreEl.textContent = averageScore + '%';
  if (totalTimeEl) totalTimeEl.textContent = totalTime + 'ч';
  if (certificatesCountEl) certificatesCountEl.textContent = certificatesCount;
}

// ====================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======================

function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Код скопирован в буфер обмена!');
  });
}

function restartExam() {
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  const examResults = dynamicContainer.querySelector('.exam-results');
  if (examResults) examResults.style.display = 'none';
  
  showExamTypeSelector();
}

function tryAnotherType() {
  const dynamicContainer = document.getElementById('exam-dynamic-content');
  if (!dynamicContainer) return;
  
  const examResults = dynamicContainer.querySelector('.exam-results');
  if (examResults) examResults.style.display = 'none';
  
  showExamTypeSelector();
}

// ====================== ФУНКЦИИ ДЛЯ ОЧИСТКИ ИСТОРИИ ======================

function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю попыток? Это действие нельзя отменить.')) {
        examStats = {
            attempts: [],
            certificates: examStats.certificates, // Сохраняем сертификаты
            totalScore: 0,
            totalTime: 0
        };
        localStorage.setItem('examStats', JSON.stringify(examStats));
        loadExamHistory();
        updateHistoryStats();
        alert('История попыток очищена.');
    }
}

// ====================== РЕЖИМ ЭКЗАМЕНАТОРА ======================

let customQuestions = JSON.parse(localStorage.getItem('customQuestions') || '[]');

function changeQuestionType() {
    const type = document.getElementById('question-type').value;
    document.getElementById('test-options').style.display = type === 'test' ? 'block' : 'none';
    document.getElementById('practice-fields').style.display = type === 'practice' ? 'block' : 'none';
    document.getElementById('decode-fields').style.display = type === 'decode' ? 'block' : 'none';
}

function addOption() {
    const container = document.getElementById('options-container');
    const index = container.children.length;
    
    const optionRow = document.createElement('div');
    optionRow.className = 'option-row';
    optionRow.innerHTML = `
        <input type="radio" name="correct-option" value="${index}">
        <input type="text" placeholder="Вариант ответа ${index + 1}" class="option-input">
        <button class="btn btn-sm" onclick="removeOption(this)"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(optionRow);
}

function removeOption(button) {
    if (document.querySelectorAll('.option-row').length > 1) {
        button.parentElement.remove();
        updateOptionIndexes();
    }
}

function updateOptionIndexes() {
    const options = document.querySelectorAll('.option-row');
    options.forEach((row, index) => {
        row.querySelector('input[type="radio"]').value = index;
        row.querySelector('.option-input').placeholder = `Вариант ответа ${index + 1}`;
    });
}

function saveQuestion() {
    const type = document.getElementById('question-type').value;
    const text = document.getElementById('question-text').value.trim();
    
    if (!text) {
        alert('Введите текст вопроса');
        return;
    }
    
    let question;
    
    switch(type) {
        case 'test':
            const options = Array.from(document.querySelectorAll('.option-input'))
                .map(input => input.value.trim())
                .filter(val => val);
            
            const correct = document.querySelector('input[name="correct-option"]:checked');
            
            if (options.length < 2) {
                alert('Добавьте хотя бы 2 варианта ответа');
                return;
            }
            
            if (!correct) {
                alert('Выберите правильный вариант ответа');
                return;
            }
            
            question = {
                type: 'test',
                question: text,
                options: options,
                correct: parseInt(correct.value),
                difficulty: 'medium',
                topic: 'Пользовательский',
                author: 'Пользователь',
                date: new Date().toISOString()
            };
            break;
            
        case 'practice':
            const description = document.getElementById('practice-description').value.trim();
            const answer = document.getElementById('practice-answer').value.trim();
            
            if (!description || !answer) {
                alert('Заполните все поля');
                return;
            }
            
            question = {
                type: 'practice',
                description: description,
                answer: answer,
                difficulty: 'medium',
                topic: 'Пользовательский',
                author: 'Пользователь',
                date: new Date().toISOString()
            };
            break;
            
        case 'decode':
            const code = document.getElementById('decode-code').value.trim();
            const decodeAnswer = document.getElementById('decode-answer').value.trim();
            
            if (!code || !decodeAnswer) {
                alert('Заполните все поля');
                return;
            }
            
            question = {
                type: 'decode',
                code: code,
                question: 'Расшифруйте данный код',
                answer: decodeAnswer,
                difficulty: 'medium',
                topic: 'Пользовательский',
                author: 'Пользователь',
                date: new Date().toISOString()
            };
            break;
    }
    
    question.id = Date.now();
    customQuestions.push(question);
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions));
    
    // Очистить форму
    document.getElementById('question-text').value = '';
    document.querySelectorAll('.option-input').forEach(input => input.value = '');
    document.getElementById('practice-description').value = '';
    document.getElementById('practice-answer').value = '';
    document.getElementById('decode-code').value = '';
    document.getElementById('decode-answer').value = '';
    
    loadCustomQuestions();
    alert('Вопрос сохранен!');
}

function loadCustomQuestions() {
    const container = document.getElementById('custom-questions-list');
    container.innerHTML = '';
    
    if (customQuestions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777;">Нет сохраненных вопросов</p>';
        return;
    }
    
    customQuestions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <div class="question-info">
                <strong>${question.type === 'test' ? 'Тест' : question.type === 'practice' ? 'Практика' : 'Расшифровка'}</strong>
                <div>${question.question || question.description || question.code}</div>
                <small>${new Date(question.date).toLocaleDateString('ru-RU')}</small>
            </div>
            <div class="question-actions">
                <button class="btn btn-sm" onclick="editQuestion(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-secondary" onclick="deleteQuestion(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(item);
    });
}

function createCustomTest() {
    const selectedQuestions = customQuestions.filter((q, i) => 
        document.querySelector(`input[type="checkbox"][data-index="${i}"]`)?.checked
    );
    
    if (selectedQuestions.length === 0) {
        alert('Выберите хотя бы один вопрос');
        return;
    }
    
    examState.currentExamType = 'exam';
    examState.currentExamData = {
        name: 'Пользовательский тест',
        tasks: selectedQuestions.map(q => ({
            ...q,
            points: 10,
            type: q.type
        })),
        totalPoints: selectedQuestions.length * 10,
        timeLimit: selectedQuestions.length * 60,
        passingScore: 70
    };
    
    // Запустить экзамен
    examState.currentQuestionIndex = 0;
    examState.userAnswers = [];
    examState.startTime = new Date();
    examState.remainingTime = examState.currentExamData.timeLimit;
    examState.isExamActive = true;
    
    document.getElementById('examiner-mode').style.display = 'none';
    const dynamicContainer = document.getElementById('exam-dynamic-content');
    if (dynamicContainer) dynamicContainer.style.display = 'block';
    
    const examInterface = dynamicContainer.querySelector('.exam-interface');
    if (examInterface) examInterface.style.display = 'block';
    
    startTimer();
    showQuestion();
}

// ====================== РЕЖИМ СИНОПТИКА ======================

let currentTool = 'select';
let mapElements = [];
let isobars = [];

function generateWeatherMap() {
    const map = document.getElementById('weather-map');
    map.innerHTML = '<div class="map-grid" id="map-grid"></div>';
    mapElements = [];
    isobars = [];
    
    const width = map.offsetWidth;
    const height = map.offsetHeight;
    
    // Генерация изобар
    for (let i = 0; i < 5; i++) {
        const pressure = 980 + i * 5; // hPa
        const centerX = width * (0.3 + Math.random() * 0.4);
        const centerY = height * (0.3 + Math.random() * 0.4);
        const radius = 100 + Math.random() * 150;
        
        const isobar = document.createElement('div');
        isobar.className = 'isobar';
        isobar.style.left = (centerX - radius) + 'px';
        isobar.style.top = (centerY - radius) + 'px';
        isobar.style.width = (radius * 2) + 'px';
        isobar.style.height = (radius * 2) + 'px';
        isobar.title = `${pressure} гПа`;
        
        map.appendChild(isobar);
        isobars.push({element: isobar, pressure, centerX, centerY, radius});
    }
    
    // Генерация циклонов и антициклонов
    const pressureSystems = [
        {type: 'cyclone', count: 2},
        {type: 'anticyclone', count: 2}
    ];
    
    pressureSystems.forEach(system => {
        for (let i = 0; i < system.count; i++) {
            const x = 50 + Math.random() * (width - 100);
            const y = 50 + Math.random() * (height - 100);
            
            const element = document.createElement('div');
            element.className = system.type;
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.innerHTML = system.type === 'cyclone' ? 'L' : 'H';
            element.title = system.type === 'cyclone' ? 'Циклон' : 'Антициклон';
            
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                showPressureSystemInfo(system.type, {x, y});
            });
            
            map.appendChild(element);
            mapElements.push({
                type: system.type,
                element: element,
                x: x,
                y: y
            });
        }
    });
    
    // Генерация фронтов
    const fronts = [
        {type: 'warm', x1: 100, y1: 200, x2: 300, y2: 150},
        {type: 'cold', x1: 400, y1: 300, x2: 500, y2: 250},
        {type: 'occluded', x1: 200, y1: 400, x2: 350, y2: 350}
    ];
    
    fronts.forEach(front => {
        const length = Math.sqrt(
            Math.pow(front.x2 - front.x1, 2) + 
            Math.pow(front.y2 - front.y1, 2)
        );
        const angle = Math.atan2(front.y2 - front.y1, front.x2 - front.x1) * 180 / Math.PI;
        
        const element = document.createElement('div');
        element.className = `front ${front.type}`;
        element.style.left = front.x1 + 'px';
        element.style.top = front.y1 + 'px';
        element.style.width = length + 'px';
        element.style.transform = `rotate(${angle}deg)`;
        element.title = front.type === 'warm' ? 'Теплый фронт' : 
                       front.type === 'cold' ? 'Холодный фронт' : 
                       'Фронт окклюзии';
        
        map.appendChild(element);
        mapElements.push({
            type: 'front',
            frontType: front.type,
            element: element,
            x1: front.x1,
            y1: front.y1,
            x2: front.x2,
            y2: front.y2
        });
    });
    
    // Генерация метеостанций
    for (let i = 0; i < 8; i++) {
        const x = 30 + Math.random() * (width - 60);
        const y = 30 + Math.random() * (height - 60);
        
        const station = document.createElement('div');
        station.className = 'weather-station';
        station.style.left = x + 'px';
        station.style.top = y + 'px';
        station.innerHTML = '⛅';
        station.title = 'Метеостанция';
        
        station.addEventListener('click', function(e) {
            e.stopPropagation();
            showStationInfo(x, y);
        });
        
        map.appendChild(station);
        mapElements.push({
            type: 'station',
            element: station,
            x: x,
            y: y
        });
    }
}

function setupMapTools() {
    document.querySelectorAll('.map-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            document.querySelectorAll('.map-tool').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
        });
    });
    
    const map = document.getElementById('weather-map');
    map.addEventListener('click', function(e) {
        const rect = map.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch(currentTool) {
            case 'cyclone':
                addPressureSystem('cyclone', x, y);
                break;
            case 'anticyclone':
                addPressureSystem('anticyclone', x, y);
                break;
            case 'front':
                // Для фронтов нужны две точки
                if (!window.frontStart) {
                    window.frontStart = {x, y};
                    alert('Выберите конечную точку фронта');
                } else {
                    addFront(window.frontStart.x, window.frontStart.y, x, y);
                    window.frontStart = null;
                }
                break;
            case 'station':
                addWeatherStation(x, y);
                break;
        }
    });
}

function addPressureSystem(type, x, y) {
    const element = document.createElement('div');
    element.className = type;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.innerHTML = type === 'cyclone' ? 'L' : 'H';
    element.title = type === 'cyclone' ? 'Циклон' : 'Антициклон';
    
    document.getElementById('weather-map').appendChild(element);
    
    mapElements.push({
        type: type,
        element: element,
        x: x,
        y: y
    });
}

function addFront(x1, y1, x2, y2) {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    const element = document.createElement('div');
    element.className = 'front warm';
    element.style.left = x1 + 'px';
    element.style.top = y1 + 'px';
    element.style.width = length + 'px';
    element.style.transform = `rotate(${angle}deg)`;
    element.title = 'Теплый фронт';
    
    document.getElementById('weather-map').appendChild(element);
    
    mapElements.push({
        type: 'front',
        frontType: 'warm',
        element: element,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    });
}

function addWeatherStation(x, y) {
    const station = document.createElement('div');
    station.className = 'weather-station';
    station.style.left = x + 'px';
    station.style.top = y + 'px';
    station.innerHTML = '⛅';
    station.title = 'Метеостанция';
    
    station.addEventListener('click', function(e) {
        e.stopPropagation();
        showStationInfo(x, y);
    });
    
    document.getElementById('weather-map').appendChild(station);
    
    mapElements.push({
        type: 'station',
        element: station,
        x: x,
        y: y
    });
}

function analyzeMap() {
    const analysis = document.getElementById('map-analysis');
    const forecast = document.getElementById('weather-forecast');
    const recommendations = document.getElementById('weather-recommendations');
    
    // Анализ давления
    const cyclones = mapElements.filter(el => el.type === 'cyclone').length;
    const anticyclones = mapElements.filter(el => el.type === 'anticyclone').length;
    
    let analysisText = `Анализ карты:\n`;
    analysisText += `• Циклонов: ${cyclones}\n`;
    analysisText += `• Антициклонов: ${anticyclones}\n`;
    analysisText += `• Метеостанций: ${mapElements.filter(el => el.type === 'station').length}\n`;
    analysisText += `• Изобар: ${isobars.length}\n`;
    analysisText += `• Фронтов: ${mapElements.filter(el => el.type === 'front').length}`;
    
    // Прогноз
    let forecastText = '';
    if (cyclones > anticyclones) {
        forecastText = 'Преобладает циклоническая деятельность. Ожидаются:';
        forecastText += '\n• Облачность';
        forecastText += '\n• Осадки';
        forecastText += '\n• Усиление ветра';
        forecastText += '\n• Понижение температуры';
    } else {
        forecastText = 'Преобладает антициклоническая деятельность. Ожидаются:';
        forecastText += '\n• Ясная погода';
        forecastText += '\n• Нет осадков';
        forecastText += '\n• Слабый ветер';
        forecastText += '\n• Суточные колебания температуры';
    }
    
    // Рекомендации
    let recText = '';
    if (cyclones > 0) {
        recText = '⚠️ Внимание к циклоническим системам:\n';
        recText += '• Мониторинг развития циклонов\n';
        recText += '• Прогноз траектории движения\n';
        recText += '• Оценка риска опасных явлений';
    } else {
        recText = '✅ Стабильная погодная ситуация:\n';
        recText += '• Благоприятные условия\n';
        recText += '• Минимальные риски\n';
        recText += '• Стабильный прогноз';
    }
    
    analysis.textContent = analysisText;
    forecast.textContent = forecastText;
    recommendations.textContent = recText;
}

function showPressureSystemInfo(type, position) {
    const tool = document.getElementById('analysis-tool');
    const content = document.getElementById('tool-content');
    
    const info = type === 'cyclone' ? 
        'Циклон - область низкого давления. Характеризуется:\n• Восходящими потоками воздуха\n• Облачностью и осадками\n• Ветер против часовой стрелки (в Сев. полушарии)' :
        'Антициклон - область высокого давления. Характеризуется:\n• Нисходящими потоками воздуха\n• Ясной погодой\n• Ветер по часовой стрелке (в Сев. полушарии)';
    
    content.textContent = info;
    tool.style.left = (position.x + 20) + 'px';
    tool.style.top = (position.y + 20) + 'px';
    tool.style.display = 'block';
    
    // Скрыть через 5 секунд
    setTimeout(() => {
        tool.style.display = 'none';
    }, 5000);
}

function showStationInfo(x, y) {
    const tool = document.getElementById('analysis-tool');
    const content = document.getElementById('tool-content');
    
    const weatherTypes = [
        'Ясно, 15°C, ветер 3 м/с',
        'Облачно, 12°C, ветер 5 м/с',
        'Дождь, 10°C, ветер 7 м/с',
        'Туман, 8°C, ветер 1 м/с',
        'Снег, -2°C, ветер 4 м/с'
    ];
    
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    content.textContent = `Метеостанция\nПогода: ${randomWeather}\nДавление: ${980 + Math.floor(Math.random() * 40)} гПа`;
    
    tool.style.left = (x + 20) + 'px';
    tool.style.top = (y + 20) + 'px';
    tool.style.display = 'block';
    
    setTimeout(() => {
        tool.style.display = 'none';
    }, 5000);
}

function toggleMapGrid() {
    const grid = document.getElementById('map-grid');
    grid.style.display = grid.style.display === 'none' ? 'block' : 'none';
}

// ====================== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ======================

function retryAttempt(attemptId) {
  const attempt = examStats.attempts.find(a => a.id === attemptId);
  if (!attempt) return;
  
  // Загружаем тот же тип экзамена
  selectExamType(attempt.examType);
  
  // Настраиваем параметры как в прошлой попытке
  setTimeout(() => {
    const dynamicContainer = document.getElementById('exam-dynamic-content');
    if (dynamicContainer && attempt.examType === 'test') {
      const difficultySelect = dynamicContainer.getElementById('test-difficulty');
      const countSelect = dynamicContainer.getElementById('test-count');
      if (difficultySelect && countSelect) {
        difficultySelect.value = 'basic';
        countSelect.value = Math.min(attempt.totalQuestions, 30);
      }
    }
    alert('Настройки загружены. Нажмите "НАЧАТЬ КОНТРОЛЬНУЮ РАБОТУ"');
  }, 100);
}

function exportHistory() {
  const dataStr = JSON.stringify(examStats, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `meteocode_history_${new Date().toISOString().slice(0,10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  alert('История экспортирована в JSON файл');
}

function closeDetailedResults() {
  document.getElementById('detailed-results-modal').style.display = 'none';
}

function closeCertificates() {
  document.getElementById('certificates-modal').style.display = 'none';
}

// ====================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ======================

// Добавляем стили для раздела экзамена
const examStyles = `
  <style>
    .exam-type-selector {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .exam-type-card {
      background: var(--content-bg);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      padding: 25px;
      width: 250px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .exam-type-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      border-color: var(--btn-bg);
    }
    
    .exam-type-card i {
      font-size: 40px;
      margin-bottom: 15px;
      color: var(--btn-bg);
    }
    
    .card-details {
      margin-top: 15px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .card-details p {
      margin: 5px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .exam-settings {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin: 20px 0;
    }
    
    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--content-bg);
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .exam-timer {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--btn-bg);
    }
    
    .exam-progress {
      flex-grow: 1;
      margin: 0 20px;
      text-align: center;
    }
    
    .exam-progress progress {
      width: 100%;
      height: 10px;
      margin-top: 5px;
    }
    
    .exam-score {
      font-weight: bold;
      color: var(--btn-bg);
      margin-right: 20px;
    }
    
    .test-question, .practice-task, .decode-task {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .question-options {
      margin-top: 20px;
    }
    
    .option {
      background: var(--result-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      margin: 8px 0;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .option:hover {
      background: var(--instructions-bg);
    }
    
    .option input {
      margin-right: 10px;
    }
    
    .task-description {
      background: var(--result-bg);
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    
    .code-display {
      font-family: monospace;
      background: var(--code-bg);
      color: var(--code-text);
      padding: 15px;
      border-radius: 6px;
      margin: 10px 0;
    }
    
    .exam-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
    }
    
    .navigation-center {
      display: flex;
      gap: 10px;
    }
    
    .exam-hint-area {
      margin-top: 20px;
      padding: 15px;
      background: var(--instructions-bg);
      border-radius: 8px;
      border-left: 4px solid var(--btn-bg);
    }
    
    .results-summary {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
    }
    
    .results-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }
    
    .stat-card {
      background: var(--result-bg);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      border: 2px solid var(--border-color);
    }
    
    .stat-card.success {
      border-color: var(--success-color);
      background: #d4edda;
    }
    
    .stat-card.error {
      border-color: #dc3545;
      background: #f8d7da;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .details-table {
      margin-top: 20px;
    }
    
    .detail-row {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    
    .detail-row.correct {
      background: #d4edda;
      border-color: #c3e6cb;
    }
    
    .detail-row.incorrect {
      background: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .results-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    
    .exam-history {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin-top: 30px;
    }
    
    .history-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .history-stat {
      background: var(--result-bg);
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      border: 1px solid var(--border-color);
    }
    
    .history-stat .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--btn-bg);
    }
    
    .history-stat .stat-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .history-table th, .history-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    .history-table tr:hover {
      background: var(--result-bg);
    }
    
    .status-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .status-badge.passed {
      background: #d4edda;
      color: #155724;
    }
    
    .status-badge.failed {
      background: #f8d7da;
      color: #721c24;
    }
    
    .certificates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .certificate-card {
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
    }
    
    .certificate-header {
      padding: 20px;
      text-align: center;
      color: white;
    }
    
    .certificate-header i {
      font-size: 40px;
      margin-bottom: 10px;
    }
    
    .certificate-body {
      padding: 20px;
      background: var(--content-bg);
    }
    
    @media (max-width: 768px) {
      .exam-type-selector {
        flex-direction: column;
        align-items: center;
      }
      
      .exam-type-card {
        width: 100%;
        max-width: 300px;
      }
      
      .exam-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .results-stats {
        grid-template-columns: 1fr 1fr;
      }
      
      .history-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .results-actions {
        flex-direction: column;
      }
      
      .exam-navigation {
        flex-direction: column;
        gap: 10px;
      }
      
      .navigation-center {
        order: 3;
        margin-top: 10px;
      }
    }
  </style>
`;

// Добавляем стили в head при загрузке
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('exam-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'exam-styles';
    styleElement.innerHTML = examStyles;
    document.head.appendChild(styleElement);
  }
});