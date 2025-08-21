"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Heart, CheckCircle, Stethoscope, Baby, Apple, BookOpen, Bot, Droplets, Activity, ChevronRight, ChevronLeft, Plus, X, Bell, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mood, setMood] = useState('');
    const [energyLevel, setEnergyLevel] = useState(7);
    const [discomfort, setDiscomfort] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [tasks, setTasks] = useState<{ [date: string]: { id: number; text: string; completed: boolean }[] }>({});
    const [newTask, setNewTask] = useState('');

    const [userProfile, setUserProfile] = useState<any>(null); // Consider defining a proper type for UserProfile
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

    const [dueDate, setDueDate] = useState(new Date());

    useEffect(() => {
        if (userProfile && userProfile.days) {
            const totalPregnancyDays = 270; // 9 months
            const remainingDays = totalPregnancyDays - userProfile.days;
            const newDueDate = new Date();
            newDueDate.setDate(newDueDate.getDate() + remainingDays);
            setDueDate(newDueDate);
        }
    }, [userProfile]);


    // Current pregnancy phase (Week 24 = Second Trimester)
    const currentWeek = 24;
    const pregnancyPhase = currentWeek <= 12 ? 'First Trimester' : currentWeek <= 28 ? 'Second Trimester' : 'Third Trimester';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // const getTimeUntilDue = () => {
    //     const now = new Date();
    //     const diff = dueDate.getTime() - now.getTime();

    //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    //     return { days, hours, minutes, seconds };
    // };
    const calculateTimeLeft = () => {
        const difference = dueDate.getTime() - new Date().getTime();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };

      const timeLeft = calculateTimeLeft();

    // Phase-based daily tips
    const getPhaseBasedTips = () => {
        if (currentWeek <= 12) {
            return [
                { icon: "🤢", title: "Morning Sickness Relief", content: "Try ginger tea or crackers before getting up. Small, frequent meals help!" },
                { icon: "💊", title: "Folic Acid", content: "Take 400mcg folic acid daily to prevent neural tube defects." },
                { icon: "😴", title: "Extra Rest", content: "Your body is working hard! Get 8-9 hours of sleep." }
            ];
        } else if (currentWeek <= 28) {
            return [
                { icon: "🥛", title: "Calcium Boost", content: "Increase calcium intake to 1000mg daily for baby&apos;s bone development." },
                { icon: "🚶‍♀️", title: "Stay Active", content: "Light exercise like walking helps with energy and mood." },
                { icon: "👶", title: "Baby Movement", content: "Start feeling those first kicks! Track movement patterns." }
            ];
        } else {
            return [
                { icon: "🎒", title: "Hospital Bag", content: "Start packing your hospital bag around week 32-34." },
                { icon: "🤱", title: "Breastfeeding Prep", content: "Consider taking a breastfeeding class." },
                { icon: "😮‍💨", title: "Breathing Exercises", content: "Practice breathing techniques for labor preparation." }
            ];
        }
    };

    const dailyTips = getPhaseBasedTips();

    const getFormattedDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    }

    const addTask = (date: Date) => {
        if (newTask.trim()) {
            const formattedDate = getFormattedDate(date);
            const dayTasks = tasks[formattedDate] || [];
            const newTasks = [...dayTasks, { id: Date.now(), text: newTask, completed: false }];
            setTasks({ ...tasks, [formattedDate]: newTasks });
            setNewTask('');
        }
    };

    const toggleTask = (date: Date, id: number) => {
        const formattedDate = getFormattedDate(date);
        const dayTasks = tasks[formattedDate].map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks({ ...tasks, [formattedDate]: dayTasks });
    };

    const deleteTask = (date: Date, id: number) => {
        const formattedDate = getFormattedDate(date);
        const dayTasks = tasks[formattedDate].filter(task => task.id !== id);
        setTasks({ ...tasks, [formattedDate]: dayTasks });
    };

    const handleDateClick = (day: number) => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
    };

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        const formattedDate = getFormattedDate(new Date());
        const todaysTasks = tasks[formattedDate] || [];

        const dataToSave = {
            dailyMood: mood,
            energy: energyLevel,
            discomfort: discomfort,
            taskRemember: todaysTasks.map(t => t.text),
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });

            if (!response.ok) {
                throw new Error('Failed to save daily check-in');
            }

            alert('Daily check-in saved successfully!');
        } catch (error) {
            console.error('Error saving check-in:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const navigationButtons = [
        {
            title: "AI Assistant",
            icon: <Bot className="w-8 h-8" />,
            emoji: "🤖",
            description: "Chat & get personalized advice",
            bgColor: "bg-gradient-to-r from-purple-100 to-pink-100",
            textColor: "text-purple-700"
        },
        {
            title: "Nutrition & Hydration",
            icon: <Apple className="w-8 h-8" />,
            emoji: "🍎",
            description: "Track your daily food intake",
            bgColor: "bg-gradient-to-r from-green-100 to-blue-100",
            textColor: "text-green-700"
        },
        {
            title: "Story Mode",
            icon: <BookOpen className="w-8 h-8" />,
            emoji: "📖",
            description: "Read uplifting pregnancy stories",
            bgColor: "bg-gradient-to-r from-pink-100 to-purple-100",
            textColor: "text-pink-700"
        }
    ];

    const moodEmojis = [
        { emoji: "😊", label: "Great", value: "great" },
        { emoji: "😌", label: "Good", value: "good" },
        { emoji: "😐", label: "Okay", value: "okay" },
        { emoji: "😔", label: "Low", value: "low" },
        { emoji: "😞", label: "Difficult", value: "difficult" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-green-50">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-pink-200 opacity-20">
                    <Baby className="w-12 h-12" />
                </div>
                <div className="absolute top-40 right-20 text-purple-200 opacity-20">
                    <Heart className="w-8 h-8" />
                </div>
                <div className="absolute bottom-40 left-20 text-green-200 opacity-20">
                    <span className="text-4xl">👣</span>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Top Section with Countdown and Calendar */}
                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                    {/* Pregnancy Countdown Section */}
                    <div className="lg:col-span-3 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 shadow-sm border border-pink-200 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-6xl opacity-20">👶</div>
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
                                Baby arrives in:
                            </h1>
                            {/* <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-4 font-mono">
                                {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                            </div> */}
                                <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white rounded-lg p-2"><div className="text-xl font-bold text-pink-600">{timeLeft.days}</div><div className="text-lg text-gray-600">Days</div></div>
                <div className="bg-white rounded-lg p-2"><div className="text-xl font-bold text-pink-600">{timeLeft.hours}</div><div className="text-lg text-gray-600">Hours</div></div>
                <div className="bg-white rounded-lg p-2"><div className="text-xl font-bold text-pink-600">{timeLeft.minutes}</div><div className="text-lg text-gray-600">Min</div></div>
                <div className="bg-white rounded-lg p-2"><div className="text-xl font-bold text-pink-600">{timeLeft.seconds}</div><div className="text-lg text-gray-600">Sec</div></div>
              </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg text-gray-700">Week {currentWeek} • {pregnancyPhase} • Baby is the size of a</span>
                                <span className="text-2xl">🌽</span>
                            </div>
                            <p className="text-lg text-gray-600 font-medium">
                                You&apos;re doing an amazing job! Keep shining, mama. ✨
                            </p>
                        </div>
                    </div>

                    {/* Compact Calendar */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100">
                        <button
                            onClick={() => setShowCalendar(true)}
                            className="w-full text-left hover:bg-purple-50 rounded-2xl p-4 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <Calendar className="w-6 h-6 text-purple-500" />
                                <h3 className="font-semibold text-gray-800">Calendar</h3>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                                {currentTime.getDate()}
                            </div>
                            <div className="text-sm text-gray-600">
                                {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs">
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                {/* <span className="text-gray-600">2 appointments</span> */}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Daily Check-in and Quick Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Daily Questions Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-green-100">
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">Daily Check-in</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Mood Tracker */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">How&apos;s your mood today?</h3>
                                    <div className="flex gap-2">
                                        {moodEmojis.map((moodOption) => (
                                            <button
                                                key={moodOption.value}
                                                onClick={() => setMood(moodOption.value)}
                                                className={`p-2 rounded-xl text-xl transition-all ${mood === moodOption.value
                                                    ? 'bg-pink-200 scale-110'
                                                    : 'bg-gray-100 hover:bg-pink-100'
                                                    }`}
                                                title={moodOption.label}
                                            >
                                                {moodOption.emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Energy Level */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Energy level?</h3>
                                    <div className="px-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={energyLevel}
                                            onChange={(e) => setEnergyLevel(Number(e.target.value))}
                                            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>Low</span>
                                            <span className="font-medium">{energyLevel}/10</span>
                                            <span>High</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Discomfort */}
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">Any discomfort?</h3>
                                    <textarea
                                        value={discomfort}
                                        onChange={(e) => setDiscomfort(e.target.value)}
                                        placeholder="Optional: describe any discomfort..."
                                        className="w-full p-3 bg-white/80 border border-pink-200 rounded-xl outline-none focus:border-pink-400 transition-colors text-sm resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <button onClick={handleSave} disabled={saving} className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : "Save Today's Check-in"}
                            </button>
                        </div>

                        {/* Quick Navigation Buttons */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {navigationButtons.map((button, index) => (
                                <div
                                    key={index}
                                    className={`${button.bgColor} rounded-3xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300 cursor-pointer group`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-3xl">{button.emoji}</div>
                                        <div className={`${button.textColor} group-hover:scale-110 transition-transform`}>
                                            {button.icon}
                                        </div>
                                    </div>
                                    <h3 className={`text-lg font-semibold ${button.textColor} mb-2`}>
                                        {button.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                        {button.description}
                                    </p>
                                    <div className="flex items-center justify-end mt-3">
                                        <ChevronRight className={`w-4 h-4 ${button.textColor} group-hover:translate-x-1 transition-transform`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Tips and Tasks */}
                    <div className="space-y-8">
                        {/* Phase-Based Notifications */}
                        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-6 shadow-sm border border-orange-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-5 h-5 text-orange-500" />
                                <h2 className="text-xl font-serif text-gray-800">
                                    {pregnancyPhase} Tips
                                </h2>
                                <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                                    Week {currentWeek}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {dailyTips.map((tip, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-xl">{tip.icon}</div>
                                            <h3 className="font-semibold text-gray-800 text-sm">{tip.title}</h3>
                                        </div>
                                        <p className="text-gray-600 text-xs leading-relaxed">{tip.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tasks to Remember Section */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-serif text-gray-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Tasks to Remember
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTask(new Date())}
                                    placeholder="Add a new task for today..."
                                    className="flex-1 px-3 py-2 bg-white/80 border border-green-200 rounded-xl outline-none focus:border-green-400 transition-colors text-sm"
                                />
                                <button
                                    onClick={() => addTask(new Date())}
                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {(tasks[getFormattedDate(new Date())] || []).map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-green-100">
                                        <button
                                            onClick={() => toggleTask(new Date(), task.id)}
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-green-400'
                                                }`}
                                        >
                                            {task.completed && <CheckCircle className="w-2 h-2" />}
                                        </button>
                                        <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                            {task.text}
                                        </span>
                                        <button
                                            onClick={() => deleteTask(new Date(), task.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Popup Modal */}
            {showCalendar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-200 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-serif text-gray-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                Calendar & Tasks
                            </h3>
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                                const day = i + 1;
                                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                                const formattedDate = getFormattedDate(date);
                                const dayTasks = tasks[formattedDate] || [];
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDateClick(day)}
                                        className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors relative ${getFormattedDate(selectedDate) === formattedDate
                                            ? 'bg-pink-500 text-white'
                                            : 'hover:bg-pink-50 text-gray-700'
                                            }`}
                                    >
                                        {day}
                                        {dayTasks.length > 0 && (
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTask(selectedDate)}
                                    placeholder="Add a new task..."
                                    className="flex-1 px-3 py-2 bg-white/80 border border-green-200 rounded-xl outline-none focus:border-green-400 transition-colors text-sm"
                                />
                                <button
                                    onClick={() => addTask(selectedDate)}
                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {(tasks[getFormattedDate(selectedDate)] || []).map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-green-100">
                                        <button
                                            onClick={() => toggleTask(selectedDate, task.id)}
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-green-400'
                                                }`}
                                        >
                                            {task.completed && <CheckCircle className="w-2 h-2" />}
                                        </button>
                                        <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                            {task.text}
                                        </span>
                                        <button
                                            onClick={() => deleteTask(selectedDate, task.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ec4899;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ec4899;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;