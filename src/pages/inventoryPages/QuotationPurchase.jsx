import React, { useState } from 'react';
import { Plus, Trash2, Save, Loader, AlertCircle, CheckCircle, ArrowLeft, FileText, Hash, DollarSign, Package } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const QuotationPurchase = () => {
  const [quotation, setQuotation] = useState({
    no: '',
    date: new Date().toISOString().split('T')[0],
    jobCode: '',
    vendorId: 0,
    description: '',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    items: []
  });

  const [newItem, setNewItem] = useState({
    itemId: 0,
    unitId: 0,
    cost: 0,
    taxCode: '',
    taxIncluded: true,
    vatAmount: 0,
    total: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Calculate totals
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalVATAmount = items.reduce((sum, item) => sum + (item.vatAmount || 0), 0);
    const discountAmount = (subtotal * quotation.discount) / 100;
    const netAmount = subtotal - discountAmount;
    const grandTotal = netAmount + totalVATAmount;

    return { subtotal, totalVATAmount, netAmount, grandTotal };
  };

  // Update quotation field
  const updateQuotation = (field, value) => {
    setQuotation(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'discount') {
        const totals = calculateTotals(updated.items);
        return { ...updated, ...totals };
      }
      return updated;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Add new item
  const addItem = () => {
    if (newItem.itemId && newItem.cost > 0) {
      const vatAmount = newItem.taxIncluded ? (newItem.total * 0.15) : 0;
      const total = newItem.cost;
      
      const item = {
        ...newItem,
        id: Date.now(),
        total,
        vatAmount
      };

      const updatedItems = [...quotation.items, item];
      const totals = calculateTotals(updatedItems);

      setQuotation(prev => ({
        ...prev,
        items: updatedItems,
        ...totals
      }));

      setNewItem({
        itemId: 0,
        unitId: 0,
        cost: 0,
        taxCode: '',
        taxIncluded: true,
        vatAmount: 0,
        total: 0
      });
    }
  };

  // Remove item
  const removeItem = (itemId) => {
    const updatedItems = quotation.items.filter(item => item.id !== itemId);
    const totals = calculateTotals(updatedItems);

    setQuotation(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));
  };

  // Update item cost and recalculate
  const updateItem = (itemId, field, value) => {
    const updatedItems = quotation.items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: parseFloat(value) || 0 };
        updated.total = updated.cost;
        updated.vatAmount = updated.taxIncluded ? (updated.total * 0.15) : 0;
        return updated;
      }
      return item;
    });

    const totals = calculateTotals(updatedItems);
    setQuotation(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!quotation.no.trim()) {
      newErrors.no = 'Quotation number is required';
    }

    if (!quotation.vendorId || quotation.vendorId === 0) {
      newErrors.vendorId = 'Vendor ID is required';
    }

    if (quotation.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formattedData = {
      no: quotation.no,
      date: new Date(quotation.date).toISOString(),
      jobCode: quotation.jobCode,
      vendorId: quotation.vendorId,
      description: quotation.description,
      grandTotal: quotation.grandTotal,
      discount: quotation.discount,
      subtotal: quotation.subtotal,
      totalVATAmount: quotation.totalVATAmount,
      netAmount: quotation.netAmount,
      items: quotation.items.map(({ id, ...item }) => item)
    };
    
    console.log('Purchase Quotation Data:', formattedData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    console.log('Navigation cancelled');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
        <Sidebar/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotations
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Purchase Quotation
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Create and manage purchase quotations</p>
          </div>
        </div>

        {/* Header Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-500" />
              Quotation Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-teal-500" />
                  Quotation No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quotation.no}
                  onChange={(e) => updateQuotation('no', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                    errors.no ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="PQ-2025-001"
                />
                {errors.no && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.no}
                  </p>
                )}
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={quotation.date}
                  onChange={(e) => updateQuotation('date', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Job Code
                </label>
                <input
                  type="text"
                  value={quotation.jobCode}
                  onChange={(e) => updateQuotation('jobCode', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                  placeholder="JOB-001"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Vendor ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quotation.vendorId}
                  onChange={(e) => updateQuotation('vendorId', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                    errors.vendorId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="123"
                />
                {errors.vendorId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.vendorId}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Description
              </label>
              <textarea
                value={quotation.description}
                onChange={(e) => updateQuotation('description', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                placeholder="Enter quotation description..."
              />
            </div>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-teal-500" />
              Add Item
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
                <input
                  type="number"
                  value={newItem.itemId}
                  onChange={(e) => setNewItem({...newItem, itemId: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit ID</label>
                <input
                  type="number"
                  value={newItem.unitId}
                  onChange={(e) => setNewItem({...newItem, unitId: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value) || 0, total: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
                <input
                  type="text"
                  value={newItem.taxCode}
                  onChange={(e) => setNewItem({...newItem, taxCode: e.target.value})}
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="VAT15"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full bg-[#f29f67] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newItem.taxIncluded}
                onChange={(e) => setNewItem({...newItem, taxIncluded: e.target.checked})}
                className="mr-2 w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 font-medium">Tax Included</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        {quotation.items.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900">Purchase Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tax Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tax Incl.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">VAT</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotation.items.map((item) => (
                    <tr key={item.id} className="hover:bg-teal-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.itemId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.unitId}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.01"
                          value={item.cost}
                          onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                          className="w-28 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.taxCode}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.taxIncluded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {item.taxIncluded ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.vatAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {errors.items && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.items}
            </p>
          </div>
        )}

        {/* Totals Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-500" />
              Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Discount (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={quotation.discount}
                  onChange={(e) => updateQuotation('discount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Subtotal:</span>
                      <span className="font-semibold text-gray-900">{quotation.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Discount:</span>
                      <span className="font-semibold text-red-600">-{((quotation.subtotal * quotation.discount) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Net Amount:</span>
                      <span className="font-semibold text-gray-900">{quotation.netAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Total VAT:</span>
                      <span className="font-semibold text-gray-900">{quotation.totalVATAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-teal-900 pt-3 border-t-2 border-teal-200">
                      <span>Grand Total:</span>
                      <span>{quotation.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !quotation.no.trim() || !quotation.vendorId}
                className="inline-flex items-center justify-center px-8 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    Save Quotation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">Purchase quotation has been saved successfully.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotationPurchase;