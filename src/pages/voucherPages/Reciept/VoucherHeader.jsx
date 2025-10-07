import React from 'react';
import { useGetLedgers } from '../../../hooks/useGetLedgers';
function VoucherHeader({ voucherNumber, accountLedgerId, totalAmount, handleVoucherNumberChange, handleAccountEntryChange }) {
    const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();

    return (
        <div className='w-full bg-blue-50 flex justify-between items-center p-6 rounded-t-lg border-b border-blue-100'>
            <div className='flex items-center gap-x-3 flex-1'>
                <label className='font-semibold text-blue-800'>Voucher No</label>
                <input
                    type="text"
                    value={voucherNumber}
                    onChange={handleVoucherNumberChange}
                    className='p-3 w-60 border border-blue-200 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                    placeholder="Enter voucher number"
                />
            </div>

            <div className='flex items-center gap-x-3 flex-1'>
                <label className='font-semibold text-blue-800'>Account</label>
                <select
                    name="ledgerId"
                    value={accountLedgerId || ''}
                    onChange={handleAccountEntryChange}
                    className='p-3 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
                >
                    <option value="" className='text-blue-600'>Select main account</option>
                    {getGroupIsLoading ? (
                        <option disabled>Loading accounts...</option>
                    ) : (
                        data.map((item) => (
                            <option key={item.ledgerId} value={item.ledgerId} className='text-yellow-600'>
                                {item.alias}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className='bg-blue-50 p-2 rounded-md border border-blue-100 w-60 text-center'>
                <span className='font-bold text-blue-800 text-xl'>{(totalAmount || 0).toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-x-3 ml-6'>
                <label className='font-semibold text-blue-800'>Current Balance</label>
                <div className='bg-blue-50 p-3 rounded-md border border-blue-100 min-w-32 text-right'>
                    <span className='font-medium text-blue-800'>{(totalAmount || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default VoucherHeader;
