const createDelay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const getItem = async (key, defaultValue = null) => {
  await createDelay();
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const setItem = async (key, value) => {
  await createDelay();
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
    throw error;
  }
};

export const removeItem = async (key) => {
  await createDelay();
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    throw error;
  }
};
