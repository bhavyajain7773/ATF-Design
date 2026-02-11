
import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'trade-finance',
    title: 'International Trade Finance',
    shortDescription: 'Master the mechanics of global movement through UCP 600 and Incoterms.',
    level: 'Top',
    outcomes: [
      'Expertise in UCP 600 & ISBP standards',
      'Advanced Documentary Credit management',
      'Incoterms 2020 operational mastery'
    ],
    curriculum: [
      { section: 'Fundamentals', topics: ['Incoterms 2020', 'Sales Contracts', 'Risk Assessment'] },
      { section: 'Letter of Credit', topics: ['Types of LC', 'UCP 600 Articles', 'Document Examination'] },
      { section: 'Bank Guarantees', topics: ['Standby LCs', 'Demand Guarantees', 'URDG 758'] }
    ],
    price: 'Contact for Pricing'
  },
  {
    id: 'intl-banking',
    title: 'Diploma in International Banking & Finance',
    shortDescription: 'The blueprint for institutional banking leadership and global operations.',
    level: 'Middle',
    outcomes: [
      'Comprehensive understanding of Correspondent Banking',
      'Global payment system architecture (SWIFT)',
      'Regulatory compliance and AML frameworks'
    ],
    curriculum: [
      { section: 'Banking Systems', topics: ['Global Regulatory Framework', 'Central Banking Operations'] },
      { section: 'Operations', topics: ['SWIFT Messaging', 'Nostro/Vostro Accounts', 'Remittance'] }
    ],
    price: 'Contact for Pricing'
  },
  {
    id: 'treasury-risk',
    title: 'Diploma in Treasury, Investment & Risk Management',
    shortDescription: 'Navigate the complexities of Basel III, liquidity, and asset-liability management.',
    level: 'Bottom',
    outcomes: [
      'Basel III implementation strategies',
      'Liquidity risk management proficiency',
      'Asset Liability Management (ALM) mastery'
    ],
    curriculum: [
      { section: 'Treasury Operations', topics: ['Front Office vs Back Office', 'Cash Management'] },
      { section: 'Risk Management', topics: ['Market Risk', 'Credit Risk', 'Operational Risk'] }
    ],
    price: 'Contact for Pricing'
  },
  {
    id: 'forex',
    title: 'FOREX Facilities for Individuals',
    shortDescription: 'Managing currency risk and cross-border transactions for the individual.',
    level: 'Middle',
    outcomes: [
      'LRS (Liberalised Remittance Scheme) compliance',
      'Effective currency hedging for individuals',
      'FEMA regulations for cross-border movement'
    ],
    curriculum: [
      { section: 'Forex Basics', topics: ['Currency Pairs', 'Exchange Rate Determination'] },
      { section: 'Individual Facilities', topics: ['LRS Guidelines', 'Travel Forex', 'NR Management'] }
    ],
    price: 'Contact for Pricing'
  },
  {
    id: 'stock-market',
    title: 'Stock Market Trading Course',
    shortDescription: 'Precision Technical and Fundamental analysis for modern traders.',
    level: 'Top',
    outcomes: [
      'Advanced Charting and Technical Indicators',
      'Fundamental Analysis and Value Investing',
      'Risk Management and Portfolio Psychology'
    ],
    curriculum: [
      { section: 'Technical Analysis', topics: ['Candlestick Patterns', 'Trend Analysis', 'Indicators'] },
      { section: 'Fundamental Analysis', topics: ['Balance Sheet Reading', 'Ratio Analysis'] }
    ],
    price: 'Contact for Pricing'
  },
  {
    id: 'research-analyst',
    title: 'Research Analyst Preparation',
    shortDescription: 'SEBI-aligned professional preparation for the elite financial analyst.',
    level: 'Bottom',
    outcomes: [
      'SEBI Research Analyst Certification readiness',
      'Professional report writing and forecasting',
      'Ethics and Regulatory guidelines mastery'
    ],
    curriculum: [
      { section: 'Analysis Process', topics: ['Economic Analysis', 'Industry Analysis', 'Company Valuation'] },
      { section: 'Compliance', topics: ['SEBI Regulations', 'Ethics in Research'] }
    ],
    price: 'Contact for Pricing'
  }
];

export const APPLY_URL = "https://wa.me/918209850312";
