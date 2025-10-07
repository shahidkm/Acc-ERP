// NarrationSection.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setNarration } from "../../../../../redux/slices/voucher";

function NarrationSection({ voucher }) {
    const dispatch = useDispatch();

    const handleNarrationChange = (e) => {
        dispatch(setNarration(e.target.value));
    };

    return (
        <div className='p-4 bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <label className='text-xs text-blue-600 font-medium mb-1 block'>Narration</label>
            <textarea
                value={voucher.narration}
                onChange={handleNarrationChange}
                className='p-3 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 min-h-24'
                placeholder="Enter any notes or narration for this voucher..."
            />
        </div>
    );
}

export default NarrationSection;