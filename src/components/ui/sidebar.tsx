"use client"

import React, { useState } from 'react';
import {
    Home,
    Bot,
    Apple,
    BookOpen,
    Menu,
    X,
    Baby,
    Heart,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home className="w-6 h-6" />,
            emoji: '🏠',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            hoverColor: 'hover:bg-pink-100'
        },
        {
            id: 'ai-assistant',
            label: 'AI Assistant',
            icon: <Bot className="w-6 h-6" />,
            emoji: '🤖',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100'
        },
        {
            id: 'nutrition',
            label: 'Nutrition',
            icon: <Apple className="w-6 h-6" />,
            emoji: '🍎',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100'
        },
        {
            id: 'story',
            label: 'Stories',
            icon: <BookOpen className="w-6 h-6" />,
            emoji: '📖',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100'
        }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-md border-r border-pink-200 shadow-lg z-50 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'
                }`}>
                {/* Header */}
                <div className="p-3 border-b border-pink-100">
                    {isExpanded ? (
                        // Expanded header with full branding
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Baby className="w-7 h-7 text-pink-500" />
                                    <Heart className="w-5 h-5 text-pink-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-serif text-gray-800">Motherhood</h2>
                                    <p className="text-xs text-gray-600">Your pregnancy companion</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 rounded-xl hover:bg-pink-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        // Collapsed header with just hamburger menu
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="p-2 rounded-xl hover:bg-pink-100 transition-colors"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <div className="p-3 space-y-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className={`w-full flex items-center p-3 rounded-2xl transition-all duration-300 group relative ${currentPage === item.id
                                ? `${item.bgColor} ${item.color} shadow-sm`
                                : `hover:bg-pink-50 text-gray-600 ${item.hoverColor}`
                                }`}
                            title={!isExpanded ? item.label : undefined}
                        >
                            {isExpanded ? (
                                // Expanded layout
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{item.emoji}</div>
                                        <div className={`${item.color} transition-transform group-hover:scale-110`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left ml-2">
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {currentPage === item.id && (
                                        <ChevronRight className="w-4 h-4 text-pink-400" />
                                    )}
                                </>
                            ) : (
                                // Collapsed layout - centered icon
                                <div className="flex justify-center w-full">
                                    <div className="text-2xl">{item.emoji}</div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 left-3 right-3">
                    {isExpanded ? (
                        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4">
                            <div className="text-center">
                                <div className="text-2xl mb-2">👶</div>
                                <p className="text-sm text-gray-700 font-medium">Week 24</p>
                                <p className="text-xs text-gray-600">Second Trimester</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="bg-pink-100 rounded-xl p-2">
                                <div className="text-xl">👶</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;