
import React from 'react';
import { useDispatch } from 'react-redux';
import { setVoucherNumber, resetErrors, updateEntry } from "../../../../../redux/slices/voucher";
// import { useGetInventoryLedgers } from '../../../../../hooks/inventoryLedgerHooks/useGetInventoryLedgers';
function VoucherHeader({ voucher, grandTotal }) {
    const dispatch = useDispatch();
    const accountEntry = voucher.entries.find(entry => entry.entryType === 0) || { ledgerId: 0, entryType: 0, amount: 0 };
    const accountEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 0);
//  const { data = [], isLoading: getGroupIsLoading } = useGetInventoryLedgers();
 
    const handleVoucherNumberChange = (e) => {
        dispatch(setVoucherNumber(e.target.value));
        dispatch(resetErrors({ field: 'voucherNumber', message: '' }));
    };

    const handleAccountEntryChange = (e) => {
        const { name, value } = e.target;
        const accountEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 0);

        if (accountEntryIndex !== -1) {
            const updatedEntry = { 
                ...voucher.entries[accountEntryIndex], 
                [name]: name === 'ledgerId' ? parseInt(value) || 0 : value 
            };
            dispatch(updateEntry({ index: accountEntryIndex, entry: updatedEntry }));
        }
    };

    if (accountEntryIndex !== -1 && accountEntry.amount !== grandTotal) {
        dispatch(updateEntry({ 
            index: accountEntryIndex, 
            entry: { ...accountEntry, amount: grandTotal } 
        }));
    }

    return (
        <div className='w-full bg-blue-50 flex justify-between items-center p-6 rounded-t-lg border-b border-blue-100'>
            <div className='flex items-center gap-x-3 flex-1'>
                <label className='font-semibold text-blue-800'>Voucher No</label>
                <input
                    type="text"
                    value={voucher.voucherNumber}
                    onChange={handleVoucherNumberChange}
                    className='p-3 w-60 border border-blue-200 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                    placeholder="Enter voucher number"
                />
            </div>

            <div className='flex items-center gap-x-3 flex-1'>
                <label className='font-semibold text-blue-800'>Account</label>
                <input
                    type="text"
                    name="ledgerId"
                    value={accountEntry.ledgerId || ''}
                    onChange={handleAccountEntryChange}
                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                    placeholder="Select main account"
                />
            </div>

            <div className='bg-blue-50 p-2 rounded-md border border-blue-100 w-60 text-center'>
                <span className='font-bold text-blue-800 text-xl'>{grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}

export default VoucherHeader;