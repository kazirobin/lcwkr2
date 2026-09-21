"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsRedirect({ params }: Props) {
  const resolved = use(params);
  const courseId = decodeURIComponent(resolved.id).trim();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/academy/courses?course=${encodeURIComponent(courseId)}`);
  }, [router, courseId]);

  return null;
}