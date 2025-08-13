
import React from 'react';
import { ProcessedGameData } from '../types';

interface DataTableProps {
  data: ProcessedGameData[];
  columns: (keyof ProcessedGameData | 'gameLabelsData_Drops and Wins')[];
}

const columnDisplayNames: Partial<Record<keyof ProcessedGameData | 'gameLabelsData_Drops and Wins', string>> = {
  gameCode: "Game Code",
  name: "Name",
  isActive: "Active",
  mobileGameCode: "Mobile Game Code",
  seoFriendlyGameName: "SEO Friendly Name",
  defaultGameImage: "Default Game Image URL",
  gameProvider: "Game Provider",
  desktopGameType: "Desktop Type",
  mobileGameType: "Mobile Type",
  liveLaunchAlias: "Live Launch Alias", 
  bingoGameType: "Bingo Type", 
  vfGameType: "VF Game Type",   
  jackpotCode: "Jackpot Code",
  demoModeSupport: "Demo Mode Support",
  gameMode: "Game Mode",
  urlCustomParameters: "URL Custom Params",
  isExcludedFromPGG: "Excluded PGG", 
  isExcludedFromSitemap: "Excluded Sitemap",
  deviceAvailability_mobile: "Mobile Available",
  deviceAvailability_tablet: "Tablet Available",
  deviceAvailability_desktop: "Desktop Available",
  browserAvailability_edge: "Edge Available",
  browserAvailability_safari: "Safari Available",
  browserAvailability_chrome: "Chrome Available",
  browserAvailability_firefox: "Firefox Available",
  browserAvailability_other: "Other Browser Available",
  osAvailability_ios: "iOS Available",
  osAvailability_macintosh: "Mac Available",
  osAvailability_android: "Android Available",
  osAvailability_windows: "Windows Available",
  osAvailability_other: "Other OS Available",

  landscape_layout1x1_mainImage: "L 1x1 Main",
  landscape_layout1x1_mobileImage: "L 1x1 Mobile",
  landscape_layout1x1_guestMainImage: "L 1x1 Guest Main",
  landscape_layout1x1_guestMobileImage: "L 1x1 Guest Mobile",
  landscape_layout1x2_mainImage: "L 1x2 Main",
  landscape_layout1x2_mobileImage: "L 1x2 Mobile",
  landscape_layout1x2_guestMainImage: "L 1x2 Guest Main",
  landscape_layout1x2_guestMobileImage: "L 1x2 Guest Mobile",
  landscape_layout2x1_mainImage: "L 2x1 Main",
  landscape_layout2x1_mobileImage: "L 2x1 Mobile",
  landscape_layout2x1_guestMainImage: "L 2x1 Guest Main",
  landscape_layout2x1_guestMobileImage: "L 2x1 Guest Mobile",
  landscape_layout2x2_mainImage: "L 2x2 Main",
  landscape_layout2x2_mobileImage: "L 2x2 Mobile",
  landscape_layout2x2_guestMainImage: "L 2x2 Guest Main",
  landscape_layout2x2_guestMobileImage: "L 2x2 Guest Mobile",

  portrait_layout1x1_mainImage: "P 1x1 Main",
  portrait_layout1x1_mobileImage: "P 1x1 Mobile",
  portrait_layout1x1_guestMainImage: "P 1x1 Guest Main",
  portrait_layout1x1_guestMobileImage: "P 1x1 Guest Mobile",
  portrait_layout1x2_mainImage: "P 1x2 Main",
  portrait_layout1x2_mobileImage: "P 1x2 Mobile",
  portrait_layout1x2_guestMainImage: "P 1x2 Guest Main",
  portrait_layout1x2_guestMobileImage: "P 1x2 Guest Mobile",
  portrait_layout2x1_mainImage: "P 2x1 Main",
  portrait_layout2x1_mobileImage: "P 2x1 Mobile",
  portrait_layout2x1_guestMainImage: "P 2x1 Guest Main",
  portrait_layout2x1_guestMobileImage: "P 2x1 Guest Mobile",
  portrait_layout2x2_mainImage: "P 2x2 Main",
  portrait_layout2x2_mobileImage: "P 2x2 Mobile",
  portrait_layout2x2_guestMainImage: "P 2x2 Guest Main",
  portrait_layout2x2_guestMobileImage: "P 2x2 Guest Mobile",

  square_layout1x1_mainImage: "S 1x1 Main",
  square_layout1x1_mobileImage: "S 1x1 Mobile",
  square_layout1x1_guestMainImage: "S 1x1 Guest Main",
  square_layout1x1_guestMobileImage: "S 1x1 Guest Mobile",
  square_layout1x2_mainImage: "S 1x2 Main",
  square_layout1x2_mobileImage: "S 1x2 Mobile",
  square_layout1x2_guestMainImage: "S 1x2 Guest Main",
  square_layout1x2_guestMobileImage: "S 1x2 Guest Mobile",
  square_layout2x1_mainImage: "S 2x1 Main",
  square_layout2x1_mobileImage: "S 2x1 Mobile",
  square_layout2x1_guestMainImage: "S 2x1 Guest Main",
  square_layout2x1_guestMobileImage: "S 2x1 Guest Mobile",
  square_layout2x2_mainImage: "S 2x2 Main",
  square_layout2x2_mobileImage: "S 2x2 Mobile",
  square_layout2x2_guestMainImage: "S 2x2 Guest Main",
  square_layout2x2_guestMobileImage: "S 2x2 Guest Mobile",

  articleId: "Article ID", // Renamed from slotId
  mobileArticleId: "Mobile Article ID",
  description: "Description",
  isGameNew: "Is Game New", 
  isGamePopular: "Popular",
  isGameHot: "Hot",
  isGameExclusive: "Game Exclusive",
  'gameLabelsData_Drops and Wins': "Drops & Wins Label", // Key with space
  gameLabelsData_RisingStar: "Rising Star Label",
  gameLabelsData_Exclusive: "Exclusive Label",
  gameLabelsData_New: "New Label",
  gamesCustomFields_provider: "Custom Provider",
  gamesCustomFields_externalProviderGameId: "Custom Ext. Provider ID", // Renamed
};


export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return <p className="text-slate-400 italic">No data to display.</p>;
  }

  return (
    <div className="overflow-x-auto bg-slate-700 rounded-md shadow">
      <table className="min-w-full divide-y divide-slate-600">
        <thead className="bg-slate-800">
          <tr>
            {columns.map((key) => (
              <th
                key={String(key)} // Use String(key) for key prop for safety with spaced keys
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider whitespace-nowrap"
              >
                {columnDisplayNames[key] || String(key).replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-700 divide-y divide-slate-600">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-slate-700' : 'bg-slate-750'} hover:bg-slate-600 transition-colors`}>
              {columns.map((key) => (
                <td key={String(key)} className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
                  {key === 'defaultGameImage' || (typeof row[key as keyof ProcessedGameData] === 'string' && (row[key as keyof ProcessedGameData] as string).includes('file/')) ? (
                    <a 
                      href={String(row[key as keyof ProcessedGameData])} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#66acde] transition-opacity hover:opacity-80 hover:underline break-all"
                      title={String(row[key as keyof ProcessedGameData])}
                    >
                      {String(row[key as keyof ProcessedGameData]).length > 50 ? String(row[key as keyof ProcessedGameData]).substring(0, 47) + '...' : String(row[key as keyof ProcessedGameData])}
                    </a>
                  ) : (
                    String(row[key as keyof ProcessedGameData] === undefined || row[key as keyof ProcessedGameData] === null ? '' : row[key as keyof ProcessedGameData])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};