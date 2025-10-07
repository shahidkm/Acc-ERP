import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { useCreateCountry } from '../../hooks/countryHooks/countryHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Globe,
  Hash,
  Phone,
  ToggleLeft,
  ToggleRight,
  Flag
} from 'lucide-react';

const CreateCountry = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateCountry();

  const [formData, setFormData] = useState({
    countryCode: '',
    countryName: '',
    isoCode: '',
    phoneCode: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country code is required';
    }

    if (!formData.countryName.trim()) {
      newErrors.countryName = 'Country name is required';
    }

    if (!formData.isoCode.trim()) {
      newErrors.isoCode = 'ISO code is required';
    }

    if (!formData.phoneCode.trim()) {
      newErrors.phoneCode = 'Phone code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      countryCode: formData.countryCode.trim().toUpperCase(),
      countryName: formData.countryName.trim(),
      isoCode: formData.isoCode.trim().toUpperCase(),
      phoneCode: formData.phoneCode.trim()
    };

    mutate(payload, {
      onSuccess: () => {
        setTimeout(() => navigate('/countries'), 2000);
      }
    });
  };

  const handleCancel = () => {
    navigate('/countries');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <Sidebar />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Countries
          </button>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl shadow-lg" style={{ background: '#f29f67' }}>
                <Flag className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Country
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new country to the system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: '#f29f67' }} />
                Country Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Country Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Country Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.countryCode
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    style={!errors.countryCode ? { '--tw-ring-color': 'rgba(242, 159, 103, 0.2)' } : {}}
                    placeholder="US"
                    maxLength={10}
                  />
                  {errors.countryCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.countryCode}
                    </p>
                  )}
                </div>

                {/* Country Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Flag className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Country Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.countryName}
                    onChange={(e) => handleInputChange('countryName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.countryName
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="United States"
                    maxLength={100}
                  />
                  {errors.countryName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.countryName}
                    </p>
                  )}
                </div>

                {/* ISO Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" style={{ color: '#f29f67' }} />
                    ISO Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.isoCode}
                    onChange={(e) => handleInputChange('isoCode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.isoCode
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="USA"
                    maxLength={3}
                  />
                  {errors.isoCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.isoCode}
                    </p>
                  )}
                </div>

                {/* Phone Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Phone Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phoneCode}
                    onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.phoneCode
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="+1"
                  />
                  {errors.phoneCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.phoneCode}
                    </p>
                  )}
                </div>

                {/* Is Active Toggle */}
                <div className="flex items-center gap-3 mt-4">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 cursor-pointer">
                    {formData.isActive ? (
                      <ToggleRight className="h-6 w-6" style={{ color: '#f29f67' }} />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                    <span>Is Active</span>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !formData.countryCode || !formData.countryName}
                className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                style={{ background: '#f29f67' }}
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Creating Country...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    Create Country
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Toasts */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Country created successfully. Redirecting...</p>
                  </div>
                </div>
              </div>
            )}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error?.message || 'Something went wrong.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCountry;