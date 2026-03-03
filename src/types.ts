/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SKUCategory {
  DRINKS = 'DRINKS',
  SNACKS = 'SNACKS',
  DAIRY = 'DAIRY',
  PERSONAL_CARE = 'PERSONAL_CARE',
}

export interface MaterialRequirement {
  materialId: string;
  quantityPerUnit: number;
}

export interface SKU {
  id: string;
  name: string;
  category: SKUCategory;
  productionRate: number; // units per hour
  materialRequirements: MaterialRequirement[];
}

export interface Material {
  id: string;
  name: string;
  stockLevel: number;
  unit: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  weeklyCapacityHrs: number;
  efficiency: number; // 0.0 to 1.0
}

export interface ProductionTask {
  id: string;
  skuId: string;
  lineId: string;
  startTime: Date;
  durationHrs: number;
  quantity: number;
  isUrgent: boolean;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ProductionSchedule {
  tasks: ProductionTask[];
}
