export interface ApproachCode {
  javascript: string;
  python: string;
  java: string;
  cpp: string;
  [key: string]: string;
}

export interface EditorialApproach {
  _id?: string;
  quesId?: string | number;
  approachName: string;
  approachType: 'Brute Force' | 'Improved' | 'Optimised';
  approachDesc: string;
  intuition?: string;
  algorithm?: string[];
  code: ApproachCode | string;
  language?: string;
  time_complexity: string;
  time_complexity_desc?: string;
  space_complexity: string;
  space_complexity_desc?: string;
  videoUrl?: string | null;
  order: number;
}

export interface ProblemEditorial {
  quesId: string | number;
  title: string;
  overview?: string;
  keyInsights?: string[];
  edgeCases?: string[];
  approaches: EditorialApproach[];
  videoUrl?: string | null;
  comparison?: Array<{
    name: string;
    time: string;
    space: string;
    verdict: string;
  }>;
}

