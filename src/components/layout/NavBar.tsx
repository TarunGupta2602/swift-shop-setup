
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { getCategories } from '@/data/products';

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = getCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-shop-primary text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            QuikShop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-shop-accent transition-colors">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-white p-0 hover:text-shop-accent">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white mt-2 w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} className="capitalize">
                    <Link 
                      to={`/category/${category}`} 
                      className="w-full block py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category === 'all' ? 'All Products' : category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/products" className="hover:text-shop-accent transition-colors">
              All Products
            </Link>
          </nav>

          {/* Search, User, and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-64 text-shop-primary rounded-full pl-10 pr-4 focus-visible:ring-shop-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shop-secondary h-4 w-4" />
            </form>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-shop-primary/20">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white mt-2 w-48">
                  <DropdownMenuItem className="text-shop-primary font-medium">
                    {user?.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full flex items-center">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full flex items-center">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-shop-danger" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="text-white hover:bg-shop-primary/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:bg-shop-primary/20 relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-shop-accent rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-shop-accent rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-shop-primary border-t border-gray-700 py-4 px-4 animate-fadeIn">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full text-shop-primary rounded-full pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shop-secondary h-4 w-4" />
          </form>
          
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <div className="py-2">
              <span className="block mb-2">Categories</span>
              <div className="pl-4 flex flex-col space-y-2">
                {categories.map((category) => (
                  <Link 
                    key={category} 
                    to={`/category/${category}`} 
                    className="capitalize py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category === 'all' ? 'All Products' : category}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/products" className="py-2" onClick={() => setIsMenuOpen(false)}>
              All Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2" onClick={() => setIsMenuOpen(false)}>
                  My Profile
                </Link>
                <Link to="/orders" className="py-2" onClick={() => setIsMenuOpen(false)}>
                  My Orders
                </Link>
                <button 
                  className="flex items-center text-left py-2 text-shop-danger" 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="py-2" onClick={() => setIsMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
