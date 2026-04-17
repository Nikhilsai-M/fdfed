export const isUnauthorizedStatus = (status) => status === 401 || status === 403;

const clearCustomerSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const clearSellerSession = () => {
  localStorage.removeItem('sellerToken');
};

export const redirectToSignIn = (role = 'customer') => {
  if (role === 'seller') {
    clearSellerSession();
    window.location.replace('/seller/login');
    return;
  }

  clearCustomerSession();
  window.location.replace('/sign-in');
};

export const redirectIfUnauthorizedResponse = (response, role = 'customer') => {
  if (isUnauthorizedStatus(response?.status)) {
    redirectToSignIn(role);
    return true;
  }

  return false;
};

export const handleAxiosUnauthorized = (error, role = 'customer') => {
  if (isUnauthorizedStatus(error?.response?.status)) {
    redirectToSignIn(role);
    return true;
  }

  return false;
};
