import type { Part } from './types';

const partsData: Part[] = [
  {
    id: 'part-001',
    name: 'All-Terrain Tire Set',
    description: 'A set of four durable tires designed for off-road desert conditions. Excellent grip and longevity.',
    price: 899.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '123 Dune Way, Sandville, AZ',
    isVisibleForSale: true,
  },
  {
    id: 'part-002',
    name: 'Heavy-Duty Radiator',
    description: 'High-performance radiator to keep your engine cool under the scorching desert sun.',
    price: 349.50,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '456 Oasis Blvd, Rock Springs, NV',
    isVisibleForSale: true,
  },
  {
    id: 'part-003',
    name: 'Performance Air Filter',
    description: 'Protects your engine from sand and dust while improving airflow and horsepower.',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: false,
    vendorAddress: '123 Dune Way, Sandville, AZ',
    isVisibleForSale: true,
  },
  {
    id: 'part-004',
    name: 'LED Light Bar',
    description: '22-inch light bar for superior visibility during night-time desert drives.',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '789 Canyon Rd, Mirage City, CA',
    isVisibleForSale: true,
  },
  {
    id: 'part-005',
    name: 'Premium Ceramic Brake Pads',
    description: 'Low-dust, quiet operation brake pads with excellent stopping power for any vehicle.',
    price: 120.75,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '456 Oasis Blvd, Rock Springs, NV',
    isVisibleForSale: true,
  },
  {
    id: 'part-006',
    name: 'Upgraded Suspension Kit',
    description: 'Provides a smoother ride on rough terrain and increases ground clearance.',
    price: 1250.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '789 Canyon Rd, Mirage City, CA',
    isVisibleForSale: true,
  },
  {
    id: 'part-007',
    name: 'Engine Oil - Synthetic Blend',
    description: 'High-mileage synthetic blend oil for superior engine protection in extreme temperatures.',
    price: 45.99,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '123 Dune Way, Sandville, AZ',
    isVisibleForSale: true,
  },
  {
    id: 'part-008',
    name: 'Car Battery - 750 CCA',
    description: 'Reliable car battery with 750 cold cranking amps for consistent starts in all weather.',
    price: 180.00,
    imageUrl: 'https://placehold.co/600x400.png',
    inStock: true,
    vendorAddress: '456 Oasis Blvd, Rock Springs, NV',
    isVisibleForSale: true,
  },
];

// In a real app, this would be a database call.
// We'll use a global variable to simulate a database for now.
if (!global.parts) {
  global.parts = partsData;
}

export function getParts(): Part[] {
    return global.parts;
}

export function addPart(part: Part) {
    global.parts.unshift({ ...part, isVisibleForSale: true });
    return part;
}

export function togglePartVisibility(partId: string): Part | undefined {
    const part = global.parts.find((p) => p.id === partId);
    if (part) {
        part.isVisibleForSale = !part.isVisibleForSale;
        return part;
    }
    return undefined;
}
