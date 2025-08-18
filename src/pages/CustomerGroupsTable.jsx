import React, { useState, useMemo } from 'react';
import { useGetCustomerGroups } from '../hooks/customerHooks/useGetCustomerGroup';
import { Search, Plus, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';

function CustomerGroupsTable() {
    const { data: customerGroups, isLoading, isError, error } = useGetCustomerGroups();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterIndustry, setFilterIndustry] = useState('all');
    const [sortField, setSortField] = useState('groupName');
    const [sortDirection, setSortDirection] = useState('asc');

    // Filter and search functionality
    const filteredGroups = useMemo(() => {
        if (!customerGroups) return [];

        let filtered = customerGroups.filter(group => {
            const matchesSearch = 
                (group.groupName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (group.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (group.groupType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (group.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'active' && group.isActive) ||
                (filterStatus === 'inactive' && !group.isActive);

            const matchesIndustry = filterIndustry === 'all' || group.industry === filterIndustry;

            return matchesSearch && matchesStatus && matchesIndustry;
        });

        // Sort functionality
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            // Handle null values
            if (aValue === null || aValue === undefined) aValue = '';
            if (bValue === null || bValue === undefined) bValue = '';
            
            // Convert to string for comparison if needed
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            
            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [customerGroups, searchTerm, filterStatus, filterIndustry, sortField, sortDirection]);

    // Get unique industries for filter dropdown
    const industries = useMemo(() => {
        if (!customerGroups) return [];
        return [...new Set(customerGroups.map(group => group.industry).filter(Boolean))];
    }, [customerGroups]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'Not specified';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-full mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="h-12 bg-gray-300 rounded mb-6"></div>
                        <div className="h-96 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-full mx-auto">
                    <div className="text-center py-12">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Customer Groups</h3>
                        <p className="text-gray-600">Failed to fetch customer groups</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Sidebar/>
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Groups</h1>
                            <p className="text-gray-600 mt-1">Manage and organize your customer segments</p>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors font-medium">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Group
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search groups by name, description, type, or industry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-32"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Industry Filter */}
                        <select
                            value={filterIndustry}
                            onChange={(e) => setFilterIndustry(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-40"
                        >
                            <option value="all">All Industries</option>
                            {industries.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-4 text-sm text-gray-600 font-medium">
                        Showing {filteredGroups.length} of {customerGroups?.length || 0} customer groups
                    </div>
                </div>

                {/* Table */}
                {filteredGroups.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customer Groups Found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first customer group.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            onClick={() => handleSort('groupName')}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Group Name
                                                <span className="text-gray-400">{getSortIcon('groupName')}</span>
                                            </div>
                                        </th>
                                        {/* <th 
                                          
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Description
                                               
                                            </div>
                                        </th> */}
                                        <th 
                                            
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Type
                                              
                                            </div>
                                        </th>
                                        <th 
                                         
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Industry
                                                
                                            </div>
                                        </th>
                                        {/* <th 
                                       
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Members
                                               
                                            </div>
                                        </th> */}
                                        {/* <th 
                                           
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Revenue
                                         
                                            </div>
                                        </th> */}
                                        {/* <th 
                                           
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Avg Order
                                          
                                            </div>
                                        </th> */}
                                        {/* <th 
                                          
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Priority
                                            
                                            </div>
                                        </th> */}
                                        {/* <th 
                                      
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Communication
                                         
                                            </div>
                                        </th> */}
                                        <th 
                                        
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Status
                                             
                                            </div>
                                        </th>
                                        {/* <th 
                                       
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Created
                                    
                                            </div>
                                        </th> */}
                                    
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredGroups.map((group, index) => (
                                        <tr key={group.customerGroupId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{group.groupName || 'Not specified'}</div>
                                                <div className="text-sm text-gray-500">ID: {group.customerGroupId}</div>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {group.description || 'Not specified'}
                                                </div>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{group.groupType || 'Not specified'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{group.industry || 'Not specified'}</div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {group.memberCount !== null && group.memberCount !== undefined ? group.memberCount.toLocaleString() : 'Not specified'}
                                                </div>
                                            </td> */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{formatCurrency(group.totalRevenue)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatCurrency(group.averageOrderValue)}</div>
                                            </td> */}
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="text-sm text-gray-900">{group.priorityLevel || 'Not specified'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{group.preferredCommunicationChannel || 'Not specified'}</div>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="text-sm text-gray-900">{group.status || 'Not specified'}</div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(group.createdDate)}</div>
                                                <div className="text-xs text-gray-500">by {group.createdBy || 'Not specified'}</div>
                                            </td> */}
                                       
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerGroupsTable;