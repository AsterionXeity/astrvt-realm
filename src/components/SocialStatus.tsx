import { mailchimp, socialStatus } from "@/resources";
import {
  Button,
  Heading,
  Text,
  Background,
  Column,
  Row,
} from "@once-ui-system/core";
import type { opacity, SpacingToken } from "@once-ui-system/core";
import { getYouTubeSubs, getTwitchFollowers } from "@/lib/social";

export const SocialStatus = async ({ ...flex }: React.ComponentProps<typeof Column>) => {
  if (!socialStatus.display) return null;

  const liveYoutubeSubs = await getYouTubeSubs(socialStatus.youtube.link);
  const liveTwitchFollowers = await getTwitchFollowers(socialStatus.twitch.link);

  return (
    <Column
      overflow="hidden"
      fillWidth
      paddingY="24"
      paddingX="32"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}>
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
      <Column maxWidth="m" horizontal="center" align="center" marginBottom="16">
        <Heading marginBottom="4" variant="display-strong-xs">
          {socialStatus.title}
        </Heading>
        <Text
          wrap="balance"
          variant="body-default-m"
          onBackground="neutral-weak">
          {socialStatus.description}
        </Text>
      </Column>

      <Row
        gap="16"
        fillWidth
        horizontal="center"
        s={{ direction: "column", align: "center" }}>
        <Column
          align="center"
          paddingY="12"
          paddingX="16"
          background="neutral-alpha-weak"
          radius="m"
          border="neutral-alpha-weak"
          flex={1}>
          <Heading variant="display-strong-l" marginBottom="2">
            {liveYoutubeSubs || socialStatus.youtube.subs}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak" marginBottom="12">
            YouTube Subscribers
          </Text>
          <Button
            href={socialStatus.youtube.link}
            prefixIcon="youtube"
            size="s"
            variant="secondary"
            fillWidth>
            Subscribe
          </Button>
        </Column>

        <Column
          align="center"
          paddingY="12"
          paddingX="16"
          background="neutral-alpha-weak"
          radius="m"
          border="neutral-alpha-weak"
          flex={1}>
          <Heading variant="display-strong-l" marginBottom="2">
            {liveTwitchFollowers || socialStatus.twitch.subs}
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak" marginBottom="12">
            Twitch Followers
          </Text>
          <Button
            href={socialStatus.twitch.link}
            prefixIcon="twitch"
            size="s"
            variant="secondary"
            fillWidth>
            Follow
          </Button>
        </Column>
      </Row>
    </Column>
  );
};
