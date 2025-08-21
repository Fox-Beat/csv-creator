import { ProcessedGameData, GameProviderFolderMapping } from '../types';
import { INPUT_HEADER_MAPPINGS, CORE_REQUIRED_INPUT_HEADER_KEYS } from '../constants';

function generateSeoFriendlyName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/™/g, '') // Remove trademark symbol
    .replace(/®/g, '') // Remove registered symbol
    .replace(/©/g, '') // Remove copyright symbol
    .replace(/%/g, '')  // Remove percentage sign
    .replace(/&/g, 'and') // Replace ampersand
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric, keeping spaces and hyphens
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces (single or multiple) with a single hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

function parseBooleanString(value: string | undefined, defaultValue: boolean = false): boolean {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    const lowerValue = value.trim().toLowerCase();
    if (lowerValue === 'true' || lowerValue === '1') {
        return true;
    }
    if (lowerValue === 'false' || lowerValue === '0') {
        return false;
    }
    return defaultValue;
}


export function parsePastedData(
  text: string,
  providerMap: GameProviderFolderMapping // Accept providerMap as an argument
): ProcessedGameData[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error("Data must include a header row and at least one data row.");
  }

  const headerCells = lines[0].split('\t').map(cell => cell.trim());
  const headerIndices: { [internalKey: string]: number } = {};
  const missingRequiredHeaders: string[] = [];

  for (const internalKey in INPUT_HEADER_MAPPINGS) {
    const expectedHeader = INPUT_HEADER_MAPPINGS[internalKey as keyof typeof INPUT_HEADER_MAPPINGS];
    const index = headerCells.indexOf(expectedHeader);
    if (index !== -1) {
      headerIndices[internalKey] = index;
    } else {
      if (CORE_REQUIRED_INPUT_HEADER_KEYS.includes(internalKey as keyof typeof INPUT_HEADER_MAPPINGS)) {
        missingRequiredHeaders.push(expectedHeader);
      }
    }
  }

  if (missingRequiredHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingRequiredHeaders.join(', ')}.`);
  }
  
  const processedGames: ProcessedGameData[] = [];

  // This map defines how to rename providers for the final output CSV.
  // The key is the lower-cased input provider name.
  // The value is the desired display name.
  const providerDisplayNameMap: { [key: string]: string } = {
    'pragmatic': 'Pragmatic Play',
    'konami via sg': 'Konami',
    'high5 via sg': 'High 5',
    'sg': 'Light and Wonder',
    'elk studios via lnw': 'ELK Studios',
    'peter & sons': 'Peter and Sons',
    'hacksaw': 'Hacksaw',
    'hacksaw openrgs': 'Hacksaw',
  };

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('\t');
    
    const getCellValue = (internalKey: keyof typeof INPUT_HEADER_MAPPINGS): string | undefined => {
      const index = headerIndices[internalKey];
      return index !== undefined ? cells[index]?.trim() : undefined;
    };

    const gameCode = getCellValue('GAME_CODE');
    const name = getCellValue('NAME');
    const originalGameProvider = getCellValue('GAME_PROVIDER'); 

    if (!gameCode || !name || !originalGameProvider) {
      console.warn(`Skipping line ${i + 1}: Missing core data (gameCode, name, or gameProvider).`);
      continue;
    }

    const lowerCaseProvider = originalGameProvider.trim().toLowerCase();

    // Normalize the game provider name for the final output using the map.
    // If a mapping exists, use it; otherwise, use the original provider name.
    const finalGameProvider = providerDisplayNameMap[lowerCaseProvider] || originalGameProvider;

    let seoFriendlyGameName = getCellValue('SEO_FRIENDLY_GAME_NAME');
    if (!seoFriendlyGameName) {
      seoFriendlyGameName = generateSeoFriendlyName(name);
    }

    let defaultGameImage = '';
    const defaultUserImageValue = getCellValue('DEFAULT_USER_IMAGE');

    if (defaultUserImageValue) {
        if (
            defaultUserImageValue.startsWith('http://') ||
            defaultUserImageValue.startsWith('https://')
        ) {
            defaultGameImage = defaultUserImageValue;
        } else {
            let path = defaultUserImageValue.trim();
            // Normalize by removing any leading slash to start clean
            if (path.startsWith('/')) {
                path = path.substring(1);
            }
            // If the path already includes the 'library' root, just ensure it has a leading slash.
            if (path.toLowerCase().startsWith('library/')) {
                defaultGameImage = `/${path}`;
            } else {
                // Otherwise, prepend '/library/'
                defaultGameImage = `/library/${path}`;
            }
        }
    } else {
      const folderNameFromMap = providerMap[originalGameProvider]; // Use the passed providerMap
      const providerFolderName = folderNameFromMap || originalGameProvider; 
      const encodedFolderName = encodeURIComponent(providerFolderName);
      defaultGameImage = `/library/Game%20Icons/${encodedFolderName}/${gameCode}.webp`;
    }
    
    const mobileGameCode = getCellValue('MOBILE_GAME_CODE') || gameCode;

    let desktopGameTypeFinal = "POP";
    let mobileGameTypeFinal = "POP";
    let liveLaunchAliasValue = getCellValue('LIVE_LAUNCH_ALIAS'); 

    if (lowerCaseProvider === "playtech") {
      desktopGameTypeFinal = "GPAS";
      mobileGameTypeFinal = "GPAS";
    } else if (lowerCaseProvider === "playtech live") {
      desktopGameTypeFinal = "LIVE";
      mobileGameTypeFinal = "LIVE";
      liveLaunchAliasValue = gameCode; 
    }

    const rowData: ProcessedGameData = {
      gameCode, 
      name,
      gameProvider: finalGameProvider, 
      mobileGameCode,
      seoFriendlyGameName,
      defaultGameImage,
      isActive: true,
      isExcludedFromPGG: parseBooleanString(getCellValue('IS_EXCLUDED_FROM_PGG')),
      isExcludedFromSitemap: false, 
      deviceAvailability_mobile: true,
      deviceAvailability_tablet: true,
      deviceAvailability_desktop: true,
      browserAvailability_edge: true,
      browserAvailability_safari: true,
      browserAvailability_chrome: true,
      browserAvailability_firefox: true,
      browserAvailability_other: true,
      osAvailability_ios: true,
      osAvailability_macintosh: true,
      osAvailability_android: true,
      osAvailability_windows: true,
      osAvailability_other: true,
      isGameNew: parseBooleanString(getCellValue('IS_GAME_NEW'), true), 
      isGamePopular: parseBooleanString(getCellValue('IS_GAME_POPULAR')),
      isGameHot: parseBooleanString(getCellValue('IS_GAME_HOT')),
      isGameExclusive: parseBooleanString(getCellValue('IS_GAME_EXCLUSIVE')),

      desktopGameType: desktopGameTypeFinal,
      mobileGameType: mobileGameTypeFinal,
      liveLaunchAlias: liveLaunchAliasValue, 
      bingoGameType: getCellValue('BINGO_GAME_TYPE'),
      vfGameType: getCellValue('RTP_GAME_TYPE'), 
      jackpotCode: getCellValue('JACKPOT_CODE'),
      demoModeSupport: "unavailable", 
      gameMode: "default", 
      urlCustomParameters: getCellValue('URL_CUSTOM_PARAMETERS'),
      
      landscape_layout1x1_mainImage: getCellValue('LANDSCAPE_LAYOUT_1X1_MAIN_IMAGE'),
      landscape_layout1x1_mobileImage: getCellValue('LANDSCAPE_LAYOUT_1X1_MOBILE_IMAGE'),
      landscape_layout1x1_guestMainImage: getCellValue('LANDSCAPE_LAYOUT_1X1_GUEST_MAIN_IMAGE'),
      landscape_layout1x1_guestMobileImage: getCellValue('LANDSCAPE_LAYOUT_1X1_GUEST_MOBILE_IMAGE'),
      landscape_layout1x2_mainImage: getCellValue('LANDSCAPE_LAYOUT_1X2_MAIN_IMAGE'),
      landscape_layout1x2_mobileImage: getCellValue('LANDSCAPE_LAYOUT_1X2_MOBILE_IMAGE'),
      landscape_layout1x2_guestMainImage: getCellValue('LANDSCAPE_LAYOUT_1X2_GUEST_MAIN_IMAGE'),
      landscape_layout1x2_guestMobileImage: getCellValue('LANDSCAPE_LAYOUT_1X2_GUEST_MOBILE_IMAGE'),
      landscape_layout2x1_mainImage: getCellValue('LANDSCAPE_LAYOUT_2X1_MAIN_IMAGE'),
      landscape_layout2x1_mobileImage: getCellValue('LANDSCAPE_LAYOUT_2X1_MOBILE_IMAGE'),
      landscape_layout2x1_guestMainImage: getCellValue('LANDSCAPE_LAYOUT_2X1_GUEST_MAIN_IMAGE'),
      landscape_layout2x1_guestMobileImage: getCellValue('LANDSCAPE_LAYOUT_2X1_GUEST_MOBILE_IMAGE'),
      landscape_layout2x2_mainImage: getCellValue('LANDSCAPE_LAYOUT_2X2_MAIN_IMAGE'),
      landscape_layout2x2_mobileImage: getCellValue('LANDSCAPE_LAYOUT_2X2_MOBILE_IMAGE'),
      landscape_layout2x2_guestMainImage: getCellValue('LANDSCAPE_LAYOUT_2X2_GUEST_MAIN_IMAGE'),
      landscape_layout2x2_guestMobileImage: getCellValue('LANDSCAPE_LAYOUT_2X2_GUEST_MOBILE_IMAGE'),
      
      portrait_layout1x1_mainImage: getCellValue('PORTRAIT_LAYOUT_1X1_MAIN_IMAGE'),
      portrait_layout1x1_mobileImage: getCellValue('PORTRAIT_LAYOUT_1X1_MOBILE_IMAGE'),
      portrait_layout1x1_guestMainImage: getCellValue('PORTRAIT_LAYOUT_1X1_GUEST_MAIN_IMAGE'),
      portrait_layout1x1_guestMobileImage: getCellValue('PORTRAIT_LAYOUT_1X1_GUEST_MOBILE_IMAGE'),
      portrait_layout1x2_mainImage: getCellValue('PORTRAIT_LAYOUT_1X2_MAIN_IMAGE'),
      portrait_layout1x2_mobileImage: getCellValue('PORTRAIT_LAYOUT_1X2_MOBILE_IMAGE'),
      portrait_layout1x2_guestMainImage: getCellValue('PORTRAIT_LAYOUT_1X2_GUEST_MAIN_IMAGE'),
      portrait_layout1x2_guestMobileImage: getCellValue('PORTRAIT_LAYOUT_1X2_GUEST_MOBILE_IMAGE'),
      portrait_layout2x1_mainImage: getCellValue('PORTRAIT_LAYOUT_2X1_MAIN_IMAGE'),
      portrait_layout2x1_mobileImage: getCellValue('PORTRAIT_LAYOUT_2X1_MOBILE_IMAGE'),
      portrait_layout2x1_guestMainImage: getCellValue('PORTRAIT_LAYOUT_2X1_GUEST_MAIN_IMAGE'),
      portrait_layout2x1_guestMobileImage: getCellValue('PORTRAIT_LAYOUT_2X1_GUEST_MOBILE_IMAGE'),
      portrait_layout2x2_mainImage: getCellValue('PORTRAIT_LAYOUT_2X2_MAIN_IMAGE'),
      portrait_layout2x2_mobileImage: getCellValue('PORTRAIT_LAYOUT_2X2_MOBILE_IMAGE'),
      portrait_layout2x2_guestMainImage: getCellValue('PORTRAIT_LAYOUT_2X2_GUEST_MAIN_IMAGE'),
      portrait_layout2x2_guestMobileImage: getCellValue('PORTRAIT_LAYOUT_2X2_GUEST_MOBILE_IMAGE'),

      square_layout1x1_mainImage: getCellValue('SQUARE_LAYOUT_1X1_MAIN_IMAGE'),
      square_layout1x1_mobileImage: getCellValue('SQUARE_LAYOUT_1X1_MOBILE_IMAGE'),
      square_layout1x1_guestMainImage: getCellValue('SQUARE_LAYOUT_1X1_GUEST_MAIN_IMAGE'),
      square_layout1x1_guestMobileImage: getCellValue('SQUARE_LAYOUT_1X1_GUEST_MOBILE_IMAGE'),
      square_layout1x2_mainImage: getCellValue('SQUARE_LAYOUT_1X2_MAIN_IMAGE'),
      square_layout1x2_mobileImage: getCellValue('SQUARE_LAYOUT_1X2_MOBILE_IMAGE'),
      square_layout1x2_guestMainImage: getCellValue('SQUARE_LAYOUT_1X2_GUEST_MAIN_IMAGE'),
      square_layout1x2_guestMobileImage: getCellValue('SQUARE_LAYOUT_1X2_GUEST_MOBILE_IMAGE'),
      square_layout2x1_mainImage: getCellValue('SQUARE_LAYOUT_2X1_MAIN_IMAGE'),
      square_layout2x1_mobileImage: getCellValue('SQUARE_LAYOUT_2X1_MOBILE_IMAGE'),
      square_layout2x1_guestMainImage: getCellValue('SQUARE_LAYOUT_2X1_GUEST_MAIN_IMAGE'),
      square_layout2x1_guestMobileImage: getCellValue('SQUARE_LAYOUT_2X1_GUEST_MOBILE_IMAGE'),
      square_layout2x2_mainImage: getCellValue('SQUARE_LAYOUT_2X2_MAIN_IMAGE'),
      square_layout2x2_mobileImage: getCellValue('SQUARE_LAYOUT_2X2_MOBILE_IMAGE'),
      square_layout2x2_guestMainImage: getCellValue('SQUARE_LAYOUT_2X2_GUEST_MAIN_IMAGE'),
      square_layout2x2_guestMobileImage: getCellValue('SQUARE_LAYOUT_2X2_GUEST_MOBILE_IMAGE'),
      
      articleId: getCellValue('ARTICLE_ID'),
      mobileArticleId: getCellValue('MOBILE_ARTICLE_ID'),
      description: getCellValue('DESCRIPTION'),
      ['gameLabelsData_Drops and Wins']: getCellValue('GAMELABELS_DROPS_AND_WINS'),
      gameLabelsData_RisingStar: getCellValue('GAMELABELS_RISING_STAR'),
      gameLabelsData_Exclusive: getCellValue('GAMELABELS_EXCLUSIVE'),
      gameLabelsData_New: getCellValue('GAMELABELS_NEW'),
      gamesCustomFields_provider: getCellValue('GAMESCUSTOMFIELDS_PROVIDER'),
      gamesCustomFields_externalProviderGameId: getCellValue('GAMESCUSTOMFIELDS_EXTERNALPROVIDERGAMEID'),
    };
    processedGames.push(rowData);
  }
  return processedGames;
}

export function generateCsvContent(
  data: ProcessedGameData[],
  columns: (keyof ProcessedGameData | 'gameLabelsData_Drops and Wins')[]
): string {
  if (data.length === 0) return '';

  const header = columns.join('\t') + '\n';
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col as keyof ProcessedGameData]; 
      
      if (typeof value === 'boolean') {
        return String(value).toLowerCase();
      }
      let cellValue = (value === undefined || value === null) ? '' : String(value);
      cellValue = cellValue.replace(/\t/g, ' ').replace(/\n/g, ' '); 
      return cellValue;
    }).join('\t');
  }).join('\n');

  return header + rows;
}