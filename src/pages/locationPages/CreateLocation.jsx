import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateLocation } from '../../hooks/locationHooks/locationHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Hash,
  FileText,
  Flag,
  ToggleLeft,
  ToggleRight,
  UserCheck
} from 'lucide-react';
import { useGetCustomers } from '../../hooks/customerHooks/useGetCustomers';

const CreateLocation = () => {
  const [formData, setFormData] = useState({
    locationCode: '',
    locationName: '',
    default: false,
    consignmentLocation: false,
    customerId: ''
  });

  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateLocation();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.locationCode.trim()) {
      newErrors.locationCode = 'Location code is required';
    } else if (formData.locationCode.length < 2) {
      newErrors.locationCode = 'Location code must be at least 2 characters';
    } else if (formData.locationCode.length > 20) {
      newErrors.locationCode = 'Location code must be less than 20 characters';
    } else if (!/^[A-Z0-9_-]+$/i.test(formData.locationCode)) {
      newErrors.locationCode = 'Only letters, numbers, hyphens, and underscores are allowed';
    }

    if (!formData.locationName.trim()) {
      newErrors.locationName = 'Location name is required';
    } else if (formData.locationName.length < 2) {
      newErrors.locationName = 'Location name must be at least 2 characters';
    } else if (formData.locationName.length > 100) {
      newErrors.locationName = 'Location name must be less than 100 characters';
    }

    if (!formData.customerId || isNaN(Number(formData.customerId))) {
      newErrors.customerId = 'Customer ID must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      locationCode: formData.locationCode.trim(),
      locationName: formData.locationName.trim(),
      default: formData.default,
      consignmentLocation: formData.consignmentLocation,
      customerId: Number(formData.customerId)
    };

    mutate(submitData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/locations');
        }, 2000);
      }
    });
  };

  const handleCancel = () => {
    navigate('/locations');
  };

  const generateCodeFromName = () => {
    if (formData.locationName && !formData.locationCode) {
      const code = formData.locationName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 10);
      handleInputChange('locationCode', code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 p-6">
      <Sidebar />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Locations
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Location
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new location to the system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#f29f67]" />
                Location Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Location Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-[#f29f67]" />
                    Location Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.locationCode}
                    onChange={(e) => handleInputChange('locationCode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.locationCode
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="LOC001"
                    maxLength={20}
                  />
                  {errors.locationCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.locationCode}
                    </p>
                  )}
                </div>

                {/* Location Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#f29f67]" />
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => handleInputChange('locationName', e.target.value)}
                    onBlur={generateCodeFromName}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.locationName
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="Main Warehouse"
                    maxLength={100}
                  />
                  {errors.locationName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.locationName}
                    </p>
                  )}
                </div>

                {/* Customer ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[#f29f67]" />
                    Customer ID <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    required
                    disabled={customersLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="">Select customer...</option>
                    {customers?.map((customer) => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} ({customer.code})
                                          </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.customerId}
                    </p>
                  )}
                </div>

                {/* Default & Consignment Location */}
                <div className="flex flex-col gap-6 mt-2">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
                    {formData.default ? <ToggleRight className="text-teal-500" /> : <ToggleLeft className="text-gray-400" />}
                    <span>Set as Default Location</span>
                    <input
                      type="checkbox"
                      checked={formData.default}
                      onChange={(e) => handleInputChange('default', e.target.checked)}
                      className="hidden"
                    />
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
                    {formData.consignmentLocation ? <ToggleRight className="text-teal-500" /> : <ToggleLeft className="text-gray-400" />}
                    <span>Is Consignment Location?</span>
                    <input
                      type="checkbox"
                      checked={formData.consignmentLocation}
                      onChange={(e) => handleInputChange('consignmentLocation', e.target.checked)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isPending ||
                  !formData.locationCode.trim() ||
                  !formData.locationName.trim()
                }
                className="inline-flex items-center px-8 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Creating Location...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    Create Location
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Toast */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-[#f29f67]/10 border border-[#f29f67]/40 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-[#f29f67]">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Location created successfully. Redirecting...</p>
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
      </div>
    </div>
  );
};

export default CreateLocation;

