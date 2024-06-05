import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import './styles/VideoList.css';

const VideoList = ({ onVideoClick }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5001/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos from API!');
        }
        const jsonData = await response.json();
        setVideos(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div className='video-list-container'>
      <Typography variant='h6' className='video-list-title'>
        Video Titles
      </Typography>
      <List className='video-list'>
        {videos.map((video) => (
          <ListItem
            key={video.id}
            className='video-list-item'
            onClick={() => onVideoClick(video)}>
            <ListItemText primary={video.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default VideoList;
