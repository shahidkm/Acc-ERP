import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreatePurchaseOrder } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import {
  Plus,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
  Package,
  User,
  Calendar,
  FileText,
  Hash,
  DollarSign,
  Percent,
  Trash2,
  Calculator,
  Building,
  CreditCard,
  Tag,
  Globe,
  TrendingUp,
  Receipt,
  Banknote,
  Archive
} from 'lucide-react';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreatePurchaseOrder();

  // Form state
  const [formData, setFormData] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    lpoDate: new Date().toISOString().split('T')[0],
    documentType: '',
    quotationPurchaseId: '',
    salesOrder: '',
    jobCode: '',
    vendorId: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1.0',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    items: [
      {
        id: 0,
        itemId: '',
        unitId: '',
        cost: 0,
        taxCode: '',
        taxIncluded: false,
        vatAmount: 0,
        total: 0
      }
    ],
    otherCosts: [
      {
        id: 0,
        debitLedgerId: '',
        reference: '',
        description: '',
        amount: 0,
        currency: 'USD',
        rate: 1.0,
        convrtAmt: 0,
        vatRate: 0,
        txCode: '',
        creditLedgerId: ''
      }
    ]
  });

  const documentTypes = [
    { value: 'standard', label: 'Standard Purchase Order' },
    { value: 'blanket', label: 'Blanket Purchase Order' },
    { value: 'contract', label: 'Contract Purchase Order' },
    { value: 'planned', label: 'Planned Purchase Order' },
    { value: 'service', label: 'Service Purchase Order' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'INR', label: 'INR - Indian Rupee' }
  ];

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Calculate totals for the item
    if (field === 'cost' || field === 'vatAmount') {
      const cost = parseFloat(updatedItems[index].cost) || 0;
      const vatAmount = parseFloat(updatedItems[index].vatAmount) || 0;
      updatedItems[index].total = cost + vatAmount;
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));

    // Recalculate totals
    calculateTotals(updatedItems, formData.otherCosts);
  };

  // Handle other costs changes
  const handleOtherCostChange = (index, field, value) => {
    const updatedOtherCosts = [...formData.otherCosts];
    updatedOtherCosts[index] = {
      ...updatedOtherCosts[index],
      [field]: value
    };

    // Calculate converted amount for other costs
    if (field === 'amount' || field === 'rate') {
      const amount = parseFloat(updatedOtherCosts[index].amount) || 0;
      const rate = parseFloat(updatedOtherCosts[index].rate) || 1;
      updatedOtherCosts[index].convrtAmt = amount * rate;
    }

    setFormData(prev => ({
      ...prev,
      otherCosts: updatedOtherCosts
    }));

    // Recalculate totals
    calculateTotals(formData.items, updatedOtherCosts);
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 0,
          itemId: '',
          unitId: '',
          cost: 0,
          taxCode: '',
          taxIncluded: false,
          vatAmount: 0,
          total: 0
        }
      ]
    }));
  };

  // Remove item
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
      calculateTotals(updatedItems, formData.otherCosts);
    }
  };

  // Add new other cost
  const addOtherCost = () => {
    setFormData(prev => ({
      ...prev,
      otherCosts: [
        ...prev.otherCosts,
        {
          id: 0,
          debitLedgerId: '',
          reference: '',
          description: '',
          amount: 0,
          currency: 'USD',
          rate: 1.0,
          convrtAmt: 0,
          vatRate: 0,
          txCode: '',
          creditLedgerId: ''
        }
      ]
    }));
  };

  // Remove other cost
  const removeOtherCost = (index) => {
    if (formData.otherCosts.length > 1) {
      const updatedOtherCosts = formData.otherCosts.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        otherCosts: updatedOtherCosts
      }));
      calculateTotals(formData.items, updatedOtherCosts);
    }
  };

  // Calculate totals
  const calculateTotals = (items = formData.items, otherCosts = formData.otherCosts) => {
    const itemsSubtotal = items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    const itemsVATAmount = items.reduce((sum, item) => sum + (parseFloat(item.vatAmount) || 0), 0);
    
    const otherCostsTotal = otherCosts.reduce((sum, cost) => sum + (parseFloat(cost.convrtAmt) || 0), 0);
    
    const subtotal = itemsSubtotal + otherCostsTotal;
    const totalVATAmount = itemsVATAmount;
    const discount = parseFloat(formData.discount) || 0;
    const grandTotal = subtotal + totalVATAmount;
    const netAmount = grandTotal - discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      totalVATAmount,
      grandTotal,
      netAmount
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      id: parseInt(formData.id) || 0,
      quotationPurchaseId: parseInt(formData.quotationPurchaseId) || 0,
      salesOrder: parseInt(formData.salesOrder) || 0,
      vendorId: parseInt(formData.vendorId) || 0,
      currencyRate: formData.currencyRate.toString(),
      date: new Date(formData.date).toISOString(),
      lpoDate: new Date(formData.lpoDate).toISOString(),
      items: formData.items.map(item => ({
        ...item,
        id: parseInt(item.id) || 0,
        itemId: parseInt(item.itemId) || 0,
        unitId: parseInt(item.unitId) || 0,
        cost: parseFloat(item.cost) || 0,
        vatAmount: parseFloat(item.vatAmount) || 0,
        total: parseFloat(item.total) || 0
      })),
      otherCosts: formData.otherCosts.map(cost => ({
        ...cost,
        id: parseInt(cost.id) || 0,
        debitLedgerId: parseInt(cost.debitLedgerId) || 0,
        creditLedgerId: parseInt(cost.creditLedgerId) || 0,
        amount: parseFloat(cost.amount) || 0,
        rate: parseFloat(cost.rate) || 0,
        convrtAmt: parseFloat(cost.convrtAmt) || 0,
        vatRate: parseFloat(cost.vatRate) || 0
      }))
    };

    mutate(submissionData, {
      onSuccess: () => {
        // Optionally navigate after success
        // navigate('/purchase-orders');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Purchase Order
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Streamline your procurement process with precision</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-[#f29f67]" />
                    Purchase Order ID
                  </label>
                  <input
                    type="number"
                    value={formData.id}
                    onChange={(e) => handleFieldChange('id', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Auto-generated"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#f29f67]" />
                    Date
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#f29f67]" />
                    LPO Date
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.lpoDate}
                    onChange={(e) => handleFieldChange('lpoDate', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#f29f67]" />
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleFieldChange('documentType', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#f29f67]" />
                    Quotation Purchase ID
                  </label>
                  <input
                    type="number"
                    value={formData.quotationPurchaseId}
                    onChange={(e) => handleFieldChange('quotationPurchaseId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter quotation purchase ID"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#f29f67]" />
                    Sales Order
                  </label>
                  <input
                    type="number"
                    value={formData.salesOrder}
                    onChange={(e) => handleFieldChange('salesOrder', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter sales order number"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#f29f67]" />
                    Job Code
                  </label>
                  <input
                    type="text"
                    value={formData.jobCode}
                    onChange={(e) => handleFieldChange('jobCode', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter job code"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#f29f67]" />
                    Vendor ID
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.vendorId}
                    onChange={(e) => handleFieldChange('vendorId', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    placeholder="Enter vendor ID"
                  />
                </div>
              </div>

              {/* Currency Section */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Currency Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.foreignCurrency}
                      onChange={(e) => handleFieldChange('foreignCurrency', e.target.checked)}
                      className="h-4 w-4 text-[#f29f67] focus:ring-[#f29f67] border-gray-300 rounded mr-3"
                    />
                    <label className="text-sm font-medium text-amber-800">Foreign Currency</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleFieldChange('currency', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">Currency Rate</label>
                    <input
                      type="text"
                      value={formData.currencyRate}
                      onChange={(e) => handleFieldChange('currencyRate', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="1.0"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#f29f67]" />
                    Purchase Items
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-medium rounded-lg hover:from-[#e8935c] to-[#d17d4a] transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Item #{index + 1}</h4>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={item.itemId}
                            onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                            placeholder="Item ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={item.unitId}
                            onChange={(e) => handleItemChange(index, 'unitId', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                            placeholder="Unit ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cost <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.cost}
                            onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Code
                          </label>
                          <input
                            type="text"
                            value={item.taxCode}
                            onChange={(e) => handleItemChange(index, 'taxCode', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                            placeholder="Tax code"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            VAT Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.vatAmount}
                            onChange={(e) => handleItemChange(index, 'vatAmount', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Included
                          </label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.taxIncluded}
                              onChange={(e) => handleItemChange(index, 'taxIncluded', e.target.checked)}
                              className="h-4 w-4 text-[#f29f67] focus:ring-[#f29f67] border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Tax included</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.total}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Costs Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Archive className="h-5 w-5 text-[#f29f67]" />
                    Other Costs
                  </h3>
                  <button
                    type="button"
                    onClick={addOtherCost}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-lg hover:from-purple-600 to-purple-700 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Other Cost
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.otherCosts.map((cost, index) => (
                    <div key={index} className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-purple-800">Other Cost #{index + 1}</h4>
                        {formData.otherCosts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOtherCost(index)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Debit Ledger ID
                          </label>
                          <input
                            type="number"
                            value={cost.debitLedgerId}
                            onChange={(e) => handleOtherCostChange(index, 'debitLedgerId', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="Debit Ledger ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Reference
                          </label>
                          <input
                            type="text"
                            value={cost.reference}
                            onChange={(e) => handleOtherCostChange(index, 'reference', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="Reference"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={cost.description}
                            onChange={(e) => handleOtherCostChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="Description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.amount}
                            onChange={(e) => handleOtherCostChange(index, 'amount', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Currency
                          </label>
                          <select
                            value={cost.currency}
                            onChange={(e) => handleOtherCostChange(index, 'currency', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                          >
                            {currencies.map((currency) => (
                              <option key={currency.value} value={currency.value}>
                                {currency.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Rate
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={cost.rate}
                            onChange={(e) => handleOtherCostChange(index, 'rate', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="1.0000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Converted Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.convrtAmt}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-100 border border-purple-300 rounded-lg text-purple-700"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            VAT Rate (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={cost.vatRate}
                            onChange={(e) => handleOtherCostChange(index, 'vatRate', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Tax Code
                          </label>
                          <input
                            type="text"
                            value={cost.txCode}
                            onChange={(e) => handleOtherCostChange(index, 'txCode', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="Tax Code"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-2">
                            Credit Ledger ID
                          </label>
                          <input
                            type="number"
                            value={cost.creditLedgerId}
                            onChange={(e) => handleOtherCostChange(index, 'creditLedgerId', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                            placeholder="Credit Ledger ID"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Purchase Order Totals
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Subtotal</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.subtotal}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Discount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => {
                        handleFieldChange('discount', e.target.value);
                        setTimeout(() => calculateTotals(), 0);
                      }}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Total VAT</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.totalVATAmount}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Grand Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.grandTotal}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-blue-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Net Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.netAmount}
                      readOnly
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400 rounded-lg text-white font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isPending || !formData.vendorId || !formData.date || !formData.lpoDate}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Purchase Order...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Purchase Order
                    </>
                  )}
                </button>
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
                    <p className="text-sm">Purchase order has been created successfully.</p>
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

export default CreatePurchaseOrder;