import type {
  About,
  Blog,
  Gallery,
  Home,
  Newsletter,
  SocialStatusConfig,
  Person,
  Social,
  Work,
} from "@/types";
import React from "react";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Asterion",
  lastName: "Nightcaller",
  name: "Asterion Nightcaller",
  role: "VTuber / Producer / Software Dev / Engineer",
  avatar: "/images/avatar.jpg",
  email: "[lynkazoyuu@gmail.com]",
  location: "Europe/Amsterdam", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Japanese"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Youtube Channel</>,
  description: <>My weekly updates about VTubing and tech</>,
};

const socialStatus: SocialStatusConfig = {
  display: true,
  title: <>Join the Community</>,
  description: <>Follow my channels and join our growing community of VTuber enthusiasts.</>,
  youtube: {
    subs: "1.5K",
    link: "https://www.youtube.com/@AsterionVT"
  },
  twitch: {
    subs: "500",
    link: "https://www.twitch.tv/asterionvt"
  }
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "YouTube",
    icon: "youtube",
    link: "https://www.youtube.com/@AsterionVT",
    essential: true,
  },
  {
    name: "Twitter",
    icon: "twitter",
    link: "https://twitter.com/AsterionVT",
    essential: true,
  },
  {
    name: "Twitch",
    icon: "twitch",
    link: "https://www.twitch.tv/asterionvt",
    essential: true,
  },
  {
    name: "BlueSky",
    icon: "threads",
    link: "https://bsky.app/profile/asterionvt.kawaii.social",
    essential: true,
  },
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/AsterionXeity",
    essential: true,
  },
  {
    name: "Social Link",
    icon: "link",
    link: "https://solo.to/asterionvt",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Demonic Elf Astral Lord~ VStreamer | Producer | Artist</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      I'm Selene, a design engineer at{" "}
      <Text as="span" size="xl" weight="strong">
        ONCE UI
      </Text>
      , where I craft intuitive <br /> user experiences. After hours, I build my
      own projects.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/asterionvt",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        SWith 2 years of experience in the tech industry, I have worked on
        various projects, variorums from web development to mobile apps and
        backend systems. My expertise lies in JavaScript, CSS, HTML, Node.js,
        and I am always looking for new challenges to further develop my skills.
        After hours, I build my own projects.
      </>
    ),
  },
  work: {
    display: false, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "FLY",
        timeframe: "2022 - Present",
        role: "Senior Design Engineer",
        achievements: [
          <React.Fragment key="achieve-1">
            Redesigned the UI/UX for the FLY platform, resulting in a 20%
            increase in user engagement and 30% faster load times.
          </React.Fragment>,
          <React.Fragment key="achieve-2">
            Spearheaded the integration of AI tools into design workflows,
            enabling designers to iterate 50% faster.
          </React.Fragment>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Creativ3",
        timeframe: "2018 - 2022",
        role: "Lead Designer",
        achievements: [
          <React.Fragment key="achieve-3">
            Developed a design system that unified the brand across multiple
            platforms, improving design consistency by 40%.
          </React.Fragment>,
          <React.Fragment key="achieve-4">
            Led a cross-functional team to launch a new product line,
            contributing to a 15% increase in overall company revenue.
          </React.Fragment>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "MBO Utrecht",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Software Developer",
        description: <>Studied Developing apps and websites.</>,
      },
    ],
  },
  technical: {
    display: false, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: (
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: (
          <>Building next gen apps with Next.js + Once UI + Supabase.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "Supabase",
            icon: "supabase",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, socialStatus, home, about, blog, work, gallery };
