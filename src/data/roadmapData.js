// src/data/roadmapData.js

export const ROADMAP_DATA = {
  1: {
    title: "1st Year: Foundations & Computational Thinking",
    desc: "Programming syntax, core logic building, memory basics, and Git hygiene.",
    skills: {
      "Product (Tier-1)": [
        { id: "p1_cpp", label: "C++ STL / Java Collections Mastery (Time Complexity basics)", done: false },
        { id: "p1_git", label: "Git Branching, Rebasing & GitHub Open Source contributions", done: true },
        { id: "p1_linux", label: "Linux Shell Scripting & Command Line Workflow", done: false },
        { id: "p1_math", label: "Discrete Mathematics & Number Theory for competitive coding", done: false }
      ],
      "FinTech / Startups": [
        { id: "f1_js", label: "Modern JavaScript (ES6+), Async/Await & Event Loop", done: false },
        { id: "f1_git", label: "Git & Version Control fundamentals", done: true },
        { id: "f1_web", label: "DOM Manipulation & Responsive Web Design (Tailwind/CSS)", done: false },
        { id: "f1_api", label: "Understanding HTTP methods & consuming public REST APIs", done: false }
      ],
      "Service (TCS Digital / Infosys DSE)": [
        { id: "s1_lang", label: "C Programming & Java Basics (Pointers, Memory, OOPs)", done: true },
        { id: "s1_apt", label: "Quantitative Aptitude: Number Systems & Arithmetic reasoning", done: false },
        { id: "s1_logic", label: "Basic Pattern Printing & Logical Flowcharts", done: false },
        { id: "s1_verbal", label: "Business Communication & Verbal Ability Foundations", done: false }
      ]
    },
    milestone: "Ship 1 Command Line Utility or Interactive Web Mini-App hosted on GitHub"
  },
  2: {
    title: "2nd Year: Core Data Structures & Backend Architectures",
    desc: "Master linear data structures, database normalization, and full-stack integration.",
    skills: {
      "Product (Tier-1)": [
        { id: "p2_dsa", label: "Arrays, LinkedLists, Binary Trees & Heaps (LeetCode 75)", done: false },
        { id: "p2_oops", label: "Object-Oriented Design Principles (SOLID) in C++/Java", done: false },
        { id: "p2_dbms", label: "Database Normalization, Indexing (B+ Trees) & SQL Practice", done: false },
        { id: "p2_hack", label: "Participate in 1 National Level College Hackathon", done: false }
      ],
      "FinTech / Startups": [
        { id: "f2_backend", label: "Production APIs with Node.js/Express or Python FastAPI", done: false },
        { id: "f2_sql", label: "Relational DBs (PostgreSQL) with Transactions & Foreign Keys", done: false },
        { id: "f2_auth", label: "JWT Authentication, Refresh Tokens & Cookie Security", done: false },
        { id: "f2_nosql", label: "Redis Caching basics & In-Memory session stores", done: false }
      ],
      "Service (TCS Digital / Infosys DSE)": [
        { id: "s2_dsa", label: "Data Structures Basics (Stacks, Queues, Sorting & Searching)", done: false },
        { id: "s2_db", label: "SQL Queries: Group By, Having, Joins & Subqueries", done: false },
        { id: "s2_cs", label: "Operating Systems Fundamentals: Process scheduling & Threads", done: false },
        { id: "s2_mock", label: "Aptitude Round Speed Practice (60 Questions in 60 Mins)", done: false }
      ]
    },
    milestone: "Build and deploy 1 Full-Stack CRUD Application with live Database"
  },
  3: {
    title: "3rd Year: High-Yield Problem Solving & Internships",
    desc: "Advanced algorithms, scalable system designs, and cold outreach for summer roles.",
    skills: {
      "Product (Tier-1)": [
        { id: "p3_adv_dsa", label: "Dynamic Programming, Graphs, Disjoint Sets (LeetCode 150)", done: false },
        { id: "p3_sys_des", label: "Low-Level & High-Level System Design (Rate Limiters, TinyURL)", done: false },
        { id: "p3_cloud", label: "Docker containerization & deployment on AWS/GCP", done: false },
        { id: "p3_referral", label: "LinkedIn alumni cold outreach & off-campus referrals", done: false }
      ],
      "FinTech / Startups": [
        { id: "f3_queue", label: "Asynchronous task processing with Redis Streams / RabbitMQ", done: false },
        { id: "f3_perf", label: "API profiling, database connection pooling & query optimization", done: false },
        { id: "f3_cicd", label: "Automated testing with Jest/Pytest & GitHub Actions CI/CD", done: false },
        { id: "f3_apply", label: "Target Wellfound (AngelList), YC WorkAtAStartup & Summer Internships", done: false }
      ],
      "Service (TCS Digital / Infosys DSE)": [
        { id: "s3_code_test", label: "Previous Year Coding Questions (TCS NQT, Infosys HackWithInfy)", done: false },
        { id: "s3_cn", label: "Computer Networks: OSI Layer, TCP/IP, DNS, Subnetting", done: false },
        { id: "s3_project", label: "Polish 1 Academic Major Project with clear architecture defense", done: false },
        { id: "s3_resume", label: "Resume alignment with college placement cell formats", done: false }
      ]
    },
    milestone: "Secure 1 Verified Summer Internship or Tier-1 Referral Interview Slot"
  },
  4: {
    title: "4th Year: Conversion Sprints & Premium Offers",
    desc: "Company-specific high-frequency patterns, behavioral STAR mastery, and offer negotiations.",
    skills: {
      "Product (Tier-1)": [
        { id: "p4_mock", label: "Conduct 5 Peer Mock Interviews with live whiteboard coding", done: false },
        { id: "p4_pyq", label: "Solve Top 50 questions tagged for Amazon, Microsoft & Google", done: false },
        { id: "p4_beh", label: "Prepare 7 STAR leadership scenarios (Conflict, Ambiguity, Failure)", done: false },
        { id: "p4_ats", label: "Audit resume metrics using impact action verbs and quantifiable results", done: false }
      ],
      "FinTech / Startups": [
        { id: "f4_takehome", label: "Crack 48-Hour backend take-home code assignments", done: false },
        { id: "f4_concurr", label: "Master DB concurrency locks, race conditions & idempotency", done: false },
        { id: "f4_founder", label: "Prepare for Founder/CTO cultural fit and vision alignment rounds", done: false },
        { id: "f4_offer", label: "Negotiate ESOPs, base compensation, and career growth ladder", done: false }
      ],
      "Service (TCS Digital / Infosys DSE)": [
        { id: "s4_speed", label: "Timed online aptitude test simulations with negative marking", done: false },
        { id: "s4_manager", label: "Managerial & HR situational question preparation", done: false },
        { id: "s4_doc", label: "Collate academic documents, verification certificates & transcripts", done: false },
        { id: "s4_convert", label: "Crack Day-1 on-campus drives and upgrade to Digital/Prime cadre", done: false }
      ]
    },
    milestone: "Secure Target Placement Offer & Transition to Industry Readiness"
  }
};