
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchProducts } from '@/data/products';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setSearchQuery(query);
    
    if (query) {
      setIsLoading(true);
      // Simulate API request delay
      setTimeout(() => {
        const results = searchProducts(query);
        setSearchResults(results);
        setIsLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState(
        {}, 
        '', 
        `/search?q=${encodeURIComponent(searchQuery)}`
      );
      
      setIsLoading(true);
      // Simulate API request delay
      setTimeout(() => {
        const results = searchProducts(searchQuery);
        setSearchResults(results);
        setIsLoading(false);
      }, 500);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-shop-accent hover:bg-shop-accent/90"
            >
              Search
            </Button>
          </form>
        </div>
        
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              Found {searchResults.length} products
            </p>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 h-72 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}".
            </p>
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 mb-4">Try:</p>
              <ul className="text-left list-disc ml-8 mb-6 text-gray-600">
                <li>Checking the spelling of your search term</li>
                <li>Using more generic keywords</li>
                <li>Searching for a related product category</li>
              </ul>
            </div>
            <Button asChild className="bg-shop-accent hover:bg-shop-accent/90">
              <a href="/products">Browse All Products</a>
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">Search for Products</h3>
            <p className="text-gray-600 mb-6">
              Enter keywords to find the products you're looking for.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
