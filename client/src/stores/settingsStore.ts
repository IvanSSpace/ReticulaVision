import { create } from "zustand"

type ColorFilters = {
  blackAndWhite: boolean
  negative: boolean
}

interface Settings {
  colorFilters: ColorFilters
  blurEffects: any
  brightnessAndContrast: any
  noiseAndDetails: any
}

interface SettingsStore {
  settings: Settings
  setColorFilters: (colorFilters: ColorFilters) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    colorFilters: {
      blackAndWhite: false,
      negative: false,
    },
    blurEffects: {},
    brightnessAndContrast: {},
    noiseAndDetails: {},
  },

  // setColorFilters: (colorFilters: ColorFilters) => set({ settings: { ...settings, colorFilters } }),
  setColorFilters: (colorFilters: ColorFilters) =>
    set((state) => ({
      settings: { ...state.settings, colorFilters },
    })),
}))
