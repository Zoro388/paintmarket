
"use client";

import { useCallback, useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import endpointRoute from "@/lib/endpointRoute";

export default function AdminPushNotifications() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const registerDevice = useCallback(async () => {
    if (
      !("serviceWorker" in navigator) ||
      !("Notification" in window)
    ) {
      setSupported(false);
      return false;
    }

    if (Notification.permission !== "granted") {
      return false;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      throw new Error("The Firebase VAPID key is missing.");
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      setSupported(false);
      throw new Error("Firebase Messaging is not supported.");
    }

    const serviceWorkerRegistration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    if (!token) {
      throw new Error("Firebase did not return a device token.");
    }

    await endpointRoute.post("/admin/notifications/register", {
      token,
      platform: "web",
    });

    setEnabled(true);
    return true;
  }, []);

  // Automatically restore registration when permission already exists.
  useEffect(() => {
    let cancelled = false;

    async function restoreRegistration() {
      if (
        !("serviceWorker" in navigator) ||
        !("Notification" in window)
      ) {
        setSupported(false);
        return;
      }

      if (Notification.permission !== "granted") {
        return;
      }

      try {
        await registerDevice();

        if (!cancelled) {
          setMessage("Notifications are enabled on this device.");
        }
      } catch (error) {
        console.error(
          "Could not restore notification registration:",
          error
        );

        if (!cancelled) {
          setMessage(
            "Could not refresh notification registration. Please try enabling notifications again."
          );
        }
      }
    }

    void restoreRegistration();

    return () => {
      cancelled = true;
    };
  }, [registerDevice]);

  // Re-register when the user returns to an existing dashboard tab.
  useEffect(() => {
    let running = false;

    async function handleVisibilityChange() {
      if (
        document.visibilityState !== "visible" ||
        Notification.permission !== "granted" ||
        running
      ) {
        return;
      }

      running = true;

      try {
        await registerDevice();
      } catch (error) {
        console.error(
          "Notification registration refresh failed:",
          error
        );
      } finally {
        running = false;
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [registerDevice]);

  // Listen for notifications received while the dashboard is open.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function setupForegroundMessages() {
      if (
        !("serviceWorker" in navigator) ||
        !("Notification" in window)
      ) {
        if (!cancelled) setSupported(false);
        return;
      }

      try {
        const messaging = await getFirebaseMessaging();

        if (!messaging || cancelled) {
          if (!cancelled && !messaging) {
            setSupported(false);
          }
          return;
        }

        unsubscribe = onMessage(messaging, (payload) => {
          const title =
            payload.notification?.title ||
            "Paintdomain notification";

          const body = payload.notification?.body || "";

          setMessage(body ? `${title}: ${body}` : title);
        });
      } catch (error) {
        console.error(
          "Could not initialize admin notifications:",
          error
        );
      }
    }

    void setupForegroundMessages();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function enableNotifications() {
    setLoading(true);
    setMessage("");

    try {
      if (
        !("serviceWorker" in navigator) ||
        !("Notification" in window)
      ) {
        setSupported(false);
        setMessage(
          "Push notifications are not supported by this browser."
        );
        return;
      }

      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          setMessage(
            permission === "denied"
              ? "Notifications are blocked in your browser settings."
              : "Notification permission was not granted."
          );
          return;
        }
      }

      const registered = await registerDevice();

      if (registered) {
        setMessage(
          "Admin notifications are enabled on this device."
        );
      }
    } catch (error) {
      console.error(
        "Enabling admin notifications failed:",
        error
      );

      setMessage(
        "Could not enable notifications. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Admin push notifications
          </h2>

          <p className="mt-1 text-sm text-gray-300">
            Receive an alert when an inspection booking payment is confirmed.
          </p>
        </div>

        <button
          type="button"
          onClick={enableNotifications}
          disabled={loading || !supported}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Enabling..."
            : enabled
              ? "Refresh registration"
              : "Enable notifications"}
        </button>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-gray-200"
        >
          {message}
        </p>
      )}
    </section>
  );
}
