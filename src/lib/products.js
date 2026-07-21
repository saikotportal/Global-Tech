export const PRODUCTS = [
  { id: 1,  name: 'iPhone 16 Pro Max',       category: 'phones',        brand: 'Apple',    price: 1199, originalPrice: 1299, rating: 4.9, reviews: 2841, inStock: true,  stock: 3,  badge: 'New',  tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', description: 'A18 Pro chip, titanium design, 48MP camera system, ProMotion display.' },
  { id: 2,  name: 'Samsung Galaxy S25 Ultra', category: 'phones',       brand: 'Samsung',  price: 1099, originalPrice: 1199, rating: 4.8, reviews: 1923, inStock: true,  stock: 18, badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', description: 'Snapdragon 8 Elite, 200MP camera, S Pen, 5000mAh battery.' },
  { id: 16, name: 'Google Pixel 9 Pro XL',    category: 'phones',       brand: 'Google',   price: 999,  originalPrice: 1099, rating: 4.7, reviews: 1102, inStock: true,  stock: 22, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', description: 'Tensor G4, 5x telephoto, Magic Eraser, 24hr+ battery.' },
  { id: 17, name: 'OnePlus 13',               category: 'phones',       brand: 'OnePlus',  price: 799,  originalPrice: 899,  rating: 4.6, reviews: 876,  inStock: true,  stock: 7,  badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80', description: 'Snapdragon 8 Elite, 100W charging, Hasselblad triple camera.' },

  { id: 3,  name: 'MacBook Pro 16" M4 Max',  category: 'laptops',       brand: 'Apple',    price: 2499, originalPrice: 2799, rating: 4.9, reviews: 1204, inStock: true,  stock: 5,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', description: 'M4 Max chip, 48GB RAM, 1TB SSD, Liquid Retina XDR display.' },
  { id: 4,  name: 'Dell XPS 15 OLED',        category: 'laptops',       brand: 'Dell',     price: 1899, originalPrice: 2199, rating: 4.7, reviews: 876,  inStock: true,  stock: 14, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80', description: 'Intel Core Ultra 9, RTX 4070, 3.5K OLED touch display, 32GB RAM.' },
  { id: 18, name: 'ASUS ROG Zephyrus G16',   category: 'laptops',       brand: 'ASUS',     price: 2199, originalPrice: 2499, rating: 4.8, reviews: 654,  inStock: true,  stock: 9,  badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', description: 'RTX 4090, AMD Ryzen 9, 240Hz OLED display, 16-core CPU.' },
  { id: 19, name: 'Lenovo ThinkPad X1 Carbon', category: 'laptops',     brand: 'Lenovo',   price: 1699, originalPrice: 1999, rating: 4.7, reviews: 543,  inStock: true,  stock: 31, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', description: 'Intel Core Ultra 7, 32GB RAM, 1TB SSD, 2.8K OLED, 14hr battery.' },

  { id: 5,  name: 'LG C4 77" OLED 4K TV',   category: 'tvs',           brand: 'LG',       price: 1799, originalPrice: 2499, rating: 4.8, reviews: 654,  inStock: true,  stock: 4,  badge: 'Deal', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80', description: 'Evo panel, α9 AI Processor 4K, Dolby Vision IQ, G-Sync compatible.' },
  { id: 6,  name: 'Sony Bravia 9 65"',       category: 'tvs',           brand: 'Sony',     price: 2299, originalPrice: 2799, rating: 4.7, reviews: 432,  inStock: true,  stock: 11, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=500&q=80', description: 'XR Processor, OLED panel, Google TV, Acoustic Surface Audio+.' },
  { id: 15, name: 'Samsung 85" Neo QLED 8K', category: 'tvs',           brand: 'Samsung',  price: 3999, originalPrice: 5499, rating: 4.6, reviews: 234,  inStock: true,  stock: 2,  badge: 'Deal', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=500&q=80', description: 'Neo Quantum Processor 8K, Quantum Mini LEDs, Real 8K resolution.' },
  { id: 20, name: 'TCL QM891G 75" Mini-LED', category: 'tvs',           brand: 'TCL',      price: 1299, originalPrice: 1599, rating: 4.5, reviews: 812,  inStock: true,  stock: 27, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&q=80', description: '144Hz gaming TV, QLED, Dolby Vision, Google TV, HDMI 2.1.' },

  { id: 9,  name: 'PS5 Pro',                 category: 'gaming',        brand: 'Sony',     price: 699,  originalPrice: 699,  rating: 4.9, reviews: 4521, inStock: false, stock: 0,  badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&q=80', description: '4K gaming at 120fps, PlayStation Spectral Super Resolution, 2TB SSD.' },
  { id: 10, name: 'Xbox Series X 2TB',       category: 'gaming',        brand: 'Microsoft',price: 599,  originalPrice: 699,  rating: 4.8, reviews: 2341, inStock: true,  stock: 16, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80', description: '4K gaming, 120fps, 2TB SSD, Xbox Game Pass Ultimate bundle.' },
  { id: 21, name: 'Nintendo Switch 2',       category: 'gaming',        brand: 'Nintendo', price: 449,  originalPrice: 449,  rating: 4.9, reviews: 3210, inStock: true,  stock: 8,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=500&q=80', description: '8" HDR display, NVIDIA DLSS, 4K TV mode, backward compatible.' },
  { id: 22, name: 'ASUS ROG Ally X',         category: 'gaming',        brand: 'ASUS',     price: 899,  originalPrice: 999,  rating: 4.7, reviews: 1234, inStock: true,  stock: 20, badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80', description: 'AMD Ryzen Z1 Extreme, 1080p 120Hz display, Windows 11, 1TB SSD.' },

  { id: 11, name: 'Sony A7R V',              category: 'cameras',       brand: 'Sony',     price: 3499, originalPrice: 3799, rating: 4.9, reviews: 891,  inStock: true,  stock: 6,  badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', description: '61MP BSI CMOS sensor, AI-powered autofocus, 8K video, 5-axis IBIS.' },
  { id: 23, name: 'Canon EOS R5 Mark II',    category: 'cameras',       brand: 'Canon',    price: 4299, originalPrice: 4599, rating: 4.8, reviews: 567,  inStock: true,  stock: 13, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', description: '45MP stacked CMOS, 8K RAW video, 30fps burst, in-body stabilisation.' },
  { id: 24, name: 'Fujifilm X100VI',         category: 'cameras',       brand: 'Fujifilm', price: 1599, originalPrice: 1699, rating: 4.9, reviews: 1432, inStock: false, stock: 0,  badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&q=80', description: '40MP X-Trans sensor, built-in ND filter, IBIS, film simulations.' },

  { id: 12, name: 'DJI Mavic 4 Pro',         category: 'drones',        brand: 'DJI',      price: 1899, originalPrice: 2099, rating: 4.8, reviews: 567,  inStock: true,  stock: 10, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80', description: 'Triple-camera system, 6K video, 46-min flight time, OcuSync 4.0.' },
  { id: 25, name: 'DJI Mini 4 Pro',          category: 'drones',        brand: 'DJI',      price: 759,  originalPrice: 959,  rating: 4.8, reviews: 2134, inStock: true,  stock: 25, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?w=500&q=80', description: 'Under 249g, 4K/60fps, omnidirectional obstacle sensing, 34-min flight.' },
  { id: 26, name: 'DJI Air 3S',              category: 'drones',        brand: 'DJI',      price: 1099, originalPrice: 1199, rating: 4.7, reviews: 876,  inStock: true,  stock: 19, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=500&q=80', description: '1-inch CMOS sensor, 4K/120fps, 45-min flight time, tri-directional sensing.' },

  { id: 27, name: 'Apple Watch Ultra 3',     category: 'smartwatch',    brand: 'Apple',    price: 799,  originalPrice: 899,  rating: 4.9, reviews: 3421, inStock: true,  stock: 12, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80', description: '49mm titanium case, 36hr battery, dual-frequency GPS, Action button.' },
  { id: 28, name: 'Samsung Galaxy Watch 7',  category: 'smartwatch',    brand: 'Samsung',  price: 299,  originalPrice: 349,  rating: 4.7, reviews: 1876, inStock: true,  stock: 34, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'BioActive Sensor, sleep coaching, Galaxy AI, 40hr battery life.' },
  { id: 29, name: 'Garmin Fenix 8 Sapphire', category: 'smartwatch',   brand: 'Garmin',   price: 999,  originalPrice: 1099, rating: 4.8, reviews: 987,  inStock: true,  stock: 15, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80', description: 'AMOLED display, 29-day battery, built-in flashlight, multi-band GPS.' },

  { id: 30, name: 'Apple Vision Pro',        category: 'vr',            brand: 'Apple',    price: 3499, originalPrice: 3499, rating: 4.7, reviews: 2341, inStock: true,  stock: 4,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&q=80', description: 'M2 + R1 chips, micro-OLED displays, eye/hand/voice control, visionOS.' },
  { id: 31, name: 'Meta Quest 3S',           category: 'vr',            brand: 'Meta',     price: 299,  originalPrice: 399,  rating: 4.6, reviews: 4532, inStock: true,  stock: 42, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&q=80', description: 'Snapdragon XR2 Gen 2, mixed reality, 128GB, 2.5hr playtime.' },
  { id: 32, name: 'Sony PlayStation VR2',    category: 'vr',            brand: 'Sony',     price: 549,  originalPrice: 699,  rating: 4.5, reviews: 1234, inStock: true,  stock: 17, badge: 'Deal', tags: [],              image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&q=80', description: '4K HDR, eye tracking, haptic feedback controllers, 110° FOV.' },

  { id: 33, name: 'ASUS ROG Rapture GT-BE98', category: 'networking',   brand: 'ASUS',     price: 699,  originalPrice: 799,  rating: 4.8, reviews: 543,  inStock: true,  stock: 8,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80', description: 'Wi-Fi 7, quad-band, 10Gb port, 2.5Gb WAN, gaming traffic prioritisation.' },
  { id: 34, name: 'Eero Max 7',              category: 'networking',    brand: 'Amazon',   price: 599,  originalPrice: 699,  rating: 4.7, reviews: 1234, inStock: true,  stock: 23, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&q=80', description: 'Wi-Fi 7 mesh system, 9.4Gbps, 2.5Gb + 10Gb ports, Thread/Zigbee hub.' },
  { id: 35, name: 'TP-Link Archer BE800',    category: 'networking',    brand: 'TP-Link',  price: 349,  originalPrice: 449,  rating: 4.6, reviews: 876,  inStock: true,  stock: 38, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80', description: 'Wi-Fi 7, tri-band 19Gbps, 2.5Gb WAN, 8 antennas, VPN support.' },

  { id: 36, name: 'Apple Mac Studio M4 Ultra', category: 'desktop',     brand: 'Apple',    price: 3999, originalPrice: 4299, rating: 4.9, reviews: 654,  inStock: true,  stock: 6,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', description: 'M4 Ultra chip, 192GB RAM, 8TB SSD, 32-core GPU, 8K support.' },
  { id: 37, name: 'Alienware Aurora R16',    category: 'desktop',       brand: 'Dell',     price: 2799, originalPrice: 3299, rating: 4.7, reviews: 432,  inStock: true,  stock: 9,  badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80', description: 'Intel Core i9, RTX 4090, 64GB DDR5, 2TB NVMe, liquid cooling.' },
  { id: 38, name: 'ASUS ProArt Station PD7', category: 'desktop',       brand: 'ASUS',     price: 2299, originalPrice: 2599, rating: 4.6, reviews: 321,  inStock: true,  stock: 11, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1593640408182-31c228b2c7f2?w=500&q=80', description: 'Intel Core Ultra 9, RTX 4080, 64GB RAM, Thunderbolt 4, tool-free chassis.' },

  { id: 39, name: 'Apple TV 4K (3rd Gen)',   category: 'entertainment',  brand: 'Apple',   price: 129,  originalPrice: 149,  rating: 4.8, reviews: 5432, inStock: true,  stock: 55, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80', description: 'A15 Bionic, 4K HDR, Dolby Atmos, thread router, Siri Remote.' },
  { id: 40, name: 'Sonos Arc Ultra',         category: 'entertainment',  brand: 'Sonos',   price: 999,  originalPrice: 1099, rating: 4.8, reviews: 1876, inStock: true,  stock: 7,  badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80', description: 'Dolby Atmos soundbar, Sound Motion technology, HDMI eARC, Wi-Fi 6.' },
  { id: 41, name: 'LG CineBeam Q Projector', category: 'entertainment',  brand: 'LG',      price: 1699, originalPrice: 1999, rating: 4.6, reviews: 432,  inStock: true,  stock: 13, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80', description: '4K laser projector, 500 lumens, webOS, up to 120" screen, 3hr battery.' },

  { id: 7,  name: 'Sony WH-1000XM6',        category: 'audio',         brand: 'Sony',     price: 349,  originalPrice: 399,  rating: 4.9, reviews: 3210, inStock: true,  stock: 29, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Industry-leading ANC, 40hr battery, Hi-Res Audio, multipoint connection.' },
  { id: 8,  name: 'Bose QuietComfort Ultra', category: 'audio',         brand: 'Bose',     price: 299,  originalPrice: 379,  rating: 4.7, reviews: 1876, inStock: true,  stock: 21, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80', description: 'World-class noise cancellation, Immersive Audio, CustomTune technology.' },

  { id: 13, name: 'Amazon Echo Hub',         category: 'smart-home',    brand: 'Amazon',   price: 179,  originalPrice: 229,  rating: 4.6, reviews: 2134, inStock: true,  stock: 44, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80', description: 'Smart home control panel, 8" display, Matter & Zigbee hub built-in.' },
  { id: 14, name: 'Nest Doorbell 4K',        category: 'smart-home',    brand: 'Google',   price: 249,  originalPrice: 299,  rating: 4.7, reviews: 1432, inStock: true,  stock: 33, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', description: '4K HDR video, 24/7 streaming, face recognition, AI alerts, weatherproof.' },
  { id: 42, name: 'Apple AirPods Pro 3',        category: 'audio',       brand: 'Apple',      price: 249,  originalPrice: 279,  rating: 4.8, reviews: 8421, inStock: true,  stock: 48, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1588423771073-b8903fead714?w=500&q=80', description: 'H2 chip, Adaptive Audio, Hearing Aid mode, USB-C, 30hr total battery.' },
  { id: 43, name: 'Samsung Galaxy Buds 3 Pro',  category: 'audio',       brand: 'Samsung',    price: 229,  originalPrice: 249,  rating: 4.6, reviews: 1543, inStock: true,  stock: 37, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=500&q=80', description: 'ANC, 360 Audio, 6hr battery, IP57, AI voice translation.' },
  { id: 44, name: 'Sennheiser Momentum 4',      category: 'audio',       brand: 'Sennheiser', price: 279,  originalPrice: 349,  rating: 4.8, reviews: 2109, inStock: true,  stock: 16, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80', description: '60hr battery, Adaptive ANC, Hi-Res Audio, crystal-clear call quality.' },
  { id: 45, name: 'JBL Xtreme 4',               category: 'audio',       brand: 'JBL',        price: 299,  originalPrice: 349,  rating: 4.7, reviews: 3210, inStock: true,  stock: 22, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', description: '24hr playtime, IP67 waterproof, Auracast, built-in powerbank.' },

  { id: 46, name: 'Philips Hue Gradient Strip', category: 'smart-home',  brand: 'Philips',    price: 199,  originalPrice: 229,  rating: 4.7, reviews: 3421, inStock: true,  stock: 55, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80', description: '2m gradient LED strip, 16M colors, voice control, sync with Hue Bridge.' },
  { id: 47, name: 'Arlo Ultra 2 4K Camera',     category: 'smart-home',  brand: 'Arlo',       price: 299,  originalPrice: 349,  rating: 4.6, reviews: 1876, inStock: true,  stock: 28, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80', description: '4K HDR, color night vision, 180° FOV, solar panel compatible.' },
  { id: 48, name: 'Ecobee Premium Thermostat',  category: 'smart-home',  brand: 'Ecobee',     price: 249,  originalPrice: 299,  rating: 4.8, reviews: 5432, inStock: true,  stock: 43, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', description: 'SmartSensor, air quality monitor, Alexa built-in, energy savings.' },

  { id: 49, name: 'iPhone 16',                  category: 'phones',      brand: 'Apple',      price: 799,  originalPrice: 829,  rating: 4.7, reviews: 6211, inStock: true,  stock: 34, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', description: 'A18 chip, Camera Control button, 48MP main camera, USB-C.' },
  { id: 50, name: 'Samsung Galaxy A55 5G',      category: 'phones',      brand: 'Samsung',    price: 449,  originalPrice: 499,  rating: 4.5, reviews: 4312, inStock: true,  stock: 62, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', description: 'Exynos 1480, 50MP triple camera, 120Hz AMOLED, 5000mAh, IP67.' },
  { id: 51, name: 'Xiaomi 15 Ultra',            category: 'phones',      brand: 'Xiaomi',     price: 1099, originalPrice: 1199, rating: 4.7, reviews: 1023, inStock: true,  stock: 11, badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80', description: 'Snapdragon 8 Elite, Leica quad camera, 200W charging, 5500mAh.' },

  { id: 52, name: 'HP Spectre x360 14',         category: 'laptops',     brand: 'HP',         price: 1699, originalPrice: 1899, rating: 4.7, reviews: 1234, inStock: true,  stock: 18, badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', description: 'Intel Core Ultra 7, 2.8K OLED touch, 360° hinge, 18hr battery.' },
  { id: 53, name: 'Microsoft Surface Pro 11',   category: 'laptops',     brand: 'Microsoft',  price: 1599, originalPrice: 1799, rating: 4.6, reviews: 876,  inStock: true,  stock: 24, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', description: 'Snapdragon X Elite, OLED display, Copilot+ AI, all-day battery.' },
  { id: 54, name: 'Razer Blade 16',             category: 'laptops',     brand: 'Razer',      price: 3499, originalPrice: 3999, rating: 4.8, reviews: 654,  inStock: true,  stock: 7,  badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', description: 'RTX 4090, Core i9, 4K OLED 240Hz, 32GB DDR5, per-key RGB.' },

  { id: 55, name: 'Valve Steam Deck OLED',      category: 'gaming',      brand: 'Valve',      price: 549,  originalPrice: 649,  rating: 4.8, reviews: 7821, inStock: true,  stock: 15, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80', description: '7.4" HDR OLED, 90Hz, AMD APU, 50Wh battery, 1TB SSD.' },
  { id: 56, name: 'Razer DeathAdder V3 Pro',    category: 'gaming',      brand: 'Razer',      price: 159,  originalPrice: 189,  rating: 4.9, reviews: 4312, inStock: true,  stock: 41, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80', description: '30K DPI optical sensor, 90hr battery, Focus Pro, 64g ultra-light.' },
  { id: 57, name: 'Sony InZone M9 II Monitor',  category: 'gaming',      brand: 'Sony',       price: 799,  originalPrice: 999,  rating: 4.7, reviews: 1098, inStock: true,  stock: 9,  badge: 'Sale', tags: [],              image: 'https://images.unsplash.com/photo-1593640408182-31c228b2c7f2?w=500&q=80', description: '27" 4K 144Hz IPS, HDMI 2.1, G-Sync compatible, PS5 auto settings.' },

  { id: 58, name: 'GoPro Hero 13 Black',        category: 'cameras',     brand: 'GoPro',      price: 399,  originalPrice: 449,  rating: 4.7, reviews: 6543, inStock: true,  stock: 33, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', description: '5.3K60 video, HyperSmooth 7.0, waterproof to 20ft, Enduro battery.' },
  { id: 59, name: 'DJI Osmo Pocket 3',          category: 'cameras',     brand: 'DJI',        price: 519,  originalPrice: 599,  rating: 4.8, reviews: 2341, inStock: true,  stock: 19, badge: 'Hot',  tags: [],              image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&q=80', description: '1-inch CMOS, 4K/120fps, 2" OLED rotatable screen, ActiveTrack 6.0.' },

  { id: 60, name: 'iPad Pro 13" M4',           category: 'tablets',     brand: 'Apple',      price: 1299, originalPrice: 1399, rating: 4.9, reviews: 3421, inStock: true,  stock: 16, badge: 'New',  tags: [],              image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', description: 'M4 chip, Ultra Retina XDR OLED, 2TB storage, Apple Pencil Pro.' },
  { id: 61, name: 'Samsung Galaxy Tab S10 Ultra',category: 'tablets',    brand: 'Samsung',    price: 1199, originalPrice: 1299, rating: 4.7, reviews: 2109, inStock: true,  stock: 23, badge: 'Sale', tags: ['flash-deals'], image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80', description: '14.6" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, S Pen included, 12GB RAM.' },
  { id: 62, name: 'Microsoft Surface Pro 11',   category: 'tablets',     brand: 'Microsoft',  price: 1099, originalPrice: 1299, rating: 4.6, reviews: 1432, inStock: true,  stock: 31, badge: null,   tags: [],              image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80', description: 'Snapdragon X Plus, 13" OLED, Slim Pen 2 support, kickstand design.' },

];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id)) || null;
}

export function getProductsByCategory(category) {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return PRODUCTS.slice(0, 8);
}

export function getFlashDeals() {
  return PRODUCTS.filter((p) => p.tags.includes('flash-deals'));
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'LG', 'Bose', 'Microsoft', 'Google', 'Amazon', 'DJI', 'ASUS', 'Lenovo', 'OnePlus', 'Canon', 'Fujifilm', 'Garmin', 'Meta', 'Nintendo', 'TCL', 'TP-Link', 'Sonos', 'Philips', 'Arlo', 'Ecobee', 'Sennheiser', 'JBL', 'Xiaomi', 'HP', 'Razer', 'Valve', 'GoPro'];

export const CATEGORIES = [
  { id: 'phones',        label: 'Phones',         emoji: '📱' },
  { id: 'laptops',       label: 'Laptops',        emoji: '💻' },
  { id: 'tvs',           label: 'TVs',            emoji: '📺' },
  { id: 'gaming',        label: 'Gaming',         emoji: '🎮' },
  { id: 'cameras',       label: 'Cameras',        emoji: '📷' },
  { id: 'drones',        label: 'Drones',         emoji: '🚁' },
  { id: 'smartwatch',    label: 'Smart Watch',    emoji: '⌚' },
  { id: 'vr',            label: 'VR / AR',        emoji: '🥽' },
  { id: 'networking',    label: 'Routers',        emoji: '📡' },
  { id: 'desktop',       label: 'Desktop',        emoji: '🖥️' },
  { id: 'entertainment', label: 'Entertainment',  emoji: '🎬' },
  { id: 'audio',         label: 'Audio',          emoji: '🎧' },
  { id: 'smart-home',    label: 'Smart Home',     emoji: '🏠' },
  { id: 'tablets',       label: 'Tablets',        emoji: '📱' },
];
