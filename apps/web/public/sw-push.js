// Push Notification Handler for Kaitif PWA
// This file is loaded by the main service worker

self.addEventListener("push", function (event) {
  if (!event.data) {
    console.log("Push event but no data");
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: data.badge || "/icons/icon-72x72.png",
      image: data.image,
      tag: data.tag || "kaitif-notification",
      vibrate: [100, 50, 100],
      data: {
        ...data.data,
        url: data.data?.url || "/",
      },
      actions: data.actions || [],
      requireInteraction: data.tag === "announcement",
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Kaitif Skatepark", options)
    );
  } catch (error) {
    console.error("Error handling push event:", error);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  // Handle action clicks
  if (event.action) {
    console.log("Notification action clicked:", event.action);
    // Could handle specific actions here
  }

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Try to focus an existing window
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open a new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed:", event.notification.tag);
});

// Handle push subscription change (e.g., browser regenerated keys)
self.addEventListener("pushsubscriptionchange", function (event) {
  console.log("Push subscription changed");

  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true })
      .then(function (subscription) {
        // Send new subscription to server
        return fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
        });
      })
  );
});
