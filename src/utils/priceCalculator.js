export const calculateItemSubtotal = (unitPrice, quantity) => {
  const price = parseFloat(unitPrice) || 0;
  const qty = parseInt(quantity, 10) || 0;
  return price * qty;
};

export const calculateCartTotal = (items = []) => {
  return items.reduce((total, item) => total + (item.subtotal || 0), 0);
};

export const calculateTip = (subtotal, percentage = 0) => {
  const amount = parseFloat(subtotal) || 0;
  const rate = parseFloat(percentage) || 0;
  return amount * (rate / 100);
};

export const calculateChange = (total, received) => {
  const totalAmount = parseFloat(total) || 0;
  const receivedAmount = parseFloat(received) || 0;
  return receivedAmount - totalAmount;
};
