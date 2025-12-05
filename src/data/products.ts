import { Product, Category } from "@/types/pos";

export const categories: Category[] = [
  { id: "all", name: "All", icon: "Grid3X3" },
  { id: "coffee", name: "Coffee", icon: "Coffee" },
  { id: "food", name: "Food", icon: "UtensilsCrossed" },
  { id: "drinks", name: "Drinks", icon: "GlassWater" },
  { id: "desserts", name: "Desserts", icon: "Cake" },
];

export const products: Product[] = [
  // Coffee
  { id: "1", name: "Espresso", price: 3.50, category: "coffee", barcode: "1001001001" },
  { id: "2", name: "Americano", price: 4.00, category: "coffee", barcode: "1001001002" },
  { id: "3", name: "Cappuccino", price: 4.50, category: "coffee", barcode: "1001001003" },
  { id: "4", name: "Latte", price: 5.00, category: "coffee", barcode: "1001001004" },
  { id: "5", name: "Mocha", price: 5.50, category: "coffee", barcode: "1001001005" },
  { id: "6", name: "Macchiato", price: 4.25, category: "coffee", barcode: "1001001006" },
  
  // Food
  { id: "7", name: "Croissant", price: 3.50, category: "food", barcode: "2001001001" },
  { id: "8", name: "Bagel", price: 4.00, category: "food", barcode: "2001001002" },
  { id: "9", name: "Sandwich", price: 8.50, category: "food", barcode: "2001001003" },
  { id: "10", name: "Salad Bowl", price: 10.00, category: "food", barcode: "2001001004" },
  { id: "11", name: "Avocado Toast", price: 9.00, category: "food", barcode: "2001001005" },
  
  // Drinks
  { id: "12", name: "Orange Juice", price: 4.50, category: "drinks", barcode: "3001001001" },
  { id: "13", name: "Smoothie", price: 6.00, category: "drinks", barcode: "3001001002" },
  { id: "14", name: "Iced Tea", price: 3.50, category: "drinks", barcode: "3001001003" },
  { id: "15", name: "Sparkling Water", price: 2.50, category: "drinks", barcode: "3001001004" },
  
  // Desserts
  { id: "16", name: "Cheesecake", price: 6.50, category: "desserts", barcode: "4001001001" },
  { id: "17", name: "Brownie", price: 4.00, category: "desserts", barcode: "4001001002" },
  { id: "18", name: "Cookie", price: 2.50, category: "desserts", barcode: "4001001003" },
  { id: "19", name: "Muffin", price: 3.50, category: "desserts", barcode: "4001001004" },
  { id: "20", name: "Tiramisu", price: 7.00, category: "desserts", barcode: "4001001005" },
];
