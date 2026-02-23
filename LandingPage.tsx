"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Bus, Package, Car, MapPin, Calendar, Users, Search,
    ArrowRight, ArrowLeftRight, Phone, Mail, Clock, Wifi,
    Zap, Shield, Star, ChevronRight, ChevronLeft, Menu, X,
    Truck, Navigation, Hash, Smartphone, Facebook, Instagram,
    Twitter, Youtube, Tv, Wind, Coffee, Lightbulb, AlertTriangle,
    CreditCard, Headphones, CheckCircle, Images,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "bus" | "cargo" | "hire";
type TripType = "one-way" | "round-trip";
type HireType = "bus" | "car";

interface Route { from: string; to: string; duration: string; price: number; badge?: string }
interface Testimonial { name: string; route: string; rating: number; text: string; avatar: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const CITIES = [
    "Mumbai", "Pune", "Nagpur", "Chandrapur", "Aurangabad", "Jalna",
    "Ahmednagar", "Nashik", "Kolhapur", "Solapur", "Latur", "Amravati", "Yavatmal", "Wardha",
];

const POPULAR_ROUTES: Route[] = [
    { from: "Chandrapur", to: "Pune", duration: "10h 30m", price: 850, badge: "Most Popular" },
    { from: "Chandrapur", to: "Mumbai", duration: "13h 00m", price: 1050, badge: "Premium" },
    { from: "Chandrapur", to: "Nagpur", duration: "2h 45m", price: 280 },
    { from: "Nagpur", to: "Pune", duration: "8h 15m", price: 720, badge: "Trending" },
    { from: "Pune", to: "Mumbai", duration: "3h 30m", price: 350 },
    { from: "Aurangabad", to: "Mumbai", duration: "5h 45m", price: 490, badge: "Daily Dep." },
];

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Rahul Sharma", route: "Chandrapur → Pune", rating: 5, avatar: "RS",
        text: "Excellent service! The bus was punctual and extremely comfortable. The crew was very courteous. Will definitely book again."
    },
    {
        name: "Priya Joshi", route: "Mumbai → Nagpur", rating: 5, avatar: "PJ",
        text: "Smooth booking experience and the AC sleeper was spotlessly clean. WiFi worked throughout the journey. Highly recommend!"
    },
    {
        name: "Amit Kulkarni", route: "Nagpur → Aurangabad", rating: 4, avatar: "AK",
        text: "Great value for money. The cargo tracking feature is a lifesaver for my business shipments. Real-time SMS updates are accurate."
    },
];

const AMENITIES = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Zap, label: "Charging Points" },
    { icon: Tv, label: "Entertainment" },
    { icon: Wind, label: "Air Conditioning" },
    { icon: Coffee, label: "Snacks Provided" },
    { icon: Lightbulb, label: "Reading Light" },
    { icon: Shield, label: "CCTV Monitored" },
    { icon: AlertTriangle, label: "Emergency Exit" },
];

const STATS = [
    { value: "2M+", label: "Happy Passengers" },
    { value: "50+", label: "Routes Covered" },
    { value: "15+", label: "Years of Service" },
    { value: "99%", label: "On-Time Arrivals" },
];

const GALLERY_IMAGES = [
    { src: "/images/gallery-1.jpg", caption: "Our fleet of DNR Express buses ready to roll" },
    { src: "/images/gallery-2.jpg", caption: "DNR Express — side profile and front view" },
    { src: "/images/gallery-3.jpg", caption: "DNR Express bus navigating city routes with ease" },
    { src: "/images/gallery-1.jpg", caption: "Perfect alignment — DNR Express fleet on standby" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={14}
                    className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
            ))}
        </div>
    );
}

function CitySelect({ value, onChange, placeholder, icon: Icon }: {
    value: string; onChange: (v: string) => void; placeholder: string; icon: React.ElementType;
}) {
    return (
        <div className="relative">
            <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none z-10" />
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 appearance-none cursor-pointer backdrop-blur-sm transition-all hover:bg-white/15">
                <option value="" disabled className="text-slate-800">{placeholder}</option>
                {CITIES.map(c => <option key={c} value={c} className="text-slate-800">{c}</option>)}
            </select>
            <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none rotate-90" />
        </div>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const links = [
        { label: "Home", href: "#" },
        { label: "Routes", href: "#routes" },
        { label: "Track Cargo", href: "#cargo" },
        { label: "Hire", href: "#hire" },
        { label: "Gallery", href: "#gallery" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/30" : "bg-transparent"
            }`}>
            {/* Top bar */}
            <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-black/30 backdrop-blur-sm text-xs text-white/60 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <a href="tel:8380000277" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                        <Phone size={11} /> 8380000277 / 8380000277
                    </a>
                    <span className="flex items-center gap-1.5"><Clock size={11} /> Mon–Sun: 9 AM – 11 PM</span>
                </div>
                <div className="flex items-center gap-5">
                    <a href="/lrstatus" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><Truck size={11} />Track Shipment</a>
                    <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><Smartphone size={11} />Download App</a>
                </div>
            </div>

            {/* Main bar */}
            <div className="flex items-center justify-between px-6 lg:px-10 py-3">
                {/* Logo — real image */}
                <a href="/" className="flex items-center gap-2 group">
                    <div className="h-11 flex items-center bg-white rounded-xl px-3 shadow-lg shadow-black/20 group-hover:shadow-amber-500/20 transition-shadow">
                        <img src="/images/logo.jpg" alt="DNR Express" className="h-8 w-auto object-contain" />
                    </div>
                </a>

                {/* Desktop links */}
                <div className="hidden lg:flex items-center gap-7">
                    {links.map(l => (
                        <a key={l.label} href={l.href}
                            className="text-white/80 hover:text-amber-400 text-sm font-medium transition-colors relative group">
                            {l.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300 rounded-full" />
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    <a href="/login" className="text-sm text-white/60 hover:text-white transition-colors">Login</a>
                    <a href="/signup" className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200">
                        Sign Up
                    </a>
                </div>

                <button onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle menu">
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                } bg-slate-950/98 backdrop-blur-md border-t border-white/10`}>
                <div className="px-6 py-4 flex flex-col gap-1">
                    {links.map(l => (
                        <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                            className="py-3 px-3 text-white/80 hover:text-amber-400 hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
                            {l.label}
                        </a>
                    ))}
                    <div className="mt-3 flex gap-3">
                        <a href="/login" className="flex-1 py-2.5 text-center text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors">Login</a>
                        <a href="/signup" className="flex-1 py-2.5 text-center text-sm font-bold text-slate-900 bg-amber-400 rounded-xl hover:bg-amber-300 transition-colors">Sign Up</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// ─── Hero Widget ──────────────────────────────────────────────────────────────
function HeroWidget() {
    const [activeTab, setActiveTab] = useState<Tab>("bus");
    const [tripType, setTripType] = useState<TripType>("one-way");
    const [hireType, setHireType] = useState<HireType>("bus");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [passengers, setPassengers] = useState(1);
    const [lrNumber, setLrNumber] = useState("");
    const [hireFrom, setHireFrom] = useState("");
    const [hireDate, setHireDate] = useState("");
    const [hirePhone, setHirePhone] = useState("");

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "bus", label: "Book Bus", icon: Bus },
        { id: "cargo", label: "Track Cargo", icon: Package },
        { id: "hire", label: "Hire Vehicle", icon: Car },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto lg:mx-0">
            {/* Tabs */}
            <div className="flex rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-1 mb-4 gap-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${active
                                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/40"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}>
                            <Icon size={15} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Body */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl">

                {/* BUS TAB */}
                {activeTab === "bus" && (
                    <div className="space-y-3.5">
                        <div className="flex gap-2">
                            {(["one-way", "round-trip"] as TripType[]).map(t => (
                                <button key={t} onClick={() => setTripType(t)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${tripType === t ? "bg-amber-400 text-slate-900" : "border border-white/20 text-white/50 hover:text-white hover:border-white/40"
                                        }`}>
                                    {t.replace("-", " ")}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <CitySelect value={from} onChange={setFrom} placeholder="From City" icon={MapPin} />
                            <button onClick={() => { setFrom(to); setTo(from); }}
                                className="w-9 h-9 flex items-center justify-center bg-amber-400/20 hover:bg-amber-400/40 border border-amber-400/40 rounded-xl text-amber-400 transition-all hover:scale-110 flex-shrink-0">
                                <ArrowLeftRight size={16} />
                            </button>
                            <CitySelect value={to} onChange={setTo} placeholder="To City" icon={MapPin} />
                        </div>

                        <div className={`grid gap-3 ${tripType === "round-trip" ? "grid-cols-3" : "grid-cols-2"}`}>
                            <div className="relative">
                                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none z-10" />
                                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 [color-scheme:dark]" />
                            </div>
                            {tripType === "round-trip" && (
                                <div className="relative">
                                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none z-10" />
                                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                                        min={date || new Date().toISOString().split("T")[0]}
                                        className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 [color-scheme:dark]" />
                                </div>
                            )}
                            <div className="relative">
                                <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                                <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                                    className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 appearance-none cursor-pointer">
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <option key={n} value={n} className="text-slate-800">{n} Passenger{n > 1 ? "s" : ""}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-black rounded-xl hover:from-amber-300 hover:to-amber-400 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide">
                            <Search size={17} /> Search Buses
                        </button>
                    </div>
                )}

                {/* CARGO TAB */}
                {activeTab === "cargo" && (
                    <div id="cargo" className="space-y-3.5">
                        <p className="text-white/60 text-xs">Enter your LR number to instantly track your shipment status</p>
                        <div className="grid grid-cols-2 gap-3">
                            <CitySelect value={from} onChange={setFrom} placeholder="Origin City" icon={MapPin} />
                            <CitySelect value={to} onChange={setTo} placeholder="Destination City" icon={MapPin} />
                        </div>
                        <div className="relative">
                            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                            <input type="text" value={lrNumber} onChange={e => setLrNumber(e.target.value)}
                                placeholder="LR Number (eg: 1/126)"
                                className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                        </div>
                        <div className="flex gap-5 text-sm text-white/60">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <input type="radio" name="otp-type" defaultChecked className="accent-amber-400" />
                                OTP to Sender
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <input type="radio" name="otp-type" className="accent-amber-400" />
                                OTP to Receiver
                            </label>
                        </div>
                        <button className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-black rounded-xl hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide">
                            <Truck size={17} /> Get OTP &amp; Track Cargo
                        </button>
                    </div>
                )}

                {/* HIRE TAB */}
                {activeTab === "hire" && (
                    <div id="hire" className="space-y-3.5">
                        <div className="flex gap-2">
                            {(["bus", "car"] as HireType[]).map(t => {
                                const Icon = t === "bus" ? Bus : Car;
                                return (
                                    <button key={t} onClick={() => setHireType(t)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${hireType === t ? "bg-amber-400 text-slate-900" : "border border-white/20 text-white/50 hover:text-white"
                                            }`}>
                                        <Icon size={16} /> Hire {t === "bus" ? "a Bus" : "a Car"}
                                    </button>
                                );
                            })}
                        </div>
                        <CitySelect value={hireFrom} onChange={setHireFrom} placeholder="Pickup Location" icon={MapPin} />
                        <div className="relative">
                            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                            <input type="date" value={hireDate} onChange={e => setHireDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 [color-scheme:dark]" />
                        </div>
                        <div className="relative">
                            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                            <input type="tel" value={hirePhone} onChange={e => setHirePhone(e.target.value)}
                                placeholder="Your Mobile Number"
                                className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60" />
                        </div>
                        <button className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-black rounded-xl hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide">
                            <Phone size={17} /> Request Callback
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Real hero image with multi-layer overlay for premium look */}
            <div className="absolute inset-0">
                <img
                    src="/images/hero-bus.jpg"
                    alt="DNR Express Bus"
                    className="w-full h-full object-cover object-center scale-105"
                    style={{ filter: "brightness(0.55) saturate(1.1)" }}
                />
                {/* Gradient overlays: left to right dark fade + bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
                {/* Warm bottom strip to blend into next section */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
            </div>

            {/* Animated noise texture overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-20">
                <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">

                    {/* Left: hero copy */}
                    <div className="space-y-5 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/15 border border-amber-400/30 rounded-full text-amber-400 text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                            Maharashtra's Premier Bus Network
                        </div>

                        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight">
                            Travel Smarter,<br />
                            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                Arrive Happier
                            </span>
                        </h1>

                        <p className="text-white/60 text-base lg:text-lg leading-relaxed">
                            Book bus tickets online, track your cargo in real-time, and hire vehicles — all on Maharashtra's most trusted travel platform.
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                            {[
                                { icon: Shield, text: "100% Secure Payments" },
                                { icon: Clock, text: "Real-Time GPS Tracking" },
                                { icon: Star, text: "4.8/5 Rated by Travelers" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm text-white/70">
                                    <Icon size={14} className="text-amber-400 flex-shrink-0" /> {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: booking widget */}
                    <div className="w-full lg:w-[500px]">
                        <HeroWidget />
                    </div>
                </div>

                {/* Stats strip */}
                <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STATS.map(({ value, label }) => (
                        <div key={label}
                            className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm hover:bg-white/10 hover:border-amber-400/20 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-2xl lg:text-3xl font-black text-amber-400 relative z-10">{value}</div>
                            <div className="text-white/50 text-xs mt-1 relative z-10">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Popular Routes ────────────────────────────────────────────────────────────
function PopularRoutes() {
    return (
        <section id="routes" className="py-20 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                        Popular Routes
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-white">
                        Maharashtra's Most Travelled{" "}
                        <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Bus Routes</span>
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm lg:text-base">
                        Daily departures, premium sleepers, and unbeatable fares on every major route.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {POPULAR_ROUTES.map((route, i) => (
                        <article key={i}
                            className="group relative bg-slate-900 border border-slate-800 hover:border-amber-400/30 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-400/10 cursor-pointer overflow-hidden">
                            {/* Glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                            {route.badge && (
                                <span className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wide">
                                    {route.badge}
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                                    <Bus size={18} className="text-amber-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                                        {route.from}
                                        <ArrowRight size={13} className="text-amber-400" />
                                        {route.to}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <Clock size={10} /> {route.duration}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <span className="text-xs text-slate-500">Starting from</span>
                                    <p className="text-xl font-black text-amber-400">₹{route.price}</p>
                                </div>
                                <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl group-hover:bg-amber-400 group-hover:border-amber-400 group-hover:text-slate-900 transition-all duration-200">
                                    Book Now <ChevronRight size={13} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <a href="/routes"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400/40 text-amber-400 font-bold rounded-xl hover:bg-amber-400 hover:text-slate-900 transition-all duration-200 text-sm">
                        View All 50+ Routes <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery() {
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goTo = useCallback((idx: number) => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setActive(idx);
            setAnimating(false);
        }, 300);
    }, [animating]);

    const next = useCallback(() => goTo((active + 1) % GALLERY_IMAGES.length), [active, goTo]);
    const prev = useCallback(() => goTo((active - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length), [active, goTo]);

    // Auto-play
    useEffect(() => {
        timerRef.current = setTimeout(next, 4000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [active, next]);

    return (
        <section id="gallery" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                        <Images size={12} /> Bus Gallery
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-white">
                        Meet Our{" "}
                        <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Premium Fleet</span>
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm lg:text-base">Modern, well-maintained buses for the most comfortable rides across Maharashtra.</p>
                </div>

                {/* Main slider */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/5 mb-5"
                    style={{ aspectRatio: "16/7" }}>
                    {GALLERY_IMAGES.map((img, i) => (
                        <div key={i}
                            className={`absolute inset-0 transition-all duration-500 ${i === active
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-[1.02] pointer-events-none"
                                } ${animating ? "opacity-0" : ""}`}>
                            <img src={img.src} alt={img.caption}
                                className="w-full h-full object-cover" />
                            {/* Caption overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <p className="text-white/80 text-sm font-medium">{img.caption}</p>
                            </div>
                        </div>
                    ))}

                    {/* Prev/Next buttons */}
                    <button onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white hover:bg-amber-400 hover:text-slate-900 hover:border-amber-400 transition-all duration-200 backdrop-blur-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white hover:bg-amber-400 hover:text-slate-900 hover:border-amber-400 transition-all duration-200 backdrop-blur-sm">
                        <ChevronRight size={20} />
                    </button>

                    {/* Slide counter */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-white/60 text-xs font-mono">
                        {active + 1} / {GALLERY_IMAGES.length}
                    </div>
                </div>

                {/* Thumbnail strip */}
                <div className="grid grid-cols-4 gap-3">
                    {GALLERY_IMAGES.map((img, i) => (
                        <button key={i} onClick={() => goTo(i)}
                            className={`relative rounded-xl overflow-hidden transition-all duration-200 ${i === active
                                    ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 opacity-100"
                                    : "opacity-50 hover:opacity-80"
                                }`}
                            style={{ aspectRatio: "16/9" }}>
                            <img src={img.src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-5">
                    {GALLERY_IMAGES.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)}
                            className={`transition-all duration-300 rounded-full ${i === active ? "bg-amber-400 w-6 h-2" : "bg-slate-700 hover:bg-slate-500 w-2 h-2"
                                }`} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Amenities ────────────────────────────────────────────────────────────────
function Amenities() {
    return (
        <section className="py-20 bg-slate-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            On-Board Experience
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                            Premium Amenities <br />
                            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Every Journey</span>
                        </h2>
                        <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8">
                            Every DNR Express bus is equipped with world-class amenities so you arrive refreshed, connected, and comfortable.
                        </p>
                        <div className="space-y-3">
                            {[
                                "Air-conditioned Sleeper & Seater buses",
                                "Real-time GPS-based bus location alerts",
                                "SMS notifications for arrival/departure",
                                "Dedicated customer support — 9 AM to 11 PM",
                            ].map(item => (
                                <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                                    <CheckCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {AMENITIES.map(({ icon: Icon, label }) => (
                            <div key={label}
                                className="group flex flex-col items-center gap-2 p-4 bg-slate-800/60 border border-slate-700 rounded-2xl hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-200 cursor-default">
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700 group-hover:bg-amber-400/20 transition-colors">
                                    <Icon size={20} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
                                </div>
                                <span className="text-slate-400 group-hover:text-amber-300 text-[10px] text-center leading-tight transition-colors">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
    return (
        <section className="py-20 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                        Passenger Reviews
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-white">
                        What Our Passengers{" "}
                        <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Say About Us</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i}
                            className="relative bg-slate-900 border border-slate-800 hover:border-amber-400/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-amber-400/5 transition-all duration-300 group">
                            <div className="absolute top-5 right-6 text-6xl text-slate-800 font-serif leading-none select-none group-hover:text-slate-700 transition-colors">"</div>
                            <StarRating rating={t.rating} />
                            <p className="mt-3 text-slate-400 text-sm leading-relaxed relative z-10">{t.text}</p>
                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-800">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 text-xs font-black">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{t.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} />{t.route}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust badges */}
                <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: CreditCard, label: "100% Secure Payments", sub: "UPI, Cards, Net Banking" },
                        { icon: Shield, label: "Instant Confirmation", sub: "E-ticket on your phone" },
                        { icon: Headphones, label: "24 × 7 Support", sub: "Call 8380000277" },
                        { icon: Navigation, label: "Live Bus Tracking", sub: "Know where your bus is" },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label}
                            className="flex flex-col items-center text-center gap-2 p-5 bg-slate-900 border border-slate-800 hover:border-amber-400/20 rounded-2xl transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                                <Icon size={18} className="text-amber-400" />
                            </div>
                            <p className="text-xs font-bold text-white">{label}</p>
                            <p className="text-[10px] text-slate-500">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── App Download ──────────────────────────────────────────────────────────────
function AppDownloadBanner() {
    return (
        <section className="py-16 relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-black/20 border border-black/10 text-slate-900/80 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            <Smartphone size={12} /> Mobile App
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-black text-slate-900 mb-3">
                            Book &amp; Track On The Go.<br />
                            <span className="text-white">Exclusive App Discounts.</span>
                        </h2>
                        <p className="text-slate-900/70 text-sm max-w-md mb-6">
                            Download the DNR Express app for faster booking, live bus tracking, and app-only offers on every route.
                        </p>

                        <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                            {[
                                { store: "Google Play", sub: "Get it on", bg: "#1a1a1a" },
                                { store: "App Store", sub: "Download on the", bg: "#1a1a1a" },
                            ].map(({ store, sub, bg }) => (
                                <a key={store} href="#"
                                    className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-black/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                                    style={{ background: bg }}>
                                    <div className="w-7 h-7 flex items-center justify-center">
                                        {store === "Google Play"
                                            ? <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-400 w-6 h-6"><path d="M3.18 23.76a2 2 0 0 1-.93-1.76V2a2 2 0 0 1 .93-1.76l.1-.06 12.04 12.04-.1.1L3.18 23.76zm14.63-8.46-2.49-1.44-2.63 2.63 2.63 2.63 2.49-1.44a1.42 1.42 0 0 0 0-2.38zM1.62.85l12.36 12.36-2.63 2.63L1.26 5.73A2 2 0 0 1 1.62.85zm12.36 10.74L1.62 23.15a2 2 0 0 1-.36-2.88l10.09-10.09 2.63 2.41z" /></svg>
                                            : <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-6 h-6"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                        }
                                    </div>
                                    <div className="text-left text-xs leading-tight">
                                        <div className="text-white/50">{sub}</div>
                                        <div className="text-white font-bold text-sm">{store}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Phone mockup */}
                    <div className="hidden lg:block">
                        <div className="w-44 h-80 bg-slate-950 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl shadow-black/50 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 flex items-center justify-center">
                                <div className="w-20 h-4 bg-slate-800 rounded-full" />
                            </div>
                            <div className="absolute inset-0 mt-7 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-start gap-3 p-4 pt-5">
                                <div className="bg-white rounded-xl px-2 py-1.5 w-full flex justify-center">
                                    <img src="/images/logo.jpg" alt="DNR Express" className="h-6 object-contain" />
                                </div>
                                <div className="w-full space-y-2">
                                    {["Chandrapur → Pune", "Nagpur → Mumbai", "Aurangabad → Pune"].map(r => (
                                        <div key={r} className="bg-slate-800 rounded-xl px-3 py-2 flex justify-between items-center">
                                            <span className="text-white/70 text-[9px]">{r}</span>
                                            <span className="text-amber-400 text-[9px] font-bold">Book</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full bg-amber-400 rounded-xl py-2 text-center text-slate-900 text-[10px] font-black">
                                    Search Buses
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer id="contact" className="bg-[#050a14] text-slate-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <div className="bg-white rounded-xl px-4 py-2 inline-flex mb-5">
                            <img src="/images/logo.jpg" alt="DNR Express" className="h-8 object-contain" />
                        </div>
                        <p className="text-xs leading-relaxed mb-5 text-slate-500">
                            Maharashtra's trusted bus service since 2008. Connecting Mumbai, Pune, Nagpur, Chandrapur, Aurangabad and beyond with comfort and reliability.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#"
                                    className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-amber-400 hover:text-slate-900 transition-all">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-sm font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2.5 text-xs">
                            {["Home", "About Us", "View Booking", "Cancellation", "Terms & Conditions", "Feedback", "Gallery", "Routes", "Privacy Policy"].map(l => (
                                <li key={l}>
                                    <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                                        <ChevronRight size={11} className="text-amber-400/40" /> {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Routes */}
                    <div>
                        <h3 className="text-white text-sm font-bold mb-4">Popular Routes</h3>
                        <ul className="space-y-2.5 text-xs">
                            {["Chandrapur → Pune", "Chandrapur → Mumbai", "Chandrapur → Nagpur", "Nagpur → Jalna", "Nagpur → Aurangabad", "Pune → Mumbai", "Mumbai → Chandrapur"].map(r => (
                                <li key={r}>
                                    <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                                        <Bus size={10} className="text-amber-400/40 flex-shrink-0" /> {r}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-sm font-bold mb-4">Contact Us</h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex gap-2.5">
                                <MapPin size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                <p>Opp. PWD Office, Sanjay Gandhi Market, Near Pani Ki Tanki, Nagpur Road, Chandrapur – 442401</p>
                            </div>
                            <a href="tel:8380000277" className="flex items-center gap-2.5 hover:text-amber-400 transition-colors">
                                <Phone size={13} className="text-amber-400" /> 8380000277 / 8380000277
                            </a>
                            <a href="mailto:info@dnrexpress.in" className="flex items-center gap-2.5 hover:text-amber-400 transition-colors">
                                <Mail size={13} className="text-amber-400" /> info@dnrexpress.in
                            </a>
                            <div className="flex items-center gap-2.5">
                                <Clock size={13} className="text-amber-400" /> Mon–Sun: 9:00 AM – 11:00 PM
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
                    <p>© {new Date().getFullYear()} DNR Express. All rights reserved.</p>
                    <p>Made with ❤ for Maharashtra travelers</p>
                </div>
            </div>
        </footer>
    );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <div className="font-sans antialiased bg-slate-950">
            <Navbar />
            <HeroSection />
            <PopularRoutes />
            <Gallery />
            <Amenities />
            <Testimonials />
            <AppDownloadBanner />
            <Footer />
        </div>
    );
}
