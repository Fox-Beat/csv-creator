
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { ActionButton } from './components/ActionButton';
import { DataTable } from './components/DataTable';
import { ProcessIcon } from './components/icons/ProcessIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { TableIcon } from './components/icons/TableIcon';
import { ClearIcon } from './components/icons/ClearIcon';
import { ProcessedGameData, GameProviderFolderMapping } from './types';
import { GAME_PROVIDER_TO_FOLDER_MAP_CA, GAME_PROVIDER_TO_FOLDER_MAP_COM, APP_TITLE, OUTPUT_CSV_COLUMNS, PLACEHOLDER_INFO_REQUIRED_COLUMNS } from './constants';
import { parsePastedData, generateCsvContent } from './services/dataProcessor';

const App: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [processedData, setProcessedData] = useState<ProcessedGameData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleProcessData = useCallback(async (providerMapToUse: GameProviderFolderMapping, context: string) => {
    if (!rawText.trim()) {
      setError("Input data cannot be empty.");
      setProcessedData([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setProcessedData([]); // Clear previous results

    console.log(`Processing for context: ${context} using map:`, providerMapToUse);

    try
    {
      await new Promise(resolve => setTimeout(resolve, 100)); 
      const data = parsePastedData(rawText, providerMapToUse);
      setProcessedData(data);
      if (data.length === 0 && !error) { 
         setError("No valid data rows found or core required headers are missing. " + PLACEHOLDER_INFO_REQUIRED_COLUMNS);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(`Error processing data: ${e.message}`);
      } else {
        setError("An unknown error occurred during processing.");
      }
      setProcessedData([]);
    } finally {
      setIsLoading(false);
    }
  }, [rawText, error]); // error is a dependency because it's checked in the if condition

  const handleDownloadCsv = useCallback(() => {
    if (processedData.length === 0) {
      setError("No data to download.");
      return;
    }
    try {
      const csvContent = generateCsvContent(processedData, OUTPUT_CSV_COLUMNS);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      const fileName = `processed_game_data_${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Error generating CSV: ${e.message}`);
      } else {
        setError("An unknown error occurred while generating CSV.");
      }
    }
  }, [processedData]);

  const handleClearData = useCallback(() => {
    setRawText('');
    setProcessedData([]);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      <Header title={APP_TITLE} subtitle="Paste tab-separated game data from Monday.com." />
      
      <main className="w-full max-w-5xl mt-8 space-y-8">
        <section className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-[#66acde] mb-4">1. Paste Game Data</h2>
          <TextInputArea
            value={rawText}
            onChange={setRawText}
            placeholder={`Paste your tab-separated game data here. Ensure the first row contains all necessary headers. ${PLACEHOLDER_INFO_REQUIRED_COLUMNS}`}
          />
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <ActionButton
              onClick={() => handleProcessData(GAME_PROVIDER_TO_FOLDER_MAP_CA, ".CA")}
              disabled={isLoading || !rawText.trim()}
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:text-slate-500 transition-colors"
              icon={<ProcessIcon />}
            >
              {isLoading ? 'Processing...' : 'Process: .CA'}
            </ActionButton>
            <ActionButton
              onClick={() => handleProcessData(GAME_PROVIDER_TO_FOLDER_MAP_COM, ".COM")}
              disabled={isLoading || !rawText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-slate-500 transition-colors"
              icon={<ProcessIcon />}
            >
              {isLoading ? 'Processing...' : 'Process: .COM'}
            </ActionButton>
            <ActionButton
              onClick={handleClearData}
              disabled={!rawText.trim() && processedData.length === 0 && !error}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:text-slate-500 transition-colors ml-auto"
              icon={<ClearIcon />}
              title="Clear input and results"
            >
              Clear Data
            </ActionButton>
          </div>
        </section>

        {error && (
          <section className="bg-red-800 p-4 rounded-lg shadow-md text-red-100">
            <h3 className="font-semibold">Error:</h3>
            <p>{error}</p>
          </section>
        )}

        {isLoading && (
           <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#66acde]"></div>
            <p className="ml-3 text-sky-300">Processing data, please wait...</p>
          </div>
        )}

        {!isLoading && processedData.length > 0 && (
          <section className="bg-slate-800 p-6 rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <TableIcon className="w-8 h-8 text-[#66acde] mr-3" />
              <h2 className="text-2xl font-semibold text-[#66acde]">2. Processed Data Preview</h2>
            </div>
            <DataTable data={processedData} columns={OUTPUT_CSV_COLUMNS} />
            <ActionButton
              onClick={handleDownloadCsv}
              disabled={processedData.length === 0}
              className="mt-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-slate-500 transition-colors"
              icon={<DownloadIcon />}
            >
              Download CSV
            </ActionButton>
          </section>
        )}
         {!isLoading && processedData.length === 0 && rawText.trim() && !error && (
            <section className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
                 <p className="text-slate-400">No data to display. Please check your input or click one of the process buttons. If you've processed data and see this, there might have been no valid rows meeting criteria.</p>
            </section>
        )}
      </main>
       <footer className="w-full max-w-5xl mt-12 py-6 border-t border-slate-700 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Created by Bob Fox. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
