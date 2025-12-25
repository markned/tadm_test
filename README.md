# Quiz App - Universal Test Platform

Универсальное приложение для проведения тестов с поддержкой различных датасетов.

## Структура проекта

```
.
├── index.html              # Основное приложение (оболочка)
├── C_TADM_23/              # Папка теста C_TADM_23
│   ├── config.json         # Конфигурация теста
│   └── quiz-data.json      # Данные вопросов
└── [другие_тесты]/         # Папки для других тестов
    ├── config.json
    └── quiz-data.json
```

## Как добавить новый тест

1. Создайте папку с именем теста (например, `MY_TEST`)
2. Создайте файл `config.json` с конфигурацией:
```json
{
  "testId": "MY_TEST",
  "testName": "My Test Name",
  "quizSizes": [5, 20, 40, 80, 100],
  "defaultQuizSize": 40,
  "passThreshold": 70,
  "hintMs": 50,
  "autoNextDelayMs": 2000,
  "timePerQuestionSec": 120,
  "topicDistribution": {
    "Category1": 50,
    "Category2": 50
  },
  "categoryDisplayNames": {
    "Category1": "Category 1 Display Name",
    "Category2": "Category 2 Display Name"
  }
}
```

3. Создайте файл `quiz-data.json` с вопросами в формате:
```json
[
  {
    "id": "Q1",
    "question": "Question text?",
    "options": ["Option 1", "Option 2", "Option 3"],
    "correctAnswerIndex": [0],
    "type": "single",
    "explanation": "Explanation text",
    "category": "Category1"
  }
]
```

## Использование

### Выбор теста через URL параметр

Откройте `index.html?test=C_TADM_23` для загрузки теста C_TADM_23.

По умолчанию загружается тест `C_TADM_23`.

### Параметры конфигурации

- `testId` - Идентификатор теста (отображается в интерфейсе)
- `testName` - Название теста (используется в заголовке страницы)
- `quizSizes` - Доступные размеры теста
- `defaultQuizSize` - Размер по умолчанию
- `passThreshold` - Порог прохождения в процентах
- `hintMs` - Длительность подсказки в миллисекундах
- `autoNextDelayMs` - Задержка перед автоматическим переходом к следующему вопросу
- `timePerQuestionSec` - Время на вопрос в секундах (для расчета общего времени)
- `topicDistribution` - Распределение вопросов по категориям в процентах (должно суммироваться до 100)
- `categoryDisplayNames` - Отображаемые названия категорий

## Формат вопросов

### Типы вопросов

- `"single"` - Один правильный ответ
- `"multiple"` - Несколько правильных ответов

### Структура вопроса

```json
{
  "id": "Q1",
  "question": "Текст вопроса?",
  "options": ["Вариант 1", "Вариант 2", "Вариант 3"],
  "correctAnswerIndex": [0],  // Индекс(ы) правильного ответа
  "type": "single",           // или "multiple"
  "explanation": "Объяснение",
  "category": "CategoryName"
}
```

## GitHub Pages

Приложение работает на GitHub Pages без необходимости в сервере или Python. Все данные загружаются через Fetch API.

