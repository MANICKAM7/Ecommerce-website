-- ============================================
-- AEcommerce Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS aecommerce;
USE aecommerce;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2) DEFAULT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image VARCHAR(255),
  images JSON,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (product_id, user_id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_name VARCHAR(100),
  shipping_email VARCHAR(150),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_country VARCHAR(100),
  shipping_zip VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_uses INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Categories
INSERT INTO categories (name, slug, description, image) VALUES
('Electronics', 'electronics', 'Latest gadgets, phones, laptops and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'),
('Fashion', 'fashion', 'Trendy clothing, shoes and fashion accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500'),
('Home & Living', 'home-living', 'Furniture, decor and home essentials', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500'),
('Sports & Fitness', 'sports-fitness', 'Equipment and gear for active lifestyle', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'),
('Beauty & Health', 'beauty-health', 'Skincare, makeup and wellness products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'),
('Books & Media', 'books-media', 'Books, music, movies and digital media', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'),
('Toys & Games', 'toys-games', 'Toys, board games, and video games', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500'),
('Groceries', 'groceries', 'Daily essentials and groceries', 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500');

-- Insert Admin User (password: Admin@123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@aecommerce.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lew8xDXTPKe0i5Hvq', 'admin');

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, original_price, stock, category_id, image, rating, review_count, is_featured) VALUES
-- Electronics (Category 1)
('Apple AirPods Pro (2nd Gen)', 'apple-airpods-pro-2', 'Rich audio quality, next-level Active Noise Cancellation, and Adaptive Transparency.', 24900.00, 26900.00, 100, 1, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600', 4.8, 1200, TRUE),
('Samsung Fast Charger 25W', 'samsung-charger-25w', 'Super fast charging to stay Live. Give your devices the powerful charging support they deserve.', 1299.00, 1999.00, 200, 1, 'https://images.unsplash.com/photo-1583863788434-e58a36340cf0?w=600', 4.5, 340, FALSE),
('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design with A17 Pro chip and robust camera system.', 134900.00, 149900.00, 50, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 4.9, 2340, TRUE),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen.', 124999.00, 139999.00, 45, 1, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', 4.7, 1890, TRUE),
('MacBook Air M2', 'macbook-air-m2', 'Incredibly thin design, powered by M2 chip.', 114900.00, 119900.00, 30, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 4.9, 980, TRUE),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling headphones.', 29990.00, 34990.00, 120, 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 4.6, 3210, FALSE),

-- Fashion (Category 2)
('Nike Air Max 270', 'nike-air-max-270', 'Max Air unit created specifically for Nike Sportswear.', 12995.00, 15995.00, 200, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 4.5, 4520, TRUE),
('Levi\'s Denim Jacket', 'levis-denim-jacket', 'Classic denim jacket with a modern fit.', 3499.00, 4999.00, 60, 2, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', 4.3, 2890, FALSE),

-- Home & Living (Category 3)
('Modern Minimalist Sofa', 'modern-minimalist-sofa', 'Comfortable 3-seater sofa in elegant grey fabric.', 35000.00, 45000.00, 10, 3, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600', 4.6, 123, TRUE),
('Ceramic Coffee Mug', 'ceramic-coffee-mug', 'Hand-crafted ceramic mug perfect for your morning brew.', 499.00, 999.00, 150, 3, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600', 4.4, 305, FALSE),

-- Sports & Fitness (Category 4)
('Premium Yoga Mat', 'premium-yoga-mat', 'Extra thick non-slip yoga mat with alignment lines.', 1499.00, 2499.00, 200, 4, 'https://images.unsplash.com/photo-1601925228008-3a08769e4b85?w=600', 4.4, 3450, TRUE),
('Adjustable Dumbbells 20kg', 'adjustable-dumbbells-20kg', 'Space-saving adjustable weight set for home gyms.', 4999.00, 6999.00, 40, 4, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600', 4.8, 451, FALSE),

-- Beauty & Health (Category 5)
('Vitamin C Brightening Serum', 'vitamin-c-serum', 'Advanced formula to glow and hydrate your skin.', 899.00, 1299.00, 100, 5, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', 4.5, 4230, TRUE),
('Dyson Hair Dryer Pro', 'dyson-hair-dryer', 'Ultra fast drying and styling for all hair types.', 29990.00, 34990.00, 30, 5, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600', 4.6, 2100, FALSE),

-- Books & Media (Category 6)
('Atomic Habits Book', 'atomic-habits-book', 'James Clear\'s bestseller on building good habits.', 499.00, 799.00, 300, 6, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 4.9, 12450, TRUE),
('The Psychology of Money', 'psychology-money', 'Timeless lessons on wealth, greed, and happiness.', 399.00, 599.00, 250, 6, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', 4.8, 8900, FALSE),

-- Toys & Games (Category 7)
('Lego Classic Box', 'lego-classic-box', 'Unleash creativity with vibrant classic legos.', 2499.00, 3499.00, 80, 7, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600', 4.7, 1200, TRUE),
('PlayStation 5 Console', 'ps5-console', 'Next-gen gaming power and immersive experience.', 49990.00, 54990.00, 15, 7, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600', 4.9, 5600, TRUE),

-- Groceries (Category 8)
('Organic Almonds 1kg', 'organic-almonds', 'Premium quality California almonds packed with nutrition.', 1199.00, 1499.00, 120, 8, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600', 4.6, 800, FALSE),
('Virgin Olive Oil 1L', 'virgin-olive-oil', 'Cold-pressed extra virgin olive oil directly from Italy.', 899.00, 1199.00, 90, 8, 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=600', 4.8, 1200, TRUE),
('Fresh Red Apples 1kg', 'fresh-red-apples', 'Crisp and sweet red apples freshly picked.', 250.00, 300.00, 150, 8, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=600', 4.7, 450, FALSE),
('Whole Wheat Bread', 'whole-wheat-bread', 'Freshly baked 100% whole wheat bread loaf.', 60.00, 80.00, 50, 8, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 4.8, 300, FALSE);

-- Insert Sample Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses) VALUES
('WELCOME10', 'percentage', 10.00, 999.00, 1000),
('SAVE500', 'fixed', 500.00, 2999.00, 500),
('FLASH20', 'percentage', 20.00, 1999.00, 200);
