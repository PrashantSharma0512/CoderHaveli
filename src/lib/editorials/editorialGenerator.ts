import { ProblemEditorial, EditorialApproach } from './types';
import { curatedEditorials } from './curatedEditorials';

interface ProblemInput {
  quesId?: string | number;
  quesName?: string;
  quesDesc?: string;
  difficulty?: string;
  tags?: string[];
  hints?: string[];
  problemExample?: Array<{ input?: string; output?: string; explaination?: string }>;
  constraints?: string[];
  starterCode?: any;
  [key: string]: any;
}

function cleanHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toFunctionName(name: string): string {
  if (!name) return 'solve';
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/);
  if (!clean.length || !clean[0]) return 'solve';
  return clean
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

interface PatternMeta {
  patternName: string;
  optimalType: string;
  timeComplexity: string;
  timeDesc: string;
  spaceComplexity: string;
  spaceDesc: string;
  intuition: string;
  algorithm: string[];
  generateCode: (fnName: string) => { javascript: string; python: string; java: string; cpp: string };
}

function detectPattern(tags: string[] = [], title: string = '', desc: string = ''): PatternMeta {
  const combined = (tags.join(' ') + ' ' + title + ' ' + desc).toLowerCase();

  // 1. Two Pointers / Sliding Window
  if (combined.includes('two pointer') || combined.includes('sliding window')) {
    return {
      patternName: 'Two Pointers & Window Contraction',
      optimalType: 'Optimised',
      timeComplexity: '$O(n)$',
      timeDesc: 'Each pointer visits each index at most once, performing a single pass over the elements.',
      spaceComplexity: '$O(1)$',
      spaceDesc: 'Only a pair of integer pointers and scalar tracking variables are used.',
      intuition:
        'By maintaining two pointers (`left` and `right`) and exploiting the sorted or boundary invariant of the array, we can determine the direction to move in $O(1)$ time, eliminating entire branches of redundant comparisons.',
      algorithm: [
        'Set up boundary pointers: `left = 0`, `right = n - 1` (or sliding window range).',
        'While the pointers do not cross:',
        '  Calculate the target condition or window metric.',
        '  Update our optimal answer accumulator.',
        '  Increment `left` or decrement `right` based on whether the condition is under-satisfied or over-satisfied.'
      ],
      generateCode: (fn) => ({
        javascript: `function ${fn}(data) {
    let left = 0;
    let right = data.length - 1;
    let result = 0;

    while (left < right) {
        // Evaluate window or boundary condition
        const currentMetric = Math.min(data[left], data[right]) * (right - left);
        result = Math.max(result, currentMetric);

        // Move the pointer that limits the optimal invariant
        if (data[left] < data[right]) {
            left++;
        } else {
            right--;
        }
    }
    return result;
}`,
        python: `class Solution:
    def ${fn}(self, data: list) -> int:
        left, right = 0, len(data) - 1
        result = 0

        while left < right:
            metric = min(data[left], data[right]) * (right - left)
            result = max(result, metric)

            if data[left] < data[right]:
                left += 1
            else:
                right -= 1

        return result`,
        java: `class Solution {
    public int ${fn}(int[] data) {
        int left = 0, right = data.length - 1;
        int result = 0;

        while (left < right) {
            int metric = Math.min(data[left], data[right]) * (right - left);
            result = Math.max(result, metric);

            if (data[left] < data[right]) {
                left++;
            } else {
                right--;
            }
        }
        return result;
    }
}`,
        cpp: `class Solution {
public:
    int ${fn}(vector<int>& data) {
        int left = 0, right = data.size() - 1;
        int result = 0;

        while (left < right) {
            int metric = min(data[left], data[right]) * (right - left);
            result = max(result, metric);

            if (data[left] < data[right]) {
                left++;
            } else {
                right--;
            }
        }
        return result;
    }
};`
      })
    };
  }

  // 2. Binary Search
  if (combined.includes('binary search')) {
    return {
      patternName: 'Binary Search Over Search Space',
      optimalType: 'Optimised',
      timeComplexity: '$O(\\log n)$',
      timeDesc: 'The search space is cut in half at every step.',
      spaceComplexity: '$O(1)$',
      spaceDesc: 'Iterative binary search uses only boundary variables without recursive stack depth.',
      intuition:
        'Because the condition is monotonic (if a candidate $x$ is valid, either all values $\\le x$ or all $\\ge x$ are also valid), we can eliminate half of the remaining candidates at each iteration.',
      algorithm: [
        'Define the search boundaries `low = 0` and `high = n - 1` (or domain bounds).',
        'While `low <= high`:',
        '  Compute `mid = low + Math.floor((high - low) / 2)`.',
        '  If `predicate(mid)` satisfies the target, record/return the answer.',
        '  Adjust `low` or `high` to discard the unviable half of the space.'
      ],
      generateCode: (fn) => ({
        javascript: `function ${fn}(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
        python: `class Solution:
    def ${fn}(self, arr: list[int], target: int) -> int:
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1`,
        java: `class Solution {
    public int ${fn}(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
        cpp: `class Solution {
public:
    int ${fn}(vector<int>& arr, int target) {
        int low = 0, high = arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
};`
      })
    };
  }

  // 3. Dynamic Programming
  if (combined.includes('dynamic programming') || combined.includes('dp')) {
    return {
      patternName: 'Dynamic Programming (Memoization / Tabulation)',
      optimalType: 'Optimised',
      timeComplexity: '$O(n)$',
      timeDesc: 'Each subproblem state is computed exactly once.',
      spaceComplexity: '$O(n)$ or $O(1)$',
      spaceDesc: 'Space can frequently be optimized to constant space by keeping only the previous state values.',
      intuition:
        'The problem exhibits overlapping subproblems and optimal substructure. Rather than recomputing solutions to identical subproblems repeatedly via recursion, we store previously calculated results in a table or state variables.',
      algorithm: [
        'Identify the DP state: `dp[i]` represents the optimal solution for the subproblem of size $i$.',
        'Establish base cases: initialize values for trivial inputs (e.g. $i = 0, i = 1$).',
        'Determine transition formula: `dp[i] = transition(dp[i - 1], dp[i - 2], ...)`.',
        'Iterate iteratively from base cases up to the target state $n$.'
      ],
      generateCode: (fn) => ({
        javascript: `function ${fn}(n) {
    if (n <= 1) return n;
    // Rolling state array to achieve O(1) auxiliary space
    let prev2 = 0;
    let prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}`,
        python: `class Solution:
    def ${fn}(self, n: int) -> int:
        if n <= 1:
            return n
        prev2, prev1 = 0, 1
        for _ in range(2, n + 1):
            prev2, prev1 = prev1, prev1 + prev2
        return prev1`,
        java: `class Solution {
    public int ${fn}(int n) {
        if (n <= 1) return n;
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}`,
        cpp: `class Solution {
public:
    int ${fn}(int n) {
        if (n <= 1) return n;
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
};`
      })
    };
  }

  // 4. Tree / Binary Tree / DFS
  if (combined.includes('tree') || combined.includes('binary tree') || combined.includes('dfs')) {
    return {
      patternName: 'Recursive Depth-First Traversal',
      optimalType: 'Optimised',
      timeComplexity: '$O(n)$',
      timeDesc: 'Every node in the tree is visited exactly once.',
      spaceComplexity: '$O(h)$',
      spaceDesc: 'Auxiliary recursion stack proportional to tree height $h$, which is $O(\\log n)$ in balanced trees and $O(n)$ in the worst case.',
      intuition:
        'Tree structures naturally mirror recursive decomposition. By solving the problem for the left and right subtrees independently, we can combine their results to answer the question for the root node.',
      algorithm: [
        'Base Case: if node is null, return trivial result (0 or null).',
        'Recursively invoke the function on `node.left` and `node.right`.',
        'Combine results with current node value.',
        'Return combined answer to caller.'
      ],
      generateCode: (fn) => ({
        javascript: `function ${fn}(root) {
    if (!root) return 0;
    const leftRes = ${fn}(root.left);
    const rightRes = ${fn}(root.right);
    return Math.max(leftRes, rightRes) + 1;
}`,
        python: `class Solution:
    def ${fn}(self, root) -> int:
        if not root:
            return 0
        left_res = self.${fn}(root.left)
        right_res = self.${fn}(root.right)
        return max(left_res, right_res) + 1`,
        java: `class Solution {
    public int ${fn}(TreeNode root) {
        if (root == null) return 0;
        int leftRes = ${fn}(root.left);
        int rightRes = ${fn}(root.right);
        return Math.max(leftRes, rightRes) + 1;
    }
}`,
        cpp: `class Solution {
public:
    int ${fn}(TreeNode* root) {
        if (!root) return 0;
        int leftRes = ${fn}(root->left);
        int rightRes = ${fn}(root->right);
        return max(leftRes, rightRes) + 1;
    }
};`
      })
    };
  }

  // 5. Hash Table / Frequency Map
  return {
    patternName: 'Hash Map Lookup & Linear Scan',
    optimalType: 'Optimised',
    timeComplexity: '$O(n)$',
    timeDesc: 'A single linear scan over the dataset with $O(1)$ amortized dictionary lookups.',
    spaceComplexity: '$O(n)$',
    spaceDesc: 'Hash table stores frequencies or indices for up to $n$ elements.',
    intuition:
      'We can trade memory for runtime efficiency. By storing elements, frequencies, or seen indices in a Hash Map as we iterate, we can answer membership and complement queries in constant $O(1)$ time.',
    algorithm: [
      'Initialize an empty hash map or frequency dictionary.',
      'Iterate through the array or string.',
      'Check if current element or its complement exists in the map.',
      'Update frequency or seen status.',
      'Return the aggregated result.'
    ],
    generateCode: (fn) => ({
      javascript: `function ${fn}(items) {
    const freq = new Map();
    let result = 0;

    for (const item of items) {
        freq.set(item, (freq.get(item) || 0) + 1);
    }

    for (const [key, count] of freq.entries()) {
        if (count > result) {
            result = count;
        }
    }
    return result;
}`,
      python: `class Solution:
    def ${fn}(self, items: list) -> int:
        from collections import Counter
        freq = Counter(items)
        return max(freq.values(), default=0)`,
      java: `class Solution {
    public int ${fn}(int[] items) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int item : items) {
            freq.put(item, freq.getOrDefault(item, 0) + 1);
        }
        int maxFreq = 0;
        for (int val : freq.values()) {
            if (val > maxFreq) maxFreq = val;
        }
        return maxFreq;
    }
}`,
      cpp: `class Solution {
public:
    int ${fn}(vector<int>& items) {
        unordered_map<int, int> freq;
        for (int item : items) {
            freq[item]++;
        }
        int maxFreq = 0;
        for (auto& p : freq) {
            if (p.second > maxFreq) maxFreq = p.second;
        }
        return maxFreq;
    }
};`
    })
  };
}

export function generateUniversalEditorial(problem: ProblemInput): ProblemEditorial {
  const quesId = problem.quesId || 'unknown';
  const title = problem.quesName || `Problem ${quesId}`;
  const cleanDesc = cleanHtml(problem.quesDesc || '');
  const tags = Array.isArray(problem.tags) ? problem.tags : [];
  const difficulty = problem.difficulty || 'medium';
  const fnName = toFunctionName(title);
  const pattern = detectPattern(tags, title, cleanDesc);

  const overview = cleanDesc
    ? cleanDesc.slice(0, 300) + (cleanDesc.length > 300 ? '...' : '')
    : `Given the constraints and specifications for **${title}**, our goal is to construct an efficient algorithm that evaluates the inputs correctly within the time limits.`;

  const keyInsights: string[] = [
    `Problem Classification: Tagged with ${tags.length > 0 ? tags.join(', ') : 'core algorithmic concepts'} under **${difficulty.toUpperCase()}** difficulty.`,
    `Algorithmic Core: The problem can be tackled using **${pattern.patternName}**, balancing computation and storage.`,
    `Avoid Redundancy: Transitioning from exhaustive state exploration to state preservation avoids duplicate computations.`
  ];

  if (Array.isArray(problem.hints) && problem.hints.length > 0) {
    keyInsights.push(`Official Hint: ${cleanHtml(problem.hints[0])}`);
  }

  const edgeCases: string[] = [
    'Empty or single-element inputs.',
    'Inputs at the minimum and maximum boundaries of the constraints.',
    'Arrays containing identical, negative, or extreme boundary values.'
  ];

  const approaches: EditorialApproach[] = [
    {
      order: 1,
      approachName: 'Brute Force / Naive Exploration',
      approachType: 'Brute Force',
      approachDesc:
        'Exhaustively simulate all candidate states, combinations, or pairs to find the solution. While intuitive and easy to verify, it scales with high polynomial or exponential time complexity.',
      intuition:
        'Without leveraging the structural invariants of the problem, we check every possibility. This establishes a baseline correctness test and helps identify which redundant operations we need to optimize.',
      algorithm: [
        'Iterate through all potential configurations or pairs.',
        'Validate whether the current configuration satisfies the problem criteria.',
        'Update global optimal answer.',
        'Return final optimal value.'
      ],
      time_complexity: '$O(n^2)$',
      time_complexity_desc: 'Nested iterations examining all state combinations.',
      space_complexity: '$O(1)$',
      space_complexity_desc: 'Minimal auxiliary variables without extra allocation.',
      code: {
        javascript: `function ${fnName}BruteForce(arr) {
    let result = null;
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // Check all pairs/combinations
            if (isValid(arr[i], arr[j])) {
                result = updateResult(arr[i], arr[j]);
            }
        }
    }
    return result;
}`,
        python: `class Solution:
    def ${fnName}_brute_force(self, arr: list):
        result = None
        n = len(arr)
        for i in range(n):
            for j in range(i + 1, n):
                if self.is_valid(arr[i], arr[j]):
                    result = self.update_result(arr[i], arr[j])
        return result`,
        java: `class Solution {
    public int ${fnName}BruteForce(int[] arr) {
        int result = 0;
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isValid(arr[i], arr[j])) {
                    result = Math.max(result, arr[i] + arr[j]);
                }
            }
        }
        return result;
    }
}`,
        cpp: `class Solution {
public:
    int ${fnName}BruteForce(vector<int>& arr) {
        int result = 0;
        int n = arr.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isValid(arr[i], arr[j])) {
                    result = max(result, arr[i] + arr[j]);
                }
            }
        }
        return result;
    }
};`
      }
    },
    {
      order: 2,
      approachName: pattern.patternName,
      approachType: 'Optimised',
      approachDesc: `Apply the optimal **${pattern.patternName}** strategy to solve the challenge within optimal runtime bounds.`,
      intuition: pattern.intuition,
      algorithm: pattern.algorithm,
      time_complexity: pattern.timeComplexity,
      time_complexity_desc: pattern.timeDesc,
      space_complexity: pattern.spaceComplexity,
      space_complexity_desc: pattern.spaceDesc,
      code: pattern.generateCode(fnName)
    }
  ];

  return {
    quesId,
    title,
    overview,
    keyInsights,
    edgeCases,
    comparison: [
      { name: 'Brute Force', time: '$O(n^2)$', space: '$O(1)$', verdict: 'Inefficient / TLE on large tests' },
      { name: pattern.patternName, time: pattern.timeComplexity, space: pattern.spaceComplexity, verdict: 'Optimal & Accepted' }
    ],
    approaches
  };
}

/**
 * Main entry point: Returns editorial data for any problem.
 * 1. Returns existing API editorial if non-empty.
 * 2. Checks curated editorials by question ID or title.
 * 3. Synthesizes a structured editorial for any other question.
 */
export function getEditorialForProblem(problem: ProblemInput | null, apiEditorial: any[] = []): ProblemEditorial {
  if (Array.isArray(apiEditorial) && apiEditorial.length > 0) {
    const title = problem?.quesName || 'Problem';
    const quesId = problem?.quesId || 'unknown';
    const videoUrl = apiEditorial.find((a) => !!a.videoUrl)?.videoUrl || null;
    const cleanDesc = cleanHtml(problem?.quesDesc || '');
    const overview = cleanDesc
      ? cleanDesc.slice(0, 350) + (cleanDesc.length > 350 ? '...' : '')
      : `Complete editorial breakdown and multi-language implementation for **${title}**.`;

    const comparison = apiEditorial.map((app, idx) => ({
      name: app.approachName || `Approach ${idx + 1}`,
      time: app.time_complexity || '$O(n)$',
      space: app.space_complexity || '$O(1)$',
      verdict:
        app.approachType === 'Optimised'
          ? 'Optimal & Accepted'
          : app.approachType === 'Improved'
          ? 'Improved'
          : 'Baseline / Brute Force'
    }));

    const keyInsights = [
      `Problem: **${title}** (${(problem?.difficulty || 'Medium').toUpperCase()})`,
      `Optimal Pattern: ${apiEditorial.find((a) => a.approachType === 'Optimised')?.approachName || 'Algorithmic Optimization'}`,
      'Review both the brute force and optimized approaches to understand the trade-offs in time and memory.'
    ];

    if (Array.isArray(problem?.hints) && problem.hints.length > 0) {
      keyInsights.push(`Hint: ${cleanHtml(problem.hints[0])}`);
    }

    return {
      quesId,
      title,
      overview,
      videoUrl,
      keyInsights,
      comparison,
      approaches: apiEditorial.map((app, idx) => ({
        _id: app._id || `api-${idx}`,
        quesId: app.quesId || quesId,
        approachName: app.approachName || `Approach ${idx + 1}`,
        approachType: app.approachType || (idx === 0 ? 'Brute Force' : 'Optimised'),
        approachDesc: app.approachDesc || '',
        time_complexity: app.time_complexity || '$O(n)$',
        space_complexity: app.space_complexity || '$O(1)$',
        videoUrl: app.videoUrl || null,
        order: app.order || idx + 1,
        code: app.code || ''
      }))
    };
  }

  if (problem) {
    const idKey = String(problem.quesId || '');
    if (curatedEditorials[idKey]) {
      return curatedEditorials[idKey];
    }

    // Try matching by slug / clean title
    const normalizedTitle = (problem.quesName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, ed] of Object.entries(curatedEditorials)) {
      const edNormalized = ed.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (edNormalized && edNormalized === normalizedTitle) {
        return ed;
      }
    }

    return generateUniversalEditorial(problem);
  }

  // Fallback for missing problem context
  return generateUniversalEditorial({
    quesId: 1,
    quesName: 'Coding Problem',
    difficulty: 'medium',
    tags: ['Array', 'Two Pointers']
  });
}

