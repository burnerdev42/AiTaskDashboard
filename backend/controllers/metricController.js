const Challenge = require('../models/Challenge');
const Idea = require('../models/Idea');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard metrics
// @route   GET /api/metrics
// @access  Private
const getMetrics = async (req, res) => {
    try {
        // Run aggregation in parallel for performance
        const [
            challengeCount,
            ideaCount,
            taskCount,
            userCount
        ] = await Promise.all([
            Challenge.countDocuments(),
            Idea.countDocuments(),
            Task.countDocuments(),
            User.countDocuments()
        ]);

        // --- JS Calculation Fallback ---
        // Fetch all challenges and sum up stats in memory since mongo aggregation was tricky with string parsing
        const challenges = await Challenge.find().select('stats');

        let totalROI = 0;
        let totalSavings = 0;
        let validROICount = 0;

        challenges.forEach(c => {
            if (c.stats && c.stats.roi) {
                const roiVal = parseFloat(c.stats.roi.toString().replace('x', ''));
                if (!isNaN(roiVal)) {
                    totalROI += roiVal;
                    validROICount++;
                }
            }
            if (c.stats && c.stats.savings) {
                const savingsVal = parseFloat(c.stats.savings.toString().replace('$', '').replace('M', ''));
                if (!isNaN(savingsVal)) {
                    totalSavings += savingsVal;
                }
            }
        });

        // ROI is an average multiplier (e.g., 3.2x)
        // Savings is a total sum in Millions
        const avgROI = validROICount > 0 ? (totalROI / validROICount).toFixed(1) : '0.0';
        const totalSavingsFormatted = totalSavings.toFixed(1);

        const metrics = {
            totalChallenges: challengeCount,
            totalIdeas: ideaCount,
            totalTasks: taskCount,
            roi: `${avgROI}x`,
            savings: `$${totalSavingsFormatted}M`,
            activeUsers: userCount,
            engagement: 'High'
        };

        res.status(200).json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMetrics
};
