import React, { Fragment, useEffect, useState, useRef } from 'react';
import Compiler from '../components/Compiler/Compiler';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  useBreakpointValue
} from '@chakra-ui/react';
import { TiDocumentText } from "react-icons/ti";
import { MdOndemandVideo } from "react-icons/md";
import { RxCountdownTimer } from "react-icons/rx";
import { TfiCommentAlt } from "react-icons/tfi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";
import { RiLightbulbLine } from "react-icons/ri";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import CodeDisplay from '../components/utils/CodeDisplay';
import Submission from '../components/utils/Submission';
import axios from 'axios';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { useParams } from 'react-router';
import Loading from '../components/utils/Loading';
import { FaTag } from 'react-icons/fa6';
import { addCode, updateCode } from '../store/slice/slice';
import axiosInstance from '../components/helper/axiosInstance';
import Comment from '../components/utils/Comment';

function Practice() {
  const [solved, setSolved] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [editorialData, setEditorialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testcases, setTestcases] = useState([])
  const slug = useParams();
  const id = slug['*']
  const dispatch = useDispatch();
  const toast = useToast();
  const userId = useSelector(state => state.login.userId)
  
  // Check if mobile view
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Drag to resize state (only for desktop)
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  
  const previousSolutions = [
    {
      mode: 'python',
      code: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
      status: 'wrong'
    },
  ];

  // Load saved width from localStorage (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const savedWidth = localStorage.getItem('editor-panel-width');
      if (savedWidth) {
        setLeftPanelWidth(parseFloat(savedWidth));
      }
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const [problemRes, editorialRes] = await Promise.all([
          axiosInstance.get(`/api/problem/get-problem-by-id?id=${id}`),
          axiosInstance.get(`/api/problem/get-editorial/${id}`),
        ]);
        setProblemList(problemRes.data);
        setEditorialData(editorialRes.data.sort((a, b) => a.order - b.order));
        setTestcases(problemRes?.data[0]?.problemExample)
      } catch (err) {
        setError(err);
        toast({
          title: 'Error loading problem',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id, toast]);

  useEffect(() => {
    const isSolved = previousSolutions.some(s => s.status === 'Accepted');
    setSolved(isSolved);
    dispatch(isSolved ?
      updateCode({ id: 1, code: previousSolutions[0].code, mode: previousSolutions[0].mode }) :
      addCode({ id: 1, code: 'print(hello world!)', mode: 'python' })
    );
  }, [dispatch]);

  // Drag handlers for resizing (desktop only)
  const handleMouseDown = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || isMobile) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const percentage = (mouseX / containerRect.width) * 100;
    const newWidth = Math.min(Math.max(percentage, 20), 80);
    setLeftPanelWidth(newWidth);
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    setIsDragging(false);
    localStorage.setItem('editor-panel-width', leftPanelWidth);
  };

  const handleDoubleClick = () => {
    if (isMobile) return;
    setLeftPanelWidth(40);
    localStorage.setItem('editor-panel-width', 40);
  };

  useEffect(() => {
    if (isDragging && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isMobile]);

  if (loading) return <Loading />;

  const problem = problemList[0] || {};
  const sortedEditorial = editorialData;

  const renderMathJax = (content) => {
    if (!content) return null;
    return <MathJax>{content}</MathJax>;
  };

  const renderInlineMathJax = (content) => {
    if (!content) return null;
    return <MathJax inline>{`\\(${content}\\)`}</MathJax>;
  };
  
  return (
    <MathJaxContext
      config={{
        loader: { load: ["[tex]/html"] },
        tex: {
          packages: { "[+]": ["html"] },
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
          processEscapes: true,
          processEnvironments: true
        },
        options: {
          ignoreHtmlClass: ".*|",
          processHtmlClass: "arithmatex"
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Mobile Layout: Vertical Stack */}
        {isMobile ? (
          <div className="flex flex-col w-full">
            {/* Problem Description Panel - Full width on mobile */}
            <div className="w-full border-b border-gray-200 dark:border-gray-700">
              <ProblemDescriptionPanel 
                problem={problem}
                solved={solved}
                sortedEditorial={sortedEditorial}
                renderMathJax={renderMathJax}
                renderInlineMathJax={renderInlineMathJax}
                quesId={problem.quesId}
              />
            </div>
            
            {/* Compiler Panel - Full width on mobile */}
            <div className="w-full">
              <Compiler testcase={testcases} quesId={problem.quesId} />
            </div>
          </div>
        ) : (
          /* Desktop Layout: Horizontal Split with Resize Handle */
          <div 
            ref={containerRef}
            className='flex flex-row w-full'
            style={{ height: '100vh' }}
          >
            {/* Problem Description Panel */}
            <div 
              className='relative overflow-hidden border-r border-gray-200 dark:border-gray-700'
              style={{ 
                width: `${leftPanelWidth}%`,
                minWidth: '20%',
                maxWidth: '80%'
              }}
            >
              <ProblemDescriptionPanel 
                problem={problem}
                solved={solved}
                sortedEditorial={sortedEditorial}
                renderMathJax={renderMathJax}
                renderInlineMathJax={renderInlineMathJax}
                quesId={problem.quesId}
              />
            </div>

            {/* Resizable Drag Handle */}
            <div
              className={`
                relative w-1.5 
                bg-gray-300 dark:bg-gray-600 
                hover:bg-amber-500 dark:hover:bg-indigo-500 
                transition-all duration-150 
                cursor-col-resize 
                group
                ${isDragging ? 'bg-amber-500 dark:bg-indigo-500' : ''}
              `}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-1">
                  <div className="w-1 h-6 bg-amber-500 dark:bg-indigo-500 rounded-full"></div>
                  <div className="w-1 h-6 bg-amber-500 dark:bg-indigo-500 rounded-full"></div>
                </div>
              </div>
              {isDragging && (
                <div className="absolute inset-0 bg-amber-500 dark:bg-indigo-500 opacity-20"></div>
              )}
            </div>

            {/* Compiler Panel */}
            <div className='flex-1 min-w-0'>
              <Compiler testcase={testcases} quesId={problem.quesId} />
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
}

// Separate component for Problem Description panel to avoid code duplication
function ProblemDescriptionPanel({ problem, solved, sortedEditorial, renderMathJax, renderInlineMathJax, quesId }) {
  return (
    <Tabs variant='unstyled' isLazy>
      <TabList className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-x-auto' style={{
        overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {[
          { icon: <TiDocumentText size={20} />, label: 'Description' },
          { icon: <MdOndemandVideo size={20} />, label: 'Editorial' },
          { icon: <RxCountdownTimer size={20} />, label: 'Submissions' },
          { icon: <TfiCommentAlt size={20} />, label: 'Comments' }
        ].map((tab, index) => (
          <Tab
            key={index}
            _selected={{
              color: 'amber.600 dark:indigo.400',
              borderBottom: '2px solid',
              borderColor: 'amber.600 dark:indigo.400'
            }}
            className='flex items-center gap-2 py-4 px-6 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors text-sm md:text-base'
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Tab>
        ))}
      </TabList>

      <TabPanels className='max-h-[calc(100vh-56px)] overflow-y-auto p-4 md:p-6 space-y-6' style={{
        overflowY: 'auto', scrollbarWidth: 'thin', msOverflowStyle: 'none'
      }}>
        {/* Description Tab */}
        <TabPanel className='p-0 space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h1 className='text-xl md:text-2xl font-bold flex items-center gap-2'>
              <button onClick={() => window.history.back()} className='cursor-pointer'><IoIosArrowRoundBack size={35} /></button>
              {problem.quesId}.&nbsp;{problem.quesName}
            </h1>
            {solved && (
              <span className='flex items-center gap-2 text-green-500 dark:text-green-400'>
                <FiCheckCircle size={20} />
                Solved
              </span>
            )}
          </div>

          <div className='flex flex-wrap gap-2'>
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${problem.difficulty === 'easy' ?
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              problem.difficulty === 'medium' ?
                'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
              {problem.difficulty}
            </span>
            <button className='flex items-center gap-2 cursor-pointer px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'>
              <HiOutlineLightBulb size={16} className='text-amber-600 dark:text-indigo-400' />
              Hints
            </button>
            <button className='flex items-center gap-2 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'>
              <FaTag size={16} className='text-amber-600 dark:text-indigo-400' />
              Topics
            </button>
          </div>

          <div className='prose prose-gray dark:prose-invert max-w-none break-words'>
            {renderMathJax(problem.quesDesc)}
          </div>

          {problem.problemExample?.map((exmp, i) => (
            <div key={i} className='bg-zinc-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
              <h3 className='text-lg font-medium mb-2'>Example {i + 1}</h3>
              <div className='space-y-2'>
                <p><span className='font-semibold'>Input:</span> <code className="break-all">{exmp.input}</code></p>
                <p><span className='font-semibold'>Output:</span> <code className="break-all">{exmp.output}</code></p>
                {exmp.explaination && (
                  <p><span className='font-semibold'>Explanation:</span> {exmp.explaination}</p>
                )}
              </div>
            </div>
          ))}

          {problem.constraints?.length > 0 && (
            <div>
              <h3 className='text-lg font-medium mb-2'>Constraints</h3>
              <ul className='list-disc pl-5 space-y-1'>
                {problem.constraints.map((c, i) => (
                  <li className='break-words' key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {problem.tags?.length > 0 && (
            <div>
              <h3 className='text-lg font-medium mb-2'>Topics</h3>
              <div className='flex flex-wrap gap-2'>
                {problem.tags.map((tag, i) => (
                  <span key={i} className='px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {problem.hints?.length > 0 && (
            <div>
              <h3 className='text-lg font-medium mb-2' id='hint'>Hints</h3>
              <Accordion allowToggle>
                {problem.hints.map((hint, i) => (
                  <AccordionItem key={i} border='none' className='mb-2'>
                    <AccordionButton className='flex justify-between items-center p-3 bg-zinc-100 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <RiLightbulbLine size={18} className='text-amber-600 dark:text-indigo-400' />
                        <span>Hint {i + 1}</span>
                      </div>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} className='bg-gray-50 dark:bg-gray-800 rounded-b-lg mt-1 p-4'>
                      {renderMathJax(hint)}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </TabPanel>

        {/* Editorial Tab */}
        <TabPanel className='p-0 space-y-6'>
          <h2 className='text-2xl font-bold'>Editorial</h2>
          {sortedEditorial[0]?.videoUrl && (
            <div className='aspect-w-16 aspect-h-9'>
              <iframe
                className='w-full rounded-lg shadow-md'
                height='400'
                src={sortedEditorial[0].videoUrl}
                title='Solution Video'
                allowFullScreen
              />
            </div>
          )}
          {sortedEditorial.map((approach, i) => (
            <div key={approach._id} className='bg-zinc-100 dark:bg-gray-800 p-4 rounded-lg space-y-4'>
              <div className="flex flex-wrap items-center gap-3 text-xl font-semibold">
                <span>Approach {i + 1}: {approach.approachName}</span>
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                  {approach.approachType}
                </span>
              </div>
              <p className='text-gray-600 dark:text-gray-300'>{approach.approachDesc}</p>
              <CodeDisplay code={approach.code} language={approach.language || 'python'} />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-medium'>Time Complexity:</h4>
                  <div>{renderInlineMathJax(approach.time_complexity)}</div>
                </div>
                <div>
                  <h4 className='font-medium'>Space Complexity:</h4>
                  <div>{renderInlineMathJax(approach.space_complexity)}</div>
                </div>
              </div>
            </div>
          ))}
        </TabPanel>

        {/* Submissions Tab */}
        <TabPanel className='p-0'>
          <Submission quesId={quesId} />
        </TabPanel>

        {/* Comments Tab */}
        <TabPanel className='p-0'>
          <Comment quesId={quesId} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Practice;