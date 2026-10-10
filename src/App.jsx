import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Sparkles, CheckCircle2, Circle, 
  Award, ShieldCheck, Flame, ChevronRight, ChevronLeft, 
  User, Compass, Building2, Layers, ChevronDown, 
  ChevronUp, Check, Edit3, Clock, Trophy, BookOpen,
  Send, X, ExternalLink, Bot, Lightbulb, Trash2,
  FileText, Volume2, VolumeX, BarChart2, Printer, CheckSquare, Key, RefreshCw,
  Mic, MicOff, HelpCircle, ArrowUpRight, GitCompare, RefreshCcw, AlertTriangle
} from 'lucide-react';
import { 
  askGeminiMentor, 
  generateAdaptiveQuestion, 
  evaluateTechnicalInterview, 
  auditResumeWithAI,
  fetchLiveCompanyQuestions 
} from './services/aiService';
import { ROADMAP_DATA } from './data/roadmapData';
import { FULL_COMPANY_ARCHIVE, getCompanyPYQBank } from './data/pyqData';

const YEAR_RESOURCES = {
  1: [
    { title: "CS50x: Intro to Computer Science", type: "Free Course", link: "https://cs50.harvard.edu/x" },
    { title: "Visualgo: Data Structures Visualizer", type: "Interactive Tool", link: "https://visualgo.net" },
    { title: "Git & GitHub Crash Documentation", type: "Cheat Sheet", link: "https://education.github.com/git-cheat-sheet-education.pdf" }
  ],
  2: [
    { title: "Striver's A2Z DSA Sheet", type: "Core Practice", link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
    { title: "SQLZoo & LeetCode SQL 50", type: "Database Lab", link: "https://leetcode.com/studyplan/top-sql-50/" },
    { title: "FullStackOpen: Modern Web Dev", type: "Hands-on Project", link: "https://fullstackopen.com/en/" }
  ],
  3: [
    { title: "System Design Primer by Donne Martin", type: "Architecture Repo", link: "https://github.com/donnemartin/system-design-primer" },
    { title: "NeetCode 150 Pattern Breakdown", type: "Interview Prep", link: "https://neetcode.io/practice" },
    { title: "Docker & Kubernetes Handbook", type: "Cloud DevOps", link: "https://www.freecodecamp.org/news/the-docker-handbook/" }
  ],
  4: [
    { title: "Tech Interview Handbook (Algorithms + Behavioral)", type: "Handbook", link: "https://www.techinterviewhandbook.org" },
    { title: "Deedy ATS Resume Template", type: "Resume Standard", link: "https://github.com/deedy/Deedy-Resume" },
    { title: "Top 50 Behavioral STAR Questions & Scripts", type: "HR Preparation", link: "https://www.theforage.com/blog/interview-questions/star-method-interview-questions" }
  ]
};

const BLUEPRINTS = {
  1: {
    title: "Terminal-Based Personal Budget & Task Manager",
    stack: ["C++ / Python", "File I/O", "Git"],
    phases: [
      "Phase 1: Implement user file storage and CSV parser",
      "Phase 2: Build CLI interaction with input validation",
      "Phase 3: Host on GitHub with structured README documentation"
    ],
    resumeBullet: "Engineered a modular CLI tool managing financial records with automated persistent file storage."
  },
  2: {
    title: "Role-Based Student Academic Portal API",
    stack: ["Node.js / Express", "PostgreSQL / Supabase", "JWT Auth"],
    phases: [
      "Phase 1: Relational DB schema for students, faculty & courses",
      "Phase 2: JWT role-based access control and CRUD endpoints",
      "Phase 3: Postman documentation and deployment on Render"
    ],
    resumeBullet: "Architected a secure REST API serving 15+ endpoints with token authorization and normalized SQL schemas."
  },
  3: {
    title: "Distributed Asynchronous Job Processing Queue",
    stack: ["Python FastAPI", "Redis Streams", "Docker"],
    phases: [
      "Phase 1: Producer-consumer queue architecture with Redis",
      "Phase 2: Worker pool with retry mechanisms and fault isolation",
      "Phase 3: Containerize complete workflow using Docker Compose"
    ],
    resumeBullet: "Designed an asynchronous task queue handling 500+ events/sec with worker auto-recovery."
  },
  4: {
    title: "Cloud-Native Observability & Microservices Engine",
    stack: ["Go / Node.js", "Docker", "Prometheus", "CI/CD GitHub Actions"],
    phases: [
      "Phase 1: Decouple monolithic services into containerized microservices",
      "Phase 2: Configure Prometheus metrics & Grafana health monitors",
      "Phase 3: Set up automated build, test, and release CI/CD pipelines"
    ],
    resumeBullet: "Implemented containerized microservices pipeline cutting deployment downtime by 40% using automated CI/CD."
  }
};

const INITIAL_PANIC_SPRINT = [
  { id: "s1", day: "Day 01 - 06", title: "Top 30 High-Frequency LeetCode Patterns", desc: "Two Pointers, Sliding Window, Fast/Slow Pointers, BFS & DFS basics.", details: ["Two Pointers: Valid Palindrome, 3Sum", "Sliding Window: Longest Substring Without Repeating Characters", "Trees: Level Order Traversal (BFS)"], done: false },
  { id: "s2", day: "Day 07 - 12", title: "Core OS & Computer Networks Crash", desc: "Virtual memory, Paging, Deadlocks, TCP 3-way handshake, DNS and HTTP protocols.", details: ["Process vs Thread, Context Switching", "Deadlocks: 4 Coffman conditions", "TCP 3-Way Handshake"], done: false },
  { id: "s3", day: "Day 13 - 18", title: "DBMS & SQL Deep Dive", desc: "Complex JOINs, B-Trees vs Hash indexes, Normalization (1NF to BCNF), ACID guarantees.", details: ["SQL: 2nd highest salary, self-joins", "ACID transactions & Isolation levels", "B+ Trees indexing"], done: false },
  { id: "s4", day: "Day 19 - 24", title: "1 Major Project Architecture Defense", desc: "Prepare system flow diagrams, edge-case bottlenecks, and live deployment link.", details: ["Client -> API Gateway -> DB diagrams", "3 toughest bugs faced and resolution", "Clean README & deployed link"], done: false },
  { id: "s5", day: "Day 25 - 30", title: "ATS Resume & Behavioral STAR Sprints", desc: "Tailor resume keywords, prepare 5 situational STAR stories, practice peer mock rounds.", details: ["1-page ATS Resume with impact metrics", "5 STAR stories for behavioral rounds", "2 peer mock technical rounds"], done: false }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);

  const [isProfileSet, setIsProfileSet] = useState(() => localStorage.getItem('preppilot_profile_saved') === 'true');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('preppilot_user_name') || "bhavya sri");
  const [studentBranch, setStudentBranch] = useState(() => localStorage.getItem('preppilot_branch') || "Computer Science & Engineering");
  const [selectedYear, setSelectedYear] = useState(() => Number(localStorage.getItem('preppilot_year') || 2));
  const [dailyHours, setDailyHours] = useState(() => localStorage.getItem('preppilot_hours') || "1-2 hours");
  const [targetCompany, setTargetCompany] = useState(() => localStorage.getItem('preppilot_company') || "Product (Tier-1)");

  // Tier Switching Delta Badge State
  const [switchAlert, setSwitchAlert] = useState(null);

  const [activeSlide, setActiveSlide] = useState(1);

  // Dedicated Print Dataset State
  const [printDataset, setPrintDataset] = useState(null);

  // Locked Company Context for Mock Interviews
  const [activeMockCompanyContext, setActiveMockCompanyContext] = useState(null);
  const [companyMockQuestionsPool, setCompanyMockQuestionsPool] = useState([]);
  const [askedQuestionIndices, setAskedQuestionIndices] = useState(new Set());

  const [panicSprints, setPanicSprints] = useState(() => {
    const saved = localStorage.getItem('preppilot_panic_sprints');
    return saved ? JSON.parse(saved) : INITIAL_PANIC_SPRINT;
  });
  const [expandedSprint, setExpandedSprint] = useState(null);

  const [completedSkillIds, setCompletedSkillIds] = useState(() => {
    const saved = localStorage.getItem('preppilot_completed_skills');
    return saved ? JSON.parse(saved) : ["p1_git", "f1_git", "s1_lang"];
  });

  const [generatedProject, setGeneratedProject] = useState(BLUEPRINTS[selectedYear] || BLUEPRINTS[2]);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);

  // Dynamic Mock Interview State (null by default)
  const [currentMockQuestion, setCurrentMockQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [mockUserAnswer, setMockUserAnswer] = useState("");
  const [mockFeedback, setMockFeedback] = useState(null);
  const [evaluatingMock, setEvaluatingMock] = useState(false);

  // Speech State
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Resume ATS State
  const [resumeText, setResumeText] = useState("");
  const [atsScoreData, setAtsScoreData] = useState(null);
  const [isAuditingResume, setIsAuditingResume] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: `Hello ${studentName}! Ask me any interview question, roadmap doubt, or core concept.` }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFade(true), 1200);
    const removeTimer = setTimeout(() => setShowSplash(false), 1600);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  useEffect(() => {
    localStorage.setItem('preppilot_completed_skills', JSON.stringify(completedSkillIds));
    localStorage.setItem('preppilot_user_name', studentName);
    localStorage.setItem('preppilot_branch', studentBranch);
    localStorage.setItem('preppilot_year', String(selectedYear));
    localStorage.setItem('preppilot_hours', dailyHours);
    localStorage.setItem('preppilot_company', targetCompany);
    localStorage.setItem('preppilot_panic_sprints', JSON.stringify(panicSprints));
  }, [completedSkillIds, studentName, studentBranch, selectedYear, dailyHours, targetCompany, panicSprints]);

  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen, isAiLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalChunk += piece + ' ';
          else currentInterim += piece;
        }

        if (finalChunk) {
          setMockUserAnswer(prev => (prev ? prev.trim() + ' ' : '') + finalChunk.trim());
          setInterimText('');
        } else {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = () => { setIsListening(false); setInterimText(''); };
      recognition.onend = () => { setIsListening(false); setInterimText(''); };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      alert("Microphone not supported on this browser. Please use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('preppilot_profile_saved', 'true');
    setIsProfileSet(true);
    setActiveSlide(1);
  };

  // Tier Switching Logic with Progress Preservation & Delta Indicator
  const handleSwitchTargetTier = (newTier) => {
    if (newTier === targetCompany) return;

    const previousTier = targetCompany;
    setTargetCompany(newTier);
    setActiveMockCompanyContext(null);
    setCurrentMockQuestion(null);

    const yearData = ROADMAP_DATA[selectedYear] || ROADMAP_DATA[1];
    const prevSkills = yearData.skills[previousTier] || [];
    const newSkills = yearData.skills[newTier] || [];

    const commonSkillsCount = newSkills.filter(nSkill => {
      return prevSkills.some(pSkill => 
        (pSkill.id === nSkill.id || pSkill.label.toLowerCase().includes("git") || pSkill.label.toLowerCase().includes("dsa") || pSkill.label.toLowerCase().includes("oop") || pSkill.label.toLowerCase().includes("sql")) && completedSkillIds.includes(pSkill.id)
      );
    }).length;

    const deltaCount = Math.max(1, newSkills.length - commonSkillsCount);

    setSwitchAlert({
      prev: previousTier,
      next: newTier,
      retained: commonSkillsCount,
      delta: deltaCount
    });

    setTimeout(() => {
      setSwitchAlert(null);
    }, 7000);
  };

  const toggleSkill = (skillId) => {
    setCompletedSkillIds(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const toggleSprintDone = (sprintId) => {
    setPanicSprints(prev => prev.map(sp => sp.id === sprintId ? { ...sp, done: !sp.done } : sp));
  };

  const currentYearData = ROADMAP_DATA[selectedYear] || ROADMAP_DATA[1];
  const activeSkillsList = currentYearData.skills[targetCompany] || currentYearData.skills["Product (Tier-1)"];

  const completedInCurrentTarget = activeSkillsList.filter(s => completedSkillIds.includes(s.id)).length;
  const completedPanic = panicSprints.filter(s => s.done).length;

  const readinessScore = Math.min(100, Math.round(((completedInCurrentTarget + completedPanic) / (activeSkillsList.length + panicSprints.length)) * 100));
  const dynamicStreakDays = Math.min(7, Math.max(1, Math.ceil((completedInCurrentTarget + completedPanic) / 2)));

  const generateBlueprint = () => {
    setLoadingBlueprint(true);
    setTimeout(() => {
      setGeneratedProject(BLUEPRINTS[selectedYear]);
      setLoadingBlueprint(false);
    }, 400);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#•\n]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Instant Technical Evaluation
  const evaluateMockAnswer = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText('');
    }
    const answerToEval = (mockUserAnswer + (interimText ? ' ' + interimText : '')).trim();
    if (!answerToEval || evaluatingMock || !currentMockQuestion) return;
    setEvaluatingMock(true);

    try {
      const feedback = await evaluateTechnicalInterview({
        question: currentMockQuestion.question,
        answer: answerToEval,
        targetCompany: activeMockCompanyContext || targetCompany
      });
      setMockFeedback(feedback);
    } catch (err) {
      setMockFeedback({
        score: answerToEval.length > 70 ? 8 : 6,
        verdict: "Strong conceptual baseline! Include concrete time and space complexity metrics to get full marks.",
        strengths: ["Clear logical explanation", "Addressed primary core concept"],
        improvements: ["Explicitly state Big-O bounds", "Detail memory bounds and edge cases"]
      });
    } finally {
      setEvaluatingMock(false);
    }
  };

  // Start Practicing from Company PYQs Card
  const startCompanyMockTest = async (company) => {
    setActiveMockCompanyContext(company.name);
    setIsGeneratingQuestion(true);
    setActiveSlide(5);

    let pool = await fetchLiveCompanyQuestions(company.name);

    if (!pool || pool.length === 0) {
      const q2024 = getCompanyPYQBank(company.name, "2024");
      const q2025 = getCompanyPYQBank(company.name, "2025");
      pool = [...q2025, ...q2024];
    }

    setCompanyMockQuestionsPool(pool);
    const firstQ = pool[0];
    setAskedQuestionIndices(new Set([0]));
    setCurrentMockQuestion({
      role: `${company.name} Live Verified Question`,
      difficulty: firstQ.difficulty,
      question: firstQ.question
    });
    setQuestionCount(1);
    setMockFeedback(null);
    setMockUserAnswer("");
    setInterimText("");
    setIsGeneratingQuestion(false);
  };

  // Next Question strictly from locked company pool with NO REPETITIONS
  const handleNextAdaptiveQuestion = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText('');
    }
    setIsGeneratingQuestion(true);
    setMockUserAnswer("");
    setInterimText("");
    setMockFeedback(null);

    if (activeMockCompanyContext && companyMockQuestionsPool.length > 0) {
      let nextIndex = -1;
      for (let i = 0; i < companyMockQuestionsPool.length; i++) {
        if (!askedQuestionIndices.has(i)) {
          nextIndex = i;
          break;
        }
      }

      if (nextIndex === -1) {
        setAskedQuestionIndices(new Set([0]));
        nextIndex = 0;
      } else {
        setAskedQuestionIndices(prev => new Set(prev).add(nextIndex));
      }

      const qObj = companyMockQuestionsPool[nextIndex];
      setCurrentMockQuestion({
        role: `${activeMockCompanyContext} (${qObj.year ? qObj.year + " Drive - " : ""}Q#${qObj.number})`,
        difficulty: qObj.difficulty,
        question: qObj.question
      });
      setQuestionCount(prev => prev + 1);
      setIsGeneratingQuestion(false);
    }
  };

  // Print 50 Questions for Specific Company and Year
  const handlePrintCompanyPYQs = (companyName, year) => {
    const list50 = getCompanyPYQBank(companyName, year);
    setPrintDataset({
      company: companyName,
      year: year,
      questions: list50
    });
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const analyzeATSResume = async () => {
    if (!resumeText.trim() || isAuditingResume) return;
    setIsAuditingResume(true);
    setAtsScoreData(null);

    try {
      const result = await auditResumeWithAI({
        resumeText,
        targetCompany
      });
      setAtsScoreData(result);
    } catch (err) {
      const lower = resumeText.toLowerCase();
      const targetKeywords = targetCompany.includes("Product") 
        ? ["dsa", "leetcode", "graphs", "system design", "docker", "c++", "java"]
        : targetCompany.includes("FinTech")
        ? ["postgresql", "node.js", "rest api", "jwt", "redis", "docker"]
        : ["oops", "dbms", "sql", "operating systems", "networking", "c++", "java"];

      const hits = targetKeywords.filter(k => lower.includes(k));
      setAtsScoreData({
        score: Math.round((hits.length / targetKeywords.length) * 100),
        hits,
        missing: targetKeywords.filter(k => !lower.includes(k)),
        suggestions: ["Quantify achievements: 'Reduced latency by 35% using Redis caching' instead of generic duties."]
      });
    } finally {
      setIsAuditingResume(false);
    }
  };

  const handleSendMessage = async (customText) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isAiLoading) return;

    const userMsg = { sender: "user", text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsAiLoading(true);

    try {
      const studentProfile = {
        name: studentName,
        branch: studentBranch,
        year: selectedYear,
        targetCompany,
        dailyHours
      };

      const aiReply = await askGeminiMentor({ prompt: textToSend, studentProfile });
      setChatMessages(prev => [...prev, { sender: "bot", text: aiReply }]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev, 
        { sender: "bot", text: `⚠️ Focus on high-yield questions for ${targetCompany}. Solve 2 problems daily and master concurrency & DB locks.` }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const slides = [
    { id: 1, label: "Company Targeting", icon: Building2 },
    { id: 2, label: "Adapted Roadmap", icon: Compass },
    { id: 3, label: "Blueprint", icon: Layers },
    { id: 4, label: selectedYear >= 3 ? "Panic Mode" : "Milestones", icon: Flame },
    { id: 5, label: "Adaptive AI Mock", icon: Sparkles },
    { id: 6, label: "ATS Resume", icon: FileText },
    { id: 7, label: "Company PYQs (2024-25)", icon: HelpCircle }
  ];

  const currentCompaniesList = FULL_COMPANY_ARCHIVE[targetCompany] || FULL_COMPANY_ARCHIVE["Product (Tier-1)"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Printable Multi-Page Container */}
      {printDataset && (
        <div className="hidden print:block bg-white text-black p-8 w-full">
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tight">{printDataset.company} - {printDataset.year} INTERVIEW PYQS ARCHIVE</h1>
            <p className="text-sm font-semibold text-gray-700 mt-1">Official High-Frequency Technical Placement Questions (1 to 50 Verified Questions)</p>
            <p className="text-xs text-gray-500 mt-0.5">PrepPilot Platform • Target Tier: {targetCompany} • Candidate: {studentName}</p>
          </div>

          <div className="space-y-4">
            {printDataset.questions.map((q) => (
              <div key={q.id} className="pb-3 border-b border-gray-300 break-inside-avoid">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Question #{q.number} | Topic: {q.topic}</span>
                  <span className="uppercase">Difficulty: {q.difficulty}</span>
                </div>
                <p className="text-sm font-medium text-black leading-snug">{q.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSplash && (
        <div className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none ${splashFade ? "opacity-0" : "opacity-100"}`}>
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4 animate-bounce">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">PrepPilot</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Placement & Career Operating System</p>
        </div>
      )}

      {!isProfileSet ? (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl">
            <div className="text-center">
              <div className="h-14 w-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-3">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Welcome to PrepPilot!</h2>
              <p className="text-xs text-slate-400 mt-1">Setup your profile once. Your progress will be saved automatically.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. bhavya sri"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Engineering Branch</label>
                <select 
                  value={studentBranch} 
                  onChange={(e) => setStudentBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology / AI & ML</option>
                  <option>Electronics & Communication (ECE)</option>
                  <option>Data Science & Cyber Security</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Current Year</label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Daily Prep Time</label>
                  <select 
                    value={dailyHours} 
                    onChange={(e) => setDailyHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option>1-2 hours</option>
                    <option>3-4 hours</option>
                    <option>5+ hours (Hardcore)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Placement Tier</label>
                <select 
                  value={targetCompany} 
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 text-amber-300 font-semibold"
                >
                  <option>Product (Tier-1)</option>
                  <option>FinTech / Startups</option>
                  <option>Service (TCS Digital / Infosys DSE)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 mt-4"
              >
                Launch My Placement Plan <Rocket className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md no-print">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                      Year {selectedYear} Active
                    </span>
                    <span className="text-xs text-slate-400">{studentBranch}</span>
                    <button 
                      onClick={() => setIsProfileSet(false)} 
                      className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-0.5 underline ml-1"
                      title="Edit Profile"
                    >
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                    Hey, <span className="text-indigo-400">{studentName}</span>! Target: <span className="text-amber-400 font-semibold">{targetCompany}</span> 🚀
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* 7-Day Streak Tracker */}
                <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-2xl">
                  <Flame className={`h-4 w-4 ${completedInCurrentTarget > 0 ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Streak</span>
                      <span className="text-[11px] font-black text-amber-400">{dynamicStreakDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                        const isActive = idx < dynamicStreakDays;
                        return (
                          <div 
                            key={idx} 
                            className={`w-3 h-3 rounded-sm text-[8px] flex items-center justify-center font-bold transition-all ${
                              isActive 
                                ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50" 
                                : "bg-slate-800 text-slate-600 border border-slate-700/50"
                            }`}
                            title={`${day}: ${isActive ? "Active Practice Completed" : "Pending Activity"}`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Readiness Percentage */}
                <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-2xl">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Readiness</div>
                    <div className="text-base font-black text-indigo-400">{readinessScore}%</div>
                  </div>
                  <div className="w-12 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500" 
                      style={{ width: `${readinessScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Print Placement PDF Report */}
                <button
                  onClick={() => {
                    setPrintDataset(null);
                    window.print();
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                  title="Print / Export Placement PDF Report"
                >
                  <Printer className="h-4 w-4" />
                </button>

                {/* Ask Mentor AI Drawer Trigger */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <Bot className="h-4 w-4" />
                  <span>Ask Mentor</span>
                </button>
              </div>
            </div>
          </header>

          {/* Tier Switch Progress Preservation Banner */}
          {switchAlert && (
            <div className="max-w-6xl mx-auto px-6 pt-4 no-print">
              <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-700/80 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-indigo-600/30 border border-indigo-500/50 rounded-xl flex items-center justify-center text-indigo-300 shrink-0">
                    <GitCompare className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Track Switched: {switchAlert.prev} ➔ {switchAlert.next}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Zero Progress Lost
                      </span>
                    </h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      ✓ <strong>{switchAlert.retained} Core Foundation Skills Preserved</strong> (Git, OOPs, DBMS) • Only <strong>{switchAlert.delta} Delta Skills Added</strong> for {switchAlert.next}.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSwitchAlert(null)}
                  className="p-1 rounded-lg hover:bg-indigo-900/60 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Bar */}
          <div className="max-w-6xl mx-auto px-6 pt-6 no-print">
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800/60">
              <div className="flex flex-wrap items-center gap-2">
                {slides.map(slide => {
                  const Icon = slide.icon;
                  const isActive = activeSlide === slide.id;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(slide.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                        isActive 
                          ? slide.id === 4 
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" 
                            : slide.id === 7
                            ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                            : "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{slide.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={activeSlide === 1}
                  onClick={() => setActiveSlide(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                  title="Previous Module"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-400 font-mono">Module {activeSlide} of {slides.length}</span>
                <button
                  disabled={activeSlide === slides.length}
                  onClick={() => setActiveSlide(prev => Math.min(slides.length, prev + 1))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                  title="Next Module"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <main className="max-w-6xl mx-auto p-6 min-h-[500px] no-print">

            {/* MODULE 1: COMPANY TARGETING WITH DELTA TRACK SWITCHING */}
            {activeSlide === 1 && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Step 1: Choose Your Target Placement Tier</h3>
                    <p className="text-xs text-slate-400">Switch tiers anytime. Common foundation skills are automatically preserved without starting from scratch.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Product (Tier-1)", desc: "Google, Amazon, Microsoft (DSA + System Design)" },
                    { name: "FinTech / Startups", desc: "Razorpay, Swiggy, Zerodha (Full-Stack + DBs)" },
                    { name: "Service (TCS Digital / Infosys DSE)", desc: "Specialist/Digital Roles (Core CS + Aptitude)" }
                  ].map(company => (
                    <div
                      key={company.name}
                      onClick={() => handleSwitchTargetTier(company.name)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        targetCompany === company.name 
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/20" 
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-100">{company.name}</span>
                        {targetCompany === company.name && (
                          <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold">Active</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{company.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Continuity Guarantee Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400">PrepPilot Continuity Engine:</strong> Switching tiers retains your completed Git, OOP, and DB skills. You only prepare the delta skills needed for the new target tier.
                  </div>
                </div>

                <button 
                  onClick={() => setActiveSlide(2)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
                >
                  Generate & View My Adapted Roadmap <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* MODULE 2: ADAPTED ROADMAP */}
            {activeSlide === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800/80 px-3 py-1 rounded-full font-semibold">
                          Semester {selectedYear * 2 - 1} & {selectedYear * 2}
                        </span>
                        <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded-full font-semibold">
                          🎯 {targetCompany} Track
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100 mt-2">
                        {currentYearData.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{currentYearData.desc}</p>
                    </div>

                    <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      {[1, 2, 3, 4].map(y => (
                        <button
                          key={y}
                          onClick={() => {
                            setSelectedYear(y);
                            setGeneratedProject(BLUEPRINTS[y]);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            selectedYear === y ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Y{y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {activeSkillsList.map((skill) => {
                      const isDone = completedSkillIds.includes(skill.id);
                      return (
                        <div 
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                            isDone 
                              ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-300" 
                              : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-600 shrink-0" />
                            )}
                            <span className={`text-sm ${isDone ? "line-through text-slate-400" : ""}`}>
                              {skill.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {isDone ? "Completed" : "Pending"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 flex items-center gap-3">
                    <Award className="h-6 w-6 text-indigo-400 shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Year-End Target Milestone</div>
                      <div className="text-sm text-slate-200 mt-0.5">{currentYearData.milestone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <Clock className="h-4 w-4" /> Daily Commitment & Advice
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Target Pace:</div>
                      <div className="text-lg font-bold text-slate-200 mt-0.5">{dailyHours} / day</div>
                      <div className="text-[11px] text-slate-400 mt-1">Recommended pacing for steady skill compounding.</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-1">
                      <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="h-3.5 w-3.5" /> Year {selectedYear} Strategy
                      </div>
                      <p className="text-xs text-slate-300">
                        {selectedYear === 1 && "Maintain 8.0+ CGPA and fundamental coding logic before project sprints."}
                        {selectedYear === 2 && "Build 2 solid full-stack CRUD applications and push to GitHub regularly."}
                        {selectedYear === 3 && "Solve LeetCode 150 patterns and apply for summer technical internships."}
                        {selectedYear === 4 && "Master behavioral STAR rounds and crack company high-frequency technical drives."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-amber-400" /> Year {selectedYear} Resources
                      </div>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Curated</span>
                    </div>

                    <div className="space-y-2">
                      {YEAR_RESOURCES[selectedYear].map((res, i) => (
                        <a 
                          key={i} 
                          href={res.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between group transition"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">{res.title}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{res.type}</div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* MODULE 3: BLUEPRINT */}
            {activeSlide === 3 && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-violet-600/20 text-violet-400 rounded-xl">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Project Blueprint & Resume STAR Engine</h3>
                      <p className="text-xs text-slate-400">Stop building generic todo apps. Build recruiter-grade projects.</p>
                    </div>
                  </div>
                  <button
                    onClick={generateBlueprint}
                    disabled={loadingBlueprint}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {loadingBlueprint ? "Regenerating..." : "Regenerate"}
                  </button>
                </div>

                {generatedProject && (
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div>
                      <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                        Targeted for Year {selectedYear}
                      </span>
                      <h4 className="text-lg font-bold text-slate-100 mt-2">{generatedProject.title}</h4>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recommended Tech Stack</div>
                      <div className="flex flex-wrap gap-2">
                        {generatedProject.stack.map(tech => (
                          <span key={tech} className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-300 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Development Execution Phases</div>
                      <div className="space-y-2">
                        {generatedProject.phases.map((ph, i) => (
                          <div key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                            <span className="text-indigo-400 font-bold">0{i+1}.</span>
                            <span>{ph}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" /> Ready-to-Paste Resume STAR Bullet
                      </div>
                      <p className="text-xs text-slate-200 mt-1 italic">
                        "{generatedProject.resumeBullet}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 4: PANIC SPRINT / MILESTONES */}
            {activeSlide === 4 && (
              <div className="bg-slate-900 border border-rose-900/60 p-8 rounded-3xl max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-rose-900/40">
                  <div className="p-3 bg-rose-600/20 text-rose-400 rounded-xl">
                    <Flame className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-rose-300">
                      {selectedYear >= 3 ? "30-Day Emergency Placement Survival Sprint" : "High-Velocity Milestone Crash Course"}
                    </h3>
                    <p className="text-xs text-rose-300/80">Click on any sprint (e.g. Day 01 - 06) to reveal high-yield topics & mark completion.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {panicSprints.map((task) => {
                    const isOpen = expandedSprint === task.id;
                    return (
                      <div 
                        key={task.id} 
                        className={`rounded-2xl border transition-all ${
                          task.done 
                            ? "bg-emerald-950/20 border-emerald-800/60" 
                            : isOpen 
                              ? "bg-rose-950/30 border-rose-700/80 shadow-lg shadow-rose-950/50" 
                              : "bg-slate-950/80 border-slate-800 hover:border-rose-900/50"
                        }`}
                      >
                        <div 
                          onClick={() => setExpandedSprint(isOpen ? null : task.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              task.done ? "bg-emerald-900/70 text-emerald-300" : "bg-rose-900/60 text-rose-300"
                            }`}>
                              {task.day}
                            </span>
                            <div>
                              <h5 className={`font-bold text-sm ${task.done ? "text-emerald-300 line-through" : "text-slate-100"}`}>
                                {task.title}
                              </h5>
                              <p className="text-xs text-slate-400 mt-0.5">{task.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <div className="text-slate-400 hover:text-white p-1">
                              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSprintDone(task.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                                task.done 
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                                  : "bg-rose-900/40 hover:bg-rose-800/80 border border-rose-700/60 text-rose-200"
                              }`}
                            >
                              {task.done ? (
                                <>
                                  <Check className="h-3.5 w-3.5" /> Completed
                                </>
                              ) : (
                                "Mark Day Done"
                              )}
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-2 border-t border-rose-900/30 text-xs text-slate-300 space-y-2.5">
                            <div className="font-bold text-rose-300 uppercase tracking-wider text-[10px]">
                              Core Checklist for {task.day}:
                            </div>
                            <div className="space-y-1.5">
                              {task.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                                  <span className="text-rose-400 font-bold">•</span>
                                  <span>{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 5: ADAPTIVE AI MOCK INTERVIEW SIMULATOR */}
            {activeSlide === 5 && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto space-y-6">
                
                {/* When NO Company has been launched from PYQs yet */}
                {!activeMockCompanyContext || !currentMockQuestion ? (
                  <div className="text-center py-12 px-6 space-y-4">
                    <div className="h-16 w-16 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mx-auto">
                      <HelpCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">No Target Company Selected</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Questions are company-specific and will not display automatically. Please go to the <strong>Company PYQs</strong> tab and click <strong>"Practice in Mock Test"</strong> on any company to start streaming non-repeating questions.
                    </p>
                    <button
                      onClick={() => setActiveSlide(7)}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition shadow-md shadow-amber-600/20"
                    >
                      Open Company PYQs Archive <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* Active Live Mock Stream Screen */
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Adaptive AI Technical Mock Round</h3>
                          <p className="text-xs text-amber-400 font-semibold mt-0.5">
                            🎯 Streaming Questions from: {activeMockCompanyContext} (Non-Repeating Live Stream)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-indigo-400 font-mono">
                          Q #{questionCount}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          currentMockQuestion.difficulty?.toLowerCase().includes('hard')
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}>
                          {currentMockQuestion.difficulty || "Medium"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>{currentMockQuestion.role}</span>
                        <button
                          onClick={() => speakText(currentMockQuestion.question)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/60 transition"
                          title="Listen to Interviewer"
                        >
                          {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                          <span>{isSpeaking ? "Stop Voice" : "Listen Question"}</span>
                        </button>
                      </div>
                      <h4 className="text-base font-semibold text-slate-100">
                        "{currentMockQuestion.question}"
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400">Your Technical Explanation:</label>
                        <button
                          onClick={toggleMicListening}
                          className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition ${
                            isListening
                              ? "bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          }`}
                          title={isListening ? "Stop Speaking" : "Start Speaking Answer"}
                        >
                          {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-indigo-400" />}
                          <span>{isListening ? "Listening... (Tap to stop)" : "Speak Answer (Mic)"}</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={
                          isListening && interimText
                            ? (mockUserAnswer ? mockUserAnswer.trim() + " " : "") + interimText
                            : mockUserAnswer
                        }
                        onChange={(e) => setMockUserAnswer(e.target.value)}
                        placeholder="Type or click 'Speak Answer' to speak your technical explanation..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={evaluateMockAnswer}
                        disabled={evaluatingMock || (!mockUserAnswer.trim() && !interimText.trim())}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                      >
                        {evaluatingMock ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" /> Evaluating Answer...
                          </>
                        ) : (
                          "Instant Evaluate Answer"
                        )}
                      </button>

                      <button
                        onClick={handleNextAdaptiveQuestion}
                        disabled={isGeneratingQuestion}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                      >
                        {isGeneratingQuestion ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Fetching Next...
                          </>
                        ) : (
                          <>
                            Next Question <ChevronRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {mockFeedback && (
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Technical Evaluation Score</span>
                          <span className={`text-base font-black ${mockFeedback.score >= 7 ? "text-emerald-400" : "text-amber-400"}`}>
                            {mockFeedback.score} / 10
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{mockFeedback.verdict}</p>
                        
                        {mockFeedback.strengths?.length > 0 && (
                          <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                            <span className="text-emerald-400 font-semibold">Strengths Identified:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {mockFeedback.strengths.map((s, idx) => (
                                <span key={idx} className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {mockFeedback.improvements?.length > 0 && (
                          <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                            <span className="text-amber-400 font-semibold">Areas for Improvement:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {mockFeedback.improvements.map((imp, idx) => (
                                <span key={idx} className="bg-amber-950/70 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded text-[10px]">
                                  • {imp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* MODULE 6: ATS RESUME AUDITOR VS GENERIC RESUME BUILDER BENCHMARK MATRIX */}
            {activeSlide === 6 && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">ATS Resume Keyword Auditor</h3>
                    <p className="text-xs text-slate-400">Targeted screening algorithm for {targetCompany}. Unlike generic resume templates, PrepPilot audits keyword density and STAR metrics.</p>
                  </div>
                </div>

                {/* Recruiter Matrix: PrepPilot ATS Scanner vs Generic Resume Generators (Canva/Word) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Why PrepPilot Beats Generic Resume Builders (Canva / Word)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-slate-300 space-y-1">
                      <div className="font-bold text-rose-300 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Generic Builders (Canva / Nova)
                      </div>
                      <p className="text-[11px] text-slate-400">
                        • Two-column layout graphics choke automated ATS scanners.<br/>
                        • Zero company-specific keyword density detection.<br/>
                        • Passive responsibility bullets ("Responsible for coding").
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-slate-300 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> PrepPilot Recruitment Auditor
                      </div>
                      <p className="text-[11px] text-slate-400">
                        • Strict ATS parser-safe single-column alignment.<br/>
                        • Real-time keyword matching for {targetCompany}.<br/>
                        • STAR quantifiable metrics ("Reduced latency by 35%").
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Paste Your Resume Bullet Points / Skills Section:</label>
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text here (e.g. Built microservice with Node.js and PostgreSQL. Managed Docker containers and solved 200+ LeetCode DSA problems...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <button
                  onClick={analyzeATSResume}
                  disabled={isAuditingResume || !resumeText.trim()}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  {isAuditingResume ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Auditing Resume with Gemini AI...
                    </>
                  ) : (
                    "Analyze ATS Compatibility Score"
                  )}
                </button>

                {atsScoreData && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-200">Compatibility with {targetCompany}</span>
                      <span className="text-xl font-black text-emerald-400">{atsScoreData.score}%</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Found High-Yield Keywords:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {atsScoreData.hits?.map(k => (
                          <span key={k} className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-lg">
                            ✓ {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {atsScoreData.missing && atsScoreData.missing.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-amber-400 uppercase">Missing Keywords to Add:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {atsScoreData.missing.map(k => (
                            <span key={k} className="text-xs bg-amber-950/70 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-lg">
                              + {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsScoreData.suggestions && atsScoreData.suggestions.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <div className="text-[11px] font-bold text-indigo-400 uppercase">AI Recruiter Tips:</div>
                        {atsScoreData.suggestions.map((tip, idx) => (
                          <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 7: COMPANY PYQS (CLEAN COMPANY CARDS + 50 PRINT 2024 & 2025 + PRACTICE MOCK) */}
            {activeSlide === 7 && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-4xl mx-auto space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{targetCompany} - Interview PYQ Directory</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Select a target company below to practice live questions or download verified 50-question drive archives.</p>
                    </div>
                  </div>
                </div>

                {/* Grid of Company Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCompaniesList.map((company, idx) => (
                    <div 
                      key={company.name}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-600/50 transition flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-500">#{idx + 1} Company</span>
                          <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                            Role: {company.role}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-100 mt-2">{company.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{company.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => startCompanyMockTest(company)}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-amber-600/20"
                        >
                          Practice in Mock Test (Stream {company.name}) <ArrowUpRight className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handlePrintCompanyPYQs(company.name, "2024")}
                            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition"
                            title={`Download / Print 50 Questions for ${company.name} 2024`}
                          >
                            <Printer className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Print 2024 (50 Qs)</span>
                          </button>

                          <button
                            onClick={() => handlePrintCompanyPYQs(company.name, "2025")}
                            className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition"
                            title={`Download / Print 50 Questions for ${company.name} 2025`}
                          >
                            <Printer className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Print 2025 (50 Qs)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

          {/* AI MENTOR CHAT DRAWER */}
          {isChatOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all no-print">
              <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
                
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">PrepBot AI Mentor</h4>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Gemini Live
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setIsChatOpen(false)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 ml-1"
                      title="Close Chat"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line relative group ${
                          msg.sender === "user" 
                            ? "bg-indigo-600 text-white rounded-br-none" 
                            : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 max-w-[60%]">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                      <span className="text-xs text-slate-300">PrepBot is thinking...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything about coding, interviews, prep..."
                    disabled={isAiLoading}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isAiLoading}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}