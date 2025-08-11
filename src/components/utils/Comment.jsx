import React, { useEffect, useState } from 'react';
import axiosInstance from '../helper/axiosInstance';
import { format } from 'date-fns';
import { useSelector } from 'react-redux'
function Comment({ quesId }) {
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState([]);
    const [content, setContent] = useState('');
    const [commentType, setCommentType] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { userId } = useSelector((state) => state?.login);
    const avatar = useSelector((state) => state.login.avatar);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await axiosInstance.get(`/api/problem/fetch-comment?quesId=${quesId}&userId=${userId}`);
                setComments(response.data.comments);
                setUser(response.data.userData);
            } catch (error) {
                setError('Failed to load comments. Please try again later.');
                console.error('Error fetching comments:', error);
            }
        };
        fetchComment();
    }, [comments]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/api/problem/add-comment', {
                content,
                commentType,
                quesId,
                author: userId
            });

            setComments([response.data, ...comments]);
            setContent('');
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4'>Discussion</h2>

            {/* Comment Form */}
            <div className='mb-8'>
                <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0'>
                        <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={user?.avatar}
                            alt="User avatar"
                        />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <form onSubmit={handleSubmitComment} className='relative'>
                            <textarea
                                rows={3}
                                className='block w-full px-4 py-3 text-sm text-gray-900 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:placeholder-gray-400'
                                placeholder='Share your thoughts...'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                            )}
                            <div className='flex justify-between items-center mt-2'>
                                <div className='flex space-x-2 items-center'>
                                    <button
                                        type='button'
                                        className='p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
                                        aria-label="Attach file"
                                    >
                                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd'></path>
                                        </svg>
                                    </button>
                                    <button
                                        type='button'
                                        className='p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
                                        aria-label="Add emoji"
                                    >
                                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z' clipRule='evenodd'></path>
                                        </svg>
                                    </button>
                                    <select
                                        name="commentType"
                                        id="commentType"
                                        onChange={(e) => setCommentType(e.target.value)}
                                        value={commentType}
                                        className='text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1'
                                    >
                                        {["general", "difficulty", "approach", "issue", "feedback"].map((option) => (
                                            <option value={option} key={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type='submit'
                                    disabled={isSubmitting || !content?.trim()}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-4 focus:outline-none ${isSubmitting || !content?.trim()
                                        ? 'bg-blue-400 dark:bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800'
                                        }`}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className='space-y-6'>
                {comments?.length > 0 ? (
                    comments?.map((comment) => (
                        <div key={comment?._id} className='flex space-x-3'>
                            <div className='flex-shrink-0'>
                                <img
                                    className='h-10 w-10 rounded-full object-cover'
                                    src={comment?.author?.avatar || '/default-avatar.png'}
                                    alt="User avatar"
                                />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                            {comment?.author?.name || 'Anonymous'}
                                        </span>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {comment?.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a') : 'Just now'}
                                        </span>
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            {comment?.type || 'general'}
                                        </span>
                                    </div>
                                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap'>
                                        {comment?.content}
                                    </p>
                                    <div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
                                        <button
                                            className='flex items-center space-x-1 hover:text-blue-500'
                                            aria-label="Like comment"
                                        >
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'></path>
                                            </svg>
                                            <span>{comment?.likes?.length || 0}</span>
                                        </button>
                                        <button className='hover:text-blue-500'>Reply</button>
                                        <button className='hover:text-blue-500'>Share</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-8'>
                        <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path>
                        </svg>
                        <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No comments yet</h3>
                        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Be the first to share what you think!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;