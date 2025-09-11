import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [youTubeId, setYouTubeId] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Get video URL from Redux state
  const videoUrl = useSelector((state) => state.video.videoUrl);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle video URL from Redux
  useEffect(() => {
    if (videoUrl) {
      setError('');

      // Check if it's a YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (youtubeRegex.test(videoUrl)) {
        setIsYouTube(true);
        // Extract YouTube ID
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        const id = (match && match[7].length === 11) ? match[7] : null;
        if (id) {
          setYouTubeId(id);
        } else {
          setError('Invalid YouTube URL');
        }
      } else {
        setIsYouTube(false);
        setYouTubeId('');
      }
    }
  }, [videoUrl]);

  // Handle play/pause
  const togglePlay = () => {
    if (isYouTube) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => setError('Playback failed: ' + err.message));
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  // Handle forward (10 seconds)
  const handleForward = () => {
    if (isYouTube) return;

    videoRef.current.currentTime += 10;
    setCurrentTime(videoRef.current.currentTime);
    resetControlsTimer();
  };

  // Handle backward (10 seconds)
  const handleBackward = () => {
    if (isYouTube) return;

    videoRef.current.currentTime -= 10;
    setCurrentTime(videoRef.current.currentTime);
    resetControlsTimer();
  };

  // Handle time update
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (isYouTube) return;

    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    resetControlsTimer();
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    resetControlsTimer();
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen().catch(err => {
          console.error('Fullscreen error:', err);
        });
      } else if (playerContainerRef.current.webkitRequestFullscreen) {
        playerContainerRef.current.webkitRequestFullscreen();
      } else if (playerContainerRef.current.msRequestFullscreen) {
        playerContainerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  // Handle buffering events
  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Reset controls timer
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    resetControlsTimer();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleBackward();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [volume]);

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">
        {/* <header className="mb-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-400 dark:to-indigo-500">
              Coderhaveli Video Player
            </span> <br className="hidden sm:inline" />
            <p className="text-gray-400 mt-2">Advanced video player for developers</p>
          </h2>
        </header> */}
        <header className="mb-8 text-center">
          <h1 className="text-transparent text-4xl bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-400 dark:to-indigo-500">
            CoderHaveli Video Player
          </h1>
          <p className="text-gray-400 mt-2">Advanced video player for developers</p>
        </header>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div
          ref={playerContainerRef}
          className={`relative bg-black rounded-xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
          onTouchStart={handleTouchStart}
        >
          {isYouTube && youTubeId ? (
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </div>
          ) : videoUrl ? (
            <div className="relative">
              <video
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onWaiting={handleWaiting}
                onPlaying={handlePlaying}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={handleTimeUpdate}
                onError={() => setError('Failed to load video. Please check the URL.')}
                className="w-full"
                playsInline // Important for mobile iOS
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {isBuffering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
                  <div className="w-16 h-16 border-4 border-amber-500 dark:border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Buffering...</p>
                </div>
              )}

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                onClick={togglePlay}
              ></div>

              <div
                className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 dark:[&::-webkit-slider-thumb]:bg-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="text-white hover:text-amber-400 dark:hover:text-indigo-400 transition-colors">
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>

                    {!isMobile && (
                      <>
                        <button onClick={handleBackward} className="text-white hover:text-amber-400 dark:hover:text-indigo-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                          </svg>
                        </button>

                        <button onClick={handleForward} className="text-white hover:text-amber-400 dark:hover:text-indigo-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                          </svg>
                        </button>
                      </>
                    )}

                    <div className="flex items-center space-x-2">
                      <button onClick={() => setVolume(volume > 0 ? 0 : 1)} className="text-white hover:text-amber-400 dark:hover:text-indigo-400 transition-colors">
                        {volume === 0 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l4-4m0 0l-4-4m4 4H9" />
                          </svg>
                        ) : volume > 0.5 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3v18l-4.5-4.5H4a1 1 0 01-1-1v-7a1 1 0 011-1h3.5z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9v6a1 1 0 001 1h3.5l4.5 4.5V4.5L8.5 9H5a1 1 0 00-1 1z" />
                          </svg>
                        )}
                      </button>

                      {!isMobile && (
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 dark:[&::-webkit-slider-thumb]:bg-indigo-500"
                        />
                      )}
                    </div>

                    <div className="text-sm text-gray-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-amber-400 dark:hover:text-indigo-400 transition-colors">
                      {isFullscreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V5a1 1 0 00-1-1H5a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1zM15 9V5a1 1 0 00-1-1h-3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1zM9 15v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3a1 1 0 00-1 1zM15 15v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3a1 1 0 00-1 1z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>No video selected</p>
              </div>
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-amber-600 dark:text-indigo-400">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">Space</kbd>
                <span>Play/Pause</span>
              </div>
              <div className="flex items-center">
                <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">←</kbd>
                <span>Backward 10s</span>
              </div>
              <div className="flex items-center">
                <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">→</kbd>
                <span>Forward 10s</span>
              </div>
              <div className="flex items-center">
                <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">F</kbd>
                <span>Toggle Fullscreen</span>
              </div>
              <div className="flex items-center">
                <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md mr-2">M</kbd>
                <span>Mute/Unmute</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;