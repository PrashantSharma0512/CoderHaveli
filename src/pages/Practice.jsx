import React, { Fragment, useEffect, useState } from 'react';
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
  useToast
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
  const previousSolutions = [
    {
      mode: 'python',
      code: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
      status: 'wrong'
    },
  ];

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const [problemRes, editorialRes, submissionRes] = await Promise.all([
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

  if (loading) return <Loading />;

  const problem = problemList[0] || {};
  const sortedEditorial = editorialData;

  // Function to safely render MathJax content
  const renderMathJax = (content) => {
    if (!content) return null;
    return <MathJax>{content}</MathJax>;
  };

  // Function to render inline MathJax content
  const renderInlineMathJax = (content) => {
    if (!content) return null;
    return <MathJax inline>{`\\(${content}\\)`}</MathJax>;
  };
  const comments = [1]
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
      <div className='flex flex-col md:flex-row w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden'>
        {/* Problem Description Panel */}
        <div className='w-full md:w-2/5 overflow-hidden border-r border-gray-200 dark:border-gray-700'>
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
                  className='flex items-center gap-2 py-4 px-6 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors'
                >
                  {tab.icon}
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels className='h-[calc(100vh-56px)] overflow-y-auto' style={{
              overflowY: 'auto', scrollbarWidth: 'thin', msOverflowStyle: 'none'
            }}>
              {/* Description Tab */}
              <TabPanel className='p-6 space-y-6' >
                <div className='flex justify-between items-center'>
                  <h1 className='text-2xl font-bold flex items-center gap-2 arithmatex justify-center'>
                    <button onClick={() => window.history.back()} className='cursor-pointer'><IoIosArrowRoundBack size={35} /></button>
                    {problem.quesId}.&nbsp;
                    {problem.quesName}
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
                  <button className='flex items-center gap-2 cursor-pointer px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200' >
                    <HiOutlineLightBulb size={16} className='text-amber-600 dark:text-indigo-400' />
                    Hints
                  </button>
                  <button className='flex items-center gap-2 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200'>
                    <FaTag size={16} className='text-amber-600 dark:text-indigo-400' />
                    Topics
                  </button>
                </div>

                <div className='prose prose-gray dark:prose-invert max-w-none'>
                  {renderMathJax(problem.quesDesc)}
                </div>

                {problem.problemExample?.map((exmp, i) => (
                  <div key={i} className='bg-zinc-100 dark:bg-gray-800 p-4 rounded-lg'>
                    <h3 className='text-lg font-medium mb-2'>Example {i + 1}</h3>
                    <div className='space-y-2'>
                      <p><span className='font-semibold arithmatex'>Input:</span> {exmp.input}</p>
                      <p><span className='font-semibold arithmatex'>Output:</span> {exmp.output}</p>
                      {exmp.explaination && (
                        <p>
                          <span className='font-semibold'>Explanation:</span>
                          <span className='arithmatex'>
                            {exmp.explaination}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className='text-lg font-medium mb-2'>Constraints</h3>
                    <ul className='list-disc pl-5 space-y-1'>
                      {problem.constraints.map((c, i) => (
                        <li className='arthimatex' key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {problem.tags?.length > 0 && (
                  <div>
                    <h3 className='text-lg font-medium mb-2'>Topics</h3>
                    <div className='flex flex-wrap gap-2'>
                      {problem.tags.map((tag, i) => (
                        <span key={i} className='px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>
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
                          <AccordionButton className='flex justify-between items-center p-3 bg-zinc-100 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                            <div className='flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                              <RiLightbulbLine size={18} className='text-amber-600 dark:text-indigo-400' />
                              <span>Hint {i + 1}</span>
                            </div>
                            <AccordionIcon className='text-gray-500 dark:text-gray-400' />
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
              <TabPanel className='p-6 space-y-6'>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Editorial</h2>

                {sortedEditorial[0]?.videoUrl && (
                  <div className='aspect-w-16 aspect-h-9'>
                    <iframe
                      className='w-full rounded-lg shadow-md'
                      height='400'
                      src={sortedEditorial[0].videoUrl}
                      title='Solution Video'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                    />
                  </div>
                )}

                {sortedEditorial.map((approach, i) => (
                  <div key={approach._id} className='bg-zinc-100 dark:bg-gray-800 p-4 rounded-lg space-y-4 shadow-sm'>
                    <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                      Approach {i + 1}: {approach.approachType}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300'>{approach.approachDesc}</p>

                    <CodeDisplay
                      code={approach.code}
                      language={approach.language || 'python'}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-300'>Time Complexity:</h4>
                        <div className='text-gray-600 dark:text-gray-400'>
                          {renderInlineMathJax(approach.time_complexity)}
                        </div>
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-700 dark:text-gray-300'>Space Complexity:</h4>
                        <div className='text-gray-600 dark:text-gray-400'>
                          {renderInlineMathJax(approach.space_complexity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabPanel>

              {/* Submissions Tab */}
              <TabPanel>
                <Submission quesId={problem.quesId} />
              </TabPanel>

              {/* Comments Tab */}
              <TabPanel>
                <Comment quesId={problem.quesId} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        {/* Compiler Panel */}
        <div className='w-full md:w-3/5 border-l border-gray-200 dark:border-gray-700'>
          <Compiler testcase={testcases} quesId={problem.quesId} />
        </div>
      </div >
    </MathJaxContext >
  );
}

export default Practice;