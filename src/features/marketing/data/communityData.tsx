import { Monitor, Crown, Shield, Users, Briefcase, Award } from "lucide-react";

export interface CommunityMember {
  id: string;
  name: string;
  image: string;
  whatsapp: string;
  role: 'founder' | 'co-admin' | 'manager' | 'teacher';
  job: string; // e.g., "All Community Groups", "Chinese Learning Groups"
  icon: any;
  schedule?: string; // Only for teachers
  subject?: string; // Only for teachers
  group?: string; // Only for teachers
}

export const communityMembers: CommunityMember[] = [
  // Founder
  {
    id: 'founder-1',
    name: "Kazi Robin",
    image: "/assets/community/robin.png",
    whatsapp: "8801787881334",
    role: 'founder',
    job: "All Community Groups",
    icon: Crown,
  },
  
  // Co-Admins
  {
    id: 'coadmin-1',
    name: "Jahid Khan",
    image: "/assets/community/jk.png",
    whatsapp: "8801737969812",
    role: 'co-admin',
    job: "Chinese Learning Groups",
    icon: Shield,
  },
  
  // Managers
  {
    id: 'manager-1',
    name: "Jahid Hasan",
    image: "/assets/community/jahid.png",
    whatsapp: "8801521751608",
    role: 'manager',
    job: "General Support & Queries",
    icon: Briefcase,
  },
  {
    id: 'manager-2',
    name: "Subrata Sarkar",
    image: "/assets/community/ss.png",
    whatsapp: "8801681879654",
    role: 'manager',
    job: "7pm Class Group",
    icon: Briefcase,
  },
  {
    id: 'manager-3',
    name: "Shahoriar Alam",
    image: "/assets/community/user1.png",
    whatsapp: "8801681879654",
    role: 'manager',
    job: "9pm Class Group",
    icon: Briefcase,
  },
  
  // Teachers
  {
    id: 'teacher-1',
    name: "Abdullah al Faruk",
    image: "/assets/community/faruk.png",
    whatsapp: "8801613765886",
    role: 'teacher',
    job: "Chinese Language Teacher",
    icon: Award,
    subject: "Chinese Language",
    group: "7pm Class Group",
    schedule: "Mon, Wed • 7:00 PM",
  },
  {
    id: 'teacher-2',
    name: "Ismail Hossain",
    image: "/assets/community/user1.png",
    whatsapp: "8801633700770",
    role: 'teacher',
    job: "Chinese Language Teacher",
    icon: Award,
    subject: "Chinese Language",
    group: "9pm Class Group",
    schedule: "Sat, Sun, Mon, Tue, Wed • 9:00 PM",
  },
];

// Helper to filter by role
export const getMembersByRole = (role: CommunityMember['role']) => {
  return communityMembers.filter(member => member.role === role);
};

// Stats calculation
export const getCommunityStats = () => {
  return {
    founder: getMembersByRole('founder').length,
    coAdmins: getMembersByRole('co-admin').length,
    managers: getMembersByRole('manager').length,
    teachers: getMembersByRole('teacher').length,
  };
};