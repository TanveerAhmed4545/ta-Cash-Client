import axios from "axios";

/**
 * Uploads an image to the local backend proxy, which then forwards it to ImgBB.
 * This avoids CORS issues and keeps API keys secure.
 */
export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    console.error("No image file provided to uploadImage");
    return null;
  }
  
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    // Calling our local backend proxy
    const res = await axios.post("https://ta-cash-server.vercel.app/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    if (res.data && res.data.url) {
      return res.data.url;
    }
    return null;
  } catch (error) {
    console.error("Image Proxy Upload Error:", error.response?.data?.message || error.message);
    return null;
  }
};
