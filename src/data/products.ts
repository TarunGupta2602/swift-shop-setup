
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Smartphone',
    description: 'High-end smartphone with the latest features and technology.',
    price: 999.99,
    image: '/placeholder.svg',
    category: 'electronics',
    rating: 4.8,
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Ultra HD Smart TV',
    description: '65-inch Ultra HD Smart TV with HDR and built-in streaming apps.',
    price: 1299.99,
    image: '/placeholder.svg',
    category: 'electronics',
    rating: 4.7,
    stock: 8,
    featured: true
  },
  {
    id: '3',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation.',
    price: 249.99,
    image: '/placeholder.svg',
    category: 'electronics',
    rating: 4.9,
    stock: 20
  },
  {
    id: '4',
    name: 'Men\'s Casual Jacket',
    description: 'Stylish and comfortable casual jacket for everyday wear.',
    price: 89.99,
    image: '/placeholder.svg',
    category: 'fashion',
    rating: 4.5,
    stock: 25,
    featured: true
  },
  {
    id: '5',
    name: 'Women\'s Running Shoes',
    description: 'Lightweight and comfortable running shoes with great support.',
    price: 129.99,
    image: '/placeholder.svg',
    category: 'fashion',
    rating: 4.6,
    stock: 18
  },
  {
    id: '6',
    name: 'Stainless Steel Watch',
    description: 'Elegant stainless steel watch with automatic movement.',
    price: 199.99,
    image: '/placeholder.svg',
    category: 'fashion',
    rating: 4.7,
    stock: 12
  },
  {
    id: '7',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans, freshly roasted.',
    price: 24.99,
    image: '/placeholder.svg',
    category: 'groceries',
    rating: 4.8,
    stock: 30
  },
  {
    id: '8',
    name: 'Organic Honey',
    description: 'Pure organic honey sourced from sustainable farms.',
    price: 19.99,
    image: '/placeholder.svg',
    category: 'groceries',
    rating: 4.9,
    stock: 22
  },
  {
    id: '9',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials.',
    price: 39.99,
    image: '/placeholder.svg',
    category: 'sports',
    rating: 4.6,
    stock: 15
  },
  {
    id: '10',
    name: 'Adjustable Dumbbells',
    description: 'Space-saving adjustable dumbbells for home workouts.',
    price: 299.99,
    image: '/placeholder.svg',
    category: 'sports',
    rating: 4.7,
    stock: 10,
    featured: true
  },
  {
    id: '11',
    name: 'Basketball',
    description: 'Professional indoor/outdoor basketball.',
    price: 49.99,
    image: '/placeholder.svg',
    category: 'sports',
    rating: 4.5,
    stock: 20
  },
  {
    id: '12',
    name: 'Gaming Console',
    description: 'Next-generation gaming console with 1TB storage.',
    price: 499.99,
    image: '/placeholder.svg',
    category: 'electronics',
    rating: 4.9,
    stock: 7,
    featured: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getCategories = (): string[] => {
  const categories = products.map(product => product.category);
  return ['all', ...Array.from(new Set(categories))];
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(
    product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );
};
