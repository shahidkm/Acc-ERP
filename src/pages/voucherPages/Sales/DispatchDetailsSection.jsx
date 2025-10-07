// components/DispatchDetailsSection.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import {
    setDeliveryNoteNumber,
    setDispatchDate,
    setDispatchedThrough,
    setDestination,
    setLrNumber,
    setVehicleNumber,
    setFreightCharges
} from "../../../../../redux/slices/voucher";

function DispatchDetailsSection({ voucher }) {
    const dispatch = useDispatch();

    const handleDispatchChange = (e) => {
        const { name, value } = e.target;
        
        switch(name) {
            case 'deliveryNoteNumber':
                dispatch(setDeliveryNoteNumber(value));
                break;
            case 'dispatchDate':
                dispatch(setDispatchDate(value));
                break;
            case 'dispatchedThrough':
                dispatch(setDispatchedThrough(value));
                break;
            case 'destination':
                dispatch(setDestination(value));
                break;
            case 'lrNumber':
                dispatch(setLrNumber(value));
                break;
            case 'vehicleNumber':
                dispatch(setVehicleNumber(value));
                break;
            case 'freightCharges':
                dispatch(setFreightCharges(parseFloat(value) || 0));
                break;
            default:
                break;
        }
    };

    return (
        <div className='bg-white border border-blue-100 rounded-lg shadow-sm mb-4'>
            <h1 className='bg-blue-100 text-center py-3 font-bold rounded-t-lg text-blue-800 sticky top-0'>Dispatch Details</h1>
            <div className='p-4 space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Delivery Note Number</label>
                        <input
                            type="text"
                            name="deliveryNoteNumber"
                            value={voucher.dispatchDetails.deliveryNoteNumber || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="Delivery Note Number"
                        />
                    </div>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Dispatch Date</label>
                        <input
                            type="text"
                            name="dispatchDate"
                            value={voucher.dispatchDetails.dispatchDate || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="YYYY-MM-DD"
                        />
                    </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Dispatched Through</label>
                        <input
                            type="text"
                            name="dispatchedThrough"
                            value={voucher.dispatchDetails.dispatchedThrough || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="Carrier/Courier"
                        />
                    </div>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={voucher.dispatchDetails.destination || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="Delivery Destination"
                        />
                    </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>LR Number</label>
                        <input
                            type="text"
                            name="lrNumber"
                            value={voucher.dispatchDetails.lrNumber || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="LR Number"
                        />
                    </div>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Vehicle Number</label>
                        <input
                            type="text"
                            name="vehicleNumber"
                            value={voucher.dispatchDetails.vehicleNumber || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="Vehicle Number"
                        />
                    </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-xs text-blue-600 font-medium mb-1 block'>Freight Charges</label>
                        <input
                            type="number"
                            name="freightCharges"
                            value={voucher.dispatchDetails.freightCharges || ''}
                            onChange={handleDispatchChange}
                            className='p-2 w-full border border-blue-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            placeholder="Freight Charges"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DispatchDetailsSection;