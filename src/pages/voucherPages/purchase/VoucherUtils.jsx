// voucherUtils.js
/**
 * Calculate the total amount from all items including GST
 * @param {Array} items - The list of items in the voucher
 * @returns {number} The total amount
 */
export const calculateTotalAmount = (items) => {
    return items.reduce((sum, item) => {
        const itemBaseTotal = (item.quantity * item.rate);
        const gstPercent = item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent;
        const gstAmount = itemBaseTotal * (gstPercent / 100);
        return sum + itemBaseTotal + gstAmount;
    }, 0);
};

/**
 * Calculate the base amount (without GST)
 * @param {Array} items - The list of items in the voucher
 * @returns {number} The base amount
 */
export const calculateBaseAmount = (items) => {
    return items.reduce((sum, item) => {
        return sum + (item.quantity * item.rate);
    }, 0);
};

/**
 * Calculate GST amount only
 * @param {Array} items - The list of items in the voucher
 * @returns {Object} Object containing CGST, SGST, IGST and total GST amounts
 */
export const calculateGstAmounts = (items) => {
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    
    items.forEach(item => {
        const baseAmount = item.quantity * item.rate;
        cgstAmount += baseAmount * (item.gst.cgstPercent / 100);
        sgstAmount += baseAmount * (item.gst.sgstPercent / 100);
        igstAmount += baseAmount * (item.gst.igstPercent / 100);
    });
    
    return {
        cgst: cgstAmount,
        sgst: sgstAmount,
        igst: igstAmount,
        total: cgstAmount + sgstAmount + igstAmount
    };
};

/**
 * Check if debit and credit entries are balanced
 * @param {Array} entries - The list of entries in the voucher
 * @returns {boolean} True if balanced, false otherwise
 */
export const areEntriesBalanced = (entries) => {
    const debitTotal = entries
        .filter(entry => entry.entryType === "Debit")
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    const creditTotal = entries
        .filter(entry => entry.entryType === "Credit")
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    return Math.abs(debitTotal - creditTotal) < 0.01; // Allow small rounding errors
};

/**
 * Update both debit and credit entries with the calculated total amount
 * @param {Array} entries - The voucher entries array
 * @param {number} totalAmount - The calculated total amount including GST
 * @returns {Array} Updated entries with balanced amounts
 */
export const updateBalancedEntries = (entries, totalAmount) => {
    return entries.map(entry => {
        // Update both debit and credit entries with the same amount
        return {
            ...entry,
            amount: totalAmount
        };
    });
};

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
};