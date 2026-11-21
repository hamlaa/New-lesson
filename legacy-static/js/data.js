/* =====================================================================
   NEW LESSON — CONTENT FILE
   ---------------------------------------------------------------------
   Everything you can see on the website is written here.
   Edit text between the quotes "..." and save the file. Refresh the
   browser to see your changes. No other file needs to change.

   • To ADD a member   → copy one { ... } block inside `members`,
                         paste it at the end, and change its values.
   • To REMOVE a member → delete their { ... } block.
   • To CHANGE a photo → put the new photo in assets/images/ and
                         update the `image` path (or reuse the same name).

   Tip: every block in a list must be separated by a comma ( , ).
   ===================================================================== */

const partyData = {
  /* ---------- Party & school ---------- */
  partyName: "NEW LESSON",
  partyNameThai: "พรรคนิวเลสซั่น",
  slogan: "A New Chapter. A Better School.",
  schoolName: "Ko Samui School",
  schoolNameThai: "โรงเรียนเกาะสมุย",
  electionLabel: "Student Council Election 2026",
  ballotNumber: "1",                    // Your number on the ballot
  electionDate: "Election Day · Friday 12 December 2026",

  /* ---------- Images ---------- */
  logo: "assets/images/party-logo.png",
  heroImage: "assets/images/hero-background.jpg",
  heroForeground: "assets/images/hero-island.png",
  cloudImages: ["assets/images/cloud-01.png", "assets/images/cloud-02.png"],

  /* ---------- Colours (optional) ----------
     Change these to re-theme the whole website. */
  theme: {
    primary: "#69BDF5",    // Sky Blue
    secondary: "#B9E1FF",  // Light Blue
    background: "#FFFFFF", // White
    text: "#173B63",       // Deep Navy
    accent: "#EAF6FF",     // Soft Blue
  },

  /* ---------- Section 1: Hero ---------- */
  hero: {
    eyebrow: "Student Council Election 2026",
    headline: "A NEW LESSON *BEGINS.*",
    subtitle: "A New Chapter. A Better School.",
    scrollLabel: "Meet Our Team",
  },

  /* ---------- Section 2: About the party ---------- */
  intro: {
    kicker: "Chapter 01 — The Party",
    title: "School is where we learn. Student council is where we *learn to lead.*",
    statement:
      "NEW LESSON is a team of students who believe every voice in Ko Samui School deserves to be heard. We are not here to make speeches. We are here to listen, to plan, and to do the small, real things that make each school day better — together.",
    philosophy:
      "Every student is both a learner and a teacher. The best ideas for our school come from the people who live it every day.",
    vision:
      "A school where every student feels proud, heard, and excited to come to class — a campus that grows with its students.",
    mission:
      "Listen first. Act with transparency. Turn student ideas into real projects, and report back on every promise we make.",
    sloganMarquee: "A New Chapter ✦ A Better School ✦ The Future Starts With Us ✦",
  },

  /* ---------- Section headings ----------
     Tip: wrap words in *asterisks* to show them in the elegant
     italic accent style, e.g. "Promises we will *actually keep.*" */
  teamSection: {
    kicker: "Chapter 02 — Meet the Team",
    title: "The people writing *the next chapter.*",
    lead: "One shared plan, many different strengths. Scroll to meet each candidate — one lesson at a time.",
  },
  policySection: {
    kicker: "Chapter 03 — Our Promises",
    title: "Promises we will *actually keep.*",
    lead: "Practical, achievable ideas shaped by conversations with students from every grade.",
  },

  /* ---------- Section 3: Members ----------
     Fields:
       id           – unique number
       number       – the number shown large on the page (e.g. "01")
       name         – full name
       nameThai     – (optional) full name in Thai
       nickname     – nickname
       position     – role in the party
       image        – photo path (portrait, ideally 4:5, e.g. 1000×1250 px)
       description  – a short introduction
       responsibilities – list of duties (add or remove lines freely)
       slogan       – (optional) personal slogan; delete the line to hide it
       layout       – (optional) "a", "b", "c" or "d" to choose a design.
                      If left out, layouts rotate automatically.
  */
  members: [
    {
      id: 1,
      number: "01",
      name: "Thanakorn Wongsawat",
      nameThai: "ธนกร วงศ์สวัสดิ์",
      nickname: "Tonkla",
      position: "Party Leader · Student Council President",
      image: "assets/images/member-01.jpg",
      description:
        "Grade 11 science student, debate club captain, and the first one to volunteer when something needs fixing. Tonkla started NEW LESSON with one simple question: what if the student council actually reported back?",
      responsibilities: [
        "Leads the council and represents students to the school board",
        "Hosts the monthly open Town Hall",
        "Tracks every campaign promise on a public progress board",
      ],
      slogan: "Leaders listen first.",
    },
    {
      id: 2,
      number: "02",
      name: "Pimchanok Srisuk",
      nameThai: "พิมพ์ชนก ศรีสุข",
      nickname: "Pim",
      position: "Vice President",
      image: "assets/images/member-02.jpg",
      description:
        "Organised three charity runs on the island and still finds time to tutor junior students in English. Pim believes that big change is just many small, kind actions in a row.",
      responsibilities: [
        "Supports the President and leads council meetings when needed",
        "Coordinates between grade representatives",
        "Runs the peer tutoring programme",
      ],
      slogan: "Small steps, big chapters.",
    },
    {
      id: 3,
      number: "03",
      name: "Napat Chaiyaporn",
      nameThai: "ณภัทร ชัยพร",
      nickname: "Nine",
      position: "Secretary",
      image: "assets/images/member-03.jpg",
      description:
        "Notebook always open, calendar always up to date. Nine makes sure ideas don't get lost between the meeting room and real life.",
      responsibilities: [
        "Records and publishes meeting notes for every student",
        "Manages the council calendar and announcements",
        "Runs the digital Student Voice box",
      ],
      slogan: "If it's written down, it gets done.",
    },
    {
      id: 4,
      number: "04",
      name: "Kanokwan Rattanakul",
      nameThai: "กนกวรรณ รัตนกุล",
      nickname: "Fah",
      position: "Treasurer",
      image: "assets/images/member-04.jpg",
      description:
        "Math olympiad team member and the school's unofficial spreadsheet queen. Fah wants every baht of the student budget to be visible and well spent.",
      responsibilities: [
        "Plans and manages the student council budget",
        "Publishes a clear spending report every term",
        "Finds sponsors for student events",
      ],
      slogan: "Open books, honest numbers.",
    },
    {
      id: 5,
      number: "05",
      name: "Siwakorn Thongdee",
      nameThai: "ศิวกร ทองดี",
      nickname: "Bank",
      position: "Head of Activities & Sports",
      image: "assets/images/member-05.jpg",
      description:
        "Football team midfielder and sports day MC. Bank wants every student — not just the athletes — to find something they love to do after class.",
      responsibilities: [
        "Plans sports day, festivals and club week",
        "Supports new student clubs",
        "Organises inter-school friendly matches",
      ],
      slogan: "Everyone plays. Everyone belongs.",
    },
    {
      id: 6,
      number: "06",
      name: "Chanisa Boonmee",
      nameThai: "ชนิสา บุญมี",
      nickname: "Mint",
      position: "Head of Public Relations",
      image: "assets/images/member-06.jpg",
      description:
        "Photographer, designer and the voice behind the party's social media. Mint makes sure every student knows what the council is doing — and how to get involved.",
      responsibilities: [
        "Runs the council's social media and notice boards",
        "Designs posters and campaign materials",
        "Collects student feedback after every event",
      ],
      slogan: "Good ideas deserve to be seen.",
    },
  ],

  /* ---------- Section 4: Policies ----------
     icon options: book, chat, leaf, star, drop, heart, users, trophy,
                   wifi, bus, sun, calendar
  */
  policies: [
    {
      title: "Open Study Rooms",
      category: "Academics",
      icon: "book",
      description:
        "Quiet, air-conditioned study rooms open until 17:30 before exams, with peer tutors from every grade.",
    },
    {
      title: "Digital Student Voice Box",
      category: "Student Voice",
      icon: "chat",
      description:
        "Send ideas and problems anonymously with a QR code. Every message is read, and answers are posted every Friday.",
    },
    {
      title: "Green Samui Campus",
      category: "Environment",
      icon: "leaf",
      description:
        "Fewer single-use plastics, more trees and recycling stations — a campus as beautiful as our island.",
    },
    {
      title: "Club & Festival Week",
      category: "Activities",
      icon: "star",
      description:
        "A full week each semester for clubs to perform, exhibit and recruit — music, art, robotics and more.",
    },
    {
      title: "Free Water Refill Stations",
      category: "Facilities",
      icon: "drop",
      description:
        "Clean, cold drinking water on every floor so no student needs to buy bottled water again.",
    },
    {
      title: "Peer Wellbeing Network",
      category: "Wellbeing",
      icon: "heart",
      description:
        "Trained student listeners and a calm corner for anyone who needs to talk, rest or simply breathe.",
    },
    {
      title: "Monthly Town Hall",
      category: "Student Voice",
      icon: "users",
      description:
        "An open meeting every month where any student can ask the council anything — and get a real answer.",
    },
    {
      title: "Sports for Everyone",
      category: "Activities",
      icon: "trophy",
      description:
        "Fun leagues and lunchtime games open to all skill levels, not just the school teams.",
    },
  ],

  /* ---------- Section 5: Closing ---------- */
  closing: {
    kicker: "Chapter 04 — Your Vote",
    headline: "THE FUTURE STARTS *WITH US.*",
    text: "On election day, turn the page with us. Vote NEW LESSON and write the next chapter of Ko Samui School together.",
    ctaLabel: "Vote NEW LESSON",
    ctaLink: "#policies",
  },

  footerNote: "A student council campaign website. Made by students, for students.",

  /* ---------- Social media ----------
     platform options (for the icon): instagram, facebook, tiktok, line, youtube, x
     Replace "#" with your real links. */
  socials: [
    { platform: "instagram", label: "Instagram", url: "#" },
    { platform: "facebook", label: "Facebook", url: "#" },
    { platform: "tiktok", label: "TikTok", url: "#" },
    { platform: "line", label: "LINE OpenChat", url: "#" },
  ],
};
