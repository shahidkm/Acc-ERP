import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateCurrency } from '../../hooks/currencyHooks/currencyHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Hash,
  FileText,
  Percent,
  Info,
  BookOpenCheck,
  Languages
} from 'lucide-react';

const CreateCurrency = () => {
  const [formData, setFormData] = useState({
    currencyCode: '',
    currencyName: '',
    currencyRate: '',
    decimalName: '',
    fraCode: '',
    decimalPlace: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateCurrency();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currencyCode.trim()) {
      newErrors.currencyCode = 'Currency code is required';
    }

    if (!formData.currencyName.trim()) {
      newErrors.currencyName = 'Currency name is required';
    }

    if (!formData.currencyRate || isNaN(formData.currencyRate)) {
      newErrors.currencyRate = 'Currency rate must be a valid number';
    }

    if (!formData.decimalName.trim()) {
      newErrors.decimalName = 'Decimal name is required';
    }

    if (!formData.fraCode.trim()) {
      newErrors.fraCode = 'FRA code is required';
    }

    if (!formData.decimalPlace || isNaN(formData.decimalPlace)) {
      newErrors.decimalPlace = 'Decimal place must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      currencyCode: formData.currencyCode.trim().toUpperCase(),
      currencyName: formData.currencyName.trim(),
      currencyRate: parseFloat(formData.currencyRate),
      decimalName: formData.decimalName.trim(),
      fraCode: formData.fraCode.trim().toUpperCase(),
      decimalPlace: parseInt(formData.decimalPlace)
    };

    mutate(payload, {
      onSuccess: () => {
        setTimeout(() => navigate('/currencies'), 2000);
      },
    });
  };

  const handleCancel = () => navigate('/currencies');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 p-6">
      <Sidebar />

      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Currencies
        </button>

        <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <Languages className="text-[#f29f67]" />
              Create Currency
            </h1>
            <p className="text-gray-600 text-sm mt-2">Add a new currency with details like rate, code, and decimals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Currency Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Currency Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.currencyCode}
                    onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="USD"
                    maxLength="10"
                  />
                </div>
                {errors.currencyCode && <p className="text-red-500 text-sm mt-1">{errors.currencyCode}</p>}
              </div>

              {/* Currency Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Currency Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.currencyName}
                    onChange={(e) => handleInputChange('currencyName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="US Dollar"
                  />
                </div>
                {errors.currencyName && <p className="text-red-500 text-sm mt-1">{errors.currencyName}</p>}
              </div>

              {/* Currency Rate */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Currency Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={formData.currencyRate}
                    onChange={(e) => handleInputChange('currencyRate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="1.00"
                    step="any"
                  />
                </div>
                {errors.currencyRate && <p className="text-red-500 text-sm mt-1">{errors.currencyRate}</p>}
              </div>

              {/* Decimal Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Decimal Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.decimalName}
                    onChange={(e) => handleInputChange('decimalName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="Cent"
                  />
                </div>
                {errors.decimalName && <p className="text-red-500 text-sm mt-1">{errors.decimalName}</p>}
              </div>

              {/* FRA Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  FRA Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.fraCode}
                    onChange={(e) => handleInputChange('fraCode', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="USD"
                  />
                </div>
                {errors.fraCode && <p className="text-red-500 text-sm mt-1">{errors.fraCode}</p>}
              </div>

              {/* Decimal Place */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Decimal Place <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={formData.decimalPlace}
                    onChange={(e) => handleInputChange('decimalPlace', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-[#f29f67] transition-all duration-300 bg-white"
                    placeholder="2"
                  />
                </div>
                {errors.decimalPlace && <p className="text-red-500 text-sm mt-1">{errors.decimalPlace}</p>}
              </div>
            </div>

            {/* Preview */}
            {/* <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <Info className="w-5 h-5 text-[#f29f67]" />
                Currency Preview
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">Code</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.currencyCode || 'N/A'}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">Name</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.currencyName || 'N/A'}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.currencyRate || 'N/A'}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">Decimal Name</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.decimalName || 'N/A'}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">FRA Code</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.fraCode || 'N/A'}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-orange-100">
                  <span className="text-xs text-gray-500 block mb-1">Decimal Place</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.decimalPlace || 'N/A'}</span>
                </div>
              </div>
            </div> */}

            {/* Submit Buttons */}
            <div className="flex justify-end mt-8 gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-orange-200 rounded-xl text-gray-700 hover:bg-orange-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 bg-[#f29f67] hover:bg-[#e08d55] text-white font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isPending ? <Loader className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                {isPending ? 'Creating...' : 'Create Currency'}
              </button>
            </div>
          </form>

          {/* Status */}
          {(isSuccess || isError) && (
            <div className="mt-6">
              {isSuccess && (
                <div className="bg-green-100 border border-green-300 p-4 rounded-xl flex items-center gap-3 text-green-800">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Currency created successfully! Redirecting...</span>
                </div>
              )}
              {isError && (
                <div className="bg-red-100 border border-red-300 p-4 rounded-xl flex items-center gap-3 text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error?.message || 'Something went wrong.'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-white rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-[#f29f67]" />
            Currency Setup Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67] mb-2">Currency Code</p>
              <p className="text-gray-700 text-sm">
                Use standard ISO 4217 three-letter codes (e.g., USD, EUR, GBP) for international consistency.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67] mb-2">Exchange Rate</p>
              <p className="text-gray-700 text-sm">
                Enter the conversion rate relative to your base currency. Update regularly for accuracy.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67] mb-2">Decimal Places</p>
              <p className="text-gray-700 text-sm">
                Most currencies use 2 decimal places, but some like JPY use 0, and crypto may use more.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-[#f29f67] mb-2">FRA Code</p>
              <p className="text-gray-700 text-sm">
                Financial Reporting Authority code for regulatory compliance and accurate reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCurrency;