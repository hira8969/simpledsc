/**
 * Certifying Authority (CA / RA) Integration Abstraction
 * Defines the contract for integration with CCA-licensed CAs (eMudhra, Capricorn, Vsign, Pantasign).
 *
 * IMPORTANT:
 * Per Indian CCA regulations, actual legal Digital Signature Certificates must only be issued
 * by an authorized Certifying Authority. This mock implementation provides sandbox lifecycle orchestration
 * and clearly flags all outputs as development/demonstration only.
 */

export class CAService {
  async createApplication(applicationData) {
    throw new Error('createApplication method not implemented');
  }

  async submitApplication(caApplicationId, documents) {
    throw new Error('submitApplication method not implemented');
  }

  async getApplicationStatus(caApplicationId) {
    throw new Error('getApplicationStatus method not implemented');
  }

  async verifyApplicant(caApplicationId, verificationData) {
    throw new Error('verifyApplicant method not implemented');
  }

  async getCertificateStatus(certificateId) {
    throw new Error('getCertificateStatus method not implemented');
  }
}

export class MockCAService extends CAService {
  constructor() {
    super();
    this.isSandbox = true;
    this.providerName = 'SIMPLDSC Sandbox CA Integration (Development Mode)';
  }

  async createApplication(applicationData) {
    const caAppNumber = `CA-SANDBOX-${Date.now().toString().slice(-6)}`;
    return {
      success: true,
      provider: this.providerName,
      isMock: true,
      caApplicationNumber: caAppNumber,
      status: 'CA_RECEIVED',
      disclaimer: 'DEMO/SANDBOX ONLY - Not an official CCA certificate issuance',
      timestamp: new Date().toISOString()
    };
  }

  async submitApplication(caApplicationId, documents) {
    return {
      success: true,
      caApplicationId,
      status: 'CA_UNDER_VERIFICATION',
      documentsCount: documents?.length || 0,
      timestamp: new Date().toISOString()
    };
  }

  async getApplicationStatus(caApplicationId) {
    return {
      success: true,
      caApplicationId,
      status: 'READY_FOR_DOWNLOAD',
      details: 'CA verification approved in Sandbox environment'
    };
  }

  async verifyApplicant(caApplicationId, verificationData) {
    return {
      success: true,
      caApplicationId,
      verified: true,
      videoKycRequired: false,
      message: 'Sandbox video KYC / applicant verification successfully validated'
    };
  }

  async getCertificateStatus(certificateId) {
    return {
      success: true,
      certificateId,
      status: 'ISSUED_SANDBOX',
      expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      disclaimer: 'DEMO/SANDBOX CERTIFICATE - Valid for platform testing only'
    };
  }
}

export const getCAService = () => {
  // In production, when CA_PROVIDER is 'EMUDHRA' or 'CAPRICORN', instantiate ProductionCAService
  return new MockCAService();
};
