
// scripts/test-slugs.js
import { generateProductSlug } from '@/lib/slug-utils';

const testProducts = [
  "Simatic S7-200 CN CPU 224 Compact Unit",
  "Siemens Simatic S7-1200 CPU 1214C DC/DC/DC",
  "Allen Bradley 1766-L32BXB MicroLogix 1400",
  "Omron SYSMAC CJ Series CJ2M-CPU33",
  "Mitsubishi FX3U-64MT/ESS Programmable Controller"
];

console.log('🧪 Testing slug generation:\n');
testProducts.forEach(productName => {
  const slug = generateProductSlug(productName);
  console.log(`📦 ${productName}`);
  console.log(`🔗 ${slug}\n`);
});