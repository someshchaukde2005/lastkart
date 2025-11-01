import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, View } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RetailerDashboardProps {
  navigate: (view: View, productId?: number) => void;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState(MOCK_PRODUCTS);

    const retailerProducts = useMemo(() => {
        return products
            .filter(p => p.retailerId === user?.id)
            .map(p => ({
                ...p,
                daysUntilExpiry: Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
            }))
            .sort((a,b) => a.daysUntilExpiry - b.daysUntilExpiry);
    }, [products, user]);

    const expiringSoonCount = useMemo(() => {
        return retailerProducts.filter(p => p.daysUntilExpiry <= 7).length;
    }, [retailerProducts]);

    const handleAddProduct = () => {
        alert("This would open a form to add a new product.");
    };

    const handleEditProduct = (productId: number) => {
        alert(`This would open a form to edit product ${productId}.`);
    };

    const handleDeleteProduct = (productId: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(prev => prev.filter(p => p.id !== productId));
        }
    };
    
    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-800">My Product Listings</h1>
                <button onClick={handleAddProduct} className="flex items-center bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-800 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Product
                </button>
            </div>

            {expiringSoonCount > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                           <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                You have <span className="font-bold">{expiringSoonCount} product(s)</span> expiring within the next 7 days. These items are highlighted below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires In</th>
                            <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {retailerProducts.map(product => {
                            const isExpiringSoon = product.daysUntilExpiry <= 7;
                            return (
                                <tr key={product.id} className={`${isExpiringSoon ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="text-sm text-primary-600 font-semibold">${product.discountedPrice.toFixed(2)}</div>
                                        <div className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">{product.stock}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                                        <span className={`font-semibold ${product.daysUntilExpiry <=3 ? 'text-red-600' : isExpiringSoon ? 'text-yellow-700' : 'text-gray-800'}`}>
                                            {product.daysUntilExpiry} {product.daysUntilExpiry === 1 ? 'day' : 'days'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => handleEditProduct(product.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                                             <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {retailerProducts.length === 0 && (
                 <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-700">No products listed yet</h2>
                    <p className="text-gray-500 mt-2">Click "Add Product" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default RetailerDashboard;