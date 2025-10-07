import React, { useState } from 'react';
import { Plus, Save, X, Calculator, DollarSign, FileText, User, Calendar, Package, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const CreateSalesOrder = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    referenseNo: 0,
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    salesManId: '',
    quotationId: '',
    description: '',
    terms: '',
    day: '',
    jobCode: '',
    purchaseOrderId: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    salesOrderItems: []
  });

  const [currentItem, setCurrentItem] = useState({
    itemId: '',
    unitId: '',
    cost: '',
    taxCode: '',
    taxIncluded: false,
    vatAmount: '',
    total: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = 'Customer ID is required';
    if (!formData.salesManId) newErrors.salesManId = 'Salesman ID is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (formData.salesOrderItems.length === 0) newErrors.items = 'At least one item is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'cost' || field === 'vatAmount') {
        const cost = parseFloat(field === 'cost' ? value : updated.cost) || 0;
        const vatAmount = parseFloat(field === 'vatAmount' ? value : updated.vatAmount) || 0;
        updated.total = (cost + vatAmount).toFixed(2);
      }
      return updated;
    });
  };

  const addItem = () => {
    if (!currentItem.itemId || !currentItem.cost) {
      alert('Please fill in Item ID and Cost');
      return;
    }

    const newItem = {
      ...currentItem,
      itemId: parseInt(currentItem.itemId),
      unitId: parseInt(currentItem.unitId) || 0,
      cost: parseFloat(currentItem.cost) || 0,
      vatAmount: parseFloat(currentItem.vatAmount) || 0,
      total: parseFloat(currentItem.total) || 0
    };

    setFormData(prev => ({
      ...prev,
      salesOrderItems: [...prev.salesOrderItems, newItem]
    }));

    setCurrentItem({
      itemId: '',
      unitId: '',
      cost: '',
      taxCode: '',
      taxIncluded: false,
      vatAmount: '',
      total: ''
    });

    calculateTotals([...formData.salesOrderItems, newItem]);
  };

  const removeItem = (index) => {
    const updatedItems = formData.salesOrderItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, salesOrderItems: updatedItems }));
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items = formData.salesOrderItems) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    const totalVATAmount = items.reduce((sum, item) => sum + (parseFloat(item.vatAmount) || 0), 0);
    const discountAmount = (subtotal * (formData.discount || 0)) / 100;
    const netAmount = subtotal - discountAmount;
    const grandTotal = netAmount + totalVATAmount;

    setFormData(prev => ({
      ...prev,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalVATAmount: parseFloat(totalVATAmount.toFixed(2)),
      netAmount: parseFloat(netAmount.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(formData);
        if (onClose) onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
        <Sidebar/>
      <div>
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-t-2xl p-8 border-b border-white/50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create Sales Order
                </h2>
                <p className="text-gray-600 mt-1">Fill in the details to create a new sales order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-teal-500" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-500" />
                    Reference No.
                  </label>
                  <input
                    type="number"
                    value={formData.referenseNo}
                    onChange={(e) => handleInputChange('referenseNo', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="Auto-generated if 0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-500" />
                    Customer ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.customerId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="Enter customer ID"
                  />
                  {errors.customerId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.customerId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-500" />
                    Salesman ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.salesManId}
                    onChange={(e) => handleInputChange('salesManId', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.salesManId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="Enter salesman ID"
                  />
                  {errors.salesManId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.salesManId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Quotation ID
                  </label>
                  <input
                    type="number"
                    value={formData.quotationId}
                    onChange={(e) => handleInputChange('quotationId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Purchase Order ID
                  </label>
                  <input
                    type="number"
                    value={formData.purchaseOrderId}
                    onChange={(e) => handleInputChange('purchaseOrderId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="Enter order description"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Terms
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="Enter terms and conditions"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Currency & Pricing */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-teal-500" />
                Currency & Pricing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="foreignCurrency"
                    checked={formData.foreignCurrency}
                    onChange={(e) => handleInputChange('foreignCurrency', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="foreignCurrency" className="ml-2 block text-sm font-semibold text-gray-700">
                    Foreign Currency
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Currency Rate
                  </label>
                  <input
                    type="text"
                    value={formData.currencyRate}
                    onChange={(e) => handleInputChange('currencyRate', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="1.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => {
                      handleInputChange('discount', e.target.value);
                      setTimeout(() => calculateTotals(), 100);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-500" />
                Sales Order Items
              </h3>

              {/* Add Item Form */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl mb-6 border border-teal-200">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      Item ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={currentItem.itemId}
                      onChange={(e) => handleItemChange('itemId', e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Item ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      Unit ID
                    </label>
                    <input
                      type="number"
                      value={currentItem.unitId}
                      onChange={(e) => handleItemChange('unitId', e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Unit ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      Cost <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentItem.cost}
                      onChange={(e) => handleItemChange('cost', e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      Tax Code
                    </label>
                    <input
                      type="text"
                      value={currentItem.taxCode}
                      onChange={(e) => handleItemChange('taxCode', e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Tax Code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      VAT Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentItem.vatAmount}
                      onChange={(e) => handleItemChange('vatAmount', e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-teal-800 mb-2">
                      Total
                    </label>
                    <input
                      type="text"
                      value={currentItem.total}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border-2 border-teal-200 rounded-lg"
                      placeholder="Auto"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="taxIncluded"
                        checked={currentItem.taxIncluded}
                        onChange={(e) => handleItemChange('taxIncluded', e.target.checked)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="taxIncluded" className="ml-2 block text-xs text-teal-800">
                        Tax Inc.
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:opacity-90 transition-all shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {formData.salesOrderItems.length > 0 && (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Unit ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Inc.</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">VAT</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {formData.salesOrderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.itemId}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.unitId}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${item.cost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.taxCode}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.taxIncluded ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.taxIncluded ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">${item.vatAmount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {errors.items && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.items}
                </p>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Subtotal</p>
                <p className="text-lg font-semibold text-teal-900">${formData.subtotal.toFixed(2)}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Discount</p>
                <p className="text-lg font-semibold text-red-600">-${((formData.subtotal * formData.discount) / 100).toFixed(2)}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Net Amount</p>
                <p className="text-lg font-semibold text-teal-900">${formData.netAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Total VAT</p>
                <p className="text-lg font-semibold text-teal-900">${formData.totalVATAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Grand Total</p>
                <p className="text-xl font-bold text-[#f29f67]">${formData.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || formData.salesOrderItems.length === 0}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Sales Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Sales order created successfully. Redirecting...</p>
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">Something went wrong. Please try again.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSalesOrder;