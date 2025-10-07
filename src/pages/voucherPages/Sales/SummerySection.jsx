// components/SummarySection.jsx
import React from 'react';

function SummarySection({ totalItemsAmount, totalGstAmount, freightCharges, grandTotal }) {
    return (
        <div className='p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h3 className='font-bold text-blue-800 mb-2'>Summary</h3>
            <div className='grid grid-cols-2 gap-4'>
                <div>Items Total:</div>
                <div className='text-right'>{totalItemsAmount.toFixed(2)}</div>
                
                <div>GST Total:</div>
                <div className='text-right'>{totalGstAmount.toFixed(2)}</div>
                
                <div>Freight Charges:</div>
                <div className='text-right'>{freightCharges.toFixed(2)}</div>
                
                <div className='font-bold'>Grand Total:</div>
                <div className='text-right font-bold'>{grandTotal.toFixed(2)}</div>
            </div>
        </div>
    );
}

export default SummarySection;