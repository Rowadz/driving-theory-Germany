# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **German Class B (car) driving theory exam** preparation project. The question set is filtered to include only questions relevant to Class B license holders (excludes truck/bus/tractor-specific content).

Components:
1. **Study Web App** (`study-app/`) - React-based study application with quiz and study modes
2. **Scraper** (root directory) - Scrapes driving theory questions from clickclickdrive.de
3. **Telegram Bot** (`driving-theory-bot/`) - A quiz bot with spaced repetition learning

## Commands

### Study Web App (`study-app/`)
```bash
cd study-app && npm run dev      # Development server
cd study-app && npm run build    # Build for production
cd study-app && npm run preview  # Preview production build
cd study-app && npm run lint     # Lint
```

### Scraper (root directory)
```bash
uv run python scraper.py      # English questions
uv run python scraper_de.py   # German questions
```

### Telegram Bot (`driving-theory-bot/`)
```bash
./run.sh                                        # Run the bot
cd driving-theory-bot/src && uv run python main.py  # Direct run
```

## Architecture

### Study Web App (`study-app/`)
React 19 + TypeScript + Redux Toolkit + DaisyUI 5

**Tech Stack**: Vite 7, React 19, Redux Toolkit 2, React Router 7, Tailwind CSS 4, DaisyUI 5

**State Management** (`src/features/`):
- `questions/questionsSlice.ts` - Loads questions from JSON
- `study/studySlice.ts` - Study mode state (current index, revealed answers)
- `quiz/quizSlice.ts` - Quiz mode state (30 random questions, score tracking)
- `progress/progressSlice.ts` - Quiz history persisted to localStorage
- `categories/categoriesSlice.ts` - Category filtering by theme/chapter

**Pages** (`src/pages/`): Home, Categories, StudyMode, QuizMode, QuizResults, History

**Components** (`src/components/`): QuestionCard, OptionButton, Feedback, Navigation

**Data**: Reads `driving_theory_questions.json` (2162 Class B questions) from `public/`

### Data Format
Questions in `driving_theory_questions.json`:
- `theme_number/name` - Top-level category (e.g., "Theme 1.1.", "Danger Teaching")
- `chapter_number/name` - Sub-category (e.g., "1.1.01 Chapter", "Basic Forms Of Traffic Behavior")
- `question_id`, `question_text`, `options`, `correct_answers`, `comment`
- `image_urls`, `local_image_paths`, `video_urls`, `local_video_paths`

### Scraper
- `scraper.py` / `scraper_de.py`: Scrapes questions from clickclickdrive.de
- Exports to JSON, CSV, and Markdown formats
- Downloads images to `images/` and videos to `videos/`

### Telegram Bot
- **`src/main.py`**: Bot init with connection pooling, rate limiting
- **`src/database/`**: SQLite with connection pooling and batch writes
- **`src/handlers/quiz_handler.py`**: Telegram interaction logic
- **`src/utils/`**: Question loader, spaced repetition (SM-2), rate limiter
