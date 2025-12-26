/**
 * Question service - Global version (exports via window)
 */
(function(window) {
    'use strict';

    function safeArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function shuffleArray(array, rng = Math.random) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    function shuffleQuestionOptions(q) {
        if (!q || !Array.isArray(q.options)) return q;
        const idxs = q.options.map((_, i) => i);
        const shuffledIdxs = shuffleArray(idxs);

        const inv = {};
        shuffledIdxs.forEach((oldIdx, newIdx) => { inv[oldIdx] = newIdx; });

        const newOptions = shuffledIdxs.map(i => q.options[i]);
        const newCorrect = (q.correctAnswerIndex || []).map(oldIdx => inv[oldIdx]).filter(idx => idx !== undefined);

        return { ...q, options: newOptions, correctAnswerIndex: newCorrect };
    }

    function groupQuestionsByCategory(questions) {
        const byCategory = {};
        safeArray(questions).forEach(q => {
            const cat = q.category || "Other";
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(q);
        });
        return byCategory;
    }

    function sampleQuestions(quizData, sizeValue, topicDistribution = {}) {
        const count = parseInt(sizeValue, 10);
        const all = safeArray(quizData);

        const isAllMode = !Number.isFinite(count) || count <= 0 || count >= all.length;
        if (isAllMode) {
            return shuffleArray(all).map(shuffleQuestionOptions);
        }

        const hasCategories = all.some(q => q.category);
        
        if (!hasCategories || !Object.keys(topicDistribution).length) {
            const picked = shuffleArray(all).slice(0, count);
            return picked.map(shuffleQuestionOptions);
        }

        const byCategory = groupQuestionsByCategory(all);
        const picked = [];
        const categoryCounts = {};

        Object.keys(topicDistribution).forEach(cat => {
            const percentage = topicDistribution[cat];
            const categoryQuestions = safeArray(byCategory[cat]);
            const numFromCategory = Math.round(count * percentage / 100);
            categoryCounts[cat] = Math.min(numFromCategory, categoryQuestions.length);
        });

        const totalAllocated = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
        if (totalAllocated < count) {
            const remaining = count - totalAllocated;
            const categoriesWithSpace = Object.keys(topicDistribution).filter(cat => {
                const allocated = categoryCounts[cat] || 0;
                const available = safeArray(byCategory[cat]).length;
                return allocated < available;
            });

            for (let i = 0; i < remaining && categoriesWithSpace.length > 0; i++) {
                const cat = categoriesWithSpace[i % categoriesWithSpace.length];
                const available = safeArray(byCategory[cat]).length;
                if (categoryCounts[cat] < available) {
                    categoryCounts[cat]++;
                }
            }
        } else if (totalAllocated > count) {
            const excess = totalAllocated - count;
            const categoriesToReduce = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > 0);
            for (let i = 0; i < excess && categoriesToReduce.length > 0; i++) {
                const cat = categoriesToReduce[i % categoriesToReduce.length];
                if (categoryCounts[cat] > 0) {
                    categoryCounts[cat]--;
                }
            }
        }

        Object.keys(categoryCounts).forEach(cat => {
            const numToPick = categoryCounts[cat];
            const categoryQuestions = shuffleArray([...safeArray(byCategory[cat])]);
            picked.push(...categoryQuestions.slice(0, numToPick));
        });

        return shuffleArray(picked).map(shuffleQuestionOptions);
    }

    // Export to window
    window.QuizApp = window.QuizApp || {};
    window.QuizApp.QuestionService = {
        sampleQuestions,
        shuffleQuestionOptions,
        groupQuestionsByCategory
    };

})(window);

