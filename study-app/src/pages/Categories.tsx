import { useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  toggleTheme,
  toggleFilter,
  startStudying,
  stopStudying,
  clearAllSelections,
  setCategoryIndex,
  nextCategoryQuestion,
  previousCategoryQuestion,
  toggleCategoryOption,
  revealCategoryAnswer,
  type QuestionTypeFilter,
} from "../features/categories/categoriesSlice";
import { QuestionCard } from "../components/QuestionCard";
import { OptionButton } from "../components/OptionButton";
import { Feedback } from "../components/Feedback";

interface FilterOption {
  id: QuestionTypeFilter;
  label: string;
  icon: string;
  count?: number;
}

export function Categories() {
  const dispatch = useAppDispatch();
  const { questions, loading } = useAppSelector((state) => state.questions);
  const {
    selectedThemes,
    selectedFilters,
    currentIndex,
    isAnswerRevealed,
    selectedOptions,
    isStudying,
  } = useAppSelector((state) => state.categories);

  // Get unique themes
  const themes = useMemo(() => {
    const themeSet = new Set(questions.map((q) => q.theme_name));
    return Array.from(themeSet).sort();
  }, [questions]);

  // Count questions per category
  const counts = useMemo(() => {
    return {
      all: questions.length,
      withImages: questions.filter((q) => q.image_urls.length > 0).length,
      withVideos: questions.filter((q) => q.video_urls.length > 0).length,
      multiAnswer: questions.filter((q) => q.correct_answers.length > 1).length,
      singleAnswer: questions.filter((q) => q.correct_answers.length === 1)
        .length,
      byTheme: themes.reduce(
        (acc, theme) => {
          acc[theme] = questions.filter((q) => q.theme_name === theme).length;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }, [questions, themes]);

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    // Apply theme filters (OR logic - include if matches any selected theme)
    if (selectedThemes.length > 0) {
      filtered = filtered.filter((q) => selectedThemes.includes(q.theme_name));
    }

    // Apply type filters (OR logic - include if matches any selected filter)
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((q) => {
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "with-images":
              return q.image_urls.length > 0;
            case "with-videos":
              return q.video_urls.length > 0;
            case "multi-answer":
              return q.correct_answers.length > 1;
            case "single-answer":
              return q.correct_answers.length === 1;
            default:
              return false;
          }
        });
      });
    }

    return filtered;
  }, [questions, selectedThemes, selectedFilters]);

  const filterOptions: FilterOption[] = [
    {
      id: "with-images",
      label: "With Pictures",
      icon: "🖼️",
      count: counts.withImages,
    },
    {
      id: "with-videos",
      label: "With Videos",
      icon: "🎬",
      count: counts.withVideos,
    },
    {
      id: "multi-answer",
      label: "Multiple Answers",
      icon: "☑️",
      count: counts.multiAnswer,
    },
    {
      id: "single-answer",
      label: "Single Answer",
      icon: "✓",
      count: counts.singleAnswer,
    },
  ];

  const hasSelections =
    selectedThemes.length > 0 || selectedFilters.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Show category selection if not studying
  if (!isStudying) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Browse by Category</h1>
        <p className="text-base-content/70 mb-8">
          Select multiple categories to combine filters. Questions matching any
          selected option will be included.
        </p>

        {/* Selection Summary & Actions */}
        {hasSelections && (
          <div className="alert mb-6">
            <div className="flex flex-wrap items-center gap-2 w-full">
              <span className="font-medium">Selected:</span>
              {selectedThemes.map((theme) => (
                <span key={theme} className="badge badge-primary gap-1">
                  {theme}
                  <button
                    className="ml-1"
                    onClick={() => dispatch(toggleTheme(theme))}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {selectedFilters.map((filter) => (
                <span key={filter} className="badge badge-secondary gap-1">
                  {filterOptions.find((f) => f.id === filter)?.label}
                  <button
                    className="ml-1"
                    onClick={() => dispatch(toggleFilter(filter))}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <span className="ml-auto text-sm text-base-content/70">
                {filteredQuestions.length} questions
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            className="btn btn-primary"
            disabled={filteredQuestions.length === 0}
            onClick={() => dispatch(startStudying())}
          >
            Start Studying ({filteredQuestions.length} questions)
          </button>
          {hasSelections && (
            <button
              className="btn btn-ghost"
              onClick={() => dispatch(clearAllSelections())}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Type Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Question Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filterOptions.map((option) => {
              const isSelected = selectedFilters.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer ${
                    isSelected ? "ring-2 ring-secondary" : ""
                  }`}
                >
                  <div className="card-body items-center text-center p-4">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary absolute top-2 right-2"
                      checked={isSelected}
                      onChange={() => dispatch(toggleFilter(option.id))}
                    />
                    <span className="text-3xl mb-2">{option.icon}</span>
                    <h3 className="font-medium text-sm">{option.label}</h3>
                    <span className="badge badge-ghost">{option.count}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Theme Filters */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => {
              const isSelected = selectedThemes.includes(theme);
              return (
                <label
                  key={theme}
                  className={`card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={isSelected}
                        onChange={() => dispatch(toggleTheme(theme))}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{theme}</h3>
                        <p className="text-sm text-base-content/60">
                          {counts.byTheme[theme]} questions
                        </p>
                      </div>
                      <div className="badge badge-primary badge-lg">
                        {counts.byTheme[theme]}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Show filtered questions view
  const currentQuestion = filteredQuestions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="alert alert-info">
          <span>No questions match the selected filters.</span>
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => dispatch(stopStudying())}
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const isMultipleChoice = currentQuestion.correct_answers.length > 1;
  const correctLetters = currentQuestion.correct_answers.map((a) => a.letter);
  const isCorrect =
    selectedOptions.length === correctLetters.length &&
    selectedOptions.every((opt) => correctLetters.includes(opt)) &&
    correctLetters.every((letter) => selectedOptions.includes(letter));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb / Filter Summary */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch(stopStudying())}
          >
            ← Back to Categories
          </button>
          {selectedThemes.map((theme) => (
            <span key={theme} className="badge badge-primary">
              {theme}
            </span>
          ))}
          {selectedFilters.map((filter) => (
            <span key={filter} className="badge badge-secondary">
              {filterOptions.find((f) => f.id === filter)?.label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">
            {selectedThemes.length > 0
              ? selectedThemes.join(", ")
              : selectedFilters.length > 0
                ? selectedFilters
                    .map((f) => filterOptions.find((fo) => fo.id === f)?.label)
                    .join(", ")
                : "All Questions"}
          </h1>
          <span className="text-sm text-base-content/60">
            {currentIndex + 1} / {filteredQuestions.length}
          </span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={currentIndex + 1}
          max={filteredQuestions.length}
        ></progress>
      </div>

      {/* Jump to question */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">Jump to:</span>
        <input
          type="number"
          min={1}
          max={filteredQuestions.length}
          value={currentIndex + 1}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= filteredQuestions.length) {
              dispatch(setCategoryIndex(value - 1));
            }
          }}
          className="input input-bordered input-sm w-20"
        />
        <span className="text-sm text-base-content/60">
          of {filteredQuestions.length}
        </span>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={filteredQuestions.length}
      />

      {isMultipleChoice && (
        <div role="alert" className="alert alert-info mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            This question has multiple correct answers. Select all that apply.
          </span>
        </div>
      )}

      <div className="space-y-3 mt-6">
        {currentQuestion.options.map((option) => (
          <OptionButton
            key={option.letter}
            option={option}
            isSelected={selectedOptions.includes(option.letter)}
            isRevealed={isAnswerRevealed}
            correctAnswers={currentQuestion.correct_answers}
            onClick={() => dispatch(toggleCategoryOption(option.letter))}
          />
        ))}
      </div>

      {isAnswerRevealed && (
        <Feedback
          isCorrect={isCorrect}
          explanation={currentQuestion.comment}
          correctAnswers={currentQuestion.correct_answers}
        />
      )}

      <div className="flex justify-between mt-8">
        <button
          className="btn btn-outline"
          onClick={() => dispatch(previousCategoryQuestion())}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {!isAnswerRevealed ? (
          <button
            className="btn btn-primary"
            onClick={() => dispatch(revealCategoryAnswer())}
            disabled={selectedOptions.length === 0}
          >
            Check Answer
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() =>
              dispatch(nextCategoryQuestion(filteredQuestions.length))
            }
            disabled={currentIndex === filteredQuestions.length - 1}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
