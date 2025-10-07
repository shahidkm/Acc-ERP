import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateBank } from '../../hooks/bankHooks/bankHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Building,
  Hash,
  FileText,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Info,
  Landmark
} from 'lucide-react';

const CreateBank = () => {
  const [formData, setFormData] = useState({
    bankCode: '',
    bankName: '',
    branch: '',
    address: '',
    ifsc: '',
    accountNo: '',
    contactNo: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateBank();

  const validateForm = () => {
    const newErrors = {};

    // Bank Code validation
    if (!formData.bankCode.trim()) {
      newErrors.bankCode = 'Bank code is required';
    } else if (formData.bankCode.length < 2) {
      newErrors.bankCode = 'Bank code must be at least 2 characters';
    } else if (formData.bankCode.length > 20) {
      newErrors.bankCode = 'Bank code must be less than 20 characters';
    }

    // Bank Name validation
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    } else if (formData.bankName.length < 2) {
      newErrors.bankName = 'Bank name must be at least 2 characters';
    } else if (formData.bankName.length > 100) {
      newErrors.bankName = 'Bank name must be less than 100 characters';
    }

    // Branch validation
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch name is required';
    } else if (formData.branch.length > 100) {
      newErrors.branch = 'Branch name must be less than 100 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
    }

    // IFSC validation
    if (!formData.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      newErrors.ifsc = 'Invalid IFSC code format (e.g., SBIN0123456)';
    }

    // Account Number validation
    if (!formData.accountNo.trim()) {
      newErrors.accountNo = 'Account number is required';
    } else if (!/^[0-9]{9,18}$/.test(formData.accountNo)) {
      newErrors.accountNo = 'Account number must be 9-18 digits';
    }

    // Contact Number validation
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contactNo.replace(/[\s-()]/g, ''))) {
      newErrors.contactNo = 'Invalid contact number format';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      bankCode: formData.bankCode.trim().toUpperCase(),
      bankName: formData.bankName.trim(),
      branch: formData.branch.trim(),
      address: formData.address.trim(),
      ifsc: formData.ifsc.trim().toUpperCase(),
      accountNo: formData.accountNo.trim(),
      contactNo: formData.contactNo.trim(),
      email: formData.email.trim().toLowerCase()
    };

    mutate(submitData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/banks');
        }, 2000);
      },
    });
  };

  const handleCancel = () => {
    navigate('/banks');
  };

  // Auto-generate bank code from bank name
  const generateCodeFromName = () => {
    if (formData.bankName && !formData.bankCode) {
      const code = formData.bankName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .split(/\s+/)
        .map(word => word.substring(0, 3))
        .join('')
        .substring(0, 8);
      
      handleInputChange('bankCode', code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 p-6">
      <Sidebar />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Banks
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <Landmark className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Bank
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new bank with complete banking details and contact information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Bank Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-500" />
                Basic Bank Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-emerald-500" />
                    Bank Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankCode}
                    onChange={(e) => handleInputChange('bankCode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                      errors.bankCode 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="HDFC001"
                    maxLength="20"
                  />
                  {errors.bankCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.bankCode}
                    </p>
                  )}
                </div>

                {/* Bank Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    onBlur={generateCodeFromName}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                      errors.bankName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="HDFC Bank"
                    maxLength="100"
                  />
                  {errors.bankName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.bankName}
                    </p>
                  )}
                </div>

                {/* Branch */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-500" />
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                      errors.branch 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="Main Branch"
                    maxLength="100"
                  />
                  {errors.branch && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.branch}
                    </p>
                  )}
                </div>

                {/* IFSC Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ifsc}
                    onChange={(e) => handleInputChange('ifsc', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-mono ${
                      errors.ifsc 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="HDFC0000123"
                    maxLength="11"
                  />
                  {errors.ifsc && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.ifsc}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Format: First 4 letters (Bank), 5th digit (0), Last 6 characters (Branch)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account & Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Account & Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-emerald-500" />
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange('accountNo', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-mono ${
                      errors.accountNo 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="123456789012"
                    maxLength="18"
                  />
                  {errors.accountNo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.accountNo}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                      errors.contactNo 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.contactNo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.contactNo}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="group md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-emerald-500'
                    }`}
                    placeholder="contact@hdfcbank.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-500" />
                Address Information
              </h3>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  Branch Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 ${
                    errors.address 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                  placeholder="123 Banking Street, Financial District, City - 400001, State, Country"
                  maxLength="500"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.address}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Include complete address with postal code (max 500 characters)
                </p>
              </div>
            </div>
          </div>

          {/* Form Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Bank Details Preview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-emerald-800">Bank Code</p>
                <p className="text-emerald-900 font-mono">{formData.bankCode || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-emerald-800">Bank Name</p>
                <p className="text-emerald-900">{formData.bankName || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-emerald-800">Branch</p>
                <p className="text-emerald-900">{formData.branch || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-emerald-800">IFSC Code</p>
                <p className="text-emerald-900 font-mono">{formData.ifsc || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Bank...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Bank
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        {(isSuccess || isError) && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md">
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">Bank has been created successfully. Redirecting...</p>
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

export default CreateBank;