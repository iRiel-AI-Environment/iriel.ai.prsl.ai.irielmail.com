/**
 * iriel.engines.intelligence — catalog of search engines reachable through "!" shortcuts.
 * `%s` is replaced with the URL-encoded query.
 */
export interface SearchEngine {
  title: string;
  shortcuts: string[];
  mobile: string;
  desktop?: string;
  favicon?: string;
  definition?: string;
  random?: boolean;
  engines?: SearchEngine[];
}

export const searchEngines: SearchEngine[] = [
  {
    "title": "1Password",
    "shortcuts": [
      "1pw"
    ],
    "mobile": "1password://search/%s",
    "favicon": "1password.com"
  },
  {
    "shortcuts": [
      "500px"
    ],
    "mobile": "https://500px.com/search?q=%s",
    "title": "500px"
  },
  {
    "title": "Android Developer",
    "mobile": "https://developer.android.com/s/results?q=%s",
    "shortcuts": [
      "androiddev"
    ]
  },
  {
    "title": "App Store",
    "shortcuts": [
      "appstore"
    ],
    "mobile": "itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term=%s",
    "favicon": "https://cdn0.iconfinder.com/data/icons/social-media-2349/69/Asset_40-1024.png"
  },
  {
    "title": "Apple",
    "mobile": "https://www.apple.com/search/%s",
    "shortcuts": [
      "apple"
    ]
  },
  {
    "title": "Apple Developer",
    "mobile": "https://developer.apple.com/search/?q=%s",
    "shortcuts": [
      "appledev"
    ]
  },
  {
    "title": "Baidu",
    "shortcuts": [
      "baidu"
    ],
    "mobile": "https://www.baidu.com/s?wd=%s",
    "favicon": "www.baidu.com"
  },
  {
    "title": "Bing Translator to English",
    "mobile": "https://www.bing.com/translator?&to=en&text=%s",
    "shortcuts": [
      "bte"
    ]
  },
  {
    "mobile": "https://chatgpt.com/?q=%s",
    "title": "ChatGPT",
    "shortcuts": [
      "gpt",
      "chatgpt"
    ]
  },
  {
    "title": "ChatGPT App",
    "shortcuts": [
      "gptapp"
    ],
    "mobile": "chatgpt://chat.openai.com/?q=%s",
    "favicon": "chatgpt.com"
  },
  {
    "mobile": "https://chatgpt.com/?q=%s&hints=search",
    "title": "ChatGPT Search",
    "shortcuts": [
      "gptsearch"
    ]
  },
  {
    "mobile": "https://chatgpt.com/?q=%s&temporary-chat=true",
    "title": "ChatGPT Temporary Chat",
    "shortcuts": [
      "gpttemp"
    ]
  },
  {
    "title": "Claude",
    "shortcuts": [
      "claude"
    ],
    "mobile": "https://claude.ai/new?q=%s",
    "definition": "Claude is an advanced AI designed to assist with various tasks, from individual brainstorming to large team projects. It offers capabilities in advanced reasoning, vision analysis, code generation, and multilingual processing. The Claude model family includes Haiku for lightweight actions, Sonnet for efficient high-throughput tasks, and Opus for complex analyses. Claude is secure, trustworthy, and reliable, with features like SOC 2 Type II certification and HIPAA compliance. Anthropic, the creator of Claude, ensures high standards of integrity and security, making Claude suitable for business-critical applications."
  },
  {
    "title": "Codes Search",
    "shortcuts": [
      "codessearch"
    ],
    "mobile": "https://publicwww.com/?q=%s"
  },
  {
    "title": "DeepL to English",
    "shortcuts": [
      "dle"
    ],
    "mobile": "https://www.deepl.com/translator#../en/%s"
  },
  {
    "title": "Duck.ai",
    "shortcuts": [
      "duckai"
    ],
    "mobile": "https://duck.ai/chat?ia=chat&home=1&prompt=1&q=%s"
  },
  {
    "title": "DuckDuckGo",
    "shortcuts": [
      "d",
      "ddg"
    ],
    "mobile": "https://duckduckgo.com?q=%s"
  },
  {
    "title": "Ecosia",
    "shortcuts": [
      "es",
      "ecosia"
    ],
    "mobile": "https://www.ecosia.org/search?q=%s"
  },
  {
    "title": "eTools",
    "shortcuts": [
      "etools"
    ],
    "mobile": "https://www.etools.ch/searchSubmit.do?query=%s",
    "favicon": "www.etools.ch"
  },
  {
    "title": "Exa AI",
    "shortcuts": [
      "exa"
    ],
    "mobile": "https://exa.ai/search?q=%s"
  },
  {
    "title": "Fandom",
    "shortcuts": [
      "fandom"
    ],
    "mobile": "https://www.fandom.com/?s=%s"
  },
  {
    "title": "Felo Search",
    "shortcuts": [
      "felo"
    ],
    "mobile": "https://felo.ai/search?q=%s"
  },
  {
    "title": "Figma Community",
    "shortcuts": [
      "figma"
    ],
    "mobile": "https://www.figma.com/community/search?q=%s"
  },
  {
    "title": "Github",
    "shortcuts": [
      "gh",
      "github"
    ],
    "mobile": "https://github.com/search?q=%s"
  },
  {
    "shortcuts": [
      "g",
      "google"
    ],
    "mobile": "https://www.google.com/search?q=%s",
    "title": "Google"
  },
  {
    "title": "Google AI Mode (by Gemini)",
    "shortcuts": [
      "gemini"
    ],
    "mobile": "https://www.google.com/search?udm=50&source=searchlabs&q=%s",
    "favicon": "gemini.google",
    "definition": "To use Google's AI features, sign in to your Google Account. AI Overviews will appear automatically at the top of many search results."
  },
  {
    "favicon": "books.google.com",
    "shortcuts": [
      "gbooks"
    ],
    "title": "Google Books",
    "mobile": "https://books.google.com/books?q=%s"
  },
  {
    "favicon": "https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png",
    "shortcuts": [
      "gdocs"
    ],
    "title": "Google Docs",
    "mobile": "https://docs.google.com/document?q=%s"
  },
  {
    "favicon": "https://drive.google.com/favicon.ico",
    "shortcuts": [
      "gdrive"
    ],
    "title": "Google Drive",
    "mobile": "https://drive.google.com/drive/search?q=%s"
  },
  {
    "favicon": "groups.google.com",
    "shortcuts": [
      "ggroups"
    ],
    "title": "Google Groups",
    "mobile": "https://groups.google.com/groups?q=%s"
  },
  {
    "favicon": "https://images.google.com/favicon.ico",
    "shortcuts": [
      "gimg"
    ],
    "title": "Google Images",
    "mobile": "https://www.google.com/search?tbm=isch&q=%s"
  },
  {
    "favicon": "maps.google.com",
    "shortcuts": [
      "gm"
    ],
    "title": "Google Maps",
    "mobile": "https://www.google.com/maps/search/%s"
  },
  {
    "favicon": "news.google.com",
    "shortcuts": [
      "gnews"
    ],
    "title": "Google News",
    "mobile": "https://www.google.com/search?q=%s&tbm=nws"
  },
  {
    "favicon": "play.google.com",
    "shortcuts": [
      "gplay"
    ],
    "title": "Google Play",
    "mobile": "https://play.google.com/store/search?q=%s"
  },
  {
    "favicon": "scholar.google.com",
    "shortcuts": [
      "gs"
    ],
    "title": "Google Scholar",
    "mobile": "https://scholar.google.com/scholar?q=%s"
  },
  {
    "favicon": "https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png",
    "shortcuts": [
      "gsheets"
    ],
    "title": "Google Sheets",
    "mobile": "https://docs.google.com/spreadsheets?q=%s"
  },
  {
    "shortcuts": [
      "gfork"
    ],
    "mobile": "https://greasyfork.org/en/scripts?q=%s",
    "title": "Greasy Fork"
  },
  {
    "shortcuts": [
      "grep"
    ],
    "mobile": "https://grep.app/search?q=%s",
    "title": "Grep.app"
  },
  {
    "shortcuts": [
      "grok"
    ],
    "definition": "Grok, crafted by xAI, is an AI with a unique perspective on humanity, designed to answer nearly any question with maximum helpfulness.",
    "title": "Grok",
    "mobile": "https://grok.com/?q=%s"
  },
  {
    "shortcuts": [
      "harvard"
    ],
    "title": "Harvard",
    "mobile": "https://www.harvard.edu/search/?q_as=%s"
  },
  {
    "shortcuts": [
      "ikea"
    ],
    "title": "IKEA",
    "mobile": "https://www.ikea.com/us/en/search/products/?q=%s"
  },
  {
    "favicon": "instagram.com",
    "shortcuts": [
      "igtag"
    ],
    "title": "Instagram App Tag",
    "mobile": "instagram://tag?name=%s"
  },
  {
    "shortcuts": [
      "ia"
    ],
    "title": "Internet Archive",
    "mobile": "https://web.archive.org/web/*/%s"
  },
  {
    "mobile": "https://www.linkedin.com/search/results/all?keywords=%s",
    "title": "Linkedin",
    "shortcuts": [
      "linkedin"
    ]
  },
  {
    "mobile": "https://www.macstories.net/?s=%s",
    "title": "MacStories",
    "shortcuts": [
      "macs"
    ]
  },
  {
    "mobile": "https://www.bing.com/search?q=%s",
    "title": "Microsoft Bing",
    "shortcuts": [
      "b",
      "bing"
    ]
  },
  {
    "favicon": "copilot.microsoft.com",
    "shortcuts": [
      "copilot"
    ],
    "definition": "Microsoft Copilot in Bing Chat is an AI-powered assistant that helps users with various tasks and queries directly within Bing. It leverages advanced AI models to provide contextual responses, streamline search results, and offer personalized assistance based on user input. Copilot can help with drafting content, answering questions, and generating summaries, enhancing the overall search and productivity experience within Bing.",
    "title": "Microsoft Copilot",
    "mobile": "https://www.bing.com/search?showconv=1&sendquery=1&q=%s"
  },
  {
    "mobile": "https://www.nature.com/search?q=%s",
    "title": "Nature",
    "shortcuts": [
      "nature"
    ]
  },
  {
    "mobile": "https://onelook.com/thesaurus/?s=%s",
    "title": "OneLook",
    "shortcuts": [
      "onelook"
    ]
  },
  {
    "mobile": "https://www.onesearch.com/yhs/search?p=%s",
    "title": "OneSearch",
    "shortcuts": [
      "onesearch"
    ]
  },
  {
    "title": "OnlyFans",
    "mobile": "https://onlyfans.com/search?q=%s",
    "shortcuts": [
      "onlyfans"
    ]
  },
  {
    "title": "Search",
    "mobile": "https://www.search.com/web?q=%s",
    "shortcuts": [
      "search"
    ]
  },
  {
    "title": "SearXNG",
    "mobile": "https://searx.be/search?q=%s",
    "shortcuts": [
      "searx"
    ]
  },
  {
    "title": "Spotify",
    "mobile": "https://open.spotify.com/search/results/%s",
    "shortcuts": [
      "spotify"
    ]
  },
  {
    "favicon": "spotify.com",
    "shortcuts": [
      "spotifyapp"
    ],
    "title": "Spotify App",
    "mobile": "spotify://search/%s"
  },
  {
    "title": "Stack Exchange",
    "mobile": "https://stackexchange.com/search?q=%s",
    "shortcuts": [
      "stackexchange"
    ]
  },
  {
    "title": "Stack Overflow",
    "mobile": "https://stackoverflow.com/search?q=%s",
    "shortcuts": [
      "so"
    ]
  },
  {
    "title": "Startpage",
    "mobile": "https://www.startpage.com/search?query=%s",
    "shortcuts": [
      "start"
    ]
  },
  {
    "title": "TechRadar",
    "mobile": "https://www.techradar.com/search?searchTerm=%s",
    "shortcuts": [
      "techradar"
    ]
  },
  {
    "mobile": "https://www.techspot.com/search/?cx=partner-pub-7395890353660701%3Aj5claj-6kfy&q=%s",
    "title": "TechSpot",
    "shortcuts": [
      "techspot"
    ]
  },
  {
    "desktop": "https://www.tiktok.com/search?q=%s",
    "mobile": "https://www.tiktok.com/search?q=%s",
    "title": "Tiktok",
    "shortcuts": [
      "tt",
      "tiktok"
    ]
  },
  {
    "mobile": "https://www.tumblr.com/search?q=%s",
    "title": "Tumblr",
    "shortcuts": [
      "tumblr"
    ]
  },
  {
    "favicon": "www.tumblr.com",
    "shortcuts": [
      "tumblrtag"
    ],
    "title": "Tumblr App Tag",
    "mobile": "tumblr://x-callback-mobile/tag?tag=%s"
  },
  {
    "shortcuts": [
      "twitch"
    ],
    "desktop": "https://www.twitch.tv/search?term=%s",
    "title": "Twitch",
    "mobile": "https://m.twitch.tv/search?term=%s"
  },
  {
    "mobile": "https://wa.me/%s",
    "definition": "WhatsApp direct message without adding to contacts, where **%s** is the phone number with country code.",
    "title": "WhatsApp Direct Message",
    "shortcuts": [
      "whatsappmsg"
    ]
  },
  {
    "mobile": "https://wikihow.com/wikiHowTo?search=%s",
    "title": "Wikihow",
    "shortcuts": [
      "wikihow"
    ]
  },
  {
    "mobile": "https://en.wikipedia.org/wiki/%s",
    "title": "Wikipedia",
    "shortcuts": [
      "w",
      "wiki"
    ],
    "favicon": "wikipedia.org"
  },
  {
    "mobile": "https://xeek.com/items?search?q=%s",
    "title": "xeek",
    "shortcuts": [
      "xeek"
    ]
  },
  {
    "mobile": "https://search.yahoo.com/search?p=%s",
    "title": "Yahoo!",
    "shortcuts": [
      "yh",
      "yahoo"
    ]
  },
  {
    "mobile": "https://news.search.yahoo.com/search?p=%s",
    "title": "Yahoo! News",
    "shortcuts": [
      "yhnews"
    ]
  },
  {
    "mobile": "https://yandex.com/search?text=%s",
    "title": "Yandex",
    "shortcuts": [
      "yd",
      "yandex"
    ]
  }
];
