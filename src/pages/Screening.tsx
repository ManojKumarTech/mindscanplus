import { CheckCircle, ChevronRight, Brain, Activity } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveScreeningResult } from '../services/screeningService';
import { useAdaptiveScreeningFlow } from '../hooks/useAdaptiveScreeningFlow';
import { Button } from '../components/ui/Button';

export default function Screening() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const {
    phase,
    themes,
    handleBaseResponse,
    getBaseResponse,
    allBaseAnswered,
    startFollowUps,
    
    activeTheme,
    activeFollowUps,
    handleFollowUpResponse,
    getFollowUpResponse,
    allFollowUpsAnswered,
    
    finishScreening,
    calculateResult,
    reset
  } = useAdaptiveScreeningFlow();

  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async () => {
    finishScreening();
    if (!user) return;
    
    const result = calculateResult();
    setIsSaving(true);
    
    try {
      await saveScreeningResult(
        user.uid,
        result.score,
        result.stage as 'Low' | 'Moderate' | 'High',
        result.themeId || 'general',
        result.themeName || 'General',
        result.severityLevel || 1,
        result.score100 || 0
      );
      showToast('Screening result saved dynamically based on your severity.', 'success');
    } catch (e) {
      console.error('Failed to save adaptive screening result', e);
      showToast('Failed to save result. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {phase === 'BASE_QUESTIONS' && (
          <div className="animate-fadeIn">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Core Mental Check-In</h1>
              <p className="text-gray-600">Answer a few core questions to help us personalize your screening today.</p>
            </div>

            <div className="space-y-8 mb-8">
              {themes.map((theme, idx) => (
                 <div key={theme.id} className="bg-white rounded-2xl p-8 shadow-soft animate-slideUp" style={{ animationDelay: `${idx * 100}ms` }}>
                   <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-mint-100 rounded-lg text-mint-600">
                         {idx === 0 ? <Brain size={24} /> : <Activity size={24} />}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{theme.title}</h2>
                   </div>
                   <p className="text-gray-600 mb-6 font-medium">"{theme.baseQuestion}"</p>
                   
                   <div className="flex gap-2 justify-between">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleBaseResponse(theme.id, value)}
                          className={`flex-1 py-3 px-2 rounded-lg font-medium transition-all duration-200 ${getBaseResponse(theme.id) === value
                              ? 'bg-gradient-to-r from-mint-500 to-sky-500 text-white shadow-soft scale-[1.02]'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                      <span>Not at all</span>
                      <span>Extremely</span>
                    </div>
                 </div>
              ))}
            </div>

            <button
              onClick={startFollowUps}
              disabled={!allBaseAnswered}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold text-lg hover:shadow-softLg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue Screening <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {phase === 'FOLLOW_UP' && activeTheme && (
           <div className="animate-fadeIn">
             <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Deep Dive: {activeTheme.title}</h1>
              <p className="text-gray-600">Based on your answer, we've tailored these questions specifically for you.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft mb-8 animate-slideUp">
               <div className="space-y-8">
                {activeFollowUps.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-4 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-900 text-lg leading-relaxed">{qIdx + 1}. {question}</p>
                    <div className="flex gap-2 justify-between">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleFollowUpResponse(qIdx, value)}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${getFollowUpResponse(qIdx) === value
                              ? 'bg-gradient-to-r from-mint-500 to-sky-500 text-white shadow-soft scale-[1.02]'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={!allFollowUpsAnswered || isSaving}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold text-lg hover:shadow-softLg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? 'Analyzing...' : 'See Final Results'}
            </button>
           </div>
        )}

        {phase === 'RESULTS' && (
          <div className="animate-fadeIn">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Adaptive Results</h1>
              <p className="text-gray-600">Personalized insights based on the {(calculateResult().themeName || 'general').toLowerCase()} symptoms you highlighted.</p>
            </div>

            <div className="space-y-6 animate-slideUp">
              <div className={`rounded-2xl p-8 ${calculateResult().bg} border-2 border-gray-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className={`w-8 h-8 ${calculateResult().color}`} />
                  <h2 className="text-2xl font-bold">Primary Focus: {calculateResult().themeName || 'General'}</h2>
                </div>
                
                <p className={`text-3xl font-bold ${calculateResult().color} mb-4`}>
                  {calculateResult().stage} (Severity Bucket: {calculateResult().severityLevel || 1})
                </p>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {(calculateResult().score100 || 0) < 30
                    ? `Your answers indicate that while you may experience moments of ${(calculateResult().themeName || 'general').toLowerCase()}, it is currently well-managed and not severely impacting your daily life. Keep up with your positive self-care routines.`
                    : (calculateResult().score100 || 0) < 70
                      ? `Your answers show a moderate level of ${(calculateResult().themeName || 'general').toLowerCase()}. It is acting as a noticeable disruption to your comfort. We recommend scheduling specific relaxation breaks to manage this.`
                      : `Your answers indicate a high level of acute ${(calculateResult().themeName || 'general').toLowerCase()}. This is actively impacting your rest and focus. We highly recommend connecting with a professional for targeted support.`}
                </p>
                <Link to="/resources" className={`${calculateResult().color} font-semibold hover:opacity-80 transition-opacity flex items-center gap-1`}>
                  Access tailored resources <ChevronRight size={16}/>
                </Link>
              </div>

               <div className="bg-sky-50 rounded-2xl p-8 border border-sky-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What the Adaptive Engine Found:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3 items-start">
                    <span className="text-sky-600 font-bold mt-1">→</span>
                    <span>Your <b>Base Anchor</b> was marked as a {calculateResult().severityLevel || 1} out of 5 for {calculateResult().themeName || 'General'}.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-sky-600 font-bold mt-1">→</span>
                    <span>Your deeper follow-up responses calculated to an exact weighted intensity of <b>{Math.round(calculateResult().score100 || 0)} / 100</b>.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-sky-600 font-bold mt-1">→</span>
                    <span>This gives us a much more precise look at your specific stress pattern than a generic 1-10 scale.</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  onClick={reset}
                  className="flex-1 min-w-[140px]"
                  variant="secondary"
                >
                  Retake Assessment
                </Button>
                <Link to="/dashboard" className="flex-1 min-w-[140px]">
                  <Button className="w-full" variant="primary">
                    View Progress Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}