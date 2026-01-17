import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Calculator {
  id: string;
  title: string;
  titleKy: string;
  description: string;
  descriptionKy: string;
  category: string;
  categoryName: string;
  categoryNameKy: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  usage: string;
}