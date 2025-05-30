import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { getImages, saveImage } from '../services/storage';

function Gallery() {
  const [images, setImages] = useState([]); // store images list

  // Load images once on component mount
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await getImages();
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  // Handle new image upload
  const handleUpload = async (newImage) => {
    await saveImage({
      ...newImage,
      timestamp: Date.now(),  // add upload timestamp
    });
    const loadedImages = await getImages(); // reload updated images list
    setImages(loadedImages);                 // update state
  };

  return (
    <div className="gallery">
      <h1>My gallery</h1>
      <ImageUploader onUpload={handleUpload} /> {/* Upload form */}
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <Link to={`/image/${image.id}`}>
              <img src={image.url} alt={image.description} />
            </Link>
            <p>{image.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
