/**
 * Pre-parsed Sample Course Materials for Instant Grader & Demo Testing
 */

export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample_1',
    fileName: 'CS301_Data_Structures_Syllabus.pdf',
    type: 'PDF Document',
    wordCount: 840,
    fileSize: '420 KB',
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    text: `CS301: DATA STRUCTURES & ALGORITHMS - SYLLABUS & COURSE ROADMAP
Semester: Fall 2026 | Instructor: Dr. Sarah Vance

COURSE OVERVIEW:
This course covers fundamental data structures and algorithmic design principles essential for modern software engineering. Students will learn time/space complexity analysis (Big-O notation), recursive algorithm design, graph processing, dynamic programming, and balanced binary search trees.

WEEKLY TOPIC SCHEDULE:
Week 1: Algorithmic Complexity, Big-O Notation, Asymptotic Analysis, Array & Linked List Optimizations.
Week 2: Stacks, Queues, Deques, and Priority Queues using Min/Max Binary Heaps.
Week 3: Trees & Graphs - Binary Search Trees (BST), AVL Trees, Red-Black Tree Balancing.
Week 4: Graph Traversals - Breadth-First Search (BFS), Depth-First Search (DFS), Topological Sort.
Week 5: Shortest Path & Minimum Spanning Trees - Dijkstra's Algorithm, Bellman-Ford, Kruskal's & Prim's Algorithms.
Week 6: Dynamic Programming (DP) - Overlapping subproblems, Memoization vs Tabulation, Knapsack Problem, Longest Common Subsequence (LCS).
Week 7: Hashing Algorithms - Hash Tables, Collision Resolution (Chaining vs Open Addressing), Cryptographic Hash Functions.
Week 8: Final Comprehensive Review & Practice Exam.

GRADING & EVALUATION:
- Quizzes & Homework: 30%
- Midterm Examination: 30%
- Final Capstone Exam: 40%`
  },
  {
    id: 'sample_2',
    fileName: 'Lecture5_Graph_Algorithms_Dijkstra.pptx',
    type: 'PPTX Presentation Slides',
    wordCount: 1120,
    fileSize: '2.4 MB',
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    text: `--- Slide 1 ---
LECTURE 5: GRAPH ALGORITHMS & SHORTEST PATHS
CS301 Data Structures & Algorithms

--- Slide 2 ---
Graph Fundamentals:
- Graph G = (V, E) where V is vertices (nodes) and E is edges (connections).
- Directed vs Undirected Graphs.
- Weighted vs Unweighted Edges.
- Adjacency Matrix vs Adjacency List representations.

--- Slide 3 ---
Graph Traversals:
BFS (Breadth-First Search): Uses Queue (FIFO). Finds shortest path in unweighted graph. Time Complexity O(V + E).
DFS (Depth-First Search): Uses Stack/Recursion (LIFO). Used for topological sorting and cycle detection. Time Complexity O(V + E).

--- Slide 4 ---
Dijkstra's Algorithm:
- Goal: Find single-source shortest path in weighted graph with non-negative edge weights.
- Key Data Structure: Min-Priority Queue storing (distance, vertex) tuples.
- Algorithm Step:
  1. Set dist[source] = 0, all other dist[u] = infinity.
  2. Extract min distance vertex u from Priority Queue.
  3. Edge Relaxation: For each neighbor v with edge weight w, if dist[u] + w < dist[v], update dist[v] = dist[u] + w and insert v into Priority Queue.
- Time Complexity: O((V + E) log V) with Binary Heap.

--- Slide 5 ---
Common Pitfall on Exams:
- Dijkstra DOES NOT work on graphs with negative edge weights! Use Bellman-Ford algorithm for negative weights (Time: O(V * E)).`
  },
  {
    id: 'sample_3',
    fileName: 'Past_Quiz_Questions_2025.docx',
    type: 'DOCX Word Document',
    wordCount: 650,
    fileSize: '185 KB',
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    text: `PAST MIDTERM QUIZ QUESTIONS & SOLUTIONS (2025)

Question 1: What is the worst-case time complexity of inserting an element into a Binary Search Tree (BST) of size N?
A) O(1)
B) O(log N)
C) O(N) [CORRECT]
D) O(N log N)
Explanation: In an unbalanced BST (e.g. inserting elements in sorted order 1, 2, 3, 4), the tree degenerates into a linked list, making worst-case search and insertion O(N).

Question 2: Which graph traversal algorithm is guaranteed to find the shortest path in an unweighted graph?
A) Depth-First Search (DFS)
B) Breadth-First Search (BFS) [CORRECT]
C) Pre-order Traversal
D) Post-order Traversal
Explanation: BFS explores nodes level by level in order of distance from source, guaranteeing shortest path in unweighted graphs.

Question 3: Explain the difference between Memoization and Tabulation in Dynamic Programming.
Solution: Memoization is a top-down recursive approach with a lookup table/cache. Tabulation is a bottom-up iterative approach that solves smaller subproblems first and fills an array table.`
  }
];
