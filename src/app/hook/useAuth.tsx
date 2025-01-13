"use client";

import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    // Function to listen for authentication state changes
    const currentPath = location.pathname;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (currentPath === "/login" || currentPath === "/register") {
          router.push("/");
        }
      } else {
        if (currentPath !== "/login" && currentPath !== "/register") {
          router.push("/login");
        }
      }
    });

    // Cleanup function to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, [router]);
}
