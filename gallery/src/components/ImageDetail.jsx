import React, { useEffect, useState } from 'react';
import DrawingCanvas from './DrawingCanvas';
import AudioComment from './AudioComment';
import TextComment from './TextComment';

function ImageDetail({
  image,
  onDrawingSave,
  onAudioCommentSave,
  onTextCommentSave,
  onDeleteTextComment,
  onDeleteAudioComment,
  onDeleteDrawing,
  onDeleteImage
}) {
  const [viewHistory, setViewHistory] = useState([]);

  useEffect(() => {
    // Load and update recently viewed images history (max 10 items)
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    const newHistory = [image, ...history.filter(item => item.id !== image.id)].slice(0, 10);
    localStorage.setItem('viewHistory', JSON.stringify(newHistory));
    setViewHistory(newHistory);
  }, [image]);

  return (
    <div className="image-detail">
      <div className="image-container">
        {/* Display main image */}
        <img src={image.url} alt={image.description} />
        <h2>{image.description || 'Untitled'}</h2>
        <p>Uploaded: {new Date(image.timestamp).toLocaleString()}</p>
        <button onClick={onDeleteImage}>Delete image</button>
      </div>

      {/* Show drawing and delete option */}
      {image.drawing && (
        <div className="drawing-section">
          <img src={image.drawing} alt="Drawing" />
          <button onClick={onDeleteDrawing}>Delete drawing</button>
        </div>
      )}

      <div className="image-tools">
        {/* Drawing canvas for adding/updating drawing */}
        <DrawingCanvas
          imageSrc={image.drawing || image.url}
          onSave={onDrawingSave}
        />

        {/* Audio comment recorder and list */}
        <AudioComment onSave={onAudioCommentSave} />
        {image.audioComments?.length > 0 && (
          <ul className="comment-list audio-comment-list">
            {image.audioComments.map((url, idx) => (
              <li key={idx} className="comment-item audio-comment-item">
                <audio controls src={url} />
                <button
                  className="comment-delete-btn"
                  onClick={() => onDeleteAudioComment(idx)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Text comment input and list */}
        <TextComment onSave={onTextCommentSave} />
        {image.textComments?.length > 0 && (
          <ul className="comment-list text-comment-list">
            {image.textComments.map((comment, idx) => (
              <li key={idx} className="comment-item text-comment-item">
                <div className="comment-content">{comment}</div>
                <button
                  className="comment-delete-btn"
                  onClick={() => onDeleteTextComment(idx)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recently viewed images thumbnails */}
      <div className="view-history">
        <h3>Recently viewed</h3>
        <div className="history-grid">
          {viewHistory.map(item => (
            <div key={item.id} className="history-item">
              <img src={item.url} alt={item.description} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageDetail;
