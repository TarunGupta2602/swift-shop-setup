
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { getProductById, getProductsByCategory } from '@/data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  Share, 
  Heart, 
  Truck, 
  RotateCcw,
  ShieldCheck 
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(id ? getProductById(id) : null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    if (!product) {
      navigate('/404');
      return;
    }
    
    const related = getProductsByCategory(product.category)
      .filter(p => p.id !== product.id)
      .slice(0, 4);
    
    setRelatedProducts(related);
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-shop-accent">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-shop-accent">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link 
            to={`/category/${product.category}`} 
            className="hover:text-shop-accent capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-800 font-medium truncate">
            {product.name}
          </span>
        </div>
        
        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center h-96">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    className="h-5 w-5 fill-current" 
                    fill={index < Math.floor(product.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-gray-500 ml-2">{product.rating} stars</span>
            </div>
            
            <div className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                  Only {product.stock} left
                </span>
              )}
            </div>
            
            {product.stock > 0 && (
              <div className="flex items-center mb-6">
                <span className="mr-4">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-9 w-9 rounded-none text-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-10 text-center">{quantity}</span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="h-9 w-9 rounded-none text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                className="bg-shop-accent hover:bg-shop-accent/90 text-white gap-2 py-6 flex-grow md:flex-grow-0 md:px-8"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <span>30-day returns policy</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <span>2-year warranty</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full grid grid-cols-3 max-w-lg">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6 bg-white rounded-b-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros euismod, 
                cursus libero at, faucibus purus. Cras id dictum erat. Aliquam auctor 
                turpis in massa congue placerat. Fusce vel fermentum nunc, sit amet posuere ligula. 
                Suspendisse potenti. Sed euismod ex id velit interdum, sed pulvinar tortor iaculis.
              </p>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-6 bg-white rounded-b-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-500">Brand</span>
                      <span>QuikShop</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="capitalize">{product.category}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-500">SKU</span>
                      <span>QS-{product.id.padStart(6, '0')}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-500">Weight</span>
                      <span>0.5 kg</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-500">Dimensions</span>
                      <span>25 × 10 × 5 cm</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>High-quality materials</li>
                    <li>Durable construction</li>
                    <li>User-friendly design</li>
                    <li>Energy efficient</li>
                    <li>Easy maintenance</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 bg-white rounded-b-lg shadow-sm">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Customer Reviews</h3>
                  <Button className="bg-shop-accent hover:bg-shop-accent/90">
                    Write a Review
                  </Button>
                </div>
                
                <div className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="font-medium mr-2">Jane Doe</div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index} 
                          className="h-4 w-4 fill-current" 
                          fill={index < 5 ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <div className="text-gray-500 text-sm ml-2">1 month ago</div>
                  </div>
                  <p className="text-gray-700">
                    Great product! Exactly as described and arrived quickly. Would buy again.
                  </p>
                </div>
                
                <div className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="font-medium mr-2">John Smith</div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index} 
                          className="h-4 w-4 fill-current" 
                          fill={index < 4 ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <div className="text-gray-500 text-sm ml-2">2 months ago</div>
                  </div>
                  <p className="text-gray-700">
                    Very happy with my purchase. The quality is excellent and it works perfectly.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
