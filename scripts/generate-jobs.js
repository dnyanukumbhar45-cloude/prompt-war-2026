const fs = require("fs");
const path = require("path");

const rolesData = [
  {
    role: "Full Stack Developer",
    techStacks: [
      ["React", "Node.js", "Express", "REST APIs", "TypeScript", "PostgreSQL", "Git", "Docker"],
      ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "REST APIs", "Git"],
      ["Vue.js", "Node.js", "Express", "SQL", "Docker", "AWS", "Git", "CI/CD"],
      ["React", "Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Git", "Authentication"],
      ["Angular", "Node.js", "NestJS", "TypeScript", "SQL", "Docker", "Git", "Testing"],
      ["React", "Node.js", "Express", "REST APIs", "HTML", "CSS", "JavaScript", "MySQL", "Git"]
    ],
    skillsPool: [
      { name: "JavaScript", importance: 9, required: true },
      { name: "TypeScript", importance: 8, required: true },
      { name: "React", importance: 9, required: true },
      { name: "Node.js", importance: 9, required: true },
      { name: "REST APIs", importance: 9, required: true },
      { name: "SQL", importance: 8, required: true },
      { name: "HTML", importance: 7, required: true },
      { name: "CSS", importance: 7, required: true },
      { name: "Git", importance: 8, required: true },
      { name: "Docker", importance: 7, required: false },
      { name: "Cloud", importance: 6, required: false },
      { name: "PostgreSQL", importance: 7, required: false },
      { name: "MongoDB", importance: 6, required: false },
      { name: "Authentication", importance: 8, required: true },
      { name: "Testing", importance: 6, required: false },
      { name: "CI/CD", importance: 6, required: false }
    ],
    count: 25
  },
  {
    role: "Frontend Developer",
    techStacks: [
      ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Git"],
      ["Vue.js", "JavaScript", "CSS", "HTML", "Pinia", "Jest", "Git"],
      ["React", "JavaScript", "HTML", "CSS", "REST APIs", "Webpack", "Git"]
    ],
    skillsPool: [
      { name: "JavaScript", importance: 10, required: true },
      { name: "HTML", importance: 9, required: true },
      { name: "CSS", importance: 9, required: true },
      { name: "React", importance: 9, required: true },
      { name: "TypeScript", importance: 8, required: true },
      { name: "REST APIs", importance: 8, required: true },
      { name: "Git", importance: 8, required: true },
      { name: "Responsive Design", importance: 8, required: true },
      { name: "Performance Optimization", importance: 7, required: false },
      { name: "Testing", importance: 6, required: false }
    ],
    count: 15
  },
  {
    role: "Backend Developer",
    techStacks: [
      ["Node.js", "Express", "TypeScript", "PostgreSQL", "Docker", "Redis", "REST APIs"],
      ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "AWS"],
      ["Java", "Spring Boot", "MySQL", "Kafka", "Docker", "Microservices"]
    ],
    skillsPool: [
      { name: "Node.js", importance: 9, required: true },
      { name: "REST APIs", importance: 10, required: true },
      { name: "SQL", importance: 9, required: true },
      { name: "PostgreSQL", importance: 8, required: true },
      { name: "Docker", importance: 8, required: true },
      { name: "Authentication", importance: 8, required: true },
      { name: "Git", importance: 8, required: true },
      { name: "Microservices", importance: 7, required: false },
      { name: "Redis", importance: 7, required: false },
      { name: "CI/CD", importance: 6, required: false }
    ],
    count: 15
  },
  {
    role: "Data Analyst",
    techStacks: [
      ["SQL", "Python", "Tableau", "Excel", "Pandas", "Power BI"],
      ["SQL", "R", "Power BI", "Data Cleaning", "Statistics"],
      ["SQL", "Python", "Google Data Studio", "PostgreSQL", "Excel"]
    ],
    skillsPool: [
      { name: "SQL", importance: 10, required: true },
      { name: "Excel", importance: 9, required: true },
      { name: "Python", importance: 8, required: true },
      { name: "Tableau", importance: 8, required: false },
      { name: "Power BI", importance: 8, required: false },
      { name: "Data Visualization", importance: 9, required: true },
      { name: "Statistics", importance: 8, required: true }
    ],
    count: 12
  },
  {
    role: "Data Scientist",
    techStacks: [
      ["Python", "Pandas", "Scikit-Learn", "SQL", "TensorFlow", "Statistics"],
      ["Python", "PyTorch", "NumPy", "SQL", "Jupyter", "Machine Learning"]
    ],
    skillsPool: [
      { name: "Python", importance: 10, required: true },
      { name: "SQL", importance: 8, required: true },
      { name: "Machine Learning", importance: 9, required: true },
      { name: "Statistics", importance: 9, required: true },
      { name: "Pandas", importance: 9, required: true },
      { name: "Scikit-Learn", importance: 8, required: true },
      { name: "Data Modeling", importance: 8, required: false }
    ],
    count: 12
  },
  {
    role: "AI/ML Engineer",
    techStacks: [
      ["Python", "PyTorch", "Transformers", "Docker", "FastAPI", "MLOps", "CUDA"],
      ["Python", "TensorFlow", "Kubernetes", "LangChain", "Vector Databases", "GCP"]
    ],
    skillsPool: [
      { name: "Python", importance: 10, required: true },
      { name: "PyTorch", importance: 9, required: true },
      { name: "Deep Learning", importance: 9, required: true },
      { name: "MLOps", importance: 8, required: true },
      { name: "Docker", importance: 8, required: true },
      { name: "REST APIs", importance: 7, required: true },
      { name: "LLMs", importance: 8, required: false }
    ],
    count: 12
  },
  {
    role: "Cloud Engineer",
    techStacks: [
      ["AWS", "Terraform", "Docker", "Kubernetes", "Linux", "CI/CD", "Python"],
      ["Google Cloud", "Kubernetes", "Terraform", "Bash", "Networking", "Monitoring"]
    ],
    skillsPool: [
      { name: "Cloud", importance: 10, required: true },
      { name: "Docker", importance: 9, required: true },
      { name: "Kubernetes", importance: 9, required: true },
      { name: "Terraform", importance: 8, required: true },
      { name: "Linux", importance: 8, required: true },
      { name: "CI/CD", importance: 8, required: true },
      { name: "Networking", importance: 7, required: false }
    ],
    count: 10
  },
  {
    role: "Software Engineer",
    techStacks: [
      ["Java", "Spring", "SQL", "Git", "REST APIs", "Docker"],
      ["C++", "Data Structures", "Algorithms", "Linux", "Git"],
      ["TypeScript", "Node.js", "React", "PostgreSQL", "Docker", "Testing"]
    ],
    skillsPool: [
      { name: "Data Structures", importance: 9, required: true },
      { name: "Algorithms", importance: 9, required: true },
      { name: "Git", importance: 8, required: true },
      { name: "SQL", importance: 8, required: true },
      { name: "REST APIs", importance: 8, required: true },
      { name: "Testing", importance: 7, required: true },
      { name: "Object-Oriented Design", importance: 8, required: true }
    ],
    count: 12
  }
];

const companyTypes = ["Fintech", "Healthtech", "Enterprise SaaS", "E-Commerce Scale-up", "AI Startup", "Cloud Consulting", "Cybersecurity", "Consumer Tech"];
const locations = ["Remote", "San Francisco, CA", "New York, NY", "Bangalore, India", "Austin, TX", "London, UK", "Seattle, WA"];
const experienceLevels = ["Entry-Level / Junior (0-2 yrs)", "Mid-Level (2-5 yrs)", "Senior (5+ yrs)"];
const salaryRanges = ["$70,000 - $90,000", "$85,000 - $110,000", "$95,000 - $125,000", "$115,000 - $145,000", "$130,000 - $165,000"];

const jobs = [];
let idCounter = 1001;

for (const roleGroup of rolesData) {
  for (let i = 0; i < roleGroup.count; i++) {
    const techStack = roleGroup.techStacks[i % roleGroup.techStacks.length];
    const exp = experienceLevels[i % experienceLevels.length];
    const comp = companyTypes[(idCounter * 7) % companyTypes.length];
    const loc = locations[(idCounter * 3) % locations.length];
    const sal = salaryRanges[(idCounter * 5) % salaryRanges.length];

    const selectedSkills = roleGroup.skillsPool.map(s => s.name);
    const importanceMap = {};
    const requirementMap = {};

    roleGroup.skillsPool.forEach(s => {
      importanceMap[s.name] = s.importance;
      requirementMap[s.name] = s.required;
    });

    jobs.push({
      job_id: `DEMO-JOB-${idCounter}`,
      role: roleGroup.role,
      company_type: comp,
      company_name: `${comp.split(" ")[0]} Innovations Corp`,
      experience_level: exp,
      skills: selectedSkills,
      skill_importance: importanceMap,
      required_skills: roleGroup.skillsPool.filter(s => s.required).map(s => s.name),
      optional_skills: roleGroup.skillsPool.filter(s => !s.required).map(s => s.name),
      location: loc,
      salary_range: sal,
      technology_stack: techStack,
      dataset_source: "Demo Market Dataset (Synthetic 100+ Benchmark)"
    });

    idCounter++;
  }
}

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const outputPath = path.join(dataDir, "demo-jobs.json");
fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2), "utf-8");
console.log(`Successfully generated ${jobs.length} demo jobs in ${outputPath}`);
