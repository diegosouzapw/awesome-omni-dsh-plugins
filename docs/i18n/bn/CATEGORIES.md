# ক্যাটালগ ক্যাটাগরি

> 🌐 [English](../../CATEGORIES.md) · [Português (Brasil)](../pt-BR/CATEGORIES.md) · [中文（简体）](../zh-CN/CATEGORIES.md) · **বাংলা**

প্রতিটি ক্যাটালগ এন্ট্রির একটি আর্টিফ্যাক্ট kind, একটি প্রাথমিক সক্ষমতা ক্যাটাগরি এবং শূন্য বা তার বেশি
ট্যাগ থাকে। প্রাথমিক ক্যাটাগরি নির্ধারণ করে এন্ট্রিটি কোথায় প্রদর্শিত হয়; ট্যাগগুলি এন্ট্রি নকল না করে
ক্রস-ক্যাটাগরি সার্চ প্রদান করে।

## আর্টিফ্যাক্ট kind

<!-- catalog-policy:aggregators-never-entries -->

| Value | অর্থ | একটি প্লাগইন হিসেবে স্টার-র‍্যাঙ্কড |
|---|---|---:|
| `plugin` | ইনস্টলযোগ্য নেটিভ DSH বান্ডল | শুধুমাত্র যখন প্রতিটি র‍্যাঙ্কিং শর্ত পূরণ হয় |
| `plugin-family` | একাধিক DSH প্লাগইন সম্বলিত রিপোজিটরি | না; পৃথক বিভাগ |
| `skin-theme` | DSH UI স্কিন বা ভিজ্যুয়াল থিম | না; পৃথক বিভাগ |
| `skill` | DSH সমর্থনসহ এজেন্ট স্কিল | না |
| `preset-profile` | DSH প্রোফাইল বা প্রিসেট | না |
| `client-interface` | ডেস্কটপ, TUI, এডিটর বা রিমোট ক্লায়েন্ট | না |
| `bridge-adapter` | অন্য একটি প্রোডাক্ট থেকে DSH-এ ইন্টিগ্রেশন | না |
| `ecosystem-project` | একটি DSH ইন্টিগ্রেশন সম্বলিত বৃহত্তর প্রকল্প | না |

একটি ছাতা রিপোজিটরি, অ্যাগ্রিগেটর, মার্কেটপ্লেস, ইনস্টলার ক্যাটালগ বা তালিকা কখনও একটি ক্যাটালগ এন্ট্রি
নয়, এমনকি যখন অ্যাগ্রিগেটরটি নিজেই ইনস্টলযোগ্য হয়। এটি শুধুমাত্র একটি সূত্র হিসেবে ব্যবহার করা যেতে পারে।
প্রতিটি সূত্র অনুসরণ করে একটি স্বতন্ত্রভাবে ইনস্টলযোগ্য চাইল্ড আর্টিফ্যাক্টে যান এবং জমা দেওয়ার আগে সেই
আর্টিফ্যাক্টের প্রকৃত স্রষ্টা, মূল রিপোজিটরি, প্যাকেজ এবং সোর্স সাবপাথ সমাধান করুন। একটি প্রকৃত স্রষ্টা
মনোরিপো একটি চাইল্ড প্লাগইনের জন্য মূল রিপোজিটরি হতে পারে, কিন্তু চাইল্ডকে অবশ্যই সেই সঠিক সাবপাথ এবং
মনোরিপো স্টার নীতি ব্যবহার করতে হবে।

`kind` ফিল্ডটি প্রামাণ্য DSH আর্টিফ্যাক্ট ডিসক্রিমিনেটর। কোনো পৃথক ইন্টিগ্রেশন kind নেই: `plugin`
ইতিমধ্যে একটি নেটিভ DSH বান্ডল বোঝায়, যখন `ecosystem-project` ইতিমধ্যে DSH ইন্টিগ্রেশনসহ একটি বৃহত্তর
প্রকল্প বোঝায়। এটি পরস্পরবিরোধী শ্রেণীবিভাগ জোড়া প্রতিরোধ করে।

## প্রাথমিক সক্ষমতা ক্যাটাগরি

| Value | প্রদর্শন লেবেল |
|---|---|
| `user-interface-dashboards` | User interface and dashboards |
| `memory-rag` | Memory and RAG |
| `search-research` | Search and research |
| `coding-developer-tools` | Coding and developer tools |
| `browser-automation` | Browser and automation |
| `vision-audio-multimodal` | Vision, audio and multimodal |
| `sessions-productivity` | Sessions and productivity |
| `security-permissions-approvals` | Security, permissions and approvals |
| `diagnostics-observability` | Diagnostics and observability |
| `models-providers-routing` | Models, providers and routing |
| `messaging-notifications` | Messaging and notifications |
| `data-external-services` | Data and external services |
| `entertainment-customization` | Entertainment and customization |

সেই ক্যাটাগরিটি বেছে নিন যা প্লাগইনের প্রাথমিক কাজকে সর্বোত্তমভাবে প্রতিনিধিত্ব করে, দৃশ্যমানতা বাড়ানোর
সম্ভাবনা সবচেয়ে বেশি এমন ক্যাটাগরি নয়।

## ইন্টারফেস ট্যাগ

স্ট্যান্ডার্ড ইন্টারফেস ট্যাগের মধ্যে রয়েছে `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`,
`mobile`, `remote`, `editor`, `headless` এবং `theme`। অতিরিক্ত লোয়ারকেস kebab-case সক্ষমতা ট্যাগের
অনুমতি রয়েছে যখন সেগুলি পিন করা মূল সোর্সে দৃশ্যমান প্রমাণ বর্ণনা করে।

## রিপোজিটরি স্কোপ

শুধুমাত্র তখনই `dedicated` ব্যবহার করুন যখন রিপোজিটরি স্টার ঠিক ক্যাটালগভুক্ত প্লাগইনের অন্তর্গত।
`monorepo` ব্যবহার করুন যখন প্লাগইনটি একটি বৃহত্তর প্রকল্পের ভেতরে একটি সাবপাথ বা প্যাকেজ। একটি মনোরিপো
এন্ট্রিকে অবশ্যই `popularity.starsPolicy: undefined-parent-repository` এবং
`popularity.stars: null` ব্যবহার করতে হবে।

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
