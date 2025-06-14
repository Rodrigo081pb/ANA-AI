// Componente de navegação principal do app
import React from 'react';
import { Brain, History, BarChart3, Sun, Moon, Menu } from 'lucide-react';
import logo from '../../assets/logo.svg';

// Tabs de navegação
const tabs = [
	{ id: 'analyze', label: 'Analisar', icon: Brain },
	{ id: 'history', label: 'Histórico', icon: History },
	{ id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
];

/**
 * Navbar fixa com tabs, toggle de dark mode e menu responsivo.
 * Inclui menu hambúrguer para mobile e drawer lateral com fundo sólido.
 */
export default function Navbar({ activeTab, setActiveTab }) {
	// Estado do modo escuro
	const [dark, setDark] = React.useState(
		window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	);
	// Estado do drawer lateral
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	// Atualiza classe do HTML para dark mode
	React.useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
	}, [dark]);
	const toggleDark = () => setDark((d) => !d);

	// Função para trocar de aba e fechar drawer
	const handleTabClick = (id) => {
		setActiveTab(id);
		setDrawerOpen(false);
	};

	return (
		<header className="fixed top-0 left-0 w-full z-30 bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] h-[64px] flex items-center px-4 sm:px-6 md:px-10 lg:px-16 border-b border-gray-100 dark:border-gray-800">
			{/* Esquerda: Logo + Nome */}
			<div className="flex items-center gap-3 min-w-[140px]">
				<img src={logo} alt="Logo Prompt Analyzer" className="w-8 h-8 rounded-lg" />
				<span className="text-lg font-medium text-gray-900 dark:text-gray-100 tracking-tight select-none">
					Prompt Analyzer
				</span>
			</div>

			{/* Menu hambúrguer mobile + toggle dark mode, alinhados à direita */}
			<div className="flex-1 flex justify-end sm:hidden relative items-center gap-2">
				{/* Botão de dark/clear ao lado do menu hambúrguer, mesmo tamanho e estilo */}
				<button
					onClick={toggleDark}
					className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-all"
					title={dark ? 'Modo claro' : 'Modo escuro'}
				>
					{dark ? <Sun className="w-7 h-7 text-gray-700 dark:text-gray-200" /> : <Moon className="w-7 h-7 text-gray-700 dark:text-gray-200" />}
				</button>
				{/* Botão menu hambúrguer */}
				<button
					className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-all"
					onClick={() => setDrawerOpen((v) => !v)}
					aria-label="Abrir menu"
				>
					<Menu className="w-7 h-7 text-gray-700 dark:text-gray-200" />
				</button>
				{/* Drawer lateral: aparece ao lado do botão, fundo sólido, não cobre toda a tela */}
				{drawerOpen && (
					<aside
						className="absolute top-0 right-14 w-48 max-w-[70vw] h-[220px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl flex flex-col p-4 z-50 animate-slideInLeft"
						style={{ minWidth: 180 }}
					>
						{/* Botão de fechar */}
						<button
							className="self-end mb-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
							onClick={() => setDrawerOpen(false)}
							aria-label="Fechar menu"
						>
							<span className="text-2xl">×</span>
						</button>
						<ul className="flex flex-col gap-2">
							{tabs.map(({ id, label, icon: Icon }) => (
								<li key={id}>
									<button
										onClick={() => handleTabClick(id)}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-base w-full text-left transition-all duration-200
										${activeTab === id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
									>
										<Icon className="w-5 h-5" />
										{label}
									</button>
								</li>
							))}
						</ul>
					</aside>
				)}
			</div>

			{/* Centro: Navegação (desktop) */}
			<nav className="hidden sm:flex flex-1 justify-center">
				<ul className="flex gap-6 md:gap-8 lg:gap-10 h-full items-center">
					{tabs.map(({ id, label, icon: Icon }) => (
						<li key={id}>
							<button
								onClick={() => handleTabClick(id)}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-base transition-all duration-200 relative
                  ${
                  	activeTab === id
                  		? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                  		: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
								style={{ minWidth: 90 }}
								tabIndex={0}
							>
								<Icon className="w-5 h-5" />
								<span className="hidden sm:inline">{label}</span>
								{activeTab === id && (
									<span className="absolute left-2 right-2 -bottom-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
								)}
							</button>
						</li>
					))}
				</ul>
			</nav>

			{/* Direita: Toggle dark/light (desktop) */}
			<div className="hidden sm:flex items-center gap-4 min-w-[60px] justify-end">
				<button
					onClick={toggleDark}
					className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
					title={dark ? 'Modo claro' : 'Modo escuro'}
				>
					{dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
				</button>
			</div>
		</header>
	);
}
