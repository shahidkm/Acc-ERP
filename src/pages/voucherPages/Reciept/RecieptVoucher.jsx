import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setVoucherNumber,
    setType,
    setDate,
    setNarration,
    setEntries,
    addEntry,
    updateEntry,
    removeEntry,
    resetErrors,
    resetVoucher
} from "../../../redux/slices/voucher"
import { useCreateVoucher } from '../../../hooks/voucherHooks/useCreateVoucher';
import { useGetLedgers } from '../../../hooks/useGetLedgers';
import { Plus, Trash2, Save, Calendar, FileText, DollarSign, Building, Receipt, X } from 'lucide-react';
import Sidebar from '../../../components/sidebar/Sidebar';

function VoucherHeader({ voucherNumber, accountLedgerId, totalAmount, handleVoucherNumberChange, handleAccountEntryChange }) {
    const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();

    return (
        <div className='bg-blue-50 border-b border-blue-100'>
            <div className='p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-end'>
                {/* Voucher Number */}
                <div className='space-y-2'>
                    <label className='text-sm font-semibold text-blue-800 flex items-center gap-2'>
                        <Receipt className="w-4 h-4 text-blue-600" />
                        Voucher No
                    </label>
                    <input
                        type="text"
                        value={voucherNumber}
                        onChange={handleVoucherNumberChange}
                        className='w-full px-4 py-3 border border-blue-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200'
                        placeholder="Enter voucher number"
                    />
                </div>

                {/* Account Selection */}
                <div className='space-y-2 lg:col-span-2'>
                    <label className='text-sm font-semibold text-blue-800 flex items-center gap-2'>
                        <Building className="w-4 h-4 text-blue-600" />
                        Account
                    </label>
                    <select
                        name="ledgerId"
                        value={accountLedgerId || ''}
                        onChange={handleAccountEntryChange}
                        className='w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200'
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

                {/* Total Amount */}
                <div className='space-y-2'>
                    <label className='text-sm font-semibold text-blue-800 flex items-center gap-2'>
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        Total Amount
                    </label>
                    <div className='bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center'>
                        <span className='font-bold text-blue-800 text-lg'>₹{(totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ParticularEntry({ entry, index, handleParticularChange, handleRemoveParticularRow, disableRemove }) {
    const { data = [], isLoading: getGroupIsLoading } = useGetLedgers();
    
    if(getGroupIsLoading){
        console.log("Loading ledgers...");
    }

    return (
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-end'>
                {/* Ledger Selection */}
                <div className="md:col-span-7 space-y-2">
                    <label className='text-sm font-medium text-blue-600'>Select Ledger</label>
                    <select
                        name="ledgerId"
                        value={entry.ledgerId || 0}
                        onChange={(e) => handleParticularChange(index, e)}
                        className='w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200'
                    >
                        <option value="" className='text-blue-600'>Select a ledger</option>
                        {data.map((item) => (
                            <option key={item.ledgerId} value={item.ledgerId} className='text-yellow-600'>
                                {item.alias}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount Input */}
                <div className="md:col-span-4 space-y-2">
                    <label className='text-sm font-medium text-blue-600'>Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">₹</span>
                        <input
                            type="number"
                            name="amount"
                            value={entry.amount || ''}
                            onChange={(e) => handleParticularChange(index, e)}
                            className='w-full pl-8 pr-3 py-2.5 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200'
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                        />
                    </div>
                </div>

                {/* Remove Button */}
                <div className="md:col-span-1 flex justify-end">
                    <button
                        type="button"
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                            disableRemove 
                                ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                                : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        onClick={() => handleRemoveParticularRow(index)}
                        disabled={disableRemove}
                        title="Remove entry"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function VoucherParticularsList({ entries, handleParticularChange, handleRemoveParticularRow }) {
    return (
        <div className='space-y-4'>
            <div className='bg-blue-100 text-center py-3 font-bold rounded-lg text-blue-800 flex items-center justify-center gap-3'>
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className='text-lg font-semibold'>Particulars Entries (By)</h2>
            </div>
            
            <div className='space-y-4'>
                {entries.map((entry, index) => (
                    <ParticularEntry
                        key={index}
                        index={index}
                        entry={entry}
                        handleParticularChange={handleParticularChange}
                        handleRemoveParticularRow={handleRemoveParticularRow}
                        disableRemove={entries.length === 1}
                    />
                ))}
            </div>
        </div>
    );
}

function VoucherNarration({ narration, handleNarrationChange, handleAddParticularRow }) {
    return (
        <div className='space-y-4'>
            <div className='bg-blue-100 text-center py-3 font-bold rounded-lg text-blue-800 flex items-center justify-center gap-3'>
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className='text-lg font-semibold'>Narration</h2>
            </div>
            
            <textarea
                value={narration}
                onChange={handleNarrationChange}
                className='w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200 resize-none'
                placeholder="Enter any notes or narration for this voucher..."
                rows="4"
            />
            
            <div className='flex justify-center'>
                <button
                    type="button"
                    className='inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    onClick={handleAddParticularRow}
                >
                    <Plus className="w-4 h-4" />
                    Add Entry
                </button>
            </div>
        </div>
    );
}

function RecieptVoucher() {
    const dispatch = useDispatch();
    const voucher = useSelector((state) => state.voucher);
    const createVoucherMutation = useCreateVoucher();

    useEffect(() => {
        dispatch(resetVoucher());
        dispatch(setType(2));
        dispatch(setEntries([
            { ledgerId: 0, entryType: 1, amount: 0 },  // Debit = 1
            { ledgerId: 0, entryType: 0, amount: 0 }   // Credit = 0
        ]));
    }, [dispatch]);

    const syncAmounts = (newAmount) => {
        const updatedEntries = voucher.entries.map(entry => ({
            ...entry,
            amount: newAmount
        }));
        dispatch(setEntries(updatedEntries));
    };

    const handleVoucherNumberChange = (e) => {
        dispatch(setVoucherNumber(e.target.value));
        dispatch(resetErrors({ field: 'voucherNumber', message: '' }));
    };

    const handleDateChange = (e) => {
        dispatch(setDate(e.target.value));
    };

    const handleAccountEntryChange = (e) => {
        const { name, value } = e.target;
        const accountEntryIndex = voucher.entries.findIndex(entry => entry.entryType === 0); // Credit entry
        if (accountEntryIndex !== -1) {
            const updatedEntry = { ...voucher.entries[accountEntryIndex], [name]: name === 'ledgerId' ? parseInt(value) || 0 : value };
            dispatch(updateEntry({ index: accountEntryIndex, entry: updatedEntry }));
        }
    };

    const handleParticularChange = (index, e) => {
        const { name, value } = e.target;
        const newAmount = name === 'amount' ? parseFloat(value) || 0 : null;
        const particularIndex = voucher.entries.findIndex(entry => entry.entryType === 1); // Debit entry
        const entryIndex = particularIndex + index;

        if (entryIndex < voucher.entries.length) {
            const updatedEntry = {
                ...voucher.entries[entryIndex],
                [name]: name === 'ledgerId' ? parseInt(value) || 0 :
                    name === 'amount' ? newAmount : value
            };
            dispatch(updateEntry({ index: entryIndex, entry: updatedEntry }));

            if (name === 'amount' && newAmount !== null) {
                // Sync all entries' amount
                syncAmounts(newAmount);
            }
        }
    };

    const handleAddParticularRow = () => {
        dispatch(addEntry({ ledgerId: 0, entryType: 1, amount: 0 }));  // Debit = 1
    };

    const handleRemoveParticularRow = (index) => {
        const particularEntries = voucher.entries.filter(entry => entry.entryType === 1); // Debit entry
        const particularIndex = voucher.entries.findIndex(entry => entry.entryType === 1);
        const entryIndex = particularIndex + index;

        if (particularEntries.length > 1) {
            dispatch(removeEntry(entryIndex));
        }
    };

    const handleNarrationChange = (e) => {
        dispatch(setNarration(e.target.value));
    };

    const handleSubmit = () => {
        const voucherData = {
            voucherNumber: voucher.voucherNumber,
            type: 3,
            date: voucher.date,
            narration: voucher.narration,
            entries: voucher.entries
        };

        createVoucherMutation.mutate(voucherData, {
            onSuccess: () => {
                dispatch(resetVoucher());
                dispatch(setType(2));
                dispatch(setEntries([
                    { ledgerId: 0, entryType: 0, amount: 0 },  // Credit = 0
                    { ledgerId: 0, entryType: 1, amount: 0 }   // Debit = 1
                ]));
            },
            onError: (error) => {
                console.error("Error creating voucher:", error);
            }
        });
    };

    const particularEntries = voucher.entries.filter(entry => entry.entryType === 1); // Debit entries
    const accountEntry = voucher.entries.find(entry => entry.entryType === 0) || { ledgerId: 0, entryType: 0, amount: 0 }; // Credit entry
    const totalAmount = accountEntry.amount; // now credit amount = debit amount

    return (
        <div className='min-h-screen bg-blue-50 p-4'>
            <Sidebar/>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='w-full bg-blue-100 flex justify-center items-center rounded-2xl shadow-lg py-6'>
                        <Receipt className="w-8 h-8 text-blue-600 mr-3" />
                        <h1 className='text-3xl font-bold text-blue-800'>
                            RECEIPT VOUCHER
                        </h1>
                    </div>
                </div>

                {/* Main Form */}
                <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
                    <VoucherHeader
                        voucherNumber={voucher.voucherNumber}
                        accountLedgerId={accountEntry.ledgerId}
                        totalAmount={totalAmount}
                        handleVoucherNumberChange={handleVoucherNumberChange}
                        handleAccountEntryChange={handleAccountEntryChange}
                    />

                    <div className='p-6 lg:p-8 space-y-8'>
                        {/* Date Selection */}
                        <div className='flex items-center gap-4'>
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <label className='text-sm font-semibold text-blue-800'>Date</label>
                            <input
                                type="date"
                                value={voucher.date ? voucher.date : new Date().toISOString().split('T')[0]}
                                onChange={handleDateChange}
                                className='px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                            />
                        </div>

                        {/* Particulars */}
                        <VoucherParticularsList
                            entries={particularEntries}
                            handleParticularChange={handleParticularChange}
                            handleRemoveParticularRow={handleRemoveParticularRow}
                        />

                        {/* Narration */}
                        <VoucherNarration
                            narration={voucher.narration}
                            handleNarrationChange={handleNarrationChange}
                            handleAddParticularRow={handleAddParticularRow}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-blue-200">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                                    createVoucherMutation.isPending 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                                disabled={createVoucherMutation.isPending}
                            >
                                {createVoucherMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Submit Voucher
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecieptVoucher;