import axios from "axios";

// Function to add a new address
export const addNewAddress = async (addressData: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_ADD_ADDRESS_API_URL as string,
      addressData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to add address");
    }
    throw error;
  }
};

// Function to get user addresses
export const getUserAddresses = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_MYALL_ADDRESS as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch addresses"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to update address"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to delete address"
      );
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
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Failed to register user",
        }
      );
    }
    return { success: false, message: "Unexpected error" };
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_LOGIN_USER as string,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to login");
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
          "Content-Type": "multipart/from-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to update profile"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch user details"
      );
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
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to create product"
      );
    }
    throw error;
  }
};
export const getUserProducts = async ({ page, limit }:any) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_USER_PRODUCT_LIST}?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch user products"
      );
    }
    throw error;
  }
};

export const getOrderProducts = async ({ page, limit }:any) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_GET_ORDERS}?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch orders products"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch product details"
      );
    }
    throw error;
  }
};

export const deleteSingleProduct = async (productId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_USER_SINGLE_PRODUCT}/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to delete product"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to submit contact form"
      );
    }
    throw error;
  }
};

export const addToWishlist = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_CREATE_WISHLIST as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to add to wishlist"
      );
    }
    throw error;
  }
};

export const getWishlistedProducts = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_WISHLISTED_PRODUCTS as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch wishlist"
      );
    }
    throw error;
  }
};

export const removeFromWishlist = async (data: any) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_REMOVE_FROM_WISHLIST}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data, // Add the data to the request body
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to remove from wishlist"
      );
    }
    throw error;
  }
};

export const addToCart = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_ADD_TO_CART as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to add to cart");
    }
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_CART_LIST as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch cart items"
      );
    }
    throw error;
  }
};

export const removeFromCart = async (data: any) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_REMOVE_CART_DATA}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data, // Adding the data object to the delete request body
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to remove from cart"
      );
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
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch all products"
      );
    }
    throw error;
  }
};
export const filteredProductList = async (query?: any) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_FILTERED_PRODUCT_LIST as string,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: query, // 🔁 Add query here
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch all products"
      );
    }
    throw error;
  }
};

export const getPincodes = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_PINCODES_LIST as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch pincodes"
      );
    }
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_CATEGORIES as string,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch all categories"
      );
    }
    throw error;
  }
};

export const verifyReferral = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_VERIFY_REFERRAL as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to add to cart");
    }
    throw error;
  }
};

export const updateProduct = async (productId: string, productData: any) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_UPDATE_PRODUCT}/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to update product"
      );
    }
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_GET_NOTIFICATIONS as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch notifcations"
      );
    }
    throw error;
  }
};

export const forgetPassword = async (email: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_FORGET_PASSWORD as string,
      email,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to ForgetPassword"
      );
    }
    throw error;
  }
};
export const verifyOTP = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_VERIFY_OTP as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "WORNG OTP");
    }
    throw error;
  }
};

export const resetPassword = async (data: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_RESET_PASSWORD as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to reset password"
      );
    }
    throw error;
  }
};

export const resendOTP = async (email: any) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_RESEND_OTP as string,
      email,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Failed to resend OTP");
    }
    throw error;
  }
};

export const notificationAvailablity = async (
  productId: string,
  action: "CONFIRM" | "REJECT"
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_PRODUCT_AVAILABLITY}/${productId}`,
      {
        action,
        respondedVia: "NOTIFICATION",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send response"
      );
    }
    throw error;
  }
};

export const getRazorpayKeys = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch razorpay keys"
      );
    }
    throw error;
  }
};

export const getEarnings = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_EARNINGS as string,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch Earnings"
      );
    }
    throw error;
  }
};

export const getCartRespond = async (productId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_CHECK_PRODUCT_STATUS_APPROVAL}/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch Earnings"
      );
    }
    throw error;
  }
};

export const getSingleProductBookings = async (productId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_USER_SINGLE_PRODUCT}/${productId}/bookings`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "Failed to fetch product details"
      );
    }
    throw error;
  }
};
