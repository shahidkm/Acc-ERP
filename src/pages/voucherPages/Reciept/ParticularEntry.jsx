import React from 'react';

import { useGetLedgers } from '../../../hooks/inventoryHooks/useGetLedgers';
function ParticularEntry({ entry, index, handleParticularChange, handleRemoveParticularRow, disableRemove }) {
     const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();
     if(getGroupIsLoading){
        console.log("Submitted");
        
      }
    return (
        <div className='grid grid-cols-7 gap-4 items-center bg-blue-50 p-3 rounded-md'>
            <div className="relative col-span-4">
                <label className='text-xs text-blue-600 font-medium mb-1 block'>Select Ledger</label>
                <select
                    name="ledgerId"
                    value={entry.ledgerId || 0}
                    onChange={(e) => handleParticularChange(index, e)}
                    className='p-2 w-60 border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300'
                  >
                    <option value="" className='text-blue-600'>Select a ledger</option>
    {data.map((item) => (
      <option key={item.ledgerId} value={item.ledgerId} className='text-yellow-600' > 
        {item.alias}
      </option>
                    ))}
                  </select>
            </div>
            <div className="col-span-2">
                <label className='text-xs text-blue-600 font-medium mb-1 block'>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={entry.amount || ''}
                    onChange={(e) => handleParticularChange(index, e)}
                    className='p-2 border border-blue-200 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                    placeholder="Amount"
                />
            </div>
            <div className="col-span-1 flex justify-end items-end">
                <button
                    type="button"
                    className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                    onClick={() => handleRemoveParticularRow(index)}
                    disabled={disableRemove}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

export default ParticularEntry;
