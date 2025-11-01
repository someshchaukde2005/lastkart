import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, View } from '../types';
import ProductCard from '../components/ProductCard';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Haversine formula to calculate distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

interface HomePageProps {
  navigate: (view: View, productId?: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('expiryDate');
    const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);
    const [radiusFilter, setRadiusFilter] = useState<number>(0); // 0 means no radius filter
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const categories = useMemo(() => ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))], []);

    const handleLocateMe = () => {
        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLocationStatus('success');
                setSortBy('distance'); // Automatically sort by distance
                if(radiusFilter === 0) setRadiusFilter(25); // Set a default radius
            },
            () => {
                setLocationStatus('error');
                alert('Could not get your location. Please ensure location services are enabled.');
            }
        );
    };

    const filteredAndSortedProducts = useMemo(() => {
        let productsWithDistance = MOCK_PRODUCTS.map(product => {
            if (userLocation && product.lat && product.lon) {
                return {
                    ...product,
                    distance: getDistance(userLocation.lat, userLocation.lon, product.lat, product.lon)
                };
            }
            return { ...product, distance: undefined };
        });

        return productsWithDistance
            .filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (categoryFilter === 'All' || product.category === categoryFilter) &&
                (radiusFilter === 0 || (product.distance !== undefined && product.distance <= radiusFilter))
            )
            .sort((a, b) => {
                if (sortBy === 'distance') {
                    if (a.distance === undefined) return 1;
                    if (b.distance === undefined) return -1;
                    return a.distance - b.distance;
                }
                if (sortBy === 'expiryDate') {
                    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
                } else if (sortBy === 'priceLowHigh') {
                    return a.discountedPrice - b.discountedPrice;
                } else if (sortBy === 'priceHighLow') {
                    return b.discountedPrice - a.discountedPrice;
                }
                return 0;
            });
    }, [searchTerm, categoryFilter, sortBy, userLocation, radiusFilter]);

    return (
        <div>
            <div className="bg-primary-50 rounded-lg p-8 mb-8 text-center">
                <h1 className="text-4xl font-bold text-primary-800">Save Big on Fresh Finds!</h1>
                <p className="text-primary-700 mt-2 text-lg">Grab delicious products nearing their expiry at unbeatable prices. Good for your wallet, great for the planet.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-20 z-40 flex flex-wrap gap-4 items-center justify-between">
                 <div className="relative flex-grow sm:flex-grow-0 sm:w-1/3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                     <select id="category" className="border rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 bg-white" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select id="sort" className="border rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 bg-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="expiryDate">Nearest Expiry</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        {userLocation && <option value="distance">Nearest</option>}
                    </select>
                     {userLocation && (
                         <select id="radius" className="border rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500 bg-white" value={radiusFilter} onChange={(e) => setRadiusFilter(Number(e.target.value))}>
                            <option value="0">Any Distance</option>
                            <option value="5">Under 5 km</option>
                            <option value="10">Under 10 km</option>
                            <option value="25">Under 25 km</option>
                            <option value="50">Under 50 km</option>
                        </select>
                     )}
                </div>
                <button onClick={handleLocateMe} disabled={locationStatus === 'loading'} className="flex items-center justify-center bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-400">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {locationStatus === 'loading' ? 'Locating...' : 'Find Deals Near Me'}
                </button>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} navigate={navigate} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}

        </div>
    );
};

export default HomePage;