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
    const renderActiveShape = (props) => {
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
                          { stage: 'KPI 1', Domenico: 85, Michael: 15, Investors: 0 },
                          { stage: 'KPI 2', Domenico: 80, Michael: 20, Investors: 0 },
                          { stage: 'KPI 3', Domenico: 75, Michael: 25, Investors: 0 },
                          { stage: 'KPI 4', Domenico: 70 - (currentStep === 4 ? equityPercentage : 0), 
                                            Michael: 30, 
                                            Investors: (currentStep === 4 ? equityPercentage : 0) }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="stage" />
                        <YAxis label={{ value: 'Ownership %', angle: -90, position: 'insideLeft', fill: '#8884d8' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937import React, { useState, useEffect, useCallback } from 'react';
  import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Sector
  } from 'recharts';
  import { 
    ChevronDown, ChevronUp, Users, Award, AlertTriangle, CheckCircle, 
    DollarSign, TrendingUp, Zap, ArrowRight, BarChart2, Briefcase,
    Lock, Unlock, Target, Percent, CreditCard, UserPlus
  } from 'lucide-react';
  
  const App = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showKpiDetails, setShowKpiDetails] = useState(false);
    const [animateCustomers, setAnimateCustomers] = useState(false);
    const [customerCount, setCustomerCount] = useState(0);
    
    useEffect(() => {
      // Animate customer count on initial load
      setAnimateCustomers(true);
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCustomerCount(prev => {
            if (prev >= 1000) {
              clearInterval(interval);
              return 1000;
            }
            return prev + 20;
          });
        }, 20);
        
        return () => clearInterval(interval);
      }, 800);
      
      return () => clearTimeout(timer);
    }, []);
  
    // KPI Performance data
    const kpiData = [
      { name: 'Tranche 1', kpi: 'First 150 Customers', shares: 500000, progress: 100, status: 'Complete' },
      { name: 'Tranche 2', kpi: '400 Customers Total', shares: 500000, progress: 100, status: 'Complete' },
      { name: 'Tranche 3', kpi: '700 Customers Total', shares: 500000, progress: 100, status: 'Complete' },
      { name: 'Tranche 4', kpi: '1000 Customers Total', shares: 500000, progress: 100, status: 'Complete' }
    ];
    
    // Share Ownership Evolution
    const shareEvolutionData = [
      { month: 'Start', domenico: 9000000, michael: 1000000, investors: 0 },
      { month: 'Month 3', domenico: 8500000, michael: 1500000, investors: 0 },
      { month: 'Month 6', domenico: 8000000, michael: 2000000, investors: 0 },
      { month: 'Month 9', domenico: 7500000, michael: 2500000, investors: 0 },
      { month: 'Month 12', domenico: 7000000, michael: 3000000, investors: 0 },
      { month: 'Month 18', domenico: 6500000, michael: 3000000, investors: 500000 }
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
    
    // Leaver Consequences
    const leaverConsequences = [
      { name: "Good Leaver (Post 24m)", shares: 100, voting: 100, board: 100 },
      { name: "Good Leaver (First 24m)", shares: 100, voting: 70, board: 50 },
      { name: "Bad Leaver (Year 4)", shares: 85, voting: 40, board: 0 },
      { name: "Bad Leaver (Year 3)", shares: 80, voting: 30, board: 0 },
      { name: "Bad Leaver (Year 2)", shares: 70, voting: 20, board: 0 },
      { name: "Bad Leaver (Year 1)", shares: 60, voting: 0, board: 0 }
    ];
    
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
    
    // Investor Pool
    const investorPoolData = [
      { name: 'Available for Investors', value: 1000000, color: '#4CAF50' },
      { name: 'From Michael Pool', value: 0, color: '#2196F3' },
      { name: 'From Domenico Pool', value: 0, color: '#FF9800' }
    ];
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
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
            
            {/* Customer count highlight */}
            <div className="mt-10 flex justify-center">
              <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center">
                  <Users className="h-10 w-10 text-blue-400 mr-4" />
                  <div>
                    <p className="text-gray-400 text-sm">12-Month Customer Target</p>
                    <div className="flex items-end">
                      <span className={`text-5xl font-bold ${animateCustomers ? 'text-green-400' : 'text-white'}`}>
                        {customerCount}
                      </span>
                      <span className="text-2xl ml-2 text-gray-400">/1000</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(customerCount / 1000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex overflow-x-auto py-2 mb-6 border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'overview' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('kpis')}
              className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'kpis' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              KPI & Shares
            </button>
            <button 
              onClick={() => setActiveTab('protection')}
              className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'protection' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Protection Balance
            </button>
            <button 
              onClick={() => setActiveTab('leaver')}
              className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === 'leaver' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Leaver Events
            </button>
            <button 
              onClick={() => setActiveTab('investor')}
              className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'investor' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Investor Pool
            </button>
          </div>
          
          {/* Active Tab Content */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-300">Company Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Share Ownership Evolution</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={shareEvolutionData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                            formatter={(value) => [`${value.toLocaleString()} shares`, '']}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="domenico" stackId="1" stroke="#FF9800" fill="#FF9800" name="Domenico Rutigliano" />
                          <Area type="monotone" dataKey="michael" stackId="1" stroke="#2196F3" fill="#2196F3" name="Michael Scheelhardt" />
                          <Area type="monotone" dataKey="investors" stackId="1" stroke="#4CAF50" fill="#4CAF50" name="External Investors" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Customer Acquisition Trajectory</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={customerData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: 0, fill: '#8884d8' }} />
                          <YAxis label={{ value: 'Customers', angle: -90, position: 'insideLeft', fill: '#8884d8' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="target" stroke="#8884d8" fill="rgba(136, 132, 216, 0.2)" name="Target" />
                          <Area type="monotone" dataKey="customers" stroke="#82ca9d" fill="#82ca9d" name="Actual" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2 text-gray-300">Initial Shares</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="text-2xl font-bold">10,000,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Issued</p>
                        <p className="text-2xl font-bold">10,000,000</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2 text-gray-300">Domenico (Founder)</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-400">Shares</p>
                        <p className="text-2xl font-bold text-orange-500">9,000,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Ownership</p>
                        <p className="text-2xl font-bold text-orange-500">90%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2 text-gray-300">Michael (CCO)</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-400">Base Shares</p>
                        <p className="text-2xl font-bold text-blue-500">1,000,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Max with KPIs</p>
                        <p className="text-2xl font-bold text-blue-500">3,000,000</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2 text-gray-300">Investor Pool</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-400">Reserved</p>
                        <p className="text-2xl font-bold text-green-500">1,000,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">From Founder</p>
                        <p className="text-2xl font-bold text-green-500">10%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'kpis' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-300">Michael's KPI & Share Acquisition</h2>
                  <button 
                    onClick={() => setShowKpiDetails(!showKpiDetails)}
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                  >
                    {showKpiDetails ? (
                      <>Less Details <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>More Details <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </button>
                </div>
                
                <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">Performance Share Tranches Progress</h3>
                  
                  <div className="space-y-6">
                    {kpiData.map((item, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex flex-wrap justify-between items-center mb-2">
                          <h4 className="text-lg font-medium">{item.name}</h4>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.status === 'Complete' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap md:flex-nowrap items-center mb-2">
                          <div className="w-full md:w-1/2 mb-2 md:mb-0 md:pr-4">
                            <p className="text-sm text-gray-400">KPI Target</p>
                            <p className="text-base">{item.kpi}</p>
                          </div>
                          <div className="w-full md:w-1/2">
                            <p className="text-sm text-gray-400">Shares Earned</p>
                            <p className="text-base">{item.shares.toLocaleString()} shares</p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>0%</span>
                          <span>{item.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {showKpiDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold mb-4 text-blue-300">KPI Achievement Timeline</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={kpiData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                              formatter={(value) => [`${value.toLocaleString()} shares`, '']}
                            />
                            <Legend />
                            <Bar dataKey="shares" name="Shares Earned" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold mb-4 text-blue-300">Vesting Timeline</h3>
                      <p className="text-gray-300 mb-4">Each Performance Tranche is subject to a 6-month vesting period after KPI achievement.</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute h-full w-1 bg-gray-600 left-6 top-12 -z-10"></div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">KPI Achievement</h4>
                            <p className="text-sm text-gray-400">Performance Tranche Transferred</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center">
                              <span className="text-white font-medium">3m</span>
                            </div>
                            <div className="absolute h-full w-1 bg-gray-600 left-6 top-12 -z-10"></div>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Mid-Vesting Period</h4>
                            <p className="text-sm text-gray-400">50% of risk period complete</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium">6m</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Full Vesting Complete</h4>
                            <p className="text-sm text-gray-400">Shares fully vested and secured</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300">Final Share Distribution After KPIs</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Domenico', value: 7000000 },
                            { name: 'Michael', value: 3000000 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value.toLocaleString()} shares`, '']}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'protection' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-300">Company vs Founders Protection Balance</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Protection Balance Radar</h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={protectionData}>
                          <PolarGrid stroke="#555" />
                          <PolarAngleAxis dataKey="subject" stroke="#999" />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#999" />
                          <Radar name="Company Protection" dataKey="companyScore" stroke="#FFD700" fill="#FFD700" fillOpacity={0.4} />
                          <Radar name="Founders Protection" dataKey="founderScore" stroke="#FF8042" fill="#FF8042" fillOpacity={0.4} />
                          <Legend />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Protection Categories Explained</h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Governance & Rights</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Board composition, voting rights, decision-making authority and reserved matters requiring special approval.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Leaver Clauses</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Provisions governing what happens to shares and rights when founders or key shareholders leave the company.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">IP & Assets</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Ownership and protection of intellectual property, technology, and key company assets.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Exit & Deadlock</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Mechanisms for resolving disputes, deadlocks, and provisions governing company exits (IPO, trade sale).
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Dilution Protections</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Safeguards against unfair dilution of ownership through pre-emptive rights and other mechanisms.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Reputation & Data</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Protection of company and personal reputation, data privacy, and confidentiality provisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'leaver' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-300">Leaver Event Consequences</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Consequences by Leaver Type</h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={leaverConsequences}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis type="category" dataKey="name" width={150} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                            formatter={(value) => [`${value}%`, '']}
                          />
                          <Legend />
                          <Bar dataKey="shares" name="Retained Shares %" fill="#4CAF50" />
                          <Bar dataKey="voting" name="Voting Rights %" fill="#2196F3" />
                          <Bar dataKey="board" name="Board Rights %" fill="#FF9800" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Leaver Types Explained</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-900 bg-opacity-30 border border-green-700 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-300">Good Leaver Events</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                          <li>Death or permanent incapacity</li>
                          <li>Termination without cause</li>
                          <li>Resignation with good reason</li>
                          <li>Material breach by the company</li>
                          <li>Material reduction in duties</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <h4 className="font-medium text-red-300">Bad Leaver Events</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                          <li>Voluntary resignation without good reason</li>
                          <li>Termination for cause</li>
                          <li>Fraud or dishonesty</li>
                          <li>Material breach of agreement</li>
                          <li>Post-termination obligation breach</li>
                        </ul>
                      </div>
                      
                      <div className="md:col-span-2 p-4 bg-gray-800 rounded-lg mt-4">
                        <h4 className="font-medium text-blue-300 mb-2">Graduated Share Reduction (Bad Leavers)</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400">Year 1:</p>
                            <p className="text-white">40% shares offered for sale</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Year 2:</p>
                            <p className="text-white">30% shares offered for sale</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Year 3:</p>
                            <p className="text-white">20% shares offered for sale</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Year 4:</p>
                            <p className="text-white">15% shares offered for sale</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Price Determination for Bad Leaver Shares</h4>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li><span className="font-medium text-blue-300">Fraud/Dishonesty:</span> 70% of Fair Market Value</li>
                        <li><span className="font-medium text-blue-300">Voluntary Resignation:</span> 85% of Fair Market Value</li>
                        <li><span className="font-medium text-blue-300">Other Bad Leaver Event:</span> 100% of Fair Market Value</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'investor' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-blue-300">Investor Pool & Future Funding</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Reserved Investor Pool</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={investorPoolData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {investorPoolData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value.toLocaleString()} shares`, '']}
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-300 mb-2">Investor Pool Details</h4>
                      <p className="text-sm text-gray-300">
                        Domenico Rutigliano has committed to make available 1,000,000 shares (10% of total) from his personal holding for future external investors. This arrangement allows for external investment without diluting Michael's stake beyond agreed thresholds.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Future Funding Process</h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Investor Share Pool</h4>
                        <div className="flex items-start mt-2">
                          <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300">
                            1,000,000 shares (10% of initial shares) reserved from Domenico's holding for future investors.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Investment Approval</h4>
                        <div className="flex items-start mt-2">
                          <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300">
                            Terms of any investment (including valuation) are a Reserved Matter requiring special approval.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Rights Offers for Additional Funding</h4>
                        <div className="flex items-start mt-2">
                          <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300">
                            Beyond the Investor Pool, any new shares issued must first be offered to existing shareholders pro-rata (pre-emptive rights).
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Fair Valuation Mechanism</h4>
                        <div className="flex items-start mt-2">
                          <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300">
                            Independent valuer process established for determining Fair Market Value for internal transfers and capital events.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-yellow-300">Dilution Protections</h4>
                        <div className="flex items-start mt-2">
                          <Award className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-300">
                            Clear mechanisms for fair allocation of future share issues protect against unfair dilution of either shareholder.
                          </p>
                        </div>
                      </div>
                    </div>
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