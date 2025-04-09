
import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, getCategories } from '@/data/products';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  Headphones, 
  ChevronRight 
} from 'lucide-react';

const HomePage = () => {
  const featuredProducts = getFeaturedProducts();
  const categories = getCategories().filter(category => category !== 'all');

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-shop-primary to-shop-secondary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Shop Smarter, <br />
                <span className="text-shop-accent">Faster</span>, Better
              </h1>
              <p className="text-lg md:text-xl opacity-90 md:pr-12">
                Discover a world of products with our simple, fast, and intuitive shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-shop-accent hover:bg-shop-accent/90 text-white">
                  <Link to="/products">
                    Shop Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white hover:bg-white/10 text-white">
                  <Link to="/category/featured">
                    Explore Featured
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/placeholder.svg" 
                alt="Shopping experience" 
                className="max-w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-shop-accent/10 rounded-full mb-4">
                <ShoppingBag className="h-6 w-6 text-shop-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of products across multiple categories.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-shop-accent/10 rounded-full mb-4">
                <Truck className="h-6 w-6 text-shop-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-shop-accent/10 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-shop-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with top-level security.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center p-3 bg-shop-accent/10 rounded-full mb-4">
                <Headphones className="h-6 w-6 text-shop-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is always ready to help you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="ghost" className="text-shop-accent">
              <Link to="/products" className="flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category} 
                to={`/category/${category}`} 
                className="block bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img src="/placeholder.svg" alt={category} className="h-24 w-24" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg capitalize">{category}</h3>
                  <Button variant="link" className="text-shop-accent mt-1 p-0">
                    Shop Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-shop-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-lg opacity-90 mb-8">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-shop-primary focus:outline-none focus:ring-2 focus:ring-shop-accent"
                required
              />
              <Button type="submit" className="bg-shop-accent hover:bg-shop-accent/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
