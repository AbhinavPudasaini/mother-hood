"use client"

import React, { useState } from 'react';
import { BookOpen, Heart, Calendar, Baby, Flower, Quote, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const Story = () => {
    const [activeTab, setActiveTab] = useState('first');

    const stories = {
        first: [
            {
                id: 1,
                title: "My First Flutter",
                snippet: "I&apos;ll never forget that magical moment when I first felt you move. It was like a gentle butterfly dancing inside me, reminding me that miracles do happen...",
                image: "/cute.webp",
                author: "Emma, 28",
                week: "Week 16"
            },
            {
                id: 2,
                title: "How I Overcame Morning Sickness",
                snippet: "The first trimester was tough, but I learned that every wave of nausea was my body&apos;s way of protecting you. Here&apos;s what helped me through...",
                image: "/preg.webp",
                author: "Sarah, 32",
                week: "Week 12"
            },
            {
                id: 3,
                title: "Finding Joy in the Unknown",
                snippet: "When I first saw those two pink lines, I was overwhelmed. But as the weeks passed, I discovered that uncertainty can be beautiful too...",
                image: "/image1.webp",
                author: "Maria, 26",
                week: "Week 8"
            }
        ],
        second: [
            {
                id: 4,
                title: "The Glow is Real",
                snippet: "Everyone talks about the pregnancy glow, but I never believed it until the second trimester. Suddenly, I felt radiant and alive...",
                image: "/chinese.webp",
                author: "Lisa, 30",
                week: "Week 20"
            },
            {
                id: 5,
                title: "Feeling You Kick",
                snippet: "Your first real kick took my breath away. It was during a quiet evening, and suddenly I knew - you&apos;re really in there, my little fighter...",
                image: "/imag2.webp",
                author: "Jennifer, 29",
                week: "Week 22"
            },
            {
                id: 6,
                title: "Preparing Your Nursery",
                snippet: "Painting your room in soft pastels, I imagined all the bedtime stories we&apos;d share. Every brushstroke was filled with love and dreams...",
                image: "/cute.webp",
                author: "Rachel, 34",
                week: "Week 24"
            }
        ],
        third: [
            {
                id: 7,
                title: "Almost There, Little One",
                snippet: "As we approach the finish line, I&apos;m filled with anticipation and wonder. Soon, I&apos;ll hold you in my arms instead of just in my heart...",
                image: "/preg.webp",
                author: "Amanda, 31",
                week: "Week 36"
            },
            {
                id: 8,
                title: "The Final Countdown",
                snippet: "Every day now feels like Christmas Eve. I&apos;m ready to meet you, my sweet baby. The wait has been worth every moment of this journey...",
                image: "/image1.webp",
                author: "Nicole, 27",
                week: "Week 38"
            },
            {
                id: 9,
                title: "Embracing the Changes",
                snippet: "My body has transformed in the most beautiful way. Every stretch mark tells our story, every movement reminds me of the miracle within...",
                image: "/imag2.webp",
                author: "Jessica, 33",
                week: "Week 34"
            }
        ]
    };

    const motivationalQuotes = {
        first: "Every day brings new growth, new hope, and new reasons to smile. You&apos;re creating a miracle! 🌱",
        second: "You&apos;re glowing with the beauty of new life. This is your time to shine and embrace the journey! 🌸",
        third: "Almost there, mama! Your strength and love have brought you this far. Soon you&apos;ll meet your little miracle! 🌼"
    };

    const tabConfig = {
        first: { label: "First Trimester", emoji: "🌱", color: "green" },
        second: { label: "Second Trimester", emoji: "🌸", color: "pink" },
        third: { label: "Third Trimester", emoji: "🌼", color: "yellow" }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-peach-50">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-pink-200 opacity-30">
                    <Heart className="w-8 h-8" />
                </div>
                <div className="absolute top-40 right-20 text-purple-200 opacity-30">
                    <Flower className="w-6 h-6" />
                </div>
                <div className="absolute bottom-40 left-20 text-peach-200 opacity-30">
                    <Baby className="w-7 h-7" />
                </div>
                <div className="absolute bottom-20 right-10 text-pink-200 opacity-30">
                    <Heart className="w-5 h-5" />
                </div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center py-16 px-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen className="w-8 h-8 text-pink-500" />
                        <h1 className="text-4xl md:text-5xl font-serif text-gray-800">Motherhood Stories</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        Real journeys from other moms to inspire you at every step
                    </p>
                </div>

                {/* Stage Filter Tabs */}
                <div className="flex justify-center mb-12 px-6">
                    <div className="flex bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-sm border border-pink-100">
                        {Object.entries(tabConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === key
                                        ? 'bg-pink-500 text-white shadow-md transform scale-105'
                                        : 'text-gray-600 hover:text-pink-500 hover:bg-white/50'
                                }`}
                            >
                                <span>{config.emoji}</span>
                                <span>{config.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stories Grid */}
                <div className="container mx-auto px-6 mb-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories[activeTab as keyof typeof stories].map((story, index) => (
                            <div
                                key={story.id}
                                className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-pink-100 hover:shadow-lg hover:scale-105 transition-all duration-300 group animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Image Banner */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={story.image}
                                        alt={story.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                            <Heart className="w-4 h-4 text-pink-500" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <span>{story.week}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{story.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {story.snippet}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">by {story.author}</span>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full text-sm font-medium transition-colors">
                                            <BookOpen className="w-4 h-4" />
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Motivational Prompt Section */}
                <div className="container mx-auto px-6 pb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif text-gray-800 mb-2">Today&apos;s Motivation for You</h2>
                    </div>
                    
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-peach-100 rounded-3xl p-8 shadow-sm border border-pink-200 relative overflow-hidden">
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-4 left-6 text-pink-300 opacity-50">
                                <Quote className="w-12 h-12" />
                            </div>
                            
                            <div className="relative z-10 text-center">
                                <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed mb-4">
                                    {motivationalQuotes[activeTab as keyof typeof motivationalQuotes]}
                                </p>
                                <div className="flex items-center justify-center gap-2 text-pink-400">
                                    <Baby className="w-5 h-5" />
                                    <Heart className="w-4 h-4" />
                                    <Baby className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute bottom-4 right-6 text-pink-300 opacity-30">
                                <Flower className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                    opacity: 0;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Story;