import React from 'react';
import { useGetCustomerGroupById } from '../hooks/customerHooks/useGetCustomerGroupById';
import { User, Users, Building, DollarSign, TrendingUp, Calendar, MessageCircle, FileText, AlertCircle } from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';


const CustomerGroupDetails = () => {
  const { data: customerGroup, isLoading, error } = useGetCustomerGroupById();

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-white">
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#f29f67' }}></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customer Group</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customerGroup) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Group Found</h3>
            <p className="text-gray-600">The requested customer group could not be found</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPriorityColor = (level) => {
    if (level >= 8) return 'text-red-600';
    if (level >= 5) return '#f29f67';
    return 'text-green-600';
  };

  const getPriorityLabel = (level) => {
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar/>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{customerGroup.groupName}</h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  customerGroup.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {customerGroup.isActive ? 'Active' : 'Inactive'}
                </span>
                <span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: '#f29f67' }}
                >
                  ID: {customerGroup.customerGroupId}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Priority Level</div>
              <div className={`text-2xl font-bold`} style={{ color: getPriorityColor(customerGroup.priorityLevel) }}>
                {customerGroup.priorityLevel}/10
              </div>
              <div className="text-sm text-gray-600">{getPriorityLabel(customerGroup.priorityLevel)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" style={{ color: '#f29f67' }} />
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {customerGroup.description || 'No description available'}
              </p>
            </div>

            {/* Group Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Building className="h-5 w-5 mr-2" style={{ color: '#f29f67' }} />
                <h3 className="text-lg font-semibold text-gray-900">Group Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Group Type</label>
                  <p className="text-gray-900 mt-1">{customerGroup.groupType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Industry</label>
                  <p className="text-gray-900 mt-1">{customerGroup.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Communication Channel</label>
                  <div className="flex items-center mt-1">
                    <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-gray-900">{customerGroup.preferredCommunicationChannel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {customerGroup.notes && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 mr-2" style={{ color: '#f29f67' }} />
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{customerGroup.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Metrics & Stats */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 mr-2" style={{ color: '#f29f67' }} />
                <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Members</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{customerGroup.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Total Revenue</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{formatCurrency(customerGroup.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Avg Order Value</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{formatCurrency(customerGroup.averageOrderValue)}</span>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2" style={{ color: '#f29f67' }} />
                <h3 className="text-lg font-semibold text-gray-900">Audit Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900 text-sm mt-1">{formatDate(customerGroup.createdDate)}</p>
                  <p className="text-gray-500 text-xs">by {customerGroup.createdBy}</p>
                </div>
                {customerGroup.modifiedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Modified</label>
                    <p className="text-gray-900 text-sm mt-1">{formatDate(customerGroup.modifiedDate)}</p>
                    <p className="text-gray-500 text-xs">by {customerGroup.modifiedBy}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGroupDetails;