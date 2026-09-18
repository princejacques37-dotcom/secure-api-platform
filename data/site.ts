export const site = {
  name: "Jack Ochieng",
  title: "Software Engineer | Systems & Security | DevSecOps / Cloud Security",
  education: "Statistics & Computer Science — Technical University of Mombasa",
  location: "Mombasa, Kenya",
  email: "YOUR_EMAIL@example.com",
  github: "https://github.com/YOUR_USERNAME",
  linkedin: "https://www.linkedin.com/in/YOUR_USERNAME/",
  cvPath: "/jack-ochieng-cv.pdf",
};

export const projects = [
  {
    slug: "secure-api-platform",
    title: "Secure API Platform",
    type: "Software + Security",
    status: "Building",
    summary: "A secure FastAPI backend focused on identity, authorization boundaries, validation, observability, PostgreSQL, Docker and automated security checks.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions"],
    outcome: "Demonstrate secure API engineering from authentication and authorization through containerized delivery and CI security checks.",
    github: "https://github.com/YOUR_USERNAME/secure-api-platform",
    demo: "",
  },
  {
    slug: "linux-systems-monitor",
    title: "Linux Systems Monitor",
    type: "Systems Engineering",
    status: "Planned",
    summary: "A lightweight operational tool for CPU, memory, processes, storage and service health, designed around actionable system signals.",
    stack: ["Python", "Linux", "Bash", "Prometheus"],
    outcome: "Show practical systems observability and the ability to turn low-level metrics into useful operational insight.",
    github: "https://github.com/YOUR_USERNAME/linux-systems-monitor",
    demo: "",
  },
  {
    slug: "devsecops-pipeline",
    title: "DevSecOps Pipeline",
    type: "DevSecOps",
    status: "Planned",
    summary: "An automated delivery pipeline combining testing, dependency checks, security scanning, containerization and infrastructure automation.",
    stack: ["GitHub Actions", "Docker", "SAST", "Terraform"],
    outcome: "Demonstrate security controls as part of the software delivery lifecycle instead of as a final checkpoint.",
    github: "https://github.com/YOUR_USERNAME/devsecops-pipeline",
    demo: "",
  },
];

export const notes = [
  { slug: "linux-processes", title: "Understanding Linux processes, signals and system resources", category: "Systems", read: "8 min", status: "Planned" },
  { slug: "secure-cicd", title: "Designing a secure CI/CD pipeline from first principles", category: "DevSecOps", read: "10 min", status: "Planned" },
  { slug: "security-log-anomalies", title: "Using statistics to detect unusual behaviour in security logs", category: "Security + Statistics", read: "12 min", status: "Planned" },
  { slug: "tcp-dns-tls", title: "What TCP, DNS and TLS actually contribute to an application", category: "Networking", read: "9 min", status: "Planned" },
  { slug: "least-privilege", title: "Least privilege as an engineering constraint", category: "Security", read: "7 min", status: "Planned" },
];
