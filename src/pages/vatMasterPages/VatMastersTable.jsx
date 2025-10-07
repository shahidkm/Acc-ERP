import React, { useState, useMemo, useEffect } from 'react';
import { useGetVatMasters } from '../../hooks/vatMasterHooks/vatMasterHooks';
import {
  Search,
  AlertCircle,
  Folder,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Hash,
  Tag,
  FileText,
  Plus,
  Percent
} from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const VatMastersTable = () => {
  const { data: vatMasters, isLoading, error } = useGetVatMasters();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('vatMasterId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const filteredVatMasters = useMemo(() => {
    if (!vatMasters || vatMasters.length === 0) return [];

    const filtered = vatMasters.filter(vat => {
      const search = searchTerm.toLowerCase();
      return (
        vat.vatCode?.toLowerCase().includes(search) ||
        vat.vatName?.toLowerCase().includes(search)
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
  }, [vatMasters, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredVatMasters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVatMasters = filteredVatMasters.slice(startIndex, startIndex + itemsPerPage);

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
    navigate('/create-vat-master');
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p>Error loading VAT masters. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-full mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">VAT Masters</h1>
            <p className="text-sm text-gray-600">Manage and view VAT master records</p>
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
              placeholder="Search by VAT Code or Name..."
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
                <th onClick={() => handleSort('vatMasterId')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    ID {getSortIcon('vatMasterId')}
                  </div>
                </th>
                <th onClick={() => handleSort('vatCode')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    VAT Code {getSortIcon('vatCode')}
                  </div>
                </th>
                <th onClick={() => handleSort('vatName')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    VAT Name {getSortIcon('vatName')}
                  </div>
                </th>
                <th onClick={() => handleSort('vatPercentage')} className="px-4 py-3 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    Percentage {getSortIcon('vatPercentage')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedVatMasters.map((vat) => (
                <tr key={vat.vatMasterId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-mono">#{vat.vatMasterId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{vat.vatCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{vat.vatName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{vat.vatPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {paginatedVatMasters.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No VAT masters found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new VAT master.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredVatMasters.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVatMasters.length)} of {filteredVatMasters.length}
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
        )}
      </div>
    </div>
  );
};

export default VatMastersTable;
