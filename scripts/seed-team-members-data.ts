/**
 * Seed script — writes all team members to the Firestore "team_members" collection
 * with their specific document IDs so data can be restored after any wipe.
 *
 * Run with:  npx tsx scripts/seed-team-members-data.ts
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

interface TeamMemberSeed {
  id: string;
  imageUrl: string;
  name: string;
  designation: string;
  position: string;
  linkedinUrl: string;
  mail: string;
  bgColor: string;
  rank: number;
  logo: string;
  dept_rank: number;
  dept_logo: string;
}

const teamMembers: TeamMemberSeed[] = [
  // ── Faculty Advisory Team ──
  {
    id: "f5db0a49-e14d-4254-a955-eb118e2ff5fe",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Srilakshmi_mam_Vice_principal_f42phl.png",
    name: "SRILAKSHMI M",
    designation: "Faculty Coordinatorr",
    position: "Faculty Advisory Team",
    linkedinUrl: "",
    mail: "",
    bgColor: "#CCF6C5",
    rank: 0,
    logo: "https://in.pinterest.com/pin/682084306099521437/",
    dept_rank: 0,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: "ec98fb1e-076f-4962-bee1-f39cdd35bf3c",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Harsha_Sir_c25iwr.png",
    name: "HARSHA VARDHAN G",
    designation: "Faculty Coordinator",
    position: "Faculty Advisory Team",
    linkedinUrl: "",
    mail: "",
    bgColor: "#CCF6C5",
    rank: 1,
    logo: "https://in.pinterest.com/pin/682084306099521437/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },

  // ── Chapter Executive Board ──
  {
    id: "bf805de4-c7b8-4fdb-b635-73e664e47e91",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Yaswanth_Varada_Organisor_hmclul.png",
    name: "YASWANTH VARADA",
    designation: "Organizer",
    position: "Chapter Executive Board",
    linkedinUrl:
      "https://www.linkedin.com/in/yaswanth-varada?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    mail: "yaswanthvarada20@gmail.com",
    bgColor: "#FFE7A5",
    rank: 2,
    logo: "https://in.pinterest.com/pin/408138784982454401/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  },
  {
    id: "56330f08-f768-4545-ba19-d5e9aa4de02f",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/vivek_Co-organisor_hfenkj.png",
    name: "VIVEK SADHU ",
    designation: "Co-organizer",
    position: "Chapter Executive Board",
    linkedinUrl:
      "https://www.linkedin.com/in/vivek-sadhu-6211a4250?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    mail: "viveksadhu369@gmail.com",
    bgColor: "#FFE7A5",
    rank: 2,
    logo: "https://in.pinterest.com/pin/408138784982454401/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  },
  {
    id: "f217790f-4b46-4141-a346-b1c6376384a8",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Surya_Teja_facilitator_g5riri.png",
    name: "GAJULA SURYA TEJA",
    designation: "Facilitator",
    position: "Chapter Executive Board",
    linkedinUrl:
      "https://www.linkedin.com/in/suryatejagajula?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "gajulasuryateja8@gmail.com",
    bgColor: "#FFE7A5",
    rank: 2,
    logo: "https://in.pinterest.com/pin/408138784982454401/",
    dept_rank: 3,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  },

  // ── Chapter Executive Council ──
  {
    id: "pranav-cec-20251217",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/PranavSaiBhagath_Ai_lead_jjozwm.png",
    name: "PRANAV BHAGATH V",
    designation: " ",
    position: "Chapter Executive Council",
    linkedinUrl:
      "https://www.linkedin.com/in/pranav-sai-bhagath?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    mail: "24pa1a5762@vishnu.edu.in",
    bgColor: "#CCF6C5",
    rank: 4,
    logo: "https://in.pinterest.com/pin/596375175689041800/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png",
  },
  {
    id: "jayasri-cec-20251217",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Jayasri_PR_colead_qthwg6.png",
    name: "JAYASRI P",
    designation: " ",
    position: "Chapter Executive Council",
    linkedinUrl: "https://www.linkedin.com/in/jayasripatnala",
    mail: "23pa1a4598@vishnu.edu.in",
    bgColor: "#CCF6C5",
    rank: 4,
    logo: "https://in.pinterest.com/pin/286963807497133639/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
  },

  // ── Digital Advisory Team ──
  {
    id: "cm5_example_id_456",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767886987/ngv6uefackvxzjz1rozc.png",
    name: "NARASIMHA NAIDU",
    designation: "Technical Lead",
    position: "Digital Advisory Team",
    linkedinUrl: "https://www.linkedin.com/in/narasimhanaidukorrapati",
    mail: "22pa1a0577@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 3,
    logo: "",
    dept_rank: 1,
    dept_logo: "",
  },
  {
    id: "ritwik_v_videography_mentor",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1762071173/ritwik_videography_mentor_ksjiqj.png",
    name: "Ritwik V",
    designation: "Videography Mentor",
    position: "Digital Advisory Team",
    linkedinUrl: "https://www.linkedin.com/in/ritwik-v-31a1652a4/",
    mail: "ritwikvulli7@gmail.com",
    bgColor: "#F8D8D8",
    rank: 3,
    logo: "",
    dept_rank: 2,
    dept_logo: "",
  },
  {
    id: "tejaswini_p_technical_mentor",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1762071176/Tejaswini_Technical_mentor_e3sgq4.png",
    name: "Tejaswini P",
    designation: "Technical Mentor",
    position: "Digital Advisory Team",
    linkedinUrl: "https://www.linkedin.com/in/tejaswini-p-7b0752230/",
    mail: "peddintitejaswini2051021@gmail.com",
    bgColor: "#F8D8D8",
    rank: 3,
    logo: "",
    dept_rank: 3,
    dept_logo: "",
  },
  {
    id: "siva_prasad_k_management_mentor",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1762071177/SivaPrasad_management_mentor_j2fhok.png",
    name: "Siva Prasad K",
    designation: "Management Mentor",
    position: "Digital Advisory Team",
    linkedinUrl: "https://www.linkedin.com/in/siva-prasad-k-a41b27259/",
    mail: "22pa1a1277@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 3,
    logo: "",
    dept_rank: 4,
    dept_logo: "",
  },
  {
    id: "koti_praveen_t_editing_mentor",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1762071170/KotiPraveen_C_M_mentor_rjt5gw.png",
    name: "Koti Praveen T",
    designation: "Editing           Mentor",
    position: "Digital Advisory Team",
    linkedinUrl: "https://www.linkedin.com/in/k-koti-praveen-b39628254/",
    mail: "22pa1a12h0@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 3,
    logo: "",
    dept_rank: 5,
    dept_logo: "",
  },

  // ── PR & HR ──
  {
    id: "cl_example_id_123",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767887095/emz25k6nx5kwjrpksavw.png",
    name: "PUJYA NIGAMA",
    designation: "Lead",
    position: "PR & HR",
    linkedinUrl: "https://www.linkedin.com/in/pujya-nigama-reddy",
    mail: "24pa1a0519@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 5,
    logo: "",
    dept_rank: 1,
    dept_logo: "",
  },

  // ── Web Dev ──
  {
    id: "eb2af751-5937-4cc8-bc8a-a2bda4418cf1",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Gurunadh_webdev_co-lead_d8ukqo.png",
    name: "GURUNADA RAO",
    designation: "Lead",
    position: "Web Dev",
    linkedinUrl:
      "https://www.linkedin.com/in/gurunadaraoreddy?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "24pa1a05j7@vishnu.edu.in",
    bgColor: "#C3ECF6",
    rank: 6,
    logo: "https://in.pinterest.com/pin/614811786672093790/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1336/1336494.png",
  },
  {
    id: "prakash-webdev-colead",
    imageUrl:
      "https://res.cloudinary.com/dkxopbdbu/image/upload/v1772197065/IMG_20260227_165603-removebg-preview_gppoa8.png",
    name: "I.S.PRAKASH",
    designation: "Co Lead",
    position: "Web Dev",
    linkedinUrl: "https://www.linkedin.com/in/indukuri-sailaj-prakash/",
    mail: "prakashrajuindukuri@gmail.com",
    bgColor: "#C3ECF6",
    rank: 6,
    logo: "https://in.pinterest.com/pin/614811786672093790/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1336/1336494.png",
  },

  // ── AI Journalist ──
  {
    id: "bf01f69e-d2c7-4241-bbba-937c88e90979",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/PranavSaiBhagath_Ai_lead_jjozwm.png",
    name: "PRANAV  BHAGATH V ",
    designation: "Lead",
    position: "AI Journalist",
    linkedinUrl:
      "https://www.linkedin.com/in/pranav-sai-bhagath?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    mail: "24pa1a5762@vishnu.edu.in",
    bgColor: "#CCF6C5",
    rank: 7,
    logo: "https://in.pinterest.com/pin/596375175689041800/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png",
  },
  {
    id: "a4fe7ba8-edf8-4bf8-9918-9957178ae504",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/VinayranjandAi_co-lead_ijib3a.png",
    name: "VINAY RANJAN P ",
    designation: "Co Lead",
    position: "AI Journalist",
    linkedinUrl:
      "https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=vinay-ranjan-pattapu-231a9231b",
    mail: "vinayranjanpattapu@gmail.com",
    bgColor: "#CCF6C5",
    rank: 7,
    logo: "https://in.pinterest.com/pin/596375175689041800/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/8637/8637099.png",
  },

  // ── Android ──
  {
    id: "7cf7fb85-94c4-4d22-a506-aeec2542f7b8",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Ganesh_Android_lead_ctuyis.png",
    name: "GANESH G",
    designation: "Lead",
    position: "Android",
    linkedinUrl: "https://www.linkedin.com/in/sriramganeshgovala/",
    mail: "23pa1a0577@vishnu.edu.in",
    bgColor: "#C3ECF6",
    rank: 8,
    logo: "https://in.pinterest.com/pin/587790188905131244/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/732/732208.png",
  },

  // ── Cloud ──
  {
    id: "cbce2928-69a8-4676-976b-eeee139e3fdd",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Prem_cloud_lead_n2ddw8.png",
    name: "PREM KUMAR M",
    designation: "Lead",
    position: "Cloud",
    linkedinUrl: "https://www.linkedin.com/in/prem-kumar-mokara",
    mail: "premkumarmokara@gmail.com",
    bgColor: "#F8D8D8",
    rank: 9,
    logo: "https://in.pinterest.com/pin/47147127339045025/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1693/1693918.png",
  },
  {
    id: "dd6ea20f-5147-4e62-81e7-5730202b0fc8",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/praneeth_cloud_co-lead_rvdj1l.png",
    name: "PRANEETH P",
    designation: "Co Lead",
    position: "Cloud",
    linkedinUrl:
      "https://www.linkedin.com/in/praneeth-perumalla-3a2754321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_mediu",
    mail: "praneethperumalla27@gmail.com",
    bgColor: "#F8D8D8",
    rank: 9,
    logo: "https://in.pinterest.com/pin/47147127339045025/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1693/1693918.png",
  },
  {
    id: "863d457e-bad0-4624-a6ba-0d444177f8c5",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Jameer_cloud_associate_tqet0c.png",
    name: "JAMEER SK",
    designation: "Associate",
    position: "Cloud",
    linkedinUrl: "https://linkedin.com/in/jameer-ahmed-6047b3288",
    mail: "jameer.xxvi@gmail.com",
    bgColor: "#F8D8D8",
    rank: 9,
    logo: "https://in.pinterest.com/pin/47147127339045025/",
    dept_rank: 3,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1693/1693918.png",
  },

  // ── Communication ──
  {
    id: "5caafc2c-7b19-43df-807e-a0867dda725f",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/usha_communication_lead_yi0vhj.png",
    name: "USHA SRI B",
    designation: "Lead",
    position: "Communication",
    linkedinUrl: "https://www.linkedin.com/in/usha-sri-bomminayuni-9576b8377",
    mail: "24pa1a1235@vishnu.edu.in",
    bgColor: "#FFE7A5",
    rank: 10,
    logo: "https://in.pinterest.com/pin/496944140155409195/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  },
  {
    id: "a5f16686-8d87-4df8-a6b3-e2efb85bab0c",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/navadeep_communication_colead_em6qzv.png",
    name: "NAVADEEP SAI R",
    designation: "Co Lead",
    position: "Communication",
    linkedinUrl: "https://www.linkedin.com/in/rns-navadeep-3977ab320",
    mail: "24pa1a12k5@vishnu.edu.in",
    bgColor: "#FFE7A5",
    rank: 10,
    logo: "https://in.pinterest.com/pin/496944140155409195/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  },

  // ── Content & Media ──
  {
    id: "05cc0538-b866-4d1e-aabc-ba5584a3472d",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Suhas_c_m_xid3n9.png",
    name: "SUHAS P",
    designation: "Lead",
    position: "Content & Media",
    linkedinUrl:
      "https://www.linkedin.com/in/paritala-venkata-satya-siva-sai-suhas-71883b345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "suhasparitala33@gmail.com",
    bgColor: "#CCF6C5",
    rank: 11,
    logo: "https://in.pinterest.com/pin/634233560036406276/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1375/1375106.png",
  },

  // ── Design ──
  {
    id: "da4eaca3-6545-439f-a196-5e671a5819ef",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/gowthami_design_lead_g5azbw.png",
    name: "GOWTHAMI T",
    designation: "Lead",
    position: "Design",
    linkedinUrl:
      "https://www.linkedin.com/in/gowthami-tirumalareddy-%E2%9C%B7-b228132bb/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3B48oZAcHGQwet9ZRCIDZWGw%3D%3D",
    mail: "gowthamitirumalareddy@gmail.com",
    bgColor: "#C3ECF6",
    rank: 12,
    logo: "https://in.pinterest.com/pin/5981412001383410/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/2620/2620445.png",
  },
  {
    id: "4868bd99-4af5-40ef-951a-70b14440e3f0",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Harini_Design_Co-lead_hyyzsn.png",
    name: "HARINI P",
    designation: "Co Lead",
    position: "Design",
    linkedinUrl:
      "https://www.linkedin.com/in/sri-harini-13b6b2321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "harinipullipudi@gmail.com",
    bgColor: "#C3ECF6",
    rank: 12,
    logo: "https://in.pinterest.com/pin/5981412001383410/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/2620/2620445.png",
  },

  // ── Event Management ──
  {
    id: "b4737e8b-33a4-422c-833f-d794c255254f",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/revanth_event_mangement_lead_xad42s.png",
    name: "REVANTH  V",
    designation: "Lead",
    position: "Event Management",
    linkedinUrl: "https://www.linkedin.com/in/revanth-vasamsetti/",
    mail: "23pa1a45c5@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 13,
    logo: "https://in.pinterest.com/pin/1070519773933825890/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
  },
  {
    id: "af284042-eb54-4987-a7e6-cd456de8a09a",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/bhavyahasini_eventmanagaement_co-lead_um7njo.png",
    name: "BHAVYA HASINI M",
    designation: "Co Lead",
    position: "Event Management",
    linkedinUrl:
      "https://www.linkedin.com/in/bhavya-hasini-m-6ba6aa321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "24PA1A05E8@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 13,
    logo: "https://in.pinterest.com/pin/1070519773933825890/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
  },
  {
    id: "d074ab9f-1ca1-4e8d-bab8-d1a2306c41d2",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Priya_Event_management_associate_dye4bi.png",
    name: "SHARVANI  B",
    designation: "Associate",
    position: "Event Management",
    linkedinUrl:
      "https://www.linkedin.com/in/priya-battula2-b3b5a9373?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "24pa1a1223@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 13,
    logo: "https://in.pinterest.com/pin/1070519773933825890/",
    dept_rank: 3,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
  },

  // ── Logistics & Operations ──
  {
    id: "275b7876-bbeb-4f8b-8718-ed9221386b29",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Kowshik_L_O_lead_sqqsjq.png",
    name: "KOWSHIK R",
    designation: "Lead",
    position: "Logistics & Operations",
    linkedinUrl: "https://www.linkedin.com/in/kowshik-repaka-a529032b8",
    mail: "23pa1a04e1@vishnu.edu.in",
    bgColor: "#FFE7A5",
    rank: 14,
    logo: "https://in.pinterest.com/pin/604326843787281796/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png",
  },
  {
    id: "8d7b2290-d136-4348-8f86-76cf63d6deb2",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Manjunath_L_O_co-lead_zjp1ts.png",
    name: "MANJUNATHA A",
    designation: "Co Lead",
    position: "Logistics & Operations",
    linkedinUrl:
      "https://www.linkedin.com/in/alle-manjunatha-reddy-5091052a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "23pa1a1208@vishnu.edu.in",
    bgColor: "#FFE7A5",
    rank: 14,
    logo: "https://in.pinterest.com/pin/604326843787281796/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png",
  },

  // ── Marketing & Outreach ──
  {
    id: "756727f1-8412-4e3d-9b9d-aa1a4d088fd5",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/GuruPraneeth_marketing_lead_hkufop.png",
    name: "GURUPRANEETH CH",
    designation: "Lead",
    position: "Marketing & Outreach",
    linkedinUrl: "https://www.linkedin.com/in/chunduru-gurupraneeth-ab1709325",
    mail: "24pa1a0552@vishnu.edu.in",
    bgColor: "#CCF6C5",
    rank: 15,
    logo: "https://in.pinterest.com/pin/439523244898104295/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3079/3079126.png",
  },
  {
    id: "e486f19a-455a-4404-9fb3-41e66666ec6d",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/Keerthi_marketing_co-lead_fekjtt.png",
    name: "MARY KEERTHI G",
    designation: "Associate",
    position: "Marketing & Outreach",
    linkedinUrl:
      "https://www.linkedin.com/in/keerthi-gannabathula-291b79294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    mail: "23pa1a1267@vishnu.edu.in",
    bgColor: "#CCF6C5",
    rank: 15,
    logo: "https://in.pinterest.com/pin/439523244898104295/",
    dept_rank: 3,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/3079/3079126.png",
  },

  // ── Videography & Editing ──
  {
    id: "a1b31147-c9b4-4295-b720-c264d5d3af71",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/kartheek_videography_lead_wzzlmy.png",
    name: "KARTHEEK CH",
    designation: "Lead",
    position: "Videography & Editing",
    linkedinUrl:
      "https://www.linkedin.com/in/kartheek-chilukuri-692865290?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2hKDSf2KTJyNtF4oKz9QmA%3D%3D",
    mail: "23pa1a1238@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 16,
    logo: "https://in.pinterest.com/pin/202873158210150838/",
    dept_rank: 1,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1179/1179069.png",
  },
  {
    id: "fa4186ca-bce5-4e39-a595-bf93eec7368d",
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/vaibhav_videography_co-lead_o1kp1s.png",
    name: "VAIBHAV G",
    designation: "Co Lead",
    position: "Videography & Editing",
    linkedinUrl:
      "https://www.linkedin.com/in/g-vaibhav-baba43342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    mail: "23pa1a1269@vishnu.edu.in",
    bgColor: "#F8D8D8",
    rank: 16,
    logo: "https://in.pinterest.com/pin/202873158210150838/",
    dept_rank: 2,
    dept_logo: "https://cdn-icons-png.flaticon.com/512/1179/1179069.png",
  },
];

async function main() {
  const db = getAdminDb();
  const batch = db.batch();

  console.log(`Seeding ${teamMembers.length} team members...\n`);

  for (const member of teamMembers) {
    const { id, ...data } = member;
    const ref = db.collection("team_members").doc(id);
    batch.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(
      `  Queued: ${member.name} (${member.position} — ${member.designation})`,
    );
  }

  await batch.commit();
  console.log(`\nAll ${teamMembers.length} team members seeded successfully!`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
