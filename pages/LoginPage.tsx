
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Role } from '../types';

interface LoginPageProps {
    navigate: (view: View) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('buyer');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const user = await login(email, password);
                if (user) {
                    if (user.role === 'admin') navigate(View.ADMIN_DASHBOARD);
                    else if (user.role === 'retailer') navigate(View.RETAILER_DASHBOARD);
                    else navigate(View.HOME);
                } else {
                    setError('Invalid credentials. Please try again.');
                }
            } else {
                const user = await register(name, email, role);
                if (user) {
                    if (user.role === 'retailer') navigate(View.RETAILER_DASHBOARD);
                    else navigate(View.HOME);
                } else {
                    setError('An account with this email already exists.');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-full py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {!isLogin && (
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">I am a:</label>
                            <div className="mt-2 flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input type="radio" className="form-radio text-primary-600" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                                    <span className="ml-2">Buyer</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" className="form-radio text-primary-600" name="role" value="retailer" checked={role === 'retailer'} onChange={() => setRole('retailer')} />
                                    <span className="ml-2">Retailer</span>
                                </label>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {isLogin ? 'Sign in' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-600 hover:text-primary-500 ml-1">
                        {isLogin ? 'Register here' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
   