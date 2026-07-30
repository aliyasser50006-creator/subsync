# SubSync AI 🎬

> A modern, full-stack SaaS web application for uploading, rendering, styling, editing, and managing video subtitles in real time.

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

**SubSync AI** is a production-ready web platform designed to eliminate the friction, latency, and high computational costs associated with rendering subtitles onto videos.

Traditional subtitle tools rely on heavy server-side video re-encoding (e.g. via FFmpeg), forcing users to wait several minutes while consuming high CPU and cloud storage resources. SubSync AI introduces a high-performance **Client-Side HTML5 Subtitle Overlay Engine** that converts `.srt` subtitle files to WebVTT (`.vtt`) format on-the-fly and renders them directly inside an interactive browser video player with zero latency and zero server CPU load. 

For workflows requiring hardcoded video files, SubSync AI also includes a secondary server-side pipeline powered by **FFmpeg** and **yt-dlp**.

---

## Features

Only fully implemented features found in the codebase are listed below:

### 🔐 Authentication & Session Security
- **Supabase Auth Integration**: User sign-up and login with email and password.
- **Middleware Protected Routes**: Automatic session verification and route protection via Next.js middleware.
- **In-App Account Settings**: Password update capabilities and user profile settings.
- **Database Row Level Security (RLS)**: PostgreSQL RLS policies ensuring users can only read, update, or delete their own data.

### 🎨 Subtitle Upload & Styling Engine
- **Flexible Subtitle Parsing**: Instant conversion of `.srt` files into WebVTT (`.vtt`) format.
- **Live Customization Parameters** (saved per job in database `subtitle_settings` JSONB):
  - **Font Size**: Adjustable font sizing (16px to 48px).
  - **Color Control**: Hex color pickers for primary text color and outline/border color.
  - **Outline & Shadow**: Configurable outline width (0px to 5px) with drop-shadow effects.
  - **Placement & Alignment**: Top vs. Bottom screen positioning and Left, Center, or Right text alignment.
  - **Background Box**: Optional semi-transparent, blurred background card toggle.
  - **Timing Adjustment**: Subtitle delay/offset compensation in seconds.

### 🎥 Interactive Video Player
- **Custom HTML5 Player**: Built with `react-player` and a custom React subtitle overlay hook (`useSubtitleParser`).
- **Playback Controls**: Play/pause, jump backward/forward, seek timeline bar, volume control, and native fullscreen mode.
- **Speed Controls**: Selectable playback speeds (0.5x, 1x, 1.25x, 1.5x, 2x).
- **Subtitle Visibility Toggle**: Turn subtitle overlays on or off on-the-fly without re-rendering videos.

### ✏️ Interactive Subtitle Cue Editor
- **Timeline Cue Editing**: Modify start times, end times, and cue text inline.
- **Real-Time Validation**: Automatic detection of overlapping cues, empty lines, and timestamp errors.
- **Auto-Save Engine**: Background debounced auto-saving (`useAutoSave`) ensuring edits are saved to storage without losing work.
- **Search & Replace**: In-editor text search across subtitle cues.

### 📁 Video & Media Library Management
- **Media Manager Dashboard**: Dedicated Media Manager view (formerly My Videos) to organize and discover your content.
- **Rich Metadata System**: Associate videos with searchable Descriptions, Categories (with color coding), and Actors.
- **Categorization & Cast**: Centralized Category and Actor management panels for full CRUD control over the metadata taxonomy.
- **Advanced Filtering & Sorting**: Filter jobs by status (`ready`, `pending`, `processing`, `done`, `failed`) and availability (all vs. completed); search by title, and sort by newest, oldest, or title A-Z/Z-A.
- **Video Detail Inspector**: Dedicated detail page for examining video metadata, applied tags, playback links, and status.
- **Bulk & Single Operations**: Download subtitle files, duplicate records, or execute single/bulk deletions. Deletion purges both database records and corresponding files in Supabase Storage.
- **Random Library Explorer**: Custom RPC database function (`get_random_library_jobs`) for discovering library content with custom seed support.

### ⚡ Real-Time & Backend Pipeline
- **Realtime Job Monitoring**: Live status tracking via Supabase Realtime WebSocket subscriptions.
- **Legacy Subtitle Hardcoding**: Background server execution scripts using FFmpeg and `yt-dlp` for burning subtitles into video frames.

---

## Tech Stack

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white) **Framework**: Next.js 14 (App Router architecture)
- ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) **UI Library**: React 18
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) **Language**: TypeScript 5.2
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Styling**: Tailwind CSS & `next-themes` (Dark/Light modes)
- ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white) **Components**: Radix UI Primitives (Accordion, Dialog, Select, Dropdown, Tabs, Slider, etc.)
- ![Icons](https://img.shields.io/badge/Lucide_Icons-F97316?style=flat-square) **Icons**: Lucide React
- ![Animations](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) **Animations**: Framer Motion

### State Management & Utilities
- **Data Fetching**: TanStack React Query v5 & React Query Devtools
- **Form Management & Validation**: React Hook Form, `@hookform/resolvers`, and Zod
- **Virtualization & UI Components**: `@tanstack/react-virtual`, `embla-carousel-react`, `vaul` (drawers), `cmdk`, `sonner` (toasts), `recharts`

### Backend & Database
- **API & Server Logic**: Next.js API Routes & Server Actions (`'use server'`)
- **Database**: PostgreSQL hosted on Supabase with Row Level Security (RLS) policies
- **Relational Data**: Foreign key mappings, junction tables (`job_categories`, `job_actors`), and optimized metadata fetches
- **Auth Service**: Supabase Auth (`@supabase/ssr` and `@supabase/supabase-js`)
- **Realtime**: Supabase Realtime subscriptions
- **Object Storage**: Supabase Storage Buckets (`subtitles` and `videos`)

### Video & Media Tools
- **Client Player**: `react-player`
- **Video Downloader**: `yt-dlp`
- **Video Processing Engine**: FFmpeg (for server-side video burning)

---

## Project Architecture

SubSync AI employs a dual-engine architecture designed for optimal performance and cost efficiency:

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                                                                                   |
|  +-----------------------+     +------------------------+     +----------------+  |
|  | Subtitle Upload (.srt)| --> | SRT-to-WebVTT Converter| --> | Subtitle Parser|  |
|  +-----------------------+     +------------------------+     +----------------+  |
|                                                                        |          |
|  +------------------------------------------------------------------+  v          |
|  | Interactive Video Player & Live CSS Subtitle Overlay (<video>)   | <----+      |
|  +------------------------------------------------------------------+             |
+----------------------------------- | ---------------------------------------------+
                                     |  Sync Job State & Files
                                     v
+-----------------------------------------------------------------------------------+
|                                 SUPABASE BACKEND                                  |
|                                                                                   |
|  +--------------------+        +---------------------+      +------------------+  |
|  | Auth (JWT Sessions)|        | PostgreSQL (RLS DB) |      | Storage Buckets  |  |
|  +--------------------+        +---------------------+      +------------------+  |
+------------------------------------------ | --------------------------------------+
                                            | Trigger (Optional Legacy Burn)
                                            v
+-----------------------------------------------------------------------------------+
|                            FFMPEG SERVER / WORKER                                 |
|                                                                                   |
|  +-----------------+           +--------------------+       +------------------+  |
|  | Download Video  | --------> | Burn Subtitles via | ----> | Upload Output    |  |
|  | (via yt-dlp)    |           | FFmpeg             |       | MP4 Video        |  |
|  +-----------------+           +--------------------+       +------------------+  |
+-----------------------------------------------------------------------------------+
```

### Communication Flow
1. **Authentication**: The user logs in via Supabase Auth. Next.js middleware verifies session cookies for all protected `/(app)` routes.
2. **Overlay Flow (Default)**: Upon uploading a `.srt` subtitle file and inputting a video URL, the client converts the subtitle to `.vtt`, stores the metadata in the `jobs` database table via Server Actions, uploads the subtitle file to Supabase Storage, and immediately displays the video with interactive CSS overlays.
3. **Hardcoding Flow (Optional)**: If full video re-encoding is requested, the client calls `POST /api/process-video`. The backend downloads the source video via `yt-dlp`, fetches the `.srt` file, runs an FFmpeg filter script with user-customized font styling, uploads the processed MP4 to the public `videos` storage bucket, and updates the job status to `done`.

---

## Folder Structure

```
SubSync AI/
├── app/                          # Next.js 14 App Router pages & API endpoints
│   ├── (app)/                    # Protected routes layout group
│   │   ├── create/               # New job creation page
│   │   ├── dashboard/            # Main processing & video preview dashboard
│   │   ├── library/              # Paginated library view
│   │   ├── my-videos/            # Saved video management page
│   │   ├── profile/              # User profile details
│   │   └── settings/             # User settings & security
│   ├── api/                      # REST API endpoints
│   │   ├── jobs/                 # Job mutation routes (create, update, delete)
│   │   ├── process-video/        # Background FFmpeg processing route
│   │   └── subtitles/            # Subtitle content and download routes
│   ├── login/                    # Authentication login page
│   ├── register/                 # User registration page
│   ├── globals.css               # Global CSS & Tailwind design tokens
│   ├── layout.tsx                # Root layout with context providers
│   └── page.tsx                  # Landing / landing redirect page
├── components/                   # React UI components
│   ├── analytics/                # Analytics chart components
│   ├── dashboard/                # Job creation, URL, & styling cards
│   ├── landing/                  # Landing page sections (Hero, Features, FAQ, etc.)
│   ├── library/                  # Library grid, list, filter, & inspector components
│   ├── my-videos/                # Video management list and filter components
│   ├── subtitles/                # Subtitle library & interactive cue editor
│   ├── ui/                       # shadcn/ui base component library
│   ├── SubtitleOverlay.tsx       # Live CSS subtitle rendering overlay
│   ├── VideoPlayer.tsx           # Custom interactive video player component
│   └── app-sidebar.tsx           # Dashboard sidebar navigation
├── docs/                         # Extensive architecture & specification docs
├── hooks/                        # Custom React hooks
│   ├── use-optimized-search.ts   # Debounced search & filter hook
│   ├── use-subtitle-parser.ts    # Subtitle file fetch & cue parsing hook
│   └── use-toast.ts              # Toast notification hook
├── lib/                          # Backend logic, server actions, & Supabase utilities
│   ├── actions/                  # Next.js Server Actions (jobs.ts, subtitles.ts)
│   ├── contexts/                 # React Context providers (auth-context.tsx)
│   ├── data/                     # Data fetching helpers & random selection logic
│   ├── supabase/                 # Supabase client, server, & middleware configs
│   ├── types/                    # TypeScript interfaces for DB schemas & settings
│   └── utils/                    # Helper utilities & subtitle format converter
├── public/                       # Static public assets
├── scripts/                      # Database setup scripts (`setup-storage.sql`)
├── supabase/                     # PostgreSQL database migrations & RLS policies
│   └── migrations/               # Version-controlled SQL migration scripts
├── middleware.ts                 # Next.js authentication & cookie middleware
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── package.json                  # Project dependencies & scripts
```

---

## Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**
- **Supabase Account**: A hosted Supabase project (or local Supabase CLI instance)
- **FFmpeg & yt-dlp** *(Optional: Required only if executing local server-side video burning)*

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/subsync-ai.git
   cd subsync-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   LIBRARY_PAGE_SIZE=12
   ```

4. **Set Up Database & Storage**
   Execute the migration SQL scripts located in `supabase/migrations/` within your Supabase SQL Editor to establish the `jobs` table, custom RPC functions (`get_random_library_jobs`), and Row Level Security policies. (See [Configuration](#configuration) for storage bucket rules).

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration

### Environment Variables

| Variable | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | String | **Yes** | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | String | **Yes** | Your Supabase anonymous API key |
| `LIBRARY_PAGE_SIZE` | Number | Optional | Default number of items per page in library view (default: `12`) |

### Supabase Storage Buckets

Configure two storage buckets in your Supabase Dashboard:

#### 1. `subtitles` (Private Bucket)
- **MIME Types**: `text/plain`, `text/srt`, `application/x-subrip`, `text/vtt`
- **Size Limit**: 5MB - 10MB
- **Policy**: User-restricted (`auth.uid()::text = (storage.foldername(name))[1]`) for `INSERT`, `SELECT`, `UPDATE`, and `DELETE`.

#### 2. `videos` (Public Bucket)
- **MIME Types**: `video/mp4`, `video/webm`
- **Size Limit**: 500MB
- **Policy**: Public `SELECT`, authenticated `INSERT`, and owner-restricted `DELETE`.

---

## Usage

### 1. Account Sign Up & Login
Navigate to `/register` to create a new user account. Sessions are managed securely via HTTP cookies.

### 2. Uploading a Video & Subtitle
1. Go to the **Dashboard** (`/dashboard`).
2. Input a direct video URL (e.g. MP4 link or supported web URL).
3. Upload a `.srt` or `.vtt` subtitle file.
4. Customize subtitle appearance (font size, font color, outline width, position, and background card).

### 3. Real-Time Playback
Watch your video instantly in the interactive player with customized HTML5 subtitle overlays rendered in real time.

### 4. Editing Subtitles
Navigate to the **Subtitle Editor** (`/subtitles`) to modify timestamps, adjust cue text, validate formatting errors in real time, and auto-save changes.

### 5. Managing Your Library
Visit **My Videos** (`/my-videos`) or **Library** (`/library`) to search, filter, download, or execute bulk deletions of processed jobs.

---

## API Endpoints

The project includes the following API routes located under `app/api/`:

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/create` | Creates a new job record with video URL, subtitle path, and styling settings. | Bearer Token Required |
| `PATCH` | `/api/jobs/update` | Updates the title, video URL, or poster image of an existing job. | Bearer Token Required |
| `DELETE` | `/api/jobs/delete` | Deletes a job record and purges associated files from Supabase Storage buckets (`subtitles` and `videos`). | Bearer Token Required |
| `POST` | `/api/process-video` | Initiates backend video processing / hardcoding pipeline for a job. | Optional / Internal |
| `GET` | `/api/subtitles/content` | Fetches raw subtitle content (`text/vtt` or `application/x-subrip`) by file path. | Public / Path Encoded |
| `GET` | `/api/subtitles/download` | Downloads subtitle file with proper file headers and formatted filename. | Public / ID Parameter |

---

## Screenshots

*(Placeholders for application screenshots)*

| Dashboard & Overlay Styling | Interactive Subtitle Editor |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=SubSync+AI+Dashboard+%26+Styling) | ![Editor Placeholder](https://via.placeholder.com/600x350?text=Interactive+Subtitle+Cue+Editor) |

| Video Library & Filters | Custom Video Player Controls |
| :---: | :---: |
| ![Library Placeholder](https://via.placeholder.com/600x350?text=Paginated+Video+Library) | ![Player Placeholder](https://via.placeholder.com/600x350?text=Custom+Video+Player+Controls) |

---

## Future Improvements

Features not yet implemented in the codebase or planned for future development:

- [ ] **AI Automatic Subtitle Transcription**: Integration with OpenAI Whisper AI for automatic speech-to-text subtitle generation.
- [ ] **Multi-Language AI Translation**: Automatic translation of subtitle cues into multiple languages.
- [ ] **Automated Timestamp Alignment**: AI-driven audio-to-text sync offset correction.
- [ ] **Distributed FFmpeg Worker Queue**: AWS SQS / Lambda / EFS background worker cluster for enterprise-scale video hardcoding.
- [ ] **Team Collaboration & Shared Workspaces**: Workspace multi-tenancy and permissions for video editing teams.

---

## Contributing

Contributing guidelines:

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the **MIT License** - see the existing project documentation for details.

---

## Author

**SubSync AI Team**
- GitHub: [@subsync-ai](https://github.com/)
- Project Repository: [SubSync AI](https://github.com/)
