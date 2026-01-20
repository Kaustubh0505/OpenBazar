"use client";

import { RefreshCw, CheckCircle, Headset } from "lucide-react";

export function OurPolicy() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 bg-[#f7f5f2]">
                {/* Policy 1: Exchange */}
                <div>
                    <div className="flex justify-center mb-5">
                        <RefreshCw className="h-10 w-10 text-black mb-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-gray-800 text-base">Easy Exchange Policy</p>
                    <p className="text-gray-400 mt-1 text-sm">We offer hassle free exchange policy</p>
                </div>

                {/* Policy 2: Return */}
                <div>
                    <div className="flex justify-center mb-5">
                        <CheckCircle className="h-10 w-10 text-black mb-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-gray-800 text-base">7 Days Return Policy</p>
                    <p className="text-gray-400 mt-1 text-sm">We provide 7 days free return policy</p>
                </div>

                {/* Policy 3: Support */}
                <div>
                    <div className="flex justify-center mb-5">
                        <Headset className="h-10 w-10 text-black mb-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-gray-800 text-base">Best customer support</p>
                    <p className="text-gray-400 mt-1 text-sm">We provide 24/7 customer support</p>
                </div>
            </div>
            <div className="border-t border-gray-300 ml-20 mr-20 text-center"></div>
        </div>

    );
}
