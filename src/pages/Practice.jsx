import React, { useEffect, useState } from 'react'
import Compiler from '../components/Compiler/Compiler'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { TiDocumentText } from "react-icons/ti";
import { MdOndemandVideo } from "react-icons/md";
import { RxCountdownTimer } from "react-icons/rx";
import { TfiCommentAlt } from "react-icons/tfi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";
import { RiLightbulbLine } from "react-icons/ri";
import { addCode, updateCode } from '../store/slice';
import { useDispatch, useSelector } from 'react-redux'
import CodeDisplay from '../components/CodeDisplay';
import { complex } from 'framer-motion';
import Submission from '../components/Submission';
function Practice() {
  const [solved, setsolved] = useState(false)
  const dispatch = useDispatch()

  const problemList = [
    {
      questionNo: 1,
      questionName: 'Two Sum',
      questionDesc: 'Given An Array of integer nums and an integer target return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution,and you may not use the same element twice.You can return the answer in any order.',
      example: [
        {
          ExmpNo: 1,
          Input: 'nums = [2,7,11,15] , target = 9',
          Output: '[0,1]',
          explaination: 'Because nums[0] + nums[1] == 9, we run [0,1].'
        },
        {
          ExmpNo: 2,
          Input: 'nums = [3,2,4] , target = 6',
          Output: '[1,2]',
          explaination: 'Because nums[1] + nums[2] == 6, we run [1,2].'
        },

      ],
      constraints: [
        '2 <= nums.length <= 104',
        '-109 <= nums[i] <= 109',
        '-109 <= target <= 109'
      ],
      questionStatus: 'easy'
    },
    {
      questionNo: 2,
      questionName: 'Three Sum ',
      questionDesc: 'Given an array of integer nums and an integer target return indices of the three numbers such that they add up to target.You may assume that each input would have exactly one solution,and you may not use the same element twice.You can return the answer in any order.(Three Sum)',
      example: {
        ExmpNo: 1,
        Input: 'nums = [2,7,11,15,4] , target = 13',
        Output: '[0,1,4]',
        explaination: 'Because nums[0] + nums[1] + nums[4] == 13, we run [0,1,4].'

      },
      constraints: [
        '2 <= nums.length <= 104',
        '-109 <= nums[i] <= 109',
        '-109 <= target <= 109'
      ],
      questionStatus: 'medium'
    },
  ]
  const faqs = [
    { question: "Hint1", answer: "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations." },
    { question: "Hint2", answer: "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?" },
    { question: "Hint3", answer: "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?" }
  ];
  const previousSolutions = [
    { mode: 'python', code: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]', status: 'Accepted' },
  ]
  const editorialData = [
    {
      quesID: 1,
      approach: [
        {
          approachDesc: 'The brute force approach is simple. Loop through each element x and find if there is another value that equals to target - x. This approach would take O(n^2) time and O(1) space.',
          approachType: 'Brute Force',
          code: {
            python: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
            javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        throw new IllegalArgumentException("No two sum solution");\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};'
          },
          complexity: {
            Time_Complexity: 'O(n^2)',
            Space_Complexity: 'O(1)'
          }
        },
        {
          approachDesc: 'To improve on the brute force solution, we will use a hash map to store the value and its index while we are iterating through the array. This way, we can do lookups in O(1) time.',
          approachType: 'Optimized',
          code: {
            python: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        throw new IllegalArgumentException("No two sum solution");\n    }\n}',
            cpp: 'class Solution {\
            public:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};'
          },
          complexity: {
            Time_Complexity: 'O(n)',
            Space_Complexity: 'O(n)'
          }

        },
        {
          approachDesc: 'We will iterate through each element x and find if target - x is in the hash map. If it is, we have found a solution and return immediately.',
          approachType: 'Optimized',
          code: {
            python: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};',
            java: 'class Solution {\
            public:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};',
            cpp: 'class Solution {\
            public:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.find(complement) != map.end()) {\n                return { map[complement], i };\n            }\n            map[nums[i]] = i;\n        }\n        throw invalid_argument("No two sum solution");\n    }\n};'
          },
          complexity: {
            Time_Complexity: 'O(n)',
            Space_Complexity: 'O(n)'
          }

        }
      ],

    }
  ]
  useEffect(() => {
    const solved = previousSolutions.some((solution) => solution.status === 'Accepted')
    if (solved) {
      setsolved(true)
      dispatch(updateCode({ id: 1, code: previousSolutions[0].code, mode: previousSolutions[0].mode }))
    } else {
      dispatch(addCode({ id: 1, code: 'print(hello world!)', mode: 'python' }))
    }
  }, [Date.now()])


  return (
    <div className='flex w-full max-md:flex-col max-md:w-full'>
      <div className='w-2/5 max-md:w-full bg-gray-950 text-white'>
        <Tabs className="gap-3" variant={'unstyled'}>
          <TabList className='min-md:space-x-6 overflow-x-scroll justify-center'
            style={{ scrollbarWidth: 'none', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }}>
            <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className="cursor-pointer"><TiDocumentText size={25} />Description</Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className="cursor-pointer flex gap-1"><MdOndemandVideo size={20} /> Editorial</Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className='cursor-pointer flex gap-1 '><RxCountdownTimer size={20} />Submissions</Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: '600' }} className='cursor-pointer flex gap-1'><TfiCommentAlt size={20} />Comments</Tab>
          </TabList>
          <hr />
          <TabPanels>
            {/* description tab */}
            <TabPanel className='space-y-8 overflow-y-auto h-[86.7vh] px-4 w-full font-light ' style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }} >
              {/* question No ,Name , and Solve Status */}
              <ul className='flex justify-between'>
                <li className='text-xl flex gap-3 font-bold '><h1>{problemList[0].questionNo}.</h1><h1>{problemList[0].questionName}</h1></li>
                <li className='text-lg text-slate-300 font-medium capitalize'>{solved ? <div className='flex items-center gap-2'><FiCheckCircle color='#40ff00' size={25} />solved</div> : ''}</li>
              </ul>
              {/* question status eg. easy, medium, hard &  hints*/}
              <div>
                <ul className='flex gap-2 '>
                  <li>
                    <p className={`px-5 py-0.5 capitalize font-semibold ${problemList[0].questionStatus == 'easy' ? 'text-green-500' : problemList[0].questionStatus == 'medium' ? 'text-yellow-400' : 'text-red-500'} rounded-4xl text-center text-lg bg-zinc-500/40`}>
                      {problemList[0].questionStatus}
                    </p>
                  </li>
                  <li><a href={'#hint'} className='flex gap-1 items-center px-5 py-0.5 font-light rounded-4xl text-center text-lg bg-zinc-500/40'><HiOutlineLightBulb size={20} /> hints</a></li>
                </ul>
              </div>
              {/* problem description */}
              <div>
                <p className='font-light'>
                  {
                    problemList[0].questionDesc
                  }
                </p>
              </div>
              {/* Example section */}
              <div className='space-y-5'>
                {
                  problemList[0].example.map((exmp) => (
                    <div>
                      <p className='text-lg'>Example {exmp.ExmpNo} :</p>
                      <p>Input : {exmp.Input}</p>
                      <p>Output : {exmp.Output}</p>
                      <p>Explaination : {exmp.explaination}</p>
                    </div>
                  ))
                }
              </div>
              {/* constraints */}
              <ol type=''>
                <h1 className='text-lg'>Constraints : </h1>
                {
                  problemList[0].constraints.map((con) => (
                    <li>
                      ● {con}
                    </li>
                  ))
                }
              </ol>
              {/* hints tabs */}
              <div id='hint' className='space-y-5 transition-all duration-700 ease-in-out'>
                <Accordion allowToggle>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} >
                      <h2>
                        <AccordionButton className="cursor-pointer">
                          <Box as="span" flex="1" textAlign="left" className="flex gap-1 items-center font-medium">
                            <RiLightbulbLine />
                            {faq.question}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} CoderHaveli.com All rights reserved.</p>
              </div>
            </TabPanel>
            {/* editorial tab */}
            <TabPanel className='overflow-y-scroll  h-[86.7vh]  px-4 w-full font-light ' style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1A202C', scrollbarTrackColor: '#1A202C' }}>
              <center className='text-3xl'>Editorial</center>
              <br />
              <div className='flex justify-center max-w-[100%]'>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/KLlXCFG5TnA?si=yP1G1Tbbbfdujhy9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
              <br />
              <p className='px-4 font-light'>
                <div className='text-lg'>
                  {editorialData?.map((data) => (
                    <div key={data.quesID} className="space-y-5">
                      {data.approach?.map((approach, approachIndex) => (
                        <div key={approachIndex} className="space-y-2">
                          <h1 className="font-semibold">Approach {approachIndex + 1} : <span className="font-bold text-blue-500 ">{approach.approachType}</span></h1>
                          <p className="font-light pl-3">{approach.approachDesc}</p>
                          <CodeDisplay code={approach.code} />
                          <p className="font-light">
                            <strong>Time Complexity:</strong> {approach.complexity.Time_Complexity} <br />
                            <strong>Space Complexity:</strong> {approach.complexity.Space_Complexity}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </p>
            </TabPanel>
            {/* submission tab */}
            <TabPanel>
              <Submission/>
            </TabPanel>
            {/* comments tab */}
            <TabPanel>
              <p>four!</p>
            </TabPanel>

          </TabPanels>
        </Tabs>
      </div>
      <div className='w-3/5  max-md:w-full'>
        <Compiler />
      </div>
    </div>
  )
}

export default Practice