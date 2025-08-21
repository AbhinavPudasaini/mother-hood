"use client"

import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Calendar, Baby, Flower, Quote, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { StoryData } from '@/types/story';
import { generateAIStory } from '@/lib/ai-story-service';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const Story = () => {
    const [activeTab, setActiveTab] = useState('first');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);
    const [generatedStory, setGeneratedStory] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    // Handle Read More button click
    const handleReadMore = async (story: StoryData) => {
        setSelectedStory(story);
        setIsModalOpen(true);
        setGeneratedStory(null);
        setGenerationError(null);
        setIsGenerating(true);

        try {
            console.log('Generating story for theme:', story.theme);
            const aiStory = await generateAIStory(story);
            setGeneratedStory(aiStory);
        } catch (error) {
            console.error('Failed to generate story:', error);
            setGenerationError('Failed to generate story. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStory(null);
        setGeneratedStory(null);
        setGenerationError(null);
        setIsGenerating(false);
    };

    // Handle retry story generation
    const handleRetryGeneration = async () => {
        if (!selectedStory) return;

        setGenerationError(null);
        setIsGenerating(true);

        try {
            const aiStory = await generateAIStory(selectedStory);
            setGeneratedStory(aiStory);
        } catch (error) {
            console.error('Failed to generate story:', error);
            setGenerationError('Failed to generate story. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };





    //      const handleSendMessage = async () => {
    //         if (inputText.trim()) {
    //             const newMessage = {
    //                 id: messages.length + 1,
    //                 text: inputText,
    //                 isAi: false,
    //                 timestamp: new Date()
    //             };
    //             setMessages([...messages, newMessage]);
    //             setInputText('');

    //             try {
    //     const context = `You are a Doctor speciality in Gyno and also a mother. Your task is to answer the query of pregnant lady. 
    //     So talk in a very mother way. Use emojis and friendly tone while talking. Your answer should be short and sweet always. 
    //     The current pregnancy day is : ${userProfile.days}.
    //     If asked about diet plan, or what to eat, you will answer based on the diet preferences that is :

    //     Diet type : ${userProfile.dietPreferences},
    //     Diet Allergy : ${userProfile.dietAllergy},
    //     Total meat taken in a day : ${userProfile.meals}
    //     You can also give diet suggestions based on the location : ${userProfile.location}

    //     If User ask about the medicine or any kind of emergency suggestions, you should tell on the basis of following:
    //     complications : ${userProfile.complications},
    //     medical condition : ${userProfile.conditions}
    //     Currenrt medicines : ${userProfile.medicines}

    //     `;
    //     const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`, 
    //       },
    //       body: JSON.stringify({
    //   model: "openai/gpt-oss-120b",
    //   messages: [
    //     {
    //       role: "system",
    //       content: context
    //     },
    //     { role: "user", content: inputText }
    //   ]
    // })})

    //     const data = await res.json();
    //     const aiMessage = {
    //         id: messages.length + 2, // +2 because user message is +1
    //         text: data.choices[0].message.content,
    //         isAi: true,
    //         timestamp: new Date()
    //     };

    //                setMessages(prev => [...prev, aiMessage]);
    //   } catch (err) {
    //     console.error(err);
    //   }
    //         }
    //     };

    const stories: Record<'first' | 'second' | 'third', StoryData[]> = {
        first: [
            {
                id: 1,
                title: "My First Flutter",
                snippet: "I&apos;ll never forget that magical moment when I first felt you move. It was like a gentle butterfly dancing inside me, reminding me that miracles do happen...",
                image: "/cute.webp",
                author: "Emma, 28",
                week: "Week 16",
                theme: "first-flutter",
                trimester: "first"
            },
            {
                id: 2,
                title: "How I Overcame Morning Sickness",
                snippet: "The first trimester was tough, but I learned that every wave of nausea was my body&apos;s way of protecting you. Here&apos;s what helped me through...",
                image: "/preg.webp",
                author: "Sarah, 32",
                week: "Week 12",
                theme: "morning-sickness",
                trimester: "first"
            },
            {
                id: 3,
                title: "Finding Joy in the Unknown",
                snippet: "When I first saw those two pink lines, I was overwhelmed. But as the weeks passed, I discovered that uncertainty can be beautiful too...",
                image: "/image1.webp",
                author: "Maria, 26",
                week: "Week 8",
                theme: "finding-joy",
                trimester: "first"
            }
        ],
        second: [
            {
                id: 4,
                title: "The Glow is Real",
                snippet: "Everyone talks about the pregnancy glow, but I never believed it until the second trimester. Suddenly, I felt radiant and alive...",
                image: "/chinese.webp",
                author: "Lisa, 30",
                week: "Week 20",
                theme: "pregnancy-glow",
                trimester: "second"
            },
            {
                id: 5,
                title: "Feeling You Kick",
                snippet: "Your first real kick took my breath away. It was during a quiet evening, and suddenly I knew - you&apos;re really in there, my little fighter...",
                image: "/imag2.webp",
                author: "Jennifer, 29",
                week: "Week 22",
                theme: "feeling-kicks",
                trimester: "second"
            },
            {
                id: 6,
                title: "Preparing Your Nursery",
                snippet: "Painting your room in soft pastels, I imagined all the bedtime stories we&apos;d share. Every brushstroke was filled with love and dreams...",
                image: "/cute.webp",
                author: "Rachel, 34",
                week: "Week 24",
                theme: "nursery-preparation",
                trimester: "second"
            }
        ],
        third: [
            {
                id: 7,
                title: "Almost There, Little One",
                snippet: "As we approach the finish line, I&apos;m filled with anticipation and wonder. Soon, I&apos;ll hold you in my arms instead of just in my heart...",
                image: "/preg.webp",
                author: "Amanda, 31",
                week: "Week 36",
                theme: "almost-there",
                trimester: "third"
            },
            {
                id: 8,
                title: "The Final Countdown",
                snippet: "Every day now feels like Christmas Eve. I&apos;m ready to meet you, my sweet baby. The wait has been worth every moment of this journey...",
                image: "/image1.webp",
                author: "Nicole, 27",
                week: "Week 38",
                theme: "final-countdown",
                trimester: "third"
            },
            {
                id: 9,
                title: "Embracing the Changes",
                snippet: "My body has transformed in the most beautiful way. Every stretch mark tells our story, every movement reminds me of the miracle within...",
                image: "/imag2.webp",
                author: "Jessica, 33",
                week: "Week 34",
                theme: "embracing-changes",
                trimester: "third"
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
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === key
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
                                        <button
                                            onClick={() => handleReadMore(story)}
                                            className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full text-sm font-medium transition-colors"
                                        >
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

            {/* Story Modal */}
            {isModalOpen && selectedStory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-pink-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                        {selectedStory.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>by {selectedStory.author}</span>
                                        <span>{selectedStory.week}</span>
                                        <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                                            {selectedStory.theme}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-gray-500 text-xl">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-96">
                            {isGenerating && (
                                <div className="text-center py-8">
                                    <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600">Generating your personalized story...</p>
                                    <p className="text-sm text-gray-500 mt-2">Theme: {selectedStory.theme}</p>
                                </div>
                            )}

                            {generationError && (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-red-500 text-xl">!</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{generationError}</p>
                                    <button
                                        onClick={handleRetryGeneration}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {generatedStory && (
                                <div className="prose prose-gray max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        components={{
                                            p: ({ children }) => <p className="mb-4">{children}</p>,
                                            strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                                        }}
                                    >
                                        {generatedStory}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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