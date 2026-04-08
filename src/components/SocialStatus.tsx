import { mailchimp, socialStatus } from "@/resources";
import { Button, Heading, Text, Background, Column, Row } from "@once-ui-system/core";
import type { opacity, SpacingToken } from "@once-ui-system/core";

export const SocialStatus: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  if (!socialStatus.display) return null;

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth="m" horizontal="center" align="center" marginBottom="32">
        <Heading marginBottom="s" variant="display-strong-xs">
          {socialStatus.title}
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          {socialStatus.description}
        </Text>
      </Column>
      
      <Row gap="24" fillWidth horizontal="center" s={{ direction: "column", align: "center" }}>
        <Column align="center" padding="24" background="neutral-alpha-weak" radius="m" border="neutral-alpha-weak" flex={1}>
          <Heading variant="display-strong-xl" marginBottom="4">{socialStatus.youtube.subs}</Heading>
          <Text onBackground="neutral-weak" marginBottom="16">YouTube Subscribers</Text>
          <Button href={socialStatus.youtube.link} prefixIcon="youtube" size="m" variant="secondary" fillWidth>Subscribe</Button>
        </Column>

        <Column align="center" padding="24" background="neutral-alpha-weak" radius="m" border="neutral-alpha-weak" flex={1}>
          <Heading variant="display-strong-xl" marginBottom="4">{socialStatus.twitch.subs}</Heading>
          <Text onBackground="neutral-weak" marginBottom="16">Twitch Followers</Text>
          <Button href={socialStatus.twitch.link} prefixIcon="twitch" size="m" variant="secondary" fillWidth>Follow</Button>
        </Column>
      </Row>
    </Column>
  );
};
