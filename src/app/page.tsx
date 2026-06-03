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
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { SocialStatus, InteractiveMesh } from "@/components";
import { Analytics } from "@vercel/analytics/next"
import { getTwitchLiveStatus } from "@/lib/social";

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
  const twitchStatus = await getTwitchLiveStatus("asterionvt");

  return (
    <>
      <InteractiveMesh />
      <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <RevealFx translateY="8" fillWidth>
        <Media
          src="/images/gallery/Asterionvt - EYE BANNER.jpg"
          alt="AsterionVT Eye Banner"
          aspectRatio="original"
          radius="l"
          className="material-card"
        />
      </RevealFx>
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {twitchStatus.isLive ? (
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
                    background: "rgba(145, 70, 255, 0.15)",
                    border: "1px solid rgba(145, 70, 255, 0.3)",
                    backdropFilter: "blur(8px)",
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
          ) : (
            home.featured.display && (
              <RevealFx
                fillWidth
                horizontal="center"
                paddingTop="16"
                paddingBottom="32"
                paddingLeft="12"
              >
                <Badge
                  background="brand-alpha-weak"
                  paddingX="12"
                  paddingY="4"
                  onBackground="neutral-strong"
                  textVariant="label-default-s"
                  arrow={false}
                  href={home.featured.href}
                >
                  <Row paddingY="2">{home.featured.title}</Row>
                </Badge>
              </RevealFx>
            )
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
      <SocialStatus />
    </Column>
    </>
  );
}
