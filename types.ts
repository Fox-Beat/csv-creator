export interface ProcessedGameData {
  // Core fields
  gameCode: string; // From input 'gameCode'
  name: string; // From input 'name'
  isActive: boolean; // Hardcoded to true
  mobileGameCode?: string; // From input 'mobileGameCode' or defaults to gameCode
  seoFriendlyGameName: string; // From input 'seoFriendlyGameName' or generated
  defaultGameImage: string; // Generated or from 'defaultUserImage'

  // Game details
  desktopGameType?: string;
  mobileGameType?: string;
  liveLaunchAlias?: string;
  bingoGameType?: string;
  vfGameType?: string;
  jackpotCode?: string;
  demoModeSupport?: string; // Hardcoded to "unavailable"
  gameMode?: string; // Hardcoded to "default"
  gameProvider?: string; // From input 'gameProvider'
  urlCustomParameters?: string;
  isExcludedFromPGG: boolean;
  isExcludedFromSitemap: boolean; // Parsed to boolean

  // Availability - all parsed to boolean
  deviceAvailability_mobile: boolean;
  deviceAvailability_tablet: boolean;
  deviceAvailability_desktop: boolean;
  browserAvailability_edge: boolean;
  browserAvailability_safari: boolean;
  browserAvailability_chrome: boolean;
  browserAvailability_firefox: boolean;
  browserAvailability_other: boolean;
  osAvailability_ios: boolean;
  osAvailability_macintosh: boolean;
  osAvailability_android: boolean;
  osAvailability_windows: boolean;
  osAvailability_other: boolean;

  // Image URLs
  landscape_layout1x1_mainImage?: string;
  landscape_layout1x1_mobileImage?: string;
  landscape_layout1x1_guestMainImage?: string;
  landscape_layout1x1_guestMobileImage?: string;
  landscape_layout1x2_mainImage?: string;
  landscape_layout1x2_mobileImage?: string;
  landscape_layout1x2_guestMainImage?: string;
  landscape_layout1x2_guestMobileImage?: string;
  landscape_layout2x1_mainImage?: string;
  landscape_layout2x1_mobileImage?: string;
  landscape_layout2x1_guestMainImage?: string;
  landscape_layout2x1_guestMobileImage?: string;
  landscape_layout2x2_mainImage?: string;
  landscape_layout2x2_mobileImage?: string;
  landscape_layout2x2_guestMainImage?: string;
  landscape_layout2x2_guestMobileImage?: string;

  portrait_layout1x1_mainImage?: string;
  portrait_layout1x1_mobileImage?: string;
  portrait_layout1x1_guestMainImage?: string;
  portrait_layout1x1_guestMobileImage?: string;
  portrait_layout1x2_mainImage?: string;
  portrait_layout1x2_mobileImage?: string;
  portrait_layout1x2_guestMainImage?: string;
  portrait_layout1x2_guestMobileImage?: string;
  portrait_layout2x1_mainImage?: string;
  portrait_layout2x1_mobileImage?: string;
  portrait_layout2x1_guestMainImage?: string;
  portrait_layout2x1_guestMobileImage?: string;
  portrait_layout2x2_mainImage?: string;
  portrait_layout2x2_mobileImage?: string;
  portrait_layout2x2_guestMainImage?: string;
  portrait_layout2x2_guestMobileImage?: string;

  square_layout1x1_mainImage?: string;
  square_layout1x1_mobileImage?: string;
  square_layout1x1_guestMainImage?: string;
  square_layout1x1_guestMobileImage?: string;
  square_layout1x2_mainImage?: string;
  square_layout1x2_mobileImage?: string;
  square_layout1x2_guestMainImage?: string;
  square_layout1x2_guestMobileImage?: string;
  square_layout2x1_mainImage?: string;
  square_layout2x1_mobileImage?: string;
  square_layout2x1_guestMainImage?: string;
  square_layout2x1_guestMobileImage?: string;
  square_layout2x2_mainImage?: string;
  square_layout2x2_mobileImage?: string;
  square_layout2x2_guestMainImage?: string;
  square_layout2x2_guestMobileImage?: string;
  
  // Other metadata
  articleId?: string; // Renamed from slotId
  mobileArticleId?: string;
  description?: string;
  isGameNew: boolean;
  isGamePopular: boolean; // Parsed to boolean
  isGameHot: boolean; // Parsed to boolean
  isGameExclusive: boolean; // Game-level exclusive flag, parsed to boolean

  // Labels
  ['gameLabelsData_Drops and Wins']?: string; // Property name with space for exact CSV header
  gameLabelsData_RisingStar?: string;
  gameLabelsData_Exclusive?: string; // Label specific exclusive
  gameLabelsData_New?: string;

  // Custom fields
  gamesCustomFields_provider?: string;
  gamesCustomFields_externalProviderGameId?: string; // Renamed from gamesCustomFields_providerGameId
}

export interface GameProviderFolderMapping {
  [providerName: string]: string;
}