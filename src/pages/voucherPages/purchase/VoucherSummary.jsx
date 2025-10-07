// SummarySection.jsx
import React from 'react';

function SummarySection({ voucher }) {
    // Calculate base amount (without GST)
    const totalItemsAmount = voucher.items.reduce((sum, item) => {
        return sum + (item.quantity * item.rate);
    }, 0);

    // Break down GST calculations for better clarity
    const cgstAmount = voucher.items.reduce((sum, item) => {
        const itemTotal = (item.quantity * item.rate);
        return sum + (itemTotal * (item.gst.cgstPercent / 100));
    }, 0);

    const sgstAmount = voucher.items.reduce((sum, item) => {
        const itemTotal = (item.quantity * item.rate);
        return sum + (itemTotal * (item.gst.sgstPercent / 100));
    }, 0);

    const igstAmount = voucher.items.reduce((sum, item) => {
        const itemTotal = (item.quantity * item.rate);
        return sum + (itemTotal * (item.gst.igstPercent / 100));
    }, 0);

    const totalGstAmount = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = totalItemsAmount + totalGstAmount;

    return (
        <div className='p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h3 className='font-bold text-blue-800 mb-2'>Summary</h3>
            <div className='grid grid-cols-2 gap-4'>
                <div>Items Base Total:</div>
                <div className='text-right'>{totalItemsAmount.toFixed(2)}</div>

                {cgstAmount > 0 && (
                    <>
                        <div>CGST Amount:</div>
                        <div className='text-right'>{cgstAmount.toFixed(2)}</div>
                    </>
                )}

                {sgstAmount > 0 && (
                    <>
                        <div>SGST Amount:</div>
                        <div className='text-right'>{sgstAmount.toFixed(2)}</div>
                    </>
                )}

                {igstAmount > 0 && (
                    <>
                        <div>IGST Amount:</div>
                        <div className='text-right'>{igstAmount.toFixed(2)}</div>
                    </>
                )}

                <div>Total GST:</div>
                <div className='text-right'>{totalGstAmount.toFixed(2)}</div>

                <div className='font-bold border-t border-blue-200 pt-2'>Grand Total:</div>
                <div className='text-right font-bold border-t border-blue-200 pt-2'>{grandTotal.toFixed(2)}</div>
            </div>
        </div>
    );
}

export default SummarySection;