"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      router.replace("/homePage");
    } else {

      router.replace("/auth/signup");
    }
  }, [router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f5f2]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
