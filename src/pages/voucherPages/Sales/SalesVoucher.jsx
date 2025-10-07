import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetVoucher,
    setCompanyId,
    setType,
    setEntries,
    setItems,
    updateEntry,
    setDate
} from "../../../redux/slices/voucher"
import { useCreateVoucher } from '../../../hooks/voucherHooks/useCreateVoucher';
import { 
    Plus, Trash2, Save, Calendar, FileText, DollarSign, Building, 
    ShoppingCart, Package, Truck, Calculator, Receipt 
} from 'lucide-react';
import Sidebar from '../../../components/sidebar/Sidebar';

function SalesVoucher() {
    const dispatch = useDispatch();
    const voucher = useSelector((state) => state.voucher);
    const createVoucherMutation = useCreateVoucher();
    const [activeTab, setActiveTab] = useState('items');

    // Mock data - replace with your actual data
    const companiesData = [
        { id: 1, name: 'ABC Company Ltd.' },
        { id: 2, name: 'XYZ Enterprises' },
        { id: 3, name: 'DEF Industries' }
    ];

    const itemsData = [
        { id: 1, name: 'Product A', rate: 100 },
        { id: 2, name: 'Product B', rate: 200 },
        { id: 3, name: 'Product C', rate: 150 }
    ];

    const ledgersData = [
        { ledgerId: 1, alias: 'Sales Account' },
        { ledgerId: 2, alias: 'Customer A/C' },
        { ledgerId: 3, alias: 'Tax Account' }
    ];

    useEffect(() => {
        dispatch(resetVoucher());
        dispatch(setCompanyId(0));
        dispatch(setType(4));

        dispatch(setEntries([
            { ledgerId: 0, entryType: 0, amount: 0 },
            { ledgerId: 0, entryType: 1, amount: 0 }
        ]));

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

    const freightCharges = parseFloat(voucher.dispatchDetails?.freightCharges) || 0;
    const grandTotal = totalItemsAmount + totalGstAmount + freightCharges;

    const handleSubmit = () => {
        const voucherData = {
            companyId: voucher.companyId,
            voucherNumber: voucher.voucherNumber,
            type: 0,
            date: voucher.date,
            narration: voucher.narration,
            entries: voucher.entries,
            items: voucher.items,
            dispatchDetails: voucher.dispatchDetails
        };

        createVoucherMutation.mutate(voucherData, {
            onSuccess: () => {
                dispatch(resetVoucher());
                alert('Sales voucher created successfully!');
            },
            onError: (error) => {
                console.error("Error creating voucher:", error);
                alert('Error creating voucher');
            }
        });
    };

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center px-6 py-3 font-medium rounded-lg transition-all ${
                isActive 
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
            style={isActive ? { borderColor: '#f29f67', backgroundColor: '#fef3f0' } : {}}
        >
            <Icon size={18} className="mr-2" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <Sidebar/>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <ShoppingCart size={40} style={{ color: '#f29f67' }} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Sales Voucher</h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                </div>

                {/* Voucher Header Card */}
                <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Voucher Number */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FileText size={16} className="mr-2" style={{ color: '#f29f67' }} />
                                Voucher Number
                            </label>
                            <input
                                type="text"
                                value={voucher.voucherNumber || ''}
                                onChange={(e) => dispatch(setVoucherNumber(e.target.value))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                placeholder="Enter voucher number"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Calendar size={16} className="mr-2" style={{ color: '#f29f67' }} />
                                Date
                            </label>
                            <input
                                type="date"
                                value={voucher.date || new Date().toISOString().split('T')[0]}
                                onChange={(e) => dispatch(setDate(e.target.value))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Company Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <Building size={16} className="mr-2" style={{ color: '#f29f67' }} />
                                Company
                            </label>
                            <select
                                value={voucher.companyId || ''}
                                onChange={(e) => dispatch(setCompanyId(parseInt(e.target.value) || 0))}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                            >
                                <option value="">Select company</option>
                                {companiesData.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Grand Total Display */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <DollarSign size={16} className="mr-2" style={{ color: '#f29f67' }} />
                                Grand Total
                            </label>
                            <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-3 rounded-lg border-2 border-orange-200">
                                <span className="text-2xl font-bold text-gray-800">
                                    ₹ {grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <TabButton 
                            id="items" 
                            label="Items" 
                            icon={Package}
                            isActive={activeTab === 'items'}
                            onClick={setActiveTab}
                        />
                        <TabButton 
                            id="dispatch" 
                            label="Dispatch" 
                            icon={Truck}
                            isActive={activeTab === 'dispatch'}
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
                                    <h3 className="text-xl font-bold text-gray-800">Items Details</h3>
                                    <button 
                                        onClick={() => {/* Add item logic */}}
                                        className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        style={{ backgroundColor: '#f29f67' }}
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Item
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-orange-50 border-b-2 border-orange-200">
                                                <th className="text-left p-4 font-semibold text-gray-700">Item</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Quantity</th>
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
                                                <tr key={index} className="border-b border-gray-100 hover:bg-orange-25">
                                                    <td className="p-4">
                                                        <select className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400">
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
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="Qty"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.rate || ''} 
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="Rate"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.cgstPercent || ''} 
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.sgstPercent || ''} 
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input 
                                                            type="number" 
                                                            value={item.gst?.igstPercent || ''} 
                                                            className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="p-4 font-semibold text-gray-800">
                                                        ₹ {((item.quantity || 0) * (item.rate || 0)).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'dispatch' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Dispatch Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Freight Charges</label>
                                        <input 
                                            type="number"
                                            value={voucher.dispatchDetails?.freightCharges || ''}
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            placeholder="Enter freight charges"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                                        <textarea 
                                            value={voucher.dispatchDetails?.address || ''}
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            rows="3"
                                            placeholder="Enter delivery address"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'particulars' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Account Particulars</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-orange-50 border-b-2 border-orange-200">
                                                <th className="text-left p-4 font-semibold text-gray-700">Account</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                                                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voucher.entries?.map((entry, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-orange-25">
                                                    <td className="p-4">
                                                        <select className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400">
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
                                                        ₹ {(entry.amount || 0).toFixed(2)}
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
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Sales Summary</h3>
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
                                        <div className="text-sm font-medium text-green-600 mb-1">Grand Total</div>
                                        <div className="text-3xl font-bold text-green-800">₹ {grandTotal.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Narration Section */}
                <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 mb-8">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        Narration / Remarks
                    </label>
                    <textarea
                        value={voucher.narration || ''}
                        className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        rows="4"
                        placeholder="Enter sales narration or remarks..."
                    />
                </div>

                {/* Submit Section */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={createVoucherMutation.isPending}
                        className="flex items-center px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        style={{ backgroundColor: '#f29f67' }}
                    >
                        <Save size={24} className="mr-3" />
                        {createVoucherMutation.isPending ? 'Saving...' : 'Save Sales Voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SalesVoucher;