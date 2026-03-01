/**
 * Seed script — writes the 7 real events to Firestore with specific doc IDs.
 * Run with:  npx tsx scripts/seed-events-data.ts
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * in .env.local.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

interface EventSeed {
  id: string;
  title: string;
  description: string;
  Date: Date;
  Time: string;
  venue: string;
  organizer: string;
  coOrganizer: string;
  keyHighlights: string[];
  tags: string[];
  status: string;
  imageUrl: string;
  MembersParticipated: number;
  isDone: boolean;
  Theme: string[];
  coverUrl: string;
  rank: number;
  eventGallery: string[];
}

const events: EventSeed[] = [
  {
    id: "2e7c8f4d5b1e6a9f",
    title: "UI/UX Workshop",
    description:
      "A full-day hands-on UI/UX workshop introducing second-year students to design thinking, UI principles, UX fundamentals, and practical design implementation using Figma. The session focused on real-world problem solving, sketching, digital design, and career guidance.",
    Date: new Date("2025-12-19T00:00:00Z"),
    Time: "09:00 - 16:00",
    venue: "Software Lab, C Block",
    organizer: "Yaswanth",
    coOrganizer: "Vivek",
    keyHighlights: [
      "UI & UX Fundamentals",
      "Design Thinking",
      "Hands-on Figma Practice",
      "Career Guidance",
    ],
    tags: ["UI/UX", "Design Thinking", "Figma"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175275/hkhq9snsgymdgpvxc2in.png",
    MembersParticipated: 200,
    isDone: true,
    Theme: ["#8E44AD", "#2C3E50", "#F1C40F", "#ECF0F1"],
    coverUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767174885/pmostvpat4lm3zwm3t2a.png",
    rank: 11,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767075676/sumhmc9siy7lnnyxxjas.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767075940/v5x5ldy7n7pvvlqgdlsg.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767076521/hjyiuiyzpnhcahugdhlv.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767076711/umajo213fjsxgo6uwl1i.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767079279/zc6raonvuj2xammxpvns.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767079319/emilqpgnbe04kork0uvv.jpg",
    ],
  },
  {
    id: "5217ea9980c69dcc",
    title: "Kode-Kurushetra",
    description:
      "Kode-Kurushetra, held on March 20–21, 2025, at the Seetha Auditorium, was an exciting 24-hour national hackathon that brought together talented innovators from across the country. Organized by Sriram with co-organizer Sujan, the event provided a vibrant space for participants to build creative and impactful solutions. With a ₹50,000 cash prize motivating the competition, teams coded through the clock, collaborated efficiently, and refined their ideas with guidance from mentors. The event concluded on a high note, recognizing outstanding projects and establishing Kode-Kurushetra as a standout innovation challenge for young tech enthusiasts",
    Date: new Date("2025-03-20T00:00:00Z"),
    Time: "24 Hours",
    venue: "VITB, Seetha Auditorium",
    organizer: "Sriram",
    coOrganizer: "Sujan",
    keyHighlights: [
      "National Level Hackathon",
      "₹50,000 Cash Prize",
      "Mentorship",
      "24-Hour Coding",
    ],
    tags: ["National Hackathon"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764820248/Frame_56_1_jpqiuc.png",
    MembersParticipated: 500,
    isDone: true,
    Theme: ["#FFBB39", "#F75590", "#FF7EB3", "#F44336", "#3D85C6"],
    coverUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764657859/KKK_cl9120.png",
    rank: 14,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767087126/eiaomaeyh10jum7yqujh.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767087320/a55gqzyous2x9kl8w2l2.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767088009/dfhlipj5zbd29omvxkq1.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767088206/yhcpvmtah9ua8tdplgni.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767088257/c2n0letrjyy7ce3yyjmn.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767088309/ipp5howdp03ygjydeskx.jpg",
    ],
  },
  {
    id: "5ad2741e0a216834",
    title: "Hackatron 3.0",
    description:
      "Hackatron 3.0 is a 24-hour hackathon designed to foster innovation, teamwork, and creative problem-solving. Conducted from 2nd to 3rd January 2026 at C Block, the event followed a Harry Potter theme and created a highly collaborative environment.",
    Date: new Date("2026-01-02T00:00:00Z"),
    Time: "24 Hours",
    venue: "C Block",
    organizer: "Yaswanth",
    coOrganizer: "Vivek",
    keyHighlights: [
      "24-hour hackathon focused on innovation and real-world problem solving",
      "Participants divided into four houses: Gryffindor, Hufflepuff, Ravenclaw, and Slytherin",
      "Harry Potter themed hackathon experience",
      "Exciting treasure hunt game conducted during the hackathon",
      "High student participation and strong team collaboration",
    ],
    tags: ["Hackathon", "24 Hours Hackathon"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767620498/xycnjhf6slquvemuyjyb.png",
    MembersParticipated: 300,
    isDone: true,
    Theme: ["#740001", "#1A472A", "#ECB939", "#0E1A40"],
    coverUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767759110/ff2tgnoqnxo2aabrxic7.png",
    rank: 10,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767616471/ed8bzsdffplvu0msdkxt.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767616744/lxnmnaf7rkzjeogn4d8b.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767616911/wbqeb6ewvzeq7drfcmpw.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767617002/f2c6i0ur6tdhetcexvun.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767617109/edifmb5aasjd4dxnrvcm.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767617585/u2gvdbbtlldga1cerjq8.jpg",
    ],
  },
  {
    id: "8a8ad4f02d12ce41",
    title: "Prompt Engineering Workshop",
    description:
      "An interactive workshop introducing AI, prompt engineering, and creative problem-solving using real-world activities.",
    Date: new Date("2025-09-18T00:00:00Z"),
    Time: "09:00 - 16:00",
    venue: "Open Labs, C Block",
    organizer: "Yaswanth",
    coOrganizer: "Vivek",
    keyHighlights: [
      "Introduction to AI Tools",
      "Prompt Engineering Concepts",
      "Prompt Structure",
      "Creative Writing Activities",
      "Logo Design Contest",
    ],
    tags: ["AI Workshop", "Prompt Engineering", "Creative Activities"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766134560/migo4z5r6vewt7gg6fjj.png",
    MembersParticipated: 200,
    isDone: true,
    Theme: ["#34A853", "#4285F4", "#EA4335", "#FBBC04", "#A83489"],
    coverUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1765072573/Frame_87_ghqp50.png",
    rank: 12,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086774/prompt%20engineering/u0uy1tctxuqkzokaiem0.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086863/prompt%20engineering/up6otfs8ogxfabv9vzhr.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086900/prompt%20engineering/tk3aakahjoxsimjvidgm.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086999/prompt%20engineering/ndypygfli1weasg0rtsk.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767089954/abytritfjg5uh2lcs0lv.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767090003/om1upoh75xaeod90kpqk.jpg",
    ],
  },
  {
    id: "9f7250e4e26a9246",
    title: "Google Study Jams",
    description:
      "Google Cloud Study Jams is an online learning program held from October 20 to November 19, 2025. It provides a structured path for beginners and intermediate learners to build cloud computing skills through guided modules, hands-on labs, and interactive sessions. GDG mentors supported and guided participants throughout the program, helping them strengthen their understanding of Google Cloud technologies and work toward valuable certifications. The initiative also encouraged collaboration and community learning among cloud enthusiasts.",
    Date: new Date("2025-10-18T00:00:00Z"),
    Time: "2025-10-20",
    venue: "Hybrid (Online + On-Campus)",
    organizer: "Yaswanth",
    coOrganizer: "Vivek",
    keyHighlights: [
      "Introduction to Google Cloud Platform (GCP)",
      "Guided Qwiklabs & Hands-on Practice",
      "Top mentoring by Jameer & Gurupraneeth",
      "Cloud Skill Badges & Certifications",
      "Mentor Support & Doubt Clearing Sessions",
      "Progress Tracking & Leaderboards",
      "Completion Certificates from Google",
    ],
    tags: ["Cloud Computing", "Google Cloud", "Skill Development", "Badges"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1765033646/Frame_56_3_camdi8.png",
    MembersParticipated: 250,
    isDone: true,
    Theme: ["#4285F4", "#34A853", "#EA4335", "#FBBC04", "#D2E3FC"],
    coverUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1765072571/Frame_86_xp5or5.png",
    rank: 13,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767079465/flash_mob%2016:9%20pics/dxr6xooafdwhhxhtvptz.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767079743/study_jams%20pics/lhmtttshmaqypcakdh5f.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767079838/study_jams%20pics/txmyeerrnakdx1qv9x4l.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767080072/study_jams%20pics/ampvuy0dbqqe2dolopqj.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767080116/study_jams%20pics/wec8buhugtrb8xzyxt1y.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767084991/study_jams/qgk4qodmkvegdyfaev2j.jpg",
    ],
  },
  {
    id: "ad2741e0a216834d",
    title: "Hack-A-Tron",
    description:
      "Hack-A-Tron 2025 was an electrifying 24-hour hackathon held on February 20–21 in the C-Block labs, bringing together innovators, problem-solvers, and tech enthusiasts for a high-energy creative sprint. Organized by Sriram with co-organizer Sujan, the event embraced a unique Squid Game–inspired theme that added excitement and friendly competition throughout the hackathon. Participants kicked off the experience with a lively Red Light, Green Light challenge, setting the tone for a thrilling and engaging atmosphere. Alongside intense coding sessions, teams enjoyed mini-games, interactive activities, and a refreshing music concert, which offered a perfect break from the 24-hour creative grind. With its blend of innovation, entertainment, and collaborative spirit, Hack-A-Tron concluded as a memorable and successful tech event.",
    Date: new Date("2025-02-20T00:00:00Z"),
    Time: "24 Hours",
    venue: "VITB, C Block Labs",
    organizer: "Sriram",
    coOrganizer: "Sujan",
    keyHighlights: [
      "Squid Game Theme",
      "Red Light Green Light Challenge",
      "Mini Games",
      "Music Session",
    ],
    tags: ["Hackathon", "24 Hours"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764820249/Frame_56_sbmzqk.png",
    MembersParticipated: 500,
    isDone: true,
    Theme: ["#EB4E80", "#F75590", "#FF7EB3", "#F44336", "#3D85C6"],
    coverUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764657858/Hacka_ier309.png",
    rank: 15,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767077408/qxbhseo8cmwqufjstmiq.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767077680/vnhfc7mhcfbzabispeop.png",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767077799/inx3dnzmowuizcsftdld.png",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767078016/airdiw95n6df3aslpydl.png",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767078303/vk7dw0yvan636rapzjmm.png",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767078595/dszbgzecra20upi19icp.png",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767078818/auyhism56h9lfc90jr3p.png",
    ],
  },
  {
    id: "c4a3fa7b46af287b",
    title: "Genesis",
    description:
      'GENESIS, the grand inauguration of GDG, was held on December 7, 2024, at C Block and was officially launched by Student Tribe Chairman Sricharan Lakkaraju. Organized by Sriram with co-organizer Sujan, the event brought an energetic blend of tech, creativity, and community. Highlights included vibrant performances from Vishnu Dancing Diaries, an exciting Drone Club showcase, a stunning drone show, and the official GDG–Devmob banner launch. Engaging activities such as photo booths, a meme contest, and the "Capture, Create, and Win" challenge added to the celebration, making GENESIS a memorable kickstart to the GDG journey.',
    Date: new Date("2024-12-07T00:00:00Z"),
    Time: "Full Day",
    venue: "VITB, C Block",
    organizer: "Sriram",
    coOrganizer: "Sujan",
    keyHighlights: [
      "Drone Show",
      "Vishnu Dancing Diaries",
      "GDG Devmob Banner Launch",
      "Photo Booths",
      "Meme Contest",
    ],
    tags: ["GDG Inauguration", "Tech Event"],
    status: "Completed",
    imageUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764820245/Frame_56_2_a2k6dm.png",
    MembersParticipated: 500,
    isDone: true,
    Theme: ["#A7AAFF", "#F75590", "#FF7EB3", "#309EB5", "#C582B5"],
    coverUrl:
      "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764657858/genesis_epy0ej.png",
    rank: 16,
    eventGallery: [
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085373/v4iiwzn4puk9owzmgzq4.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085418/qrmzxq2hjgbknulphord.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085459/y8qrvwdcu9bgpicf4lej.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085587/oqybwigfki2ofkabn4rj.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085653/axru74ej2k4au7yd6zoi.jpg",
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767085699/a1uqvycrxtmaw9ooylbt.jpg",
    ],
  },
];

async function main() {
  const db = getAdminDb();
  const batch = db.batch();

  console.log("Seeding 7 events with specific document IDs...\n");

  for (const event of events) {
    const { id, ...data } = event;
    const ref = db.collection("events").doc(id);
    batch.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Queued: ${event.title} (${id})`);
  }

  await batch.commit();
  console.log("\nAll 7 events seeded successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
