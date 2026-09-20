import { Application } from '../models/Application.js';
import { generateApplicationId } from '../utils/idGenerator.js';

export const createApplication = async (req, res, next) => {
  try {
    const {
      productId,
      applicantType,
      personalDetails,
      addressDetails,
      organizationDetails,
      certificateDetails
    } = req.body;

    if (!productId || !personalDetails || !addressDetails || !certificateDetails) {
      return res.status(400).json({
        success: false,
        message: 'Product, personal details, address details, and certificate details are required.'
      });
    }

    const applicationId = generateApplicationId();

    const application = await Application.create({
      applicationId,
      userId: req.user._id,
      productId,
      applicantType: applicantType || 'INDIVIDUAL',
      personalDetails,
      addressDetails,
      organizationDetails,
      certificateDetails
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('productId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
