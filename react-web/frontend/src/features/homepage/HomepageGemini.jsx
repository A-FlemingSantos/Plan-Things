import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Calendar,
  Check,
  CheckCircle2,
  Figma,
  Github,
  GitMerge,
  Layers,
  LayoutDashboard,
  Linkedin,
  ListTodo,
  Menu,
  MessageSquare,
  Moon,
  Paperclip,
  PlayCircle,
  Quote,
  ShieldCheck,
  Slack,
  Star,
  Sun,
  Trello,
  Twitter,
  Zap,
} from "lucide-react";
import "./styles/homepage-gemini.css";

function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />
    </div>
  );
}

function Navbar({ isScrolled, onToggleTheme }) {
  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 glass-nav transition-all duration-300 ${isScrolled ? "shadow-lg" : ""}`}
      style={{ background: isScrolled ? "var(--nav-scrolled)" : "var(--glass-nav-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Plan Things</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">Resources</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">Log in</Link>
            <Link to="/cadastro" className="glass-button-primary px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-lg">
              Start for free
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>
            <button className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white focus:outline-none" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-8 border border-slate-900/10 dark:border-white/10 text-xs font-medium text-brand-700 dark:text-brand-100">
            <span className="flex h-2 w-2 rounded-full bg-brand-400" />
            Plan Things 2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            Synchronize Your Team&apos;s <br className="hidden md:block" /> Creative Potential
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            The liquid-smooth project management platform designed for agile teams. Bring clarity to chaos with intelligent workflows, transparent tracking, and seamless collaboration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="w-full sm:w-auto glass-button-primary px-8 py-4 rounded-full text-base font-medium flex items-center justify-center gap-2 text-white">
              Start Your Workspace
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#" className="w-full sm:w-auto glass-button-secondary px-8 py-4 rounded-full text-base font-medium flex items-center justify-center gap-2 text-slate-800 dark:text-white">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </a>
          </div>
        </div>

        <div className="mt-20 relative mx-auto max-w-5xl animate-float">
          <div className="glass-panel glass-mockup rounded-2xl border border-slate-900/10 dark:border-white/10 p-2 sm:p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-900/5 dark:border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs text-slate-600 dark:text-slate-400 font-medium">Acme Corp / Q3 Roadmap</div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 min-h-[400px]">
              <div className="hidden md:flex flex-col w-48 space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/5 dark:bg-white/5 text-brand-700 dark:text-brand-100 border border-slate-900/5 dark:border-white/5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium">Board</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  <ListTodo className="w-4 h-4" />
                  <span className="text-sm">List</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Timeline</span>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-900/5 dark:border-white/5">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-brand-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Team Space</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">To Do</h3>
                    <span className="text-xs bg-slate-900/10 dark:bg-white/10 px-2 py-0.5 rounded-full">3</span>
                  </div>
                  <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 p-3 rounded-lg hover:border-brand-500/50 transition-colors cursor-pointer">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-500 dark:text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded">Design</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 mb-3">Revamp landing page assets</p>
                    <div className="flex justify-between items-center">
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      <div className="w-5 h-5 rounded-full bg-blue-500 border border-white dark:border-[#0B1120]" />
                    </div>
                  </div>
                  <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 p-3 rounded-lg hover:border-brand-500/50 transition-colors cursor-pointer">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-500 dark:text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">Engineering</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 mb-3">Integrate payment gateway API</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Paperclip className="w-3 h-3" /> 2
                      </div>
                      <div className="w-5 h-5 rounded-full bg-teal-500 border border-white dark:border-[#0B1120]" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                      In Progress
                    </h3>
                    <span className="text-xs bg-slate-900/10 dark:bg-white/10 px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="bg-slate-900/5 dark:bg-white/5 border border-brand-500/30 p-3 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.1)] cursor-pointer">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-500 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Marketing</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 mb-3">Draft Q3 launch email sequence</p>
                    <div className="w-full bg-slate-900/10 dark:bg-white/10 rounded-full h-1 mb-3">
                      <div className="bg-brand-500 h-1 rounded-full w-[60%]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Due Tomorrow</span>
                      <div className="flex -space-x-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 border border-white dark:border-[#0B1120] z-10" />
                        <div className="w-5 h-5 rounded-full bg-pink-500 border border-white dark:border-[#0B1120] z-0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex flex-col gap-3 opacity-60">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Done</h3>
                    <span className="text-xs bg-slate-900/10 dark:bg-white/10 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5 p-3 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-through mb-3">Competitor analysis report</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-green-500 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-brand-600/20 to-purple-600/20 blur-3xl rounded-full scale-90" />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship faster.</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Complex projects require simple, robust tools. Plan Things distills modern project management into a transparent, frictionless experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-brand-500 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Real-time Sync</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Changes propagate instantly across your team&apos;s devices. No more refreshing or conflicting edits.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <GitMerge className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Automated Workflows</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Set up rules to automatically assign tasks, update statuses, and notify stakeholders.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-teal-500 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Visual Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Turn task data into actionable insights with gorgeous, easily digestible performance metrics.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Enterprise Security</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Bank-grade encryption, role-based access control, and comprehensive audit logs standard.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl md:col-span-2 group flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
            <div className="absolute bottom-0 left-1/2 w-full h-32 bg-brand-500/10 rounded-full blur-3xl transform -translate-x-1/2" />
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 mb-4">
                <Blocks className="w-3 h-3" /> Integrations
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Plays well with others</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">Connect Plan Things to your existing tech stack. Slack, GitHub, Figma, and Google Workspace integrations are available out of the box.</p>
              <a href="#" className="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 font-medium text-sm inline-flex items-center gap-1 transition-colors">
                Explore all integrations <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="w-full md:w-64 grid grid-cols-2 gap-3 z-10">
              <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl p-4 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Slack className="w-8 h-8 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl p-4 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Github className="w-8 h-8 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl p-4 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Figma className="w-8 h-8 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl p-4 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Trello className="w-8 h-8 text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 relative z-10 border-y border-slate-900/5 dark:border-white/5 bg-slate-900/[0.02] dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Trusted by innovative teams worldwide</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Join thousands of product managers, developers, and designers who have found clarity with Plan Things.</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-white dark:border-[#0B1120]" />
                <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-white dark:border-[#0B1120]" />
                <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white dark:border-[#0B1120]" />
                <div className="w-10 h-10 rounded-full bg-brand-500 border-2 border-white dark:border-[#0B1120] flex items-center justify-center text-xs font-bold text-white">+2k</div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <div className="flex text-amber-500 dark:text-amber-400 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                4.9/5 on G2 Crowd
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="glass-panel p-8 rounded-2xl relative">
              <Quote className="w-10 h-10 text-slate-900/10 dark:text-white/10 absolute top-6 right-6" />
              <p className="text-lg text-slate-800 dark:text-slate-200 mb-6 relative z-10 font-light italic">
                "Before Plan Things, our engineering sprints were a mess of disconnected spreadsheets and noisy chat channels. The interface is so clean and transparent that adoption across our 40-person team was immediate."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center text-white font-bold">SJ</div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium">Sarah Jenkins</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">VP of Engineering, CloudScale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-slate-600 dark:text-slate-400">Start for free, upgrade when your team needs more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-3xl flex flex-col">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Starter</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Perfect for small teams finding their flow.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-600 dark:text-slate-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Up to 5 team members</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Unlimited active tasks</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> 1 Integrations</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Basic list &amp; board views</li>
            </ul>
            <a href="#" className="w-full glass-button-secondary py-3 rounded-xl text-center font-medium text-slate-900 dark:text-white transition-all">
              Get Started
            </a>
          </div>

          <div className="glass-panel p-8 rounded-3xl flex flex-col relative border-brand-500/30 dark:border-brand-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Popular</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Professional</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">For growing teams requiring advanced control.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">$12</span>
              <span className="text-slate-600 dark:text-slate-400">/user/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Unlimited team members</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Advanced analytics &amp; reporting</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Unlimited integrations</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Custom workflows &amp; automations</li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm"><Check className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Priority support</li>
            </ul>
            <a href="#" className="w-full glass-button-primary py-3 rounded-xl text-center font-medium text-white transition-all">
              Start 14-Day Free Trial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="py-20 relative z-10 px-4">
      <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 to-purple-600/10 z-0" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to transform your workflow?</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">Stop managing tools and start managing projects. Get your team aligned in minutes.</p>
          <Link to="/cadastro" className="inline-flex glass-button-primary px-8 py-4 rounded-full text-lg font-medium text-white">
            Create your workspace
          </Link>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">No credit card required for Starter plan.</p>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-slate-900/10 dark:border-white/10 pt-16 pb-8 relative z-10 bg-slate-100/50 dark:bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Plan Things</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">The modern project management standard for teams that value focus and clarity.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; 2026 Plan Things Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomepageGemini() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.add("scroll-smooth");
    htmlElement.classList.add("dark");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="antialiased selection:bg-brand-500 selection:text-white">
      <AmbientBackground />
      <Navbar isScrolled={isScrolled} onToggleTheme={handleThemeToggle} />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCtaSection />
      <FooterSection />
    </div>
  );
}
