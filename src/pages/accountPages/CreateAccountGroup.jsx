import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useCreateAccountGroup } from '../../hooks/accountHooks/accountHooks';
import { useGetAccountCategories } from '../../hooks/accountHooks/accountHooks';
import {
  Plus,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Tag,
  Folder,
  TrendingUp,
  DollarSign,
  Building,
  CreditCard,
  Target,
  Users,
  FolderPlus,
  ChevronDown
} from 'lucide-react';

const CreateAccountGroup = () => {
  const [name, setName] = useState('');
  const [accountCategoryId, setAccountCategoryId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, error } = useCreateAccountGroup();
  const { data: categories, isLoading: categoriesLoading } = useGetAccountCategories();

  const accountTypeIcons = {
    'asset': Building,
    'liability': CreditCard,
    'income': TrendingUp,
    'expense': Target,
    'equity': DollarSign
  };

  const accountTypeColors = {
    'asset': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'liability': 'text-red-600 bg-red-50 border-red-200',
    'income': 'text-blue-600 bg-blue-50 border-blue-200',
    'expense': 'text-orange-600 bg-orange-50 border-orange-200',
    'equity': 'text-purple-600 bg-purple-50 border-purple-200'
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { 
        name, 
        accountCategoryId: parseInt(accountCategoryId)
      },
      {
        onSuccess: () => {
          // Optionally navigate after success
          // navigate('/account-groups');
        },
      }
    );
  };

  const selectedCategory = categories?.find(cat => cat.id === parseInt(accountCategoryId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Sidebar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/account-groups')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account Groups
          </button>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#f29f67] to-[#e8935c] rounded-xl shadow-lg">
                <FolderPlus className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Account Group
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Organize your accounts into logical groups within categories</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Group Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Folder className="h-4 w-4 text-[#f29f67]" />
                  Group Name
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
                    placeholder="e.g. Cash & Bank, Fixed Assets, Office Expenses"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f29f67]/5 to-transparent pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Choose a descriptive name for your account group</p>
              </div>

              {/* Account Category Selection */}
              <div className="group">
                <label htmlFor="accountCategory" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#f29f67]" />
                  Account Category
                  <span className="text-red-500">*</span>
                </label>
                
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <Loader className="animate-spin h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Loading categories...</span>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <div className="relative">
                    <div className="relative">
                      <select
                        id="accountCategory"
                        value={accountCategoryId}
                        onChange={(e) => setAccountCategoryId(e.target.value)}
                        required
                        className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#f29f67]/20 focus:border-[#f29f67] transition-all duration-300 text-gray-900 shadow-sm group-hover:border-gray-300 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select an account category...
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id.toString()}>
                            {category.name} ({category.accountType})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f29f67]/5 to-transparent pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">No Account Categories Found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please create account categories first before creating groups.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/create-account-category')}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-[#f29f67] text-white text-sm font-medium rounded-lg hover:bg-[#e8935c] transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Category
                    </button>
                  </div>
                )}
                
                <p className="mt-2 text-sm text-gray-500">Select the parent category for this account group</p>
                
                {selectedCategory && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${
                        accountTypeColors[selectedCategory.accountType?.toLowerCase()]?.split(' ')[1] || 'bg-gray-100'
                      }`}>
                        {React.createElement(
                          accountTypeIcons[selectedCategory.accountType?.toLowerCase()] || Users,
                          { 
                            className: `h-4 w-4 ${
                              accountTypeColors[selectedCategory.accountType?.toLowerCase()]?.split(' ')[0] || 'text-gray-400'
                            }`
                          }
                        )}
                      </div>
                      <span className="font-medium text-blue-900">
                        {selectedCategory.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full font-medium">
                        {selectedCategory.accountType}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      This group will be organized under the {selectedCategory.name} category
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isPending || !name || !accountCategoryId}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f29f67] to-[#e8935c] text-white font-semibold rounded-xl hover:from-[#e8935c] to-[#d17d4a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Creating Group...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Account Group
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
                    <p className="text-sm">Account group has been created successfully.</p>
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

export default CreateAccountGroup;