-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  barcode TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (POS needs to read products)
CREATE POLICY "Anyone can read products" 
ON public.products 
FOR SELECT 
USING (true);

-- Allow public insert/update for now (can be restricted later with auth)
CREATE POLICY "Anyone can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true);

-- Insert initial products
INSERT INTO public.products (name, price, category, barcode) VALUES
  ('Espresso', 3.50, 'coffee', '1001001001'),
  ('Americano', 4.00, 'coffee', '1001001002'),
  ('Cappuccino', 4.50, 'coffee', '1001001003'),
  ('Latte', 5.00, 'coffee', '1001001004'),
  ('Mocha', 5.50, 'coffee', '1001001005'),
  ('Macchiato', 4.25, 'coffee', '1001001006'),
  ('Croissant', 3.50, 'food', '2001001001'),
  ('Bagel', 4.00, 'food', '2001001002'),
  ('Sandwich', 8.50, 'food', '2001001003'),
  ('Salad Bowl', 10.00, 'food', '2001001004'),
  ('Avocado Toast', 9.00, 'food', '2001001005'),
  ('Orange Juice', 4.50, 'drinks', '3001001001'),
  ('Smoothie', 6.00, 'drinks', '3001001002'),
  ('Iced Tea', 3.50, 'drinks', '3001001003'),
  ('Sparkling Water', 2.50, 'drinks', '3001001004'),
  ('Cheesecake', 6.50, 'desserts', '4001001001'),
  ('Brownie', 4.00, 'desserts', '4001001002'),
  ('Cookie', 2.50, 'desserts', '4001001003'),
  ('Muffin', 3.50, 'desserts', '4001001004'),
  ('Tiramisu', 7.00, 'desserts', '4001001005');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();