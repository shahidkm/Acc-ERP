import React, { useState } from 'react';
import { Plus, Trash2, Save, Calendar, DollarSign } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
const QuotationRental = () => {
  const [quotation, setQuotation] = useState({
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
    quotationRentalItems: []
  });

  const [newItem, setNewItem] = useState({
    productId: 0,
    itemId: 0,
    unitId: 0,
    quantity: 1,
    rentalDays: 1,
    dailyRate: 0,
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
        const totals = calculateTotals(updated.quotationRentalItems);
        return { ...updated, ...totals };
      }
      return updated;
    });
  };

  // Calculate item cost based on daily rate and rental days
  const calculateItemCost = (dailyRate, rentalDays, quantity = 1) => {
    return dailyRate * rentalDays * quantity;
  };

  // Add new rental item
  const addItem = () => {
    if (newItem.productId && newItem.dailyRate > 0 && newItem.rentalDays > 0) {
      const cost = calculateItemCost(newItem.dailyRate, newItem.rentalDays, newItem.quantity);
      const vatAmount = newItem.taxIncluded ? (cost * 0.15) : 0; // 15% VAT example
      
      const item = {
        productId: newItem.productId,
        itemId: newItem.itemId,
        unitId: newItem.unitId,
        cost,
        taxCode: newItem.taxCode,
        taxIncluded: newItem.taxIncluded,
        vatAmount,
        total: cost,
        // Additional fields for rental tracking (not in API but useful for UI)
        quantity: newItem.quantity,
        rentalDays: newItem.rentalDays,
        dailyRate: newItem.dailyRate,
        id: Date.now() // Temporary ID for React key
      };

      const updatedItems = [...quotation.quotationRentalItems, item];
      const totals = calculateTotals(updatedItems);

      setQuotation(prev => ({
        ...prev,
        quotationRentalItems: updatedItems,
        ...totals
      }));

      // Reset new item form
      setNewItem({
        productId: 0,
        itemId: 0,
        unitId: 0,
        quantity: 1,
        rentalDays: 1,
        dailyRate: 0,
        cost: 0,
        taxCode: '',
        taxIncluded: true,
        vatAmount: 0,
        total: 0
      });
    }
  };

  // Remove item
  const removeItem = (itemIndex) => {
    const updatedItems = quotation.quotationRentalItems.filter((_, index) => index !== itemIndex);
    const totals = calculateTotals(updatedItems);

    setQuotation(prev => ({
      ...prev,
      quotationRentalItems: updatedItems,
      ...totals
    }));
  };

  // Update item and recalculate
  const updateItem = (itemIndex, field, value) => {
    const updatedItems = quotation.quotationRentalItems.map((item, index) => {
      if (index === itemIndex) {
        const updated = { ...item, [field]: parseFloat(value) || 0 };
        
        // Recalculate cost if daily rate, rental days, or quantity changes
        if (field === 'dailyRate' || field === 'rentalDays' || field === 'quantity') {
          updated.cost = calculateItemCost(
            field === 'dailyRate' ? updated.dailyRate : item.dailyRate,
            field === 'rentalDays' ? updated.rentalDays : item.rentalDays,
            field === 'quantity' ? updated.quantity : item.quantity
          );
          updated.total = updated.cost;
          updated.vatAmount = updated.taxIncluded ? (updated.cost * 0.15) : 0;
        }
        
        return updated;
      }
      return item;
    });

    const totals = calculateTotals(updatedItems);
    setQuotation(prev => ({
      ...prev,
      quotationRentalItems: updatedItems,
      ...totals
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Clean the data to match API format (remove UI-only fields)
    const apiData = {
      ...quotation,
      quotationRentalItems: quotation.quotationRentalItems.map(item => ({
        productId: item.productId,
        itemId: item.itemId,
        unitId: item.unitId,
        cost: item.cost,
        taxCode: item.taxCode,
        taxIncluded: item.taxIncluded,
        vatAmount: item.vatAmount,
        total: item.total
      }))
    };
    
    console.log('Rental Quotation Data:', apiData);
    alert('Rental Quotation saved! Check console for data.');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
          <Sidebar/>
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="w-8 h-8 mr-3" />
          Rental Quotation
        </h1>
        <p className="text-purple-100 mt-2">Create and manage rental quotations</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={quotation.date}
              onChange={(e) => updateQuotation('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
            <input
              type="number"
              value={quotation.customerId}
              onChange={(e) => updateQuotation('customerId', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salesman ID</label>
            <input
              type="number"
              value={quotation.salesManId}
              onChange={(e) => updateQuotation('salesManId', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={quotation.currencyRate}
                  onChange={(e) => updateQuotation('currencyRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              rows="4"
              placeholder="Describe the rental items and conditions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rental Terms</label>
            <textarea
              value={quotation.terms}
              onChange={(e) => updateQuotation('terms', e.target.value)}
              rows="4"
              placeholder="Rental terms, conditions, and policies..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Add Rental Item Section */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Add Rental Item
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input
                type="number"
                value={newItem.productId}
                onChange={(e) => setNewItem({...newItem, productId: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
              <input
                type="number"
                value={newItem.itemId}
                onChange={(e) => setNewItem({...newItem, itemId: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
              <input
                type="number"
                value={newItem.unitId}
                onChange={(e) => setNewItem({...newItem, unitId: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
              <input
                type="number"
                step="0.01"
                value={newItem.dailyRate}
                onChange={(e) => setNewItem({...newItem, dailyRate: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rental Days</label>
              <input
                type="number"
                min="1"
                value={newItem.rentalDays}
                onChange={(e) => setNewItem({...newItem, rentalDays: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={addItem}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Code</label>
              <input
                type="text"
                value={newItem.taxCode}
                onChange={(e) => setNewItem({...newItem, taxCode: e.target.value})}
                placeholder="e.g., VAT15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                checked={newItem.taxIncluded}
                onChange={(e) => setNewItem({...newItem, taxIncluded: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Tax Included</span>
              {newItem.dailyRate > 0 && newItem.rentalDays > 0 && (
                <span className="ml-4 text-sm text-purple-600 font-medium">
                  Total Cost: {calculateItemCost(newItem.dailyRate, newItem.rentalDays, newItem.quantity).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rental Items Table */}
        {quotation.quotationRentalItems.length > 0 && (
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-purple-100 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-purple-800">Rental Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">VAT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotation.quotationRentalItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.productId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.itemId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.unitId}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.dailyRate}
                          onChange={(e) => updateItem(index, 'dailyRate', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="1"
                          value={item.rentalDays}
                          onChange={(e) => updateItem(index, 'rentalDays', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.taxCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.vatAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-700">{item.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
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
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={quotation.discount}
                onChange={(e) => updateQuotation('discount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">-{((quotation.subtotal * quotation.discount) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Net Amount:</span>
                <span className="font-medium">{quotation.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total VAT:</span>
                <span className="font-medium">{quotation.totalVATAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-purple-800 pt-2 border-t border-purple-200">
                <span>Grand Total:</span>
                <span>{quotation.grandTotal.toFixed(2)} {quotation.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Rental Quotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationRental;