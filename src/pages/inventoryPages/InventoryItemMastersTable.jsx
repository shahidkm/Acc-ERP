import React, { useState, useMemo, useEffect } from 'react';
import { useGetInventoryItemMasters } from '../../hooks/inventoryHooks/useGetInventoryCategory';
import {
  Search,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  FileText,
  Tag,
  Plus,
  BarChart3
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const InventoryItemMastersTable = () => {
  const { data: items, isLoading, error } = useGetInventoryItemMasters();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    const filtered = items.filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.itemCode?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.modelNo?.toLowerCase().includes(search) ||
        item.serialNo?.toLowerCase().includes(search)
      );
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [items, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleCreateNew = () => {
    navigate('/create-item');
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p>Error loading item masters. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Item Masters</h1>
            <p className="text-sm text-gray-600">Manage and view inventory item masters</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 bg-[#f29f67] text-white font-medium rounded-lg hover:bg-[#e8935c]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, description, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f29f67] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('id')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    ID {getSortIcon('id')}
                  </div>
                </th>
                <th onClick={() => handleSort('itemCode')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Item Code {getSortIcon('itemCode')}
                  </div>
                </th>
                <th onClick={() => handleSort('description')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Description {getSortIcon('description')}
                  </div>
                </th>
                <th onClick={() => handleSort('modelNo')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Model No {getSortIcon('modelNo')}
                  </div>
                </th>
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Batch</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm text-gray-800 font-mono">#{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.itemCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.modelNo}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.dimensionRequired ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.batchRequired ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm px-2 py-1">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemMastersTable;
