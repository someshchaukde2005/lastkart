import React from 'react';
import { Product, View } from '../types';
import { ClockIcon, MapPinIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  navigate: (view: View, productId?: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
    const { addToCart } = useCart();
    
    const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    
    const expiryColorClass = daysUntilExpiry <= 2 ? 'text-red-600' : daysUntilExpiry <= 5 ? 'text-yellow-600' : 'text-green-600';
    const discountPercentage = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

    const handleViewDetails = () => {
        navigate(View.PRODUCT_DETAIL, product.id);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <div onClick={handleViewDetails} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-secondary text-white text-sm font-bold px-2 py-1 rounded-full">
                    {discountPercentage}% OFF
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-primary-700">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-grow">{product.description.substring(0, 50)}...</p>
                
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-primary-700">${product.discountedPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                </div>
                
                <div className="mt-3 space-y-2 text-sm">
                    <div className={`flex items-center ${expiryColorClass} font-medium`}>
                        <ClockIcon className="h-5 w-5 mr-1.5" />
                        <span>Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}</span>
                    </div>
                     {product.distance !== undefined && (
                        <div className="flex items-center text-gray-600 font-medium">
                            <MapPinIcon className="h-5 w-5 mr-1.5" />
                            <span>{product.distance.toFixed(1)} km away</span>
                        </div>
                    )}
                </div>
                
                 <button onClick={handleAddToCart} className="w-full mt-4 bg-primary-50 text-primary-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;