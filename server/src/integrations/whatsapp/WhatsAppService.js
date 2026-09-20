/**
 * WhatsApp Business Automation Integration Abstraction
 * Uses official WhatsApp Cloud API schema / provider pattern.
 */

export class WhatsAppService {
  async sendTemplateMessage({ recipientPhone, templateName, variables }) {
    throw new Error('sendTemplateMessage not implemented');
  }
}

export class MockWhatsAppService extends WhatsAppService {
  constructor() {
    super();
    this.provider = 'OFFICIAL_WHATSAPP_BUSINESS_API_SANDBOX';
  }

  formatMessage(templateName, variables) {
    const { name = 'Customer', orderId = '', product = 'Digital Signature Certificate', amount = '', status = '', reason = '' } = variables || {};

    switch (templateName) {
      case 'ORDER_CREATED':
        return `Hello ${name},\n\nYour DSC order has been initiated on SimplDSC.\nOrder ID: ${orderId}\nProduct: ${product}\nStatus: Payment Pending\n\nComplete your payment to start document verification.\n\nThank you,\nSimplDSC - Digital Signatures, Made Simple.`;

      case 'PAYMENT_SUCCESS':
        return `✅ Payment Successful!\n\nHello ${name},\n\nWe have received your payment of ₹${amount} for Order ID: ${orderId} (${product}).\n\nNext Step: Our verification desk is reviewing your KYC documents.\n\nTrack your order: https://simpldsc.in/orders/${orderId}\n\nThank you,\nSimplDSC`;

      case 'KYC_PENDING':
        return `⚠️ KYC Documents Required\n\nHello ${name},\n\nYour DSC application for Order ID: ${orderId} is pending document submission. Please upload your identity documents to proceed.\n\nUpload now: https://simpldsc.in/dashboard/documents\n\nSimplDSC`;

      case 'KYC_APPROVED':
        return `✅ KYC Verified Successfully!\n\nHello ${name},\n\nYour submitted documents for DSC Order: ${orderId} have been approved by our verification desk. We have submitted your application to the Certifying Authority queue.\n\nSimplDSC`;

      case 'KYC_REJECTED':
        return `❌ KYC Document Verification Update\n\nHello ${name},\n\nYour DSC application for Order ID: ${orderId} requires attention.\nReason: ${reason || 'Document mismatch or blurred copy'}.\n\nPlease re-upload the requested documents on your dashboard to resume processing.\n\nSimplDSC Support: +91 80 4719 2800`;

      case 'APPLICATION_PROCESSING':
        return `⏳ Application In Process\n\nHello ${name},\n\nYour DSC application (Order ID: ${orderId}) is currently being processed by the Certifying Authority.\n\nSimplDSC`;

      case 'DSC_ISSUED':
        return `🎉 DSC Issued Successfully!\n\nHello ${name},\n\nCongratulations! Your Digital Signature Certificate (${product}) for Order ID: ${orderId} has been successfully issued.\n\nYour encrypted token / download instructions are available in your customer portal.\n\nSimplDSC`;

      case 'ORDER_COMPLETED':
        return `📦 Order Completed\n\nHello ${name},\n\nYour SimplDSC Order ${orderId} is now marked as Completed. Your invoice and certificate receipts are ready to download.\n\nThank you for choosing SimplDSC!`;

      case 'RENEWAL_REMINDER':
        return `🔔 DSC Renewal Reminder\n\nHello ${name},\n\nYour Digital Signature Certificate (${product}) associated with Order ID: ${orderId} is due for renewal soon. Renew today to avoid interruption in your MCA, GST, or e-Tender filings.\n\nRenew in 1-click: https://simpldsc.in/renewals\n\nSimplDSC`;

      default:
        return `Hello ${name},\nUpdate on your DSC Order ${orderId}: ${status}.\n\nSimplDSC`;
    }
  }

  async sendTemplateMessage({ recipientPhone, templateName, variables }) {
    const messageBody = this.formatMessage(templateName, variables);

    // In development / demo mode, print WhatsApp API payload log
    console.log(`\n================== [WHATSAPP API NOTIFICATION] ==================`);
    console.log(`[To]: ${recipientPhone}`);
    console.log(`[Template]: ${templateName}`);
    console.log(`[Message Body]:\n${messageBody}`);
    console.log(`=================================================================\n`);

    return {
      success: true,
      provider: this.provider,
      recipientPhone,
      templateName,
      messageBody,
      sentAt: new Date().toISOString()
    };
  }
}

export const getWhatsAppService = () => {
  return new MockWhatsAppService();
};
