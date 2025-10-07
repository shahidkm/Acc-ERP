import React from 'react';
import ParticularEntry from './ParticularEntry';

function VoucherParticularsList({ entries, handleParticularChange, handleRemoveParticularRow }) {
    return (
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Particulars Entries (By)</h1>
            <div className='p-4 space-y-4'>
                {entries.map((entry, index) => (
                    <ParticularEntry
                        key={index}
                        index={index}
                        entry={entry}
                        handleParticularChange={handleParticularChange}
                        handleRemoveParticularRow={handleRemoveParticularRow}
                        disableRemove={entries.length === 1}
                    />
                ))}
            </div>
        </div>
    );
}

export default VoucherParticularsList;
