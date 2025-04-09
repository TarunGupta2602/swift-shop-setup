
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  CreditCard,
  Building,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const CheckoutPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Shipping details
  const [shippingDetails, setShippingDetails] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [billingDetails, setBillingDetails] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBillingSameChange = (checked: boolean) => {
    setBillingDetails(prev => ({
      ...prev,
      sameAsShipping: checked
    }));
  };
  
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate shipping form
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !shippingDetails[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 2 && !billingDetails.sameAsShipping) {
      // Validate billing form
      const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !billingDetails[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required billing fields",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePlaceOrder = () => {
    if (paymentMethod === 'credit-card') {
      // Validate card details
      const requiredFields = ['number', 'name', 'expiry', 'cvc'];
      const missingFields = requiredFields.filter(field => !cardDetails[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required card fields",
          variant: "destructive",
        });
        return;
      }
    }
    
    // In a real application, you would process the payment here
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase",
    });
    
    // Clear the cart
    clearCart();
    
    // Navigate to order confirmation
    navigate('/order-success');
  };
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        {/* Checkout Steps Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-shop-accent' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-shop-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-xs md:text-sm">Shipping</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-shop-accent' : 'bg-gray-200'}`} />
            
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-shop-accent' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-shop-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-xs md:text-sm">Billing</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-shop-accent' : 'bg-gray-200'}`} />
            
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-shop-accent' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-shop-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-xs md:text-sm">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingDetails.firstName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingDetails.lastName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingDetails.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingDetails.phone}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <select
                        id="country"
                        name="country"
                        value={shippingDetails.country}
                        onChange={(e) => setShippingDetails(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop-accent"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      className="bg-shop-accent hover:bg-shop-accent/90"
                      onClick={nextStep}
                    >
                      Continue to Billing
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Billing Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Billing Information</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={billingDetails.sameAsShipping}
                        onCheckedChange={handleBillingSameChange}
                      />
                      <Label htmlFor="sameAsShipping">
                        Same as shipping address
                      </Label>
                    </div>
                  </div>
                  
                  {!billingDetails.sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="billingFirstName">First Name *</Label>
                        <Input
                          id="billingFirstName"
                          name="firstName"
                          value={billingDetails.firstName}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingLastName">Last Name *</Label>
                        <Input
                          id="billingLastName"
                          name="lastName"
                          value={billingDetails.lastName}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="billingAddress">Street Address *</Label>
                        <Input
                          id="billingAddress"
                          name="address"
                          value={billingDetails.address}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City *</Label>
                        <Input
                          id="billingCity"
                          name="city"
                          value={billingDetails.city}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingState">State/Province *</Label>
                        <Input
                          id="billingState"
                          name="state"
                          value={billingDetails.state}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingZipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="billingZipCode"
                          name="zipCode"
                          value={billingDetails.zipCode}
                          onChange={handleBillingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">Country *</Label>
                        <select
                          id="billingCountry"
                          name="country"
                          value={billingDetails.country}
                          onChange={(e) => setBillingDetails(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop-accent"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Shipping
                    </Button>
                    
                    <Button
                      className="bg-shop-accent hover:bg-shop-accent/90"
                      onClick={nextStep}
                    >
                      Continue to Payment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <div className="mb-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-md mb-3 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="cursor-pointer flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-shop-accent" />
                          Credit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-md mb-3 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer">
                          PayPal
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="cursor-pointer flex items-center">
                          <Building className="h-5 w-5 mr-2 text-shop-accent" />
                          Bank Transfer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            name="number"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input
                            id="cardName"
                            name="name"
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiration Date (MM/YY) *</Label>
                          <Input
                            id="cardExpiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC/CVV *</Label>
                          <Input
                            id="cardCvc"
                            name="cvc"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <LockKeyhole className="h-4 w-4 mr-2" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-md text-center">
                      <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <div className="flex justify-center">
                        <svg className="h-8" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg">
                          <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                          <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                          <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035z" fill="#253B80"/>
                          <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                          <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                          <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'bank-transfer' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <p className="mb-4">Please use the following details to make a bank transfer:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Bank Name:</span>
                          <span>QuikShop National Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Name:</span>
                          <span>QuikShop Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span>1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Routing Number:</span>
                          <span>012345678</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Reference:</span>
                          <span>QS-ORDER-{Math.floor(Math.random() * 10000)}</span>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-500">
                        Please include your order reference in your bank transfer details.
                        Your order will be processed once we receive your payment.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Billing
                    </Button>
                    
                    <Button
                      className="bg-shop-accent hover:bg-shop-accent/90"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 mr-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium truncate">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium ml-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <div className="text-sm text-shop-accent text-center">
                    +{items.length - 3} more items
                  </div>
                )}
                
                <Separator />
                
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
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-shop-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Secure Checkout</span>
                    <p className="text-gray-500">
                      Your payment information is encrypted for maximum security.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-shop-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Free Shipping</span>
                    <p className="text-gray-500">
                      On all orders over $50.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
