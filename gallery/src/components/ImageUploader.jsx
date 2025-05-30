import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

function ImageUploader({ onUpload }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      try {
        // Compress image before loading
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.2, // max file size in MB
          maxWidthOrHeight: 800, // max dimension
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target.result); // set compressed image as base64 string
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Compression error:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image && description) {
      const newImage = {
        // id will be added by parent on save
        url: image,
        description,
      };
      onUpload?.(newImage);
      // Reset form
      setImage(null);
      setDescription('');
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="uploader">
      <h2>New image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Image description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default ImageUploader;
