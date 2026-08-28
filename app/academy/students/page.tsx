"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  ArrowUpRight,
  MapPin,
  MessageSquare,
  Lock,
  Unlock,
  EyeOff,
  KeyRound,
  X,
  Search,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { academyData } from "@/data/academy";

const ADMIN_SECRET_PIN = "8131";

export default function StudentsListPage() {
  const { students, courses } = academyData;

  // Admin authentication states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState<
    "roll" | "attendance-desc" | "attendance-asc" | "location"
  >("roll");

  useEffect(() => {
    const savedAdminStatus = sessionStorage.getItem("academy_admin_unlocked");
    if (savedAdminStatus === "true") {
      setIsAdminUnlocked(true);
    }
  }, []);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === ADMIN_SECRET_PIN) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setShowAdminModal(false);
      setEnteredPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem("academy_admin_unlocked");
  };

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 8) return "••••••••••";
    const start = phone.slice(0, 5);
    const end = phone.slice(-3);
    return `${start} •••• ${end}`;
  };

  // Clean phone number for exact comparison and search
  const cleanPhone = (phone: string) =>
    phone ? phone.replace(/[^0-9]/g, "") : "";

  // 1. Detect duplicate phone numbers across the student list
  const duplicatePhoneNumbers = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const clean = cleanPhone(s.whatsapp);
      if (clean) {
        counts[clean] = (counts[clean] || 0) + 1;
      }
    });
    return new Set(Object.keys(counts).filter((p) => counts[p] > 1));
  }, [students]);

  // 2. Extract unique locations for filtering
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    students.forEach((s) => {
      if (s.location) locs.add(s.location.trim());
    });
    return Array.from(locs).sort();
  }, [students]);

  // 3. Dynamic Attendance Calculation Helper
  const getStudentStats = (
    rollNumber: string | number,
    enrolledCourseIds: string[],
  ) => {
    let totalHeld = 0;
    let totalAttended = 0;
    const targetRoll = String(rollNumber).trim();

    courses.forEach((course) => {
      if (enrolledCourseIds.includes(course.courseId)) {
        const classes = course.classes ?? [];
        totalHeld += classes.length;
        totalAttended += classes.filter((cls) =>
          cls.presentStudents?.some((r) => String(r).trim() === targetRoll),
        ).length;
      }
    });

    const numericRate = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 100;
    const attendanceRate = `${numericRate.toFixed(0)}%`;

    return { totalHeld, totalAttended, attendanceRate, numericRate };
  };

  // 4. Combined Filter, Search & Sort Logic
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const queryDigits = cleanPhone(searchQuery);

    return students
      .filter((student) => {
        const nameMatch = student.nameEnglish.toLowerCase().includes(query);
        const rollMatch = String(student.rollNumber)
          .toLowerCase()
          .includes(query);
        const phoneMatch =
          cleanPhone(student.whatsapp).includes(queryDigits) ||
          student.whatsapp.toLowerCase().includes(query);
        const locationTextMatch = student.location
          ?.toLowerCase()
          .includes(query);

        const matchesSearch =
          nameMatch || rollMatch || phoneMatch || locationTextMatch;

        const matchesLocation =
          selectedLocation === "all" ||
          student.location?.trim().toLowerCase() ===
            selectedLocation.toLowerCase();

        return matchesSearch && matchesLocation;
      })
      .sort((a, b) => {
        const statsA = getStudentStats(a.rollNumber, a.enrolledCourseIds ?? []);
        const statsB = getStudentStats(b.rollNumber, b.enrolledCourseIds ?? []);

        if (sortBy === "attendance-desc") {
          return statsB.numericRate - statsA.numericRate;
        }
        if (sortBy === "attendance-asc") {
          return statsA.numericRate - statsB.numericRate;
        }
        if (sortBy === "location") {
          return (a.location || "").localeCompare(b.location || "");
        }
        const numA = parseInt(String(a.rollNumber).replace(/\D/g, ""), 10);
        const numB = parseInt(String(b.rollNumber).replace(/\D/g, ""), 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return String(a.rollNumber).localeCompare(String(b.rollNumber));
      });
  }, [students, searchQuery, selectedLocation, sortBy, courses]);

  return (
    <div className="min-h-screen bg-background text-text py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header & Admin Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/academy"
              className="text-xs sm:text-sm font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              Enrolled Scholars Directory ({students.length})
            </h1>
            <p className="text-xs sm:text-sm text-text/50 mt-1">
              Search by name/phone, filter duplicate numbers, location, and
              attendance rates
            </p>
          </div>

          <div className="self-start sm:self-auto">
            {isAdminUnlocked ? (
              <button
                onClick={handleLockAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30 transition-all shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-primary" />
                <span>Admin Unlocked</span>
                <EyeOff className="w-3 h-3 ml-1 opacity-70" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setEnteredPin("");
                  setPinError(false);
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text/5 border border-text/10 text-text/50 hover:text-text/70 text-xs font-semibold hover:border-text/20 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Admin Unlock</span>
              </button>
            )}
          </div>
        </div>

        {/* Search, Filter & Sort Control Bar */}
        <div className="p-4 rounded-2xl bg-text/5 border border-text/10 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 transition-colors">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll, phone number, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-text/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Filter className="w-3.5 h-3.5 text-text/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl pl-8 pr-7 py-2 text-xs text-text focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:w-48">
              <ArrowUpDown className="w-3.5 h-3.5 text-text/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-background border border-text/10 rounded-xl pl-8 pr-7 py-2 text-xs text-text focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
              >
                <option value="roll">Sort by Roll (Default)</option>
                <option value="attendance-desc">Highest Attendance</option>
                <option value="attendance-asc">Lowest Attendance</option>
                <option value="location">Group by Location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter Strip */}
        <div className="flex justify-between items-center text-xs text-text/50 px-1">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {(searchQuery || selectedLocation !== "all" || sortBy !== "roll") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("all");
                setSortBy("roll");
              }}
              className="text-secondary hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Student Cards Grid */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-text/5 border border-text/10 space-y-2">
            <p className="text-sm font-semibold text-text">
              No students found matching your criteria
            </p>
            <p className="text-xs text-text/50">
              Try searching with a different name, phone number, or reset
              filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student) => {
              const { totalHeld, totalAttended, attendanceRate } =
                getStudentStats(
                  student.rollNumber,
                  student.enrolledCourseIds ?? [],
                );

              const isDuplicateNumber = duplicatePhoneNumbers.has(
                cleanPhone(student.whatsapp),
              );

              // Avatar Fallback URL
              const avatarSrc =
                student.avatarUrl ||
                `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(student.nameEnglish)}`;

              return (
                <div
                  key={String(student.rollNumber)}
                  className="p-4 sm:p-5 rounded-2xl bg-text/5 border border-text/10 flex flex-col justify-between space-y-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all relative group"
                >
                  {/* Duplicate Phone Warning Badge */}
                  {isDuplicateNumber && (
                    <div
                      title="Duplicate WhatsApp phone number shared with another student"
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold flex items-center gap-1 shadow-sm z-10"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Same Mobile</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Display */}
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-secondary/20 via-background to-primary/20 p-0.5 border border-text/10 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={avatarSrc}
                          alt={student.nameEnglish}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover rounded-2xl"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 pr-14">
                        <h4 className="font-bold text-text text-sm truncate">
                          {student.nameEnglish}
                        </h4>
                        <p className="text-xs font-mono text-text/50">
                          Roll: {student.rollNumber}
                        </p>
                      </div>
                    </div>

                    {/* Location & Protected WhatsApp details */}
                    <div className="space-y-1.5 text-xs text-text/50">
                      <div className="flex items-center gap-1 text-[11px] truncate">
                        <MapPin className="w-3 h-3 text-secondary shrink-0" />
                        <span className="truncate">
                          {student.location || "Location not set"}
                        </span>
                      </div>

                      {/* Conditional WhatsApp Row */}
                      <div>
                        {isAdminUnlocked ? (
                          <a
                            href={`https://wa.me/${cleanPhone(student.whatsapp)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-mono"
                          >
                            <MessageSquare className="w-3 h-3 shrink-0" />
                            <span>{student.whatsapp}</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              setEnteredPin("");
                              setPinError(false);
                              setShowAdminModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-text/30 hover:text-text/50 transition-colors font-mono"
                          >
                            <Lock className="w-3 h-3 text-primary shrink-0" />
                            <span>{maskPhoneNumber(student.whatsapp)}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Real-time Attendance Box */}
                    <div className="p-3 bg-text/5 rounded-xl border border-text/10 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-text/50">Attendance</span>
                        <span className="font-mono font-bold text-primary">
                          {attendanceRate}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text/50">Attended Sessions</span>
                        <span className="font-mono font-semibold text-text">
                          {totalAttended} / {totalHeld}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-text/10">
                        <span className="text-text/50">Enrolled In</span>
                        <span className="font-mono text-[11px] text-secondary font-semibold">
                          {student.enrolledCourseIds?.join(", ") || "None"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/academy/students/${student.rollNumber}`}
                    className="flex items-center justify-center gap-1 w-full py-2 bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Profile & Attendance{" "}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Admin Verification Passcode Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-background border border-text/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 transition-colors">
              <div className="flex justify-between items-center border-b border-text/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-text text-sm sm:text-base">
                    Admin Verification
                  </h3>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1 text-text/40 hover:text-text rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text/50">
                Enter your instructor/admin passkey to reveal all scholar
                WhatsApp contact numbers.
              </p>

              <form onSubmit={handleUnlockAdmin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Passcode (e.g. 1234)"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    className={`w-full bg-text/5 border ${
                      pinError
                        ? "border-secondary focus:border-secondary"
                        : "border-text/10 focus:border-primary"
                    } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none font-mono text-center tracking-widest transition-colors`}
                  />
                  {pinError && (
                    <span className="text-[11px] text-secondary mt-1.5 block text-center">
                      Incorrect passcode. Try again.
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-3.5 py-2 bg-text/5 hover:bg-text/10 rounded-xl text-xs font-semibold text-text/60 hover:text-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-xl text-xs font-semibold text-white transition-colors shadow-lg shadow-secondary/25"
                  >
                    Unlock All
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
