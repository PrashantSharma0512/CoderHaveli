'use client';

import React, { useState } from 'react';
import { RenderMathText, Katex } from '@/components/utils/KatexRenderer';
import CodeDisplay from '@/components/utils/CodeDisplay';
import { getEditorialForProblem, ProblemEditorial, EditorialApproach } from '@/lib/editorials';
import { 
  HiOutlineLightBulb, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineCpuChip, 
  HiOutlineInformationCircle,
  HiOutlineTableCells
} from 'react-icons/hi2';
import { MdOndemandVideo } from 'react-icons/md';

interface ProblemEditorialTabProps {
  problem: any;
  sortedEditorial?: any[];
  renderMathJax?: (content: string) => React.ReactNode;
  renderInlineMathJax?: (content: string) => React.ReactNode;
}

export default function ProblemEditorialTab({
  problem,
  sortedEditorial = [],
  renderMathJax,
  renderInlineMathJax,
}: ProblemEditorialTabProps) {
  const editorial: ProblemEditorial = getEditorialForProblem(problem, sortedEditorial);
  const approaches = editorial?.approaches || [];
  const [selectedApproachIndex, setSelectedApproachIndex] = useState<number>(0);

  const activeApproach: EditorialApproach | undefined = approaches[selectedApproachIndex] || approaches[0];

  const formatMath = (mathStr?: string) => {
    if (!mathStr) return null;
    if (renderInlineMathJax) {
      return renderInlineMathJax(mathStr);
    }
    const cleaned = mathStr.replace(/^(\$|\\\()/, '').replace(/(\$|\\\))$/, '');
    return <Katex math={cleaned} block={false} />;
  };

  const formatText = (textStr?: string) => {
    if (!textStr) return null;
    if (renderMathJax) {
      return renderMathJax(textStr);
    }
    return <RenderMathText content={textStr} />;
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      {/* Top Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HiOutlineLightBulb size={22} />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Editorial Solution
            </h2>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
            {approaches.length} {approaches.length === 1 ? 'Approach' : 'Approaches'} Available
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          In-depth algorithmic analysis, step-by-step intuition, complexity proofs, and complete multi-language implementations.
        </p>
      </div>

      {/* Video Solution (if available) */}
      {editorial.videoUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <MdOndemandVideo className="text-red-500" size={18} />
            <span>Video Walkthrough</span>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
            <iframe
              className="w-full h-full"
              src={editorial.videoUrl}
              title="Editorial Video Walkthrough"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}

      {/* Problem Overview & Intuition */}
      {editorial.overview && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <HiOutlineInformationCircle size={18} className="text-amber-500" />
            <span>Problem Overview & Invariant</span>
          </div>
          <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {formatText(editorial.overview)}
          </div>
        </div>
      )}

      {/* Approach Selector Tabs */}
      {approaches.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Select Approach
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {approaches.map((app, index) => {
              const isSelected = selectedApproachIndex === index;
              const isOptimal = app.approachType === 'Optimised';
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedApproachIndex(index)}
                  className={`p-3.5 text-left rounded-xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/80 text-amber-950 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/50'
                      : 'bg-white dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Approach {index + 1}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isOptimal
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {app.approachType}
                    </span>
                  </div>
                  <div className="text-sm font-semibold truncate">{app.approachName}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>Time: {formatMath(app.time_complexity)}</span>
                    <span>Space: {formatMath(app.space_complexity)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Approach Detailed Breakdown */}
      {activeApproach && (
        <div className="space-y-5 p-4 md:p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Approach Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Approach {selectedApproachIndex + 1}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                {activeApproach.approachName}
              </h3>
            </div>
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
              {activeApproach.approachType}
            </span>
          </div>

          {/* Description */}
          {activeApproach.approachDesc && (
            <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {formatText(activeApproach.approachDesc)}
            </div>
          )}

          {/* Detailed Intuition (if present) */}
          {activeApproach.intuition && (
            <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/30 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Key Intuition & Logic
              </div>
              <div className="text-xs md:text-sm text-amber-950 dark:text-amber-200/90 leading-relaxed">
                {formatText(activeApproach.intuition)}
              </div>
            </div>
          )}

          {/* Algorithm Steps */}
          {activeApproach.algorithm && activeApproach.algorithm.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Algorithm Steps
              </div>
              <div className="space-y-1.5">
                {activeApproach.algorithm.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-xs">
                      {sIdx + 1}
                    </span>
                    <span className="pt-0.5">{formatText(step)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Language Code Implementation */}
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Implementation (All Languages)
            </div>
            <CodeDisplay code={activeApproach.code} language={activeApproach.language || 'python'} />
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1.5 text-gray-800 dark:text-gray-200">
                <HiOutlineClock className="text-amber-500" size={17} />
                <span className="text-xs font-bold uppercase tracking-wider">Time Complexity</span>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                {formatMath(activeApproach.time_complexity)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">
                {activeApproach.time_complexity_desc || 'Operations scale proportionally with the input size.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1.5 text-gray-800 dark:text-gray-200">
                <HiOutlineCpuChip className="text-amber-500" size={17} />
                <span className="text-xs font-bold uppercase tracking-wider">Space Complexity</span>
              </div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                {formatMath(activeApproach.space_complexity)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">
                {activeApproach.space_complexity_desc || 'Auxiliary memory allocated during execution.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complexity Comparison Table */}
      {editorial.comparison && editorial.comparison.length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <HiOutlineTableCells size={18} className="text-amber-500" />
            <span>Complexity Comparison Matrix</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold uppercase">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-lg">Approach</th>
                  <th className="px-3.5 py-2.5">Time</th>
                  <th className="px-3.5 py-2.5">Space</th>
                  <th className="px-3.5 py-2.5 rounded-r-lg">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {editorial.comparison.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-3.5 py-2.5 font-medium text-gray-900 dark:text-gray-100">{row.name}</td>
                    <td className="px-3.5 py-2.5">{formatMath(row.time)}</td>
                    <td className="px-3.5 py-2.5">{formatMath(row.space)}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        row.verdict.toLowerCase().includes('optimal') || row.verdict.toLowerCase().includes('accepted')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}>
                        {row.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Insights & Edge Cases */}
      {editorial.keyInsights && editorial.keyInsights.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Key Insights & Patterns
          </div>
          <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 dark:text-gray-300">
            {editorial.keyInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <HiOutlineCheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                <span>{formatText(insight)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
