import path from 'path';
import fs from 'fs';
import { Document } from '../models/Document.js';
import { Application } from '../models/Application.js';
import { USER_ROLES } from '../config/constants.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file uploaded.' });
    }

    const { applicationId, documentType } = req.body;
    if (!applicationId || !documentType) {
      // Remove uploaded file if validation fails
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Application ID and document type are required.' });
    }

    const application = await Application.findOne({ _id: applicationId, userId: req.user._id });
    if (!application) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Unauthorized application access.' });
    }

    // Upsert or create document
    let document = await Document.findOne({ applicationId, documentType });

    if (document) {
      // Delete old file if exists
      if (fs.existsSync(document.filePath)) {
        try { fs.unlinkSync(document.filePath); } catch (e) {}
      }
      document.originalName = req.file.originalname;
      document.fileName = req.file.filename;
      document.filePath = req.file.path;
      document.mimeType = req.file.mimetype;
      document.fileSize = req.file.size;
      document.status = 'PENDING';
      document.rejectionReason = '';
      await document.save();
    } else {
      document = await Document.create({
        applicationId,
        userId: req.user._id,
        documentType,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        status: 'PENDING'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded securely',
      data: document
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check ownership or admin privilege
    if (application.userId.toString() !== req.user._id.toString() &&
        req.user.role !== USER_ROLES.ADMIN &&
        req.user.role !== USER_ROLES.STAFF) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to documents.' });
    }

    const documents = await Document.find({ applicationId });
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    next(error);
  }
};

/**
 * Secure stream download - never expose upload directory statically
 */
export const downloadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    // Enforce authorization: must be document owner or admin/staff
    if (document.userId.toString() !== req.user._id.toString() &&
        req.user.role !== USER_ROLES.ADMIN &&
        req.user.role !== USER_ROLES.STAFF) {
      return res.status(403).json({ success: false, message: 'Unauthorized document access.' });
    }

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ success: false, message: 'File is missing from secure storage.' });
    }

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
