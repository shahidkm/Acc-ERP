import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  CreditCard,
  Loader2,
  ArrowLeft,
  Info,
  Calendar,
  Hash,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Copy,
  ChevronDown
} from 'lucide-react';

import { useCreatePaymentVoucher } from '../../hooks/vouchersHooks/vouchersHook';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetJobMasters } from '../../hooks/jobMasterHooks/jobMasterHooks';
import Sidebar from "../../components/sidebar/Sidebar";

const useVoucherValidation = (formData, entries) => {
  return useMemo(() => {
    const validations = {
      voucherNo: {
        isValid: formData.voucherNo.trim().length > 0,
        message: 'Voucher number is required'
      },
      entries: {
        isValid:
          entries.length > 0 &&
          entries.every(entry =>
            entry.account.trim().length > 0 &&
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

function PaymentVoucher() {
  const createVoucherMutation = useCreatePaymentVoucher();
  const {
    data: accountCategories,
    isLoading: isLoadingAccounts,
    error: accountsError
  } = useGetAccountMasters();
  const {
    data: jobMasters,
    isLoading: isLoadingJobs,
    error: jobsError
  } = useGetJobMasters();

  const [formData, setFormData] = useState({
    voucherNo: '',
    voucherType: 1,
    voucherDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const [entries, setEntries] = useState([
    {
      id: 1,
      type: 'debit',
      account: '',
      description: '',
      reference: '',
      costCenterCode: '',
      jobId: '',        // use jobId instead of jobCode
      amount: 0
    },
    {
      id: 2,
      type: 'credit',
      account: '',
      description: '',
      reference: '',
      costCenterCode: '',
      jobId: '',
      amount: 0
    }
  ]);

  const { validations, isFormValid } = useVoucherValidation(formData, entries);

  useEffect(() => {
    const generateVoucherNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      return `PV${year}${month}${random}`;
    };

    if (!formData.voucherNo) {
      setFormData(prev => ({
        ...prev,
        voucherNo: generateVoucherNumber()
      }));
    }
  }, []);

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
      type: 'debit',
      account: '',
      description: '',
      reference: '',
      costCenterCode: '',
      jobId: '',
      amount: 0
    };
    const newCredit = {
      id: timestamp + 1,
      type: 'credit',
      account: '',
      description: '',
      reference: '',
      costCenterCode: '',
      jobId: '',
      amount: 0
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

  const handleSubmit = () => {
    if (!isFormValid) return;

    const voucherData = {
      voucherNo: formData.voucherNo,
      voucherType: formData.voucherType,
      voucherDate: new Date(formData.voucherDate).toISOString(),
      remarks: formData.remarks,
      lines: entries.map(entry => ({
        accountId: parseInt(entry.account) || 0,
        description: entry.description,
        reference: entry.reference,
        costCenterCode: entry.costCenterCode || '',
        jobId: entry.jobId || null,   // send jobId
        entryType: entry.type === 'debit' ? 0 : 1,
        amount: entry.amount
      }))
    };

    createVoucherMutation.mutate(voucherData, {
      onSuccess: () => {
        console.log('Payment voucher created successfully');
      },
      onError: error => {
        console.error('Error creating payment voucher:', error);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      voucherNo: '',
      voucherType: 1,
      voucherDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    setEntries([
      {
        id: Date.now(),
        type: 'debit',
        account: '',
        description: '',
        reference: '',
        costCenterCode: '',
        jobId: '',
        amount: 0
      },
      {
        id: Date.now() + 1,
        type: 'credit',
        account: '',
        description: '',
        reference: '',
        costCenterCode: '',
        jobId: '',
        amount: 0
      }
    ]);
  };

  const debitTotal = entries
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);
  const creditTotal = entries
    .filter(e => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#f29f67] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Vouchers
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-[#f29f67]/10 p-3 rounded-lg">
              <CreditCard className="h-8 w-8 text-[#f29f67]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Payment Voucher</h1>
              <p className="text-gray-500">Create a new payment voucher entry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {createVoucherMutation.isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">
                  Payment voucher created successfully
                </p>
              </div>
            </div>
          </div>
        )}
        {createVoucherMutation.isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">
                  {createVoucherMutation.error?.response?.data?.message ||
                    createVoucherMutation.error?.message ||
                    'Failed to create payment voucher'}
                </p>
              </div>
            </div>
          </div>
        )}

        {accountsError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Warning</p>
                <p className="text-yellow-700 text-sm">
                  Failed to load account categories. Please refresh.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Voucher Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-[#f29f67]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Type
                </label>
                <div className="grid grid-cols-1 gap-2">Payment Voucher</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher No. <span className="text-[#f29f67]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="voucherNo"
                    value={formData.voucherNo}
                    onChange={handleChange}
                    placeholder="Enter voucher number"
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] ${
                      validations.voucherNo.isValid
                        ? 'border-gray-300'
                        : 'border-red-300'
                    }`}
                  />
                  {!validations.voucherNo.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      {validations.voucherNo.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Date <span className="text-[#f29f67]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="voucherDate"
                    value={formData.voucherDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                  rows="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#f29f67]" />
                <h3 className="text-lg font-medium text-gray-900">Account Entries</h3>
                {isLoadingAccounts && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading accounts...
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addEntryPair}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-[#f29f67] text-[#f29f67] rounded-md hover:bg-[#f29f67]/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Entry Pair
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Account <span className="text-[#f29f67]">*</span>
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Reference
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Job
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Amount <span className="text-[#f29f67]">*</span>
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {entry.type === 'debit' ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-red-600">Debit</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-green-600">Credit</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={entry.account}
                            onChange={e =>
                              handleEntryChange(entry.id, 'account', e.target.value)
                            }
                            disabled={isLoadingAccounts}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f29f67] focus:border-[#f29f67] appearance-none bg-white"
                          >
                            <option value="">Select Account</option>
                            {accountCategories?.map(account => (
                              <option key={account.id} value={account.id}>
                                {account.accountMasterName} ({account.accountNo})
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
                          placeholder="Description"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f29f67] focus:border-[#f29f67]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={entry.reference}
                          onChange={e => handleEntryChange(entry.id, 'reference', e.target.value)}
                          placeholder="Reference"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f29f67] focus:border-[#f29f67]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="relative">
                          <select
                            value={entry.jobId}
                            onChange={e => handleEntryChange(entry.id, 'jobId', e.target.value)}
                            disabled={isLoadingJobs}
                            className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f29f67] focus:border-[#f29f67] appearance-none bg-white"
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
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={e => handleEntryChange(entry.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f29f67] focus:border-[#f29f67]"
                        />
                      </td>
                      <td className="py-3 px-3 flex gap-1">
                        <button
                          onClick={() => duplicateEntry(entry)}
                          className="p-1 text-gray-500 hover:text-[#f29f67] transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {entries.length > 2 && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
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
                  <p className="text-lg font-semibold text-red-600">
                    ${debitTotal.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${creditTotal.toFixed(2)}
                  </p>
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
                      <AlertTriangle className="h-5 w-5 text-[#f29f67]" />
                      <span className="text-sm font-medium text-[#f29f67]">
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
                <span className="text-[#f29f67] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#f29f67]">
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
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f29f67] transition-colors"
                  disabled={createVoucherMutation.isPending}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createVoucherMutation.isPending || !isFormValid || isLoadingAccounts}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    createVoucherMutation.isPending || !isFormValid || isLoadingAccounts
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#f29f67] text-white hover:bg-[#e08f57] focus:ring-[#f29f67]'
                  }`}
                >
                  {createVoucherMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Payment Voucher
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

export default PaymentVoucher;
