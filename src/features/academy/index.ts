// Public surface of the academy feature. Client-safe only — server-only
// database models live in "@/features/academy/models".
export * from "./types";
export { default as CourseCard } from "./components/CourseCard";
export { AdminShell } from "./components/admin/AdminShell";
