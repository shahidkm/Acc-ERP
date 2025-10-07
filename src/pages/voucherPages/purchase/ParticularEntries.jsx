
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateEntry } from "../../../../../redux/slices/voucher";
import { useGetInventoryLedgers } from '../../../../../hooks/inventoryLedgerHooks/useGetInventoryLedgers';
function ParticularsSection({ voucher }) {
    const dispatch = useDispatch();
 const { data = [], isLoading: getGroupIsLoading } = useGetInventoryLedgers();
 if(getGroupIsLoading){
    console.log("Submitted");
    
  }
    const handleParticularChange = (index, e) => {
        const { name, value } = e.target;
        

        const debitEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 0);
        if (debitEntryIndex !== -1) {
            const updatedEntry = {
                ...voucher.entries[debitEntryIndex],
                [name]: name === 'ledgerId' ? parseInt(value) || 0 : 
                       name === 'amount' ? parseFloat(value) || 0 : value
            };
            dispatch(updateEntry({ index: debitEntryIndex, entry: updatedEntry }));
        }
    };

    const particularEntries = voucher.entries.filter(entry => entry.entryType === 0);

    return (
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Particulars Entries (By)</h1>
            <div className='p-4 space-y-4'>
                {particularEntries.map((entry, index) => (
                    <div key={index} className='grid grid-cols-7 gap-4 items-center bg-blue-50 p-3 rounded-md'>
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
                                    <option key={item.ledgerId} value={item.ledgerId} className='text-yellow-600'>
                                        {item.alias}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ParticularsSection;