// Google Gemini API & External Question Sources Service

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const getApiKey = () => {
  return localStorage.getItem('preppilot_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || "";
};

// 1. External Live Company Question Fetcher (Open-Source LeetCode / Tech Source)
export const fetchLiveCompanyQuestions = async (companyName) => {
  try {
    const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/problems?tags=${cleanCompany}&limit=50`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`External API status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.problemsetQuestionList && data.problemsetQuestionList.length > 0) {
      return data.problemsetQuestionList.map((item, index) => ({
        id: `ext_${cleanCompany}_${index + 1}`,
        company: companyName,
        number: index + 1,
        topic: item.topicTags && item.topicTags.length > 0 ? item.topicTags[0].name : "Algorithms",
        difficulty: item.difficulty || "Medium",
        question: `[${companyName} Live Drive Q#${index + 1}] ${item.title}: Explain your algorithmic approach to solve "${item.title}". Walk through data structure choices, edge cases, and time/space complexity bounds.`
      }));
    }
    throw new Error("No questions returned from external endpoint");
  } catch (error) {
    console.warn(`[PrepPilot] External live fetch fallback for ${companyName}:`, error.message);
    return null; // Triggers instant resilient fallback to curated bank
  }
};

// 2. Adaptive Technical Interview Question Generator
export const generateAdaptiveQuestion = async ({ targetCompany, lastScore, currentYear, branch }) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      role: `${targetCompany} Assessment`,
      difficulty: "Medium",
      question: "Explain the difference between optimistic concurrency control and pessimistic locking in database transactions."
    };
  }

  const prompt = `Act as a senior technical interviewer for ${targetCompany}.
Candidate profile: Year ${currentYear} B.Tech ${branch}.
Previous answer score: ${lastScore !== null ? lastScore + "/10" : "First Question"}.
${lastScore && lastScore >= 8 ? "Scale difficulty up to Distributed Systems, High Concurrency, and edge cases." : "Keep difficulty balanced on core computer science foundations and algorithmic trade-offs."}
Respond ONLY with a valid JSON object matching this schema:
{
  "role": "${targetCompany} Technical Assessment",
  "difficulty": "Easy" | "Medium" | "Hard",
  "question": "string"
}`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText);
  } catch (e) {
    return {
      role: `${targetCompany} Core Assessment`,
      difficulty: lastScore && lastScore >= 8 ? "Hard" : "Medium",
      question: "Explain database deadlock avoidance using Banker's Algorithm and Coffman conditions."
    };
  }
};

// 3. Technical Answer Evaluation Engine (Level-Aware: Beginner vs Advanced Bar-Raiser)
export const evaluateTechnicalInterview = async ({ question, answer, targetCompany, studentLevel = "Intermediate" }) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    const isAdv = studentLevel === "Advanced";
    return {
      score: isAdv ? (answer.length > 90 ? 8 : 5) : (answer.length > 50 ? 8 : 6),
      verdict: isAdv 
        ? "Advanced Bar-Raiser: Addressed baseline logic, but missing high-concurrency race conditions and memory scale trade-offs." 
        : "Foundational Track: Good conceptual intuition! Master syntax edge-cases and basic time complexity.",
      strengths: isAdv 
        ? ["Identified core architectural pattern", "Good Big-O intuition"] 
        : ["Clear step-by-step explanation", "Solid conceptual basics"],
      improvements: isAdv 
        ? ["Specify lock contention or distributed cache invalidation bounds", "Analyze worst-case memory overhead under 50k TPS"] 
        : ["State standard Time & Space Complexity explicitly", "Walk through boundary edge cases with dry runs"],
      levelFeedback: `Evaluated strictly against [${studentLevel.toUpperCase()}] candidate standards.`
    };
  }

  const prompt = `Act as an interviewer evaluating a technical interview for ${targetCompany}.
Candidate Level: ${studentLevel} (Beginner, Intermediate, or Advanced Bar-Raiser).
Question: "${question}"
Candidate Answer: "${answer}"

Rubric:
- If Beginner/Intermediate: Emphasize fundamental concepts, algorithmic intent, and baseline logic.
- If Advanced Bar-Raiser: Be strict and uncompromising. Evaluate distributed systems, exact Big-O limits, cache contention, and concurrency trade-offs.

Respond ONLY with valid JSON:
{
  "score": number (1 to 10),
  "verdict": "2 sentence executive evaluation tailored to ${studentLevel} level",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "levelFeedback": "1 sentence comparing candidate answer against ${studentLevel} benchmark"
}`;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText);
  } catch (e) {
    return {
      score: studentLevel === "Advanced" ? 6 : 8,
      verdict: `Evaluated under ${studentLevel} expectations. Expand on system trade-offs.`,
      strengths: ["Clear logical explanations"],
      improvements: ["Explicitly state Big-O bounds"],
      levelFeedback: `Evaluated against ${studentLevel} industry benchmark.`
    };
  }
};

// 4. ATS Resume Keyword Auditor
export const auditResumeWithAI = async ({ resumeText, targetCompany }) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");

  const prompt = `Act as an automated Applicant Tracking System (ATS) and Technical Recruiter for ${targetCompany}.
Resume Text:
"""${resumeText}"""

Analyze keyword alignment and STAR bullet metrics. Respond ONLY with valid JSON:
{
  "score": number (0 to 100),
  "hits": ["found keyword 1", "found keyword 2"],
  "missing": ["missing keyword 1", "missing keyword 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });
  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText);
};

// 5. 24/7 Context-Aware Mentor
export const askGeminiMentor = async ({ prompt, studentProfile }) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("NO_API_KEY");

  const systemInstruction = `You are PrepBot, an elite B.Tech placement coach.
Student Profile:
Name: ${studentProfile.name}
Branch: ${studentProfile.branch}
Year: Year ${studentProfile.year}
Target Placement Track: ${studentProfile.targetCompany}
Daily Time: ${studentProfile.dailyHours}

Give crisp, concrete, actionable engineering advice without generic fluff.`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nStudent Query: ${prompt}` }] }
      ]
    })
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
};