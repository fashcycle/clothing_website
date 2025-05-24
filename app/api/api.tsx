import axios from 'axios';



// Function to add a new address
export const addNewAddress = async (addressData: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_ADD_ADDRESS_API_URL as string,
      addressData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to add address');
    }
    throw error;
  }
};

// Function to get user addresses
export const getUserAddresses = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/addresses`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch addresses');
    }
    throw error;
  }
};

// Function to update an address
export const updateAddress = async (addressId: string, addressData: any) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_UPDATE_ADDRESS}/${addressId}`,
      addressData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to update address');
    }
    throw error;
  }
};

// Function to delete an address
export const deleteAddress = async (addressId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_DELETE_ADDRESS}/${addressId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to delete address');
    }
    throw error;
  }
};
export const registerUser = async (userData: any) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_REGISTER_USER as string,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to register user');
      }
      throw error;
    }
  };
  export const loginUser = async (userData: any) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_LOGIN_USER as string,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to login');
      }
      throw error;
    }
  };
  export const updateUserProfile = async (profileData: any) => {
    try {
      const response = await axios.put(
        process.env.NEXT_PUBLIC_UPDATE_USER_PROFILE_UPDAGE as string,
        profileData,
        {
          headers: {
            'Content-Type': 'multipart/from-data',
'Authorization': `Bearer ${localStorage.getItem('token')}`,          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to update profile');
      }
      throw error;
    }
  };
  export const getUserDetails = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_GET_USER_DETAILS as string,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to fetch user details');
      }
      throw error;
    }
  };
  export const createProduct = async (productData: any) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_CREATE_PRODUCT as string,
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to create product');
      }
      throw error;
    }
  };
  export const getUserProducts = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_USER_PRODUCT_LIST as string,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to fetch user products');
      }
      throw error;
    }
  };
  export const getSingleProduct = async (productId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_USER_SINGLE_PRODUCT}/${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to fetch product details');
      }
      throw error;
    }
  };
  export const contactUsApi = async (contactData: {
    userType: string;
    email: string;
    message: string;
  }) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_CONTACT_US as string,
        contactData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to submit contact form');
      }
      throw error;
    }
  };
  // Add to wishlist
export const addToWishlist = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_CREATE_WISHLIST as string,
       data ,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to add to wishlist');
    }
    throw error;
  }
};

// Get wishlisted products
export const getWishlistedProducts = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_WISHLISTED_PRODUCTS as string,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch wishlist');
    }
    throw error;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (data: any) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_REMOVE_FROM_WISHLIST}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        data: data // Add the data to the request body
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to remove from wishlist');
    }
    throw error;
  }
};
// Add to cart
export const addToCart = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_ADD_TO_CART as string,
      data ,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to add to cart');
    }
    throw error;
  }
};

// Get cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_CART_LIST as string,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch cart items');
    }
    throw error;
  }
};

// Remove from cart
export const removeFromCart = async (productId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_REMOVE_CART_DATA}/${productId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to remove from cart');
    }
    throw error;
  }
};
export const getAllProducts = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_ALL_PRODUCT as string,
      {
        headers: {
          'Content-Type': 'application/json',
          
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch all products');
    }
    throw error;
  }
};