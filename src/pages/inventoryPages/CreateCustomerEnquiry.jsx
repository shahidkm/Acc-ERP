import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  Loader2,
  ArrowLeft,
  Info,
  Plus,
  Trash2,
  Copy,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  FileText,
  ChevronDown
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
function CreateCustomerEnquiry() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Mock data - replace with actual API calls
  const [customers] = useState([
    { id: 1, name: 'Ahmed Trading Co.' },
    { id: 5, name: 'Global Enterprises' },
    { id: 8, name: 'Tech Solutions Ltd' }
  ]);

  const [salesmen] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Sarah Smith' },
    { id: 3, name: 'Mike Johnson' }
  ]);

  const [items] = useState([
    { id: 10, name: 'Product A', unitId: 1 },
    { id: 15, name: 'Product B', unitId: 2 },
    { id: 22, name: 'Consulting Services', unitId: 3 }
  ]);

  const [taxCodes] = useState([
    { code: 'VAT5', rate: 5 },
    { code: 'VAT10', rate: 10 },
    { code: 'VAT0', rate: 0 }
  ]);

  const [formData, setFormData] = useState({
    referenceNo: `CE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    customerId: 0,
    salesManId: 0,
    description: '',
    terms: 'Net 30',
    foreignCurrency: false,
    currency: 'AED',
    currencyRate: '1',
    discount: 0
  });

  const [enquiryItems, setEnquiryItems] = useState([
    {
      id: 1,
      itemId: 0,
      quantity: 1,
      unitId: 0,
      cost: 0,
      taxCode: 'VAT5',
      taxIncluded: true,
      vatAmount: 0,
      total: 0
    }
  ]);

  // Calculate totals
  const totals = useMemo(() => {
    let subtotal = 0;
    let totalVATAmount = 0;

    enquiryItems.forEach(item => {
      if (item.itemId && item.itemId > 0) {
        const itemSubtotal = item.cost * item.quantity;
        subtotal += itemSubtotal;
        totalVATAmount += item.vatAmount;
      }
    });

    const grandTotal = subtotal + totalVATAmount;
    const netAmount = grandTotal - parseFloat(formData.discount || 0);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalVATAmount: Math.round(totalVATAmount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      discount: parseFloat(formData.discount || 0),
      netAmount: Math.round(netAmount * 100) / 100
    };
  }, [enquiryItems, formData.discount]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setEnquiryItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'quantity' || field === 'cost' || field === 'vatAmount'
                ? parseFloat(value) || 0
                : field === 'itemId' || field === 'unitId'
                ? parseInt(value) || 0
                : value
            }
          : item
      )
    );
  };

  const calculateItemTotal = (item) => {
    const itemSubtotal = item.cost * item.quantity;
    if (item.taxIncluded) {
      return Math.round((itemSubtotal + item.vatAmount) * 100) / 100;
    }
    return Math.round((itemSubtotal + item.vatAmount) * 100) / 100;
  };

  const calculateVAT = (item) => {
    const selectedTax = taxCodes.find(t => t.code === item.taxCode);
    const rate = selectedTax ? selectedTax.rate : 0;
    const itemSubtotal = item.cost * item.quantity;
    return Math.round((itemSubtotal * rate) / 100 * 100) / 100;
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      itemId: 0,
      quantity: 1,
      unitId: 0,
      cost: 0,
      taxCode: 'VAT5',
      taxIncluded: true,
      vatAmount: 0,
      total: 0
    };
    setEnquiryItems(prev => [...prev, newItem]);
  };

  const duplicateItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now()
    };
    setEnquiryItems(prev => [...prev, newItem]);
  };

  const removeItem = (id) => {
    if (enquiryItems.length > 1) {
      setEnquiryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateItemVAT = (id) => {
    setEnquiryItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, vatAmount: calculateVAT(item) }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.customerId || formData.customerId === 0) {
      setError('Please select a customer');
      return;
    }

    if (enquiryItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    const invalidItems = enquiryItems.filter(item => !item.itemId || item.itemId === 0 || item.cost <= 0);
    if (invalidItems.length > 0) {
      setError('All items must have a product and cost');
      return;
    }

    setIsLoading(true);

    try {
      const enquiryData = {
        referenceNo: formData.referenceNo,
        date: new Date(formData.date).toISOString(),
        customerId: parseInt(formData.customerId),
        salesManId: parseInt(formData.salesManId) || 0,
        description: formData.description,
        terms: formData.terms,
        foreignCurrency: formData.foreignCurrency,
        currency: formData.currency,
        currencyRate: formData.currencyRate,
        discount: parseFloat(formData.discount) || 0,
        subtotal: totals.subtotal,
        totalVATAmount: totals.totalVATAmount,
        grandTotal: totals.grandTotal,
        netAmount: totals.netAmount,
        customerEnquiryItems: enquiryItems.map(item => ({
          itemId: parseInt(item.itemId),
          unitId: parseInt(item.unitId),
          quantity: parseFloat(item.quantity),
          cost: parseFloat(item.cost),
          taxCode: item.taxCode,
          taxIncluded: item.taxIncluded,
          vatAmount: parseFloat(item.vatAmount),
          total: calculateItemTotal(item)
        }))
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Customer Enquiry created:', enquiryData);
      setIsSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          referenceNo: `CE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          date: new Date().toISOString().split('T')[0],
          customerId: 0,
          salesManId: 0,
          description: '',
          terms: 'Net 30',
          foreignCurrency: false,
          currency: 'AED',
          currencyRate: '1',
          discount: 0
        });
        setEnquiryItems([{
          id: 1,
          itemId: 0,
          quantity: 1,
          unitId: 0,
          cost: 0,
          taxCode: 'VAT5',
          taxIncluded: true,
          vatAmount: 0,
          total: 0
        }]);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create enquiry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
        <Sidebar/>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <button className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Enquiries
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create Customer Enquiry</h1>
              <p className="text-gray-500">Add a new customer enquiry with items and quotation details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">Customer enquiry created successfully</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Enquiry Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference No. <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleFormChange}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value={0}>Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salesman</label>
                <div className="relative">
                  <select
                    name="salesManId"
                    value={formData.salesManId}
                    onChange={handleFormChange}
                    className="w-full px-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value={0}>Select Salesman</option>
                    {salesmen.map(salesman => (
                      <option key={salesman.id} value={salesman.id}>
                        {salesman.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms</label>
                <input
                  type="text"
                  name="terms"
                  value={formData.terms}
                  onChange={handleFormChange}
                  placeholder="e.g., Net 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="foreignCurrency"
                    checked={formData.foreignCurrency}
                    onChange={handleFormChange}
                    className="rounded border-gray-300"
                  />
                  Foreign Currency
                </label>
              </div>

              {formData.foreignCurrency && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency Rate</label>
                    <input
                      type="number"
                      name="currencyRate"
                      value={formData.currencyRate}
                      onChange={handleFormChange}
                      placeholder="1.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Enquiry Items</h3>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Qty</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Cost</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Tax Code</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Tax Inc</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">VAT Amount</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Total</th>
                    <th className="text-center py-3 px-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiryItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={item.itemId}
                            onChange={(e) => handleItemChange(item.id, 'itemId', e.target.value)}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                          >
                            <option value={0}>Select Product</option>
                            {items.map(prod => (
                              <option key={prod.id} value={prod.id}>
                                {prod.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          min="1"
                          step="0.01"
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleItemChange(item.id, 'cost', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={item.taxCode}
                            onChange={(e) => {
                              handleItemChange(item.id, 'taxCode', e.target.value);
                              setTimeout(() => updateItemVAT(item.id), 0);
                            }}
                            className="w-20 px-1 py-1 pr-6 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white text-sm"
                          >
                            {taxCodes.map(tax => (
                              <option key={tax.code} value={tax.code}>
                                {tax.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={item.taxIncluded}
                          onChange={(e) => handleItemChange(item.id, 'taxIncluded', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={item.vatAmount}
                          onChange={(e) => handleItemChange(item.id, 'vatAmount', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-900">
                        {calculateItemTotal(item).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => duplicateItem(item)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          {enquiryItems.length > 1 && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                <p className="text-lg font-semibold text-gray-900">{totals.subtotal.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total VAT</p>
                <p className="text-lg font-semibold text-gray-900">{totals.totalVATAmount.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Discount</p>
                <p className="text-lg font-semibold text-gray-900">-{totals.discount.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Grand Total</p>
                <p className="text-lg font-semibold text-gray-900">{totals.grandTotal.toFixed(2)}</p>
              </div>
              <div className="text-center border-l-2 border-gray-300 pl-4">
                <p className="text-sm text-gray-600 mb-1">Net Amount</p>
                <p className="text-xl font-bold text-blue-600">{totals.netAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    isLoading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Enquiry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCustomerEnquiry;