import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  TrendingUp,
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
  Package,
  ChevronDown
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";
import { useCreateSalesNonStockVoucher } from '../../hooks/vouchersHooks/vouchersHook';
import { useGetJobMasters } from '../../hooks/jobMasterHooks/jobMasterHooks';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks'; // assuming you have this

const useVoucherValidation = (formData, entries) => {
  return useMemo(() => {
    const validations = {
      sinNo: {
        isValid: (formData.sinNo || '').trim().length > 0,
        message: 'SIN number is required'
      },
      entries: {
        isValid:
          entries.length > 0 &&
          entries.every(entry =>
            (entry.accountName || '').trim().length > 0 &&
            entry.amount > 0
          ),
        message: 'All entries must have account name and amount'
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

function SalesNonStockVoucher() {
  const createMutation = useCreateSalesNonStockVoucher();
  const { data: jobCodes, isLoading: jobsLoading, error: jobsError } = useGetJobMasters();
  const { data: accountCategories, isLoading: accountsLoading, error: accountsError } = useGetAccountMasters();

  const [formData, setFormData] = useState({
    sinNo: '',
    voucherType: 'Sales - Non Stock',
    sinDate: new Date().toISOString().split('T')[0]
  });

  const [entries, setEntries] = useState([
    {
      id: 1,
      accountName: '',
      description: '',
      reference: '',
      type: 'credit',
      amount: 0,
      jobId: ''
    },
    {
      id: 2,
      accountName: '',
      description: '',
      reference: '',
      type: 'debit',
      amount: 0,
      jobId: ''
    }
  ]);

  const { validations, isFormValid } = useVoucherValidation(formData, entries);

  useEffect(() => {
    const generateSinNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      return `SV${year}${month}${random}`;
    };
    if (!formData.sinNo) {
      setFormData(prev => ({
        ...prev,
        sinNo: generateSinNumber()
      }));
    }
  }, []);

  useEffect(() => {
    if (createMutation.isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [createMutation.isSuccess]);

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
    const newCredit = {
      id: timestamp,
      accountName: '',
      description: '',
      reference: '',
      type: 'credit',
      amount: 0,
      jobId: ''
    };
    const newDebit = {
      id: timestamp + 1,
      accountName: '',
      description: '',
      reference: '',
      type: 'debit',
      amount: 0,
      jobId: ''
    };
    setEntries(prev => [...prev, newCredit, newDebit]);
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
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const resetForm = () => {
    setFormData({
      sinNo: '',
      voucherType: 'Sales - Non Stock',
      sinDate: new Date().toISOString().split('T')[0]
    });
    setEntries([
      {
        id: Date.now(),
        accountName: '',
        description: '',
        reference: '',
        type: 'credit',
        amount: 0,
        jobId: ''
      },
      {
        id: Date.now() + 1,
        accountName: '',
        description: '',
        reference: '',
        type: 'debit',
        amount: 0,
        jobId: ''
      }
    ]);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const payload = {
      sinNo: formData.sinNo,
      voucherType: formData.voucherType,
      sinDate: new Date(formData.sinDate).toISOString(),
      transactions: entries.map(entry => ({
        accountName: entry.accountName,
        description: entry.description,
        reference: entry.reference,
        type: entry.type,
        amount: entry.amount,
        jobId: entry.jobId ? parseInt(entry.jobId) : null
      }))
    };

    createMutation.mutate(payload, {
      onError: err => {
        console.error('Error creating sales voucher:', err);
      }
    });
  };

  const debitTotal = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
  const difference = Math.abs(debitTotal - creditTotal);
  const isBalanced = difference < 0.01;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#10b981] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sales Vouchers
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-[#10b981]/10 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-[#10b981]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Sales Voucher</h1>
              <p className="text-gray-500">Create a new sales voucher (non-stock) entry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Success / Error */}
        {createMutation.isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Sales voucher created successfully</span>
            </div>
          </div>
        )}
        {createMutation.isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                {createMutation.error?.response?.data?.message || createMutation.error?.message || 'Error creating voucher'}
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
              <span className="text-yellow-800 font-medium">Failed to load job codes</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-[#10b981]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded">
                  <Package className="h-5 w-5 text-[#10b981]" />
                  <span className="font-medium text-gray-800">{formData.voucherType}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIN No. <span className="text-[#10b981]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="sinNo"
                    value={formData.sinNo}
                    onChange={handleChange}
                    placeholder="SIN No."
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] ${
                      validations.sinNo.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                </div>
                {!validations.sinNo.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.sinNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIN Date <span className="text-[#10b981]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="sinDate"
                    value={formData.sinDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#10b981]" />
                <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
              </div>
              <button
                onClick={addEntryPair}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-[#10b981] text-[#10b981] rounded hover:bg-[#10b981]/10 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Entry Pair
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Account Name <span className="text-[#10b981]">*</span></th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Reference</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Amount <span className="text-[#10b981]">*</span></th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Job</th>
                    <th className="py-3 px-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.accountName}
                          onChange={e => handleEntryChange(entry.id, 'accountName', e.target.value)}
                          placeholder="Account Name"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={e => handleEntryChange(entry.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.reference}
                          onChange={e => handleEntryChange(entry.id, 'reference', e.target.value)}
                          placeholder="Reference"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={entry.type}
                          onChange={e => handleEntryChange(entry.id, 'type', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                        >
                          <option value="credit">Cr</option>
                          <option value="debit">Dr</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={e => handleEntryChange(entry.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={entry.jobId}
                            onChange={e => handleEntryChange(entry.id, 'jobId', e.target.value)}
                            disabled={jobsLoading}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] appearance-none bg-white"
                          >
                            <option value="">Select Job</option>
                            {jobCodes?.map(j => (
                              <option key={j.id} value={j.id}>
                                {j.jobName} ({j.jobCode})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-3 px-3 flex gap-1">
                        <button
                          onClick={() => duplicateEntry(entry)}
                          className="p-1 text-gray-500 hover:text-[#10b981]"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Debit</p>
                  <p className="text-lg font-semibold text-red-600">${debitTotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                  <p className="text-lg font-semibold text-green-600">${creditTotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Difference</p>
                  <p className="text-lg font-semibold text-orange-600">${difference.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {isBalanced ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Balanced</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#10b981]" />
                      <span className="text-sm font-medium text-[#10b981]">Unbalanced</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <span className="text-[#10b981] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#10b981]">
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
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-colors"
                  disabled={createMutation.isLoading}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isLoading || !isFormValid}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    createMutation.isLoading || !isFormValid
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#10b981] text-white hover:bg-[#059669] focus:ring-[#10b981]'
                  }`}
                >
                  {createMutation.isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Sales Voucher
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

export default SalesNonStockVoucher;
