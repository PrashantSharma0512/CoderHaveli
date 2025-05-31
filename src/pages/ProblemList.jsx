import React, { useEffect, useState } from "react";
import { Box, Tooltip } from "@chakra-ui/react";
import { Search, SortAsc, Filter, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import Loading from "../components/Loading";

export default function ProblemList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    const fetchAllProblem = async () => {
      try {
        const response = await axios.get('/api/problem');
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProblem();
  }, []);

  const filteredQuestions = questions?.filter((q) =>
    q?.quesName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === "All" || q.difficulty === activeFilter)
  );

  const difficultyFilters = ["All", "easy", "medium", "hard"];

  if (loading) return <Loading />;

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Problem List</h1>
        <p className="text-gray-500 dark:text-gray-400">Practice coding problems to improve your skills</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="relative w-full max-w-lg">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg w-full transition-all focus-within:ring-2 focus-within:ring-amber-500 dark:focus-within:ring-indigo-500 border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-indigo-400">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 ml-2"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Sorting and filter buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Tooltip label="Sort by difficulty">
            <button 
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-amber-100 dark:hover:bg-indigo-900 transition-colors border border-gray-200 dark:border-gray-700"
              aria-label="Sort by difficulty"
            >
              <SortAsc className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </Tooltip>

          <div className="relative">
            <Tooltip label="Filter by difficulty">
              <button 
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-amber-100 dark:hover:bg-indigo-900 transition-colors border border-gray-200 dark:border-gray-700"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                aria-label="Filter by difficulty"
              >
                <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </Tooltip>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                {difficultyFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm capitalize ${activeFilter === filter 
                      ? 'bg-amber-500 dark:bg-indigo-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {difficultyFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              activeFilter === filter
                ? filter === "easy"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                  : filter === "medium"
                    ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300"
                    : filter === "hard"
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                      : "bg-amber-500 dark:bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3 h-[70vh] overflow-auto">
        {filteredQuestions?.length > 0 ? (
          filteredQuestions.map((q) => {
            const rate = (Math.random() * 100).toFixed(2);
            const timeEstimate = Math.round(Math.random() * 30) + 5;
            
            return (
              <Link
                key={q._id}
                to={`/problem/${q._id}`}
                className="group flex justify-between items-start p-4 rounded-xl transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-indigo-400 cursor-pointer bg-white dark:bg-gray-800"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg truncate text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-indigo-400 transition-colors">
                      {q.quesId}. {q.quesName}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center ${
                        q.difficulty === "easy"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50"
                          : q.difficulty === "medium"
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                            : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-1.5 ${
                          q.difficulty === "easy"
                            ? "bg-green-500"
                            : q.difficulty === "medium"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {q.difficulty}
                    </span>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {timeEstimate} mins
                    </div>

                    <div className="flex items-center">
                      <div className="relative w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                        <div
                          className={`absolute h-full rounded-full ${
                            rate > 70 
                              ? "bg-green-500" 
                              : rate > 40 
                                ? "bg-amber-500" 
                                : "bg-red-500"
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs ${
                          rate > 70 
                            ? "text-green-600 dark:text-green-400" 
                            : rate > 40 
                              ? "text-amber-600 dark:text-amber-400" 
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {rate}%
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5">
                      {q.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {q.tags?.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{q.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-indigo-400" />
              </Link>
            );
          })
        ) : (
          <Box className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <Search className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No problems found</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-1">
              {searchTerm
                ? "Try a different search term"
                : `No ${activeFilter === "All" ? "" : activeFilter} problems available`}
            </p>
          </Box>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredQuestions.length} of {questions.length} problems
      </div>
    </div>
  );
}