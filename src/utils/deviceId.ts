const DEVICE_ID_KEY = "deviceId";

export const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
};

export const cleanDeviceId = () => {
    localStorage.removeItem(DEVICE_ID_KEY);
}