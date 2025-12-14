import React from 'react';
import { Sun, Sunset, Moon } from '../icons';

const PersonalizedGreeting = ({ userName }) => {
 const getGreeting = () => {
 const hour = new Date().getHours();

 if (hour >= 5 && hour < 12) {
 return {
 text: 'Chào buổi sáng',
 icon: Sun,
 color: 'text-yellow-500',
 bgColor: 'bg-yellow-50'
 };
 } else if (hour >= 12 && hour < 18) {
 return {
 text: 'Chào buổi chiều',
 icon: Sunset,
 color: 'text-orange-500',
 bgColor: 'bg-orange-50'
 };
 } else {
 return {
 text: 'Chào buổi tối',
 icon: Moon,
 color: 'text-indigo-500',
 bgColor: 'bg-indigo-50'
 };
 }
 };

 const { text, icon: Icon, color, bgColor } = getGreeting();

 return (
 <div className="flex items-center gap-4">
 <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
 <Icon className={`w-7 h-7 ${color}`} />
 </div>
 <div>
 <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
 {text}, {userName}!
 </h2>
 <p className="text-gray-600">Chào mừng trở lại với MyFinance</p>
 </div>
 </div>
 );
};

export default PersonalizedGreeting;
