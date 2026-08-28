"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";
import { academyData } from "@/data/academy";
import StudentCard from "@/components/academy/StudentCard";

export default function StudentsListPage() {
  const { students, courses } = academyData;

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [groupFilter, setGroupFilter] = useState<"all" | "joined" | "pending">("all");
  const [sortBy, setSortBy] = useState<
    "roll" | "attendance-desc" | "attendance-asc" | "location"
  >("roll");

  const cleanPhone = (phone: string) =>
    phone ? phone.replace(/[^0-9]/g, "") : "";

  // 1. Extract unique locations for filtering
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    students.forEach((s) => {
      if (s.location) locs.add(s.location.trim());
    });
    return Array.from(locs).sort();
  }, [students]);

  // 2. Attendance Numeric Calculation for Sorting
  const getAttendanceRate = (
    rollNumber: string | number,
    enrolledCourseIds: string[] = []
  ) => {
    let totalHeld = 0;
    let totalAttended = 0;
    const targetRoll = String(rollNumber).trim();

    courses.forEach((course) => {
      if (enrolledCourseIds.includes(course.courseId)) {
        const classes = course.classes ?? [];
        totalHeld += classes.length;
        totalAttended += classes.filter((cls) =>
          cls.presentStudents?.some((r) => String(r).trim() === targetRoll)
        ).length;
      }
    });

    return totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 100;
  };

  // 3. Combined Filter, Search & Sort Logic
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const queryDigits = cleanPhone(searchQuery);

    return students
      .filter((student) => {
        const nameMatch = student.nameEnglish.toLowerCase().includes(query);
        const rollMatch = String(student.rollNumber).toLowerCase().includes(query);
        const phoneMatch =
          cleanPhone(student.whatsapp).includes(queryDigits) ||
          student.whatsapp.toLowerCase().includes(query);
        const locationMatch = student.location?.toLowerCase().includes(query);

        const matchesSearch = nameMatch || rollMatch || phoneMatch || locationMatch;

        const matchesLocation =
          selectedLocation === "all" ||
          student.location?.trim().toLowerCase() === selectedLocation.toLowerCase();

        const matchesGroup =
          groupFilter === "all" ||
          (groupFilter === "joined" && student.isWhatsAppGroupJoined) ||
          (groupFilter === "pending" && !student.isWhatsAppGroupJoined);

        return matchesSearch && matchesLocation && matchesGroup;
      })
      .sort((a, b) => {
        if (sortBy === "attendance-desc") {
          return (
            getAttendanceRate(b.rollNumber, b.enrolledCourseIds) -
            getAttendanceRate(a.rollNumber, a.enrolledCourseIds)
          );
        }
        if (sortBy === "attendance-asc") {
          return (
            getAttendanceRate(a.rollNumber, a.enrolledCourseIds) -
            getAttendanceRate(b.rollNumber, b.enrolledCourseIds)
          );
        }
        if (sortBy === "location") {
          return (a.location || "").localeCompare(b.location || "");
        }
        
        // Default: Sort by Roll numerically
        const numA = parseInt(String(a.rollNumber).replace(/\D/g, ""), 10);
        const numB = parseInt(String(b.rollNumber).replace(/\D/g, ""), 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return String(a.rollNumber).localeCompare(String(b.rollNumber));
      });
  }, [students, searchQuery, selectedLocation, groupFilter, sortBy, courses]);

  return (
    <div className="min-h-screen bg-background text-text py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header */}
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
            Search by name/phone, filter WhatsApp group status, location, and attendance
          </p>
        </div>

        {/* Search, Filter & Sort Control Bar */}
        <div className="p-4 rounded-2xl bg-text/5 border border-text/10 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 transition-colors">
          {/* Search Input */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* WhatsApp Group Filter */}
            <div className="relative flex-1 sm:w-40">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value as any)}
                className="w-full bg-background border border-text/10 rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
              >
                <option value="all">Group: All</option>
                <option value="joined">Group: Joined</option>
                <option value="pending">Group: Not Joined</option>
              </select>
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative flex-1 sm:w-40">
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

            {/* Attendance & Location Sorter */}
            <div className="relative flex-1 sm:w-44">
              <ArrowUpDown className="w-3.5 h-3.5 text-text/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-background border border-text/10 rounded-xl pl-8 pr-7 py-2 text-xs text-text focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
              >
                <option value="roll">Sort by Roll</option>
                <option value="attendance-desc">Highest Attendance</option>
                <option value="attendance-asc">Lowest Attendance</option>
                <option value="location">Group by Location</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex justify-between items-center text-xs text-text/50 px-1">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {(searchQuery || selectedLocation !== "all" || groupFilter !== "all" || sortBy !== "roll") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("all");
                setGroupFilter("all");
                setSortBy("roll");
              }}
              className="text-secondary hover:underline font-medium cursor-pointer"
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
              Try searching with a different name, phone number, or reset filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard key={String(student.rollNumber)} student={student} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}