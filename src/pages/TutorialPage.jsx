import React, { useState, useEffect } from "react";
import TutorialCard from "../components/TutorialCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import axiosInstance from "../components/helper/axiosInstance";

const TutorialPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorialsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get('/api/get-card-data'),
          axiosInstance.get('/api/get-category')
        ]);
        
        setTutorials(tutorialsResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTutorials = tutorials.filter(tutorial => {
    // Search filter
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter - check if tutorial has a category that's selected
    const matchesCategory = selectedCategories.length === 0 || 
                          (tutorial.category && selectedCategories.includes(tutorial.category.id));
    
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 dark:border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Tutorials & Courses</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Learn new skills and advance your knowledge with our curated collection of tutorials and courses.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tutorials..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <FiFilter className="mr-2 text-gray-600 dark:text-gray-400" />
          Filters
          {selectedCategories.length > 0 && (
            <span className="ml-2 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {selectedCategories.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800 dark:text-white">Filter by Category</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category._id}  // Changed from id to _id to match typical MongoDB schema
                onClick={() => toggleCategory(category._id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedCategories.includes(category._id)
                    ? 'bg-amber-500 dark:bg-indigo-600 border-transparent text-white'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || selectedCategories.length > 0) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {searchTerm && (
            <span className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
              Search: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm("")}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {selectedCategories.map(catId => {
            const category = categories.find(c => c._id === catId);
            return category ? (
              <span key={catId} className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {category.name}
                <button 
                  onClick={() => toggleCategory(catId)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiX size={14} />
                </button>
              </span>
            ) : null;
          })}
          {(searchTerm || selectedCategories.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-amber-600 dark:text-indigo-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Tutorials Grid */}
      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTutorials.map(tutorial => (
            <TutorialCard
              key={tutorial._id}  // Changed from id to _id
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
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No tutorials found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-amber-500 dark:bg-indigo-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-indigo-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;