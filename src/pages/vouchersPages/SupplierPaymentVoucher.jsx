import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  CreditCard,
  Loader2,
  ArrowLeft,
  Info,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  Banknote,
  Building,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  Globe,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar"
const usePaymentValidation = (formData, supplierTransactions) => {
  return useMemo(() => {
    const validations = {
      pvNo: {
        isValid: formData.pvNo.trim().length > 0,
        message: 'PV number is required'
      },
      creditAccount: {
        isValid: formData.creditAccount.trim().length > 0,
        message: 'Credit account is required'
      },
      amount: {
        isValid: formData.amount > 0,
        message: 'Amount must be greater than 0'
      },
      supplierAccount: {
        isValid: formData.supplierAccount.trim().length > 0,
        message: 'Supplier account is required'
      },
      balance: {
        isValid: (() => {
          if (!formData.enableOnAccount) return true;
          const creditTotal = parseFloat(formData.amount) || 0;
          const debitTotal = supplierTransactions.reduce((sum, t) => sum + t.amount, 0);
          return Math.abs(debitTotal - creditTotal) < 0.01;
        })(),
        message: 'Total debit and credit must be equal when on account is enabled'
      }
    };

    const isFormValid = Object.values(validations).every(v => v.isValid);
    return { validations, isFormValid };
  }, [formData, supplierTransactions]);
};

function SupplierPayment() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    pvNo: '',
    voucherType: 'CASH',
    pvDate: new Date().toISOString().split('T')[0],
    creditAccount: '',
    reference: '',
    description: '',
    amount: 0,
    job: '',
    foreignCurrency: '',
    amountInFC: 0,
    supplierAccount: '',
    enableOnAccount: false
  });

  const [supplierTransactions, setSupplierTransactions] = useState([]);

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

  const { validations, isFormValid } = usePaymentValidation(formData, supplierTransactions);

  useEffect(() => {
    const generatePVNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `SP${year}${month}${random}`;
    };

    if (!formData.pvNo) {
      setFormData(prev => ({
        ...prev,
        pvNo: generatePVNumber()
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

  const addSupplierTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      account: '',
      description: '',
      reference: '',
      amount: 0
    };
    setSupplierTransactions(prev => [...prev, newTransaction]);
  };

  const updateSupplierTransaction = (id, field, value) => {
    setSupplierTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : transaction
      )
    );
  };

  const removeSupplierTransaction = (id) => {
    setSupplierTransactions(prev => prev.filter(t => t.id !== id));
  };

  const duplicateSupplierTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now()
    };
    setSupplierTransactions(prev => [...prev, newTransaction]);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsCreating(true);
    setError(null);

    try {
      const paymentData = {
        pvNo: formData.pvNo,
        voucherType: formData.voucherType,
        pvDate: new Date(formData.pvDate).toISOString(),
        creditAccount: formData.creditAccount,
        reference: formData.reference,
        description: formData.description,
        amount: formData.amount,
        job: formData.job,
        foreignCurrency: formData.foreignCurrency,
        amountInFC: formData.amountInFC,
        supplierAccount: formData.supplierAccount,
        enableOnAccount: formData.enableOnAccount,
        supplierTransactions: supplierTransactions
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Supplier Payment created:', paymentData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create supplier payment');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pvNo: '',
      voucherType: 'CASH',
      pvDate: new Date().toISOString().split('T')[0],
      creditAccount: '',
      reference: '',
      description: '',
      amount: 0,
      job: '',
      foreignCurrency: '',
      amountInFC: 0,
      supplierAccount: '',
      enableOnAccount: false
    });
    setSupplierTransactions([]);
    setError(null);
  };

  const totalCredit = parseFloat(formData.amount) || 0;
  const totalDebit = supplierTransactions.reduce((sum, t) => sum + t.amount, 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = !formData.enableOnAccount || difference < 0.01;

  return (
    <div className="min-h-screen bg-white">
    <Sidebar/>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#dc2626] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Supplier Payments
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#dc2626]/10 p-3 rounded-lg">
              <CreditCard className="h-8 w-8 text-[#dc2626]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Supplier Payment</h1>
              <p className="text-gray-500">Create a new supplier payment entry</p>
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
                <p className="text-green-700 text-sm">Supplier payment created successfully</p>
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

        {/* Main Form */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Voucher Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-[#dc2626]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Voucher Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher <span className="text-[#dc2626]">*</span>
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <CreditCard className="h-5 w-5 text-[#dc2626]" />
                  <span className="font-medium text-gray-800">PAYMENT VOUCHER</span>
                </div>
              </div>

              {/* Cash/Bank/PDC Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CASH/BANK/PDC <span className="text-[#dc2626]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {voucherTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, voucherType: type.value }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border font-medium text-sm transition-colors ${
                        formData.voucherType === type.value
                          ? 'bg-[#dc2626] text-white border-[#dc2626]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PV No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PV. No. <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="pvNo"
                    value={formData.pvNo}
                    onChange={handleChange}
                    placeholder="Enter PV number"
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] ${
                      validations.pvNo.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                  {!validations.pvNo.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.pvNo.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PV Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PV. Date <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="pvDate"
                    value={formData.pvDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-5 w-5 text-[#dc2626]" />
              <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credit Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Account <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  name="creditAccount"
                  value={formData.creditAccount}
                  onChange={handleChange}
                  placeholder="Enter credit account"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] ${
                    validations.creditAccount.isValid ? 'border-gray-300' : 'border-red-300'
                  }`}
                />
                {!validations.creditAccount.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.creditAccount.message}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] resize-none"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-[#dc2626]">*</span>
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
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] ${
                      validations.amount.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    Cr.{formData.amount.toFixed(2)}
                  </span>
                </div>
                {!validations.amount.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.amount.message}</p>
                )}
              </div>

              {/* Job */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job
                </label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  placeholder="Enter job"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626]"
                />
              </div>

              {/* Foreign Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreign Currency
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="foreignCurrency"
                    value={formData.foreignCurrency}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626]"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] disabled:bg-gray-100"
                />
              </div>

              {/* Supplier Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Account <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="supplierAccount"
                    value={formData.supplierAccount}
                    onChange={handleChange}
                    placeholder="Enter supplier account"
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] ${
                      validations.supplierAccount.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                </div>
                {!validations.supplierAccount.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validations.supplierAccount.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Supplier Debit Transactions */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#dc2626]" />
                <h3 className="text-lg font-medium text-gray-900">Supplier Debit Transactions</h3>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enableOnAccount"
                    checked={formData.enableOnAccount}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable On Account Entry</span>
                </label>
                {formData.enableOnAccount && (
                  <button
                    onClick={addSupplierTransaction}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-[#dc2626] text-[#dc2626] rounded-md hover:bg-[#dc2626]/10 transition-colors"
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
                    {supplierTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={transaction.account}
                            onChange={(e) => updateSupplierTransaction(transaction.id, 'account', e.target.value)}
                            placeholder="Account"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#dc2626] focus:border-[#dc2626]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={transaction.description}
                            onChange={(e) => updateSupplierTransaction(transaction.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#dc2626] focus:border-[#dc2626]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={transaction.reference}
                            onChange={(e) => updateSupplierTransaction(transaction.id, 'reference', e.target.value)}
                            placeholder="Reference"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#dc2626] focus:border-[#dc2626]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={transaction.amount}
                            onChange={(e) => updateSupplierTransaction(transaction.id, 'amount', e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#dc2626] focus:border-[#dc2626]"
                          />
                        </td>
                        <td className="py-3 px-3 flex gap-1">
                          <button
                            onClick={() => duplicateSupplierTransaction(transaction)}
                            className="p-1 text-gray-500 hover:text-[#dc2626] transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeSupplierTransaction(transaction.id)}
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

                {supplierTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No supplier transactions added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Transaction" to get started</p>
                  </div>
                )}
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
                      <AlertTriangle className="h-5 w-5 text-[#dc2626]" />
                      <span className="text-sm font-medium text-[#dc2626]">Unbalanced</span>
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
                <span className="text-[#dc2626] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#dc2626]">
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
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition-colors"
                  disabled={isCreating}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCreating || !isFormValid}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCreating || !isFormValid
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#dc2626] text-white hover:bg-[#b91c1c] focus:ring-[#dc2626]'
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
                      Create Supplier Payment
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

export default SupplierPayment;