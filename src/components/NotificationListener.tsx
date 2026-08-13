import { useEffect, useRef } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useToast } from "../context/ToastContext";

export default function NotificationListener() {
  const { showToast } = useToast();
  const userId = localStorage.getItem("pb_user_id");
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!userId) return;

    // Listen for new connection requests
    const q = query(
      collection(db, "connection_requests"),
      where("receiver_id", "==", userId),
      where("status", "==", "pending"),
      orderBy("created_at", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip the initial load to avoid toast spam for old requests
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          showToast("You have a new connection request!", "notification");
        }
      });
    }, (error) => {
      console.error("Notification listener error:", error);
    });

    return () => unsubscribe();
  }, [userId, showToast]);

  return null;
}
