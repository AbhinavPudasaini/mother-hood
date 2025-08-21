"use client"

import React, { useState } from 'react';
import { Apple, Droplets, Camera, Plus, Trash2, Send, Baby, Heart, Leaf } from 'lucide-react';

const Nutrition = () => {
    const [hydrationCount, setHydrationCount] = useState(0);
    const [foodInput, setFoodInput] = useState('');
    const [aiInput, setAiInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [foodLog, setFoodLog] = useState([

    ]);
    // -------------------------------------------

  const handleSend = async () => {
        
            setFoodInput('');
       
    

  const userMessage = { text: input, sender: 'user' };
//   setMessages(prev => [...prev, userMessage]);
if (foodInput.trim()) {

  try {
    
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`, // stored in .env
      },
      body: JSON.stringify({
  model: "openai/gpt-oss-120b",
  messages: [
    {
      role: "system",
      content: "You are an expert diet analyzer.Note that you will give answer based on the assumption and considering the average size of the fruit or vegetable. You will give only the answers of Vitamin B9, Iron, Calcium, Protein, Omega 3 and Vitamin D. Return ONLY valid JSON strictly in this format:\n\n{ \"Vitamin B9\": \"71 mcg\", \"Iron\": \"15 g\", \"Calcium\": \"1.4 g\", \"Protein\": \"2.6 g\", \"Omega 3\": \"11 g\", \"Vitamin D\": \"100 mcg\" }"
    },
    { role: "user", content: foodInput }
  ]
})})


    const data = await res.json();
    console.log(data.choices[0].message.content)
    const content = JSON.parse(data.choices[0].message.content);
    
    const newFood = {
                id: Date.now(),
                name: foodInput,
                vitaminb9: parseFloat(content["Vitamin B9"]) || 0,
                protein: parseFloat(content["Protein"]) || 0,
                iron: parseFloat(content["Iron"]) || 0,
                calcium: parseFloat(content["Calcium"]) || 0,
                omega3: parseFloat(content["Omega 3"]) || 0,
                vitaminD: parseFloat(content["Vitamin D"]) || 0
            };
            setFoodLog(prev => [...prev, newFood]);
            setNutritionData(prev => ({
                ...prev,
                vitaminB9: { ...prev.vitaminB9, current: prev.vitaminB9.current + newFood.vitaminb9 },
                protein: { ...prev.protein, current: prev.protein.current + newFood.protein },
                iron: { ...prev.iron, current: prev.iron.current + newFood.iron },
                calcium: { ...prev.calcium, current: prev.calcium.current + newFood.calcium },
                omega3: { ...prev.omega3, current: prev.omega3.current + newFood.omega3 },
                vitaminD: { ...prev.vitaminD, current: prev.vitaminD.current + newFood.vitaminD }
            }));
    // const aiMessage = { text: data.choices[0].message.content, sender: 'ai' };

    // setMessages(prev => [...prev, aiMessage]);
  } catch (err) {
    console.error(err);
  }
   }
};

    // -------------------------------------------

    // Daily goals and current intake
    const [nutritionData, setNutritionData] = useState({
        vitaminB9: { current: 0, goal: 800, color: 'pink', unit: 'mcg' },
        protein: { current: 0, goal: 75, color: 'purple', unit: 'g' },
        iron: { current: 0, goal: 27, color: 'orange', unit: 'g' },
        calcium: { current: 0, goal: 1000, color: 'blue', unit: 'g' },
        omega3: { current: 0, goal: 200, color: 'orange', unit: 'mg' },
        vitaminD: { current: 0, goal: 15, color: 'yellow', unit: 'mcg' }
        
    });

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const addGlass = () => {
        setHydrationCount(prev => Math.min(prev + 1, 8));
    };

    const removeFood = (id: number) => {
        setFoodLog(prev => prev.filter(food => food.id !== id));
    };

    

    const aiSuggestions = [
        "Suggest iron-rich lunch",
        "What can I eat if I feel tired?",
        "Healthy snacks for pregnancy",
        "Foods to avoid in second trimester"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-green-200 opacity-30">
                    <Apple className="w-8 h-8" />
                </div>
                <div className="absolute top-40 right-20 text-blue-200 opacity-30">
                    <Droplets className="w-6 h-6" />
                </div>
                <div className="absolute bottom-40 left-20 text-pink-200 opacity-30">
                    <Leaf className="w-7 h-7" />
                </div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center py-12 px-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-3xl">🍎</span>
                        <span className="text-3xl">🥦</span>
                        <span className="text-3xl">💧</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-2">Nutrition & Hydration</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                        Track what you eat, stay hydrated, and keep your baby nourished
                    </p>
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Nutrition Tracker & Food Log */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Daily Nutrition Tracker */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-pink-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daily Nutrition Progress</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {Object.entries(nutritionData).map(([key, data]) => (
                                    <div key={key} className="text-center">
                                        <div className="relative w-24 h-24 mx-auto mb-3">
                                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    className="text-gray-200"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={`${getProgressPercentage(data.current, data.goal) * 2.51} 251`}
                                                    className={`text-${data.color}-400 transition-all duration-500`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {Math.round(getProgressPercentage(data.current, data.goal))}%
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="font-medium text-gray-800 capitalize mb-1">{key}</h3>
                                        <p className="text-sm text-gray-600">
                                            {data.current} / {data.goal} {data.unit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Food Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-pink-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Food</h2>
                            <div className="flex gap-4 mb-4">
                                {/* <button className="flex items-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl transition-colors">
                                    <Camera className="w-5 h-5" />
                                    <span className="text-sm font-medium">Upload Photo</span>
                                </button> */}
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={foodInput}
                                        onChange={(e) => setFoodInput(e.target.value)}
                                        placeholder="What did you eat?"
                                        className="flex-1 px-4 py-3 bg-white/80 border border-pink-200 rounded-2xl outline-none focus:border-pink-400 transition-colors"
                                    />
                                    
                                    <button
                                        onClick={handleSend}
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium transition-colors"
                                    >
                                        Add to My Day
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Food Log */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-pink-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today&apos;s Food Log</h2>
                            <div className="space-y-4">
                                {foodLog.map((food) => (
                                    <div key={food.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-pink-100">
                                        <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center overflow-hidden">
                                            <Apple className="w-8 h-8 text-pink-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{food.name}</h3>
                                            <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                                <span>{food.vitaminb9} mcg</span>
                                                <span>{food.protein}g protein</span>
                                                <span>{food.iron}mg iron</span>
                                                <span>{food.calcium}mg calcium</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFood(food.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Hydration & AI Assistant */}
                    <div className="space-y-8">
                        {/* Hydration Tracker */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-blue-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Droplets className="w-6 h-6 text-blue-500" />
                                Hydration
                            </h2>
                            <div className="text-center mb-4">
                                <p className="text-3xl font-bold text-blue-600">{hydrationCount}/8</p>
                                <p className="text-sm text-gray-600">glasses today</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-xl flex items-center justify-center ${
                                            i < hydrationCount
                                                ? 'bg-blue-200 text-blue-600'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        <Droplets className="w-6 h-6" />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addGlass}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Glass (250ml)
                            </button>
                        </div>

                        {/* AI Recipe Assistant */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">AI Diet Assistant</h2>
                            <div className="space-y-3 mb-4">
                                {aiSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setAiInput(suggestion)}
                                        className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Ask about recipes, diet tips..."
                                    className="flex-1 px-4 py-3 bg-white/80 border border-purple-200 rounded-2xl outline-none focus:border-purple-400 transition-colors text-sm"
                                />
                                <button className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl transition-colors">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Daily Summary */}
                        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-green-100 rounded-3xl p-6 shadow-sm border border-pink-200">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daily Summary</h2>
                            <div className="space-y-3 mb-4">
                                {Object.entries(nutritionData).map(([key, data]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {Math.round(getProgressPercentage(data.current, data.goal))}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center p-4 bg-white/60 rounded-2xl">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Baby className="w-6 h-6 text-pink-500" />
                                    <Heart className="w-5 h-5 text-pink-400" />
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    You&apos;re doing great! Just a little more protein today will help your baby grow strong. 💪
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nutrition;