"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, Row, ToggleButton, IconButton, SmartLink, Text, Button, Column } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, gallery, social, sameAs } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export { TimeDisplay };

export const Header = () => {
  const pathname = usePathname() ?? "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const githubLink = social.find((item) => item.name === "GitHub")?.link;
  const discordLink = "https://discord.gg/zexADsHXJN";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Row
        fitHeight
        className={styles.headerContainer}
        position="sticky"
        as="header"
        zIndex={10}
        fillWidth
        horizontal="center"
        borderBottom="neutral-alpha-weak"
        background="transparent"
      >
        <Row
          fillWidth
          maxWidth="m"
          horizontal="between"
          vertical="center"
          paddingX="24"
          paddingY="16"
          gap="24"
        >
          {/* Left Section: Logo, Location, Time & Theme Switcher */}
          <Flex gap="16" vertical="center" flex={1}>
            <SmartLink href="/">
              <Row gap="2" vertical="center">
                <Text variant="body-default-m" weight="strong" onBackground="neutral-strong">
                  {person.firstName}
                </Text>
                <Text variant="body-default-m" weight="strong" onBackground="brand-medium">
                  .
                </Text>
              </Row>
            </SmartLink>
            {(display.location || display.time) && (
              <Row s={{ hide: true }} vertical="center" gap="12" suppressHydrationWarning>
                {display.location && (
                  <>
                    <Line background="neutral-alpha-medium" vert maxHeight="16" />
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {person.location}
                    </Text>
                  </>
                )}
                {display.time && (
                  <>
                    <Line background="neutral-alpha-medium" vert maxHeight="16" />
                    <Row className={styles.timeWrapper} textVariant="body-default-s" onBackground="neutral-weak">
                      <TimeDisplay timeZone={person.location} />
                    </Row>
                  </>
                )}
              </Row>
            )}
          </Flex>

          {/* Center Section (Desktop): Nav links */}
          <Row s={{ hide: true }} gap="8" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
            {routes["/about"] && (
              <ToggleButton
                href="/about"
                label={about.label}
                selected={pathname === "/about"}
                variant="ghost"
              />
            )}
            {routes["/content"] && (
              <ToggleButton
                href="/content"
                label={work.label}
                selected={pathname.startsWith("/content")}
                variant="ghost"
              />
            )}
            {routes["/gallery"] && (
              <ToggleButton
                href="/gallery"
                label={gallery.label}
                selected={pathname.startsWith("/gallery")}
                variant="ghost"
              />
            )}
          </Row>

          {/* Right Section (Desktop): Socials */}
          <Row s={{ hide: true }} gap="12" vertical="center" textVariant="body-default-s" flex={1} horizontal="end" suppressHydrationWarning>
            {display.themeSwitcher && (
              <>
                <ThemeToggle />
                <Line background="neutral-alpha-medium" vert maxHeight="16" />
              </>
            )}
            {githubLink && (
              <ToggleButton
                href={githubLink}
                label="GitHub"
                suffixIcon="arrowUpRight"
                variant="ghost"
              />
            )}

            {discordLink && (
              <Button
                href={discordLink}
                label="Join Discord"
                prefixIcon="discord"
                size="s"
                variant="secondary"
              />
            )}
          </Row>

          {/* Right Section (Mobile): Menu Toggle */}
          <Row hide s={{ hide: false }} gap="12" vertical="center">
            {display.themeSwitcher && <ThemeToggle />}
            <IconButton
              icon={isMobileMenuOpen ? "close" : "menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              aria-label="Toggle mobile menu"
            />
          </Row>
        </Row>
      </Row>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <Column
          position="fixed"
          className={styles.mobileOverlay}
          zIndex={9}
          fillWidth
          padding="24"
          gap="24"
          background="page"
          suppressHydrationWarning
        >
          {/* Mobile links in a vertical layout */}
          <Column gap="8" fillWidth>
            {routes["/"] && (
              <ToggleButton
                href="/"
                label="Home"
                selected={pathname === "/"}
                variant="ghost"
                fillWidth
                horizontal="start"
              />
            )}
            {routes["/about"] && (
              <ToggleButton
                href="/about"
                label={about.label}
                selected={pathname === "/about"}
                variant="ghost"
                fillWidth
                horizontal="start"
              />
            )}
            {routes["/content"] && (
              <ToggleButton
                href="/content"
                label={work.label}
                selected={pathname.startsWith("/content")}
                variant="ghost"
                fillWidth
                horizontal="start"
              />
            )}
            {routes["/gallery"] && (
              <ToggleButton
                href="/gallery"
                label={gallery.label}
                selected={pathname.startsWith("/gallery")}
                variant="ghost"
                fillWidth
                horizontal="start"
              />
            )}
          </Column>

          <Line background="neutral-alpha-weak" fillWidth />

          {/* Mobile time & location */}
          {(display.location || display.time) && (
            <Column gap="4" fillWidth paddingX="8">
              {display.location && (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Location: {person.location}
                </Text>
              )}
              {display.time && (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Time: <TimeDisplay timeZone={person.location} />
                </Text>
              )}
            </Column>
          )}

          {/* Mobile external links */}
          <Column gap="12" fillWidth>
            {githubLink && (
              <Button
                href={githubLink}
                label="GitHub"
                prefixIcon="github"
                size="m"
                variant="secondary"
                fillWidth
              />
            )}
            {discordLink && (
              <Button
                href={discordLink}
                label="Join Discord"
                prefixIcon="discord"
                size="m"
                variant="secondary"
                fillWidth
              />
            )}
          </Column>
        </Column>
      )}
    </>
  );
};
