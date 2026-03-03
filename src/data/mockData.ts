/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SKU, Material, ProductionLine, SKUCategory, ProductionTask } from '../types';

export const MATERIALS: Material[] = [
  { id: 'mat-01', name: 'Sugar', stockLevel: 5000, unit: 'kg' },
  { id: 'mat-02', name: 'Milk Powder', stockLevel: 2000, unit: 'kg' },
  { id: 'mat-03', name: 'Flavoring', stockLevel: 500, unit: 'L' },
  { id: 'mat-04', name: 'Packaging Film', stockLevel: 10000, unit: 'm' },
];

export const SKUS: SKU[] = [
  {
    id: 'sku-01',
    name: 'Vanilla Milkshake 250ml',
    category: SKUCategory.DAIRY,
    productionRate: 5000,
    materialRequirements: [
      { materialId: 'mat-01', quantityPerUnit: 0.02 },
      { materialId: 'mat-02', quantityPerUnit: 0.05 },
      { materialId: 'mat-04', quantityPerUnit: 0.1 },
    ],
  },
  {
    id: 'sku-02',
    name: 'Chocolate Milkshake 250ml',
    category: SKUCategory.DAIRY,
    productionRate: 4800,
    materialRequirements: [
      { materialId: 'mat-01', quantityPerUnit: 0.025 },
      { materialId: 'mat-02', quantityPerUnit: 0.05 },
      { materialId: 'mat-03', quantityPerUnit: 0.01 },
      { materialId: 'mat-04', quantityPerUnit: 0.1 },
    ],
  },
  {
    id: 'sku-03',
    name: 'Potato Chips Salted 50g',
    category: SKUCategory.SNACKS,
    productionRate: 8000,
    materialRequirements: [
      { materialId: 'mat-04', quantityPerUnit: 0.05 },
    ],
  },
];

export const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'line-01', name: 'Liquid Line A', weeklyCapacityHrs: 120, efficiency: 0.85 },
  { id: 'line-02', name: 'Snack Line B', weeklyCapacityHrs: 140, efficiency: 0.9 },
];

const now = new Date();
const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
startOfWeek.setHours(8, 0, 0, 0);

export const INITIAL_TASKS: ProductionTask[] = [
  {
    id: 'task-01',
    skuId: 'sku-01',
    lineId: 'line-01',
    startTime: new Date(startOfWeek),
    durationHrs: 24,
    quantity: 100000,
    isUrgent: false,
    status: 'PLANNED',
  },
  {
    id: 'task-02',
    skuId: 'sku-03',
    lineId: 'line-02',
    startTime: new Date(startOfWeek),
    durationHrs: 36,
    quantity: 250000,
    isUrgent: false,
    status: 'PLANNED',
  },
];
