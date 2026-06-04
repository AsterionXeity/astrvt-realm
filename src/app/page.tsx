import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
  SmartLink,
  Media,
  Icon,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes, homeLinks } from "@/resources";
import { SocialStatus, InteractiveMesh, FeaturedBadge, ScrollReveal } from "@/components";
import { Analytics } from "@vercel/analytics/next"
import { getTwitchLiveStatus, getLatestYouTubeVideoId, getYouTubeLiveStatus } from "@/lib/social";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function Home() {
  const [twitchStatus, youtubeLiveStatus, latestVideoId] = await Promise.all([
    getTwitchLiveStatus("asterionvt"),
    getYouTubeLiveStatus("AsterionVT"),
    getLatestYouTubeVideoId("AsterionVT"),
  ]);

  return (
    <>
      <InteractiveMesh />
      <FeaturedBadge latestVideoId={latestVideoId} twitchStatus={twitchStatus} youtubeLiveStatus={youtubeLiveStatus} />
      <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={home.image}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <ScrollReveal translateY="8" fillWidth delay={0.15} triggerOnce={true}>
        <Media
          src="/images/gallery/Asterionvt - EYE BANNER.jpg"
          alt="AsterionVT Eye Banner"
          aspectRatio="original"
          radius="l"
          className="material-card"
        />
      </ScrollReveal>
      <ScrollReveal translateY="8" fillWidth delay={0.3} triggerOnce={true}>
        <Column fillWidth horizontal="center" gap="m">
          <Column maxWidth="s" horizontal="center" align="center">
            {twitchStatus.isLive && (
              <RevealFx speed="fast" delay={0.1} fillWidth horizontal="center" paddingTop="16" paddingBottom="32">
                <SmartLink
                  href="https://www.twitch.tv/asterionvt"
                  style={{ textDecoration: "none" }}
                >
                  <Row
                    vertical="center"
                    radius="full"
                    paddingY="8"
                    paddingX="16"
                    gap="12"
                    style={{
                      background: "rgba(145, 70, 255, 0.2)",
                      border: "1px solid rgba(145, 70, 255, 0.35)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 0 15px rgba(145, 70, 255, 0.2)",
                      maxWidth: "100%",
                    }}
                    className="twitch-live-pill"
                  >
                    <Row gap="8" vertical="center">
                      <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ borderRadius: "9999px" }}>
                        LIVE
                      </Badge>
                      <Text weight="strong" style={{ color: "#a970ff" }}>
                        Twitch
                      </Text>
                    </Row>
                    <Line style={{ background: "rgba(145, 70, 255, 0.3)" }} vert height="16" />
                    <Text
                      variant="body-default-s"
                      style={{
                        color: "#e6d6ff",
                        maxWidth: "12rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {twitchStatus.title || "AsterionVT is Live!"}
                    </Text>
                  </Row>
                </SmartLink>
              </RevealFx>
            )}
            <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
              <Heading wrap="balance" variant="display-strong-l">
                {home.headline}
              </Heading>
            </RevealFx>
            <Analytics />
            <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
              <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
                {home.subline}
              </Text>
            </RevealFx>
            <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
              <Button
                id="about"
                data-border="rounded"
                href={about.path}
                variant="secondary"
                size="m"
                weight="default"
                arrowIcon
              >
                <Row gap="8" vertical="center" paddingRight="4">
                  {about.avatar.display && (
                    <Avatar
                      marginRight="8"
                      style={{ marginLeft: "-0.75rem" }}
                      src={person.avatar}
                      size="m"
                    />
                  )}
                  {about.title}
                </Row>
              </Button>
            </RevealFx>
          </Column>
        </Column>
      </ScrollReveal>

      <ScrollReveal translateY="12" fillWidth>
        <SocialStatus />
      </ScrollReveal>

      <Column fillWidth gap="m">
        <ScrollReveal translateY="8" fillWidth>
          <Column gap="xs" fillWidth>
            <Heading variant="display-strong-xs" onBackground="neutral-strong">
              Links
            </Heading>
            <Line />
          </Column>
        </ScrollReveal>

        <div className="home-links-grid">
          {homeLinks.map((link, index) => (
            <ScrollReveal key={link.name} translateY="12" fillWidth>
              <SmartLink href={link.link} className="home-link-card">
                <div className="home-link-card-left">
                  <div 
                    className="home-link-icon-container" 
                    style={{
                      backgroundColor: `${link.color}20`,
                      boxShadow: `0 0 10px ${link.color}15`,
                    }}
                  >
                    <Icon 
                      name={link.icon} 
                      size="s" 
                      style={{ color: link.color || 'var(--neutral-on-background)' }} 
                    />
                  </div>
                  <Column gap="2">
                    <Text weight="strong" variant="body-default-m" onBackground="neutral-strong">
                      {link.name}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {link.displayLink}
                    </Text>
                  </Column>
                </div>
                <Icon name="arrowRight" size="xs" onBackground="neutral-weak" />
              </SmartLink>
            </ScrollReveal>
          ))}
        </div>
      </Column>
    </Column>
    </>
  );
}
