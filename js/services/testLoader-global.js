/**
 * Service for loading tests - Global version (exports via window)
 */
(function(window) {
    'use strict';

    /**
     * Discovers and loads all available tests from TESTS directory
     */
    async function loadAvailableTests() {
        const tests = [];
        
        try {
            console.log('Attempting to load TESTS/tests.json...');
            // Add cache busting to avoid browser caching
            const cacheBuster = `?v=${Date.now()}`;
            const response = await fetch(`TESTS/tests.json${cacheBuster}`);
            console.log('Response status:', response.status, response.statusText);
            
            if (response.ok) {
                const testsList = await response.json();
                console.log('Loaded tests.json:', testsList);
                
                for (const testInfo of testsList) {
                    try {
                        console.log(`Loading test: ${testInfo.id}...`);
                        const test = await loadTest(testInfo.id);
                        if (test) {
                            console.log(`Successfully loaded test: ${testInfo.id}`);
                            tests.push(test);
                        } else {
                            console.warn(`Failed to load test ${testInfo.id}: returned null`);
                        }
                    } catch (error) {
                        console.warn(`Failed to load test ${testInfo.id}:`, error);
                    }
                }
                
                if (tests.length > 0) {
                    return tests;
                }
            } else {
                console.warn(`tests.json returned status ${response.status}`);
            }
        } catch (error) {
            console.warn('Error loading tests.json:', error);
            console.warn('Trying fallback: known test IDs');
        }

        // Fallback: try known test IDs
        console.log('Using fallback: trying known test IDs...');
        const knownTestIds = ['C_TADM_23', 'E_S4CON_2505'];
        for (const testId of knownTestIds) {
            try {
                console.log(`Trying to load test: ${testId}...`);
                const test = await loadTest(testId);
                if (test) {
                    console.log(`Successfully loaded test: ${testId}`);
                    tests.push(test);
                } else {
                    console.warn(`Test ${testId} returned null`);
                }
            } catch (error) {
                console.warn(`Failed to load test ${testId}:`, error);
            }
        }

        console.log(`Total tests loaded: ${tests.length}`);
        return tests;
    }

    /**
     * Loads a specific test by ID
     */
    async function loadTest(testId) {
        try {
            // Add cache busting to avoid browser caching
            const cacheBuster = `?v=${Date.now()}`;
            const configUrl = `TESTS/${testId}/config.json${cacheBuster}`;
            const dataUrl = `TESTS/${testId}/quiz-data.json${cacheBuster}`;
            
            console.log(`Fetching ${configUrl} and ${dataUrl}...`);
            
            const [configResponse, dataResponse] = await Promise.all([
                fetch(configUrl),
                fetch(dataUrl)
            ]);

            console.log(`Config response: ${configResponse.status} ${configResponse.statusText}`);
            console.log(`Data response: ${dataResponse.status} ${dataResponse.statusText}`);

            if (!configResponse.ok) {
                throw new Error(`Config file not found: ${configUrl} (${configResponse.status})`);
            }
            if (!dataResponse.ok) {
                throw new Error(`Data file not found: ${dataUrl} (${dataResponse.status})`);
            }

            const config = await configResponse.json();
            const quizData = await dataResponse.json();

            console.log(`Loaded config for ${testId}:`, { testId: config.testId, testName: config.testName });
            console.log(`Loaded ${quizData.length} questions for ${testId}`);

            if (!config.testId || !config.testName || !Array.isArray(quizData)) {
                throw new Error(`Invalid test data for ${testId}`);
            }

            return {
                id: config.testId,
                name: config.testName,
                config: config,
                quizData: quizData
            };
        } catch (error) {
            console.error(`Error loading test ${testId}:`, error);
            throw error; // Re-throw to see the error in caller
        }
    }

    // Export to window
    window.QuizApp = window.QuizApp || {};
    window.QuizApp.TestLoader = {
        loadAvailableTests,
        loadTest
    };

})(window);

