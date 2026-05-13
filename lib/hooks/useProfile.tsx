"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

const DEFAULT_PROFILES: Profile[] = [
  { id: "alex", name: "Alex Chen", avatar: "AC", bio: "DevOps Engineer" },
  { id: "sam", name: "Sam Rivera", avatar: "SR", bio: "Backend Developer" },
  { id: "morgan", name: "Morgan Lee", avatar: "ML", bio: "Platform Engineer" },
];

const PROFILES_KEY = "devops-lms:profiles";
const ACTIVE_KEY = "devops-lms:activeProfileId";

function loadProfiles(): Profile[] {
  if (typeof window === "undefined") return DEFAULT_PROFILES;
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Profile[];
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  // Seed defaults on first load
  localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
  return DEFAULT_PROFILES;
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function makeAvatar(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  createProfile: (name: string, bio: string) => Profile;
  deleteProfile: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);

  useEffect(() => {
    const loaded = loadProfiles();
    setProfiles(loaded);

    const storedActiveId = localStorage.getItem(ACTIVE_KEY);
    const active = loaded.find((p) => p.id === storedActiveId) ?? loaded[0] ?? null;
    setActiveProfileState(active);
    if (active) localStorage.setItem(ACTIVE_KEY, active.id);
  }, []);

  const setActiveProfile = useCallback((profile: Profile) => {
    setActiveProfileState(profile);
    localStorage.setItem(ACTIVE_KEY, profile.id);
  }, []);

  const createProfile = useCallback((name: string, bio: string): Profile => {
    const trimmed = name.trim();
    const newProfile: Profile = {
      id: `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: trimmed,
      avatar: makeAvatar(trimmed),
      bio: bio.trim(),
    };
    setProfiles((prev) => {
      const updated = [...prev, newProfile];
      saveProfiles(updated);
      return updated;
    });
    return newProfile;
  }, []);

  const deleteProfile = useCallback(
    (id: string) => {
      setProfiles((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveProfiles(updated);

        // If we deleted the active profile, switch to the first remaining one
        if (activeProfile?.id === id) {
          const next = updated[0] ?? null;
          setActiveProfileState(next);
          if (next) localStorage.setItem(ACTIVE_KEY, next.id);
          else localStorage.removeItem(ACTIVE_KEY);
        }

        return updated;
      });
    },
    [activeProfile]
  );

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, setActiveProfile, createProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
