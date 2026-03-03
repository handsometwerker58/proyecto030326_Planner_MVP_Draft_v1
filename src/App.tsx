/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Factory,
  ChevronRight,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  SKU, 
  Material, 
  ProductionLine, 
  ProductionTask, 
  SKUCategory 
} from './types';
import { 
  SKUS, 
  MATERIALS, 
  PRODUCTION_LINES, 
  INITIAL_TASKS 
} from './data/mockData';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [tasks, setTasks] = useState<ProductionTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'materials'>('dashboard');
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [urgentSkuId, setUrgentSkuId] = useState(SKUS[0].id);
  const [urgentLineId, setUrgentLineId] = useState(PRODUCTION_LINES[0].id);
  const [urgentQuantity, setUrgentQuantity] = useState(50000);

  // Stats Calculations
  const capacityStats = useMemo(() => {
    return PRODUCTION_LINES.map(line => {
      const lineTasks = tasks.filter(t => t.lineId === line.id);
      const usedHrs = lineTasks.reduce((acc, t) => acc + t.durationHrs, 0);
      const utilization = (usedHrs / line.weeklyCapacityHrs) * 100;
      return {
        name: line.name,
        used: usedHrs,
        total: line.weeklyCapacityHrs,
        utilization: Math.round(utilization),
      };
    });
  }, [tasks]);

  const materialStats = useMemo(() => {
    return MATERIALS.map(mat => {
      const required = tasks.reduce((acc, task) => {
        const sku = SKUS.find(s => s.id === task.skuId);
        const req = sku?.materialRequirements.find(r => r.materialId === mat.id);
        return acc + (req ? req.quantityPerUnit * task.quantity : 0);
      }, 0);
      return {
        name: mat.name,
        stock: mat.stockLevel,
        required: Math.round(required),
        status: mat.stockLevel > required ? 'OK' : 'SHORTAGE',
      };
    });
  }, [tasks]);

  const handleInsertUrgent = () => {
    const sku = SKUS.find(s => s.id === urgentSkuId);
    if (!sku) return;

    const duration = urgentQuantity / sku.productionRate;
    
    const newTask: ProductionTask = {
      id: `task-urgent-${Date.now()}`,
      skuId: urgentSkuId,
      lineId: urgentLineId,
      startTime: new Date(),
      durationHrs: Math.ceil(duration),
      quantity: urgentQuantity,
      isUrgent: true,
      status: 'PLANNED',
    };

    setTasks(prev => [newTask, ...prev]);
    setIsUrgentModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414]/10 flex flex-col bg-white/50 backdrop-blur-sm">
        <div className="p-6 border-bottom border-[#141414]/10">
          <div className="flex items-center gap-2 mb-1">
            <Factory className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight uppercase italic font-serif">Planner MVP</h1>
          </div>
          <p className="text-[10px] text-[#141414]/50 uppercase tracking-widest font-mono">FMCG Production v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
              activeTab === 'dashboard' ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
              activeTab === 'schedule' ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5"
            )}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>
          <button 
            onClick={() => setActiveTab('materials')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
              activeTab === 'materials' ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5"
            )}
          >
            <Package className="w-4 h-4" />
            <span>Materials</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#141414]/10">
          <button 
            onClick={() => setIsUrgentModalOpen(true)}
            className="w-full bg-[#F27D26] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#d96a1a] transition-colors shadow-lg shadow-[#F27D26]/20"
          >
            <Plus className="w-4 h-4" />
            INSERT URGENT SKU
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif italic font-bold mb-2">
              {activeTab === 'dashboard' && 'Operations Overview'}
              {activeTab === 'schedule' && 'Production Schedule'}
              {activeTab === 'materials' && 'Inventory Status'}
            </h2>
            <p className="text-sm text-[#141414]/60">Week 10 • March 2026</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-[#141414]/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-tighter">System Live</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Summary Cards */}
            <div className="col-span-12 grid grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Active Lines', value: PRODUCTION_LINES.length, icon: Factory, color: 'text-blue-600' },
                { label: 'Planned Tasks', value: tasks.length, icon: Clock, color: 'text-amber-600' },
                { label: 'Urgent Inserts', value: tasks.filter(t => t.isUrgent).length, icon: AlertCircle, color: 'text-red-600' },
                { label: 'Avg Efficiency', value: '88%', icon: TrendingUp, color: 'text-emerald-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#141414]/5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-2 rounded-lg bg-gray-50", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#141414]/40 uppercase tracking-widest">Live Data</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1 tracking-tighter">{stat.value}</h3>
                  <p className="text-xs text-[#141414]/50 uppercase font-semibold tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="col-span-8 bg-white p-8 rounded-2xl border border-[#141414]/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold font-serif italic">Line Capacity Utilization</h3>
                <div className="flex gap-4 text-[10px] font-mono uppercase">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#141414]" />
                    <span>Used</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#141414]/10" />
                    <span>Available</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capacityStats} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#141414/5" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#141414/5' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="used" stackId="a" fill="#141414" radius={[0, 0, 0, 0]} barSize={32} />
                    <Bar dataKey="total" stackId="a" fill="#14141410" radius={[0, 4, 4, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-4 bg-white p-8 rounded-2xl border border-[#141414]/5 shadow-sm">
              <h3 className="text-lg font-bold font-serif italic mb-8">Material Health</h3>
              <div className="space-y-6">
                {materialStats.map((mat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold mb-1">{mat.name}</p>
                      <p className="text-[10px] font-mono text-[#141414]/50 uppercase">
                        Req: {mat.required.toLocaleString()} / Stock: {mat.stock.toLocaleString()}
                      </p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold tracking-tighter",
                      mat.status === 'OK' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {mat.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-[#141414]/5 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-[#141414] text-white p-4 text-[10px] font-mono uppercase tracking-widest">
              <div className="col-span-1">Status</div>
              <div className="col-span-4">SKU Name</div>
              <div className="col-span-2">Line</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            <div className="divide-y divide-[#141414]/5">
              {tasks.map((task) => {
                const sku = SKUS.find(s => s.id === task.skuId);
                const line = PRODUCTION_LINES.find(l => l.id === task.lineId);
                return (
                  <div key={task.id} className={cn(
                    "grid grid-cols-12 p-6 items-center hover:bg-gray-50 transition-colors",
                    task.isUrgent && "bg-red-50/50"
                  )}>
                    <div className="col-span-1">
                      {task.isUrgent ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="col-span-4">
                      <p className="font-bold text-sm">{sku?.name}</p>
                      <p className="text-[10px] text-[#141414]/50 font-mono uppercase">{sku?.category}</p>
                    </div>
                    <div className="col-span-2 text-sm font-medium">{line?.name}</div>
                    <div className="col-span-2 text-sm font-mono">{task.quantity.toLocaleString()}</div>
                    <div className="col-span-2 text-sm font-mono">{task.durationHrs}h</div>
                    <div className="col-span-1 text-right">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="grid grid-cols-3 gap-6">
            {MATERIALS.map((mat) => {
              const stats = materialStats.find(s => s.name === mat.name);
              return (
                <div key={mat.id} className="bg-white p-8 rounded-2xl border border-[#141414]/5 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-gray-50">
                      <Package className="w-6 h-6 text-[#141414]" />
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      stats?.status === 'OK' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {stats?.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{mat.name}</h3>
                  <p className="text-xs text-[#141414]/50 mb-6">Inventory ID: {mat.id}</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#141414]/60">Stock Level</span>
                      <span className="font-bold">{mat.stockLevel.toLocaleString()} {mat.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#141414]/60">Required</span>
                      <span className="font-bold">{stats?.required.toLocaleString()} {mat.unit}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500",
                          stats?.status === 'OK' ? "bg-[#141414]" : "bg-red-500"
                        )}
                        style={{ width: `${Math.min(100, (mat.stockLevel / (stats?.required || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Urgent Insertion Modal */}
      <AnimatePresence>
        {isUrgentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUrgentModalOpen(false)}
              className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-[#141414]/5">
                <h3 className="text-2xl font-serif italic font-bold">Urgent SKU Insertion</h3>
                <p className="text-sm text-[#141414]/50">This will re-prioritize the production schedule.</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/50 mb-2">Select SKU</label>
                  <select 
                    value={urgentSkuId}
                    onChange={(e) => setUrgentSkuId(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-[#141414]/10 text-sm appearance-none outline-none focus:ring-2 focus:ring-[#F27D26]"
                  >
                    {SKUS.map(sku => (
                      <option key={sku.id} value={sku.id}>{sku.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/50 mb-2">Target Line</label>
                    <select 
                      value={urgentLineId}
                      onChange={(e) => setUrgentLineId(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-[#141414]/10 text-sm outline-none focus:ring-2 focus:ring-[#F27D26]"
                    >
                      {PRODUCTION_LINES.map(line => (
                        <option key={line.id} value={line.id}>{line.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#141414]/50 mb-2">Quantity</label>
                    <input 
                      type="number"
                      value={urgentQuantity}
                      onChange={(e) => setUrgentQuantity(Number(e.target.value))}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-[#141414]/10 text-sm outline-none focus:ring-2 focus:ring-[#F27D26]"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Inserting this SKU will add approximately <strong>{Math.ceil(urgentQuantity / (SKUS.find(s => s.id === urgentSkuId)?.productionRate || 1))} hours</strong> to the production schedule.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => setIsUrgentModalOpen(false)}
                  className="flex-1 py-4 text-sm font-bold hover:bg-gray-200 rounded-xl transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleInsertUrgent}
                  className="flex-1 py-4 bg-[#141414] text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
                >
                  CONFIRM INSERTION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
