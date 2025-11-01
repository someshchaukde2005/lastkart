
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} Lastkart. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-1">Reducing waste, one fresh deal at a time.</p>
            </div>
        </footer>
    );
};

export default Footer;
   