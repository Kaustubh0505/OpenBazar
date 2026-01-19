"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutAddress() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Form State (Reuse from Profile logic potentially, but for now inline simple add)
    // For MVP, if no address, redirect to Profile or show simple form. 
    // Let's redirect to profile for adding new addresses to keep it DRY for now, or fetch addresses.

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/auth/login");

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKENDURL}/api/user/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data);

            // Auto-select default
            const defaultAddr = res.data.addresses.find(a => a.isDefault) || res.data.addresses[0];
            if (defaultAddr) setSelectedAddress(defaultAddr._id);

        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!selectedAddress) return alert("Please select an address");

        const address = user.addresses.find(a => a._id === selectedAddress);
        // Store selected address temporarily
        sessionStorage.setItem("shippingAddress", JSON.stringify(address));
        router.push("/checkout/review");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-10 text-sm font-medium">
                    <div className="flex items-center text-blue-600">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-2">1</span>
                        Address
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                    <div className="flex items-center text-gray-500">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">2</span>
                        Review
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                    <div className="flex items-center text-gray-500">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2">3</span>
                        Payment
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Select Delivery Address</h1>

                <div className="grid gap-4 mb-8">
                    {user?.addresses?.length === 0 ? (
                        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                            <button
                                onClick={() => router.push("/account/profile")}
                                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                            >
                                <Plus className="inline w-4 h-4 mr-2" />Add New Address
                            </button>
                        </div>
                    ) : (
                        user?.addresses?.map((addr) => (
                            <div
                                key={addr._id}
                                onClick={() => setSelectedAddress(addr._id)}
                                className={`
                                    bg-white p-6 rounded-lg border-2 cursor-pointer transition-all relative
                                    ${selectedAddress === addr._id ? "border-blue-600 shadow-md" : "border-gray-200 hover:border-gray-300"}
                                `}
                            >
                                {selectedAddress === addr._id && (
                                    <CheckCircle className="absolute top-4 right-4 text-blue-600 w-6 h-6" />
                                )}
                                <h3 className="font-bold text-gray-800 text-lg">{addr.fullName}</h3>
                                <p className="text-gray-600 mt-1">{addr.street}</p>
                                <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p className="text-gray-600">{addr.country}</p>
                                <p className="text-gray-600 mt-2 font-medium">Phone: {addr.phone}</p>
                            </div>
                        ))
                    )}
                </div>

                {user?.addresses?.length > 0 && (
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-4">
                        <button
                            onClick={() => router.push("/account/profile")}
                            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                        >
                            + Add / Manage Addresses
                        </button>

                        <button
                            onClick={handleContinue}
                            disabled={!selectedAddress}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Continue to Review <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
