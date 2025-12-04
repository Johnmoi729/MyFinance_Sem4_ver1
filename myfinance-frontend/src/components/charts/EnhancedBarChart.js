import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const EnhancedBarChart = ({ data, title, onBarClick, showComparison = false }) => {
    const { formatCurrency } = useCurrencyFormatter();
    const [activeIndex, setActiveIndex] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Không có dữ liệu để hiển thị
            </div>
        );
    }

    // Transform data for bar chart
    const chartData = data.map(item => ({
        month: item.monthName || item.periodLabel || item.month,
        income: parseFloat(item.income || 0),
        expense: parseFloat(item.expense || item.amount || 0),
        savings: parseFloat(item.savings || 0),
        previousMonth: parseFloat(item.previousMonth || 0),
        growth: item.growth || 0
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
                    {payload[0]?.payload?.growth !== undefined && payload[0].payload.growth !== 0 && (
                        <p className={`text-sm mt-1 ${payload[0].payload.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {payload[0].payload.growth > 0 ? '↑' : '↓'} {Math.abs(payload[0].payload.growth).toFixed(1)}% so với tháng trước
                        </p>
                    )}
                    {onBarClick && (
                        <p className="text-xs text-blue-600 mt-2">Click để xem chi tiết</p>
                    )}
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

    const handleBarClick = (data, index) => {
        setActiveIndex(index);
        if (onBarClick) {
            onBarClick(chartData[index]);
        }
    };

    const exportChart = () => {
        const csvContent = [
            ['Tháng', 'Thu nhập', 'Chi tiêu', 'Tiết kiệm', 'Tăng trưởng (%)'],
            ...chartData.map(item => [
                item.month,
                item.income.toFixed(0),
                item.expense.toFixed(0),
                item.savings.toFixed(0),
                (item.growth || 0).toFixed(2)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `monthly_trends_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                <button
                    onClick={exportChart}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Xuất CSV
                </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} onClick={handleBarClick}>
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
                                savings: 'Tiết kiệm',
                                previousMonth: 'Tháng trước'
                            };
                            return labels[value] || value;
                        }}
                    />
                    <Bar
                        dataKey="income"
                        fill="#10B981"
                        name="income"
                        animationBegin={0}
                        animationDuration={800}
                        style={{ cursor: onBarClick ? 'pointer' : 'default' }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-income-${index}`}
                                fill={activeIndex === index ? '#059669' : '#10B981'}
                            />
                        ))}
                    </Bar>
                    <Bar
                        dataKey="expense"
                        fill="#EF4444"
                        name="expense"
                        animationBegin={100}
                        animationDuration={800}
                        style={{ cursor: onBarClick ? 'pointer' : 'default' }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-expense-${index}`}
                                fill={activeIndex === index ? '#DC2626' : '#EF4444'}
                            />
                        ))}
                    </Bar>
                    {chartData.some(d => d.savings !== 0) && (
                        <Bar
                            dataKey="savings"
                            fill="#3B82F6"
                            name="savings"
                            animationBegin={200}
                            animationDuration={800}
                            style={{ cursor: onBarClick ? 'pointer' : 'default' }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-savings-${index}`}
                                    fill={activeIndex === index ? '#2563EB' : '#3B82F6'}
                                />
                            ))}
                        </Bar>
                    )}
                    {showComparison && chartData.some(d => d.previousMonth !== 0) && (
                        <Bar
                            dataKey="previousMonth"
                            fill="#9CA3AF"
                            name="previousMonth"
                            animationBegin={300}
                            animationDuration={800}
                        />
                    )}
                </BarChart>
            </ResponsiveContainer>
            {chartData.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="text-center">
                        <p className="font-medium">Tổng thu nhập</p>
                        <p className="text-green-600 font-semibold">
                            {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0))}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Tổng chi tiêu</p>
                        <p className="text-red-600 font-semibold">
                            {formatCurrency(chartData.reduce((sum, item) => sum + item.expense, 0))}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Tổng tiết kiệm</p>
                        <p className="text-blue-600 font-semibold">
                            {formatCurrency(chartData.reduce((sum, item) => sum + item.savings, 0))}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedBarChart;
