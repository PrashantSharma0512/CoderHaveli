import { ProblemEditorial } from './types';

export const curatedEditorials: Record<string, ProblemEditorial> = {
  // 11. Container With Most Water
  '11': {
    quesId: 11,
    title: 'Container With Most Water',
    overview:
      'We are given an array of integers representing the heights of vertical lines. The goal is to choose two lines such that together with the x-axis, they form a container that stores the maximum possible volume of water. The area between two lines at index $i$ and $j$ is calculated as $(j - i) \\times \\min(\\text{height}[i], \\text{height}[j])$.',
    keyInsights: [
      'The width between two lines is always $j - i$.',
      'The water level is strictly constrained by the shorter of the two lines.',
      'Starting with the widest container ($i = 0, j = n - 1$) guarantees maximum width. From there, only moving the shorter line can potentially yield a larger area.'
    ],
    edgeCases: [
      'Two lines only ($n = 2$): area is just $\\min(h[0], h[1]) \\times 1$.',
      'All lines have identical heights: maximum area is formed by the first and last lines.',
      'Strictly increasing or decreasing heights.'
    ],
    comparison: [
      { name: 'Brute Force', time: '$O(n^2)$', space: '$O(1)$', verdict: 'Time Limit Exceeded on large inputs' },
      { name: 'Two Pointers (Optimal)', time: '$O(n)$', space: '$O(1)$', verdict: 'Optimal & Accepted' }
    ],
    videoUrl: 'https://www.youtube.com/embed/UuiTKBwPgAo',
    approaches: [
      {
        order: 1,
        approachName: 'Brute Force Pair Search',
        approachType: 'Brute Force',
        approachDesc:
          'Evaluate every possible pair of lines $(i, j)$ where $i < j$. Compute the area for each pair using $(j - i) \\times \\min(\\text{height}[i], \\text{height}[j])$ and maintain the maximum area found.',
        intuition:
          'By checking all $\\frac{n(n - 1)}{2}$ combinations of pairs, we are guaranteed to find the absolute maximum container. However, this exhaustive search is redundant because many pairs with smaller widths and bounded heights can be eliminated without calculation.',
        algorithm: [
          'Initialize `maxArea = 0`.',
          'Loop $i$ from $0$ to $n - 2$.',
          'Loop $j$ from $i + 1$ to $n - 1$.',
          'Calculate `currentArea = (j - i) * min(height[i], height[j])`.',
          'Update `maxArea = max(maxArea, currentArea)`.',
          'Return `maxArea`.'
        ],
        time_complexity: '$O(n^2)$',
        time_complexity_desc: 'We examine all pairs of indices $(i, j)$, which requires $\\frac{n(n-1)}{2}$ iterations.',
        space_complexity: '$O(1)$',
        space_complexity_desc: 'No extra dynamic memory or data structures are allocated.',
        code: {
          javascript: `function maxArea(height) {
    let maxWater = 0;
    const n = height.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const currentArea = Math.min(height[i], height[j]) * (j - i);
            maxWater = Math.max(maxWater, currentArea);
        }
    }
    return maxWater;
}`,
          python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        max_water = 0
        n = len(height)
        for i in range(n):
            for j in range(i + 1, n):
                current_area = min(height[i], height[j]) * (j - i)
                max_water = max(max_water, current_area)
        return max_water`,
          java: `class Solution {
    public int maxArea(int[] height) {
        int maxWater = 0;
        int n = height.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int currentArea = Math.min(height[i], height[j]) * (j - i);
                maxWater = Math.max(maxWater, currentArea);
            }
        }
        return maxWater;
    }
}`,
          cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int maxWater = 0;
        int n = height.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int currentArea = min(height[i], height[j]) * (j - i);
                maxWater = max(maxWater, currentArea);
            }
        }
        return maxWater;
    }
};`
        }
      },
      {
        order: 2,
        approachName: 'Two Pointers Greedy Shrinking',
        approachType: 'Optimised',
        approachDesc:
          'Place two pointers at the boundaries: `left = 0` and `right = height.length - 1`. In each step, calculate the area. To have any possibility of increasing the area despite the shrinking width $(right - left)$, we must increment the pointer pointing to the shorter vertical line.',
        intuition:
          'Why move the shorter line? The area is strictly limited by the shorter line: $\\text{Area} = \\min(h[left], h[right]) \\times (right - left)$. If we move the taller line, the width decreases, and the new height is still at most the shorter line. Thus, moving the taller line can NEVER produce a larger area! The only hope of a greater area is moving the shorter line inward in search of a taller line.',
        algorithm: [
          'Initialize `left = 0`, `right = height.length - 1`, and `maxWater = 0`.',
          'While `left < right`:',
          '  Calculate `h = min(height[left], height[right])`.',
          '  Update `maxWater = max(maxWater, h * (right - left))`.',
          '  If `height[left] < height[right]`, increment `left++`.',
          '  Else decrement `right--`.'
        ],
        time_complexity: '$O(n)$',
        time_complexity_desc: 'Each step moves either the left or right pointer inward by 1. The two pointers meet after at most $n - 1$ steps.',
        space_complexity: '$O(1)$',
        space_complexity_desc: 'Only pointers and primitive accumulator variables are used.',
        code: {
          javascript: `function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        
        if (area > maxWater) {
            maxWater = area;
        }

        // Move the shorter line inward
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}`,
          python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        left = 0
        right = len(height) - 1
        max_water = 0

        while left < right:
            width = right - left
            h = min(height[left], height[right])
            area = width * h
            if area > max_water:
                max_water = area
            
            # Move the pointer at the shorter bar
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1

        return max_water`,
          java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxWater = 0;

        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            int area = width * h;

            if (area > maxWater) {
                maxWater = area;
            }

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxWater;
    }
}`,
          cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0;
        int right = height.size() - 1;
        int maxWater = 0;

        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            int area = width * h;

            if (area > maxWater) {
                maxWater = area;
            }

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxWater;
    }
};`
        }
      }
    ]
  },

  // 1. Two Sum
  '1': {
    quesId: 1,
    title: 'Two Sum',
    overview:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input would have exactly one solution, and you may not use the same element twice.',
    keyInsights: [
      'For any number $x = \\text{nums}[i]$, the value needed to reach the target is $\\text{complement} = \\text{target} - x$.',
      'Using a Hash Map gives us $O(1)$ average time lookups for the complement.',
      'We can populate the hash map on the fly in a single pass without needing a separate pre-fill phase.'
    ],
    edgeCases: [
      'Negative numbers in the array.',
      'Duplicate elements adding up to target (e.g. $[3, 3]$ with target $6$).'
    ],
    comparison: [
      { name: 'Brute Force', time: '$O(n^2)$', space: '$O(1)$', verdict: 'Inefficient for $n > 10^4$' },
      { name: 'One-Pass Hash Map', time: '$O(n)$', space: '$O(n)$', verdict: 'Optimal & Standard' }
    ],
    videoUrl: 'https://www.youtube.com/embed/KLlXCFG5TnA',
    approaches: [
      {
        order: 1,
        approachName: 'Brute Force Pair Check',
        approachType: 'Brute Force',
        approachDesc: 'Iterate through all pairs $(i, j)$ with $i < j$ and check if `nums[i] + nums[j] == target`.',
        time_complexity: '$O(n^2)$',
        time_complexity_desc: 'Double loop inspecting every pair of indices.',
        space_complexity: '$O(1)$',
        space_complexity_desc: 'Constant extra memory.',
        code: {
          javascript: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
          python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
          cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`
        }
      },
      {
        order: 2,
        approachName: 'One-Pass Hash Map Lookup',
        approachType: 'Optimised',
        approachDesc:
          'Maintain a hash map storing value $\\to$ index. For each number `num` at index `i`, check if `target - num` already exists in the map. If yes, return their indices; otherwise record `map[num] = i`.',
        time_complexity: '$O(n)$',
        time_complexity_desc: 'Single pass through array with $O(1)$ average hash map lookup and insertion.',
        space_complexity: '$O(n)$',
        space_complexity_desc: 'The hash map stores up to $n$ elements in the worst case.',
        code: {
          javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
          python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
          cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`
        }
      }
    ]
  },

  // 15. 3Sum
  '15': {
    quesId: 15,
    title: '3Sum',
    overview:
      'Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` such that $i \\neq j, i \\neq k, j \\neq k$ and $\\text{nums}[i] + \\text{nums}[j] + \\text{nums}[k] == 0$. The solution set must not contain duplicate triplets.',
    keyInsights: [
      'Sorting the array upfront ($O(n \\log n)$) simplifies duplicate avoidance and enables the Two Pointers pattern.',
      'Fix the first element $\\text{nums}[i]$ and use two pointers `left` and `right` for the remaining pair sum $-\\text{nums}[i]$.',
      'Skip duplicate values of $\\text{nums}[i]$, $\\text{nums}[left]$, and $\\text{nums}[right]$ to avoid redundant triplets.'
    ],
    edgeCases: [
      'Array length less than 3: return empty list.',
      'All zeroes `[0, 0, 0, 0]`: only one valid triplet `[0, 0, 0]`.',
      'No triplet sums to 0.'
    ],
    comparison: [
      { name: 'Brute Force + Set', time: '$O(n^3)$', space: '$O(n)$', verdict: 'TLE' },
      { name: 'Sorting + Two Pointers', time: '$O(n^2)$', space: '$O(1)$ extra', verdict: 'Optimal & Standard' }
    ],
    videoUrl: 'https://www.youtube.com/embed/jzZsG8n2R9A',
    approaches: [
      {
        order: 1,
        approachName: 'Sorting + Two Pointers',
        approachType: 'Optimised',
        approachDesc:
          'Sort `nums`. Iterate $i$ from $0$ to $n - 3$. If $\\text{nums}[i] > 0$, break early (three positive numbers cannot sum to 0). Skip duplicates for $i$. Then run a two-pointer search between $i + 1$ and $n - 1$.',
        time_complexity: '$O(n^2)$',
        time_complexity_desc: 'Sorting takes $O(n \\log n)$, outer loop runs $n$ times with $O(n)$ inner two-pointer scan: $O(n^2)$ overall.',
        space_complexity: '$O(1)$ or $O(n)$',
        space_complexity_desc: 'Depends on the sort implementation memory.',
        code: {
          javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    const n = nums.length;

    for (let i = 0; i < n - 2; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = n - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
          python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        n = len(nums)
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, n - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    res.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1
        return res`,
          java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;

        for (int i = 0; i < n - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return res;
    }
}`,
          cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        int n = nums.size();

        for (int i = 0; i < n - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return res;
    }
};`
        }
      }
    ]
  },

  // 20. Valid Parentheses
  '20': {
    quesId: 20,
    title: 'Valid Parentheses',
    overview:
      'Given a string `s` containing characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order, and every close bracket must have a corresponding open bracket.',
    keyInsights: [
      'The Last-In-First-Out (LIFO) property of a Stack makes it the natural choice for matching nested delimiters.',
      'Push opening brackets onto the stack; when a closing bracket appears, check if the top of the stack matches its corresponding pair.'
    ],
    edgeCases: ['Single character string (e.g. `(`).', 'Odd length string (cannot be valid).', 'Starting with a closing bracket `)`.'],
    comparison: [{ name: 'Stack Matching', time: '$O(n)$', space: '$O(n)$', verdict: 'Optimal' }],
    videoUrl: 'https://www.youtube.com/embed/WTzjTskDFMg',
    approaches: [
      {
        order: 1,
        approachName: 'Stack Based Matching',
        approachType: 'Optimised',
        approachDesc: 'Iterate through `s`. Push matching closing brackets onto a stack when seeing an open bracket. When encountering a closing bracket, pop and ensure equality.',
        time_complexity: '$O(n)$',
        time_complexity_desc: 'Single pass over $n$ characters with $O(1)$ stack operations.',
        space_complexity: '$O(n)$',
        space_complexity_desc: 'Worst case stack contains $n$ open brackets.',
        code: {
          javascript: `function isValid(s) {
    if (s.length % 2 !== 0) return false;
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };

    for (const char of s) {
        if (map[char]) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
          python: `class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) % 2 != 0:
            return False
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
          java: `class Solution {
    public boolean isValid(String s) {
        if (s.length() % 2 != 0) return false;
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
          cpp: `class Solution {
public:
    bool isValid(string s) {
        if (s.length() % 2 != 0) return false;
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
        }
      }
    ]
  },

  // 53. Maximum Subarray
  '53': {
    quesId: 53,
    title: 'Maximum Subarray',
    overview: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    keyInsights: [
      "Kadane's Algorithm: At each index $i$, we decide whether to add $\\text{nums}[i]$ to the current running sum or restart a new subarray from $\\text{nums}[i]$.",
      'If the running sum becomes negative, starting fresh from the current number is strictly better.'
    ],
    edgeCases: ['All negative numbers (e.g. `[-5, -1, -3]`, max sum is `-1`).', 'Single element array.'],
    comparison: [
      { name: 'Brute Force', time: '$O(n^2)$', space: '$O(1)$', verdict: 'TLE' },
      { name: "Kadane's Algorithm", time: '$O(n)$', space: '$O(1)$', verdict: 'Optimal' }
    ],
    approaches: [
      {
        order: 1,
        approachName: "Kadane's Dynamic Programming Algorithm",
        approachType: 'Optimised',
        approachDesc:
          'Track `currentSum` and `maxSum`. At each step $i$, update `currentSum = max(nums[i], currentSum + nums[i])`, and update `maxSum = max(maxSum, currentSum)`.',
        time_complexity: '$O(n)$',
        time_complexity_desc: 'Single linear pass over the array.',
        space_complexity: '$O(1)$',
        space_complexity_desc: 'Constant extra space.',
        code: {
          javascript: `function maxSubArray(nums) {
    let currentSum = nums[0];
    let maxSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
          python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        current_sum = max_sum = nums[0]
        for num in nums[1:]:
            current_sum = max(num, current_sum + num)
            max_sum = max(max_sum, current_sum)
        return max_sum`,
          java: `class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}`,
          cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currentSum = nums[0];
        int maxSum = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        return maxSum;
    }
};`
        }
      }
    ]
  },

  // 121. Best Time to Buy and Sell Stock
  '121': {
    quesId: 121,
    title: 'Best Time to Buy and Sell Stock',
    overview:
      'You are given an array `prices` where `prices[i]` is the price of a given stock on the $i^{\\text{th}}$ day. Find the maximum profit you can achieve from choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
    keyInsights: [
      'To maximize profit, for each day $i$, we want to sell at $\\text{prices}[i]$ having bought at the minimum price seen so far before day $i$.',
      'Track `minPrice` dynamically as we iterate through the list.'
    ],
    edgeCases: ['Strictly descending prices: maximum profit is 0.', 'Single day price array: 0 profit.'],
    comparison: [{ name: 'Single Pass Min-Tracker', time: '$O(n)$', space: '$O(1)$', verdict: 'Optimal' }],
    approaches: [
      {
        order: 1,
        approachName: 'Single Pass Tracking Minimum Price',
        approachType: 'Optimised',
        approachDesc: 'Iterate through `prices`. Keep track of the lowest price observed so far. Calculate potential profit at each day and update `maxProfit`.',
        time_complexity: '$O(n)$',
        time_complexity_desc: 'Single linear iteration through `prices`.',
        space_complexity: '$O(1)$',
        space_complexity_desc: 'Only two scalar tracker variables needed.',
        code: {
          javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (const price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
          python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            elif price - min_price > max_profit:
                max_profit = price - min_price
        return max_profit`,
          java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
}`,
          cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        return maxProfit;
    }
};`
        }
      }
    ]
  },

  // 2. Add Two Numbers
  '2': {
    quesId: 2,
    title: 'Add Two Numbers',
    overview: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    keyInsights: [
      'Traverse both linked lists from head to tail, simulating column-by-column addition with a carry variable.',
      'Handle carry after traversing both lists if carry > 0 by appending a final node.'
    ],
    videoUrl: 'https://www.youtube.com/embed/wgFPrzTjm7s',
    comparison: [{ name: 'Elementary Math Simulation', time: '$O(\\max(m, n))$', space: '$O(1)$ extra', verdict: 'Optimal' }],
    approaches: [
      {
        order: 1,
        approachName: 'Elementary Math Simulation with Carry',
        approachType: 'Optimised',
        approachDesc: 'Iterate through both linked lists simultaneously from head to tail. Sum corresponding digits with carry, outputting sum % 10 and carrying sum / 10.',
        time_complexity: '$O(\\max(m, n))$',
        space_complexity: '$O(1)$ auxiliary',
        code: {
          javascript: `function addTwoNumbers(l1, l2) {
    const dummyHead = new ListNode(0);
    let curr = dummyHead;
    let carry = 0;

    while (l1 !== null || l2 !== null || carry !== 0) {
        const val1 = l1 ? l1.val : 0;
        const val2 = l2 ? l2.val : 0;
        const sum = val1 + val2 + carry;
        
        carry = Math.floor(sum / 10);
        curr.next = new ListNode(sum % 10);
        curr = curr.next;

        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }

    return dummyHead.next;
}`,
          python: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        curr = dummy
        carry = 0

        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            total = val1 + val2 + carry

            carry = total // 10
            curr.next = ListNode(total % 10)
            curr = curr.next

            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None

        return dummy.next`,
          java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int val1 = (l1 != null) ? l1.val : 0;
            int val2 = (l2 != null) ? l2.val : 0;
            int sum = val1 + val2 + carry;

            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;

            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }

        return dummy.next;
    }
}`,
          cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        int carry = 0;

        while (l1 || l2 || carry) {
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            int sum = val1 + val2 + carry;

            carry = sum / 10;
            curr->next = new ListNode(sum % 10);
            curr = curr->next;

            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }

        return dummy.next;
    }
};`,
        }
      }
    ]
  },

  // 3. Longest Substring Without Repeating Characters
  '3': {
    quesId: 3,
    title: 'Longest Substring Without Repeating Characters',
    overview: 'Given a string s, find the length of the longest substring without duplicate characters.',
    videoUrl: 'https://www.youtube.com/embed/wiGpQwVHdE0',
    comparison: [
      { name: 'Sliding Window + Set', time: '$O(n)$', space: '$O(\\min(m, n))$', verdict: 'Standard' },
      { name: 'Sliding Window + Last Seen Map', time: '$O(n)$', space: '$O(\\min(m, n))$', verdict: 'Optimal' }
    ],
    approaches: [
      {
        order: 1,
        approachName: 'Sliding Window Optimized with Last-Seen Map',
        approachType: 'Optimised',
        approachDesc: 'Maintain a window [left, right] and store the last seen position of each character. When a duplicate is encountered within the current window, skip left directly past its prior position.',
        time_complexity: '$O(n)$',
        space_complexity: '$O(\\min(m, n))$',
        code: {
          javascript: `function lengthOfLongestSubstring(s) {
    const lastSeen = new Map();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (lastSeen.has(char) && lastSeen.get(char) >= left) {
            left = lastSeen.get(char) + 1;
        }
        lastSeen.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}`,
          python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen = {}
        left = 0
        max_len = 0

        for right, char in enumerate(s):
            if char in last_seen and last_seen[char] >= left:
                left = last_seen[char] + 1
            last_seen[char] = right
            max_len = max(max_len, right - left + 1)

        return max_len`,
          java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}`,
          cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.size(); right++) {
            char c = s[right];
            if (lastSeen.count(c) && lastSeen[c] >= left) {
                left = lastSeen[c] + 1;
            }
            lastSeen[c] = right;
            maxLen = max(maxLen, right - left + 1);
        }

        return maxLen;
    }
};`,
        }
      }
    ]
  },

  // 8. String to Integer (atoi)
  '8': {
    quesId: 8,
    title: 'String to Integer (atoi)',
    overview: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.',
    videoUrl: 'https://www.youtube.com/embed/2I9rUCjnbhs',
    comparison: [{ name: 'State Machine / Sequential Parser', time: '$O(n)$', space: '$O(1)$', verdict: 'Optimal' }],
    approaches: [
      {
        order: 1,
        approachName: 'State Machine / Sequential Parsing',
        approachType: 'Optimised',
        approachDesc: 'Parse whitespace, read optional sign, accumulate digits, and clamp to [-2^31, 2^31 - 1] upon 32-bit integer overflow.',
        time_complexity: '$O(n)$',
        space_complexity: '$O(1)$',
        code: {
          javascript: `function myAtoi(s) {
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    let i = 0;
    const n = s.length;

    while (i < n && s[i] === ' ') i++;
    if (i >= n) return 0;

    let sign = 1;
    if (s[i] === '+' || s[i] === '-') {
        sign = s[i] === '-' ? -1 : 1;
        i++;
    }

    let result = 0;
    while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = s.charCodeAt(i) - 48;
        if (result > Math.floor(INT_MAX / 10) || (result === Math.floor(INT_MAX / 10) && digit > 7)) {
            return sign === 1 ? INT_MAX : INT_MIN;
        }
        result = result * 10 + digit;
        i++;
    }

    return result * sign;
}`,
          python: `class Solution:
    def myAtoi(self, s: str) -> int:
        INT_MAX = 2**31 - 1
        INT_MIN = -2**31
        i, n = 0, len(s)
        while i < n and s[i] == ' ': i += 1
        if i >= n: return 0
        sign = -1 if s[i] == '-' else 1
        if s[i] in ['+', '-']: i += 1
        result = 0
        while i < n and s[i].isdigit():
            digit = int(s[i])
            if result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > 7):
                return INT_MAX if sign == 1 else INT_MIN
            result = result * 10 + digit
            i += 1
        return sign * result`,
          java: `class Solution {
    public int myAtoi(String s) {
        int i = 0, n = s.length();
        while (i < n && s.charAt(i) == ' ') i++;
        if (i >= n) return 0;
        int sign = 1;
        if (s.charAt(i) == '+' || s.charAt(i) == '-') {
            sign = (s.charAt(i) == '-') ? -1 : 1;
            i++;
        }
        int result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            if (result > Integer.MAX_VALUE / 10 || (result == Integer.MAX_VALUE / 10 && digit > 7)) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            result = result * 10 + digit;
            i++;
        }
        return result * sign;
    }
}`,
          cpp: `class Solution {
public:
    int myAtoi(string s) {
        int i = 0, n = s.size();
        while (i < n && s[i] == ' ') i++;
        if (i >= n) return 0;
        int sign = 1;
        if (s[i] == '+' || s[i] == '-') {
            sign = (s[i] == '-') ? -1 : 1;
            i++;
        }
        int result = 0;
        while (i < n && isdigit(s[i])) {
            int digit = s[i] - '0';
            if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > 7)) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            result = result * 10 + digit;
            i++;
        }
        return result * sign;
    }
};`,
        }
      }
    ]
  },

  // 42. Trapping Rain Water
  '42': {
    quesId: 42,
    title: 'Trapping Rain Water',
    overview: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    videoUrl: 'https://www.youtube.com/embed/ZI2z5830MT8',
    comparison: [{ name: 'Two Pointers Optimal', time: '$O(n)$', space: '$O(1)$', verdict: 'Optimal' }],
    approaches: [
      {
        order: 1,
        approachName: 'Two Pointers Trapping Optimal',
        approachType: 'Optimised',
        approachDesc: 'Maintain left and right pointers with leftMax and rightMax. Water trapped at height[i] is min(leftMax, rightMax) - height[i]. Since the boundary with smaller max limits the water column height, process that side and move inward.',
        time_complexity: '$O(n)$',
        space_complexity: '$O(1)$',
        code: {
          javascript: `function trap(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`,
          python: `class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = water = 0
        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max: left_max = height[left]
                else: water += left_max - height[left]
                left += 1
            else:
                if height[right] >= right_max: right_max = height[right]
                else: water += right_max - height[right]
                right -= 1
        return water`,
          java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
          cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`,
        }
      }
    ]
  }
};
