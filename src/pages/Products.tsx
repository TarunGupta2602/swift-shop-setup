import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { getCategories, getProductsByCategory, searchProducts, products } from '@/data/products';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Product } from '@/types/product';

const ProductsPage = () => {
  const location = useLocation();
  const { category } = useParams<{ category: string }>();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const allCategories = getCategories().filter(cat => cat !== 'all');
  const maxPrice = Math.max(...products.map(p => p.price)) + 100;

  useEffect(() => {
    let productsToShow: Product[] = [];
    
    if (searchQuery) {
      productsToShow = searchProducts(searchQuery);
      setSelectedCategories([]);
    } else if (category) {
      productsToShow = getProductsByCategory(category);
      setSelectedCategories([category]);
    } else {
      productsToShow = [...products];
    }
    
    setAllProducts(productsToShow);
    setIsLoading(false);
  }, [category, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [allProducts, priceRange, selectedCategories, sortOption]);

  const applyFilters = () => {
    let result = [...allProducts];
    
    // Price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Category filter (for products page only, not category-specific pages)
    if (!category && selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    
    // Sort
    switch (sortOption) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // For demo purposes, this is random since we don't have date added
        result.sort(() => Math.random() - 0.5);
        break;
      default:
        // featured - keep original order
        break;
    }
    
    setFilteredProducts(result);
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryName]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== categoryName));
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSortOption('featured');
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results: "${searchQuery}"`;
    }
    
    if (category) {
      return category === 'all' ? 'All Products' : `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    
    return 'All Products';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{getPageTitle()}</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <Label htmlFor="sort" className="sr-only">Sort by</Label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop-accent"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            <Button 
              variant="outline"
              className="md:hidden flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 text-shop-accent hover:text-shop-accent/80"
                >
                  Clear All
                </Button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, maxPrice]}
                    value={[priceRange[0], priceRange[1]]}
                    max={maxPrice}
                    step={10}
                    onValueChange={handlePriceChange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Categories - only show in All Products page */}
              {!category && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {allCategories.map((cat) => (
                      <div key={cat} className="flex items-center">
                        <Checkbox
                          id={`category-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(cat, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`category-${cat}`}
                          className="ml-2 text-sm font-normal capitalize cursor-pointer"
                        >
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-shop-accent hover:text-shop-accent/80"
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(false)}
                    className="h-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, maxPrice]}
                    value={[priceRange[0], priceRange[1]]}
                    max={maxPrice}
                    step={10}
                    onValueChange={handlePriceChange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Categories - only show in All Products page */}
              {!category && (
                <div className="mb-4">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map((cat) => (
                      <div key={cat} className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(cat, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`mobile-category-${cat}`}
                          className="ml-2 text-sm font-normal capitalize cursor-pointer"
                        >
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button
                className="w-full bg-shop-accent hover:bg-shop-accent/90"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          )}
          
          {/* Product Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-100 h-72 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="mb-4 text-gray-600">{filteredProducts.length} products found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No results for "${searchQuery}". Try different keywords or filters.`
                    : 'No products match your current filters.'
                  }
                </p>
                <Button onClick={clearFilters} className="bg-shop-accent hover:bg-shop-accent/90">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
