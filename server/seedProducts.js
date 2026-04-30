const db = require('./config/db');

const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', desc: 'Latest gadgets, phones, laptops and accessories', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500' },
  { id: 2, name: 'Fashion', slug: 'fashion', desc: 'Trendy clothing, shoes and fashion accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500' },
  { id: 3, name: 'Home & Living', slug: 'home-living', desc: 'Furniture, decor and home essentials', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500' },
  { id: 4, name: 'Sports & Fitness', slug: 'sports-fitness', desc: 'Equipment and gear for active lifestyle', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' },
  { id: 5, name: 'Beauty & Health', slug: 'beauty-health', desc: 'Skincare, makeup and wellness products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500' },
  { id: 6, name: 'Books & Media', slug: 'books-media', desc: 'Books, music, movies and digital media', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500' },
  { id: 7, name: 'Toys & Games', slug: 'toys-games', desc: 'Toys, board games, and video games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500' },
  { id: 8, name: 'Groceries', slug: 'groceries', desc: 'Daily essentials and groceries', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500' }
];

const products = [
  // Electronics
  { name: 'Apple AirPods Pro', slug: 'apple-airpods-pro', price: 24900, orig: 26900, stock: 100, cat: 1, img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600' },
  { name: 'Samsung Fast Charger 25W', slug: 'samsung-charger', price: 1299, orig: 1999, stock: 200, cat: 1, img: 'https://images.unsplash.com/photo-1583863788434-e58a36340cf0?w=600' },
  { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', price: 134900, orig: 139900, stock: 45, cat: 1, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600' },
  { name: 'MacBook Air M2', slug: 'macbook-air-m2', price: 114900, orig: 119900, stock: 30, cat: 1, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' },
  
  // Fashion
  { name: 'Nike Air Max', slug: 'nike-air-max', price: 12995, orig: 14995, stock: 50, cat: 2, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
  { name: 'Levi\'s Denim Jacket', slug: 'levis-denim', price: 3499, orig: 4999, stock: 60, cat: 2, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600' },
  
  // Home Living
  { name: 'Modern Sofa', slug: 'modern-sofa', price: 35000, orig: 45000, stock: 10, cat: 3, img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600' },
  { name: 'Ceramic Coffee Mug', slug: 'ceramic-mug', price: 499, orig: 999, stock: 150, cat: 3, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600' },

  // Sports & Fitness
  { name: 'Yoga Mat Premium', slug: 'yoga-mat', price: 1499, orig: 2499, stock: 200, cat: 4, img: 'https://images.unsplash.com/photo-1601925228008-3a08769e4b85?w=600' },
  { name: 'Adjustable Dumbbells 20kg', slug: 'dumbbells-20kg', price: 4999, orig: 6999, stock: 40, cat: 4, img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600' },

  // Beauty & Health
  { name: 'Vitamin C Serum', slug: 'vit-c-serum', price: 899, orig: 1299, stock: 100, cat: 5, img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600' },
  { name: 'Hair Dryer Pro', slug: 'hair-dryer', price: 2999, orig: 4999, stock: 30, cat: 5, img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600' },

  // Books & Media
  { name: 'Atomic Habits', slug: 'atomic-habits', price: 499, orig: 699, stock: 300, cat: 6, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600' },
  { name: 'The Psychology of Money', slug: 'psychology-money', price: 399, orig: 599, stock: 250, cat: 6, img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600' },

  // Toys & Games
  { name: 'Lego Classic Box', slug: 'lego-classic', price: 2499, orig: 3499, stock: 80, cat: 7, img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600' },
  { name: 'PlayStation 5 Console', slug: 'ps5-console', price: 49990, orig: 54990, stock: 15, cat: 7, img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600' },

  // Groceries
  { name: 'Organic Almonds 1kg', slug: 'organic-almonds', price: 1199, orig: 1499, stock: 120, cat: 8, img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600' },
  { name: 'Virgin Olive Oil 1L', slug: 'olive-oil', price: 899, orig: 1199, stock: 90, cat: 8, img: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=600' },
  { name: 'Fresh Red Apples 1kg', slug: 'fresh-red-apples', price: 250, orig: 300, stock: 150, cat: 8, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=600' },
  { name: 'Whole Wheat Bread', slug: 'whole-wheat-bread', price: 60, orig: 80, stock: 50, cat: 8, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600' },
];

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Clear existing
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE order_items');
    await db.query('TRUNCATE TABLE wishlist');
    await db.query('TRUNCATE TABLE cart');
    await db.query('TRUNCATE TABLE reviews');
    await db.query('TRUNCATE TABLE products');
    await db.query('TRUNCATE TABLE categories');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert categories
    for (const cat of categories) {
      await db.query(
        'INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)',
        [cat.id, cat.name, cat.slug, cat.desc, cat.image]
      );
    }
    console.log('Categories seeded.');

    // Insert products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      await db.query(
        `INSERT INTO products 
         (name, slug, description, price, original_price, stock, category_id, image, rating, review_count, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.slug, `High quality ${p.name}`, p.price, p.orig, p.stock, p.cat, p.img, 4.5, Math.floor(Math.random() * 500) + 10, true]
      );
    }
    console.log('Products seeded.');
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();
