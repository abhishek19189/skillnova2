import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, LayoutDashboard, GraduationCap, Search, LogOut, Plus, Trash2,
  PlayCircle, Users, ChartNoAxesColumnIncreasing, Leaf, Menu, X, CheckCircle2,
  ArrowRight, Sparkles, ShieldCheck, Clock3, Star, CircleUserRound, LockKeyhole
} from "lucide-react";
import "./styles.css";

const STARTER_COURSES = [
  { id: "c1", title: "UI/UX Design Essentials", category: "Design", level: "Beginner", price: 799, lessons: 24, icon: "🎨", color: "peach", description: "Design intuitive, beautiful digital experiences.", progress: 65 },
  { id: "c2", title: "Modern Web Development", category: "Development", level: "Intermediate", price: 1299, lessons: 36, icon: "💻", color: "mint", description: "Build responsive websites from scratch.", progress: 38 },
  { id: "c3", title: "Digital Marketing Mastery", category: "Marketing", level: "Beginner", price: 899, lessons: 28, icon: "📈", color: "yellow", description: "Grow brands with smarter digital strategy.", progress: 82 },
  { id: "c4", title: "Data Analytics with Python", category: "Data", level: "Intermediate", price: 1499, lessons: 32, icon: "📊", color: "sage", description: "Turn real-world data into useful insights.", progress: 20 },
  { id: "c5", title: "Creative Content Studio", category: "Design", level: "Beginner", price: 699, lessons: 18, icon: "✍️", color: "pink", description: "Make content people remember and share.", progress: 0 },
  { id: "c6", title: "Business & Entrepreneurship", category: "Business", level: "Beginner", price: 999, lessons: 22, icon: "🚀", color: "teal", description: "Turn an idea into a sustainable business.", progress: 0 },
];
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const reviews = [
  { name: "Aarav S.", role: "UI designer", text: "The bite-sized lessons helped me practise new design skills without feeling overwhelmed.", initials: "A" },
  { name: "Meera K.", role: "Marketing learner", text: "I finally have a clear learning path. The practical projects make a real difference.", initials: "M" },
  { name: "Rohan P.", role: "Web developer", text: "A lovely way to learn consistently and track the skills I am building.", initials: "R" },
];

function App() {
  const [courses, setCourses] = useState(() => read("sn_courses", STARTER_COURSES));
  const [enrollments, setEnrollments] = useState(() => {
    const saved = read("sn_enrollments", {});
    const migrated = { ...saved };
    if (!migrated["student@gmail.com"] && migrated["student@skillnova.demo"]) migrated["student@gmail.com"] = migrated["student@skillnova.demo"];
    if (!migrated["student@gmail.com"]) migrated["student@gmail.com"] = ["c1", "c2", "c3", "c4"];
    return migrated;
  });
  const [progress, setProgress] = useState(() => {
    const saved = read("sn_progress", {});
    const migrated = { ...saved };
    if (!migrated["student@gmail.com"] && migrated["student@skillnova.demo"]) migrated["student@gmail.com"] = migrated["student@skillnova.demo"];
    if (!migrated["student@gmail.com"]) migrated["student@gmail.com"] = { c1: 65, c2: 38, c3: 82, c4: 20 };
    return migrated;
  });
  const [users, setUsers] = useState(() => {
    const saved = read("sn_users", []);
    const reservedDemoEmails = ["admin@skillnova.demo", "student@skillnova.demo", "admin@gmail.com", "student@gmail.com"];
    const otherUsers = Array.isArray(saved) ? saved.filter(u => !reservedDemoEmails.includes((u.email || "").toLowerCase())) : [];
    return [
      ...otherUsers,
      { name: "Admin", email: "admin@gmail.com", password: "123456", role: "admin" },
      { name: "Student", email: "student@gmail.com", password: "123456", role: "student" },
    ];
  });
  const [session, setSession] = useState(() => {
    const saved = read("sn_session", null);
    if (!saved) return null;
    if (saved.email === "admin@skillnova.demo" || saved.email === "student@skillnova.demo") return null;
    return saved;
  });
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [loginMode, setLoginMode] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const [newCourse, setNewCourse] = useState({ title: "", category: "Development", level: "Beginner", price: "499", lessons: "12", description: "" });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "student" });

  useEffect(() => localStorage.setItem("sn_courses", JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem("sn_enrollments", JSON.stringify(enrollments)), [enrollments]);
  useEffect(() => localStorage.setItem("sn_progress", JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem("sn_users", JSON.stringify(users)), [users]);
  useEffect(() => { if (session) localStorage.setItem("sn_session", JSON.stringify(session)); else localStorage.removeItem("sn_session"); }, [session]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  const isAdmin = session?.role === "admin";
  const enrolledIds = session ? (enrollments[session.email] || []) : [];
  const myCourses = courses.filter(c => enrolledIds.includes(c.id));
  const myProgress = progress[session?.email] || {};
  const average = myCourses.length ? Math.round(myCourses.reduce((sum, c) => sum + (myProgress[c.id] || 0), 0) / myCourses.length) : 0;
  const filteredCourses = useMemo(() => courses.filter(c =>
    (category === "All" || c.category === category) &&
    (level === "All" || c.level === level) &&
    `${c.title} ${c.category} ${c.description}`.toLowerCase().includes(search.toLowerCase())
  ), [courses, category, level, search]);

  function signIn(e) {
    e.preventDefault(); setLoginError("");
    const email = authForm.email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === email && u.password === authForm.password);
    if (!user) { setLoginError("Email ya password sahi nahi hai. Demo credentials try karo."); return; }
    setSession({ name: user.name, email: user.email, role: user.role });
    setPage(user.role === "admin" ? "admin" : "student");
    setNotice(`Welcome, ${user.name}!`);
  }
  function signUp(e) {
    e.preventDefault(); setLoginError("");
    const email = authForm.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === email)) { setLoginError("Is email se account pehle se hai."); return; }
    if (authForm.password.length < 6) { setLoginError("Password kam se kam 6 characters ka hona chahiye."); return; }
    // Public signups are always students. Admin accounts must be provisioned by a trusted backend.
    const user = { name: authForm.name.trim() || "Student", email, password: authForm.password, role: "student" };
    const nextUsers = [...users, user]; setUsers(nextUsers);
    setEnrollments(prev => ({ ...prev, [email]: [] }));
    setSession({ name: user.name, email: user.email, role: "student" });
    setPage("student"); setNotice("Account created! Welcome to SkillNova.");
  }
  function logout() { setSession(null); setPage("home"); setNotice("You have logged out."); setAuthForm({ name: "", email: "", password: "", role: "student" }); }
  function go(next) { setPage(next); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function enroll(course) {
    if (!session) { setPage("auth"); setLoginMode("login"); setNotice("Login to enrol in a course."); return; }
    if (isAdmin) { setNotice("Student account se course enrolment try karein."); return; }
    if (enrolledIds.includes(course.id)) { go("lesson:" + course.id); return; }
    setEnrollments(prev => ({ ...prev, [session.email]: [...(prev[session.email] || []), course.id] }));
    setProgress(prev => ({ ...prev, [session.email]: { ...(prev[session.email] || {}), [course.id]: 0 } }));
    setNotice("Course enrolled successfully!");
    go("student");
  }
  function addCourse(e) {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) return setNotice("Course title aur description fill karo.");
    const c = { ...newCourse, id: "c" + Date.now(), price: Number(newCourse.price), lessons: Number(newCourse.lessons), icon: ({ Design: "🎨", Development: "💻", Marketing: "📈", Data: "📊", Business: "🚀", Photography: "📷", Finance: "💰" })[newCourse.category] || "🌱", color: ["mint", "peach", "yellow", "teal", "pink"][courses.length % 5], progress: 0 };
    setCourses(prev => [c, ...prev]); setNewCourse({ title: "", category: "Development", level: "Beginner", price: "499", lessons: "12", description: "" }); setNotice("Course added!");
  }
  function deleteCourse(id) {
    setCourses(prev => prev.filter(c => c.id !== id));
    setEnrollments(prev => Object.fromEntries(Object.entries(prev).map(([email, ids]) => [email, ids.filter(x => x !== id)])));
    setNotice("Course deleted.");
  }
  function advanceProgress(course) {
    const current = myProgress[course.id] || 0;
    const next = Math.min(100, current + 10);
    setProgress(prev => ({ ...prev, [session.email]: { ...(prev[session.email] || {}), [course.id]: next } }));
    setNotice(next === 100 ? "Course complete! Great work 🎉" : "Lesson completed — progress saved.");
  }

  const navItems = isAdmin
    ? [{ id: "admin", label: "Dashboard", icon: LayoutDashboard }, { id: "manage", label: "Manage courses", icon: BookOpen }, { id: "users", label: "Users", icon: Users }, { id: "sales", label: "Sales analytics", icon: ChartNoAxesColumnIncreasing }]
    : [{ id: "home", label: "Home", icon: LayoutDashboard }, { id: "courses", label: "Explore courses", icon: BookOpen }, ...(session ? [{ id: "student", label: "My learning", icon: GraduationCap }] : []), { id: "pricing", label: "Pricing", icon: Sparkles }, { id: "testimonials", label: "Learner stories", icon: Star }];

  function Header() {
    return <header className="topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">{mobileNav ? <X /> : <Menu />}</button><div className="top-title">{page.startsWith("lesson:") ? "Lesson player" : page === "auth" ? "Welcome to SkillNova" : ({ home: "Your learning space", courses: "Explore the library", student: "My learning journey", pricing: "Plans that fit you", testimonials: "Learner stories", admin: "Admin dashboard", manage: "Course management", users: "User management", sales: "Sales analytics" })[page] || "SkillNova"}</div><div className="top-right">{session ? <><span className="user-name">{session.name} · {isAdmin ? "Admin" : "Student"}</span><span className="avatar">{(session.name || "S")[0].toUpperCase()}</span><button className="btn btn-outline btn-small" onClick={logout}><LogOut size={15} /> Logout</button></> : <button className="btn btn-primary btn-small" onClick={() => { setPage("auth"); setLoginMode("login"); }}>Login / Sign up</button>}</div></header>;
  }

  function Sidebar() {
    return <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}><button className="brand" onClick={() => go(session ? (isAdmin ? "admin" : "student") : "home")}><span className="brand-mark">✳</span><span>Skill<span className="brand-accent">Nova</span></span></button><div className="nav-caption">{isAdmin ? "ADMIN WORKSPACE" : "LEARN & GROW"}</div>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => go(item.id)}><Icon size={18} />{item.label}</button>; })}<div className="sidebar-bottom"><div className="leaf-circle"><Leaf size={19} /></div><b>Small steps. Big skills.</b><p>Build your future, one lesson at a time.</p></div></aside>;
  }

  function CourseCard({ course, enrolled = false, admin = false }) {
    const Icon = enrolled ? PlayCircle : ArrowRight;
    return <article className="course-card"><div className={`course-cover cover-${course.color || "mint"}`}><span className="course-emoji">{course.icon}</span><span className="level-pill">{course.level}</span></div><div className="course-info"><span className="category-pill">{course.category}</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span><BookOpen size={14} /> {course.lessons} lessons</span><span>{money(course.price)}</span></div>{enrolled && <div className="progress-area"><div className="progress-label"><span>Course progress</span><b>{myProgress[course.id] || 0}%</b></div><div className="progress-track"><span style={{ width: `${myProgress[course.id] || 0}%` }} /></div></div>}<div className="course-actions">{admin ? <button className="btn btn-danger btn-small" onClick={() => deleteCourse(course.id)}><Trash2 size={14} /> Delete</button> : <button className={`btn ${enrolled ? "btn-outline" : "btn-primary"} btn-small`} onClick={() => enrolled ? go("lesson:" + course.id) : enroll(course)}>{enrolled ? <><Icon size={14} /> Continue</> : <>View course <Icon size={14} /></>}</button>}</div></div></article>;
  }

  function Footer() { return <footer className="footer"><span>© 2026 SkillNova · Learn with curiosity 🌱</span><span>Learn. Create. Grow.</span></footer>; }
  function Home() {
    return <><section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> A little progress, every day</div><h1>Learn something that changes <span>everything.</span></h1><p>Discover your next skill, follow your curiosity, and turn what you learn into what you can do.</p><div className="hero-actions"><button className="btn btn-primary" onClick={() => go("courses")}>Explore courses <ArrowRight size={16} /></button><button className="btn btn-outline" onClick={() => go(session ? "student" : "auth")}>{session ? "My learning" : "Join SkillNova"}</button></div><div className="hero-proof"><div className="proof-avatars"><span>A</span><span>M</span><span>R</span></div><span><b>Learn at your pace</b><br /><small>Build skills, one lesson at a time</small></span></div></div><div className="hero-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-plant">🌱</div><div className="floating-note note-top"><Sparkles size={16} /> Your next chapter</div><div className="floating-note note-bottom"><CheckCircle2 size={16} /> Progress feels good</div></div></section><div className="stat-grid"><Stat icon={BookOpen} label="Courses to explore" value={courses.length} /><Stat icon={GraduationCap} label="My enrolled courses" value={enrolledIds.length} /><Stat icon={ChartNoAxesColumnIncreasing} label="Average progress" value={`${average}%`} /><Stat icon={Star} label="Made for curious minds" value="∞" /></div><SectionTitle title="Popular courses" subtitle="A few good places to start" action="Browse all courses" onAction={() => go("courses")} /><div className="course-grid">{courses.slice(0, 3).map(c => <CourseCard key={c.id} course={c} enrolled={enrolledIds.includes(c.id)} />)}</div><SectionTitle title="A little love from learners" subtitle="The journey is better together" action="Read stories" onAction={() => go("testimonials")} /><div className="review-grid">{reviews.map(r => <ReviewCard key={r.name} review={r} />)}</div><Footer /></>;
  }
  function Stat({ icon: Icon, label, value }) { return <div className="stat-card"><div className="stat-icon"><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div>; }
  function SectionTitle({ title, subtitle, action, onAction }) { return <div className="section-heading"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button className="text-link" onClick={onAction}>{action} <ArrowRight size={15} /></button>}</div>; }
  function ReviewCard({ review }) { return <article className="review-card"><div className="stars">★★★★★</div><p>“{review.text}”</p><div className="review-person"><span className="review-avatar">{review.initials}</span><span><b>{review.name}</b><small>{review.role}</small></span></div></article>; }

  function Courses() {
    const categories = ["All", ...new Set(courses.map(c => c.category))];
    return <><div className="eyebrow">THE COURSE LIBRARY</div><h1 className="page-heading">Find your next <span>big thing.</span></h1><p className="page-subtitle">Follow your curiosity. Build skills that go places.</p><div className="course-toolbar"><label className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or skills..." /></label><select className="select-field" value={level} onChange={e => setLevel(e.target.value)}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div><div className="category-row">{categories.map(c => <button key={c} className={`category-filter ${category === c ? "selected" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div><p className="results-count">{filteredCourses.length} courses to explore</p><div className="course-grid">{filteredCourses.map(c => <CourseCard key={c.id} course={c} enrolled={enrolledIds.includes(c.id)} />)}</div>{!filteredCourses.length && <Empty title="No courses found" text="Try another search or category." />}<Footer /></>;
  }

  function StudentDashboard() {
    return <><div className="eyebrow">YOUR PERSONAL LEARNING SPACE</div><h1 className="page-heading">Every lesson counts. <span>🌱</span></h1><p className="page-subtitle">Welcome back, {session?.name}. Keep showing up for yourself.</p><div className="stat-grid"><Stat icon={BookOpen} label="Enrolled courses" value={myCourses.length} /><Stat icon={ChartNoAxesColumnIncreasing} label="Average progress" value={`${average}%`} /><Stat icon={CheckCircle2} label="Completed courses" value={myCourses.filter(c => (myProgress[c.id] || 0) === 100).length} /><Stat icon={Clock3} label="Ready for your next lesson" value="Let's go" /></div><SectionTitle title="My courses" subtitle="Continue where you left off" action="Find a course" onAction={() => go("courses")} /><div className="course-grid">{myCourses.map(c => <CourseCard key={c.id} course={c} enrolled />)}</div>{!myCourses.length && <Empty title="Your learning journey starts here" text="Explore the library and enrol in your first course." action="Explore courses" onAction={() => go("courses")} />}<Footer /></>;
  }

  function LessonPage() {
    const id = page.split(":")[1]; const course = courses.find(c => c.id === id);
    if (!course || !enrolledIds.includes(course.id)) return <Empty title="Course not available" text="Enrol in a course to access its lessons." action="Browse courses" onAction={() => go("courses")} />;
    const pct = myProgress[course.id] || 0;
    return <><button className="back-link" onClick={() => go("student")}>← Back to my learning</button><div className="lesson-layout"><div><div className={`lesson-player cover-${course.color}`}><div className="play-button"><PlayCircle size={54} /></div><span>COURSE LESSON PREVIEW</span></div><div className="lesson-details"><div className="eyebrow">{course.category} · {course.level}</div><h1 className="page-heading">{course.title}</h1><p className="page-subtitle">{course.description}</p><div className="progress-label"><span>Your progress</span><b>{pct}%</b></div><div className="progress-track"><span style={{ width: `${pct}%` }} /></div><button className="btn btn-primary" onClick={() => advanceProgress(course)}>{pct >= 100 ? "Completed ✓" : "Mark next lesson complete"} <ArrowRight size={16} /></button><p className="helper-text">Demo lesson player: video files are not connected yet. This button simulates completing a lesson and saves progress in this browser.</p></div></div><aside className="lesson-sidebar panel"><h3>Course contents</h3>{Array.from({ length: Math.min(course.lessons, 8) }, (_, i) => <div className="lesson-item" key={i}><span className={`lesson-check ${i < Math.floor(pct / 12.5) ? "done" : ""}`}>{i < Math.floor(pct / 12.5) ? "✓" : i + 1}</span><span>Lesson {i + 1}<small>{i === 0 ? "Introduction" : ["Core concepts", "Practice session", "Build a project", "Review & recap"][i % 4]}</small></span><PlayCircle size={16} /></div>)}<p className="helper-text">Showing a sample lesson outline.</p></aside></div><Footer /></>;
  }

  function Pricing() {
    const plans = [{ name: "Starter", price: "₹0", desc: "A no-pressure way to begin.", perks: ["Explore the course library", "Track learning progress", "Sample learning content"] }, { name: "Growth", price: "₹499", desc: "For curious minds ready to grow.", perks: ["Selected course access", "Guided learning paths", "Progress tracking", "Practical projects"], featured: true }, { name: "Pro", price: "₹999", desc: "For ambitious lifelong learners.", perks: ["All listed course categories", "Advanced learning paths", "Project-based practice", "Priority learning resources"] }];
    return <><div className="eyebrow">SIMPLE LEARNING PLANS</div><h1 className="page-heading">Invest in your <span>next chapter.</span></h1><p className="page-subtitle">Start small, explore freely, and choose what works for you.</p><div className="pricing-grid">{plans.map(p => <article key={p.name} className={`pricing-card ${p.featured ? "featured" : ""}`}>{p.featured && <span className="popular-label">✦ MOST POPULAR</span>}<span className="plan-name">{p.name}</span><div className="price">{p.price}<small>{p.price !== "₹0" && " / month"}</small></div><p>{p.desc}</p><ul>{p.perks.map(perk => <li key={perk}><CheckCircle2 size={16} />{perk}</li>)}</ul><button className={`btn ${p.featured ? "btn-primary" : "btn-outline"}`} onClick={() => setNotice(`${p.name} plan selected. Demo only — payment is not connected.`)}>{p.price === "₹0" ? "Get started" : "Choose " + p.name}</button></article>)}</div><p className="helper-text">Demo pricing only. No payment is collected and no subscription is activated.</p><Footer /></>;
  }
  function Testimonials() { return <><div className="eyebrow">REAL PROGRESS, ONE STORY AT A TIME</div><h1 className="page-heading">Made for people who <span>keep growing.</span></h1><p className="page-subtitle">A little encouragement goes a long way.</p><div className="review-grid large-reviews">{reviews.map(r => <ReviewCard key={r.name} review={r} />)}</div><div className="callout"><div className="eyebrow">YOUR STORY STARTS HERE</div><h2>What's one thing you'd love to learn?</h2><p>Explore courses, try a new topic, and celebrate each little win.</p><button className="btn btn-primary" onClick={() => go("courses")}>Find your next skill <ArrowRight size={16} /></button></div><p className="helper-text">These testimonials are illustrative sample content for this demo.</p><Footer /></>; }

  function Auth() {
    return <div className="auth-wrap"><div className="auth-art"><div className="auth-art-mark">✳</div><div className="eyebrow">WELCOME TO SKILLNOVA</div><h2>Grow into who<br />you want to be.</h2><p>Great things start with a single lesson. Let's make yours count.</p><div className="auth-art-leaf">🌿</div></div><div className="auth-panel"><div className="eyebrow">{loginMode === "login" ? "WELCOME BACK" : "YOUR JOURNEY STARTS HERE"}</div><h1>{loginMode === "login" ? "Sign in" : "Create account"}</h1><p className="page-subtitle">{loginMode === "login" ? "Pick up where you left off." : "Create a student account to get started."}</p><form onSubmit={loginMode === "login" ? signIn : signUp} className="auth-form">{loginMode === "signup" && <label>Full name<input required autoComplete="name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Your name" /></label>}<label>Email address<input required type="email" autoComplete="email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input required type="password" autoComplete={loginMode === "login" ? "current-password" : "new-password"} value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} placeholder="At least 6 characters" minLength={6} /></label>{loginError && <div className="form-error">{loginError}</div>}<button className="btn btn-primary auth-submit" type="submit">{loginMode === "login" ? "Sign in to SkillNova" : "Create student account"} <ArrowRight size={16} /></button></form><p className="auth-switch">{loginMode === "login" ? "New to SkillNova?" : "Already have an account?"} <button onClick={() => { setLoginMode(loginMode === "login" ? "signup" : "login"); setLoginError(""); }}>{loginMode === "login" ? "Create account" : "Sign in"}</button></p><div className="demo-credentials"><b><ShieldCheck size={15} /> Test login accounts</b><p><b>Admin:</b> admin@gmail.com · admin123</p><p><b>Student:</b> student@gmail.com · student123</p><button className="btn btn-outline btn-small" onClick={() => setAuthForm({ ...authForm, email: "admin@gmail.com", password: "admin123" })}>Fill admin login</button> <button className="btn btn-outline btn-small" onClick={() => setAuthForm({ ...authForm, email: "student@gmail.com", password: "student123" })}>Fill student login</button></div><p className="security-note"><LockKeyhole size={14} /> Demo authentication only. Do not use real passwords until a secure backend is connected.</p></div></div>;
  }

  function AdminDashboard() {
    const categories = new Set(courses.map(c => c.category)).size;
    return <><div className="eyebrow">ADMIN WORKSPACE</div><h1 className="page-heading">Your learning <span>studio.</span></h1><p className="page-subtitle">Manage your course catalogue and keep your learning platform organised.</p><div className="admin-notice"><ShieldCheck size={18} /><span><b>Demo admin mode</b><br />Course changes are saved in this browser only. Connect a secure backend before publishing.</span></div><div className="stat-grid"><Stat icon={BookOpen} label="Total courses" value={courses.length} /><Stat icon={Users} label="Registered demo users" value={users.length} /><Stat icon={Sparkles} label="Categories" value={categories} /><Stat icon={ChartNoAxesColumnIncreasing} label="Enrolments" value={Object.values(enrollments).reduce((sum, ids) => sum + ids.length, 0)} /></div><div className="admin-columns"><section className="panel"><div className="section-heading compact"><div><h2>Add a course</h2><p>Publish a new course card to the catalogue.</p></div></div><form className="admin-form" onSubmit={addCourse}><label>Course title<input required maxLength={80} value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="e.g. React for Beginners" /></label><label>Description<input required maxLength={150} value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="What will students learn?" /></label><div className="form-two"><label>Category<select value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}>{["Design", "Development", "Marketing", "Data", "Business", "Photography", "Finance"].map(c => <option key={c}>{c}</option>)}</select></label><label>Level<select value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>{["Beginner", "Intermediate", "Advanced"].map(c => <option key={c}>{c}</option>)}</select></label></div><div className="form-two"><label>Price (₹)<input required type="number" min="0" value={newCourse.price} onChange={e => setNewCourse({ ...newCourse, price: e.target.value })} /></label><label>Lessons<input required type="number" min="1" value={newCourse.lessons} onChange={e => setNewCourse({ ...newCourse, lessons: e.target.value })} /></label></div><button className="btn btn-primary" type="submit"><Plus size={16} /> Add course</button></form></section><section className="panel"><div className="section-heading compact"><div><h2>Quick overview</h2><p>At a glance</p></div></div><div className="overview-row"><span>Courses listed</span><b>{courses.length}</b></div><div className="overview-row"><span>Registered accounts</span><b>{users.length}</b></div><div className="overview-row"><span>Course categories</span><b>{categories}</b></div><div className="overview-row"><span>Course enrolments</span><b>{Object.values(enrollments).reduce((sum, ids) => sum + ids.length, 0)}</b></div><button className="btn btn-outline full-width" onClick={() => go("manage")}>Manage all courses <ArrowRight size={15} /></button></section></div><Footer /></>;
  }

  function ManageCourses() { return <><div className="eyebrow">CATALOGUE CONTROL</div><h1 className="page-heading">Manage <span>courses.</span></h1><p className="page-subtitle">Add courses in Admin Dashboard or remove courses here.</p><div className="admin-course-grid">{courses.map(c => <CourseCard key={c.id} course={c} admin />)}</div>{!courses.length && <Empty title="No courses yet" text="Add your first course in the admin dashboard." action="Go to dashboard" onAction={() => go("admin")} />}<Footer /></>; }

  function UserManagement() { return <><div className="eyebrow">ACCOUNT DIRECTORY</div><h1 className="page-heading">User <span>management.</span></h1><p className="page-subtitle">Demo accounts created in this browser.</p><div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Enrolled</th></tr></thead><tbody>{users.map(u => <tr key={u.email}><td><b>{u.name}</b></td><td>{u.email}</td><td><span className={`role-badge ${u.role}`}>{u.role}</span></td><td>{(enrollments[u.email] || []).length}</td></tr>)}</tbody></table></div></div><div className="admin-notice"><LockKeyhole size={18} /><span>For security, this demo does not allow role changes from the browser. Real role management belongs on a protected backend.</span></div><Footer /></>; }

  function SalesAnalytics() { const total = Object.values(enrollments).reduce((sum, ids) => sum + ids.reduce((sub, id) => sub + (courses.find(c => c.id === id)?.price || 0), 0), 0); return <><div className="eyebrow">PLATFORM PERFORMANCE</div><h1 className="page-heading">Sales & <span>analytics.</span></h1><p className="page-subtitle">Illustrative figures from demo enrolments, not real payments.</p><div className="stat-grid"><Stat icon={Users} label="Registered users" value={users.length} /><Stat icon={BookOpen} label="Enrolments" value={Object.values(enrollments).reduce((s, a) => s + a.length, 0)} /><Stat icon={ChartNoAxesColumnIncreasing} label="Course list value" value={money(total)} /><Stat icon={Star} label="Course catalogue" value={courses.length} /></div><div className="panel"><h2>Course interest</h2><p className="page-subtitle">Enrolments by course · demo data</p>{courses.map(c => { const count = Object.values(enrollments).filter(ids => ids.includes(c.id)).length; return <div className="analytics-row" key={c.id}><div className="analytics-label"><span>{c.icon} {c.title}</span><b>{count}</b></div><div className="progress-track"><span style={{ width: `${Math.min(100, count * 25)}%` }} /></div></div>; })}</div><div className="admin-notice"><ChartNoAxesColumnIncreasing size={18} /><span>Real-time sales analytics require a payment provider webhook and server-side database. No sales or revenue are recorded by this demo.</span></div><Footer /></>; }

  function Empty({ title, text, action, onAction }) { return <div className="empty-state"><div className="empty-icon"><Leaf size={24} /></div><h2>{title}</h2><p>{text}</p>{action && <button className="btn btn-primary" onClick={onAction}>{action}</button>}</div>; }

  let view;
  if (page === "auth") view = Auth();
  else if (page === "home") view = <Home />;
  else if (page === "courses") view = <Courses />;
  else if (page === "student") view = session && !isAdmin ? <StudentDashboard /> : <Empty title="Student dashboard" text="Sign in with a student account to view your learning progress." action="Go to login" onAction={() => go("auth")} />;
  else if (page === "pricing") view = <Pricing />;
  else if (page === "testimonials") view = <Testimonials />;
  else if (page === "admin") view = isAdmin ? <AdminDashboard /> : <Empty title="Admin access required" text="Please sign in with the demo admin account to open this dashboard." action="Admin login" onAction={() => { setPage("auth"); setAuthForm({ ...authForm, email: "admin@gmail.com", password: "admin123" }); }} />;
  else if (page === "manage") view = isAdmin ? <ManageCourses /> : <Empty title="Admin access required" text="Sign in as admin to manage courses." action="Admin login" onAction={() => go("auth")} />;
  else if (page === "users") view = isAdmin ? <UserManagement /> : <Empty title="Admin access required" text="Sign in as admin to manage users." action="Admin login" onAction={() => go("auth")} />;
  else if (page === "sales") view = isAdmin ? <SalesAnalytics /> : <Empty title="Admin access required" text="Sign in as admin to view analytics." action="Admin login" onAction={() => go("auth")} />;
  else if (page.startsWith("lesson:")) view = session && !isAdmin ? <LessonPage /> : <Empty title="Student login required" text="Sign in as a student to view lessons." action="Student login" onAction={() => go("auth")} />;
  else view = <Home />;

  return <div className="app-shell"><Sidebar /><div className="main-area"><Header /><main className="main-content">{view}</main></div>{mobileNav && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}{notice && <div className="toast"><CheckCircle2 size={18} />{notice}</div>}</div>;
}

createRoot(document.getElementById("root")).render(<App />);
