import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateSalesMan } from '../../hooks/salesmanHooks/salesmanHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  FileText,
  Users,
  Building,
  Mail,
  Badge,
  UserCheck,
  Info
} from 'lucide-react';

const CreateSalesman = () => {
  const [formData, setFormData] = useState({
    salesmanName: '',
    address1: '',
    address2: '',
    contactNo: ''
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateSalesMan();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate salesman name
    if (!formData.salesmanName.trim()) {
      newErrors.salesmanName = 'Salesman name is required';
    } else if (formData.salesmanName.trim().length < 2) {
      newErrors.salesmanName = 'Salesman name must be at least 2 characters';
    }

    // Validate contact number
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else {
      // Remove all non-digit characters for validation
      const digitsOnly = formData.contactNo.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        newErrors.contactNo = 'Contact number must be at least 7 digits';
      } else if (digitsOnly.length > 15) {
        newErrors.contactNo = 'Contact number cannot exceed 15 digits';
      }
    }

    // Validate address1 (required)
    if (!formData.address1.trim()) {
      newErrors.address1 = 'Primary address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatContactNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 15 digits (international standard)
    const limited = digitsOnly.slice(0, 15);
    
    // Format based on length
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    if (limited.length <= 10) return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6, 10)}-${limited.slice(10)}`;
  };

  const handleContactNumberChange = (value) => {
    const formattedValue = formatContactNumber(value);
    handleInputChange('contactNo', formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean contact number (remove formatting) before submitting
    const submitData = {
      ...formData,
      contactNo: formData.contactNo.replace(/\D/g, '') // Keep only digits
    };

    mutate(submitData, {
      onSuccess: () => {
        // navigate('/salesmen');
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
            onClick={() => navigate('/salesmen')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Salesmen
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Salesman
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new salesman to your sales team</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#f29f67]" />
                  Personal Information
                </h3>
                
                <div className="space-y-6">
                  {/* Salesman Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Badge className="h-4 w-4 text-[#f29f67]" />
                      Salesman Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.salesmanName}
                      onChange={(e) => handleInputChange('salesmanName', e.target.value)}
                      required
                      className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 ${
                        errors.salesmanName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 group-hover:border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.salesmanName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.salesmanName}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">This will be displayed in sales reports and customer communications</p>
                  </div>

                  {/* Contact Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#f29f67]" />
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNo}
                      onChange={(e) => handleContactNumberChange(e.target.value)}
                      required
                      className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 ${
                        errors.contactNo 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 group-hover:border-gray-300'
                      }`}
                      placeholder="123-456-7890"
                    />
                    {errors.contactNo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contactNo}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">Primary contact number for business communications</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#f29f67]" />
                  Address Information
                </h3>
                
                <div className="space-y-6">
                  {/* Primary Address */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4 text-[#f29f67]" />
                      Primary Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      required
                      rows="3"
                      className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 resize-none ${
                        errors.address1 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 group-hover:border-gray-300'
                      }`}
                      placeholder="Street address, building, apartment number..."
                    />
                    {errors.address1 && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address1}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">Main residential or business address</p>
                  </div>

                  {/* Secondary Address */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#f29f67]" />
                      Secondary Address <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 group-hover:border-gray-300 resize-none"
                      placeholder="Alternative address, PO Box, or additional location details..."
                    />
                    <p className="mt-2 text-xs text-gray-500">Alternative address or additional location information</p>
                  </div>
                </div>
              </div>

              {/* Form Summary */}
              {(formData.salesmanName || formData.contactNo || formData.address1) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Salesman Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800">Personal Details</p>
                      <p className="text-blue-900 font-semibold">{formData.salesmanName || 'Not provided'}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {formData.contactNo || 'No contact number'}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800">Address</p>
                      <p className="text-blue-900 text-sm">
                        {formData.address1 ? formData.address1.substring(0, 50) + (formData.address1.length > 50 ? '...' : '') : 'No address provided'}
                      </p>
                      {formData.address2 && (
                        <p className="text-xs text-blue-600 mt-1">+ Secondary address provided</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/salesmen')}
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
                        Creating Salesman...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3" />
                        Create Salesman
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
                    <p className="text-sm">Salesman has been created successfully.</p>
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

        {/* Help Information */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#f29f67]" />
            Tips for Adding Salesmen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use the full legal name for official documentation and contracts</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ensure contact numbers are active for customer communications</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Primary address is used for official correspondence</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Secondary address can be used for alternative contact methods</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSalesman;