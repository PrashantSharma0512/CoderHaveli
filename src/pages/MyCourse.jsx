import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../components/helper/axiosInstance'
import TutorialCard from '../components/cards/TutorialCard'
import { FiBookOpen, FiUser, FiClock, FiArrowRight, FiStar } from 'react-icons/fi'
import { Link } from 'react-router'

function MyCourse() {
    const User = useSelector(state => state.login.user)
    const [userCourse, setUserCourse] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                const response = await axiosInstance.get(`/api/get-user-course?id=${User._id}`)
                setUserCourse(response.data.courses)
            } catch (error) {
                console.error("Error fetching user courses:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserCourses()
    }, [User._id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your courses...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* User Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                            <img
                                src={User.avatar || '/default-avatar.png'}
                                alt={User.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{User.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">@{User.username}</p>
                            <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <FiBookOpen className="mr-1" />
                                <span>{userCourse.length} {userCourse.length === 1 ? 'Course' : 'Courses'} Enrolled</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Learning</h2>
                    </div>

                    {userCourse?.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                            <div className="mx-auto w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                                <FiBookOpen className="text-3xl text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You haven't enrolled in any courses yet. Explore our catalog to find courses that match your interests.
                            </p>
                            <Link
                                to="/courses"
                                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                Browse Courses
                                <FiArrowRight className="ml-2" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userCourse && userCourse?.map((course) => (
                                <div key={course._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img
                                            src={course.courseImage?.url || '/course-placeholder.jpg'}
                                            alt={course.image?.alt || course.courseDetails.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        {/* <div className="absolute top-4 right-4">
                                            <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                                {course.category?.name || 'Programming'}
                                            </span>
                                        </div> */}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {course.courseDetails.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {course.courseDetails.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <div className="flex items-center">
                                                <FiUser className="mr-1" />
                                                <span>{course.instructor?.name || 'Unknown Instructor'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span>{course.courseDetails.duration || '0'} hours</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex text-yellow-400 mr-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={i < Math.floor(course?.stats?.rating || 0) ? "fill-current" : ""}
                                                            size={14}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({course?.stats?.totalReviews || 0})
                                                </span>
                                            </div>

                                            <Link
                                                to={`/tutorial-page?id=${course.courseDetails._id}&type=tutorial`}
                                                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm"
                                            >
                                                View Course
                                                <FiArrowRight className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Progress bar (optional) */}
                                    <div className="px-5 pb-5">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: `${course.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{course.progress || 0}% Complete</span>
                                            <span>{course.completedLessons || 0}/{course.totalLessons || 0} Lessons</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyCourse