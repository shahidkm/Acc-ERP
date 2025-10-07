import React from 'react';
import { useGetLedgers } from '../../../hooks/inventoryHooks/useGetLedgers';
function VoucherHeader({ voucher, accountEntry, totalAmount, handleVoucherNumberChange, handleAccountEntryChange }) {
    const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();
    // if(getGroupIsLoading){
    //   console.log("Submitted");
      
    // }

  return (
    <div className='w-[62vw] bg-blue-100 p-6 rounded-lg shadow-md flex flex-wrap items-center gap-4'>
      <h1 className='text-2xl font-bold text-blue-800 w-full text-center mb-4'>PAYMENT VOUCHER</h1>

      <div className='flex items-center gap-x-3 flex-1 min-w-60'>
        <label className='font-semibold text-blue-800'>Voucher No</label>
        <input
          type="text"
          value={voucher.voucherNumber}
          onChange={handleVoucherNumberChange}
          className='p-3 w-60 border border-blue-200 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
          placeholder="Enter voucher number"
        />
      </div>

      <div className='flex items-center gap-x-3 flex-1 min-w-60'>
  <label className='font-semibold text-blue-800'>Account</label>
  <select
    name="ledgerId"
    value={accountEntry.ledgerId || ''}
    onChange={handleAccountEntryChange}
    className='p-3 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  >
    <option value="" className='text-blue-600'>Select main account</option>
    {data.map((item) => (
      <option key={item.ledgerId} value={item.ledgerId} className='text-yellow-600' > 
        {item.alias}
      </option>
    ))}
  </select>
</div>


      <div className='bg-blue-50 p-3 rounded-md border border-blue-100 w-60 text-center'>
        <span className='font-bold text-blue-800 text-xl'>{totalAmount.toFixed(2)}</span>
      </div>

      <div className='flex items-center gap-x-3 min-w-60'>
        <label className='font-semibold text-blue-800'>Current Balance</label>
        <div className='bg-blue-50 p-3 rounded-md border border-blue-100 min-w-32 text-right'>
          <span className='font-medium text-blue-800'>{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default VoucherHeader;
