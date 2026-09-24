import { EnglishLevel } from './levels';

export interface RoleplayScenario {
  id: string;
  title: string;
  category: string;
  level: EnglishLevel;
  iconName: string;
  description: string;
  userRole: string;
  aiRole: string;
  objective: string;
  initialAiGreeting: string;
  keyPhrases: string[];
  evaluationCriteria: string[];
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  // BEGINNER SCENARIOS
  {
    id: 'cafe_order',
    title: 'Ordering at a Cozy Cafe',
    category: 'Daily Life',
    level: 'beginner',
    iconName: 'coffee',
    description: 'Order food and drinks, ask about dairy alternatives, and pay at a local coffee shop.',
    userRole: 'Customer',
    aiRole: 'Barista (Alex)',
    objective: 'Order a coffee with oat milk and a pastry, confirm the price, and complete payment politely.',
    initialAiGreeting: "Welcome to Sunrise Brew! What can I get started for you today?",
    keyPhrases: ["I'd like a...", "Could I get that with oat milk?", "How much is that?", "Can I pay by card?"],
    evaluationCriteria: ['Polite greeting & ordering expressions', 'Clear questions about menu/price', 'Appropriate responses to questions'],
  },
  {
    id: 'hotel_checkin',
    title: 'Hotel Check-In & Room Inquiries',
    category: 'Travel & Hospitality',
    level: 'beginner',
    iconName: 'bed',
    description: 'Check into your hotel reservation, request an upper floor room, and ask for the Wi-Fi password.',
    userRole: 'Guest',
    aiRole: 'Front Desk Receptionist (Marcus)',
    objective: 'Give your booking name, clarify room preferences, and ask about breakfast hours.',
    initialAiGreeting: "Good afternoon! Welcome to Grand Horizon Hotel. Are you checking in today?",
    keyPhrases: ["I have a reservation under...", "Could I have a quiet room on a higher floor?", "What time is breakfast served?"],
    evaluationCriteria: ['Giving personal information clearly', 'Asking polite requests with "could you"', 'Understanding confirmation details'],
  },
  {
    id: 'asking_directions',
    title: 'Asking for Directions in the City',
    category: 'Travel & Navigation',
    level: 'beginner',
    iconName: 'map-pin',
    description: 'Ask a friendly local for directions to the nearest subway station and pharmacy.',
    userRole: 'Lost Traveler',
    aiRole: 'Helpful Local Resident (Emma)',
    objective: 'Politely stop someone on the street, ask how to reach the central train station, and clarify walking distance.',
    initialAiGreeting: "Excuse me, hi there! Do you need some help finding something?",
    keyPhrases: ["Excuse me, could you tell me where...", "Is it within walking distance?", "How many blocks is that?"],
    evaluationCriteria: ['Polite interruption markers', 'Spatial prepositions (left, right, across, opposite)', 'Confirming directions'],
  },
  {
    id: 'doctor_appointment',
    title: 'Doctor Appointment & Describing Symptoms',
    category: 'Health & Wellness',
    level: 'beginner',
    iconName: 'activity',
    description: 'Explain common symptoms like a headache, sore throat, or fever to a general practitioner.',
    userRole: 'Patient',
    aiRole: 'Dr. Taylor (Physician)',
    objective: 'Describe your symptoms, how long you have felt unwell, and ask about medication instructions.',
    initialAiGreeting: "Hello there, come on in and take a seat. What brings you into the clinic today?",
    keyPhrases: ["I've had a bad headache since...", "My throat feels sore when I swallow", "How many times a day should I take this?"],
    evaluationCriteria: ['Body parts and symptom terminology', 'Time expressions for duration', 'Asking clarifying questions on dosages'],
  },

  // INTERMEDIATE SCENARIOS
  {
    id: 'job_interview_mid',
    title: 'Job Interview: Project Management',
    category: 'Professional & Career',
    level: 'intermediate',
    iconName: 'briefcase',
    description: 'Answer behavioral interview questions demonstrating problem-solving, collaboration, and past achievements.',
    userRole: 'Job Candidate',
    aiRole: 'Senior Hiring Manager (Victoria)',
    objective: 'Articulate your recent project successes using the STAR method (Situation, Task, Action, Result) and explain your strengths.',
    initialAiGreeting: "Thank you for joining us today! Let's start by having you tell me about a recent challenging project you led and how you handled unexpected roadblocks.",
    keyPhrases: ["In my previous role, I was responsible for...", "One notable challenge occurred when...", "To resolve this, I initiated..."],
    evaluationCriteria: ['Structured storytelling (STAR method)', 'Professional vocabulary & transitional adverbs', 'Concise answers without rambling'],
  },
  {
    id: 'office_meeting',
    title: 'Project Standup & Roadblock Discussion',
    category: 'Workplace Communication',
    level: 'intermediate',
    iconName: 'users',
    description: 'Present your weekly deliverables, discuss dependency delays with a colleague, and negotiate a revised deadline.',
    userRole: 'Product Specialist',
    aiRole: 'Tech Lead (David)',
    objective: 'Provide a concise status update, explain why a dependency is delayed, and propose an alternative milestone schedule.',
    initialAiGreeting: "Morning team. Let's do our weekly sync. How is the client integration milestone progressing on your end?",
    keyPhrases: ["We have made solid progress on...", "However, we encountered a bottleneck with...", "I propose shifting the release to..."],
    evaluationCriteria: ['Constructive disagreement and negotiation', 'Action-oriented language', 'Clarity of technical and timeline points'],
  },
  {
    id: 'customer_complaint',
    title: 'Resolving a Frustrated Customer Complaint',
    category: 'Customer Experience',
    level: 'intermediate',
    iconName: 'shield-alert',
    description: 'De-escalate an upset customer whose delivery was damaged, show empathy, and provide an acceptable solution.',
    userRole: 'Customer Success Specialist',
    aiRole: 'Disappointed Customer (Robert)',
    objective: 'Acknowledge frustration with empathy, investigate the issue, and offer an expedited replacement plus compensation.',
    initialAiGreeting: "I've been waiting two weeks for my package and it finally arrived completely broken! This is unacceptable and ruined my daughter's birthday gift!",
    keyPhrases: ["I completely understand how frustrating that is", "Let me make this right immediately", "I can arrange an overnight replacement for you"],
    evaluationCriteria: ['Empathetic active listening', 'Professional de-escalation tone', 'Clear proactive problem-solving'],
  },

  // ADVANCED SCENARIOS
  {
    id: 'salary_negotiation',
    title: 'Executive Compensation & Promotion Negotiation',
    category: 'Leadership & Strategy',
    level: 'advanced',
    iconName: 'trending-up',
    description: 'Negotiate an executive salary increase, equity grant, and leadership scope with the VP of People.',
    userRole: 'Senior Director',
    aiRole: 'VP of Human Resources (Eleanor)',
    objective: 'Present measurable business value generated over the past year, benchmark market rates, and secure a higher compensation package with grace and firmness.',
    initialAiGreeting: "Thank you for coming in to discuss your annual performance review and compensation adjustments. We have put together a proposal for a 5% merit increase. Let's discuss your thoughts.",
    keyPhrases: ["Given the 35% revenue growth delivered by my team...", "Based on current market benchmarks for this caliber of responsibility...", "I believe a comprehensive package including equity realignment reflects..."],
    evaluationCriteria: ['Nuanced persuasive rhetoric & gravitas', 'Handling counter-arguments diplomatically', 'Executive presence and assertive poise'],
  },
  {
    id: 'debate_ai_ethics',
    title: 'High-Stakes Debate: Regulatory AI Policy',
    category: 'Debate & Public Policy',
    level: 'advanced',
    iconName: 'scale',
    description: 'Debate a government regulator on whether open-source AI models should face mandatory licensing and compute caps.',
    userRole: 'Tech Industry Advocate',
    aiRole: 'Government Regulatory Commissioner (Arthur)',
    objective: 'Defend innovation and democratization of technology while addressing legitimate safety and copyright concerns with sophisticated arguments.',
    initialAiGreeting: "Proponents argue that unregulated open-source AI frontier models pose existential risks and copyright infringements that necessitate immediate state licensing. How do you defend unfettered open development?",
    keyPhrases: ["While safety is undeniably paramount, blanket restrictions risk...", "The empirical evidence indicates that decentralization fosters...", "A more nuanced framework would focus on deployment liability rather than..."],
    evaluationCriteria: ['Advanced rhetorical devices & collocations', 'Logical rebuttal and concession management', 'Syntactic variety and intellectual precision'],
  },
  {
    id: 'crisis_management',
    title: 'Corporate Crisis Management & Press Conference',
    category: 'Crisis Communication',
    level: 'advanced',
    iconName: 'alert-triangle',
    description: 'Serve as Chief Communications Officer responding to investigative journalists after a major data privacy breach.',
    userRole: 'Chief Communications Officer',
    aiRole: 'Investigative Journalist (Clara)',
    objective: 'Take accountability, reassure the public, detail forensic remediation steps, and withstand aggressive interrogation without admitting legal negligence.',
    initialAiGreeting: "Reports allege that your platform leaked biometric data of over 10 million users due to unpatched vulnerabilities known for six months. Why should users ever trust your infrastructure again?",
    keyPhrases: ["We treat the integrity of user data with the utmost seriousness...", "Immediate containment protocols were initiated within 20 minutes...", "An independent forensic investigation is underway to ensure total transparency..."],
    evaluationCriteria: ['Handling hostile questioning under pressure', 'Precise legal/ethical phrasing', 'Maintaining credibility and authority'],
  },
];
