// Edit everything about your portfolio in this one file.
// Project links: paste your URLs into `liveUrl` / `repoUrl`. Leave "" to show "Link coming soon".

export const profile = {
  firstName: "Sejal",
  lastName: "Rai",
  fullName: "Sejal Manoj Rai",
  initials: "SR",
  role: "App Developer · XR Creator · Web Designer",
  roles: ["App Developer", "XR Creator", "Web Designer"],
  tagline:
    "Final-year Computer Engineering student building cross-platform apps, immersive VR worlds and polished websites.",
  bio: "I'm a Computer Engineering student at St. John College of Engineering and Management (CGPA 9.6) who loves turning ideas into interactive products. From Flutter apps wired to real backends, to VR space explorations and WordPress builds, I care about smooth UX, performance and shipping things people actually use.",
  email: "sejalrai9156@gmail.com",
  phone: "+91-9156046848",
  linkedin: "https://linkedin.com/in/sejal-rai-18334a321",
  github: "",
  resumeUrl: "",
  region: "Palghar, Mumbai · IN",
  photo: "/images/sejal.jpg",
}

export const stats = [
  { value: "9.6", label: "CGPA", sub: "Computer Engg." },
  { value: "3+", label: "Internships", sub: "App · XR · Web" },
  { value: "1st", label: "Hackathon", sub: "CU Innovation" },
]

export const skillsRowA = [
  "Flutter",
  "Dart",
  "Node.js",
  "MongoDB",
  "MongoDB Atlas",
  "REST APIs",
  "HTML",
  "CSS",
  "JavaScript",
  "WordPress",
  "MySQL",
  "XAMPP",
]

export const skillsRowB = [
  "AR / VR",
  "Unity",
  "Game Dev",
  "Spatial Audio",
  "3D Interaction",
  "Figma",
  "UI / UX",
  "SEO Basics",
  "GitHub",
  "VS Code",
  "Data Analytics",
  "MS Office",
]

export const expertise = [
  {
    id: "01",
    title: "App Development",
    description: "Cross-platform Flutter apps with authentication, APIs and real-time data.",
    chips: ["Flutter", "Dart", "REST"],
  },
  {
    id: "02",
    title: "Backend & Data",
    description: "Node.js services connected to MongoDB Atlas and MySQL, deployed for live use.",
    chips: ["Node.js", "MongoDB", "MySQL"],
  },
  {
    id: "03",
    title: "AR / VR & Games",
    description: "Immersive 3D environments with intuitive controls, spatial audio and interaction.",
    chips: ["AR/VR", "3D", "Game Dev"],
  },
  {
    id: "04",
    title: "Web & WordPress",
    description: "Responsive, SEO-ready websites with custom themes, plugins and animations.",
    chips: ["WordPress", "HTML/CSS", "Figma"],
  },
]

export type Project = {
  id: string
  title: string
  year: string
  status: string
  description: string
  stack: string[]
  liveUrl: string
  repoUrl: string
}

export const projects: Project[] = [
  {
    id: "01",
    title: "Space Explorer VR",
    year: "2024",
    status: "VR Game",
    description:
      "A virtual-reality space exploration game where users navigate galaxies and interact with celestial environments, with immersive visuals and spatial audio.",
    stack: ["VR", "3D", "Spatial Audio"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "02",
    title: "Micronest",
    year: "2025",
    status: "1st Place · Hackathon",
    description:
      "A financial solution giving accessible loans to people outside traditional banking. Won the CU Innovation Hackathon with direct entry to Campus Tank.",
    stack: ["FinTech", "Product", "Pitch"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "03",
    title: "Healthcare Service Apps",
    year: "2026",
    status: "Full-Stack",
    description:
      "Full-stack Flutter mobile apps with authentication and API integration, connected to MongoDB Atlas for real-time data handling.",
    stack: ["Flutter", "Node.js", "MongoDB"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "04",
    title: "Samsung Product Showcase",
    year: "2025",
    status: "Web",
    description:
      "A branded product display site inspired by Samsung's design language, with custom styling, animations and responsive layouts.",
    stack: ["WordPress", "CSS", "Animation"],
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "05",
    title: "WordPress Portfolio",
    year: "2025",
    status: "Web",
    description:
      "A personal portfolio built and launched on WordPress with mobile responsiveness, SEO basics and interactive project sections.",
    stack: ["WordPress", "SEO", "Responsive"],
    liveUrl: "",
    repoUrl: "",
  },
]

export const experience = [
  {
    role: "App Development Intern",
    org: "Cosmic Web Solutions (Freelance)",
    period: "2026",
    points: ["Flutter apps with API and backend integration", "Real-time projects focused on UI/UX, performance and deployment"],
  },
  {
    role: "AR/VR Intern",
    org: "Immersive Apps",
    period: "2025",
    points: ["Interactive 3D environments", "VR design, user interaction and spatial visualisation"],
  },
  {
    role: "WordPress Developer Intern",
    org: "DLLE",
    period: "2025",
    points: ["Responsive websites with WordPress", "Themes, plugins and basic SEO"],
  },
  {
    role: "PR Head · Joint Secretary",
    org: "SPCA & BIS, St. John College",
    period: "2025",
    points: ["Hosted a major student-led innovation event", "Led communications for technical committees"],
  },
]

export const certifications = [
  { title: "App Development", issuer: "CWS", date: "Mar 2026" },
  { title: "Data Analytics", issuer: "Deloitte", date: "Jul 2025" },
  { title: "AR & VR Development", issuer: "IOFT", date: "Dec 2024" },
  { title: "Game Development", issuer: "IOFT", date: "Dec 2024" },
]

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#journey", label: "Certifications" },
  { href: "#contact", label: "Contact" },
]
