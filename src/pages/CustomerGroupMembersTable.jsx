import React, { useState, useMemo } from 'react';
import { useGetCustomerGroupMembers } from '../hooks/customerHooks/useGetCustomerGroupMembers';
import { Search, Plus, Eye, Edit, Trash2, AlertCircle, Users } from 'lucide-react';



function CustomerGroupMembersTable() {
    const { data: groupMembers, isLoading, isError, error } = useGetCustomerGroupMembers();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [filterGroup, setFilterGroup] = useState('all');
    const [sortField, setSortField] = useState('customerName');
    const [sortDirection, setSortDirection] = useState('asc');

    // Filter and search functionality
    const filteredMembers = useMemo(() => {
        if (!groupMembers) return [];

        let filtered = groupMembers.filter(member => {
            const matchesSearch = 
                (member.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (member.customerGroupName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (member.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'active' && member.isActive) ||
                (filterStatus === 'inactive' && !member.isActive);

            const matchesRole = filterRole === 'all' || member.role === filterRole;

            const matchesGroup = filterGroup === 'all' || member.customerGroupName === filterGroup;

            return matchesSearch && matchesStatus && matchesRole && matchesGroup;
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
    }, [groupMembers, searchTerm, filterStatus, filterRole, filterGroup, sortField, sortDirection]);

    // Get unique values for filter dropdowns
    const uniqueRoles = useMemo(() => {
        if (!groupMembers) return [];
        return [...new Set(groupMembers.map(member => member.role).filter(Boolean))];
    }, [groupMembers]);

    const uniqueGroups = useMemo(() => {
        if (!groupMembers) return [];
        return [...new Set(groupMembers.map(member => member.customerGroupName).filter(Boolean))];
    }, [groupMembers]);

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

    const getRoleColor = (role) => {
        if (!role) return 'bg-gray-100 text-gray-600';
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'manager':
                return 'bg-blue-100 text-blue-700';
            case 'member':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Group Members</h3>
                        <p className="text-gray-600">{error?.message || 'Failed to fetch customer group members'}</p>
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
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Group Members</h1>
                            <p className="text-gray-600 mt-1">Manage members across all customer groups</p>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white rounded-lg hover:bg-[#e8935c] transition-colors font-medium">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Member
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
                                placeholder="Search by customer name, group name, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all min-w-32"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Role Filter */}
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all min-w-32"
                        >
                            <option value="all">All Roles</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>

                        {/* Group Filter */}
                        <select
                            value={filterGroup}
                            onChange={(e) => setFilterGroup(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:border-[#f29f67] transition-all min-w-48"
                        >
                            <option value="all">All Groups</option>
                            {uniqueGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-4 text-sm text-gray-600 font-medium">
                        Showing {filteredMembers.length} of {groupMembers?.length || 0} group members
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-[#f29f67] bg-opacity-10 rounded-lg">
                                <Users className="h-6 w-6 text-[#f29f67]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Members</p>
                                <p className="text-lg font-semibold text-gray-900">{groupMembers?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Active Members</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {groupMembers?.filter(m => m.isActive).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Users className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Inactive Members</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {groupMembers?.filter(m => !m.isActive).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Unique Groups</p>
                                <p className="text-lg font-semibold text-gray-900">{uniqueGroups.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filteredMembers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Group Members Found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search terms or filters.' : 'Get started by adding your first group member.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            onClick={() => handleSort('customerName')}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Customer Name
                                                <span className="text-gray-400">{getSortIcon('customerName')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort('customerGroupName')}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Group Name
                                                <span className="text-gray-400">{getSortIcon('customerGroupName')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort('role')}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Role
                                                <span className="text-gray-400">{getSortIcon('role')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort('isActive')}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Status
                                                <span className="text-gray-400">{getSortIcon('isActive')}</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.map((member, index) => (
                                        <tr key={member.customerGroupMemberId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{member.customerName || 'Not specified'}</div>
                                                <div className="text-sm text-gray-500">ID: {member.customerGroupMemberId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{member.customerGroupName || 'Not specified'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                                                    {member.role || 'Not specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    member.isActive 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-[#f29f67] transition-colors rounded">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-[#f29f67] transition-colors rounded">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
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

export default CustomerGroupMembersTable;