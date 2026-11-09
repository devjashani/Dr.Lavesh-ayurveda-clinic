'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import {
  TEN_QUIZ_QUESTIONS,
  DOSHA_PROFILES,
  QuizQuestion,
  DoshaProfile,
} from '@/lib/data/doshaQuiz';
import { treatments } from '@/lib/data/treatments';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Printer,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Compass,
  FileText,
  Heart,
  Flame,
  Wind,
  Droplets,
} from 'lucide-react';

interface Scores {
  Vata: number;
  Pitta: number;
  Kapha: number;
}

export function DoshaQuizClient() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'Vata' | 'Pitta' | 'Kapha'>>({});
  const [direction, setDirection] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalQuestions = TEN_QUIZ_QUESTIONS.length;
  const currentQuestion: QuizQuestion = TEN_QUIZ_QUESTIONS[currentIndex];

  // Calculate scores
  const scores: Scores = useMemo(() => {
    const s: Scores = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach((dosha) => {
      s[dosha] += 1;
    });
    return s;
  }, [answers]);

  const totalAnswered = Object.keys(answers).length;
  const vataPercent = totalAnswered > 0 ? Math.round((scores.Vata / totalAnswered) * 100) : 0;
  const pittaPercent = totalAnswered > 0 ? Math.round((scores.Pitta / totalAnswered) * 100) : 0;
  const kaphaPercent = totalAnswered > 0 ? Math.round((scores.Kapha / totalAnswered) * 100) : 0;

  // Determine dominant Prakriti
  const dominantProfile: DoshaProfile = useMemo(() => {
    const sorted = [
      { dosha: 'Vata' as const, score: scores.Vata },
      { dosha: 'Pitta' as const, score: scores.Pitta },
      { dosha: 'Kapha' as const, score: scores.Kapha },
    ].sort((a, b) => b.score - a.score);

    const first = sorted[0];
    const second = sorted[1];

    // Tridoshic if all three are within 1 point of each other
    if (Math.abs(first.score - second.score) <= 1 && Math.abs(second.score - sorted[2].score) <= 1 && totalAnswered >= 9) {
      return DOSHA_PROFILES['Tridoshic'];
    }

    // Dual dosha if top two are tied or within 1 point
    if (first.score - second.score <= 1 && totalAnswered >= 6) {
      const dualKey = [first.dosha, second.dosha].sort().reverse().join('-');
      if (DOSHA_PROFILES[dualKey]) {
        return DOSHA_PROFILES[dualKey];
      }
      if (dualKey === 'Pitta-Vata' && DOSHA_PROFILES['Vata-Pitta']) {
        return DOSHA_PROFILES['Vata-Pitta'];
      }
      if (dualKey === 'Kapha-Vata' && DOSHA_PROFILES['Vata-Kapha']) {
        return DOSHA_PROFILES['Vata-Kapha'];
      }
    }

    // Single dominant
    return DOSHA_PROFILES[first.dosha] || DOSHA_PROFILES['Vata'];
  }, [scores, totalAnswered]);

  // Save to localStorage when completed
  useEffect(() => {
    if (isCompleted && typeof window !== 'undefined') {
      try {
        const payload = {
          dominantDosha: dominantProfile.dosha,
          typeName: dominantProfile.type,
          scores: {
            Vata: vataPercent,
            Pitta: pittaPercent,
            Kapha: kaphaPercent,
          },
          timestamp: Date.now(),
        };
        localStorage.setItem('aarogyam_dosha_result', JSON.stringify(payload));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
    }
  }, [isCompleted, dominantProfile, vataPercent, pittaPercent, kaphaPercent]);

  // Answer selection handler
  const handleSelectOption = useCallback(
    (dosha: 'Vata' | 'Pitta' | 'Kapha') => {
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: dosha,
      }));

      if (currentIndex < totalQuestions - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    },
    [currentIndex, totalQuestions]
  );

  // Back button handler
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Restart quiz
  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setDirection(1);
  };

  // Keyboard navigation support (1, 2, 3, A, B, C, Backspace, ArrowLeft)
  useEffect(() => {
    if (isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '1' || e.key === 'a' || e.key === 'A') {
        const opt = currentQuestion.options[0];
        if (opt) handleSelectOption(opt.dosha);
      } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
        const opt = currentQuestion.options[1];
        if (opt) handleSelectOption(opt.dosha);
      } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
        const opt = currentQuestion.options[2];
        if (opt) handleSelectOption(opt.dosha);
      } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted, currentQuestion, handleSelectOption, handleBack]);

  // Recommended treatment objects
  const recommendedTreatments = useMemo(() => {
    return dominantProfile.recommendedTherapySlugs
      .map((slug) => treatments.find((t) => t.slug === slug || t.aliases?.includes(slug)))
      .filter((t): t is (typeof treatments)[0] => Boolean(t))
      .slice(0, 3);
  }, [dominantProfile]);

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `I completed the Aarogyam Classical Dosha Quiz and discovered my constitutional Prakriti is ${dominantProfile.type} (${vataPercent}% Vata · ${pittaPercent}% Pitta · ${kaphaPercent}% Kapha). Discover your classical Ayurvedic constitution: https://aarogyamayurveda.com/dosha-quiz`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Print as PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <div className="py-12 sm:py-20 min-h-[85vh] flex flex-col justify-center">
      <Container size="default">
        {/* ===================== QUIZ VIEW ===================== */}
        {!isCompleted ? (
          <div className="max-w-2xl mx-auto w-full">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <nav aria-label="Breadcrumb" className="text-xs font-mono text-ink/60">
                <Link href="/" className="hover:text-deep-forest underline">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-forest font-semibold">Dosha Quiz</span>
              </nav>

              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-forest hover:text-deep-forest transition-colors cursor-pointer px-2 py-1 rounded hover:bg-forest/5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            {/* Progress Header */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-turmeric animate-pulse" />
                  <span className="text-forest font-semibold uppercase tracking-wider">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                </div>
                <span className="text-ink/60">
                  {Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-forest/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-forest rounded-full"
                  initial={false}
                  animate={{
                    width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-sage pt-1">
                <span>{currentQuestion.category}</span>
                <span className="font-devanagari text-turmeric">
                  {currentQuestion.sanskritCategory}
                </span>
              </div>
            </div>

            {/* Animated Question Card */}
            <div className="bg-cream/90 border border-forest/20 rounded-[4px] p-6 sm:p-10 shadow-xs relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-deep-forest font-normal tracking-tight leading-snug">
                      {currentQuestion.question}
                    </h2>
                    <p className="text-xs sm:text-sm text-ink/70 font-mono mt-2">
                      {currentQuestion.context}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentIndex] === option.dosha;
                      const keyboardKey = idx === 0 ? '1' : idx === 1 ? '2' : '3';

                      return (
                        <button
                          key={option.dosha}
                          type="button"
                          onClick={() => handleSelectOption(option.dosha)}
                          className={`w-full text-left p-4 sm:p-5 rounded-[4px] border transition-all duration-200 cursor-pointer flex items-start gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                            isSelected
                              ? 'bg-forest text-cream border-forest shadow-xs'
                              : 'bg-paper/90 text-ink border-forest/15 hover:border-forest/40 hover:bg-paper'
                          }`}
                        >
                          {/* Keyboard shortcut hint / Option index */}
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors mt-0.5 ${
                              isSelected
                                ? 'bg-cream text-deep-forest'
                                : 'bg-forest/10 text-forest group-hover:bg-forest group-hover:text-cream'
                            }`}
                          >
                            {keyboardKey}
                          </span>

                          <div className="flex-1 space-y-1">
                            <span
                              className={`text-sm sm:text-base leading-relaxed block ${
                                isSelected ? 'text-cream font-medium' : 'text-deep-forest'
                              }`}
                            >
                              {option.text}
                            </span>
                            {option.sanskritTrait && (
                              <span
                                className={`text-[11px] font-mono block ${
                                  isSelected ? 'text-cream/80' : 'text-sage'
                                }`}
                              >
                                {option.sanskritTrait}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Subtle Keyboard Hint */}
              <div className="mt-8 pt-4 border-t border-forest/10 flex items-center justify-between text-[11px] font-mono text-ink/50">
                <span className="hidden sm:inline">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-paper border border-forest/15 rounded text-[10px]">1</kbd>, <kbd className="px-1.5 py-0.5 bg-paper border border-forest/15 rounded text-[10px]">2</kbd>, or <kbd className="px-1.5 py-0.5 bg-paper border border-forest/15 rounded text-[10px]">3</kbd> to choose
                </span>
                <span>
                  Charaka Samhita · Vimanasthana Taxonomy
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ===================== RESULT VIEW ===================== */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto w-full space-y-10"
            id="dosha-result-report"
          >
            {/* Header Banner */}
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
                Prakriti Assessment Result · प्रकृति विश्लेषण
              </span>
              <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
                Your Constitutional Blueprint
              </h1>
              <p className="font-devanagari text-turmeric text-2xl sm:text-3xl font-normal">
                {dominantProfile.sanskritName}
              </p>
              <p className="text-body-base text-ink/75 max-w-xl mx-auto">
                Governed primarily by the elements of{' '}
                <strong>{dominantProfile.elements}</strong> ({dominantProfile.elementSanskrit}).
              </p>
            </div>

            {/* Three Percentage Bars */}
            <div className="bg-cream/90 border border-forest/20 rounded-[4px] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold">
                Tri-Dosha Ratio Breakdown
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vata Bar */}
                <div className="space-y-2 p-4 bg-paper rounded border border-forest/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-deep-forest flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-sage" />
                      Vata (वात)
                    </span>
                    <span className="font-bold text-deep-forest text-sm">{vataPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-forest/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sage rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${vataPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-ink/60 block">
                    Ether & Air · Governs Movement & Nervous Impulse
                  </span>
                </div>

                {/* Pitta Bar */}
                <div className="space-y-2 p-4 bg-paper rounded border border-forest/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-deep-forest flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-turmeric" />
                      Pitta (पित्त)
                    </span>
                    <span className="font-bold text-deep-forest text-sm">{pittaPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-forest/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-turmeric rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pittaPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-ink/60 block">
                    Fire & Water · Governs Digestion & Metabolism
                  </span>
                </div>

                {/* Kapha Bar */}
                <div className="space-y-2 p-4 bg-paper rounded border border-forest/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-deep-forest flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-forest" />
                      Kapha (कफ)
                    </span>
                    <span className="font-bold text-deep-forest text-sm">{kaphaPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-forest/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-forest rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${kaphaPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-ink/60 block">
                    Water & Earth · Governs Structure, Immunity & Stability
                  </span>
                </div>
              </div>

              {/* Classical Quote Callout */}
              <div className="p-4 bg-paper/90 rounded border-l-2 border-turmeric text-xs italic text-deep-forest font-serif leading-relaxed">
                &ldquo;{dominantProfile.charakaQuote}&rdquo;
              </div>
            </div>

            {/* Overview & Core Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left: Overview & Strengths */}
              <div className="bg-cream/80 border border-forest/15 rounded-[4px] p-6 sm:p-7 space-y-4">
                <h3 className="text-display-h3 text-deep-forest font-normal">
                  Constitutional Overview
                </h3>
                <p className="text-body-sm text-ink/80 leading-relaxed">
                  {dominantProfile.overview}
                </p>

                <div className="pt-3 border-t border-forest/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                    Natural Strengths (प्रकृति गुण)
                  </h4>
                  <ul className="space-y-1.5">
                    {dominantProfile.strengths.map((str, i) => (
                      <li key={i} className="text-xs text-ink/80 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Vulnerabilities & Herbs */}
              <div className="bg-cream/80 border border-forest/15 rounded-[4px] p-6 sm:p-7 space-y-4">
                <h3 className="text-display-h3 text-deep-forest font-normal">
                  Potential Imbalances (विकृति सम्भावना)
                </h3>
                <ul className="space-y-1.5">
                  {dominantProfile.vulnerabilities.map((vuln, i) => (
                    <li key={i} className="text-xs text-ink/80 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-forest/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-turmeric" />
                    Key Herbal Allies (औषध द्रव्य)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dominantProfile.classicalHerbs.map((herb, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded bg-paper border border-forest/15 text-deep-forest font-medium"
                      >
                        {herb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Diet & Lifestyle Guidance (Pathya vs Apathya) */}
            <div className="bg-cream/80 border border-forest/15 rounded-[4px] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-turmeric font-semibold block mb-1">
                  Pathya & Apathya Guide
                </span>
                <h3 className="text-display-h2 text-deep-forest font-normal">
                  Dietary & Lifestyle Recommendations
                </h3>
                <p className="text-body-sm text-ink/75 mt-1">
                  {dominantProfile.dailyRoutineAdvice}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Foods to Favor */}
                <div className="p-5 bg-paper rounded border border-forest/15 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-forest" />
                    Foods to Favor (पथ्य आहार)
                  </h4>
                  <ul className="space-y-2">
                    {dominantProfile.foodsToFavor.map((food, i) => (
                      <li key={i} className="text-xs text-ink/80 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Foods to Reduce */}
                <div className="p-5 bg-paper rounded border border-clay/20 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-clay font-semibold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-clay" />
                    Foods to Moderate / Avoid (अपथ्य आहार)
                  </h4>
                  <ul className="space-y-2">
                    {dominantProfile.foodsToReduce.map((food, i) => (
                      <li key={i} className="text-xs text-ink/80 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommended Classical Therapies */}
            {recommendedTreatments.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold block mb-1">
                      Targeted Classical Chikitsa
                    </span>
                    <h3 className="text-display-h2 text-deep-forest font-normal">
                      Recommended Therapies for {dominantProfile.type}
                    </h3>
                  </div>
                  <Button href="/treatments" variant="text-link" size="sm">
                    View all 12 therapies
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendedTreatments.map((therapy) => (
                    <Link
                      key={therapy.slug}
                      href={`/treatments/${therapy.slug}`}
                      className="group p-5 bg-cream/70 hover:bg-cream border border-forest/15 hover:border-forest/40 rounded-[4px] transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-sage">
                          <span>{therapy.category}</span>
                          <span className="font-devanagari text-turmeric">
                            {therapy.sanskritName}
                          </span>
                        </div>
                        <h4 className="text-lg font-serif text-deep-forest font-normal group-hover:text-forest transition-colors">
                          {therapy.name}
                        </h4>
                        <p className="text-body-sm text-ink/75 line-clamp-2">
                          {therapy.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-forest/10 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] text-ink/60">{therapy.duration}</span>
                        <span className="font-medium text-forest group-hover:text-turmeric inline-flex items-center gap-1 transition-colors">
                          <span>View Protocol</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action & Sharing Strip */}
            <div className="bg-forest text-cream rounded-[4px] p-6 sm:p-10 space-y-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
                  Clinical Confirmation
                </span>
                <h3 className="text-display-h2 font-normal text-cream tracking-tight">
                  Confirm Your Constitution with Nadi Pariksha
                </h3>
                <p className="text-body-base text-cream/80 leading-relaxed">
                  While this digital questionnaire identifies your baseline tendencies (<em>Prakriti</em>),
                  active symptoms and chronic illnesses reflect your current pathology (<em>Vikriti</em>).
                  A 15-minute radial pulse diagnosis by Dr. Lavesh Bohra accurately pinpoints deep-seated
                  toxins across all seven tissue levels.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={`/book?dosha=${encodeURIComponent(dominantProfile.dosha)}`}
                  variant="turmeric"
                  size="lg"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Confirm with Nadi Pariksha
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleShareWhatsApp}
                  className="bg-paper text-deep-forest border-cream/30 hover:bg-cream"
                  icon={<MessageCircle className="w-4 h-4 text-[#25D366]" />}
                >
                  Share via WhatsApp
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handlePrintPDF}
                  className="bg-transparent text-cream border-cream/30 hover:bg-cream/10"
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print Report (PDF)
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleRestart}
                  className="text-cream/80 hover:text-cream hover:bg-cream/10"
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Retake Assessment
                </Button>
              </div>
            </div>

            {/* Clear Medical Disclaimer */}
            <div className="p-4 sm:p-5 bg-cream/60 border border-forest/15 rounded-[4px] text-xs text-ink/75 leading-relaxed font-mono space-y-1">
              <div className="font-semibold text-deep-forest uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                Educational Notice & Clinical Disclaimer:
              </div>
              <p>
                This interactive tool is intended solely for educational self-discovery based on classical
                Ayurvedic taxonomy (Charaka and Sushruta Samhitas). It does not constitute medical diagnosis,
                treatment prescription, or physician consultation. Patients experiencing acute health symptoms
                should seek clinical evaluation from a registered AYUSH medical practitioner.
              </p>
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
}

