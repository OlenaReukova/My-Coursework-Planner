import React, { memo, useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Card, CardContent, Typography } from '@mui/material';
import RemoveButton from './RemoveButton';
import VoteButtons from './VoteButtons';
import '../components/styles/VideoCard.css';

const VideoCard = memo(
  ({ video, removeVideo, upVote, downVote, votedVideos }) => {
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 } // Adjust threshold as needed
      );

      observer.observe(videoRef.current);

      return () => {
        observer.disconnect();
      };
    }, []);

    const extractVideoId = (url) => {
      const videoId = url.split('v=')[1];
      return videoId;
    };

    const opts = {
      width: '350',
      height: '300',
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    };

    const isFromAPI = video.uploadedDate ? true : false;
    const uploadedDate = isFromAPI
      ? video.uploadedDate
      : new Date().toISOString();
    const formattedDate = formatDate(uploadedDate);

    return (
      <div className='video-card-container' ref={videoRef}>
        {isVisible && (
          <Card className='video-card custom-card-class'>
            <YouTube videoId={extractVideoId(video.url)} opts={opts} />
            <CardContent className='video-details'>
              <Typography variant='h6' component='h2'>
                {video.title}
              </Typography>
              <Typography variant='subtitle2'>
                Uploaded on: {formattedDate}
              </Typography>
              <VoteButtons
                video={video}
                onUpVote={upVote}
                onDownVote={downVote}
                votedVideos={votedVideos}
              />
              <RemoveButton onClick={() => removeVideo(video.id)} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

export default VideoCard;
