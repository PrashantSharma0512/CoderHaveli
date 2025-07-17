import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import { useState } from 'react';

const VideoPlayerComponent = ({
    url,
    light = false,
    controls = true,
    playing = false,
    width = '100%',
    height = '100%',
    thumbnail = null,
    onClose,
    className = ''
}) => {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div className={`relative ${className}`} style={{ width, height }}>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
                    aria-label="Close video player"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {hasError ? (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-center p-4">
                        <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">Failed to load video</p>
                        <button
                            onClick={() => setHasError(false)}
                            className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            ) : (
                <ReactPlayer
                    url={url}
                    width={width}
                    height={height}
                    light={light && (thumbnail || true)}
                    playing={playing}
                    controls={controls}
                    onError={handleError}
                    style={{
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                    }}
                    config={{
                        youtube: {
                            playerVars: {
                                modestbranding: 1,
                                rel: 0
                            }
                        },
                        vimeo: {
                            playerOptions: {
                                byline: false,
                                portrait: false,
                                title: false
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

VideoPlayerComponent.propTypes = {
    url: PropTypes.string.isRequired,
    light: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    controls: PropTypes.bool,
    playing: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    thumbnail: PropTypes.string,
    onClose: PropTypes.func,
    className: PropTypes.string
};

export default VideoPlayerComponent;