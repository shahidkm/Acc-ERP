import React, { useState } from 'react';
import { useCreateCategory } from '../hooks/productHooks/categoryHooks/useCreateHook';
// import { AlertCircle, CheckCircle } from 'lucide-react'; // Optional: icons for alerts

export default function CreateCategory() {
  const { mutate, isLoading, isError, isSuccess } = useCreateCategory(); // <-- fixed here

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    entryBy: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.entryBy.trim()) {
      newErrors.entryBy = 'Entry by field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    const createCategoryDto = {
      Name: formData.name.trim(),
      Description: formData.description.trim(),
      IsActive: formData.isActive,
      EntryBy: formData.entryBy.trim()
    };

    mutate(createCategoryDto, {
      onSuccess: () => {
        setSubmitStatus('success');
        setFormData({
          name: '',
          description: '',
          isActive: true,
          entryBy: ''
        });
      },
      onError: () => {
        setSubmitStatus('error');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
      entryBy: ''
    });
    setErrors({});
    setSubmitStatus('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Category</h1>
          <p className="text-gray-600">Add a new category to your AxisERP system</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mx-auto">
          <div className="bg-[#f29f67] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Category Information</h2>
          </div>

          <div className="p-6 space-y-6" onKeyPress={handleKeyPress}>
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  {/* <AlertCircle size={16} /> */}
                  {errors.name}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description of the category"
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  {/* <AlertCircle size={16} /> */}
                  {errors.description}
                </div>
              )}
            </div>

            {/* EntryBy Field */}
            <div className="space-y-2">
              <label htmlFor="entryBy" className="block text-sm font-medium text-gray-700">
                Entry By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="entryBy"
                name="entryBy"
                value={formData.entryBy}
                onChange={handleChange}
                placeholder="Enter user who is adding this category"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.entryBy ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.entryBy && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  {/* <AlertCircle size={16} /> */}
                  {errors.entryBy}
                </div>
              )}
            </div>

            {/* Is Active Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className={`ml-3 text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {formData.isActive ? 'Category will be available for use' : 'Category will be disabled'}
              </p>
            </div>

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {/* <CheckCircle size={20} /> */}
                <span>Category created successfully!</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {/* <AlertCircle size={20} /> */}
                <span>Failed to create category. Please try again.</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Fields marked with <span className="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  );
}