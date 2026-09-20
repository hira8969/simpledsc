/**
 * ID Generator utilities conforming to required formats
 * Example: DSC-20260918-10245
 */
export const generateId = (prefix = 'DSC') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Random 5-digit number
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  
  return `${prefix}-${dateStr}-${randomSuffix}`;
};

export const generateOrderId = () => generateId('DSC');
export const generateTransactionId = () => generateId('TXN');
export const generateApplicationId = () => generateId('APP');
export const generateInvoiceId = () => generateId('INV');

export const generateTicketId = () => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `TIC-${randomSuffix}`;
};
