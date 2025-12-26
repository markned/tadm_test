/**
 * TestSelector component - Global version (uses global React)
 */
(function(window) {
    'use strict';

    const { useState, useEffect } = React;

    function TestSelector({ onTestSelect, onShowHistory }) {
        const [tests, setTests] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            async function fetchTests() {
                try {
                    setLoading(true);
                    if (window.QuizApp && window.QuizApp.TestLoader) {
                        const availableTests = await window.QuizApp.TestLoader.loadAvailableTests();
                        setTests(availableTests);
                        setError(null);
                    } else {
                        throw new Error('TestLoader not available');
                    }
                } catch (err) {
                    console.error('Error loading tests:', err);
                    setError('Failed to load tests. Please refresh the page.');
                } finally {
                    setLoading(false);
                }
            }

            fetchTests();
        }, []);

        if (loading) {
            return React.createElement('div', { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6" },
                React.createElement('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center" },
                    React.createElement('div', { className: "text-lg font-semibold text-slate-800" }, "Loading tests..."),
                    React.createElement('div', { className: "text-sm text-slate-500 mt-2" }, "Please wait")
                )
            );
        }

        if (error) {
            return React.createElement('div', { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6" },
                React.createElement('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full" },
                    React.createElement('div', { className: "text-lg font-semibold text-red-600" }, "Error"),
                    React.createElement('div', { className: "text-sm text-slate-500 mt-2" }, error),
                    React.createElement('button', {
                        onClick: () => window.location.reload(),
                        className: "mt-4 w-full px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                    }, "Refresh Page")
                )
            );
        }

        if (tests.length === 0) {
            return React.createElement('div', { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6" },
                React.createElement('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center" },
                    React.createElement('div', { className: "text-lg font-semibold text-slate-800" }, "No tests available"),
                    React.createElement('div', { className: "text-sm text-slate-500 mt-2" }, "Please check TESTS directory")
                )
            );
        }

        return React.createElement('div', { className: "min-h-screen bg-slate-50 flex items-center justify-center p-6" },
            React.createElement('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl w-full" },
                React.createElement('h1', { className: "text-3xl font-bold text-slate-900 mb-2" }, "Select a Test"),
                React.createElement('p', { className: "text-slate-600 mb-6" }, "Choose a test to begin"),
                React.createElement('div', { className: "space-y-3 mb-6" },
                    tests.map((test) => React.createElement('button', {
                        key: test.id,
                        onClick: () => onTestSelect(test),
                        className: "w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                    },
                        React.createElement('div', { className: "font-semibold text-lg text-slate-900" }, test.name),
                        React.createElement('div', { className: "text-sm text-slate-500 mt-1" }, `Test ID: ${test.id}`),
                        React.createElement('div', { className: "text-xs text-slate-400 mt-1" },
                            `${test.quizData?.length || 0} questions available`
                        )
                    ))
                ),
                React.createElement('button', {
                    onClick: onShowHistory,
                    className: "w-full px-4 py-3 rounded-xl bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition-all"
                }, "View Results History")
            )
        );
    }

    // Export to window
    window.QuizApp = window.QuizApp || {};
    window.QuizApp.TestSelector = TestSelector;

})(window);

