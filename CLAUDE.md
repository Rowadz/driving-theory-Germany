# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a German driving theory exam preparation project consisting of three components:
1. **Scraper** (root directory) - Scrapes driving theory questions from clickclickdrive.de
2. **Telegram Bot** (`driving-theory-bot/`) - A quiz bot with spaced repetition learning
3. **Study Web App** (`study-app/`) - React-based study application with quiz mode

## Commands

### Study Web App (`study-app/`)
```bash
# Development
cd study-app && npm run dev

# Build for production
cd study-app && npm run build

# Preview production build
cd study-app && npm run preview

# Lint
cd study-app && npm run lint
```

### Scraper (root directory)
```bash
# Run the English scraper
uv run python scraper.py

# Run the German scraper
uv run python scraper_de.py
```

### Telegram Bot (`driving-theory-bot/`)
```bash
# Run the bot (from driving-theory-bot directory)
./run.sh

# Or directly with uv
cd driving-theory-bot/src && uv run python main.py
```

## Architecture

### Study Web App (`study-app/`)
React + TypeScript application with Redux Toolkit and DaisyUI:

- **Tech Stack**: Vite, React 19, Redux Toolkit, React Router, Tailwind CSS v4, DaisyUI v5
- **State Management**: Redux slices in `src/features/`:
  - `questions/`: Loads questions from JSON
  - `study/`: Study mode state (current index, revealed answers)
  - `quiz/`: Quiz mode state (30 random questions, score tracking)
  - `progress/`: Quiz history persisted to localStorage
- **Pages**: Home, StudyMode, QuizMode, QuizResults, History
- **Components**: QuestionCard, OptionButton, Feedback, Navigation
- **Data**: Reads `driving_theory_questions.json` from `public/` folder

### Scraper
- `scraper.py` / `scraper_de.py`: Scrapes questions from clickclickdrive.de (English/German)
- Exports to JSON, CSV, and Markdown formats
- Downloads images to `images/` and videos to `videos/`

### Telegram Bot Architecture
The bot follows KISS, DRY, YAGNI, and SOLID principles:

- **`src/main.py`**: Bot initialization with connection pooling (20 connections), rate limiting (10 req/min per user)
- **`src/database/`**: SQLite with connection pooling (`db_pool.py`) and batch writes (`db_manager.py`)
- **`src/handlers/quiz_handler.py`**: Telegram interaction logic
- **`src/utils/`**: Question loader, spaced repetition (SM-2 algorithm), rate limiter

### Data Flow
1. Questions stored in `driving_theory_questions.json` (English) at root
2. Study app copies JSON to `study-app/public/` for client-side loading
3. Progress persisted to localStorage (study app) or SQLite (Telegram bot)

## Dependencies

- **Study App** (npm): React, Redux Toolkit, React Router, Tailwind CSS v4, DaisyUI v5
- **Scraper** (uv): beautifulsoup4, lxml, pandas, requests
- **Bot** (uv): python-telegram-bot, aiosqlite, python-dotenv
