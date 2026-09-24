import { recommendDSC } from '../services/dscRecommendationService.js';

// @desc    Recommend DSC based on user responses
// @route   POST /api/dsc/recommend OR POST /api/dsc-finder/recommend
// @access  Public
export const recommend = async (req, res, next) => {
  try {
    const { purpose, usage, requirement, activity, needEncryption, validityYears } = req.body;
    const result = await recommendDSC({
      purpose,
      usage,
      requirement,
      activity,
      needEncryption,
      validityYears
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
