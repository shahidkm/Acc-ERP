import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateAccountMaster } from '../../hooks/accountHooks/accountHooks';
import { useGetAccountCategories } from '../../hooks/accountHooks/accountHooks';
import { useGetAccountGroups } from '../../hooks/accountHooks/accountHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  User,
  CreditCard,
  Hash,
  FileText,
  MapPin,
  Receipt,
  ArrowLeftRight,
  DollarSign,
  Percent,
  Briefcase,
  Eye,
  EyeOff,
  Building,
  TrendingUp,
  Target,
  Users,
  ChevronDown,
  Info
} from 'lucide-react';

const CreateAccountMaster = () => {
  const [formData, setFormData] = useState({
    accountType: '',
    accountCategoryId: '',
    accountGroupId: '',
    accountId: '',
    accountMasterName: '',
    accountNo: '',
    area: '',
    trnNo: '',
    transactionType: '',
    openingBalance: 0,
    foreignCurrencyOpeningBalance: 0,
    vatAssignable: false,
    vAtPercentage: 0,
    jobAssignable: false,
    jobCompulsary: false,
    hide: false
  });

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateAccountMaster();
  const { data: categories, isLoading: categoriesLoading } = useGetAccountCategories();
  const { data: groups, isLoading: groupsLoading } = useGetAccountGroups();

  // Filter groups based on selected category
  const filteredGroups = groups?.filter(group => 
    group.accountCategoryId === parseInt(formData.accountCategoryId)
  ) || [];

  const accountTypeOptions = [
    { value: 'asset', label: 'Asset', icon: Building, description: 'Resources owned by the company' },
    { value: 'liability', label: 'Liability', icon: CreditCard, description: 'Debts and obligations' },
    { value: 'income', label: 'Income', icon: TrendingUp, description: 'Revenue and earnings' },
    { value: 'expense', label: 'Expense', icon: Target, description: 'Business costs and expenditures' },
    { value: 'equity', label: 'Equity', icon: DollarSign, description: 'Owner\'s stake in the company' }
  ];

  const transactionTypeOptions = [
    'debit',
    'credit'
  
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      accountCategoryId: parseInt(formData.accountCategoryId),
      accountGroupId: parseInt(formData.accountGroupId),
      openingBalance: parseFloat(formData.openingBalance),
      foreignCurrencyOpeningBalance: parseFloat(formData.foreignCurrencyOpeningBalance),
      vAtPercentage: parseFloat(formData.vAtPercentage)
    };

    mutate(submitData, {
      onSuccess: () => {
        // navigate('/account-masters');
      },
    });
  };

  // Reset group selection when category changes
  useEffect(() => {
    if (formData.accountCategoryId) {
      setFormData(prev => ({
        ...prev,
        accountGroupId: ''
      }));
    }
  }, [formData.accountCategoryId]);

  const selectedCategory = categories?.find(cat => cat.id === parseInt(formData.accountCategoryId));
  const selectedGroup = groups?.find(group => group.id === parseInt(formData.accountGroupId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/account-masters')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account Masters
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Account Master
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Set up a new account master with complete configuration</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#f29f67]" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Type */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4 text-[#f29f67]" />
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    >
                      <option value="">Select account type...</option>
                      {accountTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Category */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#f29f67]" />
                      Account Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accountCategoryId}
                      onChange={(e) => handleInputChange('accountCategoryId', e.target.value)}
                      required
                      disabled={categoriesLoading}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                    >
                      <option value="">Select category...</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.accountType})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Group */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#f29f67]" />
                      Account Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accountGroupId}
                      onChange={(e) => handleInputChange('accountGroupId', e.target.value)}
                      required
                      disabled={!formData.accountCategoryId || groupsLoading}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                    >
                      <option value="">Select group...</option>
                      {filteredGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    {!formData.accountCategoryId && (
                      <p className="mt-1 text-xs text-gray-500">Select a category first</p>
                    )}
                  </div>

                  {/* Account ID */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-[#f29f67]" />
                      Account ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountId}
                      onChange={(e) => handleInputChange('accountId', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="Enter unique account ID"
                    />
                  </div>

                  {/* Account Master Name */}
                  <div className="group md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#f29f67]" />
                      Account Master Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountMasterName}
                      onChange={(e) => handleInputChange('accountMasterName', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="Enter descriptive account name"
                    />
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#f29f67]" />
                  Account Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Account Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-[#f29f67]" />
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.accountNo}
                      onChange={(e) => handleInputChange('accountNo', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="Account number"
                    />
                  </div>

                  {/* Area */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#f29f67]" />
                      Area
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="Area/Region"
                    />
                  </div>

                  {/* TRN Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-[#f29f67]" />
                      TRN Number
                    </label>
                    <input
                      type="text"
                      value={formData.trnNo}
                      onChange={(e) => handleInputChange('trnNo', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="Tax Registration Number"
                    />
                  </div>

                  {/* Transaction Type */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-[#f29f67]" />
                      Transaction Type
                    </label>
                    <select
                      value={formData.transactionType}
                      onChange={(e) => handleInputChange('transactionType', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                    >
                      <option value="">Select type...</option>
                      {transactionTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#f29f67]" />
                  Financial Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Opening Balance */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#f29f67]" />
                      Opening Balance
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.openingBalance}
                      onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Foreign Currency Opening Balance */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#f29f67]" />
                      Foreign Currency Opening Balance
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.foreignCurrencyOpeningBalance}
                      onChange={(e) => handleInputChange('foreignCurrencyOpeningBalance', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* VAT Configuration */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-[#f29f67]" />
                  VAT Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* VAT Assignable */}
                  <div className="group">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.vatAssignable}
                        onChange={() => handleCheckboxChange('vatAssignable')}
                        className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-gray-800">VAT Assignable</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-8">Enable VAT calculations for this account</p>
                  </div>

                  {/* VAT Percentage */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-[#f29f67]" />
                      VAT Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.vAtPercentage}
                      onChange={(e) => handleInputChange('vAtPercentage', e.target.value)}
                      disabled={!formData.vatAssignable}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Job Settings */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#f29f67]" />
                  Job Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Assignable */}
                  <div className="group">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.jobAssignable}
                        onChange={() => handleCheckboxChange('jobAssignable')}
                        className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-gray-800">Job Assignable</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-8">Allow job assignments to this account</p>
                  </div>

                  {/* Job Compulsory */}
                  <div className="group">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.jobCompulsary}
                        onChange={() => handleCheckboxChange('jobCompulsary')}
                        disabled={!formData.jobAssignable}
                        className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2 disabled:opacity-50"
                      />
                      <span className="text-sm font-semibold text-gray-800">Job Compulsory</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-8">Make job assignment mandatory</p>
                  </div>
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#f29f67]" />
                  Visibility Settings
                </h3>
                
                <div className="group">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hide}
                      onChange={() => handleCheckboxChange('hide')}
                      className="w-5 h-5 text-[#f29f67] bg-gray-100 border-gray-300 rounded focus:ring-[#f29f67] focus:ring-2"
                    />
                    <span className="text-sm font-semibold text-gray-800">Hide Account</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-8">Hide this account from general listings</p>
                </div>
              </div>

              {/* Selected Information Display */}
              {(selectedCategory || selectedGroup) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Selected Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory && (
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-800">Category</p>
                        <p className="text-blue-900">{selectedCategory.name} ({selectedCategory.accountType})</p>
                      </div>
                    )}
                    {selectedGroup && (
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-800">Group</p>
                        <p className="text-blue-900">{selectedGroup.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Account Master...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Account Master
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Status Messages */}
          {(isSuccess || isError) && (
            <div className="border-t border-gray-200 p-6 bg-gray-50/50">
              {isSuccess && (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Account master has been created successfully.</p>
                  </div>
                </div>
              )}

              {isError && (
                <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">{error?.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccountMaster;