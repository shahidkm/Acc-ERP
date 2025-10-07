import React, { useState } from 'react';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const QuotationSale = () => {
  const [quotation, setQuotation] = useState({
    id: 0,
    referenceNo: 0,
    date: new Date().toISOString().split('T')[0],
    customerId: 0,
    salesManId: 0,
    description: '',
    terms: '',
    foreignCurrency: false,
    currency: 'USD',
    currencyRate: '1.00',
    grandTotal: 0,
    discount: 0,
    subtotal: 0,
    totalVATAmount: 0,
    netAmount: 0,
    quotationSalesItems: []
  });

  const [newItem, setNewItem] = useState({
    id: 0,
    quotationSalesId: 0,
    itemId: 0,
    unitId: 0,
    quantity: 1,
    cost: 0,
    taxCode: '',
    taxIncluded: true,
    vatAmount: 0,
    total: 0
  });

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
        const totals = calculateTotals(updated.quotationSalesItems);
        return { ...updated, ...totals };
      }
      return updated;
    });
  };

  // Add new item
  const addItem = () => {
    if (newItem.itemId && newItem.cost > 0) {
      const vatAmount = newItem.taxIncluded ? (newItem.total * 0.15) : 0; // 15% VAT example
      const total = newItem.quantity * newItem.cost;
      
      const item = {
        ...newItem,
        id: Date.now(),
        quotationSalesId: quotation.id,
        total,
        vatAmount
      };

      const updatedItems = [...quotation.quotationSalesItems, item];
      const totals = calculateTotals(updatedItems);

      setQuotation(prev => ({
        ...prev,
        quotationSalesItems: updatedItems,
        ...totals
      }));

      // Reset new item form
      setNewItem({
        id: 0,
        quotationSalesId: 0,
        itemId: 0,
        unitId: 0,
        quantity: 1,
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
    const updatedItems = quotation.quotationSalesItems.filter(item => item.id !== itemId);
    const totals = calculateTotals(updatedItems);

    setQuotation(prev => ({
      ...prev,
      quotationSalesItems: updatedItems,
      ...totals
    }));
  };

  // Update item quantity/cost and recalculate
  const updateItem = (itemId, field, value) => {
    const updatedItems = quotation.quotationSalesItems.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: parseFloat(value) || 0 };
        updated.total = updated.quantity * updated.cost;
        updated.vatAmount = updated.taxIncluded ? (updated.total * 0.15) : 0;
        return updated;
      }
      return item;
    });

    const totals = calculateTotals(updatedItems);
    setQuotation(prev => ({
      ...prev,
      quotationSalesItems: updatedItems,
      ...totals
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quotation Data:', quotation);
    alert('Quotation saved! Check console for data.');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
        <Sidebar/>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Sales Quotation</h1>
        <p className="text-blue-100 mt-2">Create and manage sales quotations</p>
      </div>

      <div className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference No.</label>
            <input
              type="number"
              value={quotation.referenceNo}
              onChange={(e) => updateQuotation('referenceNo', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={quotation.date}
              onChange={(e) => updateQuotation('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
            <input
              type="number"
              value={quotation.customerId}
              onChange={(e) => updateQuotation('customerId', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salesman ID</label>
            <input
              type="number"
              value={quotation.salesManId}
              onChange={(e) => updateQuotation('salesManId', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quotation.foreignCurrency}
                onChange={(e) => updateQuotation('foreignCurrency', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Foreign Currency</span>
            </label>
          </div>

          {quotation.foreignCurrency && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={quotation.currency}
                  onChange={(e) => updateQuotation('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={quotation.currencyRate}
                  onChange={(e) => updateQuotation('currencyRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Description and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={quotation.description}
              onChange={(e) => updateQuotation('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms</label>
            <textarea
              value={quotation.terms}
              onChange={(e) => updateQuotation('terms', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Add Item Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
              <input
                type="number"
                value={newItem.itemId}
                onChange={(e) => setNewItem({...newItem, itemId: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
              <input
                type="number"
                value={newItem.unitId}
                onChange={(e) => setNewItem({...newItem, unitId: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                step="0.01"
                value={newItem.cost}
                onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Code</label>
              <input
                type="text"
                value={newItem.taxCode}
                onChange={(e) => setNewItem({...newItem, taxCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={addItem}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
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
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Tax Included</span>
          </div>
        </div>

        {/* Items Table */}
        {quotation.quotationSalesItems.length > 0 && (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Quotation Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">VAT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotation.quotationSalesItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.itemId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.unitId}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity || 1}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.cost}
                          onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.taxCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.vatAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
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

        {/* Totals Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                step="0.01"
                value={quotation.discount}
                onChange={(e) => updateQuotation('discount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">-{((quotation.subtotal * quotation.discount) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Net Amount:</span>
                <span className="font-medium">{quotation.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total VAT:</span>
                <span className="font-medium">{quotation.totalVATAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-800 pt-2 border-t border-blue-200">
                <span>Grand Total:</span>
                <span>{quotation.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationSale;