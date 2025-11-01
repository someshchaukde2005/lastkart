import React from 'react';
import { MOCK_PRODUCTS, MOCK_USERS } from '../constants';
import { View } from '../types';
import { useCart } from '../context/CartContext';
import { ClockIcon, MapPinIcon, BuildingStorefrontIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProductDetailPageProps {
    productId: number;
    navigate: (view: View, productId?: number) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, navigate }) => {
    const { addToCart } = useCart();
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    const retailer = MOCK_USERS.find(u => u.id === product?.retailerId);

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
                <button onClick={() => navigate(View.HOME)} className="mt-4 text-primary-600 hover:underline">
                    Go back to Home
                </button>
            </div>
        );
    }
    
    const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    const expiryColorClass = daysUntilExpiry <= 2 ? 'text-red-600 bg-red-100' : daysUntilExpiry <= 5 ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100';
    const discountPercentage = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

    return (
        <div>
             <button onClick={() => navigate(View.HOME)} className="flex items-center mb-6 text-gray-600 hover:text-primary-700 font-medium">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to all products
            </button>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-4">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                        <span className="text-sm font-medium text-primary-600">{product.category}</span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
                        <p className="text-gray-600 mt-4 text-lg">{product.description}</p>
                        
                        <div className="mt-6 flex items-baseline space-x-3">
                             <p className="text-4xl font-bold text-primary-700">${product.discountedPrice.toFixed(2)}</p>
                             <p className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                        </div>
                        <div className="mt-2">
                            <span className="inline-block bg-secondary-light text-secondary-dark text-sm font-semibold px-3 py-1 rounded-full">
                                You save ${ (product.originalPrice - product.discountedPrice).toFixed(2) } ({discountPercentage}%)
                            </span>
                        </div>

                        <div className="mt-6 border-t pt-6 space-y-4">
                             <div className={`flex items-center text-md font-medium px-3 py-2 rounded-md ${expiryColorClass}`}>
                                <ClockIcon className="h-6 w-6 mr-3" />
                                <span>Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} ({new Date(product.expiryDate).toLocaleDateString()})</span>
                            </div>
                            {retailer && (
                                <div className="flex items-center text-md font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                    <BuildingStorefrontIcon className="h-6 w-6 mr-3 text-gray-500" />
                                    <span>Sold by: {retailer.name}</span>
                                </div>
                            )}
                             {retailer?.lat && retailer?.lon && (
                                <div className="flex items-center text-md font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                    <MapPinIcon className="h-6 w-6 mr-3 text-gray-500" />
                                    <span>Retailer Location: {retailer.lat.toFixed(4)}, {retailer.lon.toFixed(4)}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <button onClick={() => addToCart(product)} className="w-full bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-800 transition-colors transform hover:scale-105">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;