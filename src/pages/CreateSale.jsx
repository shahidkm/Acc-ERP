import React, { useState } from 'react';
import { Plus, Trash2, ShoppingCart, Calendar, User, FileText, Package, DollarSign, Hash } from 'lucide-react';

// Mock hook - replace with your actual useCreateSaleHook
const useCreateSaleHook = () => {
  const [loading, setLoading] = useState(false);
  
  const createSale = async (saleData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Sale created:', saleData);
    setLoading(false);
    return { success: true, id: Math.floor(Math.random() * 1000) };
  };

  return { createSale, loading };
};

const CreateSale = () => {
  const { createSale, loading } = useCreateSaleHook();
  
  const [formData, setFormData] = useState({
    customerId: 0,
    orderDate: new Date().toISOString().slice(0, 16),
    note: '',
    items: [
      {
        productId: 0,
        quantity: 1,
        unitPrice: 0
      }
    ]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: 0, quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async () => {
    
    const saleData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      orderDate: new Date(formData.orderDate).toISOString(),
      items: formData.items.map(item => ({
        ...item,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      }))
    };

    try {
      const result = await createSale(saleData);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Reset form
        setFormData({
          customerId: 0,
          orderDate: new Date().toISOString().slice(0, 16),
          note: '',
          items: [{ productId: 0, quantity: 1, unitPrice: 0 }]
        });
      }
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          ✅ Sale created successfully!
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f29f67' }}>
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Sale</h1>
          <p className="text-gray-600">Add customer details and purchase items</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Customer & Order Info Section */}
          <div className="p-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #f29f67 0%, #1e1e2c 100%)' }}>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer & Order Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Customer ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    placeholder="Enter customer ID"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Order Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="datetime-local"
                    value={formData.orderDate}
                    onChange={(e) => handleInputChange('orderDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Package className="w-5 h-5 mr-2 text-[#f29f67]" />
                Purchase Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: '#f29f67' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border-l-4" style={{ borderLeftColor: '#f29f67' }}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Product ID
                      </label>
                      <input
                        type="number"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ '--tw-ring-color': '#f29f67' }}
                        placeholder="Product ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ '--tw-ring-color': '#f29f67' }}
                        placeholder="Qty"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Unit Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ '--tw-ring-color': '#f29f67' }}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Subtotal
                        </label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                          ${(item.quantity * item.unitPrice || 0).toFixed(2)}
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 p-4 rounded-xl text-right" style={{ backgroundColor: '#1e1e2c' }}>
              <div className="flex items-center justify-end text-white">
                <DollarSign className="w-6 h-6 mr-2" />
                <span className="text-lg font-medium mr-2">Total:</span>
                <span className="text-2xl font-bold" style={{ color: '#f29f67' }}>
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#f29f67]" />
              Additional Notes
            </h2>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
              style={{ '--tw-ring-color': '#f29f67' }}
              rows="4"
              placeholder="Add any additional notes or special instructions..."
            />
          </div>

          {/* Submit Button */}
          <div className="p-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                background: loading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #f29f67 0%, #1e1e2c 100%)'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Creating Sale...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Create Sale
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;