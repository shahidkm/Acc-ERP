import React from 'react';
import { useDispatch } from 'react-redux';
import {
    setVoucherNumber,
    setInVoice,
    updateEntry,
    resetErrors
} from "../../../../../redux/slices/voucher";
import { useEffect } from 'react';

function VoucherHeader({ voucher }) {
    const dispatch = useDispatch();

    const handleVoucherNumberChange = (e) => {
        dispatch(setVoucherNumber(e.target.value));
        dispatch(resetErrors({ field: 'voucherNumber', message: '' }));
    };

    const handleInvoiceNumberChange = (e) => {
        dispatch(setInVoice(e.target.value));
        dispatch(resetErrors({ field: 'inVoice', message: '' }));
    };

    const handleAccountEntryChange = (e) => {
        const { name, value } = e.target;
   
        const creditEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 1); // 1 for Credit
        if (creditEntryIndex !== -1) {
            const updatedEntry = { 
                ...voucher.entries[creditEntryIndex], 
                [name]: name === 'ledgerId' ? parseInt(value) || 0 : value 
            };
            dispatch(updateEntry({ index: creditEntryIndex, entry: updatedEntry }));
        }
    };
    
    // Calculate grand total for display including GST
    const totalItemsAmount = voucher.items.reduce((sum, item) => {
        return sum + (item.quantity * item.rate);
    }, 0);

    const totalGstAmount = voucher.items.reduce((sum, item) => {
        const itemTotal = (item.quantity * item.rate);
        const gstPercent = item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent;
        return sum + (itemTotal * (gstPercent / 100));
    }, 0);

    const grandTotal = totalItemsAmount + totalGstAmount;
    const accountEntry = voucher.entries.find(entry => entry.entryType === 1) || { ledgerId: 0, entryType: 1, amount: 0 };

    // Update entry amount when total changes
    useEffect(() => {
        // Only update if the values are different to avoid infinite loops
        if (accountEntry.amount !== grandTotal) {
            const creditEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 1); // 1 for Credit
            if (creditEntryIndex !== -1) {
                dispatch(updateEntry({
                    index: creditEntryIndex,
                    entry: { ...accountEntry, amount: grandTotal }
                }));
            }
            
            const debitEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 0); // 0 for Debit
            if (debitEntryIndex !== -1) {
                const debitEntry = voucher.entries[debitEntryIndex];
                dispatch(updateEntry({
                    index: debitEntryIndex,
                    entry: { ...debitEntry, amount: grandTotal }
                }));
            }
        }
    }, [grandTotal, accountEntry.amount, dispatch]);

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
                <label className='font-semibold text-blue-800'>Invoice No</label>
                <input
                    type="text"
                    value={voucher.inVoice}
                    onChange={handleInvoiceNumberChange}
                    className='p-3 w-60 border border-blue-200 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                    placeholder="Enter invoice number"
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
                    placeholder="Select supplier account"
                />
            </div>

            <div className='bg-blue-50 p-2 rounded-md border border-blue-100 w-60 text-center'>
                <span className='font-bold text-blue-800 text-xl'>{grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}

export default VoucherHeader;
