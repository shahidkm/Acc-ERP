import React, { useState } from 'react';
import { Plus, Trash2, ShoppingCart, Calendar, User, Package, DollarSign, Save } from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';

// Mock hook - replace with your actual useCreatePurchaseHook
const useCreatePurchaseHook = () => {
  const [loading, setLoading] = useState(false);
  
  const createPurchase = async (data) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Purchase data:', data);
    setLoading(false);
    return { success: true, id: Math.random() };
  };
  
  return { createPurchase, loading };
};

export default function CreatePurchase() {
  const { createPurchase, loading } = useCreatePurchaseHook();
  
  const [formData, setFormData] = useState({
    vendorId: '',
    orderDate: new Date().toISOString().slice(0, 16),
    purchaseOrderNumber: '',
    deliveryDate: '',
    notes: '',
    paymentTerms: '',
    shippingAddress: '',
    items: [
      {
        productId: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});

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

  const handleItemChange = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        quantity: 1,
        unitPrice: 0,
        description: ''
      }]
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
    return formData.items.reduce((total, item) => 
      total + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0
    ).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vendorId) newErrors.vendorId = 'Vendor ID is required';
    if (!formData.orderDate) newErrors.orderDate = 'Order date is required';
    if (!formData.purchaseOrderNumber) newErrors.purchaseOrderNumber = 'PO Number is required';
    
    formData.items.forEach((item, index) => {
      if (!item.productId) newErrors[`item_${index}_productId`] = 'Product ID is required';
      if (!item.quantity || item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Valid quantity is required';
      if (!item.unitPrice || item.unitPrice < 0) newErrors[`item_${index}_unitPrice`] = 'Valid price is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const purchaseData = {
      vendorId: parseInt(formData.vendorId),
      orderDate: formData.orderDate,
      purchaseOrderNumber: formData.purchaseOrderNumber,
      deliveryDate: formData.deliveryDate || null,
      notes: formData.notes,
      paymentTerms: formData.paymentTerms,
      shippingAddress: formData.shippingAddress,
      items: formData.items.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        description: item.description
      }))
    };
    
    try {
      const result = await createPurchase(purchaseData);
      if (result.success) {
        alert('Purchase created successfully!');
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Failed to create purchase. Please try again.');
    }
  };

  return (
    <div className="flex flex-cols items-start justify-start min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8 ">
      <Sidebar/>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8">
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{backgroundColor: '#f29f67', opacity: 0.2}}>
                <ShoppingCart className="w-8 h-8" style={{color: '#f29f67'}} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Create Purchase Order</h1>
                <p className="text-slate-600 mt-1">Fill in the details to create a new purchase order</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Purchase Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200" style={{background: `linear-gradient(to right, #f29f67, #1e1e2c)`, opacity: 0.1}}>
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" style={{color: '#f29f67'}} />
                <h2 className="text-xl font-semibold text-slate-800">Purchase Information</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Vendor ID *
                  </label>
                  <input
                    type="number"
                    value={formData.vendorId}
                    onChange={(e) => handleInputChange('vendorId', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      errors.vendorId 
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-300 bg-white'
                    } focus:ring-2 focus:ring-opacity-50`}
                    style={!errors.vendorId ? {
                      '--tw-ring-color': '#f29f67',
                      borderColor: '#f29f67'
                    } : {}}
                    onFocus={(e) => {
                      if (!errors.vendorId) {
                        e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                        e.target.style.borderColor = '#f29f67';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    placeholder="Enter vendor ID"
                  />
                  {errors.vendorId && <p className="text-red-500 text-sm">{errors.vendorId}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.orderDate}
                    onChange={(e) => handleInputChange('orderDate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      errors.orderDate 
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-300 bg-white'
                    } focus:ring-2 focus:ring-opacity-50`}
                    onFocus={(e) => {
                      if (!errors.orderDate) {
                        e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                        e.target.style.borderColor = '#f29f67';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                  />
                  {errors.orderDate && <p className="text-red-500 text-sm">{errors.orderDate}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    PO Number *
                  </label>
                  <input
                    type="text"
                    value={formData.purchaseOrderNumber}
                    onChange={(e) => handleInputChange('purchaseOrderNumber', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      errors.purchaseOrderNumber 
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-300 bg-white'
                    } focus:ring-2 focus:ring-opacity-50`}
                    onFocus={(e) => {
                      if (!errors.purchaseOrderNumber) {
                        e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                        e.target.style.borderColor = '#f29f67';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    placeholder="PO-2024-001"
                  />
                  {errors.purchaseOrderNumber && <p className="text-red-500 text-sm">{errors.purchaseOrderNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                      e.target.style.borderColor = '#f29f67';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                      e.target.style.borderColor = '#f29f67';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                  >
                    <option value="">Select payment terms</option>
                    <option value="NET_30">NET 30</option>
                    <option value="NET_60">NET 60</option>
                    <option value="COD">Cash on Delivery</option>
                    <option value="ADVANCE">Advance Payment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Shipping Address</label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-none"
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                      e.target.style.borderColor = '#f29f67';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    rows="3"
                    placeholder="Enter delivery address..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-none"
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                      e.target.style.borderColor = '#f29f67';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200" style={{background: `linear-gradient(to right, #1e1e2c, #f29f67)`, opacity: 0.1}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6" style={{color: '#1e1e2c'}} />
                  <h2 className="text-xl font-semibold text-slate-800">Order Items</h2>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(30, 30, 44, 0.1)',
                    color: '#1e1e2c'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(30, 30, 44, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(30, 30, 44, 0.1)';
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-800">Item {index + 1}</h3>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Product ID *</label>
                        <input
                          type="number"
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                            errors[`item_${index}_productId`]
                              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                              : 'border-slate-300 bg-white'
                          } focus:ring-2 focus:ring-opacity-50`}
                          onFocus={(e) => {
                            if (!errors[`item_${index}_productId`]) {
                              e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                              e.target.style.borderColor = '#f29f67';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                            e.target.style.borderColor = '#cbd5e1';
                          }}
                          placeholder="Product ID"
                        />
                        {errors[`item_${index}_productId`] && (
                          <p className="text-red-500 text-sm">{errors[`item_${index}_productId`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Quantity *</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                            errors[`item_${index}_quantity`]
                              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                              : 'border-slate-300 bg-white'
                          } focus:ring-2 focus:ring-opacity-50`}
                          onFocus={(e) => {
                            if (!errors[`item_${index}_quantity`]) {
                              e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                              e.target.style.borderColor = '#f29f67';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                            e.target.style.borderColor = '#cbd5e1';
                          }}
                          placeholder="1"
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-red-500 text-sm">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Unit Price *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                            errors[`item_${index}_unitPrice`]
                              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                              : 'border-slate-300 bg-white'
                          } focus:ring-2 focus:ring-opacity-50`}
                          onFocus={(e) => {
                            if (!errors[`item_${index}_unitPrice`]) {
                              e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                              e.target.style.borderColor = '#f29f67';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                            e.target.style.borderColor = '#cbd5e1';
                          }}
                          placeholder="0.00"
                        />
                        {errors[`item_${index}_unitPrice`] && (
                          <p className="text-red-500 text-sm">{errors[`item_${index}_unitPrice`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Total</label>
                        <div className="px-3 py-2 rounded-lg border border-slate-200 font-medium" style={{
                          backgroundColor: 'rgba(242, 159, 103, 0.1)',
                          color: '#1e1e2c'
                        }}>
                          ${(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-slate-700">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-opacity-50 transition-all duration-200 mt-1"
                        onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 2px rgba(242, 159, 103, 0.2)`;
                          e.target.style.borderColor = '#f29f67';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                        placeholder="Item description..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center p-6 rounded-xl" style={{
                  background: `linear-gradient(to right, rgba(242, 159, 103, 0.1), rgba(30, 30, 44, 0.1))`
                }}>
                  <span className="text-xl font-semibold text-slate-800">Total Amount:</span>
                  <span className="text-2xl font-bold" style={{color: '#f29f67'}}>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100 text-white"
              style={{
                background: loading 
                  ? 'linear-gradient(to right, #94a3b8, #64748b)' 
                  : `linear-gradient(to right, #f29f67, #1e1e2c)`
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = `linear-gradient(to right, #e08a4f, #0f0f17)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = `linear-gradient(to right, #f29f67, #1e1e2c)`;
                }
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Purchase...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Purchase Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}