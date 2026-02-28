import { useMemo, useState } from 'react';

export type StressLevel = 'Low' | 'Moderate' | 'High';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

const assessmentsData: Assessment[] = [
  {
    id: 'stress',
    title: 'Stress Assessment',
    description: 'How much stress have you been experiencing?',
    questions: [
      'I feel overwhelmed by my responsibilities',
      'I have difficulty relaxing or unwinding',
      'I experience physical tension or headaches',
      'I struggle to focus on tasks',
      'I feel restless or anxious',
    ],
  },
  {
    id: 'anxiety',
    title: 'Anxiety Assessment',
    description: 'How anxious have you been feeling?',
    questions: [
      'I worry excessively about things',
      'I experience panic or fear without clear reason',
      'I avoid situations due to anxiety',
      'I have trouble sleeping due to worry',
      'I experience physical anxiety symptoms',
    ],
  },
  {
    id: 'wellbeing',
    title: 'Emotional Wellbeing Assessment',
    description: 'How is your overall emotional wellbeing?',
    questions: [
      'I feel hopeful about the future',
      'I enjoy activities that used to make me happy',
      'I feel connected to others',
      'I have a sense of purpose',
      'I feel satisfied with my life',
    ],
  },
];

export function useScreeningFlow() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentAssessment = assessmentsData[step];

  const handleResponse = (assessmentIdx: number, questionIdx: number, value: number) => {
    const key = `${assessmentsData[assessmentIdx].id}_q${questionIdx}`;
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const getResponseValue = (assessmentIdx: number, questionIdx: number) => {
    const key = `${assessmentsData[assessmentIdx].id}_q${questionIdx}`;
    return responses[key] || 0;
  };

  const allAnswered = useMemo(() => {
    const questions = currentAssessment.questions;
    for (let i = 0; i < questions.length; i++) {
      if (!getResponseValue(step, i)) return false;
    }
    return true;
  }, [responses, step]);

  const next = () => setStep(s => Math.min(s + 1, assessmentsData.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setResponses({});
  };

  const calculateStressStage = () => {
    const stressResponses = Object.entries(responses)
      .filter(([key]) => key.startsWith('stress'))
      .map(([, value]) => value as number);
    const avg =
      stressResponses.length > 0
        ? stressResponses.reduce((a, b) => a + b, 0) / stressResponses.length
        : 0;

    if (avg <= 2) return { stage: 'Low Stress', color: 'text-mint-600', bg: 'bg-mint-50', score: avg };
    if (avg <= 3.5) return { stage: 'Moderate Stress', color: 'text-amber-600', bg: 'bg-amber-50', score: avg };
    return { stage: 'High Stress', color: 'text-rose-600', bg: 'bg-rose-50', score: avg };
  };

  return {
    step,
    responses,
    currentAssessment,
    handleResponse,
    getResponseValue,
    allAnswered,
    next,
    back,
    reset,
    calculateStressStage,
    assessments: assessmentsData,
  };
}
