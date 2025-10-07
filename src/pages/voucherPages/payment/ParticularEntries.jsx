import React from 'react';
import { useGetLedgers } from '../../../hooks/inventoryHooks/useGetLedgers';
function ParticularEntries({ voucher, particularEntries, handleParticularChange, handleNarrationChange, handleAddParticularRow, handleRemoveParticularRow }) {
  
      const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();
      // if(getGroupIsLoading){
      //   console.log("Submitted");
        
      // }

      return (
    <div className='p-6 h-[70vh]'>
      <div className='max-h-[60vh] overflow-y-auto'>
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
          <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Particulars Entries (By)</h1>
          <div className='p-4 space-y-4'>
            {particularEntries.map((entry, index) => (
              <div key={index} className='grid grid-cols-7 gap-4 items-center bg-blue-50 p-3 rounded-md'>
                <div className="col-span-4">
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
                    className='p-2 border border-blue-200 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-300'
                    placeholder="Amount"
                  />
                </div>
                <div className="col-span-1 flex justify-end items-end">
                  <button
                    type="button"
                    className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                    onClick={() => handleRemoveParticularRow(index)}
                    disabled={particularEntries.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className='p-4'>
              <textarea
                value={voucher.narration}
                onChange={handleNarrationChange}
                className='p-3 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-32'
                placeholder="Enter any notes or narration for this voucher..."
              />
            </div>
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
        </div>
      </div>
    </div>
  );
}

export default ParticularEntries;
