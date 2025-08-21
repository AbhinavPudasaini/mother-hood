"use client"

import React, { useState, useEffect } from 'react';
import Sidebar from './ui/sidebar';
import Landing from '../app/pages/landing';
import OnboardingPage from '../app/pages/Question';
import Dashboard from '../app/pages/Dashboard';
import AiAssistant from '../app/pages/Ai-assitant';
import Nutrition from '../app/pages/Nutrition';
import Story from '../app/pages/Story';

type AppFlow = 'landing' | 'onboarding' | 'app';
type AppPage = 'dashboard' | 'ai-assistant' | 'nutrition' | 'story';

const AppContainer = () => {
    const [currentFlow, setCurrentFlow] = useState<AppFlow>('landing');
    const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

    // Handle flow progression
    const handleFlowProgression = () => {
        if (currentFlow === 'landing') {
            setCurrentFlow('onboarding');
        } else if (currentFlow === 'onboarding') {
            setCurrentFlow('app');
        }
    };

    // Handle page navigation within the app
    const handlePageChange = (page: string) => {
        setCurrentPage(page as AppPage);
    };

    // Render current page content
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'ai-assistant':
                return <AiAssistant />;
            case 'nutrition':
                return <Nutrition />;
            case 'story':
                return <Story />;
            default:
                return <Dashboard />;
        }
    };

    // Render based on current flow
    if (currentFlow === 'landing') {
        return (
            <div onClick={handleFlowProgression}>
                <Landing />
            </div>
        );
    }

    if (currentFlow === 'onboarding') {
        return (
            <div>
                <OnboardingPage onComplete={handleFlowProgression} />
            </div>
        );
    }

    // App flow with sidebar
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-green-50">
            <Sidebar 
                currentPage={currentPage} 
                onPageChange={handlePageChange} 
            />
            <div className="flex-1 ml-20 transition-all duration-300">
                {renderCurrentPage()}
            </div>
        </div>
    );
};

export default AppContainer;