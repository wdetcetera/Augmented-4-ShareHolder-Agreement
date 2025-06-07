import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Sector
} from 'recharts';
import { 
  ChevronDown, ChevronUp, Users, Award, AlertTriangle, CheckCircle, 
  DollarSign, TrendingUp, Zap, ArrowRight, BarChart2, Briefcase,
  Lock, Target, Percent, CreditCard, UserPlus
} from 'lucide-react';

const App = () => {
    const [activeTab, setActiveTab] = useState('gameMode');
    const [showKpiDetails, setShowKpiDetails] = useState(false);
    const [animateCustomers, setAnimateCustomers] = useState(false);
    const [customerCount, setCustomerCount] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [investmentAmount, setInvestmentAmount] = useState(1000000);
    const [equityPercentage, setEquityPercentage] = useState(10);
    const [agentsPerCustomer, setAgentsPerCustomer] = useState(2);
    
    // Calculate valuations
    const agentMonthlyValue = 357;
    const calculateCompanyValuation = useCallback((customers, agentsPerCust) => {
      const monthlyRevenue = customers * agentsPerCust * agentMonthlyValue;
      const annualRevenue = monthlyRevenue * 12;
      // Using a 5x revenue multiple for SaaS companies
      return annualRevenue * 5;
    }, []);
    
    // Calculate investor offered valuation
    const calculateInvestorValuation = useCallback((investment, equityPct) => {
      if (equityPct === 0) return 0;
      return (investment / equityPct) * 100;
    }, []);
  
    // Calculate equity distributions
    const calculateEquityDistribution = useCallback((step, investorPct) => {
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
  
    // KPI Performance data based on current step
    const kpiData = [
      { name: 'Tranche 1', kpi: 'First 150 Customers', shares: 500000, progress: currentStep >= 1 ? 100 : 0, status: currentStep >= 1 ? 'Complete' : 'Pending' },
      { name: 'Tranche 2', kpi: '400 Customers Total', shares: 500000, progress: currentStep >= 2 ? 100 : 0, status: currentStep >= 2 ? 'Complete' : 'Pending' },
      { name: 'Tranche 3', kpi: '700 Customers Total', shares: 500000, progress: currentStep >= 3 ? 100 : 0, status: currentStep >= 3 ? 'Complete' : 'Pending' },
      { name: 'Tranche 4', kpi: '1000 Customers Total', shares: 500000, progress: currentStep >= 4 ? 100 : 0, status: currentStep >= 4 ? 'Complete' : 'Pending' }
    ];
    
    // Customer data for different stages
    const customerStages = [
      { stage: 'Start', count: 0 },
      { stage: 'KPI 1', count: 150 },
      { stage: 'KPI 2', count: 400 },
      { stage: 'KPI 3', count: 700 },
      { stage: 'KPI 4', count: 1000 }
    ];
    
    // Equity distribution at each stage
    const equityStages = customerStages.map((stage, index) => {
      return {
        stage: stage.stage,
        distribution: calculateEquityDistribution(index, index === 4 ? equityPercentage : 0)
      };
    });
    
    // Current equity distribution based on step and investor percentage
    const currentEquityDistribution = calculateEquityDistribution(currentStep, 
      currentStep === 4 ? equityPercentage : 0);
    
    // Company valuation based on current step
    const currentValuation = calculateCompanyValuation(customerCount, agentsPerCustomer);
    
    // Investment valuation
    const investorValuation = calculateInvestorValuation(investmentAmount, equityPercentage);
    
    // Customer Acquisition Timeline
    const customerData = [
      { month: '1', customers: 50, target: 83 },
      { month: '2', customers: 110, target: 166 },
      { month: '3', customers: 180, target: 250 },
      { month: '4', customers: 250, target: 333 },
      { month: '5', customers: 350, target: 416 },
      { month: '6', customers: 450, target: 500 },
      { month: '7', customers: 550, target: 583 },
      { month: '8', customers: 650, target: 666 },
      { month: '9', customers: 750, target: 750 },
      { month: '10', customers: 850, target: 833 },
      { month: '11', customers: 930, target: 916 },
      { month: '12', customers: 1000, target: 1000 }
    ];
    
    // Protection Balance Chart
    const protectionData = [
      { subject: 'Governance & Rights', companyScore: 6, founderScore: 7 },
      { subject: 'Leaver Clauses', companyScore: 8, founderScore: 7 },
      { subject: 'IP & Assets', companyScore: 8.5, founderScore: 7 },
      { subject: 'Exit & Deadlock', companyScore: 7, founderScore: 6.5 },
      { subject: 'Dilution Protections', companyScore: 6, founderScore: 8 },
      { subject: 'Reputation & Data', companyScore: 7.5, founderScore: 8 }
    ];
    
    // Custom PieChart active sector animation
    const renderActiveShape = (props: any) => {
      const RADIAN = Math.PI / 180;
      const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';
  
      return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload.name}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
          />
          <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999">{`${value.toFixed(1)}%`}</text>
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
            {`(${(percent * 100).toFixed(2)}%)`}
          </text>
        </g>
      );
    };
  
    // State for active index in pie chart
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback((_, index) => {
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
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700">{stage.count}</span>
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

                  {/* ... rest of the code ... */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

export default App; 