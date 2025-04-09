
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  CreditCard,
  RefreshCw,
  LockKeyhole
} from 'lucide-react';

const CartPage = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to checkout",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-300" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild className="bg-shop-accent hover:bg-shop-accent/90">
              <Link to="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="hidden md:grid grid-cols-5 gap-4 mb-6 text-gray-500 font-medium">
                <div className="col-span-2">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Product Image & Name */}
                      <div className="md:col-span-2 flex items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 mr-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div>
                          <Link 
                            to={`/product/${item.product.id}`} 
                            className="font-medium text-shop-primary hover:text-shop-accent"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-gray-500 text-sm capitalize mt-1">
                            Category: {item.product.category}
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:text-center">
                        <div className="md:hidden text-gray-500 mb-1">Price:</div>
                        <div>${item.product.price.toFixed(2)}</div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:text-center">
                        <div className="md:hidden text-gray-500 mb-1">Quantity:</div>
                        <div className="flex items-center md:justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Total & Remove */}
                      <div className="md:text-right flex md:block justify-between items-center">
                        <div>
                          <div className="md:hidden text-gray-500 mb-1">Total:</div>
                          <div className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{totalPrice > 50 ? 'Free' : '$4.99'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    ${(
                      totalPrice + 
                      (totalPrice > 50 ? 0 : 4.99) + 
                      (totalPrice * 0.08)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-shop-accent hover:bg-shop-accent/90 mb-4 py-6"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="space-y-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 flex-shrink-0" />
                  <span>Free 30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 flex-shrink-0" />
                  <span>Secure checkout with encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <span>We accept all major credit cards</span>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t">
                <div className="mb-2 font-medium">Have a coupon?</div>
                <div className="flex gap-2">
                  <Input placeholder="Enter coupon code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
