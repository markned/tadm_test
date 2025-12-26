/**
 * Инициализация модулей для работы с глобальным React
 * Этот файл загружается перед основным скриптом и делает модули доступными через window
 */

// Проверяем, что React доступен
if (typeof React === 'undefined') {
    console.error('React is not loaded. Make sure React is loaded before this script.');
}

// Инициализируем пространство имен для модулей
window.QuizApp = window.QuizApp || {};

