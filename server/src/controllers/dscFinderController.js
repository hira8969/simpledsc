import { DscFinderService } from '../services/dscFinderService.js';

export const recommend = async (req, res, next) => {
  try {
    const { purpose, activity, needEncryption, validityYears } = req.body;
    const result = await DscFinderService.recommend({
      purpose,
      activity,
      needEncryption,
      validityYears
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
