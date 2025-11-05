// Convert image URL to base64 for PDF generation
export const imageUrlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Convert all images in data to base64
export const convertImagesToBase64 = async (data) => {
  const convertedData = { ...data };
  
  // Convert itinerary images
  if (data.Itinearies && data.Itinearies.length > 0) {
    convertedData.Itinearies = await Promise.all(
      data.Itinearies.map(async (it) => {
        if (it.ImageUrl) {
          const base64 = await imageUrlToBase64(it.ImageUrl);
          return { ...it, ImageUrl: base64 || it.ImageUrl };
        }
        return it;
      })
    );
  }
  
  // Convert hotel images
  if (data.Hotels && data.Hotels.length > 0) {
    convertedData.Hotels = await Promise.all(
      data.Hotels.map(async (h) => {
        if (h.ImageUrl) {
          const base64 = await imageUrlToBase64(h.ImageUrl);
          return { ...h, ImageUrl: base64 || h.ImageUrl };
        }
        return h;
      })
    );
  }
  
  return convertedData;
};
