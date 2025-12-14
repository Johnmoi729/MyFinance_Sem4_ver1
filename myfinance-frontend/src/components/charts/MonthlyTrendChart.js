import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const MonthlyTrendChart = ({ data, title }) => {
 const { formatCurrency } = useCurrencyFormatter();
 if (!data || data.length === 0) {
 return (
 <div className="flex items-center justify-center h-64 text-gray-500">
 Không có dữ liệu để hiển thị
 </div>
 );
 }

 // Transform data for bar chart
 const chartData = data.map(item => ({
 month: item.monthName || item.periodLabel,
 income: parseFloat(item.income || 0),
 expense: parseFloat(item.expense || item.amount || 0),
 savings: parseFloat(item.savings || 0)
 }));

 const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
 <p className="font-semibold text-gray-900 mb-2">{label}</p>
 {payload.map((entry, index) => (
 <p key={index} className="text-sm" style={{ color: entry.color }}>
 {entry.name}: <span className="font-medium">{formatCurrency(entry.value)}</span>
 </p>
 ))}
 </div>
 );
 }
 return null;
 };

 const formatYAxis = (value) => {
 if (value >= 1000000) {
 return `${(value / 1000000).toFixed(1)}M`;
 }
 if (value >= 1000) {
 return `${(value / 1000).toFixed(0)}K`;
 }
 return value;
 };

 return (
 <div className="w-full">
 {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
 <ResponsiveContainer width="100%" height={300}>
 <BarChart data={chartData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
 <XAxis
 dataKey="month"
 tick={{ fill: '#6B7280', fontSize: 12 }}
 angle={-45}
 textAnchor="end"
 height={80}
 />
 <YAxis
 tick={{ fill: '#6B7280', fontSize: 12 }}
 tickFormatter={formatYAxis}
 />
 <Tooltip content={<CustomTooltip />} />
 <Legend
 wrapperStyle={{ paddingTop: '10px' }}
 formatter={(value) => {
 const labels = {
 income: 'Thu nhập',
 expense: 'Chi tiêu',
 savings: 'Tiết kiệm'
 };
 return labels[value] || value;
 }}
 />
 <Bar dataKey="income" fill="#10B981" name="income" />
 <Bar dataKey="expense" fill="#EF4444" name="expense" />
 {chartData.some(d => d.savings !== 0) && (
 <Bar dataKey="savings" fill="#3B82F6" name="savings" />
 )}
 </BarChart>
 </ResponsiveContainer>
 </div>
 );
};

export default MonthlyTrendChart;
