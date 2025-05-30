import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImages } from '../services/storage'; // get stored images

function Home() {
  const [recentImages, setRecentImages] = useState([]); // latest 4 images state
  const [loading, setLoading] = useState(true);         // loading indicator

  // Load images on component mount
  useEffect(() => {
    async function loadImages() {
      const images = await getImages();
      if (images && images.length > 0) {
        setRecentImages(images.slice(-4).reverse()); // get last 4 images newest first
      }
      setLoading(false);
    }
    loadImages();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home">
      <h1>Welcome!</h1>
      <section className="recent-images">
        <h2>Recent images</h2>
        <div className="image-grid">
          {recentImages.length === 0 ? (
            <p>No recent images.</p>  // show message if no images
          ) : (
            recentImages.map(image => (
              <Link to={`/image/${image.id}`} key={image.id}>
                <img src={image.url} alt={image.description} className="thumb" />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
