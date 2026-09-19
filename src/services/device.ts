import type { DeviceIdentity } from "../types";
import { KEYS, storage } from "../storage/adapter";
import { newId } from "../lib/ids";

function permissionState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function loadDevice(): Promise<DeviceIdentity> {
  const existing = await storage.getItem<DeviceIdentity>(KEYS.device);
  if (existing) {
    return {
      ...existing,
      permission: permissionState(),
    };
  }
  const identity: DeviceIdentity = {
    deviceId: newId("DEV"),
    fcmToken: `FCM-${crypto.randomUUID()}`,
    notificationsEnabled: false,
    permission: permissionState(),
  };
  await storage.setItem(KEYS.device, identity);
  return identity;
}

export async function requestNotifications(device: DeviceIdentity): Promise<DeviceIdentity> {
  if (!("Notification" in window)) {
    const next = { ...device, permission: "unsupported" as const, notificationsEnabled: false };
    await storage.setItem(KEYS.device, next);
    return next;
  }
  const result = await Notification.requestPermission();
  const next: DeviceIdentity = {
    ...device,
    permission: result,
    notificationsEnabled: result === "granted",
  };
  await storage.setItem(KEYS.device, next);
  return next;
}

export function showLocalPush(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.svg" });
  } catch {
    /* browsers may block if not from a user gesture; in-app feed still records it */
  }
}
