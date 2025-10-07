import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  Receipt,
  Loader2,
  ArrowLeft,
  Info,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  CreditCard,
  Banknote,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  UserCheck,
  Globe,
  Plus,
  Trash2,
  Copy,
  ChevronDown
} from 'lucide-react';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import { useGetJobMasters } from '../../hooks/jobMasterHooks/jobMasterHooks';
import { useGetSalesmans } from '../../hooks/salesmanHooks/salesmanHooks';
import { useGetCustomers } from '../../hooks/customerHooks/useGetCustomers';

const useReceiptValidation = (formData, customerTransactions) => {
  return useMemo(() => {
    const validations = {
      rvNo: {
        isValid: formData.rvNo.trim().length > 0,
        message: 'RV number is required'
      },
      debitAccountId: {
        isValid: formData.debitAccountId > 0,
        message: 'Debit account is required'
      },
      amount: {
        isValid: formData.amount > 0,
        message: 'Amount must be greater than 0'
      },
      customerAccountId: {
        isValid: formData.customerAccountId > 0,
        message: 'Customer account is required'
      },
      balance: {
        isValid: (() => {
          if (!formData.enableOnAccount) return true;
          const debitTotal = parseFloat(formData.amount) || 0;
          const creditTotal = customerTransactions.reduce((sum, t) => sum + t.amount, 0);
          return Math.abs(debitTotal - creditTotal) < 0.01;
        })(),
        message: 'Total debit and credit must be equal when on account is enabled'
      }
    };

    const isFormValid = Object.values(validations).every(v => v.isValid);
    return { validations, isFormValid };
  }, [formData, customerTransactions]);
};

function CustomerReceipt() {
  const { data: accountMasters, isLoading: isLoadingAccounts, error: accountsError } = useGetAccountMasters();
  const { data: jobMasters, isLoading: isLoadingJobs, error: jobsError } = useGetJobMasters();
  const { data: salesmen, isLoading: isLoadingSalesmen, error: salesmenError } = useGetSalesmans();
  const { data: customers, isLoading: isLoadingCustomers, error: customersError } = useGetCustomers();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    rvNo: '',
    voucherType: 'CASH',
    rvDate: new Date().toISOString().split('T')[0],
    debitAccountId: 0,
    reference: '',
    description: '',
    amount: 0,
    jobCodeId: 0,
    salesmanId: 0,
    foreignCurrency: '',
    amountInFC: 0,
    customerAccountId: 0,
    enableOnAccount: false
  });

  const [customerTransactions, setCustomerTransactions] = useState([]);

  const voucherTypes = [
    { value: 'CASH', label: 'Cash', icon: Banknote },
    { value: 'BANK', label: 'Bank', icon: Building },
    { value: 'PDC', label: 'PDC', icon: CreditCard }
  ];

  const currencies = [
    { value: '', label: 'Select Foreign Currency...' },
    { value: 'OMR', label: 'OMR - Omani Rial' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'AED', label: 'AED - UAE Dirham' }
  ];

  const { validations, isFormValid } = useReceiptValidation(formData, customerTransactions);

  useEffect(() => {
    const generateRVNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `CR${year}${month}${random}`;
    };

    if (!formData.rvNo) {
      setFormData(prev => ({
        ...prev,
        rvNo: generateRVNumber()
      }));
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        resetForm();
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addCustomerTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      accountId: 0,
      description: '',
      reference: '',
      amount: 0
    };
    setCustomerTransactions(prev => [...prev, newTransaction]);
  };

  const updateCustomerTransaction = (id, field, value) => {
    setCustomerTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, [field]: field === 'amount' ? parseFloat(value) || 0 : field === 'accountId' ? parseInt(value) || 0 : value }
          : transaction
      )
    );
  };

  const removeCustomerTransaction = (id) => {
    setCustomerTransactions(prev => prev.filter(t => t.id !== id));
  };

  const duplicateCustomerTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now()
    };
    setCustomerTransactions(prev => [...prev, newTransaction]);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsCreating(true);
    setError(null);

    try {
      const receiptData = {
        rvNo: formData.rvNo,
        voucherType: formData.voucherType,
        rvDate: new Date(formData.rvDate).toISOString(),
        debitAccountId: formData.debitAccountId,
        reference: formData.reference,
        description: formData.description,
        amount: formData.amount,
        jobCodeId: formData.jobCodeId || null,
        salesmanId: formData.salesmanId || null,
        foreignCurrency: formData.foreignCurrency || null,
        amountInFC: formData.amountInFC,
        customerAccountId: formData.customerAccountId,
        enableOnAccount: formData.enableOnAccount,
        customerTransactions: customerTransactions.map(t => ({
          accountId: t.accountId,
          description: t.description,
          reference: t.reference,
          amount: t.amount
        }))
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Customer Receipt created:', receiptData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create customer receipt');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rvNo: '',
      voucherType: 'CASH',
      rvDate: new Date().toISOString().split('T')[0],
      debitAccountId: 0,
      reference: '',
      description: '',
      amount: 0,
      jobCodeId: 0,
      salesmanId: 0,
      foreignCurrency: '',
      amountInFC: 0,
      customerAccountId: 0,
      enableOnAccount: false
    });
    setCustomerTransactions([]);
    setError(null);
  };

  const totalDebit = parseFloat(formData.amount) || 0;
  const totalCredit = customerTransactions.reduce((sum, t) => sum + t.amount, 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = !formData.enableOnAccount || difference < 0.01;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#f59e0b] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Customer Receipts
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#f59e0b]/10 p-3 rounded-lg">
              <Receipt className="h-8 w-8 text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Customer Receipt</h1>
              <p className="text-gray-500">Create a new customer receipt entry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Success/Error Messages */}
        {isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">Customer receipt created successfully</p>
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

        {(accountsError || jobsError || salesmenError || customersError) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Warning</p>
                <p className="text-yellow-700 text-sm">Failed to load some dropdown data. Please refresh the page.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Voucher Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-[#f59e0b]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
              {(isLoadingAccounts || isLoadingJobs || isLoadingSalesmen || isLoadingCustomers) && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading data...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Voucher Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <Receipt className="h-5 w-5 text-[#f59e0b]" />
                  <span className="font-medium text-gray-800">RECEIPT VOUCHER</span>
                </div>
              </div>

              {/* Cash/Bank/PDC Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CASH/BANK/PDC <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {voucherTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, voucherType: type.value }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border font-medium text-sm transition-colors ${
                        formData.voucherType === type.value
                          ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RV No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RV. No. <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="rvNo"
                    value={formData.rvNo}
                    onChange={handleChange}
                    placeholder="Enter RV number"
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] ${
                      validations.rvNo.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                  {!validations.rvNo.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.rvNo.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RV Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RV. Date <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="rvDate"
                    value={formData.rvDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-5 w-5 text-[#f59e0b]" />
              <h3 className="text-lg font-medium text-gray-900">Receipt Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Debit Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debit Account <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="debitAccountId"
                    value={formData.debitAccountId}
                    onChange={handleChange}
                    disabled={isLoadingAccounts}
                    className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white ${
                      validations.debitAccountId.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  >
                    <option value={0}>Select Debit Account</option>
                    {accountMasters?.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountMasterName} ({account.accountNo})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {!validations.debitAccountId.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.debitAccountId.message}</p>
                )}
              </div>

              {/* Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="Enter reference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] resize-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-9 pr-20 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] ${
                      validations.amount.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    Dr.{formData.amount.toFixed(2)}
                  </span>
                </div>
                {!validations.amount.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.amount.message}</p>
                )}
              </div>

              {/* Job Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Code
                </label>
                <div className="relative">
                  <select
                    name="jobCodeId"
                    value={formData.jobCodeId}
                    onChange={handleChange}
                    disabled={isLoadingJobs}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white"
                  >
                    <option value={0}>Select Job Code</option>
                    {jobMasters?.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.jobName} ({job.jobCode})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Salesman */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salesman
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <select
                    name="salesmanId"
                    value={formData.salesmanId}
                    onChange={handleChange}
                    disabled={isLoadingSalesmen}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white"
                  >
                    <option value={0}>Select Salesman</option>
                    {salesmen?.map((salesman) => (
                      <option key={salesman.salesmanId} value={salesman.salesmanId}>
                        {salesman.salesmanName} - {salesman.contactNo}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Foreign Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreign Currency
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <select
                    name="foreignCurrency"
                    value={formData.foreignCurrency}
                    onChange={handleChange}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Amount in FC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount in FC
                </label>
                <input
                  type="number"
                  name="amountInFC"
                  value={formData.amountInFC}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={!formData.foreignCurrency}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] disabled:bg-gray-100"
                />
              </div>

              {/* Customer Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Account <span className="text-[#f59e0b]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <select
                    name="customerAccountId"
                    value={formData.customerAccountId}
                    onChange={handleChange}
                    disabled={isLoadingCustomers}
                    className={`w-full pl-9 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white ${
                      validations.customerAccountId.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  >
                    <option value={0}>Select Customer</option>
                    {customers?.map((customer) => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {!validations.customerAccountId.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.customerAccountId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Credit Transactions */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-[#f59e0b]" />
                <h3 className="text-lg font-medium text-gray-900">Customer Credit Transactions</h3>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enableOnAccount"
                    checked={formData.enableOnAccount}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#f59e0b] focus:ring-[#f59e0b]"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable On Account Entry</span>
                </label>
                {formData.enableOnAccount && (
                  <button
                    onClick={addCustomerTransaction}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-[#f59e0b] text-[#f59e0b] rounded-md hover:bg-[#f59e0b]/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </button>
                )}
              </div>
            </div>

            {formData.enableOnAccount && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Account</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Reference</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="relative">
                            <select
                              value={transaction.accountId}
                              onChange={(e) => updateCustomerTransaction(transaction.id, 'accountId', e.target.value)}
                              disabled={isLoadingAccounts}
                              className="w-full px-2 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none bg-white"
                            >
                              <option value={0}>Select Account</option>
                              {accountMasters?.map((account) => (
                                <option key={account.id} value={account.id}>
                                  {account.accountMasterName} ({account.accountNo})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={transaction.description}
                            onChange={(e) => updateCustomerTransaction(transaction.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={transaction.reference}
                            onChange={(e) => updateCustomerTransaction(transaction.id, 'reference', e.target.value)}
                            placeholder="Reference"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={transaction.amount}
                            onChange={(e) => updateCustomerTransaction(transaction.id, 'amount', e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
                          />
                        </td>
                        <td className="py-3 px-3 flex gap-1">
                          <button
                            onClick={() => duplicateCustomerTransaction(transaction)}
                            className="p-1 text-gray-500 hover:text-[#f59e0b] transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeCustomerTransaction(transaction.id)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Balance Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Debit</p>
                  <p className="text-lg font-semibold text-red-600">${totalDebit.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Credit</p>
                  <p className="text-lg font-semibold text-green-600">${totalCredit.toFixed(2)}</p>
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
                      <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
                      <span className="text-sm font-medium text-[#f59e0b]">Unbalanced</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <span className="text-[#f59e0b] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#f59e0b]">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {!validations.balance.isValid ? validations.balance.message : 'Please complete all required fields'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-colors"
                  disabled={isCreating}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCreating || !isFormValid || isLoadingAccounts || isLoadingJobs || isLoadingSalesmen || isLoadingCustomers}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCreating || !isFormValid || isLoadingAccounts || isLoadingJobs || isLoadingSalesmen || isLoadingCustomers
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#f59e0b] text-white hover:bg-[#d97706] focus:ring-[#f59e0b]'
                  }`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Customer Receipt
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

export default CustomerReceipt;