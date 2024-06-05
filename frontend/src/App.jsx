import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Header from './components/Header';
import AddVideoForm from './components/AddVideoForm';
import VideoCard from './components/VideoCard';
import SortFilters from './components/SortFilters';
import Search from './components/Search';
import './App.css';
import VideoList from './components/VideoList';

function App() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votedVideos, setVotedVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5001/videos');

      if (!response.ok) {
        throw new Error('Failed to fetch videos from API!');
      }

      const jsonData = await response.json();

      const sortedVideos = jsonData.sort((a, b) => b.id - a.id);

      const updatedVideos = sortedVideos.map((video) => {
        if (!video.uploadDate) {
          return { ...video, uploadedDate: '2021-01-01T00:00:00.000Z' };
        }
        return video;
      });

      setVideos(updatedVideos);
      setLoading(false);
    } catch (error) {
      console.error('API fetch error:', error.message);
    }
  };

  const handleVideoClick = (video) => {
    const updatedVideos = [video, ...videos.filter((v) => v.id !== video.id)];
    setVideos(updatedVideos);
  };

  const addVideo = async (video) => {
    try {
      const response = await fetch('http://localhost:5001/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
      });
      if (!response.ok) {
        throw new Error('Failed to add video!');
      }
      const data = await response.json();

      if (data && data.id !== undefined) {
        const videoWithDate = { ...video, id: data.id, rating: 0 };
        setVideos([videoWithDate, ...videos]);
      } else {
        throw new Error('Invalid response from the server');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const removeVideo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/videos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Video not found!');
      }
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const upVote = async (id) => {
    if (votedVideos.includes(id)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/videos/${id}/rating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ like: true }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upvote video (ID: ${id})`);
      }
      setVideos((prevVideos) =>
        prevVideos.map((video) => {
          if (video.id === id) {
            return { ...video, rating: video.rating + 1 };
          }
          return video;
        })
      );
      setVotedVideos((prevVotedVideos) => [...prevVotedVideos, id]);
    } catch (error) {
      console.error('Upvote Error:', error);
    }
  };

  const downVote = async (id) => {
    if (votedVideos.includes(id)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/videos/${id}/rating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dislike: true }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to downvote video (ID: ${id})`);
      }
      setVideos((prevVideos) =>
        prevVideos.map((video) => {
          if (video.id === id) {
            const newRating = Math.max(0, video.rating - 1);
            return { ...video, rating: newRating };
          }
          return video;
        })
      );
      setVotedVideos((prevVotedVideos) => [...prevVotedVideos, id]);
    } catch (error) {
      console.error('Downvote Error:', error);
    }
  };

  const sortByVotes = (sortOrder) => {
    const sortedVideos = [...videos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.rating - b.rating;
      } else {
        return b.rating - a.rating;
      }
    });
    setVideos(sortedVideos);
  };

  const sortByTitle = (sortOrder) => {
    const sortedVideos = [...videos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setVideos(sortedVideos);
  };

  const searchVideos = (searchTerm) => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  const displayedVideos = filteredVideos.length > 0 ? filteredVideos : videos;

  return (
    <Container maxWidth='lg'>
      <VideoList onVideoClick={handleVideoClick} />
      <Header videos={videos} />
      <div className='App'>
        <AddVideoForm onAddVideo={addVideo} />
        <div className='video-section'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <div className='header-controls'>
                <Search onSearch={searchVideos} />
                <SortFilters
                  onSortByVotes={sortByVotes}
                  onSortByTitle={sortByTitle}
                />
              </div>
              <div className='video-list-content'>
                {displayedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    removeVideo={removeVideo}
                    upVote={upVote}
                    downVote={downVote}
                    votedVideos={votedVideos}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default App;
