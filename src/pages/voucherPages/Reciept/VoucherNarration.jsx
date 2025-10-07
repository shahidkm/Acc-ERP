import React from 'react';

function VoucherNarration({ narration, handleNarrationChange, handleAddParticularRow }) {
    return (
        <div className='p-4'>
            <textarea
                value={narration}
                onChange={handleNarrationChange}
                className='p-3 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 min-h-32'
                placeholder="Enter any notes or narration for this voucher..."
            />
            <div className='flex justify-center'>
                <button
                    type="button"
                    className='w-60 mt-4 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600'
                    onClick={handleAddParticularRow}
                >
                    + Add Entry
                </button>
            </div>
        </div>
    );
}

export default VoucherNarration;
