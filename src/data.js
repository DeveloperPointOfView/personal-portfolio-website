export const personalData = {
  name: "Vikrant Negi",
  role: "Full Stack Developer",
  availability: "Available for remote collaborations",
  heroTagline: "Crafting immersive digital experiences with a balance of clean code, thoughtful UX, and performance-first engineering.",
  avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=600&q=80",
  newsletterUrl: "https://www.linkedin.com/newsletters/",
  newsletterReasons: [
    "New build notes and case studies as they drop",
    "Short Snowflake and full-stack tips—no spam",
    "Early looks at upcoming projects and launches"
  ],
  // Theme & UI Settings
  theme: {
    mode: "dark", // "dark" or "light"
    allowUserToggle: true,
    smoothScroll: true,
    animations: {
      enabled: true,
      fadeIn: true,
      parallax: false
    }
  },
  cta: {
    primaryLabel: "View Work",
    primaryHref: "/#projects",
    secondaryLabel: "Contact Me",
    secondaryHref: "/#contact",
    resumeLabel: "Resume / LinkedIn",
    resumeHref: "https://www.linkedin.com",
  },
  about: {
    title: "About Me",
    description: [
      "I am a passionate Full Stack Developer with a strong foundation in building dynamic and responsive web applications. With a keen eye for detail and a drive for excellence, I specialize in the MERN stack and modern web technologies.",
      "My journey in software development is driven by a curiosity to learn and a desire to create impactful digital experiences. I thrive in collaborative environments and am always looking for new challenges to grow my skills."
    ],
    stats: [
      { label: "Years Experience", value: "2+" },
      { label: "Projects Completed", value: "10+" },
      { label: "Happy Clients", value: "5+" },
      { label: "Support", value: "24/7" }
    ]
  },
  skills: [
    "React.js", "Node.js", "Express.js", "MongoDB", 
    "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", 
    "Git & GitHub", "RESTful APIs", "Redux"
  ],
  sectionVisibility: {
    about: true,
    experience: true,
    certifications: true,
    projects: true,
    blog: true,
    contact: true
  },
  sectionCopy: {
    experience: {
      eyebrow: "Experience",
      title: "A timeline of shipped work",
      subtitle: "Client-facing features, platform improvements, and product experiments delivered across roles."
    },
    certifications: {
      eyebrow: "Licenses & Certifications",
      title: "Validated expertise",
      subtitle: "Recent certifications that back up the work."
    },
    projects: {
      eyebrow: "Featured Projects",
      title: "Products and experiments I enjoyed building",
      subtitle: "A blend of full-stack builds, UI polish, and integrations to ship reliable, delightful experiences."
    },
    blog: {
      eyebrow: "Thoughts & Insights",
      title: "Latest Articles",
      subtitle: "Technical deep dives, tutorials, and thoughts on modern web development."
    },
    contact: {
      eyebrow: "Get In Touch",
      title: "Let's build something exceptional",
      subtitle: "Reach out for collaborations, consulting, or product builds. Quick replies, thoughtful solutions."
    }
  },
  // Blog Articles
  blog: [
    {
      id: "1",
      title: "Building Scalable React Applications",
      excerpt: "Learn best practices for structuring large-scale React applications with performance in mind.",
      content: "Full article content here...",
      author: "Vikrant Negi",
      date: "2025-01-15",
      tags: ["React", "Performance", "Architecture"],
      published: true,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
    }
  ],
  // Contact Form Settings
  contactForm: {
    enabled: true,
    saveToSupabase: true,
    emailNotifications: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Message", type: "textarea", required: true }
    ]
  },
  certifications: [
    {
      name: "SnowPro Core Certification",
      organization: "Snowflake",
      issueMonth: "July",
      issueYear: "2025",
      expirationMonth: "July",
      expirationYear: "2027",
      credentialId: "153975604",
      credentialUrl: "https://achieve.snowflake.com/8ba278ab-d1d2-4a20-8ac0-97d6e92a05c1"
    }
  ],
  experience: [
    {
      title: "Full Stack Developer",
      company: "Freelance",
      period: "2023 - Present",
      description: "Developing and maintaining web applications for various clients. Specializing in MERN stack development and delivering high-quality, scalable solutions."
    },
    {
      title: "Web Developer Intern",
      company: "Tech Solutions Inc.",
      period: "2022 - 2023",
      description: "Assisted in the development of company website and internal tools. Collaborated with senior developers to implement new features and fix bugs."
    }
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "A full-featured online store with user authentication, product management, cart functionality, and payment gateway integration.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Task Management App",
      description: "A collaborative task manager allowing users to create boards, lists, and cards with real-time updates.",
      tech: ["React", "Firebase", "Tailwind CSS"],
      link: "#",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Portfolio Website",
      description: "A responsive personal portfolio website showcasing skills, projects, and experience with a modern design.",
      tech: ["React", "Vite", "Tailwind CSS"],
      link: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    }
  ],
  contact: {
    email: "vikrantnegi@example.com",
    location: "New Delhi, India",
    social: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  }
};
