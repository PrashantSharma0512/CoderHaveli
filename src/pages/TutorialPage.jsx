import React, { useState, useEffect } from "react";
import TutorialCard from "../components/cards/TutorialCard";
import { FiSearch, FiFilter, FiX, FiBook, FiVideo } from "react-icons/fi";
import axiosInstance from "../components/helper/axiosInstance";
import CourseCard from "../components/cards/CourseCards";

const TutorialPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "tutorials", "courses"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorialsResponse, categoriesResponse, coursesResponse] = await Promise.all([
          axiosInstance.get('/api/get-tutorial'),
          axiosInstance.get('/api/get-category'),
          axiosInstance.get('/api/get-courses')
        ]);

        setTutorials(tutorialsResponse.data);
        setCategories(categoriesResponse.data);
        setCourseData(coursesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 ||
      (tutorial.category && selectedCategories.includes(tutorial.category.id));

    return matchesSearch && matchesCategory;
  });

  const filteredCourse = courseData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 ||
      (course.category && selectedCategories.includes(course.category.id));

    return matchesSearch && matchesCategory;
  });


  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
  };

  const getTotalResults = () => {
    switch (activeTab) {
      case "tutorials": return filteredTutorials.length;
      case "courses": return filteredCourse.length;
      default: return filteredTutorials.length + filteredCourse.length;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 dark:border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-w-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8 bg-white dark:bg-gray-900 min-h-screen">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Tutorials & Courses</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 text-lg">
            Discover comprehensive learning resources to enhance your skills and knowledge
          </p>
        </div>

        {/* Content Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: "all", label: "All", icon: null },
              { id: "tutorials", label: "Tutorials", icon: <FiVideo className="mr-2" /> },
              { id: "courses", label: "Courses", icon: <FiBook className="mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-indigo-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tutorials and courses..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 min-w-[120px]"
          >
            <FiFilter className="mr-2 text-gray-600 dark:text-gray-400" />
            Filters
            {selectedCategories.length > 0 && (
              <span className="ml-2 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getTotalResults()} results found
          </span>
          {(searchTerm || selectedCategories.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-amber-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              <FiX className="mr-1" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg">Filter by Category</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category._id}
                  onClick={() => toggleCategory(category._id)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${selectedCategories.includes(category._id)
                    ? 'bg-amber-500 dark:bg-indigo-600 border-transparent text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {selectedCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {selectedCategories.map(catId => {
              const category = categories.find(c => c._id === catId);
              return category ? (
                <span key={catId} className="flex items-center px-3 py-2 bg-amber-100 dark:bg-indigo-900 text-amber-800 dark:text-indigo-200 rounded-full text-sm">
                  {category.name}
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="ml-2 text-amber-600 dark:text-indigo-300 hover:text-amber-800 dark:hover:text-indigo-100"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Content Grid */}
        <div className="space-y-12">
          {/* Tutorials Section - Show based on active tab */}
          {(activeTab === "all" || activeTab === "tutorials") && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <FiVideo className="mr-3 text-amber-500 dark:text-indigo-400" />
                  Tutorials
                  <span className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    {filteredTutorials.length}
                  </span>
                </h2>
              </div>

              {filteredTutorials.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredTutorials.map(tutorial => (
                    <TutorialCard
                      key={tutorial._id}
                      _id={tutorial._id}
                      title={tutorial.title}
                      description={tutorial.description}
                      image={tutorial.image}
                      url={tutorial.url}
                      duration={tutorial.duration}
                      category={tutorial.category}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FiVideo className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No tutorials found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try different search terms or clear filters
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Courses Section - Show based on active tab */}
          {(activeTab === "all" || activeTab === "courses") && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <FiBook className="mr-3 text-amber-500 dark:text-indigo-400" />
                  Courses
                  <span className="ml-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    {filteredCourse.length}
                  </span>
                </h2>
              </div>

              {filteredCourse.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:gri-cols-4 gap-4 sm:gap-6">
                  {filteredCourse.map(course => (
                    console.log(course, "inside course"),

                    <CourseCard
                      _id={course._id}
                      title={course.title}
                      description={course.description}
                      imageUrl={course.image?.url}
                      price={course.price}
                      duration={course.duration}
                      category={course.category?.name}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FiBook className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try different search terms or clear filters
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>

  );
};

export default TutorialPage;