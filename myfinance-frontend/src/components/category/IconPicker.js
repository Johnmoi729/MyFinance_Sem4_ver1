import React, { useState } from 'react';
import * as Icons from '../icons';

const IconPicker = ({ selectedIcon, onSelectIcon, color = '#6B7280' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Define icon categories with their respective icons
    const iconCategories = {
        all: { label: 'Tất cả', icons: [] }, // Will be populated with all icons
        food: {
            label: 'Ăn uống',
            icons: ['Utensils', 'Coffee', 'Pizza', 'Cookie', 'Wine', 'IceCream', 'Apple']
        },
        transport: {
            label: 'Di chuyển',
            icons: ['Car', 'Bus', 'Bike', 'Plane', 'Train', 'Fuel', 'Ship', 'Rocket']
        },
        shopping: {
            label: 'Mua sắm',
            icons: ['ShoppingCart', 'ShoppingBag', 'Shop', 'Gift', 'Shirt', 'Diamond', 'Box']
        },
        entertainment: {
            label: 'Giải trí',
            icons: ['Tv', 'Movie', 'Music', 'Game', 'Camera', 'Art', 'Ticket', 'Popcorn']
        },
        home: {
            label: 'Nhà cửa',
            icons: ['Home', 'Light', 'Water', 'Gas', 'Wifi', 'Phone', 'Smartphone', 'Sofa', 'Bed']
        },
        health: {
            label: 'Sức khỏe',
            icons: ['Heart', 'Dumbbell', 'Pill', 'Stethoscope', 'Syringe', 'HeartPulse']
        },
        education: {
            label: 'Giáo dục',
            icons: ['Book', 'GraduationCap', 'Briefcase', 'Laptop', 'Pen', 'School']
        },
        finance: {
            label: 'Tài chính',
            icons: ['Wallet', 'DollarSign', 'Coins', 'Building', 'Invest', 'Award', 'Bank', 'PiggyBank']
        },
        family: {
            label: 'Gia đình',
            icons: ['Baby', 'Pet', 'Cat', 'Family', 'Flower']
        },
        misc: {
            label: 'Khác',
            icons: ['Tree', 'Sparkles', 'CircleDollarSign', 'Repeat', 'Question', 'Star', 'Umbrella', 'Tool', 'Paintbrush', 'Tag']
        }
    };

    // Get all icons for "all" category
    const allIcons = Object.keys(iconCategories)
        .filter(key => key !== 'all')
        .flatMap(key => iconCategories[key].icons);
    iconCategories.all.icons = allIcons;

    // Get icons for the active category
    const getDisplayIcons = () => {
        const categoryIcons = iconCategories[activeCategory]?.icons || allIcons;

        if (!searchTerm) {
            return categoryIcons;
        }

        return categoryIcons.filter(iconName =>
            iconName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const displayIcons = getDisplayIcons();

    // Render an icon component
    const renderIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        if (!IconComponent) return null;

        return (
            <button
                key={iconName}
                type="button"
                onClick={() => onSelectIcon(iconName)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedIcon === iconName
                        ? 'border-indigo-600 bg-indigo-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
                title={iconName}
            >
                <IconComponent
                    className="w-6 h-6"
                    style={{ color: color }}
                />
            </button>
        );
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm biểu tượng..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(iconCategories).map(([key, category]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setActiveCategory(key)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === key
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Icon Grid */}
            <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {displayIcons.length > 0 ? (
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {displayIcons.map(renderIcon)}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy biểu tượng phù hợp
                    </div>
                )}
            </div>

            {/* Selected Icon Preview */}
            {selectedIcon && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Đã chọn:</span>
                    {(() => {
                        const SelectedIconComponent = Icons[selectedIcon];
                        return SelectedIconComponent ? (
                            <div className="flex items-center gap-2">
                                <SelectedIconComponent
                                    className="w-6 h-6"
                                    style={{ color: color }}
                                />
                                <span className="text-sm text-gray-600">{selectedIcon}</span>
                            </div>
                        ) : null;
                    })()}
                </div>
            )}
        </div>
    );
};

export default IconPicker;
