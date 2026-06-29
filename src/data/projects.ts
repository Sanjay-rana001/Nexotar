export interface Project {
  title: string;
  tags: string[];
  hook: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  results: string;
  insight: string;
  img: string;
  url: string;
}

export const allProjects: Project[] = [
  {
    title: "FreshMart NZ",
    tags: ["E-Commerce Architecture", "Performance"],
    hook: "Scaling a grocery empire with sub-second performance.",
    overview: "A custom headless e-commerce engine engineered for hyper-fast transactions and zero-latency catalog browsing.",
    problem: "The client’s legacy monolithic platform was buckling under peak traffic. Mobile bounce rates were soaring due to 4+ second load times, directly cannibalizing revenue and frustrating returning customers.",
    solution: "We engineered a decoupled, edge-cached architecture. By migrating their entire frontend to a statically generated Next.js layer with dynamic cart hydration, we completely removed the database bottleneck from the critical rendering path.",
    features: [
      "Sub-second LCP (Largest Contentful Paint) on 3G networks",
      "Dynamic edge-caching for real-time inventory",
      "Frictionless, single-page checkout flow",
      "Optimized WebP image delivery pipeline"
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "Vercel Edge"],
    results: "Reduced core load times by 78%, dropping cart abandonment by 32% and driving a 41% increase in mobile-originated revenue.",
    insight: "Speed is revenue. By treating performance as a core business metric rather than an afterthought, we turned a struggling storefront into a high-converting growth engine.",
    img: "/images/grocery-store.jpg",
    url: "https://grocery-store-a57l.vercel.app/"
  },
  {
    title: "Dietitian Suruchi",
    tags: ["HealthTech", "Workflow Automation"],
    hook: "Digitizing clinic operations to reclaim 15 hours a week.",
    overview: "A secure, end-to-end patient management and digital intake platform for a high-volume clinical practice.",
    problem: "Administrative chaos. The clinic was drowning in manual data entry, fragmented WhatsApp scheduling, and disconnected patient forms, leading to missed consultations and severe operational bottlenecks.",
    solution: "We designed and deployed a centralized digital OS. We replaced fragmented tools with a custom, secure web application that handles intake forms, automates scheduling, and instantly alerts staff of high-priority leads.",
    features: [
      "Automated lead capture & CRM integration",
      "Real-time instant notification architecture",
      "HIPAA-compliant data handling protocols",
      "Frictionless patient onboarding UX"
    ],
    technologies: ["Next.js", "Node.js", "Serverless Functions", "Firebase"],
    results: "Reclaimed 15+ hours of weekly administrative overhead, while increasing successful consultation bookings by 64% within the first 60 days.",
    insight: "The best software gets out of the way. By automating the friction of intake, we allowed the clinical team to focus entirely on patient care rather than paperwork.",
    img: "/images/dietitian.jpg",
    url: "https://sanjay-rana001.github.io/Dietetian_Suruchi_website/"
  },
  {
    title: "SSPI Plastics",
    tags: ["B2B Manufacturing", "Digital Redesign"],
    hook: "Transforming an industrial legacy brand into a digital authority.",
    overview: "A complete brand repositioning and digital overhaul for a tier-one plastics manufacturing enterprise.",
    problem: "Despite being an industry leader, their digital presence looked decades old. The UX was hostile to B2B buyers, making it incredibly difficult for procurement teams to request quotes or understand product specifications.",
    solution: "We architected an authoritative, modern digital storefront. We restructured their entire massive catalog into an intuitive taxonomy, wrapping it in a sleek, high-trust UI designed specifically to convert enterprise procurement officers.",
    features: [
      "Authoritative, high-trust brand identity",
      "Complex taxonomy and catalog restructuring",
      "Streamlined RFQ (Request for Quote) engine",
      "High-performance interactive 3D assets"
    ],
    technologies: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    results: "Increased average B2B session duration by 210% and drove a 45% spike in qualified wholesale inquiries in Q1 post-launch.",
    insight: "B2B doesn't mean boring. By treating enterprise procurement officers like everyday consumers who appreciate great design, we massively reduced the friction to purchase.",
    img: "/images/sspi.jpg",
    url: "https://sspiplastics.com/"
  },
  {
    title: "Airlines eTicket",
    tags: ["TravelTech", "Web Application"],
    hook: "Redefining the flight booking flow through minimalist architecture.",
    overview: "A streamlined, frictionless flight search and e-ticketing platform built for the modern traveler.",
    problem: "The travel booking space is notorious for dark patterns, overwhelming interfaces, and slow, spinning loaders. Users were dropping off midway through complex, multi-page checkout flows.",
    solution: "We stripped the booking process down to its absolute essentials. We engineered a lightning-fast, single-page application that filters complex flight databases in real-time, removing all unnecessary friction from search to payment.",
    features: [
      "Real-time, zero-latency flight filtering",
      "Frictionless 3-step checkout process",
      "Dynamic, responsive e-ticket generation",
      "Secure payment gateway abstraction"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
    results: "Slashed the average time-to-book by 32% and achieved a 98% user task completion rate during A/B testing against industry standards.",
    insight: "Complexity is the enemy of conversion. By aggressively hiding complex database queries behind a calm, minimalist UI, we created a booking experience people actually enjoy using.",
    img: "/images/airlines.jpg",
    url: "https://airlineseticket.com/"
  },
  {
    title: "Package Reservation",
    tags: ["Travel Platform", "UX Engineering"],
    hook: "Making complex travel data digestible and beautiful.",
    overview: "A visually immersive platform designed to simplify the browsing and booking of complex, multi-day travel itineraries.",
    problem: "High-ticket travel packages require explaining immense amounts of data—hotels, flights, itineraries, and policies. The previous platform presented this as walls of text, causing severe cognitive overload and bounce rates.",
    solution: "We engineered a highly visual, component-driven UI. We broke down massive itineraries into interactive, digestible modules, using progressive disclosure to reveal details only when the user wants them, keeping the primary focus on stunning destination imagery.",
    features: [
      "Progressive disclosure UI architecture",
      "Immersive, interactive destination galleries",
      "Advanced multi-variable filtering system",
      "Seamless inquiry and conversion funnels"
    ],
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    results: "Boosted time-on-page by 4.5 minutes on average, directly correlating to a 28% increase in high-value package inquiries.",
    insight: "When selling high-ticket experiences, the interface itself must feel like a premium experience. We prioritized emotion and imagery while keeping the technical data easily accessible but out of the way.",
    img: "/images/package-reservation.jpg",
    url: "https://packagereservation.com/"
  }
];
