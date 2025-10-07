// ItemsSection.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import {
    addItem,
    updateItem,
    removeItem,
    updateItemGst,
    updateEntry
} from "../../../../../redux/slices/voucher";


import { useGetItems } from '../../../../../hooks/inventoryLedgerHooks/useGetItems';

function ItemsSection({ voucher }) {
    const dispatch = useDispatch();
    const { data = [], isLoading: getGroupIsLoading } = useGetItems();
    if(getGroupIsLoading){
        console.log("Submitted");
        
      }
    const updateEntryAmounts = () => {
 
        const totalItemAmount = voucher.items.reduce((sum, item) => {
       
            const itemBaseTotal = (item.quantity * item.rate);
            
          
            const gstPercent = item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent;
            const gstAmount = itemBaseTotal * (gstPercent / 100);
            
          
            return sum + itemBaseTotal + gstAmount;
        }, 0);

     
        const debitEntryIndex = voucher.entries.findIndex(entry => entry.entryType === "Debit");
        if (debitEntryIndex !== -1) {
            const updatedDebitEntry = { ...voucher.entries[debitEntryIndex], amount: totalItemAmount };
            dispatch(updateEntry({ index: debitEntryIndex, entry: updatedDebitEntry }));
        }

        const creditEntryIndex = voucher.entries.findIndex(entry => entry.entryType === "Credit");
        if (creditEntryIndex !== -1) {
            const updatedCreditEntry = { ...voucher.entries[creditEntryIndex], amount: totalItemAmount };
            dispatch(updateEntry({ index: creditEntryIndex, entry: updatedCreditEntry }));
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;

        if (index < voucher.items.length) {
            const updatedItem = {
                ...voucher.items[index],
                [name]: name === 'itemId' ? parseInt(value) || 0 :
                    name === 'quantity' || name === 'rate' ? parseFloat(value) || 0 : value
            };

            dispatch(updateItem({ index, item: updatedItem }));
            
           
            setTimeout(updateEntryAmounts, 0); 
        }
    };

    const handleItemGstChange = (index, e) => {
        const { name, value } = e.target;

        if (index < voucher.items.length) {
            const updatedGst = {
                ...voucher.items[index].gst,
                [name]: parseFloat(value) || 0
            };

            dispatch(updateItemGst({ index, gst: updatedGst }));
            
            
            setTimeout(updateEntryAmounts, 0); 
        }
    };

    const handleAddItemRow = () => {
        dispatch(addItem({
            itemId: 0,
            quantity: 0,
            rate: 0,
            gst: {
                cgstPercent: 0,
                sgstPercent: 0,
                igstPercent: 0
            }
        }));
    };

    const handleRemoveItemRow = (index) => {
        if (voucher.items.length > 1) {
            dispatch(removeItem(index));
          
            setTimeout(updateEntryAmounts, 0);
        }
    };

    return (
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Item Details</h1>
            <div className='p-4 space-y-4'>
                {voucher.items.map((item, index) => (
                    <div key={index} className='bg-blue-50 p-3 rounded-md'>
                        <div className='grid grid-cols-3 gap-4 items-center mb-3'>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>Item</label>
                                <select
                                    name="itemId"
                                    value={item.itemId || 0}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className='p-2 w-60 border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300'
                                >
                                    <option value="" className='text-blue-600'>Select an Item</option>
                                    {data.map((item) => (
                                        <option key={item.itemId} value={item.itemId} className='text-yellow-600'>
                                            {item.itemName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity || ''}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                                    placeholder="Quantity"
                                />
                            </div>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>Rate</label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={item.rate || ''}
                                    onChange={(e) => handleItemChange(index, e)}
                                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                                    placeholder="Rate"
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-4 gap-4 items-center'>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>CGST %</label>
                                <input
                                    type="number"
                                    name="cgstPercent"
                                    value={item.gst.cgstPercent || ''}
                                    onChange={(e) => handleItemGstChange(index, e)}
                                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                                    placeholder="CGST %"
                                />
                            </div>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>SGST %</label>
                                <input
                                    type="number"
                                    name="sgstPercent"
                                    value={item.gst.sgstPercent || ''}
                                    onChange={(e) => handleItemGstChange(index, e)}
                                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                                    placeholder="SGST %"
                                />
                            </div>
                            <div>
                                <label className='text-xs text-blue-600 font-medium mb-1 block'>IGST %</label>
                                <input
                                    type="number"
                                    name="igstPercent"
                                    value={item.gst.igstPercent || ''}
                                    onChange={(e) => handleItemGstChange(index, e)}
                                    className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                                    placeholder="IGST %"
                                />
                            </div>
                            <div className='flex items-end'>
                                <button
                                    type="button"
                                    className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                                    onClick={() => handleRemoveItemRow(index)}
                                    disabled={voucher.items.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className='flex justify-end mt-3'>
                            <div className='bg-blue-100 p-2 rounded-md w-48 text-right'>
                                <span className='font-medium text-blue-800'>
                                  
                                    Base: {(item.quantity * item.rate).toFixed(2)}
                                    <br />
                                    GST: {((item.quantity * item.rate) * 
                                        (item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent) / 100).toFixed(2)}
                                    <br />
                                    Total: {((item.quantity * item.rate) + 
                                        (item.quantity * item.rate * 
                                        (item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent) / 100)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className='flex justify-center'>
                    <button
                        type="button"
                        className='w-60 mt-4 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600'
                        onClick={handleAddItemRow}
                    >
                        + Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemsSection;
