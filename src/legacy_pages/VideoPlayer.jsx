'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router';
import {
  FiArrowLeft,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiCheck,
  FiClock,
  FiMaximize,
  FiMinimize,
  FiVolume2,
  FiVolumeX,
  FiRotateCcw,
  FiRotateCw,
  FiSkipBack,
  FiSkipForward,
  FiSettings,
  FiSearch,
  FiList,
  FiLock,
  FiBookOpen,
  FiInfo,
  FiTv,
  FiCheckSquare,
  FiSquare,
  FiExternalLink,
  FiShare2,
  FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../components/helper/axiosInstance';
import {
  setPlaybackSession,
  setCurrentLessonIndex,
  toggleLessonComplete,
  markLessonComplete,
  setAutoPlayNext,
  setPlaybackSpeed
} from '../store/slice/videoSlice';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const {
    videoUrl,
    currentLessonIndex,
    currentLesson,
    courseId,
    courseTitle,
    courseType,
    lessons = [],
    completedLessons = [],
    autoPlayNext = true,
    playbackSpeed = 1
  } = useSelector((state) => state.video);

  const userId = useSelector((state) => state.login.userId);

  // Component state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // URL query params
  const searchParams = new URLSearchParams(location.search);
  const paramCourseId = searchParams.get('courseId') || courseId;
  const paramLessonIndex = searchParams.get('lessonIndex');

  // Fallback: If page refreshed and Redux lessons are empty, fetch from API
  useEffect(() => {
    const fetchCourseIfMissing = async () => {
      if (paramCourseId && (!lessons || lessons.length === 0)) {
        try {
          const res = await axiosInstance.get(
            `/api/get-detailed-tutorial?id=${paramCourseId}&type=${courseType || 'tutorial'}`
          );
          const courseData = res.data;
          const courseLessons = courseData.lessons || courseData.tutorials || [];
          const targetIndex = paramLessonIndex !== null ? parseInt(paramLessonIndex, 10) : 0;
          const safeIndex = isNaN(targetIndex) || targetIndex < 0 ? 0 : Math.min(targetIndex, courseLessons.length - 1);
          const targetLesson = courseLessons[safeIndex] || null;

          dispatch(
            setPlaybackSession({
              courseId: courseData._id,
              courseTitle: courseData.title,
              courseImage: courseData.image?.url || '',
              courseType: courseData.type || 'tutorial',
              lessons: courseLessons,
              currentLessonIndex: safeIndex,
              currentLesson: targetLesson,
              videoUrl: targetLesson?.videoUrl || null
            })
          );
        } catch (err) {
          console.error('Failed to restore course session:', err);
        }
      }
    };

    fetchCourseIfMissing();
  }, [paramCourseId, lessons, courseType, paramLessonIndex, dispatch]);

  // Sync current index if param changes
  useEffect(() => {
    if (paramLessonIndex !== null && lessons.length > 0) {
      const idx = parseInt(paramLessonIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < lessons.length && idx !== currentLessonIndex) {
        dispatch(setCurrentLessonIndex(idx));
      }
    }
  }, [paramLessonIndex, lessons, currentLessonIndex, dispatch]);

  // Determine if video is YouTube
  const youtubeData = useMemo(() => {
    if (!videoUrl) return { isYouTube: false, id: null };
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (youtubeRegex.test(videoUrl)) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = videoUrl.match(regExp);
      const id = match && match[7].length === 11 ? match[7] : null;
      return { isYouTube: true, id };
    }
    return { isYouTube: false, id: null };
  }, [videoUrl]);

  // Reset controls timer on interaction
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  }, [isPlaying]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current || youtubeData.isYouTube) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Play error:', err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  }, [youtubeData.isYouTube, resetControlsTimer]);

  // Navigation handlers
  const handleNextLesson = useCallback(() => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextIdx = currentLessonIndex + 1;
      dispatch(setCurrentLessonIndex(nextIdx));
      navigate(`/video?courseId=${courseId}&lessonIndex=${nextIdx}`, { replace: true });
      setIsAutoAdvancing(false);
      toast.success(`Playing Lesson ${nextIdx + 1}: ${lessons[nextIdx]?.title}`);
    } else {
      toast.success('🎉 You have reached the end of the course! Congratulations!');
      setIsAutoAdvancing(false);
    }
  }, [currentLessonIndex, lessons, courseId, dispatch, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      const prevIdx = currentLessonIndex - 1;
      dispatch(setCurrentLessonIndex(prevIdx));
      navigate(`/video?courseId=${courseId}&lessonIndex=${prevIdx}`, { replace: true });
    }
  }, [currentLessonIndex, courseId, dispatch, navigate]);

  const handleSelectLesson = (idx) => {
    dispatch(setCurrentLessonIndex(idx));
    navigate(`/video?courseId=${courseId}&lessonIndex=${idx}`, { replace: true });
    setShowMobileSidebar(false);
  };

  // Video playback speed
  const handleSpeedChange = (speed) => {
    dispatch(setPlaybackSpeed(speed));
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    toast.success(`Speed set to ${speed}x`);
  };

  // Time & seek
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current || youtubeData.isYouTube) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    resetControlsTimer();
  };

  const handleSkip = (seconds) => {
    if (!videoRef.current || youtubeData.isYouTube) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds)
    );
    setCurrentTime(videoRef.current.currentTime);
    resetControlsTimer();
  };

  // Volume
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
    resetControlsTimer();
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      } else if (playerContainerRef.current.webkitRequestFullscreen) {
        playerContainerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Video End / Auto-advance
  const handleVideoEnded = () => {
    setIsPlaying(false);
    dispatch(markLessonComplete(currentLessonIndex));

    if (autoPlayNext && currentLessonIndex < lessons.length - 1) {
      setIsAutoAdvancing(true);
      const timer = setTimeout(() => {
        handleNextLesson();
      }, 3500);
      setAutoAdvanceTimer(timer);
    }
  };

  const cancelAutoAdvance = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setIsAutoAdvancing(false);
  };

  // Toggle completion
  const handleToggleComplete = (idx) => {
    dispatch(toggleLessonComplete(idx));
    const wasCompleted = completedLessons.includes(idx);
    if (!wasCompleted) {
      toast.success('Lesson marked as completed! 🚀');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handleNextLesson();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handlePrevLesson();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleNextLesson, handlePrevLesson]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sidebar filtered lessons
  const filteredPlaylist = useMemo(() => {
    if (!sidebarSearch.trim()) return lessons;
    const q = sidebarSearch.toLowerCase();
    return lessons.filter(
      (l, i) =>
        (l.title && l.title.toLowerCase().includes(q)) ||
        `lesson ${i + 1}`.includes(q)
    );
  }, [lessons, sidebarSearch]);

  const completedCount = lessons.filter((_, i) => completedLessons.includes(i)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const activeLesson = lessons[currentLessonIndex] || currentLesson;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Navigation Bar - Light: White/Amber border | Dark: Charcoal/Golden */}
      <header className="bg-white dark:bg-gray-900 border-b border-amber-200/80 dark:border-gray-800 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs dark:shadow-none">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          {/* Back & Breadcrumb */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <Link
              to={courseId ? `/tutorial-page?id=${courseId}&type=${courseType || 'tutorial'}` : '/tutorial'}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white border border-amber-200 dark:border-gray-700 transition flex items-center space-x-2 flex-shrink-0"
              title="Return to Course Page"
            >
              <FiArrowLeft className="text-lg" />
              <span className="hidden sm:inline text-xs font-bold">Course Detail</span>
            </Link>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 truncate">
                  {courseTitle || 'CoderHaveli Lecture'}
                </span>
                <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline font-medium">
                  Lesson {currentLessonIndex + 1} of {lessons.length || 1}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate max-w-md lg:max-w-xl">
                {activeLesson?.title || 'Video Player'}
              </h2>
            </div>
          </div>

          {/* Player Top Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Auto-play toggle */}
            <button
              onClick={() => {
                dispatch(setAutoPlayNext(!autoPlayNext));
                toast.success(`Autoplay next: ${!autoPlayNext ? 'ON' : 'OFF'}`);
              }}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                autoPlayNext
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60'
                  : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
              }`}
              title="Toggle automatic playback of next lecture"
            >
              <span className={`w-2 h-2 rounded-full ${autoPlayNext ? 'bg-amber-500 dark:bg-amber-400 animate-pulse' : 'bg-gray-400'}`} />
              <span>Autoplay {autoPlayNext ? 'ON' : 'OFF'}</span>
            </button>

            {/* Theater Mode toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`p-2 rounded-xl border transition hidden lg:flex items-center justify-center ${
                isTheaterMode
                  ? 'bg-amber-500 text-white border-amber-400 dark:bg-amber-500 dark:text-white dark:border-amber-400'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
              title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
            >
              <FiTv className="text-base" />
            </button>

            {/* Mobile Playlist Drawer Button */}
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white transition flex items-center space-x-1 text-xs font-bold shadow-xs"
            >
              <FiList className="text-base" />
              <span>Lessons ({completedCount}/{lessons.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Learning Arena Layout */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Lesson Info */}
        <div className={isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'}>
          {/* Video Container Card - Cinema Black */}
          <div
            ref={playerContainerRef}
            onMouseMove={resetControlsTimer}
            className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group select-none ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'aspect-video'
            }`}
          >
            {/* Auto-advance banner overlay */}
            {isAutoAdvancing && (
              <div className="absolute inset-0 bg-black/85 z-40 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full border-4 border-amber-500 dark:border-amber-400 border-t-transparent animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Next Lecture Up In A Moment...</h3>
                <p className="text-sm text-gray-300 mb-6 max-w-md truncate">
                  {lessons[currentLessonIndex + 1]?.title || 'Next Lecture'}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={cancelAutoAdvance}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextLesson}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white transition flex items-center space-x-2"
                  >
                    <span>Play Now</span>
                    <FiSkipForward />
                  </button>
                </div>
              </div>
            )}

            {/* Video Playback Display */}
            {youtubeData.isYouTube && youtubeData.id ? (
              <div className="w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeData.id}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Lecture Video Player"
                />
              </div>
            ) : videoUrl ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onEnded={handleVideoEnded}
                  onLoadedMetadata={handleTimeUpdate}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                  playsInline
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>

                {/* Buffering Indicator */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 pointer-events-none">
                    <div className="w-14 h-14 border-4 border-amber-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Big Center Play/Pause Ripple Overlay on Pause */}
                {!isPlaying && !isBuffering && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-amber-500/90 dark:bg-amber-500/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition duration-200">
                      <FiPlay className="text-3xl ml-1 fill-current" />
                    </div>
                  </div>
                )}

                {/* Custom HTML5 Video Controls Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 z-30 ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Seek Bar */}
                  <div className="mb-3 group/timeline relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={duration > 0 ? (currentTime / duration) * 100 : 0}
                      onChange={handleSeek}
                      className="w-full h-1.5 hover:h-2.5 bg-gray-700/80 rounded-lg appearance-none cursor-pointer transition-all duration-150 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 dark:[&::-webkit-slider-thumb]:bg-amber-400 hover:[&::-webkit-slider-thumb]:scale-125"
                    />
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-amber-400 dark:hover:text-amber-400 transition"
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                      >
                        {isPlaying ? <FiPause className="text-2xl" /> : <FiPlay className="text-2xl fill-current" />}
                      </button>

                      {/* Prev Lecture */}
                      <button
                        onClick={handlePrevLesson}
                        disabled={currentLessonIndex === 0}
                        className={`text-white transition ${
                          currentLessonIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-amber-400 dark:hover:text-amber-400'
                        }`}
                        title="Previous Lecture (P)"
                      >
                        <FiSkipBack className="text-xl" />
                      </button>

                      {/* Rewind 10s */}
                      <button
                        onClick={() => handleSkip(-10)}
                        className="text-gray-300 hover:text-white transition hidden sm:block"
                        title="Rewind 10 seconds (←)"
                      >
                        <FiRotateCcw className="text-lg" />
                      </button>

                      {/* Forward 10s */}
                      <button
                        onClick={() => handleSkip(10)}
                        className="text-gray-300 hover:text-white transition hidden sm:block"
                        title="Forward 10 seconds (→)"
                      >
                        <FiRotateCw className="text-lg" />
                      </button>

                      {/* Next Lecture */}
                      <button
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex >= lessons.length - 1}
                        className={`text-white transition ${
                          currentLessonIndex >= lessons.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:text-amber-400 dark:hover:text-amber-400'
                        }`}
                        title="Next Lecture (N)"
                      >
                        <FiSkipForward className="text-xl" />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center space-x-2 group/vol">
                        <button
                          onClick={toggleMute}
                          className="text-gray-300 hover:text-white transition"
                          title="Mute / Unmute (M)"
                        >
                          {isMuted || volume === 0 ? (
                            <FiVolumeX className="text-xl text-rose-400" />
                          ) : (
                            <FiVolume2 className="text-xl" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-16 sm:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 dark:[&::-webkit-slider-thumb]:bg-amber-400"
                        />
                      </div>

                      {/* Time display */}
                      <div className="text-xs font-mono text-gray-300 select-none">
                        <span>{formatTime(currentTime)}</span>
                        <span className="mx-1 text-gray-500">/</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-3">
                      {/* Playback speed selector */}
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 transition"
                          title="Playback Speed"
                        >
                          {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-9 right-0 bg-gray-900 border border-gray-700 rounded-xl py-1 shadow-2xl z-50 min-w-[80px]">
                            {SPEED_OPTIONS.map((spd) => (
                              <button
                                key={spd}
                                onClick={() => handleSpeedChange(spd)}
                                className={`w-full px-3 py-1.5 text-xs text-left transition font-semibold ${
                                  playbackSpeed === spd
                                    ? 'bg-amber-500 dark:bg-amber-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="text-gray-300 hover:text-white transition"
                        title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                      >
                        {isFullscreen ? <FiMinimize className="text-xl" /> : <FiMaximize className="text-xl" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <FiTv className="text-6xl text-gray-600 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-2">No Lecture Selected</h3>
                <p className="text-sm text-gray-400 max-w-sm mb-6">
                  Select a lecture from the curriculum playlist on the right to start watching.
                </p>
                <Link
                  to={courseId ? `/tutorial-page?id=${courseId}&type=${courseType || 'tutorial'}` : '/tutorial'}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white shadow-lg transition"
                >
                  Browse Course Curriculum
                </Link>
              </div>
            )}
          </div>

          {/* Action Header Below Player - Light: White/Amber | Dark: Charcoal/Golden */}
          <div className="mt-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-amber-200/80 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/50">
                    Lecture {currentLessonIndex + 1}
                  </span>
                  {activeLesson?.duration && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center font-medium">
                      <FiClock className="mr-1 text-amber-600 dark:text-amber-400" />
                      {activeLesson.duration} min
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {activeLesson?.title || 'Interactive Lesson'}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Complete Button */}
                <button
                  onClick={() => handleToggleComplete(currentLessonIndex)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
                    completedLessons.includes(currentLessonIndex)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700'
                  }`}
                >
                  <FiCheck className="text-base font-black" />
                  <span>
                    {completedLessons.includes(currentLessonIndex) ? 'Completed ✓' : 'Mark as Done'}
                  </span>
                </button>

                {/* Quick Next/Prev */}
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    currentLessonIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-gray-400 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                      : 'bg-white hover:bg-amber-50 text-gray-700 border-amber-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-700'
                  }`}
                  title="Previous Lesson"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex >= lessons.length - 1}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 shadow-md transition flex items-center space-x-1 ${
                    currentLessonIndex >= lessons.length - 1
                      ? 'opacity-40 cursor-not-allowed bg-gray-400 dark:bg-gray-800 text-gray-200 dark:text-gray-500'
                      : ''
                  }`}
                >
                  <span>Next Lesson</span>
                  <FiSkipForward className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Info & Resources Below Player */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-amber-200/80 dark:border-gray-800 p-6 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 space-x-6 pb-3 mb-6">
              {[
                { id: 'notes', label: 'Lecture Notes & Details', icon: FiBookOpen },
                { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: FiInfo },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`font-bold text-sm flex items-center space-x-2 pb-1 border-b-2 transition ${
                      isActive
                        ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                        : 'border-transparent text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lecture Overview</h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {activeLesson?.description ||
                    activeLesson?.content ||
                    'In this lecture, you will explore comprehensive key concepts, implement practical patterns, and review modern code architectures.'}
                </p>

                {activeLesson?.content && activeLesson?.description && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 dark:bg-gray-950/70 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 mb-2">Detailed Notes</h4>
                    <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {activeLesson.content}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Shortcuts */}
            {activeTab === 'shortcuts' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Player Hotkeys</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'Space', desc: 'Play / Pause Video' },
                    { key: '←', desc: 'Rewind 10 Seconds' },
                    { key: '→', desc: 'Fast Forward 10 Seconds' },
                    { key: 'M', desc: 'Mute / Unmute Audio' },
                    { key: 'F', desc: 'Toggle Fullscreen Mode' },
                    { key: 'N', desc: 'Jump to Next Lesson' },
                    { key: 'P', desc: 'Jump to Previous Lesson' },
                  ].map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-xl bg-amber-50/60 dark:bg-gray-950 border border-amber-200/70 dark:border-gray-800"
                    >
                      <kbd className="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-amber-300 dark:border-gray-700 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 mr-3 shadow-inner">
                        {sc.key}
                      </kbd>
                      <span className="text-xs text-gray-800 dark:text-gray-300 font-medium">{sc.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Playlist Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 ${
            isTheaterMode ? 'hidden' : 'block'
          } ${
            showMobileSidebar
              ? 'fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 p-4 shadow-2xl flex flex-col border-l border-amber-200 dark:border-gray-800'
              : 'hidden lg:block'
          }`}
        >
          {/* Mobile close button */}
          {showMobileSidebar && (
            <div className="lg:hidden flex items-center justify-between pb-3 border-b border-amber-100 dark:border-gray-800 mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Course Curriculum</h3>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-8 h-8 rounded-full bg-amber-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sticky Container */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-amber-200/80 dark:border-gray-800 p-5 shadow-sm sticky top-20 max-h-[calc(100vh-6.5rem)] flex flex-col">
            {/* Playlist Header */}
            <div className="pb-4 border-b border-amber-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Course Curriculum</h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-400 px-2.5 py-0.5 rounded-full dark:border-amber-700/40">
                  {progressPercent}% Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{completedCount} of {lessons.length} finished</span>
                <span>{lessons.length} total lectures</span>
              </div>

              {/* Search */}
              <div className="mt-3 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Filter lectures..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200 dark:focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Scrollable Playlist List */}
            <div className="overflow-y-auto flex-1 mt-3 space-y-1.5 pr-1 scrollbar-thin">
              {filteredPlaylist.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No matching lessons found.
                </div>
              ) : (
                filteredPlaylist.map((lesson, idx) => {
                  const isActive = idx === currentLessonIndex;
                  const isCompleted = completedLessons.includes(idx);

                  return (
                    <div
                      key={idx}
                      className={`group p-3 rounded-xl transition duration-150 flex items-start space-x-3 cursor-pointer ${
                        isActive
                          ? 'bg-amber-100/70 border border-amber-400 text-amber-950 shadow-xs dark:bg-amber-500/20 dark:border-amber-500/50 dark:text-white'
                          : 'hover:bg-amber-50/70 border border-transparent text-gray-700 dark:hover:bg-gray-800/60 dark:text-gray-300'
                      }`}
                      onClick={() => handleSelectLesson(idx)}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(idx);
                        }}
                        className="mt-0.5 text-gray-400 hover:text-emerald-500 transition flex-shrink-0"
                        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {isCompleted ? (
                          <FiCheckSquare className="text-emerald-600 dark:text-emerald-400 text-base font-black" />
                        ) : (
                          <FiSquare className="text-gray-400 dark:text-gray-500 text-base" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isActive ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500'
                            }`}
                          >
                            Lesson {idx + 1}
                          </span>
                          {lesson.duration && (
                            <span className="text-[10px] text-gray-500 font-mono">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-xs font-semibold line-clamp-2 leading-snug ${
                            isActive ? 'text-amber-950 dark:text-white font-bold' : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {lesson.title}
                        </h4>
                      </div>

                      {/* Active Indicator or Play Icon */}
                      <div className="flex-shrink-0 pt-0.5">
                        {isActive ? (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 dark:bg-amber-500"></span>
                          </span>
                        ) : (
                          <FiPlay className="text-gray-400 group-hover:text-amber-600 dark:group-hover:text-gray-400 text-xs transition" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default VideoPlayer;