import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import {
  Zap,
  BarChart2,
  Lock,
  Briefcase,
  Users,
  Award,
  Target,
  ArrowRight,
  CheckCircle,
  PieChart as PieChartIcon,
  Shield,
  UserPlus
} from 'lucide-react';

interface PieChartProps {
  cx: number | string;
  cy: number | string;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    name: string;
    value: number;
  };
  percent: number;
  value: number;
}

interface ChartEvent {
  name: string;
  value: number;
  payload: {
    name: string;
    value: number;
  };
}

const App = () => {
  const [activeTab, setActiveTab] = useState('gameMode');
  const [animateCustomers, setAnimateCustomers] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [equityPercentage, setEquityPercentage] = useState(10);
  const [agentsPerCustomer] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Calculate valuations
  const agentMonthlyValue = 357;
  
  // Calculate company valuation based on investment terms and customer growth
  const calculateCompanyValuation = useCallback((investment: number, equityPct: number, customers: number) => {
    if (equityPct === 0) return 0;
    // Base valuation from investment terms
    const investmentBasedValue = (investment / (equityPct / 100));
    
    // Growth premium based on customer metrics
    const monthlyRevenuePerCustomer = agentMonthlyValue * agentsPerCustomer;
    const annualRevenuePerCustomer = monthlyRevenuePerCustomer * 12;
    const totalAnnualRevenue = annualRevenuePerCustomer * customers;
    
    // Growth premium formula:
    // 1. Base multiple of 5x for SaaS companies
    // 2. Additional multiple based on customer count (0.5x for every 100 customers)
    // 3. Cap the additional multiple at 5x
    const baseMultiple = 5;
    const additionalMultiple = Math.min(5, (customers / 100) * 0.5);
    const totalMultiple = baseMultiple + additionalMultiple;
    
    const growthPremium = totalAnnualRevenue * totalMultiple;
    
    return investmentBasedValue + growthPremium;
  }, [agentMonthlyValue, agentsPerCustomer]);

  // Current valuation based on investment terms and customer growth
  const currentValuation = calculateCompanyValuation(investmentAmount, equityPercentage, customerCount);

  // Calculate revenue metrics
  const calculateRevenueMetrics = useCallback((customers: number, agentsPerCust: number) => {
    const monthlyRevenue = customers * agentsPerCust * agentMonthlyValue;
    const annualRevenue = monthlyRevenue * 12;
    const revenueMultiple = currentValuation / (annualRevenue || 1);
    return {
      monthly: monthlyRevenue,
      annual: annualRevenue,
      multiple: revenueMultiple,
      perCustomer: monthlyRevenue / (customers || 1)
    };
  }, [currentValuation, agentMonthlyValue]);

  const revenueMetrics = calculateRevenueMetrics(customerCount, agentsPerCustomer);

  // Calculate equity distributions
  const calculateEquityDistribution = useCallback((step: number, investorPct: number) => {
    // Initial distribution
    let domenico = 90;
    let michael = 10;
    let investor = 0;
    
    // Apply Michael's KPI-based gains
    if (step >= 1) michael += 5; // First 150 customers
    if (step >= 2) michael += 5; // 400 customers
    if (step >= 3) michael += 5; // 700 customers
    if (step >= 4) michael += 5; // 1000 customers
    
    // Adjust Domenico's share accordingly
    domenico = 100 - michael - investor;
    
    // Apply investor share if applicable
    if (investorPct > 0) {
      // Take from Domenico's share as per agreement
      domenico -= investorPct;
      investor = investorPct;
      
      // Ensure no negative values
      if (domenico < 0) domenico = 0;
    }
    
    return [
      { name: 'Domenico', value: domenico },
      { name: 'Michael', value: michael },
      { name: 'Investors', value: investor }
    ];
  }, []);
  
  useEffect(() => {
    // Animate customer count on initial load
    setAnimateCustomers(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCustomerCount(prev => {
          const target = currentStep === 0 ? 0 : 
                        currentStep === 1 ? 150 : 
                        currentStep === 2 ? 400 : 
                        currentStep === 3 ? 700 : 1000;
          
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
          return prev + Math.min(20, target - prev);
        });
      }, 20);
      
      return () => clearInterval(interval);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Customer data for different stages
  const customerStages = [
    { stage: 'Initial', customers: 0 },
    { stage: 'Tranche 1', customers: 150 },
    { stage: 'Tranche 2', customers: 400 },
    { stage: 'Tranche 3', customers: 700 },
    { stage: 'Target', customers: 1000 }
  ];
  
  // Current equity distribution based on step and investor percentage
  const currentEquityDistribution = calculateEquityDistribution(currentStep, 
    currentStep === 4 ? equityPercentage : 0);
  
  // Protection Balance Data
  const protectionData = [
    { subject: 'Board Control', companyScore: 7, founderScore: 8 },
    { subject: 'Share Transfer', companyScore: 8, founderScore: 6 },
    { subject: 'Reserved Matters', companyScore: 6, founderScore: 8 },
    { subject: 'IP Rights', companyScore: 9, founderScore: 7 },
    { subject: 'Non-Compete', companyScore: 8, founderScore: 6 },
    { subject: 'Exit Rights', companyScore: 7, founderScore: 8 }
  ];
  
  // Investor Pool Data
  const investorPoolData = [
    { stage: 'Pre-Investment', shares: 1000000, allocation: 'Reserved' },
    { stage: 'Seed Round', shares: 500000, allocation: 'Available' },
    { stage: 'Series A', shares: 500000, allocation: 'Available' }
  ];
  
  // Custom PieChart active sector animation
  const renderActiveShape = (props: PieChartProps) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * startAngle);
    const cos = Math.cos(-RADIAN * startAngle);
    const mx = Number(cx) + (outerRadius + 10) * cos;
    const my = Number(cy) + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={Number(cx)} y={Number(cy)} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={Number(cx)}
          cy={Number(cy)}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={Number(cx)}
          cy={Number(cy)}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#999"
        >{`${value}%`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = useCallback((event: ChartEvent, index: number) => {
    setActiveIndex(index);
  }, []);
  
  const COLORS = ['#FF9800', '#2196F3', '#4CAF50', '#F44336'];
  
  // KPI milestones and descriptions
  const kpiMilestones = [
    {
      title: "Starting Point",
      customers: 0,
      shares: {
        domenico: 9000000,
        michael: 1000000,
        investors: 0
      },
      description: "Initial share distribution with Domenico holding 90% and Michael holding 10% of the company."
    },
    {
      title: "KPI 1: First 150 Customers",
      customers: 150,
      shares: {
        domenico: 8500000,
        michael: 1500000,
        investors: 0
      },
      description: "Michael has achieved his first KPI target by acquiring 150 customers, earning the first tranche of 500,000 shares from Domenico."
    },
    {
      title: "KPI 2: 400 Customers Total",
      customers: 400,
      shares: {
        domenico: 8000000,
        michael: 2000000,
        investors: 0
      },
      description: "With 400 total customers, Michael has reached his second KPI target, receiving another tranche of 500,000 shares."
    },
    {
      title: "KPI 3: 700 Customers Total",
      customers: 700,
      shares: {
        domenico: 7500000,
        michael: 2500000,
        investors: 0
      },
      description: "The third KPI has been achieved with 700 customers, earning Michael his third tranche of 500,000 shares."
    },
    {
      title: "KPI 4: 1000 Customers Complete",
      customers: 1000,
      shares: {
        domenico: 7000000,
        michael: 3000000,
        investors: 0
      },
      description: "Final KPI target reached with 1000 customers. Michael has earned all 4 tranches, totaling 2,000,000 additional shares."
    }
  ];
  
  // Leaver Events Data
  const leaverEventsData = [
    { event: 'Good Leaver', shareRetention: 100, compensation: 'Full Market Value' },
    { event: 'Bad Leaver', shareRetention: 20, compensation: 'Nominal Value' },
    { event: 'Intermediate', shareRetention: 60, compensation: 'Fair Value' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Glowing hero section */}
      <div className="relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-70"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              The Augmented 4 Pty Ltd
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-300 sm:text-xl md:mt-5 md:max-w-3xl">
              Shareholder Agreement Visualization - Effective Date: 30 May 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto py-2 mb-6 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('gameMode')}
            className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'gameMode' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              <span>Interactive Game Mode</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('valuation')}
            className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'valuation' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span>Valuation Calculator</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('protection')}
            className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'protection' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              <span>Protection Balance</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('investor')}
            className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'investor' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <div className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              <span>Investor Pool Analysis</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('leaver')}
            className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'leaver' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>Leaver Events</span>
            </div>
          </button>
        </div>
        
        {/* Active Tab Content */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          {activeTab === 'gameMode' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-300 flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                  KPI Achievement Game Mode
                </h2>
              </div>
              
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <div className="text-2xl font-bold flex items-center mb-2">
                      <Users className="h-6 w-6 mr-2 text-blue-400" />
                      <span className={`${animateCustomers ? 'text-green-400' : 'text-white'}`}>
                        {customerCount.toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">/ 1,000 Customers</span>
                    </div>
                    <div className="bg-gray-700 h-2 rounded-full w-full max-w-md">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(customerCount / 1000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold flex items-center mb-2">
                      <Award className="h-6 w-6 mr-2 text-yellow-400" />
                      <span className="text-white">
                        {(currentStep === 0 ? 0 : 500000 * currentStep).toLocaleString()}
                      </span>
                      <span className="text-gray-400 ml-2">/ 2,000,000 Shares</span>
                    </div>
                    <div className="bg-gray-700 h-2 rounded-full w-full max-w-md">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep * 25)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step Navigation */}
              <div className="mb-8 bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-blue-300">KPI Journey Simulator</h3>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {customerStages.map((stage, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentStep === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      } transition-all duration-200`}
                    >
                      <span className="font-medium mr-2">{stage.stage}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-700">{stage.customers}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Main Game UI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Company Visualization */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">Current Share Distribution</h3>
                  
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={currentEquityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                        >
                          {currentEquityDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              stroke={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm text-gray-400">Domenico</p>
                      <p className="text-lg font-bold text-orange-500">
                        {currentEquityDistribution[0].value}%
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm text-gray-400">Michael</p>
                      <p className="text-lg font-bold text-blue-500">
                        {currentEquityDistribution[1].value}%
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 text-center">
                      <p className="text-sm text-gray-400">Investors</p>
                      <p className="text-lg font-bold text-green-500">
                        {currentEquityDistribution[2].value}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Current Milestone Description */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 mr-2 text-green-400" />
                    <h3 className="text-xl font-semibold text-blue-300">{kpiMilestones[currentStep].title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{kpiMilestones[currentStep].description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-300 mb-2">Share Transfer</h4>
                      <div className="flex items-center">
                        <ArrowRight className="h-5 w-5 mx-2 text-yellow-500" />
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Michael Gains</p>
                          <p className="text-lg font-bold text-green-400">
                            {currentStep === 0 ? 0 : `+${(500000 * currentStep).toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-300 mb-2">Valuation Impact</h4>
                      <p className="text-sm text-gray-400">Company Value</p>
                      <p className="text-lg font-bold text-green-400">
                        ${(currentValuation).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Milestone specific data */}
                  <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">KPI Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <div className={`h-5 w-5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
                          currentStep >= 1 ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {currentStep >= 1 ? (
                            <CheckCircle className="h-3 w-3 text-white" />
                          ) : <span className="text-xs text-white">1</span>}
                        </div>
                        <span>First 150 Customers</span>
                      </li>
                      <li className="flex items-start">
                        <div className={`h-5 w-5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
                          currentStep >= 2 ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {currentStep >= 2 ? (
                            <CheckCircle className="h-3 w-3 text-white" />
                          ) : <span className="text-xs text-white">2</span>}
                        </div>
                        <span>Reach 400 Total Customers</span>
                      </li>
                      <li className="flex items-start">
                        <div className={`h-5 w-5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
                          currentStep >= 3 ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {currentStep >= 3 ? (
                            <CheckCircle className="h-3 w-3 text-white" />
                          ) : <span className="text-xs text-white">3</span>}
                        </div>
                        <span>Reach 700 Total Customers</span>
                      </li>
                      <li className="flex items-start">
                        <div className={`h-5 w-5 rounded-full mr-2 flex-shrink-0 flex items-center justify-center ${
                          currentStep >= 4 ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {currentStep >= 4 ? (
                            <CheckCircle className="h-3 w-3 text-white" />
                          ) : <span className="text-xs text-white">4</span>}
                        </div>
                        <span>Reach 1,000 Total Customers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Timeline View */}
              <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-blue-300">Equity Evolution Timeline</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { stage: 'Start', Domenico: 90, Michael: 10, Investors: 0 },
                        { stage: 'Tranche 1', Domenico: 85, Michael: 15, Investors: 0 },
                        { stage: 'Tranche 2', Domenico: 80, Michael: 20, Investors: 0 },
                        { stage: 'Tranche 3', Domenico: 75, Michael: 25, Investors: 0 },
                        { stage: 'Target', Domenico: 70 - (currentStep === 4 ? equityPercentage : 0), 
                                          Michael: 30, 
                                          Investors: (currentStep === 4 ? equityPercentage : 0) }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="stage" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Domenico"
                        stackId="1"
                        stroke="#FF9800"
                        fill="#FF9800"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="Michael"
                        stackId="1"
                        stroke="#2196F3"
                        fill="#2196F3"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="Investors"
                        stackId="1"
                        stroke="#4CAF50"
                        fill="#4CAF50"
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'valuation' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-6 w-6 mr-2 text-green-400" />
                <h3 className="text-xl font-semibold text-blue-300">Interactive Valuation Calculator</h3>
              </div>
              
              {/* Sliders Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Investment Amount Slider */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-blue-300 mb-4">Investment Amount</h4>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="mt-2 text-2xl font-bold text-green-400 transition-all duration-500">
                    ${investmentAmount.toLocaleString()}
                  </div>
                </div>

                {/* Equity Percentage Slider */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-blue-300 mb-4">Equity Offered (%)</h4>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={equityPercentage}
                    onChange={(e) => setEquityPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="mt-2 text-2xl font-bold text-blue-400 transition-all duration-500">
                    {equityPercentage}%
                  </div>
                </div>

                {/* Customer Count Slider */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-blue-300 mb-4">Customers</h4>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={customerCount}
                    onChange={(e) => {
                      setCustomerCount(Number(e.target.value));
                      setAnimateCustomers(true);
                    }}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="mt-2 text-2xl font-bold text-purple-400 transition-all duration-500">
                    {customerCount.toLocaleString()} customers
                  </div>
                </div>
              </div>

              {/* Valuation Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Company Valuation Card */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-blue-300 mb-4">Company Valuation</h4>
                  <div className="text-4xl font-bold text-green-400 mb-4 transition-all duration-500 transform hover:scale-105">
                    ${currentValuation.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    Combined valuation based on investment terms and customer growth
                  </div>
                  
                  {/* Valuation Breakdown */}
                  <div className="mt-4 space-y-2">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-400">Investment-Based Value</div>
                      <div className="text-xl font-bold text-blue-400">
                        ${((investmentAmount / (equityPercentage / 100)) || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-400">Growth Premium</div>
                      <div className="text-xl font-bold text-purple-400">
                        ${(currentValuation - (investmentAmount / (equityPercentage / 100)) || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Based on {customerCount} customers at ${revenueMetrics.perCustomer.toFixed(0)}/customer/month
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Projections */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium text-blue-300 mb-4">Revenue Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Monthly Revenue</div>
                      <div className="text-2xl font-bold text-green-400">
                        ${revenueMetrics.monthly.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Annual Revenue</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        ${revenueMetrics.annual.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Revenue Growth Chart */}
                  <div className="h-64 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { customers: customerCount * 0.5, revenue: revenueMetrics.annual * 0.5 },
                          { customers: customerCount, revenue: revenueMetrics.annual },
                          { customers: customerCount * 1.5, revenue: revenueMetrics.annual * 1.5 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="customers" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Annual Revenue']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Valuation Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400">Revenue Multiple</div>
                  <div className="text-xl font-bold text-blue-400">
                    {revenueMetrics.multiple.toFixed(1)}x
                  </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400">Value Per Customer</div>
                  <div className="text-xl font-bold text-green-400">
                    ${((currentValuation / (customerCount || 1)) || 0).toFixed(0)}
                  </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400">Monthly Per Customer</div>
                  <div className="text-xl font-bold text-yellow-400">
                    ${revenueMetrics.perCustomer.toFixed(0)}
                  </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400">Price Per Share</div>
                  <div className="text-xl font-bold text-purple-400">
                    ${((currentValuation / 10000000) || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'protection' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 mr-2 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-300">Protection Balance Analysis</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Visualization of protection measures balancing company and founder interests across key dimensions.
                </p>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={protectionData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#9CA3AF' }} />
                      <Radar
                        name="Company"
                        dataKey="companyScore"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Founders"
                        dataKey="founderScore"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'investor' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <PieChartIcon className="h-6 w-6 mr-2 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-blue-300">Investor Pool Analysis</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Overview of the 1,000,000 shares (10%) reserved from Domenico's holding for future investors.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {investorPoolData.map((stage) => (
                    <div key={stage.stage} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-2">{stage.stage}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shares</span>
                          <span className="text-yellow-400">{stage.shares.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-blue-400">{stage.allocation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investorPoolData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="shares"
                      >
                        {investorPoolData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#EAB308', '#3B82F6', '#10B981'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'leaver' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <UserPlus className="h-6 w-6 mr-2 text-purple-400" />
                  <h3 className="text-xl font-semibold text-blue-300">Leaver Events Scenarios</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Analysis of different leaver scenarios and their impact on share retention and compensation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {leaverEventsData.map((scenario) => (
                    <div key={scenario.event} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-2">{scenario.event}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Share Retention</span>
                          <span className="text-green-400">{scenario.shareRetention}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Compensation</span>
                          <span className="text-blue-400">{scenario.compensation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={leaverEventsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="event" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="shareRetention"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This visualization is based on the Shareholders Agreement for The Augmented 4 Pty Ltd</p>
          <p>Effective Date: 30 May 2025</p>
        </div>
      </div>
    </div>
  );
};

export default App;