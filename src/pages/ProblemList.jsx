import React, { useState } from "react";
import { Card, Badge, Tooltip, Box } from "@chakra-ui/react";
import { Search, SortAsc, Filter, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const questions = [
  { id: 2094, title: "Finding 3-Digit Even Numbers", difficulty: "Easy", rate: 77.1, premium: false, tags: ["Array", "Math"] },
  { id: 1, title: "Two Sum", difficulty: "Easy", rate: 55.5, premium: false, tags: ["Array", "Hash Table"] },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", rate: 45.9, premium: true, tags: ["Linked List", "Math"] },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", rate: 36.7, premium: false, tags: ["Hash Table", "String"] },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", rate: 43.5, premium: false, tags: ["Array", "Binary Search"] },
];


export default function ProblemList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === "All" || q.difficulty === activeFilter)
  );

  const difficultyFilters = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="mx-auto p-6 bg-gray-950 shadow-lg text-white ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Problem List</h1>
        <p className="text-gray-400">Practice coding problems to improve your skills</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="relative w-full max-w-lg">
          <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg w-full transition-all focus-within:ring-2 focus-within:ring-blue-500 border border-gray-700 hover:border-gray-600">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-white ml-2"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {/* sorting and filter button */}
        <div className="flex gap-2 w-full md:w-auto">
          <Tooltip label="Sort by difficulty">
            <button className="p-2 bg-gray-800 rounded-lg hover:bg-blue-500 transition-colors border border-gray-700">
              <SortAsc className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </Tooltip>

          <div className="relative group">
            <Tooltip label="Filter by difficulty">
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-blue-500 transition-colors border border-gray-700">
                <Filter className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </Tooltip>
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-700">
              {difficultyFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`w-full text-left px-4 py-2 text-sm ${activeFilter === filter ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Filter Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {difficultyFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter
              ? filter === "Easy"
                ? "bg-green-900 text-green-300"
                : filter === "Medium"
                  ? "bg-yellow-900 text-yellow-300"
                  : filter === "Hard"
                    ? "bg-red-900 text-red-300"
                    : "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3 h-[100vh] overflow-auto" style={{ scrollbarWidth: 'thin' }}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <Link
              key={q.id}
              className="group flex justify-between items-start p-3 rounded-xl transition-all duration-200 hover:shadow-lg border border-gray-700 hover:border-blue-500 cursor-pointer transform hover:-translate-y-1 w-[80%]"
              style={{ backgroundColor: "#1F2937" }}
              to={'/practice'}

            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg truncate hover:text-blue-400 transition-colors">
                    {q.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center ${q.difficulty === "Easy"
                      ? "bg-green-900/20 text-green-300 border border-green-800/50"
                      : q.difficulty === "Medium"
                        ? "bg-yellow-900/20 text-yellow-300 border border-yellow-800/50"
                        : "bg-red-900/20 text-red-300 border border-red-800/50"
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1.5 ${q.difficulty === "Easy"
                        ? "bg-green-400"
                        : q.difficulty === "Medium"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                        }`}
                    ></span>
                    {q.difficulty}
                  </span>

                  <div className="flex items-center text-xs text-gray-400">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.round(Math.random() * 30) + 5} mins
                  </div>

                  <div className="flex items-center">
                    <div className="relative w-16 h-1.5 bg-gray-700 rounded-full mr-2">
                      <div
                        className={`absolute h-full rounded-full ${q.rate > 70 ? "bg-green-500"
                          : q.rate > 40 ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                        style={{ width: `${q.rate}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs ${q.rate > 70 ? "text-green-400"
                        : q.rate > 40 ? "text-yellow-400"
                          : "text-red-400"
                        }`}
                    >
                      {q.rate}%
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5">
                    {q.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {q.tags?.length > 2 && (
                      <span className="text-xs text-gray-500">+{q.tags.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>

          ))
        ) : (
          <Box className="text-center p-8 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
            <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No problems found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm
                ? "Try a different search term"
                : `No ${activeFilter === "All" ? "" : activeFilter} problems available`}
            </p>
          </Box>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {filteredQuestions.length} of {questions.length} problems
      </div>
    </div>
  );
}