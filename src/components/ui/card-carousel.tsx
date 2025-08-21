"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"

interface CarouselProps {
  images: { src: string; alt: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .card-carousel .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .card-carousel .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 400px;
    height: 400px;
  }
  
  .card-carousel .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-carousel .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .card-carousel .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  
  .card-carousel .swiper-pagination-bullet {
    background: rgba(236, 72, 153, 0.5) !important;
  }
  
  .card-carousel .swiper-pagination-bullet-active {
    background: #ec4899 !important;
  }
  `
  
  return (
    <section className="card-carousel w-full">
      <style>{css}</style>
      <Swiper
        spaceBetween={30}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={showPagination}
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : undefined
        }
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={image.src}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                alt={image.alt}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
