import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ActionButton from '@/components/dashboard/ActionButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { categories, Category } from '@/data/categories';
import AddCategoryModal from '@/components/category/AddCategoryModal';

const ManageCategory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryList, setCategoryList] = useState(categories);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = categoryList.filter(category => 
      category.categoryName.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categoryList.filter(category => category.id !== id);
      setCategoryList(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
  };

  const handleAddCategory = (newCategory: Omit<Category, 'id' | 'products' | 'createdAt'>) => {
    const category: Category = {
      ...newCategory,
      id: categoryList.length + 1,
      products: 0,
      createdAt: new Date().toISOString(),
    };
    
    const updatedCategories = [...categoryList, category];
    setCategoryList(updatedCategories);
    setFilteredCategories(updatedCategories);
    setIsAddModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <div className="flex gap-3 mt-4 md:mt-0">
          <ActionButton
            icon={<Plus size={18} />}
            label="Add New Category"
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-center">Total Products</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.categoryName}</TableCell>
                  <TableCell className="text-center">{category.products}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {}}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
      />
    </MainLayout>
  );
};

export default ManageCategory;
