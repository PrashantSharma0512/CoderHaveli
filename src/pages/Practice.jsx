
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
  Tabs
} from '@chakra-ui/react';
import { TiDocumentText } from "react-icons/ti";
import { MdOndemandVideo } from "react-icons/md";
import { RxCountdownTimer } from "react-icons/rx";
import { TfiCommentAlt } from "react-icons/tfi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";
import { RiLightbulbLine } from "react-icons/ri";
import { addCode, updateCode } from '../store/slice';
import { useDispatch, useSelector } from 'react-redux';
import CodeDisplay from '../components/CodeDisplay';
import Submission from '../components/Submission';
import axios from 'axios';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { useParams } from 'react-router';
import Loading from '../components/Loading';

function Practice() {
  const [solved, setSolved] = useState(false);
  const dispatch = useDispatch();
  const [problemList, setProblemList] = useState([]);
  const slug = useParams()
  const id = slug['*']
  const [loading, setLoading] = useState(false)

  const previousSolutions = [
    {
      mode: 'python',
      code: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
      status: 'wrong'
    },
  ];

  const editorialData = [
    {
      quesID: 1,
      approach: [
        {
          approachDesc: 'The brute force approach is simple. Loop through each element \\(x\\) and find if there is another value that equals to \\(target - x\\). This approach would take \\(O(n^2)\\) time and \\(O(1)\\) space.',
          approachType: 'Brute Force',
          code: {
            python: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
            javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        throw new IllegalArgumentException("No two sum solution");\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};'
          },
          complexity: {
            Time_Complexity: '\\(O(n^2)\\)',
            Space_Complexity: '\\(O(1)\\)'
          }
        },
        {
          approachDesc: 'To improve on the brute force solution, we use a hash map to store the value and its index while iterating through the array. This reduces lookup time to \\(O(1)\\).',
          approachType: 'Optimized',
          code: {
            python: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        throw new IllegalArgumentException("No two sum solution");\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};'
          },
          complexity: {
            Time_Complexity: '\\(O(n)\\)',
            Space_Complexity: '\\(O(n)\\)'
          },

        }
      ],
      videoUrl: "https://www.youtube.com/embed/KLlXCFG5TnA?si=yP1G1Tbbbfdujhy9"
    }
  ];

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:3000/problem/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Response:', response.data);
        setLoading(false)
        setProblemList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProblem();
  }, []);

  useEffect(() => {
    const solved = previousSolutions.some((solution) => solution.status === 'Accepted');
    if (solved) {
      setSolved(true);
      dispatch(updateCode({ id: 1, code: previousSolutions[0].code, mode: previousSolutions[0].mode }));
    } else {
      dispatch(addCode({ id: 1, code: 'print(hello world!)', mode: 'python' }));
    }
  }, []);

  return (
    <Fragment>
      {
        loading ? <Loading/> :
          <MathJaxContext>
            <div className='flex w-full max-md:flex-col max-md:w-full'>
              <div className='w-2/5 max-md:w-full bg-gray-950 text-white'>
                <Tabs className="gap-3" variant={'unstyled'}>
                  <TabList className='min-md:space-x-6 overflow-x-scroll justify-center'
                    style={{ scrollbarWidth: 'none', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }}>
                    <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className="cursor-pointer">
                      <TiDocumentText size={25} />Description
                    </Tab>
                    <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className="cursor-pointer flex gap-1">
                      <MdOndemandVideo size={20} /> Editorial
                    </Tab>
                    <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className='cursor-pointer flex gap-1'>
                      <RxCountdownTimer size={20} />Submissions
                    </Tab>
                    <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className='cursor-pointer flex gap-1'>
                      <TfiCommentAlt size={20} />Comments
                    </Tab>
                  </TabList>
                  <hr />
                  <TabPanels>
                    {/* Description Tab */}
                    <TabPanel className='space-y-8 overflow-y-auto h-[86.7vh] px-4 w-full font-light'>
                      {/* question No ,Name , and Solve Status */}
                      <ul className='flex justify-between'>
                        <li className='text-xl flex gap-3 font-bold'>
                          <MathJax>{`\\(${problemList[0]?.quesId}.\\)`}</MathJax>
                          <MathJax>{problemList[0]?.quesName}</MathJax>
                        </li>
                        <li className='text-lg text-slate-300 font-medium capitalize'>
                          {solved ? (
                            <div className='flex items-center gap-2'>
                              <FiCheckCircle color='#40ff00' size={25} />solved
                            </div>
                          ) : ''}
                        </li>
                      </ul>
                      {/* question status eg. easy, medium, hard &  hints*/}
                      <div>
                        <ul className='flex gap-2'>
                          <li>
                            <p className={`px-5 py-0.5 flex font-light ${problemList[0]?.difficulty == 'easy' ? 'text-[#2FF806] bg-green-800/40' : problemList[0]?.difficulty == 'medium' ? 'text-yellow-400 bg-yellow-600/40' : 'text-[#F80709] bg-red-800/40'} rounded-4xl text-lg`}>
                              {problemList[0]?.difficulty}
                            </p>
                          </li>
                          <li>
                            <a href={'#hint'} className='flex gap-1 items-center px-5 py-0.5 font-light rounded-4xl text-center text-lg bg-zinc-500/40'>
                              <HiOutlineLightBulb size={20} /> hints
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* problem description */}
                      <MathJax dynamic>{problemList[0]?.quesDesc}</MathJax>
                      {/* Example section */}
                      <div className='space-y-5'>
                        {problemList[0]?.problemExample?.map((exmp, index) => (
                          <div key={index}>
                            <p className='text-lg'>Example :  {index + 1}</p>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Input: </span>
                                <MathJax inline>{`\\(${exmp?.input || ''}\\)`}</MathJax>
                              </div>
                              <div>
                                <span className="font-medium">Output: </span>
                                <MathJax inline>{`\\(${exmp?.output || ''}\\)`}</MathJax>
                              </div>
                              <div>
                                <span className="font-medium">Explanation: </span>
                                <MathJax inline>{`\\(${exmp?.explaination || ''}\\)`}</MathJax>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* constraints */}
                      <div>
                        <h1 className='text-lg'>Constraints:</h1>
                        <ul>
                          {problemList[0]?.constraints?.map((constraint, idx) => (
                            <li key={idx}>
                              <MathJax>{`\\(\\bullet\\) ${constraint}`}</MathJax>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* hints tabs */}
                      <div id='hint' className='space-y-5'>
                        <Accordion allowToggle>
                          {problemList[0]?.hints?.map((hint, index) => (
                            <AccordionItem key={index}>
                              <h2>
                                <AccordionButton>
                                  <Box as="span" flex="1" textAlign="left" className="flex gap-1 items-center font-medium">
                                    <RiLightbulbLine />
                                    Hint {index + 1}
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel pb={4}>
                                <MathJax>{hint}</MathJax>
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>

                      <div className="text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} CoderHaveli.com All rights reserved.</p>
                      </div>
                    </TabPanel>

                    {/* Editorial Tab */}
                    <TabPanel className='overflow-y-scroll h-[86.7vh] px-4 w-full font-light'>
                      <center className='text-3xl'>Editorial</center>
                      <br />
                      <div className='flex justify-center max-w-[100%]'>
                        <iframe
                          width="560"
                          height="315"
                          src={editorialData[0]?.videoUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen>
                        </iframe>
                      </div>
                      <br />
                      <div className='text-lg'>
                        {editorialData?.map((data) => (
                          <div key={data.quesID} className="space-y-5">
                            {data.approach?.map((approach, approachIndex) => (
                              <div key={approachIndex} className="space-y-2">
                                <h1 className="font-semibold">
                                  <MathJax>{`Approach ${approachIndex + 1}: \\(${approach.approachType}\\)`}</MathJax>
                                </h1>
                                <MathJax>{approach.approachDesc}</MathJax>
                                <CodeDisplay code={approach.code} />
                                <MathJax>
                                  {`\\[
                              \\begin{aligned}
                              &\\text{Time Complexity: } ${approach.complexity.Time_Complexity} \\\\
                              &\\text{Space Complexity: } ${approach.complexity.Space_Complexity}
                              \\end{aligned}
                            \\]`}
                                </MathJax>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </TabPanel>

                    {/* Submission Tab */}
                    <TabPanel>
                      <Submission />
                    </TabPanel>

                    {/* Comments Tab */}
                    <TabPanel>
                      <p>Comments section will be implemented here</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>

              <div className='w-3/5 max-md:w-full'>
                <Compiler />
              </div>
            </div>
          </MathJaxContext>
      }

    </Fragment>


  );
}

export default Practice;