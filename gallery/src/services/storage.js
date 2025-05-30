import {
  saveToIndexedDB,
  getFromIndexedDB,
  deleteFromIndexedDB
} from '../utils/db';

class ImageStorage {
  constructor() {
    this.STORAGE_KEY = 'image_gallery_meta'; // key for storing metadata in localStorage
    this.MAX_IMAGES = 20;                    // max number of images to keep metadata for
    this.initialize();
  }

  // Initialize metadata storage if empty
  initialize() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Get list of image metadata
  async getImages() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  }

  // Get full image data by ID (metadata + actual data from IndexedDB)
  async getImageById(id) {
    const meta = await this.getImages();
    const entry = meta.find((img) => img.id === id);
    const data = await getFromIndexedDB(id);
    return { ...entry, ...data };
  }

  // Save new image: store metadata in localStorage, actual data in IndexedDB
  async saveImage(imageData) {
    const id = Date.now().toString();

    // Destructure image data and metadata parts
    const {
      image, drawing, audioComments, textComments = [],
      ...metaData
    } = imageData;

    // Create metadata for localStorage
    const newMeta = {
      id,
      createdAt: Date.now(),
      textCommentsCount: textComments.length,
      hasDrawing: !!drawing,
      hasAudio: !!audioComments?.length,
      ...metaData
    };

    // Update metadata list and keep max number of images
    const metaList = await this.getImages();
    const updatedMeta = [newMeta, ...metaList].slice(0, this.MAX_IMAGES);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMeta));

    // Save actual image data to IndexedDB
    await saveToIndexedDB({
      id,
      image,
      drawing,
      audioComments,
      textComments
    });

    return { id, ...imageData };
  }

  // Update existing image metadata and IndexedDB data
  async updateImage(id, updates) {
    const metaList = await this.getImages();
    const idx = metaList.findIndex(img => img.id === id);
    if (idx === -1) return null;

    const dbData = await getFromIndexedDB(id);
    const updatedMeta = {
      ...metaList[idx],
      ...updates
    };

    // Save updated metadata and data
    const updatedMetaList = [...metaList];
    updatedMetaList[idx] = updatedMeta;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMetaList));

    await saveToIndexedDB({ ...dbData, ...updates, id });
    return { id, ...dbData, ...updates };
  }

  // Delete image metadata and data
  async deleteImage(id) {
    const metaList = await this.getImages();
    const updatedMetaList = metaList.filter(img => img.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMetaList));
    await deleteFromIndexedDB(id);
  }

  // Delete a text comment by index and update metadata count
  async deleteTextComment(id, index) {
    const data = await getFromIndexedDB(id);
    if (!data?.textComments) return null;

    data.textComments.splice(index, 1);
    await saveToIndexedDB({ ...data, id });

    return this.updateImage(id, {
      textCommentsCount: data.textComments.length
    });
  }

  // Delete an audio comment by index and update metadata flag
  async deleteAudioComment(id, index) {
    const data = await getFromIndexedDB(id);
    if (!data?.audioComments) return null;

    data.audioComments.splice(index, 1);
    await saveToIndexedDB({ ...data, id });

    return this.updateImage(id, {
      hasAudio: data.audioComments.length > 0
    });
  }

  // Delete drawing and update metadata flag
  async deleteDrawing(id) {
    const data = await getFromIndexedDB(id);
    data.drawing = null;
    await saveToIndexedDB({ ...data, id });

    return this.updateImage(id, { hasDrawing: false });
  }
}

// Export singleton instance and helper functions
export const storage = new ImageStorage();

export const getImages = () => storage.getImages();
export const getImageById = (id) => storage.getImageById(id);
export const saveImage = (imageData) => storage.saveImage(imageData);
export const updateImage = (id, updates) => storage.updateImage(id, updates);
export const deleteImage = (id) => storage.deleteImage(id);
export const deleteTextComment = (id, idx) => storage.deleteTextComment(id, idx);
export const deleteAudioComment = (id, idx) => storage.deleteAudioComment(id, idx);
export const deleteDrawing = (id) => storage.deleteDrawing(id);
