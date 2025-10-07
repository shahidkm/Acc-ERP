import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateVatMaster } from '../../hooks/vatMasterHooks/vatMasterHooks';
import { useGetAccountMasters } from '../../hooks/accountHooks/accountHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Percent,
  FileText,
  ToggleRight,
  BadgeDollarSign,
  Banknote,
  Info
} from 'lucide-react';

const CreateVatMaster = () => {
  const [formData, setFormData] = useState({
    vatCode: '',
    vatName: '',
    vatPercentage: '',
    vatInputAccount: '',
    vatOutputAccount: '',
    vatInputOnImport: '',
    vatOutputOnImport: '',
    vatExpenseAccount: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateVatMaster();
  const { data: accountMasters, isLoading: isLoadingAccounts } = useGetAccountMasters();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vatCode.trim()) {
      newErrors.vatCode = 'VAT code is required';
    }
    if (!formData.vatName.trim()) {
      newErrors.vatName = 'VAT name is required';
    }
    if (formData.vatPercentage === '' || isNaN(formData.vatPercentage)) {
      newErrors.vatPercentage = 'Valid VAT percentage is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const parsedData = {
      ...formData,
      vatPercentage: parseFloat(formData.vatPercentage),
      vatInputAccount: formData.vatInputAccount ? parseInt(formData.vatInputAccount) : null,
      vatOutputAccount: formData.vatOutputAccount ? parseInt(formData.vatOutputAccount) : null,
      vatInputOnImport: formData.vatInputOnImport ? parseInt(formData.vatInputOnImport) : null,
      vatOutputOnImport: formData.vatOutputOnImport ? parseInt(formData.vatOutputOnImport) : null,
      vatExpenseAccount: formData.vatExpenseAccount ? parseInt(formData.vatExpenseAccount) : null,
    };

    mutate(parsedData, {
      onSuccess: () => {
        // navigate('/vatmasters');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/vatmasters')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to VAT Masters
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <BadgeDollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create VAT Master
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Define a new VAT rule in the system</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VAT Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#f29f67]" />
                    VAT Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.vatCode}
                    onChange={(e) => handleInputChange('vatCode', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 ${
                      errors.vatCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 group-hover:border-gray-300'
                    }`}
                    placeholder="E.g. VAT001"
                  />
                  {errors.vatCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.vatCode}
                    </p>
                  )}
                </div>

                {/* VAT Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#f29f67]" />
                    VAT Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.vatName}
                    onChange={(e) => handleInputChange('vatName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 ${
                      errors.vatName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 group-hover:border-gray-300'
                    }`}
                    placeholder="Standard VAT, Import VAT etc."
                  />
                  {errors.vatName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.vatName}
                    </p>
                  )}
                </div>

                {/* VAT Percentage */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[#f29f67]" />
                    VAT Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.vatPercentage}
                    onChange={(e) => handleInputChange('vatPercentage', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 ${
                      errors.vatPercentage ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 group-hover:border-gray-300'
                    }`}
                    placeholder="Enter a percentage"
                  />
                  {errors.vatPercentage && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.vatPercentage}
                    </p>
                  )}
                </div>

                {/* Account Dropdown Fields */}
                {[
                  { name: 'vatInputAccount', label: 'VAT Input Account' },
                  { name: 'vatOutputAccount', label: 'VAT Output Account' },
                  { name: 'vatInputOnImport', label: 'VAT Input on Import' },
                  { name: 'vatOutputOnImport', label: 'VAT Output on Import' },
                  { name: 'vatExpenseAccount', label: 'VAT Expense Account' }
                ].map(({ name, label }) => (
                  <div key={name} className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-[#f29f67]" />
                      {label}
                    </label>
                    <select
                      value={formData[name]}
                      onChange={(e) => handleInputChange(name, e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 group-hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoadingAccounts}
                    >
                      <option value="">Select {label}</option>
                      {accountMasters?.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountMasterName} ({account.accountId})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Active Toggle */}
                <div className="flex items-center gap-3 mt-4">
                  <ToggleRight className={`h-6 w-6 ${formData.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  <label className="text-sm font-semibold text-gray-800">Is Active</label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="ml-2 w-5 h-5 text-[#f29f67] focus:ring-[#f29f67]/20 rounded"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/vatmasters')}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || Object.keys(errors).length > 0}
                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isPending ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                        Creating VAT...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3" />
                        Create VAT Master
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Status Messages */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">VAT master has been created successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">{error?.message || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-[#f29f67]" />
            Tips for Creating VAT Masters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Use consistent VAT codes for easier reporting</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Ensure percentages are accurate and comply with regulations</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Link VAT accounts correctly to avoid accounting mismatches</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Deactivate old VAT rules instead of deleting them</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVatMaster;