import ClassRoutineSection from '@/components/home/ClassRoutineSection';
import FAQ from '@/components/home/Faq';
import Founder from '@/components/home/Founder';
import { Hero } from '@/components/home/Hero';
import RoadmapBooks from '@/components/home/RoadmapBooks';
import StudentResults from '@/components/home/StudentResults';
import Voice from '@/components/home/Voice';

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
