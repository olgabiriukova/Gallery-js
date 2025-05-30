import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageDetail from '../components/ImageDetail';
import {
  getImageById,
  updateImage,
  deleteTextComment,
  deleteAudioComment,
  deleteImage,
  deleteDrawing
} from '../services/storage';

function ImageView() {
  const { id } = useParams();          // get image ID from URL params
  const [image, setImage] = useState(null);  // image data state
  const navigate = useNavigate();      // navigation helper

  // Load image data on mount and when id changes
  useEffect(() => {
    const loadImage = async () => {
      const loadedImage = await getImageById(id);
      setImage(loadedImage);
    };
    loadImage();
  }, [id]);

  // Update image with given fields and update state
  const handleUpdate = async (fields) => {
    const updatedImage = await updateImage(id, fields);
    setImage(updatedImage);
  };

  // Delete specific text comment and update state
  const handleDeleteTextComment = async (idx) => {
    const updatedImage = await deleteTextComment(id, idx);
    setImage(updatedImage);
  };

  // Delete specific audio comment and update state
  const handleDeleteAudioComment = async (idx) => {
    const updatedImage = await deleteAudioComment(id, idx);
    setImage(updatedImage);
  };

  // Delete drawing and update state
  const handleDeleteDrawing = async () => {
    const updatedImage = await deleteDrawing(id);
    setImage(updatedImage);
  };

  // Delete entire image and navigate back to home
  const handleDeleteImage = async () => {
    await deleteImage(id);
    navigate('/');
  };

  if (!image) return <div>Loading...</div>;

  return (
    <ImageDetail
      image={image}
      onDrawingSave={(drawing) => handleUpdate({ drawing })}
      onAudioCommentSave={(audioUrl) => handleUpdate({
        audioComments: [...(image.audioComments || []), audioUrl]
      })}
      onTextCommentSave={(text) => handleUpdate({
        textComments: [...(image.textComments || []), text]
      })}
      onDeleteTextComment={handleDeleteTextComment}
      onDeleteAudioComment={handleDeleteAudioComment}
      onDeleteDrawing={handleDeleteDrawing}
      onDeleteImage={handleDeleteImage}
    />
  );
}

export default ImageView;