import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
// import { useCreateGoodsReceiptNote } from '../../hooks/goodsReceiptHooks/goodsReceiptHooks';
import {
  Plus,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Package,
  FileText,
  Building,
  DollarSign,
  Calculator,
  Trash2,
  Edit3,
  Users,
  Hash,
  Globe,
  Receipt,
  ShoppingCart
} from 'lucide-react';

const CreateGoodsReceiptNote = () => {
  const [formData, setFormData] = useState({
    referenceNo: '',
    vendorId: '',
    documentType: 'GRN',
    document: '',
    jobCode: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1.00',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    otherCosts: [],
    purchaseOrderItems: []
  });

  const navigate = useNavigate();

  // Uncomment when hook is available
  // const { mutate, isPending, isSuccess, isError, error } = useCreateGoodsReceiptNote();
  
  // Mock state for development
  const isPending = false;
  const isSuccess = false;
  const isError = false;
  const error = null;

  const documentTypeOptions = [
    { value: 'GRN', label: 'Goods Receipt Note', icon: Package },
    { value: 'INV', label: 'Invoice', icon: FileText },
    { value: 'DN', label: 'Delivery Note', icon: ShoppingCart },
    { value: 'Other', label: 'Other Document', icon: Receipt }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'AED', label: 'UAE Dirham (د.إ)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOtherCost = () => {
    const newOtherCost = {
      id: Date.now(),
      otherCostId: 0,
      debitLedgerId: 0,
      reference: '',
      description: '',
      amount: 0,
      currency: formData.currency,
      rate: parseFloat(formData.currencyRate),
      convrtAmt: 0,
      vatRate: 0,
      txCode: '',
      creditLedgerId: 0
    };
    
    setFormData(prev => ({
      ...prev,
      otherCosts: [...prev.otherCosts, newOtherCost]
    }));
  };

  const updateOtherCost = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      otherCosts: prev.otherCosts.map((cost, i) => 
        i === index ? { ...cost, [field]: value } : cost
      )
    }));
  };

  const removeOtherCost = (index) => {
    setFormData(prev => ({
      ...prev,
      otherCosts: prev.otherCosts.filter((_, i) => i !== index)
    }));
  };

  const addPurchaseOrderItem = () => {
    const newItem = {
      id: Date.now(),
      purchaseOrderId: 0,
      itemId: 0,
      unitId: 0,
      cost: 0,
      taxCode: '',
      taxIncluded: false,
      vatAmount: 0,
      total: 0
    };
    
    setFormData(prev => ({
      ...prev,
      purchaseOrderItems: [...prev.purchaseOrderItems, newItem]
    }));
  };

  const updatePurchaseOrderItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      purchaseOrderItems: prev.purchaseOrderItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removePurchaseOrderItem = (index) => {
    setFormData(prev => ({
      ...prev,
      purchaseOrderItems: prev.purchaseOrderItems.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const itemsSubtotal = formData.purchaseOrderItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const costsSubtotal = formData.otherCosts.reduce((sum, cost) => sum + (cost.convrtAmt || 0), 0);
    const subtotal = itemsSubtotal + costsSubtotal;
    const totalVAT = formData.purchaseOrderItems.reduce((sum, item) => sum + (item.vatAmount || 0), 0);
    const netAmount = subtotal - formData.discount;
    const grandTotal = netAmount + totalVAT;

    setFormData(prev => ({
      ...prev,
      subtotal,
      totalVATAmount: totalVAT,
      netAmount,
      grandTotal
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotals();

    const submitData = {
      ...formData,
      id: 0 // Will be set by backend
    };

    console.log('Submitting:', submitData);

    // Uncomment when hook is available
    // mutate(submitData, {
    //   onSuccess: () => {
    //     navigate('/goods-receipt-notes');
    //   },
    // });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/goods-receipt-notes')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goods Receipt Notes
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Goods Receipt Note
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Document received goods and manage inventory efficiently</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-[#f29f67]" />
                    Reference No
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNo}
                    onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="GRN-2024-001"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#f29f67]" />
                    Vendor ID
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.vendorId}
                    onChange={(e) => handleInputChange('vendorId', parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter vendor ID"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#f29f67]" />
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    {documentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#f29f67]" />
                    Document Reference
                  </label>
                  <input
                    type="text"
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Document reference"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-[#f29f67]" />
                    Job Code
                  </label>
                  <input
                    type="text"
                    value={formData.jobCode}
                    onChange={(e) => handleInputChange('jobCode', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Job code"
                  />
                </div>
              </div>

              {/* Currency Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#f29f67]" />
                  Currency Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.foreignCurrency}
                      onChange={(e) => handleInputChange('foreignCurrency', e.target.checked)}
                      className="h-5 w-5 text-[#f29f67] focus:ring-[#f29f67] border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Foreign Currency
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                    >
                      {currencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.currencyRate}
                      onChange={(e) => handleInputChange('currencyRate', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase Order Items */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#f29f67]" />
                    Purchase Order Items
                  </h3>
                  <button
                    type="button"
                    onClick={addPurchaseOrderItem}
                    className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>

                {formData.purchaseOrderItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">PO ID</label>
                        <input
                          type="number"
                          value={item.purchaseOrderId}
                          onChange={(e) => updatePurchaseOrderItem(index, 'purchaseOrderId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Item ID</label>
                        <input
                          type="number"
                          value={item.itemId}
                          onChange={(e) => updatePurchaseOrderItem(index, 'itemId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Unit ID</label>
                        <input
                          type="number"
                          value={item.unitId}
                          onChange={(e) => updatePurchaseOrderItem(index, 'unitId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Cost</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.cost}
                          onChange={(e) => updatePurchaseOrderItem(index, 'cost', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tax Code</label>
                        <input
                          type="text"
                          value={item.taxCode}
                          onChange={(e) => updatePurchaseOrderItem(index, 'taxCode', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removePurchaseOrderItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.taxIncluded}
                          onChange={(e) => updatePurchaseOrderItem(index, 'taxIncluded', e.target.checked)}
                          className="h-4 w-4 text-[#f29f67] focus:ring-[#f29f67] border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">Tax Included</label>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">VAT Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.vatAmount}
                          onChange={(e) => updatePurchaseOrderItem(index, 'vatAmount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.total}
                          onChange={(e) => updatePurchaseOrderItem(index, 'total', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.purchaseOrderItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No purchase order items added yet</p>
                  </div>
                )}
              </div>

              {/* Other Costs */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[#f29f67]" />
                    Other Costs
                  </h3>
                  <button
                    type="button"
                    onClick={addOtherCost}
                    className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cost
                  </button>
                </div>

                {formData.otherCosts.map((cost, index) => (
                  <div key={cost.id} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reference</label>
                        <input
                          type="text"
                          value={cost.reference}
                          onChange={(e) => updateOtherCost(index, 'reference', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={cost.description}
                          onChange={(e) => updateOtherCost(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeOtherCost(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.amount}
                          onChange={(e) => updateOtherCost(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.rate}
                          onChange={(e) => updateOtherCost(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Converted Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.convrtAmt}
                          onChange={(e) => updateOtherCost(index, 'convrtAmt', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">VAT Rate (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.vatRate}
                          onChange={(e) => updateOtherCost(index, 'vatRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Other Cost ID</label>
                        <input
                          type="number"
                          value={cost.otherCostId}
                          onChange={(e) => updateOtherCost(index, 'otherCostId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Debit Ledger ID</label>
                        <input
                          type="number"
                          value={cost.debitLedgerId}
                          onChange={(e) => updateOtherCost(index, 'debitLedgerId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Credit Ledger ID</label>
                        <input
                          type="number"
                          value={cost.creditLedgerId}
                          onChange={(e) => updateOtherCost(index, 'creditLedgerId', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tax Code</label>
                      <input
                        type="text"
                        value={cost.txCode}
                        onChange={(e) => updateOtherCost(index, 'txCode', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#f29f67]"
                      />
                    </div>
                  </div>
                ))}

                {formData.otherCosts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No additional costs added yet</p>
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#f29f67]" />
                  Financial Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.subtotal}
                      onChange={(e) => handleInputChange('subtotal', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total VAT</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.totalVATAmount}
                      onChange={(e) => handleInputChange('totalVATAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Net Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.netAmount}
                      onChange={(e) => handleInputChange('netAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67]"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grand Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.grandTotal}
                      onChange={(e) => handleInputChange('grandTotal', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] font-semibold"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={calculateTotals}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate Totals
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isPending || !formData.referenceNo || !formData.vendorId}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isPending ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                        Creating GRN...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3" />
                        Create Goods Receipt Note
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/goods-receipt-notes')}
                    className="inline-flex items-center justify-center px-6 py-4 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Status Messages */}
          {(isSuccess || isError) && (
            <div className="border-t border-gray-200 p-6 bg-gray-50/50">
              {isSuccess && (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Goods Receipt Note has been created successfully.</p>
                  </div>
                </div>
              )}

              {isError && (
                <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">{error?.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGoodsReceiptNote;