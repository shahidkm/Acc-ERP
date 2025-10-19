import React, { useState } from 'react';
import { Plus, Trash2, Save, Package, ArrowLeftRight } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
import { useCreateAccountCategory } from '../../hooks/accountHooks/accountHooks';

const StockTransfer = () => {
  const { mutate, isPending, isSuccess, isError, error } = useCreateAccountCategory();

  const [transfer, setTransfer] = useState({
    voucherNo: '',
    transferType: 0,
    referenceNo: '',
    transferDate: new Date().toISOString().split('T')[0],
    debitAccount: '',
    creditAccount: '',
    description: '',
    details: []
  });

  const [newDetail, setNewDetail] = useState({
    id: 0,
    itemCode: '',
    itemDescription: '',
    unit: '',
    quantity: 0,
    costPerUnit: 0
  });

  // Calculate total for a detail item
  const calculateDetailTotal = (quantity, costPerUnit) => {
    return quantity * costPerUnit;
  };

  // Calculate grand total
  const calculateGrandTotal = (details) => {
    return details.reduce((sum, detail) => 
      sum + calculateDetailTotal(detail.quantity, detail.costPerUnit), 0
    );
  };

  // Update transfer field
  const updateTransfer = (field, value) => {
    setTransfer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new detail item
  const addDetail = () => {
    if (newDetail.itemCode && newDetail.quantity > 0 && newDetail.costPerUnit > 0) {
      const detail = {
        ...newDetail,
        id: Date.now()
      };

      const updatedDetails = [...transfer.details, detail];

      setTransfer(prev => ({
        ...prev,
        details: updatedDetails
      }));

      // Reset new detail form
      setNewDetail({
        id: 0,
        itemCode: '',
        itemDescription: '',
        unit: '',
        quantity: 0,
        costPerUnit: 0
      });
    }
  };

  // Remove detail item
  const removeDetail = (detailId) => {
    const updatedDetails = transfer.details.filter(detail => detail.id !== detailId);
    setTransfer(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  // Update detail item
  const updateDetail = (detailId, field, value) => {
    const updatedDetails = transfer.details.map(detail => {
      if (detail.id === detailId) {
        return { ...detail, [field]: field === 'quantity' || field === 'costPerUnit' ? parseFloat(value) || 0 : value };
      }
      return detail;
    });

    setTransfer(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...transfer,
      transferType: parseInt(transfer.transferType),
      transferDate: new Date(transfer.transferDate).toISOString(),
      details: transfer.details.map(({ id, ...rest }) => rest) // Remove temporary id
    };

    mutate(submitData, {
      onSuccess: () => {
        console.log('Stock Transfer created successfully');
        // Reset form or navigate
        setTransfer({
          voucherNo: '',
          transferType: 0,
          referenceNo: '',
          transferDate: new Date().toISOString().split('T')[0],
          debitAccount: '',
          creditAccount: '',
          description: '',
          details: []
        });
      },
      onError: (err) => {
        console.error('Error creating stock transfer:', err);
      }
    });
  };

  const transferTypeOptions = [
    { value: 0, label: 'Internal Transfer' },
    { value: 1, label: 'Branch Transfer' },
    { value: 2, label: 'Warehouse Transfer' },
    { value: 3, label: 'Location Transfer' }
  ];

  const grandTotal = calculateGrandTotal(transfer.details);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar/>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Stock Transfer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Create and manage inventory stock transfers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-[#f29f67]" />
              Transfer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Voucher No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transfer.voucherNo}
                  onChange={(e) => updateTransfer('voucherNo', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  placeholder="Enter voucher number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Transfer Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={transfer.transferType}
                  onChange={(e) => updateTransfer('transferType', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                >
                  {transferTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Reference No.
                </label>
                <input
                  type="text"
                  value={transfer.referenceNo}
                  onChange={(e) => updateTransfer('referenceNo', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  placeholder="Reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Transfer Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={transfer.transferDate}
                  onChange={(e) => updateTransfer('transferDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Debit Account <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transfer.debitAccount}
                  onChange={(e) => updateTransfer('debitAccount', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  placeholder="Debit account"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Credit Account <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transfer.creditAccount}
                  onChange={(e) => updateTransfer('creditAccount', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                  placeholder="Credit account"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                value={transfer.description}
                onChange={(e) => updateTransfer('description', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                placeholder="Enter transfer description"
              />
            </div>
          </div>

          {/* Add Detail Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#f29f67]" />
              Add Item Detail
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Code</label>
                <input
                  type="text"
                  value={newDetail.itemCode}
                  onChange={(e) => setNewDetail({...newDetail, itemCode: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  placeholder="Code"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Description</label>
                <input
                  type="text"
                  value={newDetail.itemDescription}
                  onChange={(e) => setNewDetail({...newDetail, itemDescription: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  placeholder="Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  value={newDetail.unit}
                  onChange={(e) => setNewDetail({...newDetail, unit: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  placeholder="Unit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDetail.quantity}
                  onChange={(e) => setNewDetail({...newDetail, quantity: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost/Unit</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDetail.costPerUnit}
                  onChange={(e) => setNewDetail({...newDetail, costPerUnit: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={addDetail}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>

          {/* Details Table */}
          {transfer.details.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Transfer Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cost/Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transfer.details.map((detail) => (
                      <tr key={detail.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={detail.itemCode}
                            onChange={(e) => updateDetail(detail.id, 'itemCode', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={detail.itemDescription}
                            onChange={(e) => updateDetail(detail.id, 'itemDescription', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{detail.unit}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={detail.quantity}
                            onChange={(e) => updateDetail(detail.id, 'quantity', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={detail.costPerUnit}
                            onChange={(e) => updateDetail(detail.id, 'costPerUnit', e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {calculateDetailTotal(detail.quantity, detail.costPerUnit).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeDetail(detail.id)}
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

          {/* Grand Total */}
          {transfer.details.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Grand Total:</span>
                <span className="text-2xl font-bold text-[#f29f67]">
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium">✓ Stock transfer created successfully!</p>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-800 font-medium">✗ Error: {error?.message || 'Failed to create stock transfer'}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || transfer.details.length === 0}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] hover:to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
            >
              {isPending ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Stock Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTransfer;