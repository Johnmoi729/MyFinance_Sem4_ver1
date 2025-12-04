import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

const SpendingLineChart = ({ data, title, dataKeys = ['amount'] }) => {
    const { formatCurrency } = useCurrencyFormatter();
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Không có dữ liệu để hiển thị
            </div>
        );
    }

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

    const colors = {
        amount: '#3B82F6',
        income: '#10B981',
        expense: '#EF4444',
        budget: '#F59E0B',
        actual: '#8B5CF6'
    };

    const labels = {
        amount: 'Số tiền',
        income: 'Thu nhập',
        expense: 'Chi tiêu',
        budget: 'Ngân sách',
        actual: 'Thực tế'
    };

    return (
        <div className="w-full">
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="periodLabel"
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
                        formatter={(value) => labels[value] || value}
                    />
                    {dataKeys.map((key, index) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors[key] || colors.amount}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name={key}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingLineChart;
