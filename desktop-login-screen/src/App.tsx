import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
  FiHome,
  FiMinus,
  FiRefreshCw,
  FiSearch,
  FiX,
} from 'react-icons/fi';

const WINDOWS_START_URL = 'https://www.bing.com/search?q=Windows+11';
const SEARCH_ENGINE = 'https://www.bing.com/search?q=';

type BrowserMode = 'web' | 'search' | 'message';

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

function WindowsLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Windows 11 Start">
      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#61D7FF" />
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#34C3FF" />
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#2CB4FF" />
      <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#0B8FFF" />
    </svg>
  );
}

function ThisComputerIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Este Computador">
      <defs>
        <linearGradient id="monitorScreen" x1="8" y1="8" x2="56" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#53D6FF" />
          <stop offset="1" stopColor="#1D8FFF" />
        </linearGradient>
        <linearGradient id="monitorBase" x1="20" y1="42" x2="44" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D7E3F3" />
          <stop offset="1" stopColor="#8CA1B8" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="48" height="30" rx="4" fill="url(#monitorScreen)" stroke="#175FA8" strokeWidth="2" />
      <rect x="28" y="40" width="8" height="7" rx="2" fill="#A4B6C9" />
      <path d="M22 50C22 48.8954 22.8954 48 24 48H40C41.1046 48 42 48.8954 42 50V51H22V50Z" fill="url(#monitorBase)" />
      <rect x="18" y="51" width="28" height="5" rx="2.5" fill="#DCE5EF" stroke="#96A8BC" />
      <path d="M12 13H52" stroke="white" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EdgeIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Edge">
      <defs>
        <radialGradient id="edgeGradA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(46 16) rotate(137) scale(48 42)">
          <stop stopColor="#62E3A6" />
          <stop offset="1" stopColor="#18C7D2" />
        </radialGradient>
        <linearGradient id="edgeGradB" x1="14" y1="52" x2="46" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A5BD3" />
          <stop offset="1" stopColor="#1AA7F8" />
        </linearGradient>
        <linearGradient id="edgeGradC" x1="23" y1="33" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0C4FC3" />
          <stop offset="1" stopColor="#0A67F7" />
        </linearGradient>
      </defs>
      <path d="M52.7 24.8C50.5 14.7 41.4 7 30.7 7C18.4 7 8.4 17 8.4 29.3C8.4 31.2 8.7 33.1 9.1 34.8C12.1 27.3 20.2 22 29.6 22C39 22 45.8 26.9 48.8 34.1C50.7 38.7 50.7 43.4 49.6 47.1C54.2 43.2 57 37.5 57 31.2C57 28.9 55.5 26.6 52.7 24.8Z" fill="url(#edgeGradA)" />
      <path d="M49.8 42.5C49.8 51.4 42.2 57 33.7 57C23.4 57 16.3 50.2 16.3 42.3C16.3 34.4 22.9 28.4 32.3 28.4C36.2 28.4 39.2 29.1 41.9 30.8C40.5 24.1 34.3 19.1 26.9 19.1C16.9 19.1 9 27.3 9 37.6C9 48.8 18.3 57.8 31.5 57.8C46.7 57.8 55.2 47.5 55.2 39.2C55.2 37.4 54.9 35.7 54.3 34.1C52 35.4 49.8 38.2 49.8 42.5Z" fill="url(#edgeGradB)" />
      <path d="M45.4 42.4C45.4 48.2 40.4 51.8 33.7 51.8C27.9 51.8 23.1 48.7 23.1 43.8C23.1 39.1 27.1 35.9 32.6 35.9C37.1 35.9 39.8 37.3 41.6 39.5C40.6 34.5 35.8 30.9 30 30.9C23.1 30.9 17.9 35.8 17.9 42.4C17.9 49.6 24.2 54.8 32.8 54.8C41 54.8 47.7 49.8 49.4 42.6C48.2 42.3 46.8 42.2 45.4 42.4Z" fill="url(#edgeGradC)" />
      <path d="M47.2 38.8C45.1 34.7 40.5 32 35 32C27.3 32 21.6 36.9 21.6 43.7C21.6 44.4 21.7 45.1 21.8 45.7C24.2 41.4 28.8 38.5 34.1 38.5C38.8 38.5 43.1 40.6 45.8 44C47.1 42.4 47.6 40.6 47.2 38.8Z" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function ExplorerIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Explorador de Arquivos">
      <path d="M8 20C8 16.6863 10.6863 14 14 14H26L31 20H50C53.3137 20 56 22.6863 56 26V45C56 48.3137 53.3137 51 50 51H14C10.6863 51 8 48.3137 8 45V20Z" fill="#F7C948" />
      <path d="M8 25C8 22.7909 9.79086 21 12 21H52C54.2091 21 56 22.7909 56 25V29H8V25Z" fill="#FFE28A" />
      <path d="M8 29H56L52.5 45.5C52.1081 47.3472 50.4764 48.6667 48.5881 48.6667H15.4119C13.5236 48.6667 11.8919 47.3472 11.5 45.5L8 29Z" fill="#F3B323" />
      <path d="M24 36H40" stroke="#C08200" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-label="Email">
      <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-label="Notas">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 15H7V13H17V15ZM17 11H7V9H17V11Z" />
    </svg>
  );
}

function RecycleBinIcon() {
  return (
    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-label="Lixeira">
      <path d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z" />
    </svg>
  );
}

function normalizeUrl(input: string) {
  const value = input.trim();

  if (!value) {
    return { type: 'search' as const, url: WINDOWS_START_URL, query: 'Windows 11' };
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return { type: 'web' as const, url: value, query: value };
  }

  if (value.includes('.') && !value.includes(' ')) {
    return { type: 'web' as const, url: `https://${value}`, query: value };
  }

  return {
    type: 'search' as const,
    url: `${SEARCH_ENGINE}${encodeURIComponent(value)}`,
    query: value,
  };
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Administrador');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [edgeOpen, setEdgeOpen] = useState(false);
  const [browserInput, setBrowserInput] = useState('Windows 11');
  const [edgeUrl, setEdgeUrl] = useState(WINDOWS_START_URL);
  const [edgeMode, setEdgeMode] = useState<BrowserMode>('search');
  const [edgeTitle, setEdgeTitle] = useState('Nova guia');
  const [edgeMaximized, setEdgeMaximized] = useState(false);
  const [edgePosition, setEdgePosition] = useState({ x: 120, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [edgeLoading, setEdgeLoading] = useState(false);
  const [edgeMessage, setEdgeMessage] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [pagePreview, setPagePreview] = useState('');
  const [history, setHistory] = useState<string[]>(['Windows 11']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [clock, setClock] = useState('12:00');
  const [date, setDate] = useState('01/01/2024');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      setDate(
        now.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      );
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const desktopIcons = useMemo(
    () => [
      {
        key: 'pc',
        label: 'Este Computador',
        icon: <ThisComputerIcon />,
        className: 'bg-transparent',
      },
      {
        key: 'bin',
        label: 'Lixeira',
        icon: <RecycleBinIcon />,
        className: 'bg-gradient-to-br from-slate-400 to-slate-600',
      },
      {
        key: 'edge',
        label: 'Microsoft Edge',
        icon: <EdgeIcon className="h-10 w-10" />,
        className: 'bg-white/10',
        onClick: () => openEdge(),
      },
      {
        key: 'word',
        label: 'Word',
        icon: <span className="text-xl font-bold text-white">W</span>,
        className: 'bg-gradient-to-br from-blue-600 to-blue-900',
      },
      {
        key: 'excel',
        label: 'Excel',
        icon: <span className="text-xl font-bold text-white">X</span>,
        className: 'bg-gradient-to-br from-green-500 to-green-800',
      },
      {
        key: 'powerpoint',
        label: 'PowerPoint',
        icon: <span className="text-xl font-bold text-white">P</span>,
        className: 'bg-gradient-to-br from-orange-500 to-orange-700',
      },
    ],
    [],
  );

  const addHistory = (entry: string) => {
    setHistory((current) => {
      const trimmed = current.slice(0, historyIndex + 1);
      trimmed.push(entry);
      setHistoryIndex(trimmed.length - 1);
      return trimmed;
    });
  };

  const generateSearchResults = (query: string): SearchResult[] => {
    const safeQuery = query.trim() || 'Windows 11';
    return [
      {
        title: `${safeQuery} - Bing`,
        url: `https://www.bing.com/search?q=${encodeURIComponent(safeQuery)}`,
        snippet: `Pesquisar por ${safeQuery} com resultados completos no Bing.`,
      },
      {
        title: `${safeQuery} no Google`,
        url: `https://www.google.com/search?q=${encodeURIComponent(safeQuery)}`,
        snippet: `Abrir pesquisa do Google para ${safeQuery}.`,
      },
      {
        title: `Wikipedia sobre ${safeQuery}`,
        url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(safeQuery.replace(/\s+/g, '_'))}`,
        snippet: `Ler informações enciclopédicas relacionadas a ${safeQuery}.`,
      },
      {
        title: `${safeQuery} no YouTube`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(safeQuery)}`,
        snippet: `Vídeos e tutoriais sobre ${safeQuery}.`,
      },
      {
        title: `${safeQuery} no GitHub`,
        url: `https://github.com/search?q=${encodeURIComponent(safeQuery)}`,
        snippet: `Projetos e códigos relacionados a ${safeQuery}.`,
      },
    ];
  };

  const generatePreviewMarkdown = (title: string, url: string, query?: string) => {
    const host = (() => {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    })();

    return `# ${title}

**Site:** ${host}

**Endereço:** ${url}

${query ? `**Pesquisa:** ${query}

` : ''}Este modo foi criado para garantir que o Microsoft Edge do desktop continue funcionando mesmo quando alguns sites bloqueiam carregamento em iframe.

## O que você pode fazer

- Abrir o site em uma nova aba do navegador real
- Pesquisar termos digitados na barra de busca
- Navegar por links rápidos e resultados sugeridos
- Usar visualização integrada quando possível

## Observação

Muitos sites modernos bloqueiam incorporação por segurança. Por isso, este Edge mostra uma **experiência híbrida**: tenta abrir o site e oferece um painel funcional de visualização e acesso.
`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'Administrador' && password === '') {
      setIsLoggedIn(true);
      setLoginError('');
      return;
    }
    setLoginError('Usuário ou senha incorretos');
  };

  const openEdge = () => {
    setEdgeOpen(true);
    setBrowserInput('Windows 11');
    setEdgeUrl(WINDOWS_START_URL);
    setEdgeMode('search');
    setEdgeTitle('Resultados da pesquisa');
    setSearchResults(generateSearchResults('Windows 11'));
    setPagePreview(generatePreviewMarkdown('Resultados da pesquisa', WINDOWS_START_URL, 'Windows 11'));
    setEdgeMessage('Pesquise sites ou digite um endereço para abrir.');
    setEdgeMaximized(false);
    setEdgeLoading(false);
  };

  const closeEdge = () => {
    setEdgeOpen(false);
    setIsDragging(false);
  };

  const openSearch = (query: string) => {
    const result = normalizeUrl(query);
    setEdgeLoading(true);
    setBrowserInput(result.query);
    setEdgeUrl(result.url);
    setEdgeMode('search');
    setEdgeTitle(`Pesquisa: ${result.query}`);
    setSearchResults(generateSearchResults(result.query));
    setPagePreview(generatePreviewMarkdown(`Pesquisa: ${result.query}`, result.url, result.query));
    setEdgeMessage(`Resultados preparados para: ${result.query}`);
    addHistory(result.query);
    window.setTimeout(() => setEdgeLoading(false), 350);
  };

  const openWebsite = (input: string) => {
    const result = normalizeUrl(input);
    setEdgeLoading(true);
    setEdgeUrl(result.url);
    setBrowserInput(result.url);
    setEdgeMode('web');
    setEdgeTitle(result.url);
    setPagePreview(generatePreviewMarkdown('Página carregada', result.url));
    setEdgeMessage('Se o site bloquear o iframe, use o botão “Abrir site”.');
    addHistory(result.url);
    window.setTimeout(() => setEdgeLoading(false), 350);
  };

  const navigateEdge = () => {
    const result = normalizeUrl(browserInput);

    if (result.type === 'search') {
      openSearch(result.query);
      return;
    }

    openWebsite(result.url);
  };

  const handleEdgeNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigateEdge();
  };

  const handleEdgeMaximize = () => {
    setEdgeMaximized((current) => !current);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (edgeMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - edgePosition.x,
      y: e.clientY - edgePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || edgeMaximized) return;
    setEdgePosition({
      x: Math.max(0, e.clientX - dragOffset.x),
      y: Math.max(0, e.clientY - dragOffset.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleBack = () => {
    if (historyIndex <= 0) return;
    const previous = history[historyIndex - 1];
    setHistoryIndex((current) => current - 1);
    setBrowserInput(previous);
    const parsed = normalizeUrl(previous);
    if (parsed.type === 'search') {
      setEdgeMode('search');
      setSearchResults(generateSearchResults(parsed.query));
      setEdgeUrl(parsed.url);
      setEdgeTitle(`Pesquisa: ${parsed.query}`);
      setPagePreview(generatePreviewMarkdown(`Pesquisa: ${parsed.query}`, parsed.url, parsed.query));
    } else {
      setEdgeMode('web');
      setEdgeUrl(parsed.url);
      setEdgeTitle(parsed.url);
      setPagePreview(generatePreviewMarkdown('Página carregada', parsed.url));
    }
  };

  const handleForward = () => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setHistoryIndex((current) => current + 1);
    setBrowserInput(next);
    const parsed = normalizeUrl(next);
    if (parsed.type === 'search') {
      setEdgeMode('search');
      setSearchResults(generateSearchResults(parsed.query));
      setEdgeUrl(parsed.url);
      setEdgeTitle(`Pesquisa: ${parsed.query}`);
      setPagePreview(generatePreviewMarkdown(`Pesquisa: ${parsed.query}`, parsed.url, parsed.query));
    } else {
      setEdgeMode('web');
      setEdgeUrl(parsed.url);
      setEdgeTitle(parsed.url);
      setPagePreview(generatePreviewMarkdown('Página carregada', parsed.url));
    }
  };

  const handleRefresh = () => {
    setEdgeLoading(true);
    setEdgeMessage('Atualizando página...');
    window.setTimeout(() => {
      setEdgeLoading(false);
      setEdgeMessage('Página atualizada.');
    }, 400);
  };

  const quickLinks = [
    { label: 'Google', value: 'google.com' },
    { label: 'YouTube', value: 'youtube.com' },
    { label: 'Wikipedia', value: 'wikipedia.org' },
    { label: 'GitHub', value: 'github.com' },
    { label: 'Pesquisar Windows 11', value: 'Windows 11' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#4f7cff_0%,#25366e_35%,#110d26_100%)] px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 shadow-lg ring-1 ring-white/20">
              <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 14.5C8.66229 14.5 2 16.1739 2 19.5V22H22V19.5C22 16.1739 15.3377 14.5 12 14.5Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-light text-white">Administrador</h1>
            <p className="mt-2 text-sm text-white/70">Entre para abrir o desktop Windows 11</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/80">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/40 focus:bg-white/15"
                placeholder="Administrador"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/40 focus:bg-white/15"
                placeholder="Deixe em branco"
              />
            </div>

            {loginError && (
              <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-white/20 py-3 font-medium text-white transition hover:bg-white/30"
            >
              Logar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#dce8f6]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef4fb_0%,#dfeaf7_38%,#d8e5f4_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[42rem] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(37,126,255,0.18)_0%,rgba(37,126,255,0.08)_38%,transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[36rem] w-[15rem] -translate-x-[155%] rotate-[28deg] rounded-[7rem] bg-[linear-gradient(180deg,#3fb8ff_0%,#1669ff_100%)] opacity-95 shadow-[0_25px_80px_rgba(25,109,255,0.28)]" />
      <div className="pointer-events-none absolute left-1/2 top-[16%] h-[34rem] w-[14rem] -translate-x-[62%] rotate-[8deg] rounded-[7rem] bg-[linear-gradient(180deg,#5fd6ff_0%,#2287ff_100%)] opacity-95 shadow-[0_25px_80px_rgba(25,109,255,0.22)]" />
      <div className="pointer-events-none absolute left-1/2 top-[31%] h-[18rem] w-[27rem] -translate-x-[118%] rotate-[18deg] rounded-[9rem] bg-[linear-gradient(90deg,#1d71ff_0%,#3ec8ff_100%)] opacity-95 shadow-[0_18px_70px_rgba(18,106,255,0.2)]" />
      <div className="pointer-events-none absolute left-1/2 top-[35%] h-[17rem] w-[26rem] -translate-x-[4%] -rotate-[19deg] rounded-[9rem] bg-[linear-gradient(90deg,#59d5ff_0%,#196bff_100%)] opacity-95 shadow-[0_18px_70px_rgba(18,106,255,0.18)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_44%)]" />

      <div className="absolute left-4 top-4 z-10 flex flex-col gap-4">
        {desktopIcons.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            className="group flex w-28 flex-col items-center rounded-xl p-2 transition hover:bg-white/10"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.className} shadow-[0_10px_30px_rgba(0,0,0,0.18)]`}
            >
              {item.icon}
            </div>
            <span className="mt-2 text-center text-xs text-white drop-shadow-md">{item.label}</span>
          </button>
        ))}
      </div>

      {edgeOpen && (
        <div
          className="fixed z-30 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          style={{
            width: edgeMaximized ? '100vw' : '1080px',
            height: edgeMaximized ? '100vh' : '700px',
            left: edgeMaximized ? 0 : edgePosition.x,
            top: edgeMaximized ? 0 : edgePosition.y,
            transition: 'all 0.2s ease',
          }}
        >
          <div
            className="flex cursor-move items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2 text-slate-700">
              <EdgeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Microsoft Edge</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg p-2 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={historyIndex <= 0}
                aria-label="Voltar"
              >
                <FiArrowLeft />
              </button>
              <button
                type="button"
                onClick={handleForward}
                className="rounded-lg p-2 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={historyIndex >= history.length - 1}
                aria-label="Avançar"
              >
                <FiArrowRight />
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-lg p-2 transition hover:bg-slate-200"
                aria-label="Atualizar"
              >
                <FiRefreshCw className={edgeLoading ? 'animate-spin' : ''} />
              </button>
              <button
                type="button"
                onClick={() => openSearch('Windows 11')}
                className="rounded-lg p-2 transition hover:bg-slate-200"
                aria-label="Página inicial"
              >
                <FiHome />
              </button>
            </div>

            <form onSubmit={handleEdgeNavigate} className="flex flex-1 items-center gap-2">
              <div className="flex w-full items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus-within:border-blue-400">
                <FiSearch className="text-slate-400" />
                <input
                  type="text"
                  value={browserInput}
                  onChange={(e) => setBrowserInput(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Digite um site ou faça uma pesquisa"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Ir
              </button>
            </form>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200"
                aria-label="Minimizar"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleEdgeMaximize}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200"
                aria-label="Maximizar"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4H20V20H4V4ZM6 6V18H18V6H6Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeEdge}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500 hover:text-white"
                aria-label="Fechar"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
            <div className="truncate">{edgeTitle}</div>
            <div className="flex items-center gap-3">
              <span>{edgeMessage}</span>
              <button
                type="button"
                onClick={() => window.open(edgeUrl, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700 transition hover:bg-slate-200"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
                Abrir site
              </button>
            </div>
          </div>

          <div className="grid h-[calc(100%-102px)] grid-cols-[320px_1fr] bg-slate-100">
            <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Acesso rápido</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setBrowserInput(item.value);
                        const result = normalizeUrl(item.value);
                        if (result.type === 'search') {
                          openSearch(result.query);
                        } else {
                          openWebsite(result.url);
                        }
                      }}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  {edgeMode === 'search' ? 'Resultados da pesquisa' : 'Visualização da página'}
                </h3>

                {edgeMode === 'search' ? (
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <button
                        key={result.url}
                        type="button"
                        onClick={() => openWebsite(result.url)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="text-sm font-semibold text-blue-700">{result.title}</div>
                        <div className="mt-1 truncate text-xs text-emerald-700">{result.url}</div>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{result.snippet}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{pagePreview}</ReactMarkdown>
                  </div>
                )}
              </div>
            </aside>

            <main className="relative h-full bg-white">
              {edgeLoading && (
                <div className="absolute left-0 top-0 z-10 h-1 w-full overflow-hidden bg-slate-200">
                  <div className="h-full w-1/3 animate-[pulse_1s_ease-in-out_infinite] bg-blue-500" />
                </div>
              )}

              {edgeMode === 'web' ? (
                <iframe
                  title="Microsoft Edge"
                  src={edgeUrl}
                  className="h-full w-full border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_32%,#f8fbff_100%)] p-8">
                  <div>
                    <div className="mb-6 flex items-center gap-3">
                      <EdgeIcon className="h-12 w-12" />
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Microsoft Edge</h2>
                        <p className="text-sm text-slate-500">Pesquise e abra sites rapidamente</p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                      <div className="mb-3 text-sm font-medium text-slate-700">Pesquisa atual</div>
                      <div className="text-3xl font-semibold text-slate-900">{browserInput}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Use os resultados da esquerda para abrir sites. Quando um site bloquear o carregamento interno,
                        o botão <strong>Abrir site</strong> permite abrir a página no navegador real.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {generateSearchResults(browserInput).slice(0, 3).map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => openWebsite(item.url)}
                        className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                      >
                        <div className="text-base font-semibold text-slate-800">{item.title}</div>
                        <div className="mt-2 text-xs text-slate-500">{item.snippet}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      <div className="absolute left-1/2 top-[23%] z-20 w-[24rem] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/25 bg-white/90 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-white">
          <div className="flex items-center gap-2 text-sm font-medium">
            <WindowsLogo />
            <span>Bem-vindo ao Windows 11</span>
          </div>
          <button className="rounded-lg p-1.5 transition hover:bg-white/20" aria-label="Fechar janela de boas-vindas">
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg">
            <WindowsLogo />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">Olá, Administrador!</h2>
          <p className="mt-2 text-sm text-slate-600">Seu desktop está pronto. Clique no Edge para abrir sites e pesquisas.</p>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            ✅ Login realizado com sucesso.
          </div>
          <button
            type="button"
            onClick={() => setIsLoggedIn(false)}
            className="mt-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-white transition hover:from-sky-600 hover:to-indigo-600"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[22px] border border-white/70 bg-white/92 px-3 py-2 shadow-[0_18px_45px_rgba(63,90,130,0.22)] backdrop-blur-2xl">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-slate-200/80"
          aria-label="Menu Iniciar"
        >
          <WindowsLogo />
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-slate-200/80"
          aria-label="Explorador de Arquivos"
        >
          <ExplorerIcon />
        </button>

        <button
          type="button"
          onClick={openEdge}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-slate-200/80 ${edgeOpen ? 'bg-slate-200/80 ring-1 ring-slate-300' : ''}`}
          aria-label="Microsoft Edge"
        >
          <EdgeIcon className="h-7 w-7" />
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-sky-500 transition hover:bg-slate-200/80"
          aria-label="Email"
        >
          <MailIcon />
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-emerald-500 transition hover:bg-slate-200/80"
          aria-label="Notas"
        >
          <NotesIcon />
        </button>
      </div>

      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-3 rounded-[18px] border border-white/70 bg-white/92 px-4 py-2.5 text-slate-700 shadow-[0_18px_45px_rgba(63,90,130,0.2)] backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-slate-500">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3C7.03 3 3 7.03 3 12C3 13.64 3.44 15.18 4.21 16.5L3 21L7.5 19.79C8.82 20.56 10.36 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM16.95 10.05L11.45 15.55C11.16 15.84 10.68 15.84 10.39 15.55L7.05 12.21L8.11 11.15L10.92 13.97L15.89 9L16.95 10.05Z" />
          </svg>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" />
          </svg>
        </div>
        <div className="text-right text-xs leading-tight">
          <div className="font-medium text-slate-700">{clock}</div>
          <div className="text-slate-500">{date}</div>
        </div>
      </div>
    </div>
  );
}

export { App };
