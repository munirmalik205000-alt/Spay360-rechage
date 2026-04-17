
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wallet, 
  History, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { User, Transaction, TransactionType, TransactionStatus, RechargePlan } from './types';
import { MOCK_PLANS, MOCK_TRANSACTIONS, OPERATORS } from './constants';
import { getPlanRecommendation } from './services/geminiService';

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// Fix: Change the props type to any to resolve issues with children and key properties in certain TypeScript environments
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }: { status: TransactionStatus }) => {
  const styles = {
    [TransactionStatus.SUCCESS]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [TransactionStatus.FAILED]: 'bg-rose-50 text-rose-600 border-rose-100',
    [TransactionStatus.PENDING]: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  const icons = {
    [TransactionStatus.SUCCESS]: <CheckCircle2 size={14} />,
    [TransactionStatus.FAILED]: <XCircle size={14} />,
    [TransactionStatus.PENDING]: <Clock size={14} />,
  };
  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${styles[status]}`}>
      {icons[status]}
      <span>{status}</span>
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Recharge state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(null);
  
  // AI assistant state
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Mock login and backend integration
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback for safety
      const user: User = {
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        balance: 1450.50,
        phone: '9876543210'
      };
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleAiAsk = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const response = await getPlanRecommendation(aiInput, MOCK_PLANS);
    setAiResponse(response || '');
    setIsAiLoading(false);
    setAiInput('');
  };

  const processRecharge = () => {
    if (!selectedPlan || !phoneNumber) return;
    alert(`Recharge of ₹${selectedPlan.price} successful for ${phoneNumber}`);
    setActiveTab('history');
    setSelectedPlan(null);
    setPhoneNumber('');
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${loginType === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              loginType === 'admin' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-blue-600 shadow-blue-500/20'
            }`}>
              {loginType === 'admin' ? <ShieldCheck size={40} className="text-white" /> : <Smartphone size={40} className="text-white" />}
            </div>
            <h1 className={`text-4xl font-black tracking-tight ${loginType === 'admin' ? 'text-white' : 'text-slate-900'}`}>
              QuickCharge <span className={loginType === 'admin' ? 'text-indigo-400' : 'text-blue-600'}>Pro</span>
            </h1>
            <p className={`mt-2 font-medium ${loginType === 'admin' ? 'text-slate-400' : 'text-slate-500'}`}>
              {loginType === 'admin' ? 'Secure Administrator Access' : 'Personal Recharge Dashboard'}
            </p>
          </div>
          
          <div className={`rounded-3xl p-8 shadow-2xl border transition-all duration-300 ${
            loginType === 'admin' 
              ? 'bg-slate-800 border-slate-700 shadow-black/40' 
              : 'bg-white border-slate-100'
          }`}>
            {/* Panel Selector */}
            <div className={`flex p-1 rounded-2xl mb-8 ${loginType === 'admin' ? 'bg-slate-700/50' : 'bg-slate-100/80'}`}>
              <button 
                onClick={() => setLoginType('user')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  loginType === 'user' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : loginType === 'admin' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                User Panel
              </button>
              <button 
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  loginType === 'admin' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin Panel
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${loginType === 'admin' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {loginType === 'admin' ? 'Admin ID / Email' : 'Email Address'}
                </label>
                <input 
                  name="email"
                  type="email" 
                  required
                  defaultValue={loginType === 'admin' ? 'admin@example.com' : 'user@example.com'}
                  autoComplete="email"
                  className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 ${
                    loginType === 'admin' 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/10 placeholder:text-slate-600' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/10'
                  }`}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${loginType === 'admin' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Access Password
                </label>
                <input 
                  type="password" 
                  required
                  defaultValue="password"
                  className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 ${
                    loginType === 'admin' 
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 focus:ring-indigo-500/10 placeholder:text-slate-600' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/10'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              <button className={`w-full font-bold py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-95 group flex items-center justify-center space-x-2 ${
                loginType === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}>
                <span>{loginType === 'admin' ? 'Enter Control Center' : 'Sign In to Dashboard'}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center">
              <p className={`text-xs font-medium ${loginType === 'admin' ? 'text-slate-500' : 'text-slate-400'}`}>
                {loginType === 'admin' ? 'Restricted Area' : 'Quick & Secure Recharge'}
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className={`text-xs font-bold uppercase tracking-widest opacity-40 ${loginType === 'admin' ? 'text-white' : 'text-slate-900'}`}>
              Powered by QuickCharge Infrastructure
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} fixed inset-y-0 left-0 bg-white border-r border-slate-100 transition-all duration-300 z-50 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center space-x-3 overflow-hidden ${isSidebarOpen ? '' : 'hidden'}`}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Smartphone size={20} />
            </div>
            <span className="font-bold text-lg whitespace-nowrap">QC Pro</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Smartphone} label="Recharge" active={activeTab === 'recharge'} onClick={() => setActiveTab('recharge')} />
          <SidebarItem icon={Wallet} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <SidebarItem icon={History} label="Transactions" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          {currentUser?.role === 'admin' && (
            <SidebarItem icon={ShieldCheck} label="Admin Panel" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-slate-50 border border-slate-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
              />
            </div>
            <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">{currentUser?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wallet Summary */}
              <Card className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden border-0">
                <div className="relative z-10">
                  <p className="text-blue-100 font-medium">Available Balance</p>
                  <h3 className="text-4xl font-bold mt-2">₹{currentUser?.balance.toLocaleString()}</h3>
                  <div className="mt-8 flex space-x-3">
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all flex items-center">
                      <Plus size={16} className="mr-2" /> Add Money
                    </button>
                    <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                      Transfer
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 text-blue-400/20">
                  <Wallet size={120} />
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="text-emerald-600 text-xs font-bold">+12.5%</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-4 font-medium">Monthly Savings</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">₹420.00</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                      <ArrowDownLeft size={20} />
                    </div>
                    <span className="text-blue-600 text-xs font-bold">-2.1%</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-4 font-medium">Recharge Spend</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">₹1,249.50</p>
                </div>
              </Card>

              {/* Chart */}
              <Card className="col-span-1 md:col-span-2">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center">
                  <History size={18} className="mr-2 text-blue-600" /> Spending Overview
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Jan', value: 400 },
                      { name: 'Feb', value: 300 },
                      { name: 'Mar', value: 600 },
                      { name: 'Apr', value: 800 },
                      { name: 'May', value: 500 },
                      { name: 'Jun', value: 900 },
                    ]}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Recent Activity Mini */}
              <Card className="col-span-1">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800">Quick Recharge</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Smartphone size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">9876543210</p>
                      <p className="text-xs text-slate-400">Jio • Last recharaged 28d ago</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                  <button onClick={() => setActiveTab('recharge')} className="w-full py-3 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                    New Recharge <Plus size={16} className="ml-1" />
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* RECHARGE TAB */}
          {activeTab === 'recharge' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 h-fit sticky top-24">
                <h3 className="text-xl font-bold mb-6">Enter Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium tracking-wider"
                        placeholder="00000 00000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Operator</label>
                    <div className="grid grid-cols-2 gap-3">
                      {OPERATORS.map(op => (
                        <button
                          key={op}
                          onClick={() => setSelectedOperator(op)}
                          className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
                            selectedOperator === op ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPlan && (
                    <div className="p-4 bg-blue-600 rounded-2xl text-white">
                      <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Selected Plan</p>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <p className="text-3xl font-bold">₹{selectedPlan.price}</p>
                          <p className="text-sm text-blue-100 mt-1">{selectedPlan.data} • {selectedPlan.validity}</p>
                        </div>
                        <button onClick={() => setSelectedPlan(null)} className="p-1 hover:bg-white/20 rounded">
                          <X size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={processRecharge}
                        disabled={!phoneNumber || phoneNumber.length < 10}
                        className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-xl mt-4 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                      >
                        Proceed to Pay
                      </button>
                    </div>
                  )}
                </div>
              </Card>

              <div className="lg:col-span-2 space-y-8">
                {/* AI Assistant */}
                <Card className="bg-indigo-50 border-indigo-100 overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center space-x-2 text-indigo-700 mb-4">
                      <Sparkles size={20} />
                      <h4 className="font-bold">AI Plan Assistant</h4>
                    </div>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="E.g., Which plan is best for Netflix and 2GB data daily?" 
                        className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      <button 
                        onClick={handleAiAsk}
                        disabled={isAiLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                      >
                        {isAiLoading ? <Clock className="animate-spin" /> : 'Ask AI'}
                      </button>
                    </div>
                    {aiResponse && (
                      <div className="mt-4 p-4 bg-white/80 rounded-xl text-sm text-indigo-900 leading-relaxed border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-12 -right-12 text-indigo-200/50">
                    <Sparkles size={160} />
                  </div>
                </Card>

                {/* Plans List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">Popular Plans</h3>
                    <div className="flex space-x-2">
                      {['All', 'Unlimited', 'Data', 'Entertainment'].map(cat => (
                        <button key={cat} className="px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_PLANS.map(plan => (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedPlan?.id === plan.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                              {plan.category}
                            </span>
                            <p className="text-2xl font-bold text-slate-800 mt-2">₹{plan.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-700">{plan.validity}</p>
                            <p className="text-xs text-slate-400">Validity</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100">
                          <div className="flex space-x-4">
                            <div>
                              <p className="text-sm font-bold text-slate-700">{plan.data}</p>
                              <p className="text-[10px] uppercase text-slate-400 font-bold">Data</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">{plan.calls}</p>
                              <p className="text-[10px] uppercase text-slate-400 font-bold">Voice</p>
                            </div>
                          </div>
                          <ChevronRight className={selectedPlan?.id === plan.id ? 'text-blue-600' : 'text-slate-300'} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 text-white p-8 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <p className="text-slate-400 font-medium">QC Pro Digital Card</p>
                      <div className="w-12 h-8 bg-amber-400/20 rounded flex items-center justify-center border border-amber-400/30">
                        <div className="w-6 h-4 bg-amber-400/40 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="mt-12">
                      <p className="text-2xl font-medium tracking-widest">•••• •••• •••• 4290</p>
                    </div>
                    <div className="mt-auto pt-8 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Balance</p>
                        <p className="text-2xl font-bold">₹{currentUser?.balance}</p>
                      </div>
                      <p className="text-sm font-bold">08/28</p>
                    </div>
                  </div>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
                </Card>

                <Card className="flex flex-col justify-center space-y-6">
                  <h4 className="text-lg font-bold text-slate-800">Wallet Actions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all">
                      <Plus size={24} className="mb-2" />
                      <span className="text-sm font-bold">Top Up</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all">
                      <ArrowUpRight size={24} className="mb-2" />
                      <span className="text-sm font-bold">Transfer</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all">
                      <Smartphone size={24} className="mb-2" />
                      <span className="text-sm font-bold">Withdraw</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all">
                      <ShieldCheck size={24} className="mb-2" />
                      <span className="text-sm font-bold">Security</span>
                    </button>
                  </div>
                </Card>
              </div>

              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800">Add Money to Wallet</h4>
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button key={amt} className="px-6 py-2 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-all">
                      +₹{amt}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <input 
                    type="number" 
                    placeholder="Enter custom amount" 
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                    Pay Now
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <Card className="overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 mb-6 gap-4">
                <h3 className="text-xl font-bold text-slate-800">Transaction History</h3>
                <div className="flex space-x-2">
                  <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 focus:outline-none">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </select>
                  <button className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
                    <Search size={18} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Details</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date & Time</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Amount</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="pb-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_TRANSACTIONS.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              txn.type === TransactionType.RECHARGE ? 'bg-blue-50 text-blue-600' :
                              txn.type === TransactionType.WALLET_ADD ? 'bg-emerald-50 text-emerald-600' :
                              'bg-purple-50 text-purple-600'
                            }`}>
                              {txn.type === TransactionType.RECHARGE ? <Smartphone size={18} /> : 
                               txn.type === TransactionType.WALLET_ADD ? <ArrowDownLeft size={18} /> : <Sparkles size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700">{txn.description}</p>
                              <p className="text-xs text-slate-400">{txn.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500 font-medium">{txn.date}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">₹{txn.amount}</td>
                        <td className="py-4 px-4"><Badge status={txn.status} /></td>
                        <td className="py-4 px-4">
                          <button className="text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ADMIN TAB */}
          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', val: '12,402', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Today Rev', val: '₹4.2L', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Failures', val: '0.2%', color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Support', val: '14', color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                  <Card key={i}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.val}</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <h4 className="font-bold text-slate-800 mb-6">User Growth</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'W1', value: 400 },
                        { name: 'W2', value: 700 },
                        { name: 'W3', value: 900 },
                        { name: 'W4', value: 1200 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-bold text-slate-800 mb-6">Pending Verifications</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">Vendor_{i}003</p>
                            <p className="text-xs text-slate-400">KYC Submitted</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg"><XCircle size={18}/></button>
                          <button className="p-2 text-emerald-500 hover:bg-emerald-100 rounded-lg"><CheckCircle2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
