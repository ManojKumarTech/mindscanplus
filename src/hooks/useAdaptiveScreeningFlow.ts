import { useState } from 'react';
import { adaptiveThemes } from '../data/adaptiveQuestions';

type ScreeningPhase = 'BASE_QUESTIONS' | 'FOLLOW_UP' | 'RESULTS';

export function useAdaptiveScreeningFlow() {
  const [phase, setPhase] = useState<ScreeningPhase>('BASE_QUESTIONS');
  
  // Phase 1: Base questions answers (themeId -> 1-5 score)
  const [baseResponses, setBaseResponses] = useState<Record<string, number>>({});
  
  // Phase 2: Active theme and follow-up answers (questionIndex -> 1-5 score)
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [followUpResponses, setFollowUpResponses] = useState<Record<number, number>>({});

  // Get current active theme data
  const activeTheme = activeThemeId ? adaptiveThemes.find(t => t.id === activeThemeId) : null;
  const activeSeverity = activeThemeId ? baseResponses[activeThemeId] : null;
  const activeFollowUps = activeTheme && activeSeverity ? activeTheme.levels[activeSeverity].questions : [];

  // Progression logic
  const handleBaseResponse = (themeId: string, value: number) => {
    setBaseResponses(prev => ({ ...prev, [themeId]: value }));
  };

  const getBaseResponse = (themeId: string) => baseResponses[themeId] || null;

  const allBaseAnswered = adaptiveThemes.every(t => baseResponses[t.id]);

  const startFollowUps = () => {
    if (allBaseAnswered) {
      // Start with the first theme that scored highest, or just the first theme
      // For MVP, we'll just dive into the highest scoring theme to keep it short, 
      // or we can iterate through all. Let's just do the highest scored theme for immediate deep dive.
      const highestTheme = Object.entries(baseResponses).reduce((a, b) => a[1] > b[1] ? a : b);
      setActiveThemeId(highestTheme[0]);
      setPhase('FOLLOW_UP');
    }
  };

  const handleFollowUpResponse = (questionIndex: number, value: number) => {
    setFollowUpResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const getFollowUpResponse = (questionIndex: number) => followUpResponses[questionIndex] || null;

  const allFollowUpsAnswered = activeFollowUps.length > 0 && 
    activeFollowUps.every((_, idx) => followUpResponses[idx]);

  const finishScreening = () => {
    setPhase('RESULTS');
  };

  const reset = () => {
    setPhase('BASE_QUESTIONS');
    setBaseResponses({});
    setFollowUpResponses({});
    setActiveThemeId(null);
  };

  // Math for the final adaptive score
  const calculateResult = () => {
    if (!activeThemeId || !activeSeverity) return { score: 0, stage: 'Unknown', bg: 'bg-gray-50', color: 'text-gray-500' };

    // The severity bracket sets the baseline (e.g., Level 1 caps low, Level 5 caps high)
    // Level 1: 0-20%, Level 2: 20-40%, Level 3: 40-60%, Level 4: 60-80%, Level 5: 80-100%
    
    // Calculate raw average of the 15 follow-up questions (each answered 1-5)
    const rawScores = Object.values(followUpResponses);
    const avgFollowUpScore = rawScores.length > 0 ? rawScores.reduce((a, b) => a + b, 0) / rawScores.length : 1; // 1 to 5

    // Map the 1-5 average into the designated 20% bracket defined by the Base Severity (1-5)
    // Base 1 -> bracket: 0 to 20
    // Base 2 -> bracket: 20 to 40
    // Base 5 -> bracket: 80 to 100
    
    const bracketMin = (activeSeverity - 1) * 20;
    
    // Normalize follow-up average (1-5) to a 0-20 scale addition
    // (avg - 1) / 4 gives a 0 to 1 ratio. Multiply by 20.
    const normalizedAddition = ((avgFollowUpScore - 1) / 4) * 20; 

    const finalScore100 = bracketMin + normalizedAddition; // 0 to 100 scale
    const finalScore5 = (finalScore100 / 100) * 5; // Back to 0-5 scale for DB consistency

    let stage = 'Low Stress';
    let bg = 'bg-mint-50';
    let color = 'text-mint-600';

    if (finalScore100 > 60) {
      stage = 'High Stress';
      bg = 'bg-red-50';
      color = 'text-red-600';
    } else if (finalScore100 > 30) {
      stage = 'Moderate Stress';
      bg = 'bg-amber-50';
      color = 'text-amber-600';
    }

    return {
      score: finalScore5,
      score100: finalScore100,
      stage,
      bg,
      color,
      themeId: activeThemeId,
      themeName: activeTheme?.title || 'General',
      severityLevel: activeSeverity
    };
  };

  return {
    phase,
    themes: adaptiveThemes,
    baseResponses,
    handleBaseResponse,
    getBaseResponse,
    allBaseAnswered,
    startFollowUps,
    
    activeTheme,
    activeSeverity,
    activeFollowUps,
    followUpResponses,
    handleFollowUpResponse,
    getFollowUpResponse,
    allFollowUpsAnswered,
    
    finishScreening,
    calculateResult,
    reset
  };
}
