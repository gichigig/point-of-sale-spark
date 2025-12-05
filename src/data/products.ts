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
  { id: "1", name: "Espresso", price: 3.50, category: "coffee" },
  { id: "2", name: "Americano", price: 4.00, category: "coffee" },
  { id: "3", name: "Cappuccino", price: 4.50, category: "coffee" },
  { id: "4", name: "Latte", price: 5.00, category: "coffee" },
  { id: "5", name: "Mocha", price: 5.50, category: "coffee" },
  { id: "6", name: "Macchiato", price: 4.25, category: "coffee" },
  
  // Food
  { id: "7", name: "Croissant", price: 3.50, category: "food" },
  { id: "8", name: "Bagel", price: 4.00, category: "food" },
  { id: "9", name: "Sandwich", price: 8.50, category: "food" },
  { id: "10", name: "Salad Bowl", price: 10.00, category: "food" },
  { id: "11", name: "Avocado Toast", price: 9.00, category: "food" },
  
  // Drinks
  { id: "12", name: "Orange Juice", price: 4.50, category: "drinks" },
  { id: "13", name: "Smoothie", price: 6.00, category: "drinks" },
  { id: "14", name: "Iced Tea", price: 3.50, category: "drinks" },
  { id: "15", name: "Sparkling Water", price: 2.50, category: "drinks" },
  
  // Desserts
  { id: "16", name: "Cheesecake", price: 6.50, category: "desserts" },
  { id: "17", name: "Brownie", price: 4.00, category: "desserts" },
  { id: "18", name: "Cookie", price: 2.50, category: "desserts" },
  { id: "19", name: "Muffin", price: 3.50, category: "desserts" },
  { id: "20", name: "Tiramisu", price: 7.00, category: "desserts" },
];
