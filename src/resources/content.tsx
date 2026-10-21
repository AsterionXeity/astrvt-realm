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
  firstName: "AsterionVT",
  lastName: "Voidcaller",
  name: "Asterion Voidcaller",
  role: "VTuber / Producer / Software Dev / Engineer",
  avatar: "/images/gallery/asterion-portrait-smile.png",
  email: "[lynkazoyuu@gmail.com]",
  location: "Europe/Amsterdam", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Japanese"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Youtube Channel</>,
  description: <>Yippeee Video's</>,
};

const socialStatus: SocialStatusConfig = {
  display: true,
  title: <>Join the Community</>,
  description: (
    <>
      Follow my channels and stay updated.
    </>
  ),
  youtube: {
    subs: "1.5K",
    link: "https://www.youtube.com/@AsterionVT",
  },
  twitch: {
    subs: "500",
    link: "https://www.twitch.tv/asterionvt",
  },
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
    name: "Twitch",
    icon: "twitch",
    link: "https://www.twitch.tv/asterionvt",
    essential: true,
  },
  {
    name: "Twitter",
    icon: "twitter",
    link: "https://twitter.com/AsterionVT",
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
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/api/og/generate",
  label: "Home",
  title: `${person.name} | VTuber Realm`,
  description: `${person.name}'s official VTuber Realm — Astral Elf wanderer, content creator, live streams, music & socials hub.`,
  headline: <>AsterionVT</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">AsterionVT</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          New Content
        </Text>
      </Row>
    ),
    href: "/content",
  },
  subline: (
    <>
      An Astral Elf that was lost floating in space wondering what existence can bring, loves to do magick and reach limits beyond the stars~
    </>
  ),
};

const about: About = {
  path: "/about",
  image: "/images/gallery/asterion-portrait-smile.png",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
    image: "/images/gallery/asterion-portrait-smile.png",
  },
  calendar: {
    display: false,
    link: "https://cal.com/asterionvt",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        "A fallen guardian of the moon, The Astral called once more."
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
  lore: {
    display: true, // set to false to hide this section
    title: "Lore (WIP)",
    description: (
      <>
        Once a high elf star scholar, Asterion gazed too long into the abyss of the void, where whispers promised power beyond comprehension. The pact transformed them, their skin now carries the cosmos, horns grew as a mark of the demonic bond, and their eyes burn like twin embers. They wander between realms, collecting “soul dust”, which they channel through music, games, and stories.
      </>
    ),
  },
  personality: {
    display: true, // set to false to hide this section
    title: "Personality",
    sections: [
      {
        title: "Likes and Hobbies",
        items: [
          { label: "Activities", value: "VTubing, Producing Music, Gaming" },
          { label: "Likes Playing", value: "Final Fantasy XIV, Arknights: Endfield, RPGs & Horror" },
          { label: "Passions", value: "Anime, Art, Music, Hatsune Miku, Stars" },
          { label: "Aesthetic", value: "Sparkly, Techwear, lots of straps and a long coat." },
        ],
      },
      {
        title: "Dislikes and Boundaries",
        items: [
          { value: "Drama & annoying behavior" },
          { value: "Pushing my boundaries" },
          { value: "Ignorance & abandonment" },
        ],
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
  path: "/content",
  image: "/images/gallery/Asterionvt - EYE BANNER.jpg",
  label: "Content",
  title: `Content – ${person.name}`,
  description: `YouTube videos and live streams by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  image: "/images/gallery/asterion-portrait-smile.png",
  label: "Gallery",
  title: `Art gallery – ${person.name}`,
  description: `Commissioned works of ${person.name}`,
  // Images are automatically sorted based on the file's actual creation/modified date on disk!
  // Artworks created on disk within the last 30 days automatically display a glowing 'NEW' overlay!
  images: [
    {
      src: "/images/gallery/asterion-astral-blade.jpg",
      alt: "Asterion Astral Blade - Night Realm",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/asterion-blade-render.png",
      alt: "Asterion Astral Blade Stance",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/asterion-portrait-smile.png",
      alt: "Asterion Cosmic Smile Portrait",
      orientation: "vertical",
    },

    {
      src: "/images/gallery/1788356736368~2.jpg",
      alt: "Asterion Cosmic Sovereign - Astral Cloak Render",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/Gemini_Generated_Image_ipmaj9ipmaj9ipma.jfif",
      alt: "Asterion Celestial Stare - Cosmic Starlit Illustration",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/YCH Shikanokotantan AsterionVT.gif",
      alt: "Asterion Shikanoko Dance Chibi Animation",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/talking (106).gif",
      alt: "Asterion Animated Talking Model",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/image.png",
      alt: "Dynamic Battle Stance Sketch",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/17834552933151821385665346332784.jpg",
      alt: "Asterion Voidcaller - Dynamis Halicarnass Sticky Note Sketch",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/Lyn.png",
      alt: "Asterion Padoru Holiday Chibi",
      orientation: "vertical",
    },

    {
      src: "/images/gallery/Ref_Sheet.png",
      alt: "Character Reference Sheet",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/asterion.png",
      alt: "Asterion Portrait",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/unnamed (1).jpg",
      alt: "Illustration",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/IMG_6170.PNG",
      alt: "Artwork 2",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/IMG_6129.JPG",
      alt: "Photo",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/Ref_Sheet_clear.png",
      alt: "Character Reference Sheet Clear",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/IMG_6169.PNG",
      alt: "Artwork 1",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/Asterionvt - EYE BANNER.jpg",
      alt: "Eye Banner",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vgenemote.png",
      alt: "VGen Emote",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/Fm8oRljX0AEIxbz.jpeg",
      alt: "Asterion Cosmic Horns Bust Illustration by MBR",
      orientation: "vertical",
    },
  ],
};

export interface HomeLink {
  name: string;
  displayLink: string;
  link: string;
  icon: string;
  color?: string;
}

const homeLinks: HomeLink[] = [
  {
    name: "GET MEDAL",
    displayLink: "medal.tv/code/LYNK",
    link: "https://medal.tv/code/LYNK",
    icon: "medal",
    color: "#ffb000",
  },

  {
    name: "Main Channel",
    displayLink: "youtube.com/@AsterionVT",
    link: "https://youtube.com/@AsterionVT",
    icon: "youtube",
    color: "#ff0000",
  },
  {
    name: "Producer YouTube",
    displayLink: "youtube.com/@ProdAsterVT",
    link: "https://youtube.com/@ProdAsterVT",
    icon: "youtube",
    color: "#ff0000",
  },
  {
    name: "YouTube Music",
    displayLink: "music.youtube.com/channel/UCj7PQ...",
    link: "https://music.youtube.com/channel/UCj7PQT8KHeWrc1h563fjgaw",
    icon: "music",
    color: "#ff0000",
  },
  {
    name: "Spotify",
    displayLink: "open.spotify.com/artist/10wA5...",
    link: "https://open.spotify.com/intl-ja/artist/10wA5dWejWfoslrtQ1pj8Y",
    icon: "spotify",
    color: "#1db954",
  },
  {
    name: "Discord",
    displayLink: "discord.gg/jWptUJmEaB",
    link: "https://discord.gg/jWptUJmEaB",
    icon: "discord",
    color: "#5865f2",
  },
  {
    name: "X",
    displayLink: "x.com/AsterionVT",
    link: "https://x.com/AsterionVT",
    icon: "x",
    color: "#ffffff",
  },
  {
    name: "Bluesky",
    displayLink: "bsky.app/profile/asterionvt.kawaii.social",
    link: "https://bsky.app/profile/asterionvt.kawaii.social",
    icon: "bluesky",
    color: "#3b82f6",
  },

  {
    name: "Donate/Tip",
    displayLink: "streamelements.com/AsterionVT/tip",
    link: "https://streamelements.com/AsterionVT/tip",
    icon: "dollar",
    color: "#00c8ff",
  },
  {
    name: "Vsona/Vgen",
    displayLink: "vsona.co/asterionvt",
    link: "https://vsona.co/asterionvt",
    icon: "link",
    color: "#5865f2",
  },
  {
    name: "VStream",
    displayLink: "vstream.com/c/@AsterionVT",
    link: "https://vstream.com/c/@AsterionVT",
    icon: "link",
    color: "#5865f2",
  },
  {
    name: "Throne Gifting~",
    displayLink: "throne.com/AsterionVT/wishlist",
    link: "https://throne.com/AsterionVT/wishlist",
    icon: "gift",
    color: "#ff66cc",
  },
  {
    name: "OSU! Profile",
    displayLink: "osu.ppy.sh/users/14679254",
    link: "https://osu.ppy.sh/users/14679254",
    icon: "gamepad",
    color: "#ff66aa",
  },
  {
    name: "Steam",
    displayLink: "steamcommunity.com/id/AsterionVT",
    link: "https://steamcommunity.com/id/AsterionVT",
    icon: "steam",
    color: "#66c0f4",
  },
  {
    name: "AniList",
    displayLink: "anilist.co/user/AsterionVT/",
    link: "https://anilist.co/user/AsterionVT/",
    icon: "link",
    color: "#3db4f2",
  },
];

export {
  person,
  social,
  newsletter,
  socialStatus,
  home,
  about,
  blog,
  work,
  gallery,
  homeLinks,
};
