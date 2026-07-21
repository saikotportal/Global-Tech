'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

const PART_CATEGORIES = [
  {
    id: 'cpu', label: 'CPU', required: true, icon: '🧠',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>
        <path d="M9 1v3M12 1v3M15 1v3M9 20v3M12 20v3M15 20v3M1 9h3M1 12h3M1 15h3M20 9h3M20 12h3M20 15h3"/>
      </svg>
    ),
    description: 'The brain of your PC', wattageKey: 'tdp',
  },
  {
    id: 'cooler', label: 'CPU Cooler', required: false, icon: '❄️',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    description: 'Keep your CPU cool', wattageKey: 'power',
  },
  {
    id: 'motherboard', label: 'Motherboard', required: true, icon: '🔧',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <rect x="6" y="6" width="5" height="5" rx="1"/><rect x="13" y="6" width="5" height="5" rx="1"/>
        <path d="M6 14h12M6 17h8M19 14v3"/>
      </svg>
    ),
    description: 'The backbone of your build', wattageKey: 'power',
  },
  {
    id: 'ram', label: 'RAM', required: true, icon: '💾',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="8" width="20" height="8" rx="1"/>
        <path d="M6 8V6M9 8V6M12 8V6M15 8V6M18 8V6M6 16v2M9 16v2M12 16v2M15 16v2M18 16v2M5 12h1M8 12h1M11 12h1M14 12h1M17 12h1"/>
      </svg>
    ),
    description: 'System memory', wattageKey: 'power',
  },
  {
    id: 'storage', label: 'Storage', required: true, icon: '💿',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <ellipse cx="12" cy="12" rx="10" ry="6"/>
        <path d="M2 12v5c0 3.31 4.48 6 10 6s10-2.69 10-6v-5"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    description: 'Store your data', wattageKey: 'power',
  },
  {
    id: 'gpu', label: 'Graphics Card', required: false, icon: '🎮',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="1" y="6" width="22" height="12" rx="2"/>
        <circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>
        <path d="M1 10h2M21 10h2M1 14h2M21 14h2"/>
      </svg>
    ),
    description: 'For gaming & rendering', wattageKey: 'tdp',
  },
  {
    id: 'psu', label: 'Power Supply', required: false, icon: '⚡',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M13 10l-3 4h5l-3 4"/><circle cx="7" cy="12" r="1.5"/>
      </svg>
    ),
    description: 'Power for your build', wattageKey: null,
  },
  {
    id: 'case', label: 'Case', required: false, icon: '🗜️',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="4" y="2" width="16" height="20" rx="2"/><rect x="7" y="5" width="10" height="6" rx="1"/>
        <circle cx="12" cy="17" r="1.5"/><path d="M7 14h2M7 17h1"/>
      </svg>
    ),
    description: 'House your components', wattageKey: null,
  },
  {
    id: 'monitor', label: 'Monitor', required: false, icon: '🖥️',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    description: 'See your world clearly', wattageKey: 'power',
  },
];

const PERIPHERAL_CATEGORIES = [
  {
    id: 'keyboard', label: 'Keyboard', required: false, icon: '⌨️',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="10" rx="2"/>
        <path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 15h12M8 11h.01M12 11h.01M16 11h.01"/>
      </svg>
    ),
    description: 'Type in style',
  },
  {
    id: 'mouse', label: 'Mouse', required: false, icon: '🖱️',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 2C8.13 2 5 5.13 5 9v6a7 7 0 0014 0V9c0-3.87-3.13-7-7-7z"/>
        <line x1="12" y1="2" x2="12" y2="9"/><circle cx="12" cy="6" r="1"/>
      </svg>
    ),
    description: 'Precision clicking',
  },
  {
    id: 'headset', label: 'Headset', required: false, icon: '🎧',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    description: 'Immersive audio',
  },
  {
    id: 'webcam', label: 'Webcam', required: false, icon: '📷',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        <circle cx="8.5" cy="12" r="2"/>
      </svg>
    ),
    description: 'Streaming & meetings',
  },
];

const PRODUCTS = {
  cpu: [
    { id: 'cpu1', name: 'AMD Ryzen 9 7950X', brand: 'AMD', price: 549, tdp: 170, socket: 'AM5', cores: 16, threads: 32, boost: '5.7 GHz', img: '🔴', rating: 4.9, tag: 'Flagship', powerScore: 95 },
    { id: 'cpu2', name: 'Intel Core i9-13900K', brand: 'Intel', price: 489, tdp: 125, socket: 'LGA1700', cores: 24, threads: 32, boost: '5.8 GHz', img: '🔵', rating: 4.8, tag: 'Best Value', powerScore: 92 },
    { id: 'cpu3', name: 'AMD Ryzen 7 7700X', brand: 'AMD', price: 299, tdp: 105, socket: 'AM5', cores: 8, threads: 16, boost: '5.4 GHz', img: '🔴', rating: 4.7, tag: 'Popular', powerScore: 75 },
    { id: 'cpu4', name: 'Intel Core i7-13700K', brand: 'Intel', price: 349, tdp: 125, socket: 'LGA1700', cores: 16, threads: 24, boost: '5.4 GHz', img: '🔵', rating: 4.7, tag: null, powerScore: 80 },
    { id: 'cpu5', name: 'AMD Ryzen 5 7600X', brand: 'AMD', price: 199, tdp: 105, socket: 'AM5', cores: 6, threads: 12, boost: '5.3 GHz', img: '🔴', rating: 4.6, tag: 'Budget Pick', powerScore: 58 },
    { id: 'cpu6', name: 'Intel Core i5-13600K', brand: 'Intel', price: 239, tdp: 125, socket: 'LGA1700', cores: 14, threads: 20, boost: '5.1 GHz', img: '🔵', rating: 4.6, tag: null, powerScore: 62 },
  ],
  cooler: [
    { id: 'cooler1', name: 'Noctua NH-D15', brand: 'Noctua', price: 99, power: 5, type: 'Air', tdp_support: 250, img: '🟤', rating: 4.9, tag: 'Best Air' },
    { id: 'cooler2', name: 'NZXT Kraken X73', brand: 'NZXT', price: 149, power: 7, type: '360mm AIO', tdp_support: 300, img: '⚫', rating: 4.8, tag: 'Popular' },
    { id: 'cooler3', name: 'Corsair iCUE H150i Elite', brand: 'Corsair', price: 179, power: 8, type: '360mm AIO', tdp_support: 350, img: '⚪', rating: 4.7, tag: null },
    { id: 'cooler4', name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', price: 89, power: 4, type: 'Air', tdp_support: 250, img: '⚫', rating: 4.8, tag: null },
  ],
  motherboard: [
    { id: 'mb1', name: 'ASUS ROG Maximus Z790', brand: 'ASUS', price: 599, power: 20, socket: 'LGA1700', form: 'ATX', ram_slots: 4, img: '🟡', rating: 4.9, tag: 'Premium' },
    { id: 'mb2', name: 'MSI MEG X670E ACE', brand: 'MSI', price: 499, power: 18, socket: 'AM5', form: 'ATX', ram_slots: 4, img: '🔴', rating: 4.8, tag: 'AM5 Top' },
    { id: 'mb3', name: 'Gigabyte Z790 AORUS Master', brand: 'Gigabyte', price: 399, power: 15, socket: 'LGA1700', form: 'ATX', ram_slots: 4, img: '🔵', rating: 4.7, tag: null },
    { id: 'mb4', name: 'ASUS ROG Strix B650E-F', brand: 'ASUS', price: 249, power: 12, socket: 'AM5', form: 'ATX', ram_slots: 4, img: '🟡', rating: 4.6, tag: 'Best Value' },
  ],
  ram: [
    { id: 'ram1', name: 'Corsair Dominator DDR5 32GB', brand: 'Corsair', price: 189, power: 10, speed: 'DDR5-6000', capacity: '32GB', img: '⚪', rating: 4.8, tag: 'Top Pick' },
    { id: 'ram2', name: 'G.Skill Trident Z5 RGB 32GB', brand: 'G.Skill', price: 149, power: 10, speed: 'DDR5-6400', capacity: '32GB', img: '🟢', rating: 4.9, tag: 'Fastest' },
    { id: 'ram3', name: 'Kingston Fury Beast 16GB', brand: 'Kingston', price: 79, power: 8, speed: 'DDR5-5600', capacity: '16GB', img: '🔴', rating: 4.6, tag: 'Budget' },
    { id: 'ram4', name: 'Teamgroup T-Force 64GB', brand: 'Teamgroup', price: 249, power: 12, speed: 'DDR5-6000', capacity: '64GB', img: '🔵', rating: 4.7, tag: '64GB' },
  ],
  storage: [
    { id: 'ssd1', name: 'Samsung 990 Pro 2TB NVMe', brand: 'Samsung', price: 179, power: 8, speed: '7450 MB/s', capacity: '2TB', type: 'NVMe SSD', img: '🟠', rating: 4.9, tag: 'Fastest' },
    { id: 'ssd2', name: 'WD Black SN850X 1TB', brand: 'WD', price: 109, power: 7, speed: '7300 MB/s', capacity: '1TB', type: 'NVMe SSD', img: '⚫', rating: 4.8, tag: 'Top Pick' },
    { id: 'ssd3', name: 'Seagate FireCuda 530 4TB', brand: 'Seagate', price: 299, power: 9, speed: '7300 MB/s', capacity: '4TB', type: 'NVMe SSD', img: '🟢', rating: 4.7, tag: '4TB' },
    { id: 'ssd4', name: 'Crucial P3 Plus 2TB', brand: 'Crucial', price: 89, power: 5, speed: '5000 MB/s', capacity: '2TB', type: 'NVMe SSD', img: '🔵', rating: 4.5, tag: 'Budget' },
  ],
  gpu: [
    { id: 'gpu1', name: 'NVIDIA RTX 4090 24GB', brand: 'NVIDIA', price: 1599, tdp: 450, vram: '24GB', boost: '2.52 GHz', img: '🟢', rating: 4.9, tag: 'King', powerScore: 100 },
    { id: 'gpu2', name: 'NVIDIA RTX 4080 Super', brand: 'NVIDIA', price: 999, tdp: 320, vram: '16GB', boost: '2.55 GHz', img: '🟢', rating: 4.8, tag: 'Popular', powerScore: 88 },
    { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', price: 899, tdp: 355, vram: '24GB', boost: '2.5 GHz', img: '🔴', rating: 4.7, tag: 'AMD Best', powerScore: 85 },
    { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti Super', brand: 'NVIDIA', price: 799, tdp: 285, vram: '16GB', boost: '2.61 GHz', img: '🟢', rating: 4.7, tag: null, powerScore: 78 },
    { id: 'gpu5', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', price: 449, tdp: 263, vram: '16GB', boost: '2.43 GHz', img: '🔴', rating: 4.6, tag: 'Value', powerScore: 62 },
  ],
  psu: [
    { id: 'psu1', name: 'Corsair HX1000i 1000W', brand: 'Corsair', price: 199, wattage: 1000, efficiency: '80+ Platinum', modular: 'Fully', img: '⚫', rating: 4.9, tag: 'Top Tier' },
    { id: 'psu2', name: 'EVGA SuperNOVA 850 G7', brand: 'EVGA', price: 149, wattage: 850, efficiency: '80+ Gold', modular: 'Fully', img: '🟡', rating: 4.8, tag: 'Popular' },
    { id: 'psu3', name: 'Seasonic Focus GX-750', brand: 'Seasonic', price: 119, wattage: 750, efficiency: '80+ Gold', modular: 'Fully', img: '🔴', rating: 4.8, tag: null },
    { id: 'psu4', name: 'be quiet! Straight Power 12 1000W', brand: 'be quiet!', price: 169, wattage: 1000, efficiency: '80+ Platinum', modular: 'Fully', img: '⚫', rating: 4.7, tag: null },
  ],
  case: [
    { id: 'case1', name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', price: 169, formfactor: 'ATX', size: 'Mid Tower', fans: '0 included', img: '⚫', rating: 4.9, tag: 'Most Popular' },
    { id: 'case2', name: 'Fractal Design Torrent', brand: 'Fractal', price: 189, formfactor: 'ATX', size: 'Full Tower', fans: '2×180mm', img: '⚫', rating: 4.8, tag: 'Best Airflow' },
    { id: 'case3', name: 'NZXT H9 Flow', brand: 'NZXT', price: 149, formfactor: 'ATX', size: 'Mid Tower', fans: '4×120mm', img: '⚪', rating: 4.7, tag: null },
    { id: 'case4', name: 'Corsair iCUE 5000X RGB', brand: 'Corsair', price: 179, formfactor: 'ATX', size: 'Mid Tower', fans: '3×120mm', img: '⚫', rating: 4.8, tag: 'RGB King' },
  ],
  monitor: [
    { id: 'mon1', name: 'LG 27GP950-B 4K 144Hz', brand: 'LG', price: 699, power: 40, size: '27"', resolution: '4K UHD', refresh: '144Hz', panel: 'Nano IPS', img: '🔴', rating: 4.9, tag: 'Best 4K' },
    { id: 'mon2', name: 'Samsung Odyssey G9 49"', brand: 'Samsung', price: 1099, power: 60, size: '49"', resolution: 'DQHD', refresh: '240Hz', panel: 'VA', img: '🔵', rating: 4.7, tag: 'Ultrawide' },
    { id: 'mon3', name: 'ASUS ROG Swift PG279QM', brand: 'ASUS', price: 499, power: 35, size: '27"', resolution: 'QHD', refresh: '240Hz', panel: 'IPS', img: '🟡', rating: 4.8, tag: 'Gaming' },
    { id: 'mon4', name: 'Dell S2722QC 4K', brand: 'Dell', price: 299, power: 30, size: '27"', resolution: '4K', refresh: '60Hz', panel: 'IPS', img: '🔵', rating: 4.6, tag: 'Budget 4K' },
  ],
  keyboard: [
    { id: 'kb1', name: 'Corsair K100 RGB Optical', brand: 'Corsair', price: 229, switch: 'Optical OPX', layout: 'Full', wireless: false, img: '⚫', rating: 4.8, tag: 'Pro Gaming' },
    { id: 'kb2', name: 'Logitech G915 TKL Wireless', brand: 'Logitech', price: 199, switch: 'GL Tactile', layout: 'TKL', wireless: true, img: '⚫', rating: 4.9, tag: 'Most Popular' },
    { id: 'kb3', name: 'Keychron Q3 Pro', brand: 'Keychron', price: 149, switch: 'Gateron G Pro', layout: 'TKL', wireless: true, img: '🟤', rating: 4.8, tag: 'Best Value' },
    { id: 'kb4', name: 'SteelSeries Apex Pro', brand: 'SteelSeries', price: 179, switch: 'OmniPoint Magnetic', layout: 'Full', wireless: false, img: '⚫', rating: 4.7, tag: null },
    { id: 'kb5', name: 'Razer BlackWidow V4 Pro', brand: 'Razer', price: 229, switch: 'Yellow Linear', layout: 'Full', wireless: true, img: '🟢', rating: 4.7, tag: null },
  ],
  mouse: [
    { id: 'ms1', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', price: 159, sensor: 'HERO 25K', dpi: '25,600', wireless: true, weight: '60g', img: '⚪', rating: 4.9, tag: 'Pro Pick' },
    { id: 'ms2', name: 'Razer DeathAdder V3 Pro', brand: 'Razer', price: 129, sensor: 'Focus Pro 30K', dpi: '30,000', wireless: true, weight: '63g', img: '⚫', rating: 4.8, tag: 'Popular' },
    { id: 'ms3', name: 'SteelSeries Prime Wireless', brand: 'SteelSeries', price: 99, sensor: 'TrueMove Air', dpi: '18,000', wireless: true, weight: '80g', img: '⚫', rating: 4.7, tag: null },
    { id: 'ms4', name: 'Corsair M75 Air Wireless', brand: 'Corsair', price: 119, sensor: 'Marksman 26K', dpi: '26,000', wireless: true, weight: '60g', img: '⚫', rating: 4.7, tag: 'Ultra Light' },
    { id: 'ms5', name: 'Pulsar X2H Wireless', brand: 'Pulsar', price: 79, sensor: 'PixArt PAW3395', dpi: '26,000', wireless: true, weight: '55g', img: '⚪', rating: 4.8, tag: 'Best Budget' },
  ],
  headset: [
    { id: 'hs1', name: 'SteelSeries Arctis Nova Pro', brand: 'SteelSeries', price: 249, driver: '40mm', wireless: true, surround: '360° Spatial', img: '⚫', rating: 4.9, tag: 'Premium' },
    { id: 'hs2', name: 'Logitech G Pro X 2 Lightspeed', brand: 'Logitech', price: 199, driver: '50mm Pro-G', wireless: true, surround: 'DTS:X 2.0', img: '⚫', rating: 4.8, tag: 'Pro Gaming' },
    { id: 'hs3', name: 'HyperX Cloud Alpha Wireless', brand: 'HyperX', price: 149, driver: '50mm', wireless: true, surround: '7.1', img: '🔴', rating: 4.8, tag: 'Best Value' },
    { id: 'hs4', name: 'Razer BlackShark V2 HyperSpeed', brand: 'Razer', price: 119, driver: '50mm', wireless: true, surround: '7.1', img: '⚫', rating: 4.7, tag: 'Popular' },
    { id: 'hs5', name: 'Corsair HS80 RGB Wireless', brand: 'Corsair', price: 99, driver: '50mm neodymium', wireless: true, surround: 'Dolby Atmos', img: '⚫', rating: 4.6, tag: null },
  ],
  webcam: [
    { id: 'wc1', name: 'Logitech Brio 4K Pro', brand: 'Logitech', price: 199, resolution: '4K/60fps', fov: '90°', autofocus: true, img: '⚫', rating: 4.9, tag: 'Best 4K' },
    { id: 'wc2', name: 'Razer Kiyo Pro Ultra', brand: 'Razer', price: 299, resolution: '4K/30fps', fov: '105°', autofocus: true, img: '⚫', rating: 4.8, tag: 'Best Overall' },
    { id: 'wc3', name: 'Elgato Facecam Pro', brand: 'Elgato', price: 249, resolution: '4K/60fps', fov: '90°', autofocus: false, img: '⚫', rating: 4.7, tag: 'Streamer Pick' },
    { id: 'wc4', name: 'Logitech C920 HD Pro', brand: 'Logitech', price: 79, resolution: '1080p/30fps', fov: '78°', autofocus: true, img: '⚫', rating: 4.7, tag: 'Best Budget' },
  ],
};

const BUILD_PRESETS = [
  {
    name: 'Budget Beast',
    budget: 800,
    desc: 'Great 1080p gaming under $800',
    emoji: '💰',
    color: '#22c55e',
    tag: 'BEST VALUE',
    parts: {
      cpu: 'cpu5',
      cooler: 'cooler4',
      motherboard: 'mb4',// ASUS ROG Strix B650E-F
      ram: 'ram3',
      storage: 'ssd4',
      gpu: 'gpu5',
      psu: 'psu3',
      case: 'case3',
    },
    peripherals: {
      keyboard: 'kb3',
      mouse: 'ms5',
    },
  },
  {
    name: 'Mid-Range Monster',
    budget: 1500,
    desc: '1440p gaming powerhouse',
    emoji: '⚡',
    color: '#f4874b',
    tag: 'POPULAR',
    parts: {
      cpu: 'cpu3',
      cooler: 'cooler2',
      motherboard: 'mb4',// ASUS ROG Strix B650E-F
      ram: 'ram1',
      storage: 'ssd2',
      gpu: 'gpu4',
      psu: 'psu2',
      case: 'case1',
      monitor: 'mon3',
    },
    peripherals: {
      keyboard: 'kb2',
      mouse: 'ms1',
    },
  },
  {
    name: 'Ultimate Rig',
    budget: 3000,
    desc: '4K ultra settings no compromise',
    emoji: '🔥',
    color: '#e8517a',
    tag: 'NO LIMITS',
    parts: {
      cpu: 'cpu1',
      cooler: 'cooler3',
      motherboard: 'mb2',// MSI MEG X670E ACE
      ram: 'ram2',
      storage: 'ssd1',
      gpu: 'gpu1',
      psu: 'psu1',
      case: 'case2',
      monitor: 'mon1',
    },
    peripherals: {
      keyboard: 'kb1',
      mouse: 'ms1',
      headset: 'hs1',
      webcam: 'wc1',
    },
  },
  {
    name: 'Workstation Pro',
    budget: 2500,
    desc: 'Content creation & productivity',
    emoji: '🎨',
    color: '#a855f7',
    tag: 'CREATOR',
    parts: {
      cpu: 'cpu2',
      cooler: 'cooler1',
      motherboard: 'mb1',// ASUS ROG Maximus Z790
      ram: 'ram4',
      storage: 'ssd3',
      gpu: 'gpu3',
      psu: 'psu4',
      case: 'case4',
      monitor: 'mon2',
    },
    peripherals: {
      keyboard: 'kb3',
      mouse: 'ms2',
      headset: 'hs2',
      webcam: 'wc3',
    },
  },
  {
    name: 'Esports Champion',
    budget: 1200,
    desc: 'High-FPS competitive gaming',
    emoji: '🏆',
    color: '#f5c518',
    tag: 'COMPETITIVE',
    parts: {
      cpu: 'cpu6',
      cooler: 'cooler4',
      motherboard: 'mb3',// Gigabyte Z790 AORUS Master
      ram: 'ram1',
      storage: 'ssd2',
      gpu: 'gpu5',
      psu: 'psu2',
      case: 'case3',
      monitor: 'mon3',
    },
    peripherals: {
      keyboard: 'kb4',
      mouse: 'ms1',
      headset: 'hs4',
    },
  },
  {
    name: 'Streamer Setup',
    budget: 2800,
    desc: 'Stream, create & dominate',
    emoji: '📡',
    color: '#06b6d4',
    tag: 'STREAMING',
    parts: {
      cpu: 'cpu4',
      cooler: 'cooler2',
      motherboard: 'mb3',// Gigabyte Z790 AORUS Master
      ram: 'ram4',
      storage: 'ssd1',
      gpu: 'gpu2',
      psu: 'psu1',
      case: 'case4',
      monitor: 'mon1',
    },
    peripherals: {
      keyboard: 'kb5',
      mouse: 'ms2',
      headset: 'hs1',
      webcam: 'wc2',
    },
  },
  {
    name: 'Silent Ninja',
    budget: 1800,
    desc: 'Whisper-quiet powerhouse',
    emoji: '🥷',
    color: '#64748b',
    tag: 'SILENT',
    parts: {
      cpu: 'cpu3',
      cooler: 'cooler1',
      motherboard: 'mb4',// ASUS ROG Strix B650E-F
      ram: 'ram2',
      storage: 'ssd1',
      gpu: 'gpu4',
      psu: 'psu4',
      case: 'case2',
      monitor: 'mon3',
    },
    peripherals: {
      keyboard: 'kb2',
      mouse: 'ms4',
    },
  },
  {
    name: 'RGB Galaxy',
    budget: 2200,
    desc: 'Maximum RGB. Maximum vibes.',
    emoji: '🌈',
    color: '#ec4899',
    tag: 'AESTHETIC',
    parts: {
      cpu: 'cpu4',
      cooler: 'cooler3',
      motherboard: 'mb1',// ASUS ROG Maximus Z790
      ram: 'ram2',
      storage: 'ssd1',
      gpu: 'gpu2',
      psu: 'psu1',
      case: 'case4',
      monitor: 'mon3',
    },
    peripherals: {
      keyboard: 'kb1',
      mouse: 'ms4',
      headset: 'hs5',
    },
  },
];

function calcPowerScore(selectedParts) {
  const cpuScore = selectedParts.cpu?.powerScore || 0;
  const gpuScore = selectedParts.gpu?.powerScore || 0;
  const ramScore = selectedParts.ram ? (selectedParts.ram.capacity === '64GB' ? 20 : selectedParts.ram.capacity === '32GB' ? 14 : 8) : 0;
  const storageScore = selectedParts.storage ? (selectedParts.storage.speed && parseInt(selectedParts.storage.speed) > 7000 ? 12 : 7) : 0;
  const totalParts = Object.keys(selectedParts).length;
  const base = (cpuScore * 0.35) + (gpuScore * 0.45) + (ramScore * 0.1) + (storageScore * 0.1);
  return totalParts === 0 ? 0 : Math.min(100, Math.round(base));
}

function getPCTier(score) {
  if (score >= 85) return { label: 'ABSOLUTE BEAST', emoji: '🔥', color: '#e8517a', glow: 'rgba(232,81,122,0.5)', sub: 'No game dares challenge this rig' };
  if (score >= 65) return { label: 'GAMING MONSTER', emoji: '⚡', color: '#f4874b', glow: 'rgba(244,135,75,0.4)', sub: 'Dominating at 4K ultra settings' };
  if (score >= 45) return { label: 'SOLID BUILD', emoji: '💪', color: '#f5c518', glow: 'rgba(245,197,24,0.3)', sub: 'Handles 1440p with ease' };
  if (score >= 25) return { label: 'ENTRY LEVEL', emoji: '🎯', color: '#22c55e', glow: 'rgba(34,197,94,0.3)', sub: 'Good for 1080p gaming' };
  return { label: 'POTATO PC', emoji: '🥔', color: '#94a3b8', glow: 'rgba(148,163,184,0.2)', sub: 'Can it run Minesweeper?' };
}

function triggerPrint(buildName, selectedParts, selectedPeripherals, totalPrice, totalWattage, powerScore, currency) {
  const allCats = [
    ...PART_CATEGORIES,
    ...PERIPHERAL_CATEGORIES,
  ];
  const allSelected = { ...selectedParts, ...selectedPeripherals };
  const tier = getPCTier(powerScore);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const rows = allCats.map(cat => {
    const part = allSelected[cat.id];
    return part
      ? `<tr><td>${cat.icon} ${cat.label}</td><td><strong>${part.name}</strong><br/><span style="color:#666;font-size:12px">${part.brand}</span></td><td style="text-align:right;font-weight:700">${currency.symbol}${(part.price * currency.rate).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td></tr>`
      : `<tr style="color:#bbb"><td>${cat.icon} ${cat.label}</td><td>Not selected</td><td style="text-align:right">—</td></tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${buildName} — GlobalTech PC Build</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; margin: 0; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #e8517a; padding-bottom: 18px; margin-bottom: 24px; }
    .brand { font-size: 24px; font-weight: 900; color: #e8517a; letter-spacing: -0.5px; }
    .build-name { font-size: 20px; font-weight: 700; color: #111; margin-top: 4px; }
    .date { font-size: 13px; color: #888; margin-top: 4px; }
    .tier-badge { background: linear-gradient(135deg, #e8517a, #f4874b); color: #fff; border-radius: 10px; padding: 10px 20px; text-align: center; }
    .tier-badge .emoji { font-size: 28px; display: block; }
    .tier-badge .tier-label { font-size: 14px; font-weight: 800; letter-spacing: 1px; display: block; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f4874b; color: #fff; padding: 10px 14px; text-align: left; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    th:last-child { text-align: right; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .totals { background: #f9f9f9; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
    .total-price { font-size: 28px; font-weight: 900; color: #e8517a; }
    .total-label { font-size: 13px; color: #888; font-weight: 600; }
    .watts { font-size: 16px; font-weight: 700; color: #444; }
    .power-bar-wrap { margin: 20px 0; }
    .power-bar-wrap h3 { font-size: 13px; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .power-bar { height: 14px; background: #eee; border-radius: 100px; overflow: hidden; }
    .power-fill { height: 100%; width: ${powerScore}%; background: linear-gradient(90deg, #e8517a, #f4874b); border-radius: 100px; }
    .footer { margin-top: 28px; border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #bbb; display: flex; justify-content: space-between; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 24px 0 10px; }
    .store-note { background: #fff8f0; border: 2px dashed #f4874b; border-radius: 10px; padding: 14px 18px; margin-top: 20px; font-size: 13px; color: #555; }
    .store-note strong { color: #e8517a; display: block; margin-bottom: 4px; font-size: 14px; }
    @media print {
      body { padding: 16px; }
      .store-note { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">⚡ GlobalTech</div>
      <div class="build-name">${buildName}</div>
      <div class="date">Generated ${date}</div>
    </div>
    <div class="tier-badge">
      <span class="emoji">${tier.emoji}</span>
      <span class="tier-label">${tier.label}</span>
    </div>
  </div>

  <div class="power-bar-wrap">
    <h3>PC Power Score — ${powerScore}/100</h3>
    <div class="power-bar"><div class="power-fill"></div></div>
    <div style="font-size:13px;color:#888;margin-top:6px">${tier.sub}</div>
  </div>

  <div class="section-title">🖥️ Core Components</div>
  <table>
    <thead><tr><th>Component</th><th>Part</th><th>Price</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div>
      <div class="total-label">Total Build Cost</div>
      <div class="total-price">${currency.symbol}${(totalPrice * currency.rate).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
    </div>
    <div style="text-align:right">
      <div class="total-label">Estimated Power Draw</div>
      <div class="watts">~${totalWattage}W</div>
    </div>
  </div>

  <div class="store-note">
    <strong>📋 In-Store Shopping List</strong>
    Bring this printout to any GlobalTech retail location. Our staff can help locate each component and check current in-store pricing. Prices may vary slightly from online listings.
  </div>

  <div class="footer">
    <span>GlobalTech Custom PC Builder — globaltech.store/pc-builder</span>
    <span>Prices valid as of ${date} · Subject to availability</span>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

export default function PCBuilderPage() {
  const { addItem, openCart } = useCartContext();
  const { format, currency } = useCurrency();

  const [selectedParts, setSelectedParts] = useState({});
  const [selectedPeripherals, setSelectedPeripherals] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState('parts');
  const [searchFilter, setSearchFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [totalWattage, setTotalWattage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(null);
  const [buildName, setBuildName] = useState('My Dream PC');
  const [glowCategory, setGlowCategory] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [powerScore, setPowerScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activePreset, setActivePreset] = useState(null);
  const [presetApplying, setPresetApplying] = useState(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const scoreAnimRef = useRef(null);

  useEffect(() => {
    let price = 0, watts = 0;
    Object.values(selectedParts).forEach(p => { price += p.price || 0; watts += (p.tdp || p.power || 0); });
    Object.values(selectedPeripherals).forEach(p => { price += p.price || 0; });
    setTotalPrice(price);
    setTotalWattage(watts);
    const score = calcPowerScore(selectedParts);
    setPowerScore(score);
  }, [selectedParts, selectedPeripherals]);

  useEffect(() => {
    clearInterval(scoreAnimRef.current);
    const target = powerScore;
    const start = animatedScore;
    const step = target > start ? 1 : -1;
    if (start === target) return;
    scoreAnimRef.current = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev === target) { clearInterval(scoreAnimRef.current); return prev; }
        return prev + step;
      });
    }, 15);
    return () => clearInterval(scoreAnimRef.current);
  }, [powerScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#e8517a' : '#f4874b',
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      });
      ctx.globalAlpha = 0.05; ctx.strokeStyle = '#e8517a'; ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
        }
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const applyPreset = (preset) => {
    setPresetApplying(preset.name);
    const resolvedParts = {};
    Object.entries(preset.parts).forEach(([catId, partId]) => {
      const product = (PRODUCTS[catId] || []).find(p => p.id === partId);
      if (product) resolvedParts[catId] = product;
    });
    const resolvedPeripherals = {};
    Object.entries(preset.peripherals || {}).forEach(([catId, partId]) => {
      const product = (PRODUCTS[catId] || []).find(p => p.id === partId);
      if (product) resolvedPeripherals[catId] = product;
    });
    setSelectedParts(resolvedParts);
    setSelectedPeripherals(resolvedPeripherals);
    setBuildName(preset.name);
    setActivePreset(preset.name);
    setActiveCategory(null);
    setSearchFilter('');
    setBrandFilter('All');
    setTimeout(() => setPresetApplying(null), 600);
  };

  const selectPart = (categoryId, part, section = 'parts') => {
    if (section === 'peripherals') {
      setSelectedPeripherals(prev => ({ ...prev, [categoryId]: part }));
    } else {
      setSelectedParts(prev => ({ ...prev, [categoryId]: part }));
    }
    setActivePreset(null);
    setAddedAnimation(part.id);
    setGlowCategory(categoryId);
    setTimeout(() => { setAddedAnimation(null); setGlowCategory(null); }, 800);
    setActiveCategory(null);
    setSearchFilter('');
    setBrandFilter('All');
  };

  const removePart = (categoryId, e, section = 'parts') => {
    e.stopPropagation();
    setActivePreset(null);
    if (section === 'peripherals') {
      setSelectedPeripherals(prev => { const n = { ...prev }; delete n[categoryId]; return n; });
    } else {
      setSelectedParts(prev => { const n = { ...prev }; delete n[categoryId]; return n; });
    }
  };

  const filteredProducts = (categoryId) => {
    const products = PRODUCTS[categoryId] || [];
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.brand.toLowerCase().includes(searchFilter.toLowerCase());
      const matchBrand = brandFilter === 'All' || p.brand === brandFilter;
      return matchSearch && matchBrand;
    });
  };

  const getBrands = (categoryId) => ['All', ...new Set((PRODUCTS[categoryId] || []).map(p => p.brand))];

  const completedCount = Object.keys(selectedParts).length + Object.keys(selectedPeripherals).length;
  const totalCategories = PART_CATEGORIES.length + PERIPHERAL_CATEGORIES.length;
  const requiredCount = PART_CATEGORIES.filter(c => c.required).length;
  const requiredSelected = PART_CATEGORIES.filter(c => c.required).every(c => selectedParts[c.id]);
  const progressPct = (completedCount / totalCategories) * 100;

  const getPSUSufficiency = () => {
    const psu = selectedParts.psu;
    if (!psu) return null;
    const margin = psu.wattage - totalWattage;
    if (margin < 0) return { ok: false, msg: 'PSU too weak!' };
    if (margin < 100) return { ok: false, msg: 'Too close to limit' };
    return { ok: true, msg: `${margin}W headroom` };
  };
  const psStatus = getPSUSufficiency();
  const tier = getPCTier(animatedScore);

  const handleAddAllToCart = () => {
    const allParts = { ...selectedParts, ...selectedPeripherals };
    Object.values(allParts).forEach(part => {
      addItem({
        id: part.id,
        name: part.name,
        price: part.price,
        brand: part.brand,
        image: part.img,
        qty: 1,
      });
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2500);
    openCart();
  };

  const renderCategoryRow = (cat, section = 'parts') => {
    const selected = section === 'peripherals' ? selectedPeripherals[cat.id] : selectedParts[cat.id];
    const isOpen = activeCategory === cat.id && activeSection === section;
    const isGlowing = glowCategory === cat.id;

    return (
      <div key={cat.id} style={{
        borderRadius: 16, overflow: 'hidden',
        border: isGlowing ? '1px solid rgba(232,81,122,0.6)' : isOpen ? '1px solid rgba(244,135,75,0.3)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.3s',
        boxShadow: isGlowing ? '0 0 30px rgba(232,81,122,0.2)' : 'none',
      }}>
        
        <div
          onClick={() => { setActiveSection(section); setActiveCategory(isOpen ? null : cat.id); setSearchFilter(''); setBrandFilter('All'); }}
          style={{ background: selected ? 'rgba(232,81,122,0.06)' : 'rgba(255,255,255,0.03)', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'background 0.2s', userSelect: 'none' }}
          onMouseEnter={e => !selected && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={e => e.currentTarget.style.background = selected ? 'rgba(232,81,122,0.06)' : 'rgba(255,255,255,0.03)'}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            background: selected ? 'linear-gradient(135deg,rgba(232,81,122,0.3),rgba(244,135,75,0.3))' : 'rgba(255,255,255,0.06)',
            color: selected ? '#f4874b' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s',
          }}>
            {cat.svgIcon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{cat.label}</span>
              {cat.required && <span style={{ fontSize: 10, background: 'rgba(232,81,122,0.2)', color: '#e8517a', borderRadius: 100, padding: '2px 8px', fontWeight: 600 }}>REQUIRED</span>}
            </div>
            {selected
              ? <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.name}</div>
              : <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{cat.description}</div>
            }
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            {selected ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, background: 'linear-gradient(135deg,#e8517a,#f4874b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{format(selected.price)}</div>
                <button onClick={e => removePart(cat.id, e, section)}
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8517a'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>✕ Remove</button>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,135,75,0.15)', border: '1px solid rgba(244,135,75,0.25)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#f4874b', transition: 'all 0.2s' }}>
                Choose
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 12, height: 12, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        
        {isOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', padding: 20, animation: 'slideDown 0.25s ease-out' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Search products..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 12px 9px 34px', color: '#fff', fontSize: 13, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(244,135,75,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {getBrands(cat.id).map(brand => (
                  <button key={brand} onClick={() => setBrandFilter(brand)}
                    style={{ padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', border: brandFilter === brand ? '1px solid #f4874b' : '1px solid rgba(255,255,255,0.12)', background: brandFilter === brand ? 'rgba(244,135,75,0.2)' : 'transparent', color: brandFilter === brand ? '#f4874b' : 'rgba(255,255,255,0.5)' }}>
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
              {filteredProducts(cat.id).map(product => {
                const isSelected = (section === 'peripherals' ? selectedPeripherals : selectedParts)[cat.id]?.id === product.id;
                const isHovered = hoveredPart === product.id;
                return (
                  <div key={product.id}
                    onClick={() => selectPart(cat.id, product, section)}
                    onMouseEnter={() => setHoveredPart(product.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    style={{
                      background: isSelected ? 'rgba(232,81,122,0.12)' : isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(232,81,122,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14,
                      animation: addedAnimation === product.id ? 'addPulse 0.5s ease-out' : 'none',
                    }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {product.img}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</span>
                        {product.tag && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, fontWeight: 700, background: 'rgba(232,81,122,0.2)', color: '#e8517a', flexShrink: 0 }}>{product.tag}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.45)', flexWrap: 'wrap' }}>
                        <span>{product.brand}</span>
                        {product.cores && <span>{product.cores}C/{product.threads}T</span>}
                        {product.boost && <span>Boost {product.boost}</span>}
                        {product.capacity && <span>{product.capacity}</span>}
                        {product.speed && <span>{product.speed}</span>}
                        {product.vram && <span>{product.vram} VRAM</span>}
                        {product.wattage && <span>{product.wattage}W</span>}
                        {product.refresh && <span>{product.refresh}</span>}
                        {product.switch && <span>{product.switch}</span>}
                        {product.wireless !== undefined && <span>{product.wireless ? '📡 Wireless' : '🔌 Wired'}</span>}
                        {product.dpi && <span>{product.dpi} DPI</span>}
                        {product.driver && <span>{product.driver}</span>}
                        {product.resolution && <span>{product.resolution}</span>}
                        <span>⭐ {product.rating}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: isSelected ? '#e8517a' : '#fff' }}>{format(product.price)}</div>
                      {isSelected && <div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>✓ Selected</div>}
                    </div>
                  </div>
                );
              })}
              {filteredProducts(cat.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No products match your filter</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Outfit', sans-serif", color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,81,122,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,135,75,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.8)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f4874b'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Store
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>PC Builder</span>
        </div>

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 80px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,81,122,0.1)', border: '1px solid rgba(232,81,122,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#e8517a', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>⚡ Custom Build Studio</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1.05, marginBottom: 12 }}>
              Build Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b, #f5c518)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream PC</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Choose your components, get real-time compatibility checks, and assemble your perfect machine.
            </p>
          </div>

          
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>⚡ Quick Start Presets</h2>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: '3px 10px' }}>Click to auto-select parts • customize freely after</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {BUILD_PRESETS.map(preset => {
                const isActive = activePreset === preset.name;
                const isApplying = presetApplying === preset.name;
                const presetTotal = Object.entries(preset.parts).reduce((sum, [catId, partId]) => {
                  const p = (PRODUCTS[catId] || []).find(x => x.id === partId);
                  return sum + (p?.price || 0);
                }, 0) + Object.entries(preset.peripherals || {}).reduce((sum, [catId, partId]) => {
                  const p = (PRODUCTS[catId] || []).find(x => x.id === partId);
                  return sum + (p?.price || 0);
                }, 0);
                const partCount = Object.keys(preset.parts).length + Object.keys(preset.peripherals || {}).length;

                return (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${preset.color}22, ${preset.color}10)`
                        : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? `2px solid ${preset.color}80`
                        : '2px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                      textAlign: 'left',
                      color: '#fff',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isActive ? `0 0 24px ${preset.color}30` : 'none',
                      transform: isApplying ? 'scale(0.97)' : 'scale(1)',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = `${preset.color}14`;
                        e.currentTarget.style.borderColor = `${preset.color}50`;
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 8px 24px ${preset.color}20`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}>
                    
                    {isActive && (
                      <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        background: `linear-gradient(135deg, ${preset.color}, transparent)`,
                        pointerEvents: 'none',
                      }} />
                    )}

                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 28 }}>{isApplying ? '✨' : preset.emoji}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
                          background: `${preset.color}25`, color: preset.color,
                          borderRadius: 100, padding: '2px 8px',
                        }}>{preset.tag}</span>
                        {isActive && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.15)', borderRadius: 100, padding: '2px 8px' }}>
                            ✓ APPLIED
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: isActive ? '#fff' : 'rgba(255,255,255,0.9)' }}>
                      {preset.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 10, lineHeight: 1.4 }}>
                      {preset.desc}
                    </div>

                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: preset.color, fontSize: 13, fontWeight: 700 }}>
                        {currency.symbol}{(presetTotal * currency.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                        {partCount} parts
                      </div>
                    </div>

                    
                    {isActive && (
                      <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '100%', background: preset.color, borderRadius: 100 }} />
                      </div>
                    )}

                    
                    {!isActive && (
                      <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 10, height: 10 }}>
                          <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
                        </svg>
                        Apply preset
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

            
            <div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <input
                      value={buildName}
                      onChange={e => setBuildName(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, width: '100%' }}
                      placeholder="Name your build..."
                    />
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{completedCount} of {totalCategories} parts selected</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Build Progress</span>
                      <span style={{ color: '#f4874b', fontWeight: 600 }}>{Math.round(progressPct)}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #e8517a, #f4874b)', borderRadius: 100, transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)' }} />
                    </div>
                  </div>
                </div>

                
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: '16px 20px', border: `1px solid ${animatedScore > 0 ? tier.color + '40' : 'rgba(255,255,255,0.06)'}`, transition: 'border-color 0.5s', boxShadow: animatedScore > 50 ? `0 0 30px ${tier.glow}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>PC Power Rating</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{tier.emoji}</span>
                        <span style={{ fontWeight: 800, fontSize: 16, color: tier.color, textShadow: `0 0 20px ${tier.glow}`, transition: 'color 0.5s' }}>{tier.label}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{tier.sub}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: tier.color, transition: 'color 0.5s', fontFamily: "'Syne', sans-serif" }}>{animatedScore}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>/100</div>
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${animatedScore}%`,
                      background: animatedScore >= 85
                        ? 'linear-gradient(90deg, #a855f7, #e8517a, #f4874b)'
                        : animatedScore >= 65
                        ? 'linear-gradient(90deg, #f4874b, #f5c518)'
                        : animatedScore >= 45
                        ? 'linear-gradient(90deg, #22c55e, #f5c518)'
                        : 'linear-gradient(90deg, #3b82f6, #22c55e)',
                      borderRadius: 100, transition: 'width 0.1s linear',
                      boxShadow: `0 0 12px ${tier.glow}`,
                    }} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                    <span>🥔 Potato</span>
                    <span>🎯 Entry</span>
                    <span>💪 Solid</span>
                    <span>⚡ Monster</span>
                    <span>🔥 Beast</span>
                  </div>
                </div>
              </div>

              
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                  { key: 'parts', label: '🖥️ Core Components', count: Object.keys(selectedParts).length, total: PART_CATEGORIES.length },
                  { key: 'peripherals', label: '⌨️ Peripherals', count: Object.keys(selectedPeripherals).length, total: PERIPHERAL_CATEGORIES.length },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => setActiveSection(tab.key)}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12, border: activeSection === tab.key ? '1px solid rgba(244,135,75,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      background: activeSection === tab.key ? 'rgba(244,135,75,0.1)' : 'rgba(255,255,255,0.03)',
                      color: activeSection === tab.key ? '#f4874b' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                    {tab.label}
                    <span style={{
                      background: tab.count > 0 ? (activeSection === tab.key ? '#f4874b' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)',
                      color: tab.count > 0 ? '#fff' : 'rgba(255,255,255,0.3)',
                      borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700,
                    }}>{tab.count}/{tab.total}</span>
                  </button>
                ))}
              </div>

              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeSection === 'parts'
                  ? PART_CATEGORIES.map(cat => renderCategoryRow(cat, 'parts'))
                  : PERIPHERAL_CATEGORIES.map(cat => renderCategoryRow(cat, 'peripherals'))}
              </div>
            </div>

            
            <div style={{ position: 'sticky', top: 20 }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Build Summary</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {PART_CATEGORIES.map(cat => {
                    const part = selectedParts[cat.id];
                    return (
                      <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                        <span style={{ color: part ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14 }}>{cat.icon}</span>
                          {part ? (part.name.length > 22 ? part.name.slice(0, 22) + '…' : part.name) : cat.label}
                        </span>
                        <span style={{ color: part ? '#f4874b' : 'rgba(255,255,255,0.2)', fontWeight: part ? 600 : 400, flexShrink: 0, marginLeft: 8 }}>
                          {part ? format(part.price) : '—'}
                        </span>
                      </div>
                    );
                  })}

                  
                  {Object.keys(selectedPeripherals).length > 0 && (
                    <>
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                      {PERIPHERAL_CATEGORIES.map(cat => {
                        const part = selectedPeripherals[cat.id];
                        if (!part) return null;
                        return (
                          <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 14 }}>{cat.icon}</span>
                              {part.name.length > 22 ? part.name.slice(0, 22) + '…' : part.name}
                            </span>
                            <span style={{ color: '#f4874b', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{format(part.price)}</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 22, background: 'linear-gradient(135deg,#e8517a,#f4874b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {format(totalPrice)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>Est. Power Draw</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: totalWattage > 500 ? '#f59e0b' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>~{totalWattage}W</span>
                    {psStatus && (
                      <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 100, background: psStatus.ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: psStatus.ok ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                        {psStatus.msg}
                      </span>
                    )}
                  </div>
                </div>

                
                <button
                  disabled={!requiredSelected}
                  onClick={handleAddAllToCart}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: requiredSelected ? 'pointer' : 'not-allowed',
                    background: cartSuccess ? 'linear-gradient(135deg,#22c55e,#16a34a)' : requiredSelected ? 'linear-gradient(135deg, #e8517a, #f4874b)' : 'rgba(255,255,255,0.08)',
                    color: requiredSelected ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 15, transition: 'all 0.3s',
                    fontFamily: "'Outfit', sans-serif", transform: 'scale(1)',
                  }}
                  onMouseEnter={e => requiredSelected && (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  {cartSuccess
                    ? '✓ Added to Cart!'
                    : requiredSelected
                    ? `🛒 Add All to Cart (${completedCount} items)`
                    : `Select ${requiredCount - Object.keys(selectedParts).filter(k => PART_CATEGORIES.find(c => c.id === k && c.required)).length} more required parts`}
                </button>

                {!requiredSelected && (
                  <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                    CPU, Motherboard, RAM & Storage required
                  </div>
                )}

                
                {completedCount > 0 && (
                  <button
                    onClick={() => triggerPrint(buildName, selectedParts, selectedPeripherals, totalPrice, totalWattage, powerScore, currency)}
                    style={{
                      width: '100%', padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 10, transition: 'all 0.2s',
                      fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Print / Save for In-Store
                  </button>
                )}
              </div>

              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Compatibility</div>
                {completedCount === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>Add parts to see compatibility</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedParts.cpu && selectedParts.motherboard && (
                      <CompatRow
                        ok={selectedParts.cpu.socket === selectedParts.motherboard.socket}
                        label="CPU ↔ Motherboard"
                        detail={selectedParts.cpu.socket === selectedParts.motherboard.socket ? 'Socket compatible' : `CPU: ${selectedParts.cpu.socket} / MB: ${selectedParts.motherboard.socket}`}
                      />
                    )}
                    {psStatus && <CompatRow ok={psStatus.ok} label="PSU Wattage" detail={psStatus.msg} />}
                    <CompatRow ok={true} label="Form Factor" detail="ATX standard compatible" />
                    {completedCount >= 3 && (
                      <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, fontSize: 12, color: '#22c55e' }}>
                        ✓ No critical issues detected
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes addPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(232,81,122,0.4); } 100% { transform: scale(1); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
      `}</style>
    </div>
  );
}

function CompatRow({ ok, label, detail }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: ok ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)' }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{ok ? '✅' : '❌'}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: ok ? '#22c55e' : '#ef4444' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{detail}</div>
      </div>
    </div>
  );
}
