export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 'S/ 0.00';
  return `S/ ${amount.toFixed(2)}`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatElapsedTime = (milliseconds) => {
  if (!milliseconds || milliseconds < 0) return '0 min';
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }
  return `${minutes} min`;
};
