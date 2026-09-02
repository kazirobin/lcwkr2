
import ClassRoutineSection from "@/components/home/ClassRoutineSection";
import FAQ from "@/components/home/Faq";
import {Hero} from "@/components/home/Hero";
import RoadmapBooks from "@/components/home/RoadmapBooks";
import Voice from "@/components/home/Voice";

export default function Home() {
  return (
  <>
  <Hero photoSrc="assets/hero1.png"/>
  <Voice/>
  <RoadmapBooks/>
  <ClassRoutineSection/>
  <FAQ/>
  </>
  );
}
2