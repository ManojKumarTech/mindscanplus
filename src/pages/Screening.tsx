import { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

export default function Screening() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const assessments = [
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

  const handleResponse = (assessmentIdx: number, questionIdx: number, value: number) => {
    const key = `${assessments[assessmentIdx].id}_q${questionIdx}`;
    setResponses({ ...responses, [key]: value });
  };

  const getResponseValue = (assessmentIdx: number, questionIdx: number) => {
    const key = `${assessments[assessmentIdx].id}_q${questionIdx}`;
    return responses[key] || 0;
  };

  const allAnswered = () => {
    const currentAssessment = assessments[step];
    for (let i = 0; i < currentAssessment.questions.length; i++) {
      if (!getResponseValue(step, i)) return false;
    }
    return true;
  };

  const calculateStressStage = () => {
    const stressResponses = Object.entries(responses)
      .filter(([key]) => key.startsWith('stress'))
      .map(([, value]) => value as number);
    const avg = stressResponses.reduce((a, b) => a + b, 0) / stressResponses.length;

    if (avg <= 2) return { stage: 'Low Stress', color: 'text-mint-600', bg: 'bg-mint-50' };
    if (avg <= 3.5) return { stage: 'Moderate Stress', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { stage: 'High Stress', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!showResults ? (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mental Wellbeing Screening</h1>
              <p className="text-gray-600">Take your time. There are no right or wrong answers.</p>
            </div>

            <div className="flex gap-2 mb-8">
              {assessments.map((_, idx) => (
                <div key={idx} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${idx <= step ? 'bg-gradient-to-r from-mint-500 to-sky-500' : 'bg-gray-200'
                      }`}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2 text-center">Step {idx + 1}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft mb-8 animate-slideUp">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {assessments[step].title}
              </h2>
              <p className="text-gray-600 mb-8">{assessments[step].description}</p>

              <div className="space-y-6">
                {assessments[step].questions.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="font-medium text-gray-900">{qIdx + 1}. {question}</p>
                    <div className="flex gap-2 justify-between">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleResponse(step, qIdx, value)}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${getResponseValue(step, qIdx) === value
                              ? 'bg-gradient-to-r from-mint-500 to-sky-500 text-white shadow-soft'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Not at all</span>
                      <span>Extremely</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              {step < assessments.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!allAnswered()}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={!allAnswered()}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  See Results
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Screening Results</h1>
              <p className="text-gray-600">Here's what we learned about your wellbeing.</p>
            </div>

            <div className="space-y-6 animate-slideUp">
              <div className={`rounded-2xl p-8 ${calculateStressStage().bg} border-2 border-gray-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className={`w-8 h-8 ${calculateStressStage().color}`} />
                  <h2 className="text-2xl font-bold">Current Stress Level</h2>
                </div>
                <p className={`text-3xl font-bold ${calculateStressStage().color} mb-4`}>
                  {calculateStressStage().stage}
                </p>
                <p className="text-gray-700 mb-4">
                  {calculateStressStage().stage === 'Low Stress'
                    ? "You're managing well! Keep up with your self-care practices."
                    : calculateStressStage().stage === 'Moderate Stress'
                      ? "You're experiencing some stress. Consider incorporating calming activities into your routine."
                      : "You're experiencing significant stress. Please reach out for support and take care of yourself."}
                </p>
                <button className="text-mint-600 font-semibold hover:text-mint-700 transition-colors">
                  Learn more about stress management →
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {assessments.map((assessment) => {
                  const scores = Object.entries(responses)
                    .filter(([key]) => key.startsWith(assessment.id))
                    .map(([, value]) => value as number);
                  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

                  return (
                    <div key={assessment.id} className="bg-white rounded-2xl p-6 shadow-soft">
                      <h3 className="font-semibold text-gray-900 mb-4">{assessment.title}</h3>
                      <div className="mb-4">
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all duration-300"
                            style={{ width: `${(avg / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Score: {avg.toFixed(1)} / 5.0
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-sky-50 rounded-2xl p-8 border border-sky-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-bold">→</span>
                    <span>Explore our Emotional Care tools for immediate support</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-bold">→</span>
                    <span>Build your Self-Care Plan for long-term wellbeing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-bold">→</span>
                    <span>Connect with our Community for support and understanding</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-600 font-bold">→</span>
                    <span>View your Dashboard to track progress over time</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Retake Assessment
                </button>
                <a href='/emotional-care'>
                  <button className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all">
                    Explore Emotional Care
                  </button>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}