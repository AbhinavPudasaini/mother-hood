"use client"

import React from 'react';
import Link from "next/link";
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { CardCarousel } from "../../components/ui/card-carousel"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const Landing = () => {
    const heroSliderStyles = `
        .hero-swiper .swiper-pagination {
            bottom: 20px !important;
        }
        .hero-swiper .swiper-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            opacity: 1 !important;
        }
        .hero-swiper .swiper-pagination-bullet-active {
            background: #ec4899 !important;
            transform: scale(1.2);
        }
    `;
    // Hero section images for the main carousel
    const heroImages = [
        { src: "/cute.webp", alt: "Beautiful moments of motherhood" },
        { src: "/preg.webp", alt: "Pregnancy journey" },
        { src: "/chinese.webp", alt: "Diverse motherhood experiences" },
        { src: "/image1.webp", alt: "Nurturing care" },
        { src: "/imag2.webp", alt: "Motherhood support" },
    ]

    // Feature showcase images
    const featureImages = [
        { src: "/cute.webp", alt: "AI Assistant Support" },
        { src: "/preg.webp", alt: "Health Monitoring" },
        { src: "/image1.webp", alt: "Nutrition Planning" },
        { src: "/imag2.webp", alt: "Symptom Tracking" },
        { src: "/chinese.webp", alt: "Motivational Stories" },
    ]

    const features = [
        {
            title: "AI Companion Chat",
            description: "Talk through mood swings, loneliness, and daily concerns with your caring AI assistant",
            icon: "💬"
        },
        {
            title: "Emergency Symptom Help",
            description: "Get immediate guidance on pregnancy symptoms and when to seek medical attention",
            icon: "🚨"
        },
        {
            title: "Personalized Nutrition",
            description: "Custom meal plans and nutrition guidance tailored to your pregnancy stage",
            icon: "🥗"
        },
        {
            title: "Health Tracking",
            description: "Monitor symptoms, appointments, and milestones throughout your journey",
            icon: "📊"
        },
        {
            title: "Motivational Stories",
            description: "Calming stories and guided meditations to ease anxiety and promote wellness",
            icon: "🌸"
        },
        {
            title: "Community Support",
            description: "Connect with other mothers and share experiences in a safe, supportive space",
            icon: "🤝"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50">
            <style>{heroSliderStyles}</style>
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-800 mb-6 leading-tight">
                        Your Pregnancy Companion
                        <span className="block text-pink-400">Every Step, Every Need</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-light">
                        From nutrition to motivation, we help you and your baby thrive through every beautiful moment of your motherhood journey.
                    </p>
                </div>

                {/* Hero Images Slider */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <Swiper
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-pink-300',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-pink-500',
                        }}
                        navigation={false}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="hero-swiper rounded-3xl overflow-hidden shadow-lg"
                    >
                        {heroImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-96 md:h-[500px]">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <p className="text-lg font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                                            {image.alt}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* CTA Button */}
                <div className="text-center mb-20">
                    <Link href="/onboarding" style={{ padding: "20px", backgroundColor: "pink", borderRadius: "12px", border: "1px solid black" }}>Let&apos;s start your Journey ➜</Link>
                </div>

                {/* Motivational Quote */}
                <div className="text-center mb-20 py-12 px-8 bg-white/60 rounded-3xl shadow-sm border border-pink-100">
                    <blockquote className="text-2xl md:text-3xl font-serif text-gray-700 italic mb-4">
                        A mother&apos;s joy begins when new life is stirring inside...
                        when a tiny heartbeat is heard for the very first time,
                        and a playful kick reminds her that she is never alone.
                    </blockquote>
                    <p className="text-pink-400 font-medium">- Anonymous</p>
                </div>

                {/* Features Section */}
                <div className="mb-16">
                    <h2 className="text-4xl font-serif text-center text-gray-800 mb-4">
                        Everything You Need for Your Journey
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Comprehensive support designed with love, care, and understanding for every stage of motherhood.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white/70 p-8 rounded-2xl shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Feature Images Carousel */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-serif text-center text-gray-800 mb-8">
                            See Our Features in Action
                        </h3>
                        <CardCarousel
                            images={featureImages}
                            autoplayDelay={2500}
                            showPagination={false}
                            showNavigation={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
