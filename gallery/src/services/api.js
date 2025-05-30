
export const fetchImages = async () => {
  // Simulate network request
  return new Promise(resolve => {
    setTimeout(async () => {
      const images = await getImages();
      resolve(images);
    }, 500);
  });
};

export const fetchImageById = async (id) => {
  return new Promise(resolve => {
    setTimeout(async () => {
      const image = await getImageById(id);
      resolve(image);
    }, 300);
  });
};

// Re-export storage functions for consistency
export { getImages, getImageById, saveImage, updateImage } from './storage';