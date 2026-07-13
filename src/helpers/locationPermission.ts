export type GeolocationPermissionStatus =
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported";

export async function getGeolocationPermissionStatus(): Promise<GeolocationPermissionStatus> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "unsupported";
  }

  if (navigator.permissions?.query) {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state as GeolocationPermissionStatus;
    } catch {
      return "prompt";
    }
  }

  return "prompt";
}

export function requestGeolocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}
