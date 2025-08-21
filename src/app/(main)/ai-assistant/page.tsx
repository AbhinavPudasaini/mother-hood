"use client"

import React, { useState, useEffect } from 'react';
import { Send, Mic, Heart, Baby, Calendar, FileText, Droplets, Apple, Stethoscope, Upload } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown';


const AiAssistant = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your pregnancy companion. How are you feeling today? I'm here to help with diet plans, exercise safety, and any symptoms you'd like to discuss.",
            isAi: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');

    const quickSuggestions = [
        "Suggest meal for today",
        "Check symptom",
        "Safe exercises for week 20",
        "Morning sickness tips",
        "Nutrition advice"
    ];
    

    const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);


    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoadingProfile(true);
            try {
                const cookies = document.cookie.split('; ').find(row => row.startsWith('userId='));
                const userId = cookies ? cookies.split('=')[1] : null;

                if (userId) {
                    const response = await fetch(`/api/user-profile/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserProfile(data);
                    } else {
                        console.error('Failed to fetch user profile:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, []);



    const handleSendMessage = async () => {
        if (inputText.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputText,
                isAi: false,
                timestamp: new Date()
            };
            setMessages([...messages, newMessage]);
            setInputText('');

            try {
    const context = `You are a Doctor speciality in Gyno and also a mother. Your task is to answer the query of pregnant lady. 
    So talk in a very mother way. Use emojis and friendly tone while talking. Your answer should be short and sweet always. 
    The current pregnancy day is : ${userProfile.days}.
    If asked about diet plan, or what to eat, you will answer based on the diet preferences that is :
    
    Diet type : ${userProfile.dietPreferences},
    Diet Allergy : ${userProfile.dietAllergy},
    Total meat taken in a day : ${userProfile.meals}
    You can also give diet suggestions based on the location : ${userProfile.location}

    If User ask about the medicine or any kind of emergency suggestions, you should tell on the basis of following:
    complications : ${userProfile.complications},
    medical condition : ${userProfile.conditions}
    Currenrt medicines : ${userProfile.medicines}

    `;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`, 
      },
      body: JSON.stringify({
  model: "openai/gpt-oss-120b",
  messages: [
    {
      role: "system",
      content: context
    },
    { role: "user", content: inputText }
  ]
})})

    const data = await res.json();
    const aiMessage = {
        id: messages.length + 2, // +2 because user message is +1
        text: data.choices[0].message.content,
        isAi: true,
        timestamp: new Date()
    };

               setMessages(prev => [...prev, aiMessage]);
  } catch (err) {
    console.error(err);
  }
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputText(suggestion);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-purple-50">
            <div className="flex h-screen">
                {/* Left Section - Chat Interface */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-pink-500">
                                <Baby className="w-6 h-6" />
                                <Heart className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800">Your Pregnancy Companion</h1>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/20">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                        message.isAi
                                            ? 'bg-purple-100 text-gray-800 rounded-bl-sm'
                                            : 'bg-peach-100 text-gray-800 rounded-br-sm'
                                    }`}
                                >
                                    {message.isAi && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <Stethoscope className="w-4 h-4 text-purple-500" />
                                            <span className="text-xs font-medium text-purple-600">AI Assistant</span>
                                        </div>
                                    )}
                                    {/* <p className="text-sm leading-relaxed"> */}
                                        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {message.text}
          </ReactMarkdown>
                                   
                                    <p className="text-xs text-gray-500 mt-2">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-6 py-3">
                        <div className="flex flex-wrap gap-2">
                            {quickSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-3 py-2 text-sm bg-white/70 hover:bg-white/90 text-gray-700 rounded-full border border-pink-200 transition-all duration-200 hover:shadow-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Bar */}
                    <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-pink-100">
                        <div className="flex items-center gap-3 bg-white rounded-full p-2 shadow-sm border border-pink-200">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask me anything about your pregnancy..."
                                className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                            <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-colors">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Profile & Medical Info */}
                <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-pink-100 p-6 space-y-6 overflow-y-auto">
                    {/* Profile Card */}
                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <Baby className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{userProfile?.fullName || 'Loading...'}</h3>
                                <p className="text-sm text-gray-600">Week {userProfile?.days} • Due {userProfile?.dueDate || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Summary */}
                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-purple-500" />
                            Medical Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-600">Complications:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.complications || 'None'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Allergies:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.dietAllergy || 'None'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Medications:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.medicines || 'None'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Diet Summary */}
                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-purple-500" />
                            Diet Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-600">DIest Type:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.dietPreferences || 'None'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Allergies:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.dietAllergy || 'None'}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Total meals a day:</span>
                                <span className="ml-2 text-gray-800">{userProfile?.meals || 'None'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Checkups */}
                    {/* <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            Next Appointment
                        </h4>
                        <div className="text-sm">
                            <p className="text-gray-800 font-medium">Dr. Smith</p>
                            <p className="text-gray-600">Feb 28, 2024 • 2:00 PM</p>
                            <p className="text-gray-600">Routine checkup</p>
                        </div>
                    </div> */}

                    {/* Daily Goals */}
                    <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <h4 className="font-semibold text-gray-800 mb-3">Daily Goals</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-gray-700">Water</span>
                                </div>
                                <span className="text-sm text-gray-600">8 glasses</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Apple className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">Nutrition</span>
                                </div>
                                <span className="text-sm text-gray-600">Good</span>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    {/* <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Medical Records
                        </h4>
                        <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-pink-200 rounded-xl text-gray-600 hover:border-pink-300 hover:bg-pink-50/50 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload reports</span>
                        </button>
                    </div> */}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};


export default AiAssistant;

