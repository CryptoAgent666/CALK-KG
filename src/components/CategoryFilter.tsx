import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { categories } from '../data/categories';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Обновляем URL с параметром категории
    if (categoryId === 'all') {
      navigate('/');
    } else {
      navigate(`/?category=${categoryId}`);
    }
  };

  const getCategoryName = (category: any) => {
    if (language === 'ky') return category.nameKy;
    return category.name;
  };

  return (
    <div className="mb-12">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200'
            }`}
          >
            {getCategoryName(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;