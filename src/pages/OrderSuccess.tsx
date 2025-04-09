
import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, Truck, Clock, MailOpen } from 'lucide-react';

const OrderSuccessPage = () => {
  const orderNumber = "QS" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your order has been placed and is being processed. You will receive an email confirmation shortly.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">$189.97</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>Credit Card (•••• 1234)</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-3">
                <Truck className="h-5 w-5 text-shop-accent mr-2" />
                <h3 className="font-semibold">Shipping Information</h3>
              </div>
              <address className="text-gray-600 not-italic">
                John Doe<br />
                123 Main Street<br />
                Anytown, CA 12345<br />
                United States<br />
                (555) 123-4567
              </address>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-shop-accent mr-2" />
                <h3 className="font-semibold">Estimated Delivery</h3>
              </div>
              <p className="text-gray-600 mb-2">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                You will receive shipping confirmation and tracking number by email.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 text-center">
            <Button asChild className="bg-shop-accent hover:bg-shop-accent/90">
              <Link to="/">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            <div className="flex items-center justify-center text-sm text-gray-500">
              <MailOpen className="h-4 w-4 mr-1" />
              <span>Check your email for order confirmation and details.</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccessPage;
