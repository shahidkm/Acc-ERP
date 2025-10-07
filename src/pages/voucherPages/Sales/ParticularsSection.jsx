import React from 'react';
import { useDispatch } from 'react-redux';
import { updateEntry, addEntry, removeEntry } from "../../../../../redux/slices/voucher";
import { useGetInventoryLedgers } from '../../../../../hooks/inventoryLedgerHooks/useGetInventoryLedgers';

function ParticularsSection({ voucher }) {
    const dispatch = useDispatch();

    // Use 1 for Credit directly
    const particularEntries = voucher.entries.filter(entry => entry.entryType === 1);

    const { data = [], } = useGetInventoryLedgers();

    const handleLedgerChange = (index, e) => {
        const { value } = e.target;
        const creditEntries = voucher.entries.filter(entry => entry.entryType === 1);

        const originalIndex = voucher.entries.findIndex((entry) =>
            entry.entryType === 1 && creditEntries.indexOf(entry) === index
        );

        if (originalIndex !== -1) {
            const updatedEntry = {
                ...voucher.entries[originalIndex],
                ledgerId: parseInt(value) || 0
            };
            dispatch(updateEntry({ index: originalIndex, entry: updatedEntry }));
        }
    };

    const handleAddParticularRow = () => {
        dispatch(addEntry({ ledgerId: 0, entryType: 1, amount: 0 }));
    };

    const handleRemoveParticularRow = (index) => {
        const creditEntries = voucher.entries.filter(entry => entry.entryType === 1);

        if (creditEntries.length > 1) {
            const originalIndex = voucher.entries.findIndex((entry) =>
                entry.entryType === 1 && creditEntries.indexOf(entry) === index
            );

            if (originalIndex !== -1) {
                dispatch(removeEntry(originalIndex));
            }
        }
    };

    return (
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Particulars Entries (By)</h1>
            <div className='p-4 space-y-4'>
                {particularEntries.map((entry, index) => (
                    <div key={index} className='grid grid-cols-6 gap-4 items-center bg-blue-50 p-3 rounded-md'>
                        <div className="col-span-5">
                            <label className='text-xs text-blue-600 font-medium mb-1 block'>Select Ledger</label>
                            <select
                                name="ledgerId"
                                value={entry.ledgerId || 0}
                                onChange={(e) => handleLedgerChange(index, e)}
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
                        <div className="col-span-1 flex justify-end items-end">
                            <button
                                type="button"
                                className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                                onClick={() => handleRemoveParticularRow(index)}
                                disabled={particularEntries.length === 1}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
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
    );
}

export default ParticularsSection;
