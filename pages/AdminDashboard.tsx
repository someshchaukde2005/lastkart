import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_SALES_DATA, MOCK_CATEGORY_DATA, MOCK_TOP_RETAILERS, MOCK_USERS, MOCK_PRODUCTS } from '../constants';
import { User, Product, Role } from '../types';
import { ChartBarIcon, UsersIcon, CubeIcon, TrashIcon } from '@heroicons/react/24/outline';

type AdminTab = 'overview' | 'users' | 'products';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    const handleDeleteUser = (userId: number) => {
        if(window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };
     const handleDeleteProduct = (productId: number) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== productId));
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-4">Monthly Sales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={MOCK_SALES_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="sales" fill="#007A7A" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-4">Product Categories</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={MOCK_CATEGORY_DATA} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {MOCK_CATEGORY_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'users':
                return (
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-4">User Management</h3>
                         <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="py-4 px-6 whitespace-nowrap">{user.name}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">{user.email}</td>
                                            <td className="py-4 px-6 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'retailer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td>
                                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{user.lat && user.lon ? `${user.lat.toFixed(2)}, ${user.lon.toFixed(2)}` : 'N/A'}</td>
                                            <td className="py-4 px-6 whitespace-nowrap text-center">
                                                {user.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-4">Product Management</h3>
                        <div className="overflow-x-auto">
                           <table className="min-w-full bg-white">
                               <thead className="bg-gray-50">
                                   <tr>
                                       <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                       <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                                       <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                       <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-200">
                                   {products.map(product => (
                                       <tr key={product.id}>
                                           <td className="py-4 px-6 whitespace-nowrap">{product.name}</td>
                                           <td className="py-4 px-6 whitespace-nowrap">{users.find(u => u.id === product.retailerId)?.name || 'N/A'}</td>
                                           <td className="py-4 px-6 whitespace-nowrap">${product.discountedPrice.toFixed(2)}</td>
                                           <td className="py-4 px-6 whitespace-nowrap text-center">
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                    </div>
                );
        }
    };
    
    const TabButton: React.FC<{tab: AdminTab; label: string; icon: React.ReactNode}> = ({tab, label, icon}) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'}`}
        >
           {icon}
           <span className="ml-3">{label}</span>
        </button>
    )

    return (
        <div className="flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-1/4 xl:w-1/5">
                <div className="bg-white p-4 rounded-lg shadow sticky top-24">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Admin Menu</h2>
                    <nav className="space-y-2">
                        <TabButton tab="overview" label="Overview" icon={<ChartBarIcon className="h-5 w-5" />} />
                        <TabButton tab="users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
                        <TabButton tab="products" label="Products" icon={<CubeIcon className="h-5 w-5" />} />
                    </nav>
                </div>
           </aside>
           <div className="flex-1">
              {renderContent()}
           </div>
        </div>
    );
};

export default AdminDashboard;