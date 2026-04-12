import React from 'react';
import { Link } from 'react-router-dom'
import { Mail, Phone, Truck, ShieldCheck, Headphones, RefreshCw } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-10">
      {/* Top Section */}
      <div className="flex flex-wrap justify-around items-center border-b border-gray-700 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <Truck size={24} />
          <p>Free Shipping</p>
        </div>
        <div className="flex items-center gap-4">
          <ShieldCheck size={24} />
          <p>100% Secure Payment</p>
        </div>
        <div className="flex items-center gap-4">
          <Headphones size={24} />
          <p>24x7 Customer Service</p>
        </div>
        <div className="flex items-center gap-4">
          <RefreshCw size={24} />
          <p>Free & Easy Returns</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h3 className="text-xl font-bold mb-4">LOGO</h3>
          <p className="text-sm mb-4">
            Your one stop shop for quality merchandise at affordable prices. Free shipping on ALL of our great products!
          </p>
          <p className="text-sm mb-2">E-mail: mail@fakeexample.com</p>
          <p className="text-sm">Telephone: 909-000-70400</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-white hover:text-gray-300">🔗</a>
            <a href="#" className="text-white hover:text-gray-300">🔗</a>
            <a href="#" className="text-white hover:text-gray-300">🔗</a>
            <a href="#" className="text-white hover:text-gray-300">🔗</a>
          </div>
        </div>

        {/* Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Information</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/about" className="hover:underline">About us</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:underline">Terms & condition</Link></li>
            <li><Link to="/account" className="hover:underline">My Account</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/help-faqs" className="hover:underline">Help & FAQs</Link></li>
            <li><Link to="/returns-policy" className="hover:underline">Returns Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/support-center" className="hover:underline">Support Center</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Our Newsletter</h4>
          <p className="text-sm mb-4">Sign up for the latest offers and exclusives.</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email Address..."
              className="px-4 py-2 rounded-full text-sm text-gray-800 w-full"
            />
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm hover:bg-emerald-700">
              SUBSCRIBE
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <img src="https://i.imgur.com/1X4VR6f.png" alt="Visa" className="w-8" />
            <img src="https://i.imgur.com/1X4VR6f.png" alt="MasterCard" className="w-8" />
            <img src="https://i.imgur.com/1X4VR6f.png" alt="PayPal" className="w-8" />
            <img src="https://i.imgur.com/1X4VR6f.png" alt="Amex" className="w-8" />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400 mt-6">
        Copyright 2026. All Right Reserved
      </div>
    </footer>
  );
};

export default Footer;