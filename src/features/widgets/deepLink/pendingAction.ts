let pendingAddProduct = false;

export const setPendingAddProduct = (): void => {
  pendingAddProduct = true;
};

export const consumePendingAddProduct = (): boolean => {
  const pending = pendingAddProduct;
  pendingAddProduct = false;
  return pending;
};
