import ClassRoutineSection from '@/features/marketing/components/home/ClassRoutineSection';
import FAQ from '@/features/marketing/components/home/Faq';
import Founder from '@/features/marketing/components/home/Founder';
import { Hero } from '@/features/marketing/components/home/Hero';
import RoadmapBooks from '@/features/marketing/components/home/RoadmapBooks';
import StudentResults from '@/features/marketing/components/home/StudentResults';
import Voice from '@/features/marketing/components/home/Voice';

export default function Home() {
    return (
        <>
            <Hero photoSrc="assets/kr.jpeg" />
            <Founder />
            <StudentResults />
            <Voice />
            <RoadmapBooks />
            <ClassRoutineSection />
            <FAQ />
        </>
    );
}
