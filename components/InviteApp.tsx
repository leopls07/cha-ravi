"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, PanInfo, motion } from "framer-motion";
import { HASH_TO_SCREEN, SCREEN_HASH, SCREEN_ORDER, ScreenId } from "@/lib/screens";
import { useScrollHint } from "@/lib/useScrollHint";
import { EnvelopeScreen } from "./screens/EnvelopeScreen";
import { CoverScreen } from "./screens/CoverScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { RsvpScreen } from "./screens/RsvpScreen";
import { GiftsScreen } from "./screens/GiftsScreen";
import { PixScreen } from "./screens/PixScreen";
import { MuralScreen } from "./screens/MuralScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ScreenProps } from "./screens/types";
import { Dots } from "./ui/Dots";
import { BottomNav } from "./ui/BottomNav";
import { ScrollHint } from "./ui/ScrollHint";

const SWIPE_THRESHOLD = 60;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHashSnapshot() {
  return window.location.hash;
}

function getHashServerSnapshot() {
  return "";
}

// A URL (via useSyncExternalStore) é a única fonte de verdade da tela atual —
// evita divergência entre o hash renderizado no servidor e o lido no cliente.
function useScreenIndexFromHash(): number {
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot, getHashServerSnapshot);
  const id = HASH_TO_SCREEN[hash.replace(/^#/, "")];
  return id ? SCREEN_ORDER.indexOf(id) : 0;
}

export function InviteApp() {
  const index = useScreenIndexFromHash();
  const [pixValorInicial, setPixValorInicial] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const showScrollHint = useScrollHint(scrollRef, contentEl);

  function goToIndex(nextIndex: number) {
    const clamped = Math.max(0, Math.min(SCREEN_ORDER.length - 1, nextIndex));
    setDirection(clamped >= index ? 1 : -1);
    window.location.hash = SCREEN_HASH[SCREEN_ORDER[clamped]];
  }

  function goTo(id: ScreenId) {
    goToIndex(SCREEN_ORDER.indexOf(id));
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) goToIndex(index + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goToIndex(index - 1);
  }

  const screenId = SCREEN_ORDER[index];
  const baseProps: ScreenProps = {
    onNext: () => goToIndex(index + 1),
    onBack: () => goToIndex(index - 1),
    goTo,
    isFirst: index === 0,
    isLast: index === SCREEN_ORDER.length - 1,
  };

  function renderScreen() {
    switch (screenId) {
      case "envelope":
        return <EnvelopeScreen {...baseProps} />;
      case "capa":
        return <CoverScreen {...baseProps} />;
      case "detalhes":
        return <DetailsScreen {...baseProps} />;
      case "rsvp":
        return <RsvpScreen {...baseProps} />;
      case "presentes":
        return (
          <GiftsScreen
            {...baseProps}
            onPresentear={(valor) => {
              setPixValorInicial(valor > 0 ? valor : null);
              goTo("pix");
            }}
          />
        );
      case "pix":
        return <PixScreen {...baseProps} valorInicial={pixValorInicial} />;
      case "mural":
        return <MuralScreen {...baseProps} />;
      case "quiz":
        return <QuizScreen {...baseProps} />;
      default:
        return null;
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-full min-h-0 flex-col">
        <div
          ref={scrollRef}
          className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden no-scrollbar"
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={screenId}
              ref={setContentEl}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              drag={screenId === "envelope" ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="flex flex-1 flex-col"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
          <ScrollHint visible={showScrollHint} />
        </div>

        {screenId !== "envelope" && (
          <div className="shrink-0 border-t border-linha bg-creme">
            <div className="flex justify-center py-2">
              <Dots total={SCREEN_ORDER.length} activeIndex={index} onSelect={goToIndex} />
            </div>
            <BottomNav current={screenId} onSelect={goTo} />
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
