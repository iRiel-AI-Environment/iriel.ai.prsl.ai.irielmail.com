/**
 * Knowledge Engine — canonical technical documentation (IRC-001 §14 "User Knowledge").
 * Each source is matched against the question with word-boundary keywords.
 */
export type CollectionId =
  "web" | "frameworks" | "languages" | "data" | "practice" | "cloud" | "web3" | "ai";

export interface KnowledgeSource {
  id: string;
  topic: string;
  url: string;
  collection: CollectionId;
  keywords: string[];
}

export const COLLECTIONS: CollectionId[] = [
  "web",
  "frameworks",
  "languages",
  "data",
  "practice",
  "cloud",
  "web3",
  "ai",
];

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: "html",
    topic: "HTML",
    url: "https://html.com",
    collection: "web",
    keywords: ["html", "html5", "markup", "semantic tags"],
  },
  {
    id: "css",
    topic: "CSS",
    url: "https://web.dev/learn/css",
    collection: "web",
    keywords: ["css", "flexbox", "css grid", "stylesheet", "tailwind"],
  },
  {
    id: "javascript",
    topic: "JavaScript",
    url: "https://javascript.info",
    collection: "web",
    keywords: ["javascript", "js", "ecmascript", "promise", "async await", "dom"],
  },
  {
    id: "typescript",
    topic: "TypeScript",
    url: "https://www.typescriptlang.org/docs",
    collection: "web",
    keywords: ["typescript", "ts", "tsconfig", "generics", "type guard"],
  },
  {
    id: "react",
    topic: "React",
    url: "https://reactplay.io",
    collection: "frameworks",
    keywords: ["react", "jsx", "usestate", "useeffect", "react hooks", "hooks"],
  },
  {
    id: "vue",
    topic: "Vue",
    url: "https://learnvue.co",
    collection: "frameworks",
    keywords: ["vue", "vuejs", "vue.js", "nuxt", "pinia"],
  },
  {
    id: "angular",
    topic: "Angular",
    url: "https://angular.dev/tutorials",
    collection: "frameworks",
    keywords: ["angular", "rxjs", "ngmodule"],
  },
  {
    id: "nextjs",
    topic: "Next.js",
    url: "https://nextjs.org/learn",
    collection: "frameworks",
    keywords: ["next.js", "nextjs", "next js", "app router"],
  },
  {
    id: "django",
    topic: "Django",
    url: "https://www.djangoproject.com/start",
    collection: "frameworks",
    keywords: ["django"],
  },
  {
    id: "flask",
    topic: "Flask",
    url: "https://flask.palletsprojects.com/tutorial",
    collection: "frameworks",
    keywords: ["flask"],
  },
  {
    id: "python",
    topic: "Python",
    url: "https://www.learnpython.org",
    collection: "languages",
    keywords: ["python", "pip", "pandas", "numpy"],
  },
  {
    id: "php",
    topic: "PHP",
    url: "https://phptherightway.com",
    collection: "languages",
    keywords: ["php", "laravel", "composer"],
  },
  {
    id: "go",
    topic: "Go",
    url: "https://www.learn-golang.org",
    collection: "languages",
    keywords: ["golang", "go lang", "goroutine", "go"],
  },
  {
    id: "rust",
    topic: "Rust",
    url: "https://www.rust-lang.org/learn",
    collection: "languages",
    keywords: ["rust", "cargo", "borrow checker"],
  },
  {
    id: "cpp",
    topic: "C++",
    url: "https://cplusplus.com/doc/tutorial",
    collection: "languages",
    keywords: ["c++", "cpp", "stl"],
  },
  {
    id: "java",
    topic: "Java",
    url: "https://docs.oracle.com/javase/tutorial",
    collection: "languages",
    keywords: ["java", "jvm", "spring"],
  },
  {
    id: "csharp",
    topic: "C#",
    url: "https://dotnet.microsoft.com/learn/csharp",
    collection: "languages",
    keywords: ["c#", "csharp", ".net", "dotnet"],
  },
  {
    id: "swift",
    topic: "Swift",
    url: "https://www.swift.org/learn",
    collection: "languages",
    keywords: ["swift", "swiftui", "ios development"],
  },
  {
    id: "sql",
    topic: "SQL",
    url: "https://www.w3schools.com/sql",
    collection: "data",
    keywords: ["sql", "postgres", "postgresql", "mysql", "sqlite", "query join"],
  },
  {
    id: "api",
    topic: "API",
    url: "https://rapidapi.com/learn",
    collection: "data",
    keywords: ["api", "rest", "openapi", "graphql", "endpoint"],
  },
  {
    id: "git",
    topic: "Git",
    url: "https://git-scm.com/book",
    collection: "practice",
    keywords: ["git", "rebase", "merge conflict", "github"],
  },
  {
    id: "patterns",
    topic: "Design Patterns",
    url: "https://refactoring.guru",
    collection: "practice",
    keywords: [
      "design pattern",
      "design patterns",
      "refactoring",
      "singleton",
      "observer pattern",
      "solid",
    ],
  },
  {
    id: "linux",
    topic: "Linux",
    url: "https://linuxjourney.com",
    collection: "practice",
    keywords: ["linux", "bash", "shell", "ubuntu", "terminal"],
  },
  {
    id: "docker",
    topic: "Docker",
    url: "https://www.docker.com/get-started",
    collection: "practice",
    keywords: ["docker", "dockerfile", "container", "containers"],
  },
  {
    id: "kubernetes",
    topic: "Kubernetes",
    url: "https://kubernetes.io/docs/tutorials",
    collection: "practice",
    keywords: ["kubernetes", "k8s", "kubectl", "helm"],
  },
  {
    id: "devops",
    topic: "DevOps",
    url: "https://roadmap.sh/devops",
    collection: "practice",
    keywords: ["devops", "ci/cd", "ci cd", "pipeline"],
  },
  {
    id: "aws",
    topic: "Cloud (AWS)",
    url: "https://aws.amazon.com/training",
    collection: "cloud",
    keywords: ["aws", "amazon web services", "s3", "ec2", "lambda"],
  },
  {
    id: "gcp",
    topic: "Cloud (GCP)",
    url: "https://www.cloudskillsboost.google",
    collection: "cloud",
    keywords: ["gcp", "google cloud", "bigquery", "cloud run"],
  },
  {
    id: "azure",
    topic: "Cloud (Azure)",
    url: "https://www.microsoft.com/learn/azure",
    collection: "cloud",
    keywords: ["azure"],
  },
  {
    id: "web3",
    topic: "Web3",
    url: "https://learnweb3.io",
    collection: "web3",
    keywords: ["web3", "dapp", "ethereum", "smart contract", "solidity"],
  },
  {
    id: "blockchain",
    topic: "Blockchain",
    url: "https://cryptozombies.io",
    collection: "web3",
    keywords: ["blockchain", "crypto", "nft"],
  },
  {
    id: "ai",
    topic: "AI (Basics)",
    url: "https://www.elementsofai.com",
    collection: "ai",
    keywords: [
      "machine learning",
      "artificial intelligence",
      "neural network",
      "ai basics",
      "deep learning",
    ],
  },
  {
    id: "security",
    topic: "Cybersecurity",
    url: "https://tryhackme.com",
    collection: "ai",
    keywords: [
      "cybersecurity",
      "security",
      "penetration testing",
      "pentest",
      "xss",
      "sql injection",
    ],
  },
];

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface KnowledgeMatch {
  source: KnowledgeSource;
  term: string;
}

/** Ambiguous everyday words count only when the question is clearly technical. */
const AMBIGUOUS = new Set([
  "go",
  "rust",
  "swift",
  "java",
  "shell",
  "security",
  "crypto",
  "container",
  "containers",
  "pipeline",
  "endpoint",
  "hooks",
  "terminal",
  "spring",
  "rest",
  "ts",
  "js",
]);
const TECH_HINT =
  /\b(code|coding|program|programming|developer|function|error|bug|compile|install|library|framework|syntax|api|deploy|script|learn|tutorial|docs|documentation)\b/i;

export function matchKnowledge(
  text: string,
  opts: {
    disabled?: string[];
    extra?: { id: string; topic: string; url: string }[];
    developer?: boolean;
  } = {},
): KnowledgeMatch[] {
  const lower = text.toLowerCase();
  const technical = opts.developer || TECH_HINT.test(text);
  const out: KnowledgeMatch[] = [];
  for (const source of KNOWLEDGE_SOURCES) {
    if (opts.disabled?.includes(source.collection)) continue;
    for (const kw of source.keywords) {
      if (AMBIGUOUS.has(kw) && !technical) continue;
      const re = new RegExp(`(^|[^a-z0-9+#.])${escape(kw)}($|[^a-z0-9+#])`, "i");
      const m = lower.match(re);
      if (m) {
        const idx = (m.index ?? 0) + (m[1]?.length ?? 0);
        out.push({ source, term: text.slice(idx, idx + kw.length) });
        break;
      }
    }
  }
  for (const c of opts.extra ?? []) {
    const re = new RegExp(`\\b${escape(c.topic.toLowerCase())}\\b`, "i");
    if (re.test(lower)) {
      out.push({
        source: {
          id: c.id,
          topic: c.topic,
          url: c.url,
          collection: "practice",
          keywords: [c.topic],
        },
        term: c.topic,
      });
    }
  }
  return out.slice(0, 4);
}
