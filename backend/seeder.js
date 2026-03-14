import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const products = [
  {
    "name": "iPhone 15 Pro",
    "description": "Apple flagship smartphone with A17 Pro chip and titanium body.",
    "category": "mobile",
    "brand": "Apple",
    "price": 999,
    "countInStock": 40,
    "images": ["https://images.unsplash.com/photo-1695048133142-1a20484d2569"],
    "featured": true
  },
  {
    "name": "Samsung Galaxy S24",
    "description": "Premium Android smartphone with powerful AI camera.",
    "category": "mobile",
    "brand": "Samsung",
    "price": 899,
    "countInStock": 35,
    "images": ["https://images.unsplash.com/photo-1700937995322-9c55e5c9a5e1"],
    "featured": false
  },
  {
    "name": "Google Pixel 8 Pro",
    "description": "Google flagship phone with advanced AI photography.",
    "category": "mobile",
    "brand": "Google",
    "price": 899,
    "countInStock": 30,
    "images": ["https://images.unsplash.com/photo-1698243655831-7cdd192d08bc"],
    "featured": false
  },
  {
    "name": "OnePlus 12",
    "description": "Fast Android smartphone with Snapdragon processor.",
    "category": "mobile",
    "brand": "OnePlus",
    "price": 799,
    "countInStock": 45,
    "images": ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf"],
    "featured": false
  },
  {
    "name": "Canon EOS R6",
    "description": "Professional mirrorless camera with excellent low-light performance.",
    "category": "camera",
    "brand": "Canon",
    "price": 2499,
    "countInStock": 15,
    "images": ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
    "featured": true
  },
  {
    "name": "Sony Alpha A7 III",
    "description": "Full-frame mirrorless camera for photography and videography.",
    "category": "camera",
    "brand": "Sony",
    "price": 1999,
    "countInStock": 18,
    "images": ["https://images.unsplash.com/photo-1502920917128-1aa500764ce7"],
    "featured": false
  },
  {
    "name": "Nikon Z6 II",
    "description": "Professional mirrorless camera with dual processors.",
    "category": "camera",
    "brand": "Nikon",
    "price": 1899,
    "countInStock": 20,
    "images": ["https://images.unsplash.com/photo-1519183071298-a2962be96c56"],
    "featured": false
  },
  {
    "name": "Fujifilm X-T5",
    "description": "High-resolution mirrorless camera perfect for creators.",
    "category": "camera",
    "brand": "Fujifilm",
    "price": 1699,
    "countInStock": 22,
    "images": ["https://images.unsplash.com/photo-1526178613658-3f1622045557"],
    "featured": false
  },
  {
    "name": "Sony WH-1000XM5",
    "description": "Noise cancelling wireless headphones with premium audio.",
    "category": "audio",
    "brand": "Sony",
    "price": 399,
    "countInStock": 50,
    "images": ["https://images.unsplash.com/photo-1580894894513-f1e1c1b30c0d"],
    "featured": true
  },
  {
    "name": "JBL Flip 6",
    "description": "Portable waterproof Bluetooth speaker with strong bass.",
    "category": "audio",
    "brand": "JBL",
    "price": 129,
    "countInStock": 60,
    "images": ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad"],
    "featured": false
  },
  {
    "name": "Bose QuietComfort 45",
    "description": "Comfortable noise cancelling headphones with balanced sound.",
    "category": "audio",
    "brand": "Bose",
    "price": 329,
    "countInStock": 35,
    "images": ["https://images.unsplash.com/photo-1546435770-a3e426bf472b"],
    "featured": false
  },
  {
    "name": "Marshall Emberton",
    "description": "Compact Bluetooth speaker with iconic Marshall design.",
    "category": "audio",
    "brand": "Marshall",
    "price": 179,
    "countInStock": 25,
    "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1"],
    "featured": false
  },
  {
    "name": "MacBook Pro M3",
    "description": "Powerful laptop with Apple M3 chip and Retina display.",
    "category": "laptop",
    "brand": "Apple",
    "price": 1999,
    "countInStock": 20,
    "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
    "featured": true
  },
  {
    "name": "Dell XPS 13",
    "description": "Ultra portable laptop with InfinityEdge display.",
    "category": "laptop",
    "brand": "Dell",
    "price": 1299,
    "countInStock": 28,
    "images": ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
    "featured": false
  },
  {
    "name": "HP Spectre x360",
    "description": "Premium 2-in-1 laptop with touchscreen display.",
    "category": "laptop",
    "brand": "HP",
    "price": 1399,
    "countInStock": 18,
    "images": ["https://images.unsplash.com/photo-1519389950473-47ba0277781c"],
    "featured": false
  },
  {
    "name": "Lenovo ThinkPad X1 Carbon",
    "description": "Business laptop known for durability and performance.",
    "category": "laptop",
    "brand": "Lenovo",
    "price": 1499,
    "countInStock": 24,
    "images": ["https://images.unsplash.com/photo-1484788984921-03950022c9ef"],
    "featured": false
  },
  {
    "name": "Apple Watch Series 9",
    "description": "Smartwatch with advanced health tracking features.",
    "category": "watch",
    "brand": "Apple",
    "price": 429,
    "countInStock": 55,
    "images": ["https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"],
    "featured": true
  },
  {
    "name": "Samsung Galaxy Watch 6",
    "description": "Smartwatch with AMOLED display and fitness tracking.",
    "category": "watch",
    "brand": "Samsung",
    "price": 349,
    "countInStock": 45,
    "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
    "featured": false
  },
  {
    "name": "Garmin Fenix 7",
    "description": "Premium GPS smartwatch for outdoor activities.",
    "category": "watch",
    "brand": "Garmin",
    "price": 699,
    "countInStock": 20,
    "images": ["https://images.unsplash.com/photo-1551817958-20204c6a7b38"],
    "featured": false
  },
  {
    "name": "Fitbit Sense 2",
    "description": "Health focused smartwatch with stress tracking.",
    "category": "watch",
    "brand": "Fitbit",
    "price": 299,
    "countInStock": 35,
    "images": ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a"],
    "featured": false
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();

    // Create / find admin user for seeding products
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";
    const adminName = process.env.ADMIN_NAME || "Admin";

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true,
      });
      console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
    } else if (!adminUser.isAdmin) {
      adminUser.isAdmin = true;
      await adminUser.save();
      console.log(`Updated existing user to admin: ${adminEmail}`);
    }

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
