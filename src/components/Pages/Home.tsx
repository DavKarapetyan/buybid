import React from 'react';
import { PageType } from '../../types';
import Hero from '../Home/Hero';
import FeaturedCategories from '../Home/FeaturedCategories';
import FeaturedProducts from '../Home/FeaturedProducts';

interface HomeProps {
  onNavigate: (page: PageType, param?: string) => void;
  onSearch: (query: string) => void;
}

export default function Home({ onNavigate, onSearch }: HomeProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} onSearch={onSearch} />
      <FeaturedCategories onNavigate={onNavigate} />
      <FeaturedProducts onNavigate={onNavigate} />
    </div>
  );
}