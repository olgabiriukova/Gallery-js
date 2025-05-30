import React, { useState } from 'react';

function TextComment({ onSave }) {
  const [text, setText] = useState('');

  // Handle saving a trimmed comment
  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSave(trimmed);  // Call parent's onSave with comment text
      setText('');      // Clear the textarea after saving
    }
  };

  return (
    <div className="text-comment">
      <h3>Add text comment</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}  // Update local state as user types
        rows={3}
        placeholder="Type your comment..."
      />
      <button onClick={handleSave}>Save comment</button>
    </div>
  );
}

export default TextComment;
