import React, { useState } from 'react';
import { Plus, Save, X, ChevronDown } from 'lucide-react';

import {useCreateLedgerGroup} from "../hooks/useCreateLedgerGroup";
import { useGetLedgerGroups } from '../hooks/useGetLedgerGroups';
import Sidebar from '../components/sidebar/Sidebar';

const CreateLedgerGroup = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    alias: '',
    parentGroupId: 0,
    subLedger: '',
    netBalance: '',
    allocateInPurchase: '',
    nature: 0
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const { mutate: createLedgerGroupMutation, isLoading: isCreating, error: createError } = useCreateLedgerGroup();
  const { data: parentGroups, isLoading: isLoadingGroups, error: fetchError } = useGetLedgerGroups();

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }
    
    if (!formData.alias.trim()) {
      newErrors.alias = 'Alias is required';
    }
    
    if (!formData.subLedger.trim()) {
      newErrors.subLedger = 'Sub ledger is required';
    }
    
    if (!formData.netBalance.trim()) {
      newErrors.netBalance = 'Net balance is required';
    }
    
    if (!formData.allocateInPurchase.trim()) {
      newErrors.allocateInPurchase = 'Allocate in purchase is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      createLedgerGroupMutation(formData, {
        onSuccess: () => {
          // Reset form on success
          setFormData({
            groupName: '',
            alias: '',
            parentGroupId: 0,
            subLedger: '',
            netBalance: '',
            allocateInPurchase: '',
            nature: 0
          });
          setErrors({});
          alert('Ledger group created successfully!');
        },
        onError: (error) => {
          console.error('Error creating ledger group:', error);
        }
      });
    }
  };

  const handleReset = () => {
    setFormData({
      groupName: '',
      alias: '',
      parentGroupId: 0,
      subLedger: '',
      netBalance: '',
      allocateInPurchase: '',
      nature: 0
    });
    setErrors({});
    setIsDropdownOpen(false);
  };

  const selectedParentGroup = parentGroups?.find(group => group.groupId === formData.parentGroupId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Sidebar/>
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f29f67] to-orange-400 px-6 py-4">
            <div className="flex items-center">
              <Plus className="text-white mr-3" size={24} />
              <h1 className="text-2xl font-bold text-white">Create Ledger Group</h1>
            </div>
          </div>

          {/* Error Display */}
          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
              <p>Error creating ledger group. Please try again.</p>
            </div>
          )}

          {fetchError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 mx-6 mt-4 rounded">
              <p>Warning: Unable to load parent groups.</p>
            </div>
          )}

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.groupName}
                onChange={(e) => handleInputChange('groupName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all ${
                  errors.groupName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter group name"
                disabled={isCreating}
              />
              {errors.groupName && (
                <p className="mt-1 text-sm text-red-500">{errors.groupName}</p>
              )}
            </div>

            {/* Alias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alias *
              </label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => handleInputChange('alias', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all ${
                  errors.alias ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter alias"
                disabled={isCreating}
              />
              {errors.alias && (
                <p className="mt-1 text-sm text-red-500">{errors.alias}</p>
              )}
            </div>

            {/* Parent Group Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Group
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingGroups || isCreating}
                >
                  <span className={selectedParentGroup ? 'text-gray-900' : 'text-gray-500'}>
                    {isLoadingGroups ? 'Loading...' : 
                     selectedParentGroup ? selectedParentGroup.groupName : 'Select parent group (optional)'}
                  </span>
                  <ChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                </button>

                {isDropdownOpen && !isLoadingGroups && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('parentGroupId', 0);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500 border-b border-gray-100"
                    >
                      No parent group
                    </button>
                    {parentGroups?.map((group) => (
                      <button
                        key={group.groupId}
                        type="button"
                        onClick={() => {
                          handleInputChange('parentGroupId', group.groupId);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          formData.parentGroupId === group.groupId ? 'bg-[#f29f67] bg-opacity-10' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{group.groupName}</div>
                          <div className="text-sm text-gray-500">{group.alias}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub Ledger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Ledger *
              </label>
              <input
                type="text"
                value={formData.subLedger}
                onChange={(e) => handleInputChange('subLedger', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all ${
                  errors.subLedger ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter sub ledger"
                disabled={isCreating}
              />
              {errors.subLedger && (
                <p className="mt-1 text-sm text-red-500">{errors.subLedger}</p>
              )}
            </div>

            {/* Net Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Net Balance *
              </label>
              <input
                type="text"
                value={formData.netBalance}
                onChange={(e) => handleInputChange('netBalance', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all ${
                  errors.netBalance ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter net balance"
                disabled={isCreating}
              />
              {errors.netBalance && (
                <p className="mt-1 text-sm text-red-500">{errors.netBalance}</p>
              )}
            </div>

            {/* Allocate in Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocate in Purchase *
              </label>
              <input
                type="text"
                value={formData.allocateInPurchase}
                onChange={(e) => handleInputChange('allocateInPurchase', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all ${
                  errors.allocateInPurchase ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter allocate in purchase"
                disabled={isCreating}
              />
              {errors.allocateInPurchase && (
                <p className="mt-1 text-sm text-red-500">{errors.allocateInPurchase}</p>
              )}
            </div>

            {/* Nature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nature
              </label>
              <select
                value={formData.nature}
                onChange={(e) => handleInputChange('nature', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating}
              >
                <option value={0}>Debit</option>
                <option value={1}>Credit</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating}
                className="flex-1 bg-[#f29f67] hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2" size={20} />
                {isCreating ? 'Creating...' : 'Create Group'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={isCreating}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="mr-2" size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default CreateLedgerGroup;