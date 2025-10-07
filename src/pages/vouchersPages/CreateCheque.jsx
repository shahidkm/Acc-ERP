import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { useCreateCheque } from '../../hooks/vouchersHooks/vouchersHook';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Hash,
  Calendar,
  User,
  Users,
  Layout,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  CreditCard
} from 'lucide-react';

const CreateCheque = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useCreateCheque();

  const [formData, setFormData] = useState({
    chequeNo: '',
    chequeDate: new Date().toISOString().split('T')[0],
    payee: '',
    customer: '',
    format: '',
    amountNumber: '',
    aC_Payee: true,
    amountWords: ''
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

    if (!formData.chequeNo.trim()) {
      newErrors.chequeNo = 'Cheque number is required';
    }

    if (!formData.chequeDate) {
      newErrors.chequeDate = 'Cheque date is required';
    }

    if (!formData.payee.trim()) {
      newErrors.payee = 'Payee is required';
    }

    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer is required';
    }

    if (!formData.format.trim()) {
      newErrors.format = 'Format is required';
    }

    if (!formData.amountNumber || formData.amountNumber <= 0) {
      newErrors.amountNumber = 'Valid amount is required';
    }

    if (!formData.amountWords.trim()) {
      newErrors.amountWords = 'Amount in words is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      chequeNo: formData.chequeNo.trim(),
      chequeDate: new Date(formData.chequeDate).toISOString(),
      payee: formData.payee.trim(),
      customer: formData.customer.trim(),
      format: formData.format.trim(),
      amountNumber: parseFloat(formData.amountNumber),
      aC_Payee: formData.aC_Payee,
      amountWords: formData.amountWords.trim()
    };

    mutate(payload, {
      onSuccess: () => {
        setTimeout(() => navigate('/cheques'), 2000);
      }
    });
  };

  const handleCancel = () => {
    navigate('/cheques');
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
            Back to Cheques
          </button>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl shadow-lg" style={{ background: '#f29f67' }}>
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Cheque
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Add a new cheque to the system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: '#f29f67' }} />
                Cheque Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cheque Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Cheque Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.chequeNo}
                    onChange={(e) => handleInputChange('chequeNo', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.chequeNo
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    style={!errors.chequeNo ? { '--tw-ring-color': 'rgba(242, 159, 103, 0.2)' } : {}}
                    placeholder="CHQ001"
                    maxLength={50}
                  />
                  {errors.chequeNo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.chequeNo}
                    </p>
                  )}
                </div>

                {/* Cheque Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Cheque Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.chequeDate}
                    onChange={(e) => handleInputChange('chequeDate', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.chequeDate
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                  />
                  {errors.chequeDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.chequeDate}
                    </p>
                  )}
                </div>

                {/* Payee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Payee <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.payee}
                    onChange={(e) => handleInputChange('payee', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.payee
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="John Doe"
                    maxLength={100}
                  />
                  {errors.payee && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.payee}
                    </p>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.customer
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="Customer Name"
                    maxLength={100}
                  />
                  {errors.customer && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.customer}
                    </p>
                  )}
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Layout className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Format <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.format
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="Standard"
                    maxLength={50}
                  />
                  {errors.format && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.format}
                    </p>
                  )}
                </div>

                {/* Amount Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Amount (Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amountNumber}
                    onChange={(e) => handleInputChange('amountNumber', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.amountNumber
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="1000.00"
                  />
                  {errors.amountNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.amountNumber}
                    </p>
                  )}
                </div>

                {/* Amount Words */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" style={{ color: '#f29f67' }} />
                    Amount (Words) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.amountWords}
                    onChange={(e) => handleInputChange('amountWords', e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-4 transition-all duration-300 ${
                      errors.amountWords
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#f29f67]'
                    }`}
                    placeholder="One Thousand Only"
                    maxLength={200}
                  />
                  {errors.amountWords && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.amountWords}
                    </p>
                  )}
                </div>

                {/* A/C Payee Toggle */}
                <div className="flex items-center gap-3 mt-4">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 cursor-pointer">
                    {formData.aC_Payee ? (
                      <ToggleRight className="h-6 w-6" style={{ color: '#f29f67' }} />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                    <span>A/C Payee</span>
                    <input
                      type="checkbox"
                      checked={formData.aC_Payee}
                      onChange={(e) => handleInputChange('aC_Payee', e.target.checked)}
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
                disabled={isPending}
                className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                style={{ background: '#f29f67' }}
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Creating Cheque...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    Create Cheque
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
                    <p className="text-sm">Cheque created successfully. Redirecting...</p>
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

export default CreateCheque;