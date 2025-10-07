import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetVoucher,
    setCompanyId,
    setType,
    setEntries,
    setItems,
    setVoucherNumber,
    setDate,
    setNarration
} from "../../redux/slices/voucher"
import { useCreateVoucher } from '../../../src/hooks/voucherHooks/useCreateVoucher';
import { 
    Plus, Trash2, Save, Calendar, FileText, DollarSign, Building, 
    RotateCcw, Package, Receipt, Calculator, Truck 
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';

function PurchaseReturnVoucher() {
    const dispatch = useDispatch();
    const voucher = useSelector((state) => state.voucher);
    const createVoucherMutation = useCreateVoucher();
    const [activeTab, setActiveTab] = useState('items');

    // Mock data - replace with your actual data
    const suppliersData = [
        { id: 1, name: 'Supplier A Ltd.' },
        { id: 2, name: 'Supplier B Enterprises' },
        { id: 3, name: 'Supplier C Industries' }
    ];

    const itemsData = [
        { id: 1, name: 'Raw Material A', rate: 50 },
        { id: 2, name: 'Raw Material B', rate: 75 },
        { id: 3, name: 'Equipment C', rate: 1200 }
    ];

    const ledgersData = [
        { ledgerId: 1, alias: 'Purchase Return Account' },
        { ledgerId: 2, alias: 'Supplier A/C' },
        { ledgerId: 3, alias: 'Input Tax Credit Return' },
        { ledgerId: 4, alias: 'Freight Account' }
    ];

    useEffect(() => {
        dispatch(resetVoucher());
        dispatch(setCompanyId(0));
        dispatch(setType(5)); // Purchase return voucher type

        // Initialize with basic credit and debit entries (opposite of purchase)
        dispatch(setEntries([
            { ledgerId: 0, entryType: 1, amount: 0 }, // Purchase Return Account (Credit)
            { ledgerId: 0, entryType: 0, amount: 0 }  // Supplier Account (Debit)
        ]));

        // Initialize with one item
        dispatch(setItems([
            {
                itemId: 0,
                quantity: 0,
                rate: 0,
                gst: {
                    cgstPercent: 0,
                    sgstPercent: 0,
                    igstPercent: 0
                }
            }
        ]));
    }, [dispatch]);

    const totalItemsAmount = voucher.items?.reduce((sum, item) => {
        return sum + (item.quantity * item.rate);
    }, 0) || 0;

    const totalGstAmount = voucher.items?.reduce((sum, item) => {
        const itemTotal = (item.quantity * item.rate);
        return sum + (itemTotal * ((item.gst.cgstPercent + item.gst.sgstPercent + item.gst.igstPercent) / 100));
    }, 0) || 0;

    const freightCharges = parseFloat(voucher.freightCharges) || 0;
    const grandTotal = totalItemsAmount + totalGstAmount + freightCharges;

    const handleSubmit = () => {
        const voucherData = {
            companyId: voucher.companyId,
            voucherNumber: voucher.voucherNumber,
            type: 5, // Purchase return voucher type
            date: voucher.date,
            narration: voucher.narration,
            entries: voucher.entries,
            items: voucher.items,
        };

        createVoucherMutation.mutate(voucherData, {
            onSuccess: () => {
                dispatch(resetVoucher());
                alert('Purchase return voucher created successfully!');
            },
            onError: (error) => {
                console.error("Error creating voucher:", error);
                alert('Error creating purchase return voucher');
            }
        });
    };

    const addItem = () => {
        const newItems = [...(voucher.items || []), {
            itemId: 0,
            quantity: 0,
            rate: 0,
            gst: {
                cgstPercent: 0,
                sgstPercent: 0,
                igstPercent: 0
            }
        }];
        dispatch(setItems(newItems));
    };

    const removeItem = (index) => {
        const newItems = voucher.items.filter((_, i) => i !== index);
        dispatch(setItems(newItems));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...voucher.items];
        if (field.includes('gst.')) {
            const gstField = field.split('.')[1];
            newItems[index] = {
                ...newItems[index],
                gst: {
                    ...newItems[index].gst,
                    [gstField]: parseFloat(value) || 0
                }
            };
        } else {
            newItems[index] = {
                ...newItems[index],
                [field]: field === 'itemId' ? parseInt(value) || 0 : parseFloat(value) || 0
            };
        }
        dispatch(setItems(newItems));
    };

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-6 py-3 font-medium rounded-lg transition-all ${
                isActive 
                    ? 'bg-teal-100 text-teal-700 border-2 border-teal-300' 
                    : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
            }`}
            style={isActive ? { borderColor: '#5eead4', backgroundColor: '#f0fdfa' } : {}}
        >
            <Icon size={18} className="mr-2" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
          <Sidebar/>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <RotateCcw size={40} style={{ color: '#14b8a6' }} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Purchase Return Voucher</h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-teal-400 to-cyan-600 mx-auto rounded-full"></div>
                </div>

                {/* Voucher Header Card */}
                <div className="bg-white rounded-xl shadow-lg border border-teal-200 p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Voucher Number */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FileText size={16} className="mr-2" style={{ color: '#14b8a6' }} />
                                Voucher Number
                            </label>
                            <input
                                type="text"
                                value={voucher.voucherNumber || ''}
                                onChange={(e) => dispatch(setVoucherNumber(e.target.value))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                                placeholder="Enter return voucher number"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Calendar size={16} className="mr-2" style={{ color: '#14b8a6' }} />
                                Return Date
                            </label>
                            <input
                                type="date"
                                value={voucher.date || new Date().toISOString().split('T')[0]}
                                onChange={(e) => dispatch(setDate(e.target.value))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Supplier Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Building size={16} className="mr-2" style={{ color: '#14b8a6' }} />
                                Return to Supplier
                            </label>
                            <select
                                value={voucher.companyId || ''}
                                onChange={(e) => dispatch(setCompanyId(parseInt(e.target.value) || 0))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                            >
                                <option value="">Select supplier</option>
                                {suppliersData.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Grand Total Display */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <DollarSign size={16} className="mr-2" style={{ color: '#14b8a6' }} />
                                Return Amount
                            </label>
                            <div className="bg-gradient-to-r from-teal-100 to-cyan-50 p-3 rounded-lg border-2 border-teal-200">
                                <span className="text-2xl font-bold text-gray-800">
                                    ₹ {grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-lg border border-teal-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <TabButton 
                            id="items" 
                            label="Return Items" 
                            icon={Package}
                            isActive={activeTab === 'items'}
                            onClick={setActiveTab}
                        />
                        <TabButton 
                            id="particulars" 
                            label="Particulars" 
                            icon={Receipt}
                            isActive={activeTab === 'particulars'}
                            onClick={setActiveTab}
                        />
                        <TabButton 
                            id="summary" 
                            label="Summary" 
                            icon={Calculator}
                            isActive={activeTab === 'summary'}
                            onClick={setActiveTab}
                        />
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-96">
                        {activeTab === 'items' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Purchase Return Items</h3>
                                    <button 
                                        onClick={addItem}
                                        className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                        style={{ backgroundColor: '#14b8a6' }}
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Return Item
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-teal-50 border-b-2 border-teal-200">
                                                <th className="text-left p-4 font-semibold text-gray-700">Item</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Return Qty</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Rate</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">CGST %</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">SGST %</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">IGST %</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                                                <th className="text-center p-4 font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voucher.items?.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-teal-25">
                                                    <td className="p-4">
                                                        <select 
                                                            value={item.itemId || ''}
                                                            onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                        >
                                                            <option value="">Select item</option>
                                                            {itemsData.map((itemData) => (
                                                                <option key={itemData.id} value={itemData.id}>
                                                                    {itemData.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.quantity || ''} 
                                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                            placeholder="Return Qty"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.rate || ''} 
                                                            onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                            placeholder="Rate"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.cgstPercent || ''} 
                                                            onChange={(e) => updateItem(index, 'gst.cgstPercent', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                            placeholder="0"
                                                            min="0"
                                                            max="50"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.sgstPercent || ''} 
                                                            onChange={(e) => updateItem(index, 'gst.sgstPercent', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                            placeholder="0"
                                                            min="0"
                                                            max="50"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.igstPercent || ''} 
                                                            onChange={(e) => updateItem(index, 'gst.igstPercent', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                            placeholder="0"
                                                            min="0"
                                                            max="50"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="p-4 font-semibold text-gray-800">
                                                        ₹ {((item.quantity || 0) * (item.rate || 0)).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {voucher.items?.length > 1 && (
                                                            <button 
                                                                onClick={() => removeItem(index)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'particulars' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Account Particulars</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-teal-50 border-b-2 border-teal-200">
                                                <th className="text-left p-4 font-semibold text-gray-700">Account</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voucher.entries?.map((entry, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-teal-25">
                                                    <td className="p-4">
                                                        <select className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400">
                                                            <option value="">Select account</option>
                                                            {ledgersData.map((ledger) => (
                                                                <option key={ledger.ledgerId} value={ledger.ledgerId}>
                                                                    {ledger.alias}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            entry.entryType === 0 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {entry.entryType === 0 ? 'Debit' : 'Credit'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-semibold text-gray-800">
                                                        ₹ {grandTotal.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'summary' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Purchase Return Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                        <div className="text-sm font-medium text-blue-600 mb-1">Items Total</div>
                                        <div className="text-2xl font-bold text-blue-800">₹ {totalItemsAmount.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                        <div className="text-sm font-medium text-yellow-600 mb-1">GST Total</div>
                                        <div className="text-2xl font-bold text-yellow-800">₹ {totalGstAmount.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                        <div className="text-sm font-medium text-purple-600 mb-1">Freight Charges</div>
                                        <div className="text-2xl font-bold text-purple-800">₹ {freightCharges.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                        <div className="text-sm font-medium text-green-600 mb-1">Return Total</div>
                                        <div className="text-3xl font-bold text-green-800">₹ {grandTotal.toFixed(2)}</div>
                                    </div>
                                </div>

                                {/* Additional Return Details */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-700 mb-2">Tax Return Breakdown</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>CGST Return:</span>
                                                <span>₹ {voucher.items?.reduce((sum, item) => {
                                                    const itemTotal = item.quantity * item.rate;
                                                    return sum + (itemTotal * (item.gst.cgstPercent / 100));
                                                }, 0).toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>SGST Return:</span>
                                                <span>₹ {voucher.items?.reduce((sum, item) => {
                                                    const itemTotal = item.quantity * item.rate;
                                                    return sum + (itemTotal * (item.gst.sgstPercent / 100));
                                                }, 0).toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>IGST Return:</span>
                                                <span>₹ {voucher.items?.reduce((sum, item) => {
                                                    const itemTotal = item.quantity * item.rate;
                                                    return sum + (itemTotal * (item.gst.igstPercent / 100));
                                                }, 0).toFixed(2) || '0.00'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-700 mb-2">Return Summary</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Total Items Returned:</span>
                                                <span>{voucher.items?.length || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Total Quantity Returned:</span>
                                                <span>{voucher.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Avg. Return Rate:</span>
                                                <span>₹ {voucher.items?.length > 0 ? (totalItemsAmount / voucher.items.reduce((sum, item) => sum + (item.quantity || 0), 0) || 1).toFixed(2) : '0.00'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Narration Section */}
                <div className="bg-white rounded-xl shadow-lg border border-teal-200 p-8 mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        Return Reason / Notes
                    </label>
                    <textarea
                        value={voucher.narration || ''}
                        onChange={(e) => dispatch(setNarration(e.target.value))}
                        className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                        rows="4"
                        placeholder="Enter return reason, quality issues, damage description, or other return notes..."
                    />
                </div>

                {/* Submit Section */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={createVoucherMutation.isPending}
                        className="flex items-center px-8 py-4 bg-teal-500 text-white text-lg font-semibold rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        style={{ backgroundColor: '#14b8a6' }}
                    >
                        <Save size={24} className="mr-3" />
                        {createVoucherMutation.isPending ? 'Processing Return...' : 'Save Purchase Return Voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PurchaseReturnVoucher;