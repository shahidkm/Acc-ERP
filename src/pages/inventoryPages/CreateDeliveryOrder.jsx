import React, { useState } from 'react';
import { Plus, Save, X, Calculator, Truck, FileText, User, Calendar, Package } from 'lucide-react';

import { useCreateDeliveryOrder } from '../../hooks/inventoryHooks/useCreateInventoryGroup';
import Sidebar from "../../components/sidebar/Sidebar";
const CreateDeliveryOrder = ({ onClose, onSuccess }) => {
  const { mutate: createDeliveryOrder, isLoading, isError, error } = useCreateDeliveryOrder();

  const [formData, setFormData] = useState({
    referenseNo: 0, // Note: keeping the typo from API
    date: new Date().toISOString().split('T')[0], // Format for date input
    customerId: '',
    salesManId: '',
    documentType: '',
    documentId: '',
    description: '',
    terms: '',
    day: '',
    jobCode: '',
    purchaseOrderId: '',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    deleveryOrderItems: [] // Note: keeping the typo from API
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

  const documentTypes = [
    'Sales Order',
    'Purchase Order',
    'Invoice',
    'Quotation',
    'Return Order',
    'Transfer Order',
    'Custom Order'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = 'Customer ID is required';
    if (!formData.salesManId) newErrors.salesManId = 'Salesman ID is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.documentType) newErrors.documentType = 'Document type is required';
    if (formData.deleveryOrderItems.length === 0) newErrors.items = 'At least one item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total when cost or vatAmount changes
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
      deleveryOrderItems: [...prev.deleveryOrderItems, newItem]
    }));

    // Reset current item
    setCurrentItem({
      itemId: '',
      unitId: '',
      cost: '',
      taxCode: '',
      taxIncluded: false,
      vatAmount: '',
      total: ''
    });

    // Recalculate totals
    calculateTotals([...formData.deleveryOrderItems, newItem]);
  };

  const removeItem = (index) => {
    const updatedItems = formData.deleveryOrderItems.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      deleveryOrderItems: updatedItems
    }));
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items = formData.deleveryOrderItems) => {
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
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const apiData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      referenseNo: parseInt(formData.referenseNo) || 0,
      customerId: parseInt(formData.customerId),
      salesManId: parseInt(formData.salesManId),
      documentId: parseInt(formData.documentId) || 0,
      jobCode: parseInt(formData.jobCode) || 0,
      purchaseOrderId: parseInt(formData.purchaseOrderId) || 0,
      discount: parseFloat(formData.discount) || 0
    };

    createDeliveryOrder(apiData, {
      onSuccess: (data) => {
        console.log('Delivery order created successfully:', data);
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      },
      onError: (error) => {
        console.error('Error creating delivery order:', error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 p-6">
        <Sidebar/>
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Truck className="w-6 h-6 mr-3" />
                Create Delivery Order
              </h2>
              <p className="text-orange-100 mt-1">Fill in the details to create a new delivery order</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800">
                <h3 className="font-medium">Error creating delivery order</h3>
                <p className="text-sm mt-1">{error?.message || 'An error occurred'}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference No.
              </label>
              <input
                type="number"
                value={formData.referenseNo}
                onChange={(e) => handleInputChange('referenseNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Auto-generated if 0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.customerId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer ID"
              />
              {errors.customerId && <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salesman ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.salesManId}
                onChange={(e) => handleInputChange('salesManId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.salesManId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter salesman ID"
              />
              {errors.salesManId && <p className="text-red-500 text-sm mt-1">{errors.salesManId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.documentType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Document Type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.documentType && <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document ID
              </label>
              <input
                type="number"
                value={formData.documentId}
                onChange={(e) => handleInputChange('documentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order ID
              </label>
              <input
                type="number"
                value={formData.purchaseOrderId}
                onChange={(e) => handleInputChange('purchaseOrderId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Code
              </label>
              <input
                type="number"
                value={formData.jobCode}
                onChange={(e) => handleInputChange('jobCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter job code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <input
                type="text"
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter day information"
              />
            </div>
          </div>

          {/* Description and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter delivery order description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter terms and conditions for delivery"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Pricing Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  setTimeout(() => calculateTotals(), 100); // Recalculate after state update
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Delivery Order Items
            </h3>

            {/* Add Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={currentItem.itemId}
                    onChange={(e) => handleItemChange('itemId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Item ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit ID
                  </label>
                  <input
                    type="number"
                    value={currentItem.unitId}
                    onChange={(e) => handleItemChange('unitId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Unit ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.cost}
                    onChange={(e) => handleItemChange('cost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Code
                  </label>
                  <input
                    type="text"
                    value={currentItem.taxCode}
                    onChange={(e) => handleItemChange('taxCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tax Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.vatAmount}
                    onChange={(e) => handleItemChange('vatAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={currentItem.total}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Auto-calculated"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="taxIncluded"
                      checked={currentItem.taxIncluded}
                      onChange={(e) => handleItemChange('taxIncluded', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="taxIncluded" className="ml-2 block text-xs text-gray-700">
                      Tax Inc.
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {formData.deleveryOrderItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Inc.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VAT</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.deleveryOrderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.itemId}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.unitId}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.cost.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.taxCode}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.taxIncluded ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.taxIncluded ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.vatAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-900"
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

            {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items}</p>}
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-lg font-semibold">${formData.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Discount</p>
                <p className="text-lg font-semibold text-red-600">-${((formData.subtotal * formData.discount) / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Amount</p>
                <p className="text-lg font-semibold">${formData.netAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total VAT</p>
                <p className="text-lg font-semibold">${formData.totalVATAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grand Total</p>
                <p className="text-xl font-bold text-orange-600">${formData.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Delivery Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryOrder;