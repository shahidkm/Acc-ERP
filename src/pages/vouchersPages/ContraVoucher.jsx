import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  ArrowRightLeft,
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
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar"
const useContraValidation = (formData, creditEntries, debitEntries) => {
  return useMemo(() => {
    const validations = {
      cvNo: {
        isValid: formData.cvNo.trim().length > 0,
        message: 'CV number is required'
      },
      entries: {
        isValid: creditEntries.length > 0 && debitEntries.length > 0 && 
                 creditEntries.every(entry => entry.accountName.trim().length > 0 && entry.amount > 0) &&
                 debitEntries.every(entry => entry.accountName.trim().length > 0 && entry.amount > 0),
        message: 'At least one credit and one debit entry with account name and amount are required'
      },
      balance: {
        isValid: (() => {
          const creditTotal = creditEntries.reduce((sum, e) => sum + e.amount, 0);
          const debitTotal = debitEntries.reduce((sum, e) => sum + e.amount, 0);
          return Math.abs(debitTotal - creditTotal) < 0.01;
        })(),
        message: 'Credit and debit totals must be equal'
      }
    };

    const isFormValid = Object.values(validations).every(v => v.isValid);
    return { validations, isFormValid };
  }, [formData, creditEntries, debitEntries]);
};

function ContraVoucher() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    cvNo: '',
    cvDate: new Date().toISOString().split('T')[0],
    voucherType: 'Withdraw'
  });

  const [creditEntries, setCreditEntries] = useState([
    {
      id: 1,
      accountName: '',
      description: '',
      reference: '',
      amount: 0,
      type: 'credit'
    }
  ]);

  const [debitEntries, setDebitEntries] = useState([
    {
      id: 2,
      accountName: '',
      description: '',
      reference: '',
      amount: 0,
      type: 'debit'
    }
  ]);

  const voucherTypes = [
    { value: 'Withdraw', label: 'Withdraw', icon: TrendingDown, color: 'text-red-600' },
    { value: 'Deposit', label: 'Deposit', icon: TrendingUp, color: 'text-green-600' }
  ];

  const { validations, isFormValid } = useContraValidation(formData, creditEntries, debitEntries);

  useEffect(() => {
    const generateCVNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `CV${year}${month}${random}`;
    };

    if (!formData.cvNo) {
      setFormData(prev => ({
        ...prev,
        cvNo: generateCVNumber()
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreditEntryChange = (id, field, value) => {
    setCreditEntries(prev =>
      prev.map(entry =>
        entry.id === id
          ? { ...entry, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : entry
      )
    );
  };

  const handleDebitEntryChange = (id, field, value) => {
    setDebitEntries(prev =>
      prev.map(entry =>
        entry.id === id
          ? { ...entry, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : entry
      )
    );
  };

  const addCreditEntry = () => {
    const newEntry = {
      id: Date.now(),
      accountName: '',
      description: '',
      reference: '',
      amount: 0,
      type: 'credit'
    };
    setCreditEntries(prev => [...prev, newEntry]);
  };

  const addDebitEntry = () => {
    const newEntry = {
      id: Date.now(),
      accountName: '',
      description: '',
      reference: '',
      amount: 0,
      type: 'debit'
    };
    setDebitEntries(prev => [...prev, newEntry]);
  };

  const duplicateCreditEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now()
    };
    setCreditEntries(prev => [...prev, newEntry]);
  };

  const duplicateDebitEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now()
    };
    setDebitEntries(prev => [...prev, newEntry]);
  };

  const removeCreditEntry = (id) => {
    if (creditEntries.length > 1) {
      setCreditEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const removeDebitEntry = (id) => {
    if (debitEntries.length > 1) {
      setDebitEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsCreating(true);
    setError(null);

    try {
      const contraData = {
        cvNo: formData.cvNo,
        cvDate: new Date(formData.cvDate).toISOString(),
        voucherType: formData.voucherType,
        creditEntries: creditEntries,
        debitEntries: debitEntries
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contra Voucher created:', contraData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create contra voucher');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cvNo: '',
      cvDate: new Date().toISOString().split('T')[0],
      voucherType: 'Withdraw'
    });
    setCreditEntries([
      {
        id: Date.now(),
        accountName: '',
        description: '',
        reference: '',
        amount: 0,
        type: 'credit'
      }
    ]);
    setDebitEntries([
      {
        id: Date.now() + 1,
        accountName: '',
        description: '',
        reference: '',
        amount: 0,
        type: 'debit'
      }
    ]);
    setError(null);
  };

  const creditTotal = creditEntries.reduce((sum, e) => sum + e.amount, 0);
  const debitTotal = debitEntries.reduce((sum, e) => sum + e.amount, 0);
  const difference = Math.abs(debitTotal - creditTotal);
  const isBalanced = difference < 0.01;

  return (
    <div className="min-h-screen bg-white">
    <Sidebar/>
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => console.log('Go back')}
            className="inline-flex items-center text-gray-600 hover:text-[#8b5cf6] transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Contra Vouchers
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#8b5cf6]/10 p-3 rounded-lg">
              <ArrowRightLeft className="h-8 w-8 text-[#8b5cf6]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Contra Voucher</h1>
              <p className="text-gray-500">Create a new contra voucher for bank transfers</p>
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
                <p className="text-green-700 text-sm">Contra voucher created successfully</p>
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
              <Info className="h-5 w-5 text-[#8b5cf6]" />
              <h3 className="text-lg font-medium text-gray-900">Voucher Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CV No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV. No. <span className="text-[#8b5cf6]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="cvNo"
                    value={formData.cvNo}
                    onChange={handleChange}
                    placeholder="Enter CV number"
                    className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] ${
                      validations.cvNo.isValid ? 'border-gray-300' : 'border-red-300'
                    }`}
                  />
                  {!validations.cvNo.isValid && (
                    <p className="mt-1 text-sm text-red-600">{validations.cvNo.message}</p>
                  )}
                </div>
              </div>

              {/* CV Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV. Date <span className="text-[#8b5cf6]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="cvDate"
                    value={formData.cvDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Voucher Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Type <span className="text-[#8b5cf6]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {voucherTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, voucherType: type.value }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border font-medium text-sm transition-colors ${
                        formData.voucherType === type.value
                          ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-5 w-5 text-[#8b5cf6]" />
              <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Credit Entries */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    <h4 className="text-lg font-medium text-gray-900">Credit Entries</h4>
                  </div>
                  <button
                    onClick={addCreditEntry}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-white border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {creditEntries.map((entry, index) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Credit Entry #{index + 1}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Cr
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Account Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={entry.accountName}
                            onChange={(e) => handleCreditEntryChange(entry.id, 'accountName', e.target.value)}
                            placeholder="Account Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={entry.description}
                            onChange={(e) => handleCreditEntryChange(entry.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Reference</label>
                          <input
                            type="text"
                            value={entry.reference}
                            onChange={(e) => handleCreditEntryChange(entry.id, 'reference', e.target.value)}
                            placeholder="Reference"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={entry.amount}
                              onChange={(e) => handleCreditEntryChange(entry.id, 'amount', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => duplicateCreditEntry(entry)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-[#8b5cf6] transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                          {creditEntries.length > 1 && (
                            <button
                              onClick={() => removeCreditEntry(entry.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-500 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debit Entries */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <h4 className="text-lg font-medium text-gray-900">Debit Entries</h4>
                  </div>
                  <button
                    onClick={addDebitEntry}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {debitEntries.map((entry, index) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Debit Entry #{index + 1}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Dr
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Account Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={entry.accountName}
                            onChange={(e) => handleDebitEntryChange(entry.id, 'accountName', e.target.value)}
                            placeholder="Account Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={entry.description}
                            onChange={(e) => handleDebitEntryChange(entry.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Reference</label>
                          <input
                            type="text"
                            value={entry.reference}
                            onChange={(e) => handleDebitEntryChange(entry.id, 'reference', e.target.value)}
                            placeholder="Reference"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              value={entry.amount}
                              onChange={(e) => handleDebitEntryChange(entry.id, 'amount', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => duplicateDebitEntry(entry)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-[#8b5cf6] transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                          {debitEntries.length > 1 && (
                            <button
                              onClick={() => removeDebitEntry(entry.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-500 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Balance Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
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
                      <AlertTriangle className="h-5 w-5 text-[#8b5cf6]" />
                      <span className="text-sm font-medium text-[#8b5cf6]">Unbalanced</span>
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
                <span className="text-[#8b5cf6] mr-1">*</span>
                <span className="text-sm">Required fields</span>
                {!isFormValid && (
                  <div className="flex items-center ml-4 text-[#8b5cf6]">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {!validations.balance.isValid ? validations.balance.message : 
                       !validations.entries.isValid ? validations.entries.message :
                       'Please complete all required fields'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-colors"
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
                      : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] focus:ring-[#8b5cf6]'
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
                      Create Contra Voucher
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

export default ContraVoucher;