import React from 'react';
import { Issue, getSeverityColor } from '@a11y-scanner/shared';

interface IssueCardProps {
  issue: Issue;
  onSelect?: (issue: Issue) => void;
  className?: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onSelect,
  className = ''
}) => {
  const severityColor = getSeverityColor(issue.severity);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onSelect?.(issue)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-md font-semibold text-gray-800 flex-1">{issue.title}</h4>
        <span 
          className="px-2 py-1 text-xs font-medium text-white rounded-full ml-2"
          style={{ backgroundColor: severityColor }}
        >
          {issue.severity.toUpperCase()}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-1 rounded">
          {issue.category.replace('_', ' ').toUpperCase()}
        </span>
        <span>WCAG {issue.wcagLevel}</span>
      </div>
      
      {issue.element.text && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <span className="font-medium">Element: </span>
          <span className="text-gray-600">{issue.element.text}</span>
        </div>
      )}
    </div>
  );
};