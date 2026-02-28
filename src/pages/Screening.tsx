import { CheckCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveScreeningResult } from '../services/screeningService';
import { useScreeningFlow } from '../hooks/useScreeningFlow';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Screening() {
  const { user } = useAuth();
  const {
    step,
    currentAssessment,
    responses,
    handleResponse,
    getResponseValue,
    allAnswered,
    next,
    back,
    reset,
    calculateStressStage,
    assessments,
  } = useScreeningFlow();

  const [showResults, setShowResults] = useState(false);

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
                {currentAssessment.title}
              </h2>
              <p className="text-gray-600 mb-8">{currentAssessment.description}</p>

              <div className="space-y-6">
                {currentAssessment.questions.map((question, qIdx) => (
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
                  onClick={back}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              {step < assessments.length - 1 ? (
                <button
                  onClick={next}
                  disabled={!allAnswered}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const { score } = calculateStressStage();
                    let stressLevel: 'Low' | 'Moderate' | 'High' = 'Low';
                    if (score > 3.5) stressLevel = 'High';
                    else if (score > 2) stressLevel = 'Moderate';

                    if (user) {
                      try {
                        await saveScreeningResult(user.uid, Math.round(score * 10) / 10, stressLevel);
                      } catch (e) {
                        console.error('Failed to save screening result', e);
                      }
                    }
                    setShowResults(true);
                  }}
                  disabled={!allAnswered}
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
                <a href="/resources" className="text-mint-600 font-semibold hover:text-mint-700 transition-colors">
                  Learn more about stress management →
                </a>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {assessments.map((assessment) => {
                  const scores = Object.entries(responses)
                    .filter(([key]) => key.startsWith(assessment.id))
                    .map(([, value]) => value as number);
                  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

                  return (
                    <Card key={assessment.id} className="p-6">
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
                    </Card>
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
                <Button
                  onClick={() => {
                    setShowResults(false);
                    reset();
                  }}
                  className="flex-1"
                  variant="secondary"
                >
                  Retake Assessment
                </Button>
                <a href='/emotional-care'>
                  <Button className="flex-1" variant="primary">
                    Explore Emotional Care
                  </Button>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}