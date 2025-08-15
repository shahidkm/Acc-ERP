import {
    Package, DollarSign, Hash, Archive, CheckCircle,
    XCircle, Tag, Layers
} from 'lucide-react';

import { useGetProductById } from '../../hooks/productHooks/useGetProductById';

const ProductDisplay = ({ id }) => {
    const { data: product, isLoading: loading, isError, error } = useGetProductById(id);

    const ProductCard = ({ product }) => {
        const profit = product.sellingPrice - product.costPrice;
        const profitMargin = ((profit / product.sellingPrice) * 100).toFixed(1);

        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div style={{ backgroundColor: '#1e1e2c' }} className="text-white p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                                <img
                                    src={product.imageUrl || ''}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                                    <p className="text-gray-300 flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${product.isActive ? 'text-green-800' : 'text-red-800'}`}
                                        style={{
                                            backgroundColor: product.isActive ? '#f29f67' : '#ef4444',
                                            color: '#1e1e2c'
                                        }}
                                    >
                                        {product.isActive ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4" />
                                                Inactive
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f29f67' }}>
                                    <Tag className="w-5 h-5" style={{ color: '#1e1e2c' }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="font-semibold">{product.category?.name || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f29f67' }}>
                                    <Layers className="w-5 h-5" style={{ color: '#1e1e2c' }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Unit</p>
                                    <p className="font-semibold">{product.unit?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f29f67' }}>
                                    <Package className="w-5 h-5" style={{ color: '#1e1e2c' }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Stock Level</p>
                                    <p
                                        className={`font-semibold text-lg ${product.stock === 0
                                            ? 'text-red-600'
                                            : product.stock < 20
                                                ? 'text-orange-600'
                                                : 'text-green-600'
                                            }`}
                                    >
                                        {product.stock} units
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg p-6" style={{ backgroundColor: '#1e1e2c', color: 'white' }}>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" style={{ color: '#f29f67' }} />
                            Pricing Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-300 mb-1">Cost Price</p>
                                <p className="text-2xl font-bold text-red-400">${product.costPrice.toFixed(2)}</p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-300 mb-1">Selling Price</p>
                                <p className="text-2xl font-bold" style={{ color: '#f29f67' }}>${product.sellingPrice.toFixed(2)}</p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-300 mb-1">Profit Margin</p>
                                <p className="text-2xl font-bold text-green-400">{profitMargin}%</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-600">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Profit per unit:</span>
                                <span className="font-semibold" style={{ color: '#f29f67' }}>${profit.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {loading && (
                        <div className="bg-white rounded-lg p-8 shadow text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading product data...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-3">
                                <XCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <h3 className="font-semibold text-red-800">Error</h3>
                                    <p className="text-red-700">{error?.message || "Failed to load product"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !isError && product && (
                        <ProductCard product={product} />
                    )}

                    {!loading && !isError && !product && (
                        <div className="bg-white rounded-lg p-8 shadow text-center">
                            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No product found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
