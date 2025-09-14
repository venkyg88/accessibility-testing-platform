import React from 'react';
import { A11yScore, getScoreColor } from '@a11y-scanner/shared';

interface ScoreCardProps {
  score: A11yScore;
  title?: string;
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  title = 'Accessibility Score',
  className = ''
}) => {
  const scoreColor = getScoreColor(score.overall);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: scoreColor }}
        >
          {score.overall}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{score.totalIssues}</div>
          <div className="text-sm text-gray-600">Total Issues</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{score.criticalIssues}</div>
          <div className="text-sm text-gray-600">Critical</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Perceivable</span>
          <span className="text-sm font-medium">{score.perceivable}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Operable</span>
          <span className="text-sm font-medium">{score.operable}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Understandable</span>
          <span className="text-sm font-medium">{score.understandable}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Robust</span>
          <span className="text-sm font-medium">{score.robust}</span>
        </div>
      </div>
    </div>
  );
};