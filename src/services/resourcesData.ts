// ──────────────────────────────────────────────────────────────────────────────
// India-specific mental health resources data
// All helpline numbers and links verified for India (2024-2025)
// ──────────────────────────────────────────────────────────────────────────────

export interface HelplineResource {
  name: string;
  phoneDisplay: string;
  phone: string;
  description: string;
  hours: string;
  link: string;
  linkLabel: string;
  badge?: string;
}

export interface Article {
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  link: string;
  source: string;
}

export interface AudioGuide {
  title: string;
  description: string;
  category: string;
  icon: string;
  youtubeId: string;
  duration: string;
}

export interface ProfessionalService {
  title: string;
  description: string;
  features: string[];
  link: string;
  linkLabel: string;
  badge: string;
  color: string;
}

// ─── Immediate Support / Helplines ───────────────────────────────────────────

export const helplines: HelplineResource[] = [
  {
    name: "Tele MANAS (Govt. of India)",
    phoneDisplay: "14416 / 1800-891-4416",
    phone: "14416",
    description:
      "National tele-mental health helpline by Ministry of Health & Family Welfare. Free counselling in 20 Indian languages.",
    hours: "Available 24x7",
    link: "https://telemanas.mohfw.gov.in",
    linkLabel: "Visit Tele MANAS",
    badge: "Government · Free",
  },
  {
    name: "iCall – TISS",
    phoneDisplay: "9152987821",
    phone: "9152987821",
    description:
      "Psychosocial helpline by Tata Institute of Social Sciences offering free, confidential counselling for stress, anxiety, and depression.",
    hours: "Mon – Sat · 8 AM – 10 PM",
    link: "https://icallhelpline.org",
    linkLabel: "Visit iCall",
    badge: "TISS · Free",
  },
  {
    name: "Vandrevala Foundation",
    phoneDisplay: "9999 666 555",
    phone: "9999666555",
    description:
      "24/7 mental health helpline offering crisis intervention, emotional support, and suicide prevention assistance across India.",
    hours: "Available 24x7",
    link: "https://www.vandrevalafoundation.com",
    linkLabel: "Visit Foundation",
    badge: "24/7 · Free",
  },
  {
    name: "Snehi",
    phoneDisplay: "044-24640050",
    phone: "04424640050",
    description:
      "Emotional support and suicide prevention helpline. Offers confidential listening and referral to professional help.",
    hours: "Available 24x7",
    link: "https://www.snehi.org.in",
    linkLabel: "Visit Snehi",
    badge: "NGO · Free",
  },
  {
    name: "iCall Email / Chat",
    phoneDisplay: "icall@tiss.edu",
    phone: "",
    description:
      "Email and chat-based counselling via iCall. Responses within 24 hours for non-urgent concerns.",
    hours: "Mon – Fri · 10:30 AM – 5:30 PM",
    link: "mailto:icall@tiss.edu",
    linkLabel: "Email iCall",
    badge: "Email · Free",
  },
  {
    name: "The Mind Clan (Directory)",
    phoneDisplay: "themindclan.com",
    phone: "",
    description:
      "India's inclusive mental health directory — find therapists, support groups, and peer listeners across cities and online.",
    hours: "Directory available anytime",
    link: "https://themindclan.com",
    linkLabel: "Find a Therapist",
    badge: "Directory",
  },
];

// ─── Educational Articles ─────────────────────────────────────────────────────

export const articles: Article[] = [
  {
    title: "Understanding Stress: Causes, Symptoms & Management",
    category: "Education",
    readTime: "6 min",
    excerpt:
      "Learn how chronic stress affects the body and mind, and discover evidence-based coping strategies used in Indian clinical settings.",
    link: "https://icallhelpline.org/stress/",
    source: "iCall – TISS",
  },
  {
    title: "Mental Health in India: Facts & Statistics",
    category: "Research",
    readTime: "5 min",
    excerpt:
      "WHO's latest data on mental health prevalence in India — 15% of the population needs active intervention, yet the treatment gap remains 80%+.",
    link: "https://www.who.int/india/health-topics/mental-health",
    source: "WHO India",
  },
  {
    title: "Breaking the Stigma Around Mental Health in India",
    category: "Community",
    readTime: "7 min",
    excerpt:
      "Explore the cultural and social barriers that prevent Indians from seeking help, and how we can collectively change the conversation.",
    link: "https://thelivelovelaughfoundation.org/latest-news",
    source: "The Live Love Laugh Foundation",
  },
  {
    title: "Anxiety Disorders: Symptoms, Types & Treatment",
    category: "Wellness",
    readTime: "8 min",
    excerpt:
      "A comprehensive overview of anxiety disorders — from generalised anxiety to panic attacks — with guidance on when to seek professional support.",
    link: "https://icallhelpline.org/anxiety/",
    source: "iCall – TISS",
  },
  {
    title: "Sleep and Mental Health: Why Rest Is Medicine",
    category: "Health",
    readTime: "5 min",
    excerpt:
      "The NIMHANS-backed science of how poor sleep amplifies stress and depression, with practical sleep hygiene tips.",
    link: "https://nimhans.ac.in/mental-health-education/",
    source: "NIMHANS",
  },
  {
    title: "Building Resilience: A Practical Indian Guide",
    category: "Wellness",
    readTime: "9 min",
    excerpt:
      "Amaha Health's guide to building emotional resilience using mindfulness, gratitude, and community — rooted in Indian cultural context.",
    link: "https://www.amahahealth.com/blog/resilience",
    source: "Amaha Health",
  },
];

// ─── Guided Audio Resources (Embedded YouTube) ───────────────────────────────

export const audioGuides: AudioGuide[] = [
  {
    title: "Indian Classical Root Chakra Meditation",
    description: "Deep, grounding Indian meditation music for inner peace.",
    category: "Meditation",
    icon: "🪕",
    youtubeId: "1ZYbU82GVz4",
    duration: "3 hr",
  },
  {
    title: "Bansuri Flute – Deep Healing",
    description: "Soothing bansuri flute frequencies for anxiety relief and healing.",
    category: "Healing",
    icon: "🎶",
    youtubeId: "syx3a1_LeFo",
    duration: "1 hr",
  },
  {
    title: "Morning Yoga Flute Music",
    description: "Uplifting and serene Indian flute compositions ideal for morning yoga.",
    category: "Yoga",
    icon: "🌿",
    youtubeId: "lFcSrYw-ARY",
    duration: "3 hr",
  },
  {
    title: "Guided Mindfulness (Hindi)",
    description: "Peaceful guided meditation for mental clarity and calm.",
    category: "Mindfulness",
    icon: "🧘",
    youtubeId: "77ZozI0rw7w",
    duration: "15 min",
  },
];

// ─── Professional Support ─────────────────────────────────────────────────────

export const professionalServices: ProfessionalService[] = [
  {
    title: "Amaha Health (InnerHour)",
    description:
      "Online therapy and psychiatry platform with licensed Indian psychologists. Book sessions in English, Hindi, and regional languages.",
    features: [
      "Licensed Indian therapists",
      "Online & in-clinic sessions",
      "Hindi & regional language support",
    ],
    link: "https://www.amahahealth.com",
    linkLabel: "Book a Session",
    badge: "Online Therapy",
    color: "from-mint-500 to-sky-500",
  },
  {
    title: "YourDOST",
    description:
      "India's largest online emotional wellness platform with 1000+ expert counselors, psychologists, and life coaches.",
    features: [
      "1000+ Indian experts",
      "Chat, call & video sessions",
      "Student & corporate plans",
    ],
    link: "https://yourdost.com",
    linkLabel: "Find a Counsellor",
    badge: "Counselling",
    color: "from-sky-500 to-blue-500",
  },
  {
    title: "Rocket Health India",
    description:
      "Judgement-free, confidential online therapy and psychiatry with certified professionals across India.",
    features: [
      "Certified psychiatrists & therapists",
      "Same-day appointments",
      "Affordable plans",
    ],
    link: "https://rockethealth.app",
    linkLabel: "Get Started",
    badge: "Therapy & Psychiatry",
    color: "from-orange-400 to-pink-400",
  },
  {
    title: "NIMHANS – National Institute",
    description:
      "India's premier mental health institute offering outpatient services, tele-consultation, and free resources in Bengaluru.",
    features: [
      "Government institution",
      "Outpatient & tele-consultation",
      "Free Tele MANAS integration",
    ],
    link: "https://nimhans.ac.in",
    linkLabel: "Visit NIMHANS",
    badge: "Government",
    color: "from-indigo-500 to-purple-500",
  },
];
