"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlider() {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, [currentSlide, banners.length]);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/banners`
            );
            setBanners(res.data || []);
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    if (banners.length === 0) return null;

    return (
        <div className="relative w-full h-[450px]">
            {/* Slides */}
            <div
                className="w-full h-full flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <div key={banner._id} className="min-w-full h-full relative">
                        <img
                            src={banner.image_url}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover"
                        />
                        {/* Optional Overlay / Title could go here */}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Only show if > 1 banner) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${currentSlide === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
