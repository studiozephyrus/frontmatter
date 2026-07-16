"use client";

import { useState, useCallback, useEffect } from "react";
import { useHotkey } from "./use-hotkey";
import { Spotlight } from "./Spotlight";
import { CommandPalette } from "./CommandPalette";
import { GraphView } from "@/modules/graph";
import { SearchPanel } from "./SearchPanel";
import { LinkDoctorModal } from "./LinkDoctorModal";
import { TrashModal } from "@/modules/vault";
import { SettingsModal } from "./SettingsModal";
import { ImportModal } from "./ImportModal";

/**
 * KnowledgeUI — a client island that owns Spotlight and CommandPalette state.
 * Renders nothing visible until a hotkey fires.
 *
 * Cmd+K → opens Spotlight (quick note switcher)
 * Cmd+P → opens CommandPalette (command runner)
 */
export function KnowledgeUI(): React.ReactNode {
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const openSpotlight = useCallback(() => {
    setPaletteOpen(false);
    setSpotlightOpen(true);
  }, []);

  const openPalette = useCallback(() => {
    setSpotlightOpen(false);
    setPaletteOpen(true);
  }, []);

  const openGraph = useCallback(() => {
    setSpotlightOpen(false);
    setPaletteOpen(false);
    setGraphOpen(true);
  }, []);

  const closeSpotlight = useCallback(() => setSpotlightOpen(false), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeGraph = useCallback(() => setGraphOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeDoctor = useCallback(() => setDoctorOpen(false), []);
  const closeTrash = useCallback(() => setTrashOpen(false), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeImport = useCallback(() => setImportOpen(false), []);

  useHotkey("mod+k", openSpotlight);
  useHotkey("mod+p", openPalette);
  useHotkey("mod+g", openGraph);

  // Listen for the sgnk:open-graph custom event dispatched by CommandPalette
  useEffect(() => {
    function handleOpenGraph() {
      setGraphOpen(true);
    }
    window.addEventListener("sgnk:open-graph", handleOpenGraph);
    return () => window.removeEventListener("sgnk:open-graph", handleOpenGraph);
  }, []);

  // Listen for the sgnk:open-search custom event dispatched by CommandPalette
  useEffect(() => {
    function handleOpenSearch() {
      setSearchOpen(true);
    }
    window.addEventListener("sgnk:open-search", handleOpenSearch);
    return () => window.removeEventListener("sgnk:open-search", handleOpenSearch);
  }, []);

  // Listen for the sgnk:open-link-doctor custom event dispatched by CommandPalette
  useEffect(() => {
    function handleOpenDoctor() {
      setDoctorOpen(true);
    }
    window.addEventListener("sgnk:open-link-doctor", handleOpenDoctor);
    return () => window.removeEventListener("sgnk:open-link-doctor", handleOpenDoctor);
  }, []);

  // Listen for the sgnk:open-trash custom event dispatched by CommandPalette
  useEffect(() => {
    function handleOpenTrash() {
      setTrashOpen(true);
    }
    window.addEventListener("sgnk:open-trash", handleOpenTrash);
    return () => window.removeEventListener("sgnk:open-trash", handleOpenTrash);
  }, []);

  // Settings + Import modals (command palette events)
  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    const openImport = () => setImportOpen(true);
    window.addEventListener("sgnk:open-settings", openSettings);
    window.addEventListener("sgnk:open-import", openImport);
    return () => {
      window.removeEventListener("sgnk:open-settings", openSettings);
      window.removeEventListener("sgnk:open-import", openImport);
    };
  }, []);

  // Native (Tauri) menu → palette/spotlight, which are otherwise hotkey-only.
  useEffect(() => {
    window.addEventListener("sgnk:command-palette", openPalette);
    window.addEventListener("sgnk:spotlight", openSpotlight);
    return () => {
      window.removeEventListener("sgnk:command-palette", openPalette);
      window.removeEventListener("sgnk:spotlight", openSpotlight);
    };
  }, [openPalette, openSpotlight]);

  return (
    <>
      <Spotlight open={spotlightOpen} onClose={closeSpotlight} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <GraphView open={graphOpen} onClose={closeGraph} />
      <SearchPanel open={searchOpen} onClose={closeSearch} />
      <LinkDoctorModal open={doctorOpen} onClose={closeDoctor} />
      <TrashModal open={trashOpen} onClose={closeTrash} />
      <SettingsModal open={settingsOpen} onClose={closeSettings} />
      <ImportModal open={importOpen} onClose={closeImport} />
    </>
  );
}
