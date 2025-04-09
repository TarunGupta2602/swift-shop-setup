
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Out of stock
            </span>
          )}
        </div>

        <CardContent className="flex-grow pt-4">
          <div className="flex items-center mb-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index} 
                  className="h-4 w-4 fill-current" 
                  fill={index < Math.floor(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
          <h3 className="font-medium text-shop-primary truncate">{product.name}</h3>
          <p className="mt-1 font-bold text-lg">${product.price.toFixed(2)}</p>
          <p className="mt-2 text-gray-500 text-sm line-clamp-2">{product.description}</p>
        </CardContent>
      </Link>

      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-shop-accent hover:bg-shop-accent/90 text-white gap-2" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
