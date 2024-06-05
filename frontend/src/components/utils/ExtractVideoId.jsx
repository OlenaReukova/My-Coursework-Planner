const ExtractVideoId = (url) => {
  let videoId = '';
  if (url.includes('youtube.com/watch')) {
    videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1];
    const questionMarkPosition = videoId.indexOf('?');
    if (questionMarkPosition !== -1) {
      videoId = videoId.substring(0, questionMarkPosition);
    }
  }
  return videoId;
};

export default ExtractVideoId;
