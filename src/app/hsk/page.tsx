import { getLevelSummaries } from "@/features/vocabulary/data";
import LevelPicker from "@/features/vocabulary/components/LevelPicker";

export default function HskPage() {
  return <LevelPicker levels={getLevelSummaries()} />;
}
