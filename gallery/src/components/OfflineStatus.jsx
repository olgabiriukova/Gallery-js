import React, { useState, useEffect } from 'react';

function OfflineStatus() {
  // Track whether the user is actually online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Verifies real internet connectivity, not just network status
  const checkInternet = () => {
    // Attempt to fetch a small known resource without using cache
    fetch('https://jsonplaceholder.typicode.com/posts/1', { cache: 'no-cache' })
      .then(() => setIsOnline(true))  // Successful fetch means we are online
      .catch(() => setIsOnline(false)); // Failure likely means no internet
  };

  useEffect(() => {
    // Initial connectivity check on mount
    checkInternet();

    // Handle browser 'online' and 'offline' events
    const updateOnlineStatus = () => {
      // If browser reports online, double-check with real fetch
      if (navigator.onLine) {
        checkInternet();
      } else {
        // If browser reports offline, trust it
        setIsOnline(false);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '0.3rem 0.8rem',
        backgroundColor: isOnline ? 'green' : 'red',
        color: 'white',
        borderRadius: '12px',
        fontWeight: 'bold',
        zIndex: 1000,
        userSelect: 'none',
      }}
      title={isOnline ? 'You are online' : 'You are offline'}
    >
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}

export default OfflineStatus;
