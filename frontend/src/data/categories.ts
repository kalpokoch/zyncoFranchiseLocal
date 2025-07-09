export interface Category {
  id: number;
  categoryName: string;
  products: number;
  createdAt: string;
}

export type CategoryFormData = Omit<Category, 'id' | 'products' | 'createdAt'>;

export const categories: Category[] = [
  {
    id: 1,
    categoryName: 'Electronics',
    products: 45,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    categoryName: 'Fashion',
    products: 78,
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    categoryName: 'Home & Kitchen',
    products: 32,
    createdAt: '2024-01-17'
  },
  {
    id: 4,
    categoryName: 'Books',
    products: 120,
    createdAt: '2024-01-18'
  }
];
