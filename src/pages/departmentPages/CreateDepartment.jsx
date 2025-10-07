import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateDepartment } from '../../hooks/departmentHooks/departmentHooks';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Building2,
  Hash,
  FileText,
  Users,
  Info
} from 'lucide-react';

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateDepartment();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode = 'Department code is required';
    } else if (formData.departmentCode.length < 2) {
      newErrors.departmentCode = 'Department code must be at least 2 characters';
    } else if (formData.departmentCode.length > 20) {
      newErrors.departmentCode = 'Department code must be less than 20 characters';
    } else if (!/^[A-Z0-9_-]+$/i.test(formData.departmentCode)) {
      newErrors.departmentCode = 'Department code can only contain letters, numbers, hyphens, and underscores';
    }

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department name is required';
    } else if (formData.departmentName.length < 2) {
      newErrors.departmentName = 'Department name must be at least 2 characters';
    } else if (formData.departmentName.length > 100) {
      newErrors.departmentName = 'Department name must be less than 100 characters';
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
      departmentCode: formData.departmentCode.trim(),
      departmentName: formData.departmentName.trim()
    };

    mutate(submitData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/departments');
        }, 2000);
      },
    });
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  // Auto-generate code from name
  const generateCodeFromName = () => {
    if (formData.departmentName && !formData.departmentCode) {
      const code = formData.departmentName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 10);
      
      handleInputChange('departmentCode', code);
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
            Back to Departments
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#f29f67] rounded-xl shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Department
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new department to your organization structure</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Department Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-500" />
                Department Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Department Code */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-teal-500" />
                    Department Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.departmentCode}
                    onChange={(e) => handleInputChange('departmentCode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.departmentCode 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="DEPT001"
                    maxLength="20"
                  />
                  {errors.departmentCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.departmentCode}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Use letters, numbers, hyphens, and underscores only (2-20 characters)
                  </p>
                </div>

                {/* Department Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-500" />
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => handleInputChange('departmentName', e.target.value)}
                    onBlur={generateCodeFromName}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      errors.departmentName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="Human Resources"
                    maxLength="100"
                  />
                  {errors.departmentName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.departmentName}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the full department name (2-100 characters)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Summary */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Department Preview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Code</p>
                <p className="text-teal-900 font-mono">{formData.departmentCode || 'Not set'}</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm font-medium text-teal-800">Name</p>
                <p className="text-teal-900">{formData.departmentName || 'Not set'}</p>
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
                  disabled={isPending || !formData.departmentCode.trim() || !formData.departmentName.trim()}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#f29f67] text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Department...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Department
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
                    <p className="text-sm">Department has been created successfully. Redirecting...</p>
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

        {/* Helper Information */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Management Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800">Naming Convention</p>
              <p className="text-gray-700 text-sm">
                Use clear, descriptive names for departments. The system will auto-generate a code if you leave it blank.
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800">Department Codes</p>
              <p className="text-gray-700 text-sm">
                Department codes should be unique and easy to remember. Use abbreviations or acronyms for consistency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;