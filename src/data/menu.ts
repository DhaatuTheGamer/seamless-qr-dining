export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  image: string;
  dietary?: ('vegan' | 'gf' | 'alcoholic' | 'spicy')[];
  available: boolean;
}

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 's1',
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls infused with black truffle, served with garlic aioli.',
    price: 12,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan'],
    available: true
  },
  {
    id: 's2',
    name: 'Burrata & Heirloom Tomato',
    description: 'Fresh burrata with basil pesto, balsamic glaze, and toasted pine nuts.',
    price: 16,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e24?auto=format&fit=crop&w=800&q=80',
    dietary: ['gf'],
    available: true
  },
  
  // Mains
  {
    id: 'm1',
    name: 'Wagyu Beef Burger',
    description: 'Premium wagyu patty, brioche bun, aged cheddar, caramelized onions, and truffle mayo.',
    price: 24,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: 'm2',
    name: 'Miso Glazed Salmon',
    description: 'Pan-seared salmon fillet with miso glaze, served with bok choy and jasmine rice.',
    price: 28,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
    dietary: ['gf'],
    available: true
  },
  {
    id: 'm3',
    name: 'Wild Mushroom Risotto',
    description: 'Creamy arborio rice with porcini mushrooms, parmesan, and truffle oil.',
    price: 22,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
    dietary: ['gf', 'vegan'],
    available: true
  },

  // Desserts
  {
    id: 'd1',
    name: 'Dark Chocolate Fondant',
    description: 'Molten center chocolate cake served with vanilla bean ice cream.',
    price: 14,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    id: 'd2',
    name: 'Lemon Basil Tart',
    description: 'Zesty lemon curd tart with a hint of basil, topped with italian meringue.',
    price: 12,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
    available: true
  },

  // Drinks
  {
    id: 'dr1',
    name: 'Signature Old Fashioned',
    description: 'Bourbon, smoked maple syrup, angostura bitters, orange peel.',
    price: 18,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    dietary: ['alcoholic'],
    available: true
  },
  {
    id: 'dr2',
    name: 'Yuzu & Mint Mocktail',
    description: 'Refreshing yuzu juice, fresh mint, sparkling water, and lime.',
    price: 10,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'gf'],
    available: true
  }
];

export const CATEGORIES = [
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' }
];
