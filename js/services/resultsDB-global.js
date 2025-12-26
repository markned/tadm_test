/**
 * Service for managing quiz attempt results in IndexedDB - Global version
 */
(function(window) {
    'use strict';

    const DB_NAME = 'QuizResultsDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'attempts';
    let dbInstance = null;

    function initDB() {
        return new Promise((resolve, reject) => {
            if (dbInstance) {
                resolve(dbInstance);
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                dbInstance = event.target.result;
                resolve(dbInstance);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: false });
                    objectStore.createIndex('username', 'username', { unique: false });
                    objectStore.createIndex('testId', 'testId', { unique: false });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    objectStore.createIndex('score', 'score', { unique: false });
                    objectStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    function generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async function saveAttempt(attemptData) {
        const db = await initDB();
        const attempt = {
            id: generateId(),
            username: attemptData.username,
            testId: attemptData.testId,
            testName: attemptData.testName,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            score: attemptData.score,
            correct: attemptData.correct,
            incorrect: attemptData.incorrect,
            total: attemptData.total,
            passed: attemptData.passed,
            quizSize: attemptData.quizSize,
            examMode: true,
            timeSpent: attemptData.timeSpent,
            categoryStats: attemptData.categoryStats || {},
            wrongAnswers: attemptData.wrongAnswers || []
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(attempt);

            request.onsuccess = () => {
                resolve(attempt.id);
            };

            request.onerror = () => {
                reject(new Error('Failed to save attempt'));
            };
        });
    }

    async function getAllAttempts() {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
            };

            request.onerror = () => {
                reject(new Error('Failed to get all attempts'));
            };
        });
    }

    async function getAttemptById(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                reject(new Error('Failed to get attempt by ID'));
            };
        });
    }

    async function deleteAttempt(id) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to delete attempt'));
            };
        });
    }

    // Export to window
    window.QuizApp = window.QuizApp || {};
    window.QuizApp.ResultsDB = {
        initDB,
        saveAttempt,
        getAllAttempts,
        getAttemptById,
        deleteAttempt
    };

})(window);

