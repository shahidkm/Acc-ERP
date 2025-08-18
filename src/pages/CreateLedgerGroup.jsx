import React, { useState } from 'react';
import { 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  CheckCircle, 
  AlertTriangle,
  Loader,
  RotateCcw,
  PlusCircle,
  Info,
  Layers3,
  ChevronRight,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useCreateLedgerGroup } from '../hooks/inventoryHooks/useCreateLedgerGroup';
import Sidebar from '../components/sidebar/Sidebar';

const CreateLedgerGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    nature: 1,
    parentGroupId: 0
  });

  const [errors, setErrors] = useState({});
  
  // Using the custom hook
  const { mutate: createGroup, isPending: isLoading, error, isSuccess } = useCreateLedgerGroup();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nature' || name === 'parentGroupId' ? parseInt(value) || 0 : value
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
      newErrors.name = 'Ledger group name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (formData.nature < 1 || formData.nature > 4) {
      newErrors.nature = 'Please select a valid nature';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      createGroup(formData, {
        onSuccess: (data) => {
          // Reset form on success
          setFormData({
            name: '',
            nature: 1,
            parentGroupId: 0
          });
          setErrors({});
          // Success state will be handled by isSuccess from the hook
        },
        onError: (error) => {
          // Error will be handled by the error state from the hook
          console.error('Failed to create ledger group:', error);
        }
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      nature: 1,
      parentGroupId: 0
    });
    setErrors({});
  };

  const natureOptions = [
    { 
      value: 1, 
      label: 'Assets', 
      description: 'Resources owned by the business',
      icon: Landmark,
      color: 'custom',
      bgColor: '#f8f8f9',
      borderColor: '#e5e5e7',
      textColor: '#1e1e2c'
    },
    { 
      value: 2, 
      label: 'Liabilities', 
      description: 'Debts and obligations',
      icon: CreditCard,
      color: 'custom',
      bgColor: '#f8f8f9',
      borderColor: '#e5e5e7',
      textColor: '#1e1e2c'
    },
    { 
      value: 3, 
      label: 'Income', 
      description: 'Revenue and earnings',
      icon: Zap,
      color: 'custom',
      bgColor: '#f8f8f9',
      borderColor: '#e5e5e7',
      textColor: '#1e1e2c'
    },
    { 
      value: 4, 
      label: 'Expenses', 
      description: 'Costs and expenditures',
      icon: Target,
      color: 'custom',
      bgColor: '#f8f8f9',
      borderColor: '#e5e5e7',
      textColor: '#1e1e2c'
    }
  ];

  const parentGroups = [
    { id: 0, name: 'No Parent Group (Root Level)' },
    { id: 1, name: 'Current Assets' },
    { id: 2, name: 'Fixed Assets' },
    { id: 3, name: 'Current Liabilities' },
    { id: 4, name: 'Long Term Liabilities' },
    { id: 5, name: 'Operating Income' },
    { id: 6, name: 'Other Income' },
    { id: 7, name: 'Operating Expenses' },
    { id: 8, name: 'Administrative Expenses' }
  ];

  return (
    <div className="min-h-screen bg-white">
        <Sidebar/>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: '#f29f67' }}>
              <Layers3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Ledger Group</h1>
              <p className="text-gray-600 mt-1">Organize your accounts with structured ledger groups</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Ledger Management</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-medium" style={{ color: '#f29f67' }}>Create Group</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Status Messages */}
        {isSuccess && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
              <div>
                <h3 className="text-emerald-800 font-semibold">Success!</h3>
                <p className="text-emerald-700 text-sm">Ledger group has been created successfully.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 text-sm">
                  {error?.message || error?.response?.data?.message || 'Failed to create ledger group'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-8">
                <div className="space-y-8">
                    {/* Group Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
                        Group Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white transition-all duration-200 ${
                          errors.name 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-orange-500'
                        }`}
                        placeholder="e.g., Bank Accounts, Office Expenses, Fixed Assets"
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <div className="mt-2 flex items-center text-red-600 text-sm">
                          <AlertTriangle className="h-5 w-5 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* Nature Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-4">
                        Account Nature *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {natureOptions.map((option) => {
                          const IconComponent = option.icon;
                          const isSelected = formData.nature === option.value;
                          
                          return (
                            <div
                              key={option.value}
                              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                isSelected
                                  ? 'border-gray-300 bg-gray-50'
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              style={isSelected ? { 
                                backgroundColor: option.bgColor, 
                                borderColor: option.borderColor 
                              } : {}}
                              onClick={() => !isLoading && handleInputChange({ target: { name: 'nature', value: option.value } })}
                            >
                              <div className="flex items-start">
                                <div className={`p-2 rounded-lg mr-3 ${isSelected ? '' : 'bg-gray-100'}`}
                                     style={isSelected ? { backgroundColor: option.bgColor } : {}}>
                                  <IconComponent className={`h-6 w-6 ${isSelected ? '' : 'text-gray-600'}`} 
                                                style={isSelected ? { color: option.textColor } : {}} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h3 className="font-semibold text-gray-900">{option.label}</h3>
                                    <input
                                      type="radio"
                                      name="nature"
                                      value={option.value}
                                      checked={isSelected}
                                      onChange={handleInputChange}
                                      disabled={isLoading}
                                      className="ml-auto h-5 w-5"
                                      style={{ accentColor: '#f29f67' }}
                                    />
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.nature && (
                        <div className="mt-3 flex items-center text-red-600 text-sm">
                          <AlertTriangle className="h-5 w-5 mr-1" />
                          {errors.nature}
                        </div>
                      )}
                    </div>

                    {/* Parent Group Selection */}
                    <div>
                      <label htmlFor="parentGroupId" className="block text-sm font-semibold text-gray-900 mb-3">
                        Parent Group
                      </label>
                      <select
                        id="parentGroupId"
                        name="parentGroupId"
                        value={formData.parentGroupId}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:bg-white transition-all duration-200 disabled:opacity-50"
                        style={{ borderColor: formData.parentGroupId !== 0 ? '#f29f67' : '' }}
                      >
                        {parentGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500 flex items-start">
                        <Info className="h-5 w-5 mr-1 mt-0.5 text-gray-400" />
                        Select a parent to create a sub-group, or choose "No Parent Group" for root level
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center px-8 py-3 text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: '#f29f67',
                          focusRingColor: '#f29f67'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader className="h-6 w-6 mr-2 animate-spin" />
                            Creating Group...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-6 w-6 mr-2" />
                            Create Ledger Group
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="sm:w-auto flex items-center justify-center px-8 py-3 border-2 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                        style={{ 
                          borderColor: '#f29f67',
                          color: '#f29f67'
                        }}
                      >
                        <RotateCcw className="h-6 w-6 mr-2" />
                        Reset Form
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border rounded-2xl p-6" style={{ borderColor: '#f29f67' }}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#f7c7a3' }}>
                  <Info className="h-6 w-6" style={{ color: '#f29f67' }} />
                </div>
                <h3 className="font-semibold text-gray-900">What is a Ledger Group?</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ledger groups help organize your chart of accounts by collecting similar account types together. 
                This creates a structured hierarchy that makes financial reporting and analysis much more efficient.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border rounded-2xl p-6" style={{ borderColor: '#f29f67' }}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#f7c7a3' }}>
                  <Layers3 className="h-6 w-6" style={{ color: '#f29f67' }} />
                </div>
                <h3 className="font-semibold text-gray-900">Creating Sub-Groups</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Build hierarchical structures by selecting parent groups. This enables detailed categorization 
                for comprehensive financial management and precise reporting capabilities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border rounded-2xl p-6" style={{ borderColor: '#f29f67' }}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#f7c7a3' }}>
                  <Award className="h-6 w-6" style={{ color: '#f29f67' }} />
                </div>
                <h3 className="font-semibold text-gray-900">Best Practices</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#f29f67' }}></span>
                  Use descriptive, clear names
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#f29f67' }}></span>
                  Group similar account types
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#f29f67' }}></span>
                  Maintain logical hierarchy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLedgerGroup;