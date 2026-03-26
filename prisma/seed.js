const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ═══════════════════════════════════════════════════════════════
  // EXAM QUESTIONS
  // ═══════════════════════════════════════════════════════════════

  // --- GATE Questions ---
  const gateQuestions = [
    { examType: 'GATE', topic: 'Data Structures', question: 'What is the time complexity of searching in a balanced BST?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 'O(log n)', explanation: 'In a balanced BST, each comparison eliminates half the remaining nodes.', difficulty: 'EASY' },
    { examType: 'GATE', topic: 'Data Structures', question: 'Which data structure is used for BFS traversal of a graph?', options: ['Stack', 'Queue', 'Priority Queue', 'Deque'], answer: 'Queue', explanation: 'BFS uses a FIFO queue to explore nodes level by level.', difficulty: 'EASY' },
    { examType: 'GATE', topic: 'Algorithms', question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], answer: 'O(n²)', explanation: 'Worst case occurs when pivot is always the smallest or largest element.', difficulty: 'MEDIUM' },
    { examType: 'GATE', topic: 'Algorithms', question: 'Which algorithm technique is used in the Fractional Knapsack problem?', options: ['Dynamic Programming', 'Greedy', 'Backtracking', 'Divide and Conquer'], answer: 'Greedy', explanation: 'Fractional Knapsack uses greedy approach by selecting items with highest value/weight ratio.', difficulty: 'MEDIUM' },
    { examType: 'GATE', topic: 'Operating Systems', question: 'Which scheduling algorithm may cause starvation?', options: ['Round Robin', 'FCFS', 'SJF', 'All of above'], answer: 'SJF', explanation: 'In SJF, long processes may never get CPU if shorter processes keep arriving.', difficulty: 'MEDIUM' },
    { examType: 'GATE', topic: 'Operating Systems', question: 'What is a deadlock?', options: ['When CPU is idle', 'When processes wait for each other indefinitely', 'When memory is full', 'When I/O is slow'], answer: 'When processes wait for each other indefinitely', explanation: 'Deadlock occurs when two or more processes are blocked, each waiting for the other to release resources.', difficulty: 'EASY' },
    { examType: 'GATE', topic: 'DBMS', question: 'What is the normal form that eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: '3NF', explanation: '3NF removes transitive dependencies where non-key attributes depend on other non-key attributes.', difficulty: 'MEDIUM' },
    { examType: 'GATE', topic: 'DBMS', question: 'Which SQL command is used to remove all rows from a table without logging?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], answer: 'TRUNCATE', explanation: 'TRUNCATE removes all rows without logging individual row deletions and cannot be rolled back.', difficulty: 'EASY' },
    { examType: 'GATE', topic: 'Computer Networks', question: 'Which layer of the OSI model is responsible for routing?', options: ['Transport', 'Network', 'Data Link', 'Session'], answer: 'Network', explanation: 'The Network layer (Layer 3) handles logical addressing and routing of packets.', difficulty: 'EASY' },
    { examType: 'GATE', topic: 'Computer Networks', question: 'TCP uses which mechanism for reliable data transfer?', options: ['Checksum only', 'ACK and retransmission', 'Encryption', 'Compression'], answer: 'ACK and retransmission', explanation: 'TCP uses acknowledgments and retransmissions along with sequence numbers for reliability.', difficulty: 'MEDIUM' },
  ];

  // --- GRE Questions ---
  const greQuestions = [
    { examType: 'GRE', topic: 'Quantitative Reasoning', question: 'If x² - 5x + 6 = 0, what are the values of x?', options: ['1, 6', '2, 3', '-2, -3', '1, 5'], answer: '2, 3', explanation: 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3.', difficulty: 'EASY' },
    { examType: 'GRE', topic: 'Quantitative Reasoning', question: 'What is the probability of getting at least one head in 3 coin flips?', options: ['7/8', '3/4', '1/2', '1/8'], answer: '7/8', explanation: 'P(at least one head) = 1 - P(no heads) = 1 - (1/2)³ = 7/8.', difficulty: 'MEDIUM' },
    { examType: 'GRE', topic: 'Quantitative Reasoning', question: 'If the average of 5 numbers is 20, what is their sum?', options: ['25', '100', '4', '80'], answer: '100', explanation: 'Sum = Average × Count = 20 × 5 = 100.', difficulty: 'EASY' },
    { examType: 'GRE', topic: 'Verbal Reasoning', question: 'Choose the word most similar to "Ephemeral":', options: ['Eternal', 'Transient', 'Robust', 'Vivid'], answer: 'Transient', explanation: 'Ephemeral means lasting for a very short time, similar to transient.', difficulty: 'MEDIUM' },
    { examType: 'GRE', topic: 'Verbal Reasoning', question: 'Choose the word most similar to "Ubiquitous":', options: ['Rare', 'Omnipresent', 'Obscure', 'Unique'], answer: 'Omnipresent', explanation: 'Ubiquitous means present everywhere, similar to omnipresent.', difficulty: 'EASY' },
    { examType: 'GRE', topic: 'Verbal Reasoning', question: '"Loquacious" most nearly means:', options: ['Quiet', 'Talkative', 'Lazy', 'Energetic'], answer: 'Talkative', explanation: 'Loquacious describes someone who talks a great deal.', difficulty: 'MEDIUM' },
    { examType: 'GRE', topic: 'Analytical Writing', question: 'Which is the best approach for a GRE Issue essay?', options: ['Agree completely', 'Present both sides with a clear stance', 'Disagree completely', 'Avoid taking a stance'], answer: 'Present both sides with a clear stance', explanation: 'The best essays acknowledge counterarguments while clearly supporting one position.', difficulty: 'MEDIUM' },
    { examType: 'GRE', topic: 'Quantitative Reasoning', question: 'A train travels 120 km in 2 hours. What is its speed in m/s?', options: ['60 m/s', '33.33 m/s', '16.67 m/s', '120 m/s'], answer: '16.67 m/s', explanation: '120 km/h ÷ 2 = 60 km/h. 60 × (1000/3600) = 16.67 m/s.', difficulty: 'MEDIUM' },
    { examType: 'GRE', topic: 'Quantitative Reasoning', question: 'What is 15% of 240?', options: ['36', '24', '30', '48'], answer: '36', explanation: '15/100 × 240 = 36.', difficulty: 'EASY' },
    { examType: 'GRE', topic: 'Verbal Reasoning', question: 'The word "Pragmatic" is closest in meaning to:', options: ['Theoretical', 'Practical', 'Artistic', 'Emotional'], answer: 'Practical', explanation: 'Pragmatic means dealing with things in a practical, realistic way.', difficulty: 'EASY' },
  ];

  // --- CAT Questions ---
  const catQuestions = [
    { examType: 'CAT', topic: 'Quantitative Ability', question: 'A man buys an article for ₹800 and sells it for ₹1000. What is the profit percentage?', options: ['20%', '25%', '30%', '15%'], answer: '25%', explanation: 'Profit = 200, Profit% = (200/800)×100 = 25%.', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Quantitative Ability', question: 'If a pipe can fill a tank in 6 hours and another can empty it in 8 hours, how long to fill the tank with both open?', options: ['24 hours', '12 hours', '14 hours', '20 hours'], answer: '24 hours', explanation: 'Net rate = 1/6 - 1/8 = 1/24. So it takes 24 hours.', difficulty: 'MEDIUM' },
    { examType: 'CAT', topic: 'Data Interpretation', question: 'If a company\'s revenue grew from ₹200Cr to ₹250Cr, what is the percentage growth?', options: ['20%', '25%', '30%', '50%'], answer: '25%', explanation: 'Growth = (250-200)/200 × 100 = 25%.', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Logical Reasoning', question: 'All roses are flowers. Some flowers are red. Which conclusion is valid?', options: ['All roses are red', 'Some roses may be red', 'No roses are red', 'All flowers are roses'], answer: 'Some roses may be red', explanation: 'Since some flowers are red and all roses are flowers, some roses could be red (but not necessarily).', difficulty: 'MEDIUM' },
    { examType: 'CAT', topic: 'Logical Reasoning', question: 'If A > B, B > C, and C > D, which is definitely true?', options: ['D > A', 'A > D', 'B > D only sometimes', 'Cannot determine'], answer: 'A > D', explanation: 'By transitivity: A > B > C > D, therefore A > D.', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Verbal Ability', question: 'Choose the correct sentence:', options: ['He has went to school', 'He has gone to school', 'He have gone to school', 'He has go to school'], answer: 'He has gone to school', explanation: 'Present perfect tense uses has/have + past participle. "Gone" is the past participle of "go".', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Quantitative Ability', question: 'The sum of first 50 natural numbers is:', options: ['1225', '1275', '1250', '1300'], answer: '1275', explanation: 'Sum = n(n+1)/2 = 50×51/2 = 1275.', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Data Interpretation', question: 'If a pie chart shows 25% for Marketing, what is the angle of the sector?', options: ['90°', '60°', '45°', '120°'], answer: '90°', explanation: '25% of 360° = 90°.', difficulty: 'EASY' },
    { examType: 'CAT', topic: 'Logical Reasoning', question: 'In a family, A is B\'s father, B is C\'s sister, D is C\'s mother. How is A related to D?', options: ['Brother', 'Father', 'Husband', 'Son'], answer: 'Husband', explanation: 'A is father of B, B is sister of C, D is mother of C. So A and D are parents of B and C — Husband and Wife.', difficulty: 'MEDIUM' },
    { examType: 'CAT', topic: 'Quantitative Ability', question: 'If the ratio of boys to girls is 3:2 and total students are 50, how many girls?', options: ['20', '30', '25', '15'], answer: '20', explanation: 'Girls = (2/5) × 50 = 20.', difficulty: 'EASY' },
  ];

  // --- UPSC Questions ---
  const upscQuestions = [
    { examType: 'UPSC', topic: 'Indian Polity', question: 'Which article of the Indian Constitution deals with the Right to Equality?', options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'], answer: 'Article 14', explanation: 'Article 14 guarantees equality before the law and equal protection of laws.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'Indian Polity', question: 'The Panchayati Raj system was constitutionalized through which amendment?', options: ['42nd', '73rd', '74th', '86th'], answer: '73rd', explanation: 'The 73rd Amendment Act 1992 gave constitutional status to Panchayati Raj Institutions.', difficulty: 'MEDIUM' },
    { examType: 'UPSC', topic: 'Geography', question: 'Which is the longest river in India?', options: ['Yamuna', 'Brahmaputra', 'Ganga', 'Godavari'], answer: 'Ganga', explanation: 'The Ganges (Ganga) is the longest river in India at approximately 2,525 km.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'History', question: 'Who was the first Governor-General of independent India?', options: ['Jawaharlal Nehru', 'Lord Mountbatten', 'C. Rajagopalachari', 'Sardar Patel'], answer: 'Lord Mountbatten', explanation: 'Lord Mountbatten served as the first Governor-General during the transition period.', difficulty: 'MEDIUM' },
    { examType: 'UPSC', topic: 'History', question: 'The Quit India Movement was launched in which year?', options: ['1940', '1942', '1944', '1946'], answer: '1942', explanation: 'The Quit India Movement was launched on August 8, 1942 by Mahatma Gandhi.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'Economics', question: 'What does GDP stand for?', options: ['Gross Domestic Product', 'General Development Plan', 'Global Distribution of Production', 'Gross Development Progress'], answer: 'Gross Domestic Product', explanation: 'GDP is the total market value of all goods and services produced within a country in a specific period.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'Economics', question: 'Which body regulates monetary policy in India?', options: ['SEBI', 'RBI', 'NITI Aayog', 'Finance Ministry'], answer: 'RBI', explanation: 'The Reserve Bank of India (RBI) is responsible for formulating and implementing monetary policy.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'Science & Technology', question: 'ISRO\'s Mars Orbiter Mission is also known as:', options: ['Chandrayaan', 'Mangalyaan', 'Gaganyaan', 'Aditya'], answer: 'Mangalyaan', explanation: 'Mangalyaan (Mars Craft) was India\'s first interplanetary mission, launched in 2013.', difficulty: 'EASY' },
    { examType: 'UPSC', topic: 'Indian Polity', question: 'How many Fundamental Rights are guaranteed by the Indian Constitution?', options: ['5', '6', '7', '8'], answer: '6', explanation: 'There are 6 fundamental rights: Equality, Freedom, Against Exploitation, Religion, Cultural & Educational, Constitutional Remedies.', difficulty: 'MEDIUM' },
    { examType: 'UPSC', topic: 'Geography', question: 'The Western Ghats are also known as:', options: ['Sahyadri', 'Vindhya', 'Aravalli', 'Nilgiri'], answer: 'Sahyadri', explanation: 'The Western Ghats are also known as Sahyadri mountains, running along India\'s western coast.', difficulty: 'EASY' },
  ];

  const allQuestions = [...gateQuestions, ...greQuestions, ...catQuestions, ...upscQuestions];

  for (const q of allQuestions) {
    await prisma.examQuestion.create({ data: q });
  }
  console.log(`✅ Created ${allQuestions.length} exam questions`);

  // ═══════════════════════════════════════════════════════════════
  // COMPANIES + QUESTIONS + EXPERIENCES
  // ═══════════════════════════════════════════════════════════════

  const companiesData = [
    {
      name: 'TCS',
      type: 'SERVICE',
      minCGPA: 6.0,
      requiredSkills: ['Java', 'SQL', 'Problem Solving', 'Communication'],
      averagePackage: '3.6 - 7 LPA',
      description: 'Tata Consultancy Services — India\'s largest IT services company.',
      logo: '🏢',
      questions: [
        { type: 'APTITUDE', question: 'A train 150m long passes a pole in 15 seconds. What is its speed?', options: ['10 m/s', '15 m/s', '36 km/h', '54 km/h'], answer: '36 km/h', difficulty: 'EASY', year: 2024, explanation: 'Speed = 150/15 = 10 m/s = 36 km/h' },
        { type: 'APTITUDE', question: 'If the price of an item is increased by 20% and then decreased by 20%, what is the net change?', options: ['No change', '4% decrease', '4% increase', '2% decrease'], answer: '4% decrease', difficulty: 'MEDIUM', year: 2024, explanation: '1.2 × 0.8 = 0.96 = 4% decrease' },
        { type: 'TECHNICAL', question: 'What is the output of: System.out.println(10 + 20 + "Hello")?', options: ['1020Hello', '30Hello', 'Hello1020', 'Error'], answer: '30Hello', difficulty: 'EASY', year: 2023, explanation: 'Left to right: 10+20=30, then 30+"Hello"="30Hello"' },
        { type: 'TECHNICAL', question: 'Which keyword is used to prevent method overriding in Java?', options: ['static', 'final', 'private', 'abstract'], answer: 'final', difficulty: 'EASY', year: 2023 },
        { type: 'HR', question: 'Why do you want to join TCS?', options: [], answer: null, difficulty: 'EASY', year: 2024, explanation: 'Focus on learning culture, global exposure, and growth opportunities.' },
        { type: 'CODING', question: 'Write a function to check if a string is a palindrome.', options: [], answer: null, difficulty: 'EASY', year: 2024, codeSnippet: 'function isPalindrome(str) {\n  return str === str.split("").reverse().join("");\n}' },
      ],
      experiences: [
        { role: 'Software Developer', year: 2024, rounds: ['Online Test (90 min: Aptitude + Coding)', 'Technical Interview (Java, DBMS, OS)', 'Managerial Round', 'HR Round'], tips: 'Focus on TCS NQT pattern. Practice aptitude and basic coding.', difficulty: 'EASY', outcome: 'Selected' },
        { role: 'System Engineer', year: 2023, rounds: ['TCS NQT Test', 'Technical Interview', 'HR Interview'], tips: 'Be thorough with your final year project. Revise OOP concepts.', difficulty: 'EASY', outcome: 'Selected' },
      ],
    },
    {
      name: 'Infosys',
      type: 'SERVICE',
      minCGPA: 6.0,
      requiredSkills: ['Java', 'Python', 'SQL', 'Problem Solving'],
      averagePackage: '3.6 - 5 LPA',
      description: 'Infosys — Global leader in consulting and digital services.',
      logo: '🏢',
      questions: [
        { type: 'APTITUDE', question: 'What comes next in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '36', '48'], answer: '42', difficulty: 'MEDIUM', year: 2024, explanation: 'Differences: 4, 6, 8, 10, 12. Next number = 30 + 12 = 42' },
        { type: 'APTITUDE', question: 'A and B together can do a work in 12 days. A alone can do it in 20 days. How long for B alone?', options: ['25 days', '30 days', '28 days', '35 days'], answer: '30 days', difficulty: 'MEDIUM', year: 2024, explanation: 'B rate = 1/12 - 1/20 = 1/30. B takes 30 days.' },
        { type: 'TECHNICAL', question: 'What is normalization in DBMS?', options: ['Making data bigger', 'Organizing data to reduce redundancy', 'Encrypting data', 'Compressing data'], answer: 'Organizing data to reduce redundancy', difficulty: 'EASY', year: 2023 },
        { type: 'TECHNICAL', question: 'What is the difference between stack and heap memory?', options: ['No difference', 'Stack for static, Heap for dynamic', 'Stack for dynamic, Heap for static', 'Both are same'], answer: 'Stack for static, Heap for dynamic', difficulty: 'MEDIUM', year: 2023 },
        { type: 'CODING', question: 'Find the second largest element in an array without sorting.', options: [], answer: null, difficulty: 'MEDIUM', year: 2024, codeSnippet: 'function secondLargest(arr) {\n  let first = -Infinity, second = -Infinity;\n  for (let n of arr) {\n    if (n > first) { second = first; first = n; }\n    else if (n > second && n !== first) second = n;\n  }\n  return second;\n}' },
      ],
      experiences: [
        { role: 'Systems Engineer', year: 2024, rounds: ['InfyTQ Online Test (Aptitude + Pseudo Code + Puzzle)', 'Technical Interview', 'HR Round'], tips: 'InfyTQ certification gives direct interview. Focus on pseudo code section.', difficulty: 'MEDIUM', outcome: 'Selected' },
      ],
    },
    {
      name: 'Wipro',
      type: 'SERVICE',
      minCGPA: 6.0,
      requiredSkills: ['Java', 'C++', 'SQL', 'Aptitude'],
      averagePackage: '3.5 - 6 LPA',
      description: 'Wipro — Leading global IT consulting and services company.',
      logo: '🏢',
      questions: [
        { type: 'APTITUDE', question: 'If 40% of a number is 200, what is the number?', options: ['400', '500', '600', '800'], answer: '500', difficulty: 'EASY', year: 2024, explanation: '0.4 × x = 200, x = 500' },
        { type: 'TECHNICAL', question: 'What is polymorphism in OOP?', options: ['Multiple inheritance', 'Same method different behavior', 'Data hiding', 'None'], answer: 'Same method different behavior', difficulty: 'EASY', year: 2023 },
        { type: 'CODING', question: 'Write a program to find the factorial of a number using recursion.', options: [], answer: null, difficulty: 'EASY', year: 2024, codeSnippet: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}' },
        { type: 'HR', question: 'Where do you see yourself in 5 years?', options: [], answer: null, difficulty: 'EASY', year: 2024 },
      ],
      experiences: [
        { role: 'Project Engineer', year: 2024, rounds: ['Online Assessment', 'Technical Round', 'HR Round'], tips: 'Focus on quantitative aptitude and basic programming concepts.', difficulty: 'EASY', outcome: 'Selected' },
      ],
    },
    {
      name: 'Amazon',
      type: 'PRODUCT',
      minCGPA: 7.0,
      requiredSkills: ['Data Structures', 'Algorithms', 'System Design', 'Python/Java'],
      averagePackage: '14 - 40 LPA',
      description: 'Amazon — World\'s largest e-commerce and cloud computing company.',
      logo: '📦',
      questions: [
        { type: 'CODING', question: 'Given an array of integers, find two numbers that add up to a target sum.', options: [], answer: null, difficulty: 'MEDIUM', year: 2024, codeSnippet: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}' },
        { type: 'CODING', question: 'Implement a function to detect a cycle in a linked list.', options: [], answer: null, difficulty: 'MEDIUM', year: 2024, codeSnippet: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}' },
        { type: 'TECHNICAL', question: 'Explain the difference between SQL and NoSQL databases.', options: ['No difference', 'SQL is structured, NoSQL is flexible', 'NoSQL is faster always', 'SQL cannot scale'], answer: 'SQL is structured, NoSQL is flexible', difficulty: 'MEDIUM', year: 2023, explanation: 'SQL uses structured tables with schemas; NoSQL offers flexible document/key-value storage.' },
        { type: 'TECHNICAL', question: 'What are the SOLID principles?', options: ['5 OOP design principles', 'A database concept', 'A testing framework', 'A deployment strategy'], answer: '5 OOP design principles', difficulty: 'HARD', year: 2023 },
      ],
      experiences: [
        { role: 'SDE-1', year: 2024, rounds: ['Online Assessment (2 coding questions, 90 min)', 'Phone Screen (DSA)', 'Onsite Round 1 (Coding + LP)', 'Onsite Round 2 (System Design)', 'Bar Raiser'], tips: 'Master Leadership Principles. Practice 200+ Leetcode medium/hard. Focus on Trees, Graphs, DP.', difficulty: 'HARD', outcome: 'Selected' },
      ],
    },
    {
      name: 'Google',
      type: 'PRODUCT',
      minCGPA: 8.0,
      requiredSkills: ['Data Structures', 'Algorithms', 'System Design', 'Problem Solving', 'Python/C++'],
      averagePackage: '20 - 50 LPA',
      description: 'Google — World\'s most innovative technology company.',
      logo: '🔍',
      questions: [
        { type: 'CODING', question: 'Given a string, find the length of the longest substring without repeating characters.', options: [], answer: null, difficulty: 'HARD', year: 2024, codeSnippet: 'function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) { set.delete(s[left]); left++; }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}' },
        { type: 'CODING', question: 'Implement LRU Cache with O(1) get and put operations.', options: [], answer: null, difficulty: 'HARD', year: 2024 },
        { type: 'TECHNICAL', question: 'How does a hash map work internally?', options: ['Linked list', 'Array + hash function + collision handling', 'Binary tree', 'Stack'], answer: 'Array + hash function + collision handling', difficulty: 'MEDIUM', year: 2023 },
      ],
      experiences: [
        { role: 'SDE L3', year: 2024, rounds: ['Online Coding Round (2 problems, 60 min)', 'Phone Interview (45 min coding)', 'Onsite Round 1 (Coding)', 'Onsite Round 2 (Coding)', 'Onsite Round 3 (System Design)', 'Googleyness & Leadership'], tips: 'Solve 300+ Leetcode. Focus on sliding window, two pointers, graphs, and DP. Practice system design.', difficulty: 'HARD', outcome: 'Selected' },
      ],
    },
    {
      name: 'Razorpay',
      type: 'STARTUP',
      minCGPA: 6.5,
      requiredSkills: ['JavaScript', 'Node.js', 'React', 'System Design', 'SQL'],
      averagePackage: '12 - 30 LPA',
      description: 'Razorpay — India\'s leading fintech startup for payment solutions.',
      logo: '💳',
      questions: [
        { type: 'CODING', question: 'Design a URL shortener service.', options: [], answer: null, difficulty: 'HARD', year: 2024 },
        { type: 'TECHNICAL', question: 'Explain event loop in Node.js.', options: ['Multi-threading', 'Single-threaded async I/O with callback queue', 'Process forking', 'None'], answer: 'Single-threaded async I/O with callback queue', difficulty: 'MEDIUM', year: 2023 },
        { type: 'TECHNICAL', question: 'What is the difference between REST and GraphQL?', options: ['No difference', 'REST uses endpoints, GraphQL uses queries', 'GraphQL is faster', 'REST is newer'], answer: 'REST uses endpoints, GraphQL uses queries', difficulty: 'MEDIUM', year: 2023 },
      ],
      experiences: [
        { role: 'SDE-1', year: 2024, rounds: ['Online Assessment (DSA + System Design MCQ)', 'Technical Round 1 (Coding)', 'Technical Round 2 (System Design)', 'Culture Fit Round'], tips: 'Strong in JavaScript ecosystem. Build side projects. Understand payments flow.', difficulty: 'HARD', outcome: 'Selected' },
      ],
    },
  ];

  for (const companyData of companiesData) {
    const { questions, experiences, ...companyFields } = companyData;
    const company = await prisma.company.create({ data: companyFields });

    for (const q of questions) {
      await prisma.placementQuestion.create({
        data: { ...q, companyId: company.id },
      });
    }

    for (const exp of experiences) {
      await prisma.interviewExperience.create({
        data: { ...exp, companyId: company.id },
      });
    }
    console.log(`  ✅ ${company.name}: ${questions.length} questions, ${experiences.length} experiences`);
  }

  console.log('\n🎉 Company seeding complete!');

  // ═══════════════════════════════════════════════════════════════
  // ALUMNI PROFILES
  // ═══════════════════════════════════════════════════════════════

  const alumniData = [
    { name: 'Rahul Sharma', email: 'rahul.alumni@vppcoe.com', password: '$2a$12$fake_hash_for_seeding_only_1', role: 'ALUMNI', college: 'VPPCOE', branch: 'Computer Engineering', profile: { company: 'Google', role: 'SDE-2', batchYear: 2020, linkedin: 'https://linkedin.com/in/rahulsharma', bio: 'VPPCOE 2020 CSE grad. Currently at Google Bangalore working on Search infrastructure. Happy to help juniors with DSA prep and US MS applications.' } },
    { name: 'Priya Deshmukh', email: 'priya.alumni@vppcoe.com', password: '$2a$12$fake_hash_for_seeding_only_2', role: 'ALUMNI', college: 'VPPCOE', branch: 'Information Technology', profile: { company: 'TCS', role: 'System Engineer → Lead', batchYear: 2019, linkedin: 'https://linkedin.com/in/priyadeshmukh', bio: 'Started at TCS in 2019, now leading a team of 12. Can guide on service company career paths and internal growth.' } },
    { name: 'Amit Patel', email: 'amit.alumni@vppcoe.com', password: '$2a$12$fake_hash_for_seeding_only_3', role: 'ALUMNI', college: 'VPPCOE', branch: 'Computer Engineering', profile: { company: 'Infosys', role: 'Technology Analyst', batchYear: 2021, linkedin: 'https://linkedin.com/in/amitpatel', bio: 'InfyTQ certified. Currently working in Infosys Pune. Can help with InfyTQ prep and Infosys interview tips.' } },
    { name: 'Sneha Kulkarni', email: 'sneha.alumni@vppcoe.com', password: '$2a$12$fake_hash_for_seeding_only_4', role: 'ALUMNI', college: 'VPPCOE', branch: 'Electronics & Telecom', profile: { company: 'Razorpay', role: 'Frontend Engineer', batchYear: 2021, linkedin: 'https://linkedin.com/in/snehakulkarni', bio: 'Moved from EXTC to tech! Self-taught React/Node.js. Now at Razorpay. Proof that branch doesn\'t matter if you have skills.' } },
    { name: 'Vikram Joshi', email: 'vikram.alumni@vppcoe.com', password: '$2a$12$fake_hash_for_seeding_only_5', role: 'ALUMNI', college: 'VPPCOE', branch: 'Computer Engineering', profile: { company: 'Georgia Tech (MS CS)', role: 'Graduate Student → Amazon SDE', batchYear: 2018, linkedin: 'https://linkedin.com/in/vikramjoshi', bio: 'Did MS from Georgia Tech, now SDE at Amazon Seattle. Can guide on GRE prep, university selection, and US tech interviews.' } },
  ];

  for (const alumni of alumniData) {
    const { profile, ...userData } = alumni;
    const user = await prisma.user.create({ data: userData });
    await prisma.alumniProfile.create({ data: { ...profile, userId: user.id } });
    console.log(`  ✅ Alumni: ${user.name} (${profile.company})`);
  }

  // Create an admin user
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@careerdev.ai',
      password: '$2a$12$fake_hash_for_admin_seeding',
      role: 'ADMIN',
      college: 'VPPCOE',
      branch: 'Computer Engineering',
    },
  });
  console.log('  ✅ Admin user created');

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
