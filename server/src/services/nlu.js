// Local "AI" brain — keyless intent recognition, sentiment, and multilingual replies.
// This is the default. If USE_OLLAMA=true, ollama.js is tried first and falls back here.

const GREETING = {
  en: "Hi! I'm Bee, your AllBee assistant. How can I help — courses, jobs, or business?",
  ta: "வணக்கம்! நான் பீ. படிப்பு, வேலை அல்லது வணிகம் — எப்படி உதவலாம்?",
  hi: "नमस्ते! मैं बी हूँ। कोर्स, नौकरी या बिज़नेस — कैसे मदद करूँ?",
  ml: "നമസ്കാരം! ഞാൻ ബീ. കോഴ്സ്, ജോലി അല്ലെങ്കിൽ ബിസിനസ് — എങ്ങനെ സഹായിക്കാം?",
  te: "నమస్తే! నేను బీ. కోర్సులు, ఉద్యోగాలు లేదా వ్యాపారం — ఎలా సహాయం చేయను?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ಬೀ. ಕೋರ್ಸ್, ಉದ್ಯೋಗ ಅಥವಾ ವ್ಯಾಪಾರ — ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  ur: "السلام علیکم! میں بی ہوں۔ کورس، نوکری یا کاروبار — کیسے مدد کروں؟",
  ar: "مرحبًا! أنا بي. الدورات أو الوظائف أو الأعمال — كيف أساعدك؟",
  fr: "Bonjour ! Je suis Bee. Cours, emplois ou entreprise — comment puis-je aider ?",
  de: "Hallo! Ich bin Bee. Kurse, Jobs oder Business — wie kann ich helfen?",
  es: "¡Hola! Soy Bee. Cursos, empleos o negocios — ¿cómo te ayudo?",
  zh: "你好！我是 Bee。课程、工作还是业务，我能帮什么忙？",
  ja: "こんにちは！Bee です。コース、仕事、ビジネス — どうお手伝いしましょう？",
};

const POS = ['thank', 'thanks', 'great', 'perfect', 'love', 'awesome', 'good', 'helpful', 'excellent'];
const NEG = ['bad', 'angry', 'terrible', 'useless', 'hate', 'worst', 'problem', 'broken', 'frustrat'];

export function sentiment(text) {
  const t = text.toLowerCase();
  const p = POS.some((w) => t.includes(w));
  const n = NEG.some((w) => t.includes(w));
  if (p && !n) return 'positive';
  if (n && !p) return 'negative';
  return 'neutral';
}

export function classify(text) {
  const t = text.toLowerCase();
  const has = (...w) => w.some((x) => t.includes(x));
  if (has('enroll', 'admission', 'register', 'join the program', 'sign up')) return 'enroll';
  if (has('advisor', 'counsel', 'guidance counselor')) return 'advisor';
  if (has('interview', 'simulation', 'practice interview')) return 'interview';
  if (has('resume', 'cv')) return 'resume';
  if (has('course', 'learn', 'study', 'syllabus', 'exam', 'programming help', 'python', 'react', 'class', 'fee', 'tuition')) return 'education';
  if (has('job', 'vacancy', 'vacancies', 'hiring', 'apply', 'career', 'salary', 'role', 'position')) return 'jobs';
  if (has('website', 'web site', 'web development')) return 'biz_web';
  if (has('mobile app', 'app development', 'ios', 'android')) return 'biz_app';
  if (has('software development', 'custom software', 'crm', 'erp')) return 'biz_software';
  if (has('marketing', 'seo', 'ads', 'social media')) return 'biz_marketing';
  if (has('design', 'logo', 'branding', 'graphic')) return 'biz_design';
  if (has('consult', 'meeting', 'book', 'appointment', 'business', 'quote', 'enterprise')) return 'business';
  if (has('lead', 'crm', 'customers')) return 'admin';
  if (has('call', 'phone', 'speak to human', 'transfer', 'agent')) return 'call';
  if (has('hello', 'hi ', 'hey', 'vanakkam', 'namaste', 'bonjour', 'hola', 'salam', 'marhaba')) return 'greet';
  if (has('thank', 'thanks', 'bye', 'goodbye')) return 'thanks';
  if (has('what can you do', 'help', 'features', 'capabilities')) return 'help';
  return 'fallback';
}

const REPLY = {
  greet: (lang) => GREETING[lang] || GREETING.en,
  help: () => "I'm a full AI ecosystem for AllBee. I can recommend courses, search jobs, build your resume, run interview practice, take business inquiries, capture leads, and work in 13+ languages. What would you like?",
  education: () => "We have Software Development, Programming Help, and Exam Prep tracks. The full-stack program is $2,499 with EMI from $199/mo and a 15% early-bird discount. Want me to enroll you?",
  enroll: () => "Great choice! I'll start your enrollment for the full-stack program. I just need your name and mobile number to reserve your seat.",
  advisor: () => "Connecting you with an admission advisor. Let me grab a few details so they can call you back.",
  interview: () => "Starting your AI interview simulation. First question: Tell me about a challenging project and how you optimized its performance. Take your time.",
  resume: () => "Upload your resume and I'll analyze your skills against current market demand, then suggest certifications to boost your salary.",
  jobs: () => "Searching live IT roles… great matches: Senior React Architect (remote, $140k–$170k), Cybersecurity Lead in Munich, and a Go Backend role in Berlin. Want me to apply to any?",
  biz_web: () => "We build modern, fast, responsive websites. Typical timeline is 3–6 weeks. Let me capture your requirements for a quote.",
  biz_app: () => "We develop cross-platform iOS & Android apps. Share your idea and I'll book a consultation with our mobile team.",
  biz_software: () => "We deliver custom software — CRM, ERP, dashboards, automation. Let me note your requirement and notify a solutions architect.",
  biz_marketing: () => "Our digital marketing covers SEO, paid ads, and social growth. I'll capture your goals so the growth team can reach out.",
  biz_design: () => "Our design studio handles brand identity, logos, and visuals. Tell me about your brand and I'll set up a design consultation.",
  business: () => "Let's scale your business with Bee. Drop your name, mobile, and the service you need and our team will reach out.",
  admin: () => "Opening analytics: 2,842+ total leads, thousands of calls handled at 98%+ success, and dozens of active voice sessions.",
  call: () => "I can handle the call or transfer you to a human agent. I've logged your request and a specialist will ring you shortly.",
  thanks: () => "You're welcome! All Problems, Bee Solutions. 🐝 Anything else?",
  fallback: () => "I can help with courses, jobs, resumes, interviews, and business services. Try: \"Find me React jobs\", \"Tell me about courses\", or \"I need a website built\".",
};

// route hint tells the frontend which screen to open
const ROUTE = {
  education: 'education', enroll: 'education', advisor: 'business', interview: 'jobs',
  resume: 'jobs', jobs: 'jobs', biz_web: 'business', biz_app: 'business',
  biz_software: 'business', biz_marketing: 'business', biz_design: 'business',
  business: 'business', admin: 'admin',
};

export function localReply(text, lang = 'en') {
  const intent = classify(text);
  return {
    intent,
    sentiment: sentiment(text),
    route: ROUTE[intent] || null,
    reply: (REPLY[intent] || REPLY.fallback)(lang),
    engine: 'local',
  };
}
