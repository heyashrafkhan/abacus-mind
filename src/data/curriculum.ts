export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  order: number;
  content: LessonContent[];
  quiz: QuizQuestion[];
}

export interface LessonContent {
  type: 'text' | 'abacus_demo' | 'tip' | 'interactive';
  text?: string;
  demoValue?: number;
  tipTitle?: string;
  tipText?: string;
  instruction?: string;
  targetValue?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'abacus_set' | 'multiple_choice' | 'mental';
  targetValue?: number;
  options?: string[];
  correctOption?: number;
}

export const levels = [
  { id: 1, name: 'Explorer', description: 'Learn bead values and counting 1-10', color: '#4ECDC4', icon: 'Compass' },
  { id: 2, name: 'Apprentice', description: 'Place value and complements of 5 & 10', color: '#FF9F43', icon: 'BookOpen' },
  { id: 3, name: 'Scholar', description: 'Multi-digit operations and multiplication', color: '#A855F7', icon: 'GraduationCap' },
  { id: 4, name: 'Expert', description: 'Mental abacus and speed training', color: '#FF6B6B', icon: 'Zap' },
  { id: 5, name: 'Master', description: 'Advanced operations and decimals', color: '#FFD93D', icon: 'Crown' },
];

export const lessons: Lesson[] = [
  {
    id: 'l1-1',
    title: 'Meet the Abacus',
    description: 'Learn the parts of the abacus and what each bead represents.',
    level: 1,
    order: 1,
    content: [
      { type: 'text', text: 'Welcome! The abacus is a magical counting tool that has been used for thousands of years. Let\'s learn how it works!' },
      { type: 'tip', tipTitle: 'Did You Know?', tipText: 'The abacus was invented over 2,000 years ago and is still used today!' },
      { type: 'text', text: 'This abacus has a special rod called the beam. Beads below the beam are called EARTH BEADS. Each earth bead is worth 1. Beads above the beam are called HEAVEN BEADS. Each heaven bead is worth 5.' },
      { type: 'abacus_demo', demoValue: 0, text: 'This is the starting position. All earth beads are down, and heaven beads are up. The value is ZERO.' },
      { type: 'abacus_demo', demoValue: 1, text: 'To show 1, push ONE earth bead up to the beam.' },
      { type: 'abacus_demo', demoValue: 5, text: 'To show 5, push the heaven bead DOWN to the beam.' },
      { type: 'interactive', instruction: 'Try setting the abacus to 3 by pushing 3 earth beads up on the ones rod!', targetValue: 3 },
    ],
    quiz: [
      { id: 'q1', question: 'Set the abacus to show 2', type: 'abacus_set', targetValue: 2 },
      { id: 'q2', question: 'Set the abacus to show 7 (hint: 5 + 2)', type: 'abacus_set', targetValue: 7 },
      { id: 'q3', question: 'What is the value of one heaven bead?', type: 'multiple_choice', options: ['1', '5', '10', '7'], correctOption: 1 },
    ],
  },
  {
    id: 'l1-2',
    title: 'Counting to 10',
    description: 'Practice counting from 1 to 10 using the abacus.',
    level: 1,
    order: 2,
    content: [
      { type: 'text', text: 'Now let\'s count to 10! On a single rod, the maximum value is 9 (one heaven bead = 5, plus four earth beads = 4, total = 9).' },
      { type: 'abacus_demo', demoValue: 9, text: 'This is 9. The heaven bead (5) plus all four earth beads (4) equals 9.' },
      { type: 'interactive', instruction: 'Show me the number 6 on the abacus!', targetValue: 6 },
    ],
    quiz: [
      { id: 'q1', question: 'Set the abacus to 4', type: 'abacus_set', targetValue: 4 },
      { id: 'q2', question: 'Set the abacus to 9', type: 'abacus_set', targetValue: 9 },
      { id: 'q3', question: 'Set the abacus to 8', type: 'abacus_set', targetValue: 8 },
    ],
  },
  {
    id: 'l2-1',
    title: 'Place Value',
    description: 'Understand ones, tens, and hundreds columns.',
    level: 2,
    order: 1,
    content: [
      { type: 'text', text: 'An abacus has many rods. The rightmost rod is the ONES place. The next rod to the left is the TENS place. The next is the HUNDREDS place!' },
      { type: 'abacus_demo', demoValue: 10, text: 'This is 10. Zero in the ones place, and one earth bead up in the tens place.' },
      { type: 'abacus_demo', demoValue: 25, text: 'This is 25. Two tens (20) plus five ones (5).' },
      { type: 'interactive', instruction: 'Can you show 13? (One ten and three ones)', targetValue: 13 },
    ],
    quiz: [
      { id: 'q1', question: 'Show 10 on the abacus', type: 'abacus_set', targetValue: 10 },
      { id: 'q2', question: 'Show 21 on the abacus', type: 'abacus_set', targetValue: 21 },
      { id: 'q3', question: 'Show 50 on the abacus', type: 'abacus_set', targetValue: 50 },
    ],
  },
  {
    id: 'l2-2',
    title: 'Complements of 10',
    description: 'Learn number pairs that add up to 10.',
    level: 2,
    order: 2,
    content: [
      { type: 'text', text: 'Complements of 10 are pairs of numbers that add up to 10. They are super important for fast abacus calculation!' },
      { type: 'tip', tipTitle: 'Complement Pairs', tipText: '1+9, 2+8, 3+7, 4+6, 5+5. Memorize these!' },
      { type: 'interactive', instruction: 'Set the abacus to 7. What number added to 7 makes 10?', targetValue: 7 },
    ],
    quiz: [
      { id: 'q1', question: 'Show 6 on the abacus. What is its complement to 10?', type: 'multiple_choice', options: ['3', '4', '5', '6'], correctOption: 0 },
      { id: 'q2', question: 'Show 3 on the abacus. What is its complement to 10?', type: 'multiple_choice', options: ['6', '7', '8', '9'], correctOption: 0 },
    ],
  },
  {
    id: 'l3-1',
    title: 'Simple Addition',
    description: 'Add single-digit numbers on the abacus.',
    level: 3,
    order: 1,
    content: [
      { type: 'text', text: 'Let\'s add! To add a number, simply push up more beads. Start with 3, then add 4. Push up 4 more earth beads. 3 + 4 = 7!' },
      { type: 'abacus_demo', demoValue: 7, text: 'Starting from 3, we added 4 earth beads to get 7.' },
      { type: 'interactive', instruction: 'Show 2 + 5 = ?', targetValue: 7 },
    ],
    quiz: [
      { id: 'q1', question: 'Solve 4 + 3 using the abacus', type: 'abacus_set', targetValue: 7 },
      { id: 'q2', question: 'Solve 5 + 2 using the abacus', type: 'abacus_set', targetValue: 7 },
      { id: 'q3', question: 'Solve 1 + 8 using the abacus', type: 'abacus_set', targetValue: 9 },
    ],
  },
  {
    id: 'l3-2',
    title: 'Intro to Multiplication',
    description: 'Learn how to multiply by repeatedly adding beads.',
    level: 3,
    order: 2,
    content: [
      { type: 'text', text: 'Multiplication is just adding the same number many times. 2 x 3 is the same as 2 + 2 + 2!' },
      { type: 'abacus_demo', demoValue: 6, text: 'To do 2 x 3, we add 2 beads, then another 2, then another 2. Total is 6.' },
      { type: 'interactive', instruction: 'Can you show 3 x 3? (Add 3, then 3, then 3)', targetValue: 9 },
    ],
    quiz: [
      { id: 'q1', question: 'Solve 2 x 4 using the abacus', type: 'abacus_set', targetValue: 8 },
      { id: 'q2', question: 'Solve 3 x 2 using the abacus', type: 'abacus_set', targetValue: 6 },
    ],
  },
  {
    id: 'l4-1',
    title: 'Mental Abacus Basics',
    description: 'Start picturing the abacus in your head.',
    level: 4,
    order: 1,
    content: [
      { type: 'text', text: 'Mental abacus (Anzan) is when you picture the abacus in your mind and move the beads without look at a real one!' },
      { type: 'tip', tipTitle: 'Start Small', tipText: 'Practice mental math with single digits first. Imagine pushing the beads in your head!' },
      { type: 'interactive', instruction: 'Imagine the abacus. Now solve: 2 + 3. What is the answer?', targetValue: 5 },
    ],
    quiz: [
      { id: 'q1', question: 'Mental math: 1 + 2 = ?', type: 'multiple_choice', options: ['2', '3', '4', '5'], correctOption: 1 },
      { id: 'q2', question: 'Mental math: 4 + 4 = ?', type: 'multiple_choice', options: ['6', '7', '8', '9'], correctOption: 2 },
    ],
  },
  {
    id: 'l4-2',
    title: 'Mental Speed Training',
    description: 'Solve problems faster and faster in your mind.',
    level: 4,
    order: 2,
    content: [
      { type: 'text', text: 'The key to speed is automaticity. When you see 5+2, you shouldn\'t think "five plus two", you should just "see" the heaven bead and two earth beads!' },
      { type: 'interactive', instruction: 'Quickly show 7 on the abacus!', targetValue: 7 },
    ],
    quiz: [
      { id: 'q1', question: 'Quick! Solve 3 + 5 mentally', type: 'multiple_choice', options: ['7', '8', '9', '10'], correctOption: 1 },
      { id: 'q2', question: 'Quick! Solve 9 - 4 mentally', type: 'multiple_choice', options: ['3', '4', '5', '6'], correctOption: 2 },
    ],
  },
  {
    id: 'l5-1',
    title: 'Division Basics',
    description: 'Learn to divide by removing groups of beads.',
    level: 5,
    order: 1,
    content: [
      { type: 'text', text: 'Division is the opposite of multiplication. It\'s like sharing beads equally into groups.' },
      { type: 'abacus_demo', demoValue: 0, text: 'To divide 6 by 2, we start with 6 beads and remove 2 beads at a time until none are left. We did that 3 times!' },
      { type: 'interactive', instruction: 'Show 8 / 2 = ?', targetValue: 4 },
    ],
    quiz: [
      { id: 'q1', question: 'Solve 9 / 3 using the abacus', type: 'abacus_set', targetValue: 3 },
      { id: 'q2', question: 'Solve 10 / 2 using the abacus', type: 'abacus_set', targetValue: 5 },
    ],
  },
  {
    id: 'l5-2',
    title: 'Decimal Abacus',
    description: 'Using the abacus for decimal numbers.',
    level: 5,
    order: 2,
    content: [
      { type: 'text', text: 'We can use the abacus for decimals too! We just decide that one rod represents the decimal point.' },
      { type: 'abacus_demo', demoValue: 1, text: 'If the ones rod is our point, the rod to the right is the 0.1 place. So one bead there is 0.1!' },
      { type: 'interactive', instruction: 'Show 1.2 on the abacus (one ten, two ones)', targetValue: 12 },
    ],
    quiz: [
      { id: 'q1', question: 'Show 0.5 on the abacus (heaven bead on the 0.1 rod)', type: 'abacus_set', targetValue: 5 },
      { id: 'q2', question: 'Show 1.5 on the abacus', type: 'abacus_set', targetValue: 15 },
    ],
  },
];

export function getLessonsByLevel(levelId: number): Lesson[] {
  return lessons.filter(l => l.level === levelId).sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id);
}
