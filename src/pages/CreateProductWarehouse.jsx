import React, { useState } from "react";
import { useGetProducts } from "../hooks/productHooks/useGetProducts";
import { useGetWarehouses } from "../hooks/productHooks/warehouseHooks/useGetWarehouse";
import { useCreateProductWarehouse } from "../hooks/productHooks/warehouseHooks/useCreateProductWarehouse";
import ProductDisplay from "../components/productComponent/productDisplay";

function CreateProductWarehouse() {
  const [formData, setFormData] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading: loadingProducts } = useGetProducts();
  const { data: warehouses = [], isLoading: loadingWarehouses } = useGetWarehouses();
  const {
    mutate: createProductWarehouse,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreateProductWarehouse();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "productId") {
      const selected = products.find((p) => p.productId === parseInt(value));
      setSelectedProduct(selected || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProductWarehouse({
      productId: formData.productId,
      warehouseId: formData.warehouseId,
      quantity: formData.quantity,
    });
  };

  return (
    <div className="h-screen w-[90vw] bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Create Product Warehouse
        </h2>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            {/* Left Column - Product Selection and Display */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Product Selection
              </h3>

              {/* Product Select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a product...</option>
                  {loadingProducts ? (
                    <option key="loading-product">Loading products...</option>
                  ) : (
                    products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Product Display */}
              <div className="max-h-[65vh]  flex-1 overflow-y-auto">
                {selectedProduct ? (
                  <div>
                    <h4 className="text-lg font-medium mb-4 text-gray-800">
                      Product Details
                    </h4>
                    <ProductDisplay id={selectedProduct.productId} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">
                      Select a product to view details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Form Inputs */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Warehouse & Quantity
              </h3>

              <div className="flex-1 space-y-8 overflow-y-auto">
                {/* Warehouse Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warehouse Location
                  </label>
                  <select
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a warehouse...</option>
                    {loadingWarehouses ? (
                      <option key="loading-warehouse">Loading warehouses...</option>
                    ) : (
                      warehouses.map((warehouse) => (
                        <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                          {warehouse.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the initial stock quantity for this product in the selected warehouse
                  </p>
                </div>

                {/* Success/Error Messages */}
                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ Product warehouse created successfully!
                    </p>
                  </div>
                )}

                {isError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">
                      ❌ Error: {error?.message || "Something went wrong."}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    !formData.productId ||
                    !formData.warehouseId ||
                    !formData.quantity
                  }
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-medium"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Product Warehouse"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductWarehouse;
