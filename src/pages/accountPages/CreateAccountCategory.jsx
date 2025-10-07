import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateAccountCategory } from '../../hooks/accountHooks/accountHooks';
import {
  Plus,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Tag,
  Users,
  TrendingUp,
  DollarSign,
  Building,
  CreditCard,
  Target
} from 'lucide-react';

const CreateAccountCategory = () => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('');
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useCreateAccountCategory();

  const accountTypeOptions = [
    { 
      value: 'asset', 
      label: 'Asset', 
      icon: Building, 
      description: 'Resources owned by the company',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    { 
      value: 'liability', 
      label: 'Liability', 
      icon: CreditCard, 
      description: 'Debts and obligations',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    { 
      value: 'direct income', 
      label: 'Direct Income', 
      icon: TrendingUp, 
      description: 'Revenue and earnings',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
      { 
      value: 'indirect income', 
      label: 'Indirect Income', 
      icon: TrendingUp, 
      description: 'Revenue and earnings',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    { 
      value: 'direct expense', 
      label: 'Direct Expense', 
      icon: Target, 
      description: 'Business costs and expenditures',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
       { 
      value: 'indirect expense', 
      label: 'Indirect Expense', 
      icon: Target, 
      description: 'Business costs and expenditures',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    { 
      value: 'equity', 
      label: 'Equity', 
      icon: DollarSign, 
      description: 'Owner\'s stake in the company',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { name, accountType },
      {
        onSuccess: () => {
          // Optionally navigate after success
          // navigate('/account-categories');
        },
      }
    );
  };

  const selectedAccountType = accountTypeOptions.find(option => option.value === accountType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/account-categories')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account Categories
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Account Category
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Design your chart of accounts with precision and style</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#f29f67]" />
                  Category Name
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm group-hover:border-gray-300"
                    placeholder="e.g. Current Assets, Operating Expenses"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f29f67]/5 to-transparent pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Choose a descriptive name for your account category</p>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#f29f67]" />
                  Account Type
                  <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accountTypeOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = accountType === option.value;
                    
                    return (
                      <div
                        key={option.value}
                        className={`relative cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'scale-105 shadow-lg' 
                            : 'hover:scale-102 hover:shadow-md'
                        }`}
                        onClick={() => setAccountType(option.value)}
                      >
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? `${option.color} border-2 shadow-lg` 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className={`h-5 w-5 ${
                              isSelected ? option.color.split(' ')[0] : 'text-gray-400'
                            }`} />
                            <span className={`font-semibold ${
                              isSelected ? option.color.split(' ')[0] : 'text-gray-700'
                            }`}>
                              {option.label}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            isSelected ? option.color.split(' ')[0] : 'text-gray-500'
                          }`}>
                            {option.description}
                          </p>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1">
                              <CheckCircle className="h-6 w-6 text-[#f29f67] bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name="accountType"
                          value={option.value}
                          checked={isSelected}
                          onChange={(e) => setAccountType(e.target.value)}
                          className="sr-only"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
                
                {selectedAccountType && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2">
                      <selectedAccountType.icon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Selected: {selectedAccountType.label}</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{selectedAccountType.description}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isPending || !name || !accountType}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Category...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Account Category
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
                    <p className="text-sm">Account category has been created successfully.</p>
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

export default CreateAccountCategory;