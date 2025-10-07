import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Info,
  Calendar,
  Hash,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Copy,
  ChevronDown
} from 'lucide-react';

import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetJobMasters } from '../../hooks/jobMasterHooks/jobMasterHooks';
import { useCreatePurchaseNonStockVoucher } from '../../hooks/vouchersHooks/vouchersHook';
import Sidebar from '../../components/sidebar/Sidebar';

const useVoucherValidation = (formData, entries) => {
  return useMemo(() => {
    const validations = {
      pinNo: {
        isValid: (formData.pinNo || '').trim().length > 0,
        message: 'PIN number is required'
      },
      entries: {
        isValid:
          entries.length > 0 &&
          entries.every(entry =>
            (entry.accountId || '').toString().trim().length > 0 &&
            entry.amount > 0
          ),
        message: 'All entries must have account and amount'
      },
      balance: {
        isValid: (() => {
          const debitTotal = entries
            .filter(e => e.type === 'debit')
            .reduce((sum, e) => sum + e.amount, 0);
          const creditTotal = entries
            .filter(e => e.type === 'credit')
            .reduce((sum, e) => sum + e.amount, 0);
          return Math.abs(debitTotal - creditTotal) < 0.01;
        })(),
        message: 'Debit and credit totals must be equal'
      }
    };

    const isFormValid = Object.values(validations).every(v => v.isValid);
    return { validations, isFormValid };
  }, [formData, entries]);
};

function PurchaseNonStockVoucher() {
  const { data: accountCategories, isLoading: isLoadingAccounts, error: accountsError } = useGetAccountMasters();
  const { data: jobMasters, isLoading: isLoadingJobs, error: jobsError } = useGetJobMasters();

  const createVoucherMutation = useCreatePurchaseNonStockVoucher();

  const [formData, setFormData] = useState({
    pinNo: '',
    voucherType: 'Purchase - Non Stock',
    pinDate: new Date().toISOString().split('T')[0]
  });

  const [entries, setEntries] = useState([
    {
      id: 1,
      accountId: '',
      description: '',
      reference: '',
      type: 'debit',
      amount: 0,
      jobId: ''
    },
    {
      id: 2,
      accountId: '',
      description: '',
      reference: '',
      type: 'credit',
      amount: 0,
      jobId: ''
    }
  ]);

  const { validations, isFormValid } = useVoucherValidation(formData, entries);

  // generate pin no initially
  useEffect(() => {
    const generatePin = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `PV${year}${month}${random}`;
    };
    if (!formData.pinNo) {
      setFormData(prev => ({
        ...prev,
        pinNo: generatePin()
      }));
    }
  }, []);

  // reset form after success
  useEffect(() => {
    if (createVoucherMutation.isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [createVoucherMutation.isSuccess]);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEntryChange = (id, field, value) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id
          ? {
              ...entry,
              [field]:
                field === 'amount' ? parseFloat(value) || 0 : value
            }
          : entry
      )
    );
  };

  const addEntryPair = () => {
    const timestamp = Date.now();
    const newDebit = {
      id: timestamp,
      accountId: '',
      description: '',
      reference: '',
      type: 'debit',
      amount: 0,
      jobId: ''
    };
    const newCredit = {
      id: timestamp + 1,
      accountId: '',
      description: '',
      reference: '',
      type: 'credit',
      amount: 0,
      jobId: ''
    };
    setEntries(prev => [...prev, newDebit, newCredit]);
  };

  const duplicateEntry = entry => {
    const newEntry = {
      ...entry,
      id: Date.now(),
      reference: '',
      amount: 0
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const removeEntry = id => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const resetForm = () => {
    setFormData({
      pinNo: '',
      voucherType: 'Purchase - Non Stock',
      pinDate: new Date().toISOString().split('T')[0]
    });
    setEntries([
      {
        id: Date.now(),
        accountId: '',
        description: '',
        reference: '',
        type: 'debit',
        amount: 0,
        jobId: ''
      },
      {
        id: Date.now() + 1,
        accountId: '',
        description: '',
        reference: '',
        type: 'credit',
        amount: 0,
        jobId: ''
      }
    ]);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const payload = {
      pinNo: formData.pinNo,
      voucherType: formData.voucherType,
      pinDate: new Date(formData.pinDate).toISOString(),
      transactions: entries.map(entry => ({
        accountId: parseInt(entry.accountId) || 0,
        description: entry.description,
        reference: entry.reference,
        type: entry.type,
        amount: entry.amount,
        jobId: entry.jobId ? parseInt(entry.jobId) : null
      }))
    };

    createVoucherMutation.mutate(payload, {
      onError: err => {
        console.error('Error creating purchase voucher:', err);
      }
    });
  };

  const debitTotal = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#4f46e5] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Purchase Vouchers
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-[#4f46e5]/10 p-3 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-[#4f46e5]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Purchase Voucher</h1>
              <p className="text-gray-500">Create a new purchase voucher (non-stock)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Success / Error */}
        {createVoucherMutation.isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Purchase voucher created successfully</span>
            </div>
          </div>
        )}
        {createVoucherMutation.isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                {createVoucherMutation.error?.response?.data?.message ||
                  createVoucherMutation.error?.message ||
                  'Error creating purchase voucher'}
              </span>
            </div>
          </div>
        )}
        {accountsError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Failed to load accounts</span>
            </div>
          </div>
        )}
        {jobsError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Failed to load jobs</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header part */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-[#4f46e5]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Voucher Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded">
                  <ShoppingCart className="h-5 w-5 text-[#4f46e5]" />
                  <span className="font-medium text-gray-800">{formData.voucherType}</span>
                </div>
              </div>
              {/* PIN No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN No. <span className="text-[#4f46e5]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="pinNo"
                    value={formData.pinNo}
                    onChange={handleChange}
                    placeholder="PIN No."
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] ${
                      validations.pinNo.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                </div>
                {!validations.pinNo.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.pinNo.message}</p>
                )}
              </div>
              {/* PIN Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Date <span className="text-[#4f46e5]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="pinDate"
                    value={formData.pinDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Entries section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#4f46e5]" />
                <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
              </div>
              <button
                onClick={addEntryPair}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-[#4f46e5] text-[#4f46e5] rounded hover:bg-[#4f46e5]/10 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Entry Pair
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Account <span className="text-[#4f46e5]">*</span></th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text.gray-700">Reference</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Amount <span className="text-[#4f46e5]">*</span></th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Job</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={entry.accountId}
                            onChange={e => handleEntryChange(entry.id, 'accountId', e.target.value)}
                            disabled={isLoadingAccounts}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] appearance-none bg-white"
                          >
                            <option value="">Select Account</option>
                            {accountCategories?.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.accountMasterName} ({acc.accountNo})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={e => handleEntryChange(entry.id, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.reference}
                          onChange={e => handleEntryChange(entry.id, 'reference', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={entry.type}
                          onChange={e => handleEntryChange(entry.id, 'type', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                        >
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={e => handleEntryChange(entry.id, 'amount', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={entry.jobId}
                            onChange={e => handleEntryChange(entry.id, 'jobId', e.target.value)}
                            disabled={isLoadingJobs}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:border-[#4f46e5] appearance-none bg-white"
                          >
                            <option value="">Select Job</option>
                            {jobMasters?.map(job => (
                              <option key={job.id} value={job.id}>
                                {job.jobName} ({job.jobCode})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3 px-3 flex gap-1">
                        <button
                          onClick={() => duplicateEntry(entry)}
                          className="p-1 text-gray-500 hover:text-[#4f46e5]"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {entries.length > 2 && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Debit</p>
                  <p className="text-lg font-semibold text-red-600">${debitTotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                  <p className="text-lg font-semibold text-green-600">${creditTotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Balance Status</p>
                  {isBalanced ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Balanced</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#4f46e5]" />
                      <span className="text-sm font-medium text-[#4f46e5]">
                        Difference: ${Math.abs(debitTotal - creditTotal).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <span className="text-[#4f46e5] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#4f46e5]">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {!validations.balance.isValid
                        ? validations.balance.message
                        : 'Please complete all required fields'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition-colors"
                  disabled={createVoucherMutation.isLoading}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createVoucherMutation.isLoading || !isFormValid}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    createVoucherMutation.isLoading || !isFormValid
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#4f46e5] text-white hover:bg-[#4338ca] focus:ring-[#4f46e5]'
                  }`}
                >
                  {createVoucherMutation.isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Purchase Voucher
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

export default PurchaseNonStockVoucher;
