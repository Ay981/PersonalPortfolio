export type PortfolioProject = {
	key: string;
	title: string;
	description: string;
	tech: string[];
	url: string;
	screenshotUrl: string;
};

export type PortfolioContent = {
	name: string;
	role: string;
	bio: string;
	skills: string[];
	cv: string;
	email: string;
	github: string;
	linkedin: string;
	upwork: string;
	projects: PortfolioProject[];
};

export const portfolioContent: PortfolioContent = {
	name: 'Aymen Abdulkerim',
	role: 'Full-stack Developer · React & Laravel',
	bio: 'I build full-stack products that feel human to use, from clean frontend experiences to reliable backend systems. I enjoy shipping practical software with modern web tooling, and I like working on problems where product clarity, performance, and maintainability all matter at once.',
	skills: [
		'React',
		'Laravel',
		'TypeScript',
		'PostgreSQL',
		'TanStack Query',
		'Next.js',
		'Astro',
		'Tailwind CSS',
		'Supabase',
		'Redux Toolkit',
		'Node.js',
		'MySQL',
	],
	cv: '/cv/AymenCV.pdf',
	email: 'aymenabdulkerim411@gmail.com',
	github: 'https://github.com/Ay981',
	linkedin: 'https://www.linkedin.com/in/aymen-abdulkerim-1a881a30a/',
	upwork: 'https://www.upwork.com/freelancers/~0187abe50d50e5a0da?mp_source=share',
	projects: [
		{
			key: 'act-elearning',
			title: 'ACT E-Learning Platform',
			description:
				'I built this to test how far a role-based learning platform could go without losing clarity, speed, or maintainability.',
			tech: ['React', 'Vite', 'Tailwind CSS', 'Laravel', 'MySQL', 'Sanctum'],
			url: 'https://github.com/Ay981/ACT',
			screenshotUrl: '/projects/ACTelearning.png',
		},
		{
			key: 'ecommerce-frontend',
			title: 'E-Commerce Frontend',
			description:
				'Production-ready Next.js storefront with TypeScript, RTK Query data flows, responsive UI, and robust dark mode/theme support.',
			tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'RTK Query'],
			url: 'https://github.com/Ay981/ecommerce-frontend',
			screenshotUrl: '/projects/ecommerce-frontend.png',
		},
		{
			key: 'le-restaurant',
			title: 'My Restaurant v2 POS Dashboard',
			description:
				'POS-style dashboard featuring order workflows, admin management, receipt verification, and personalized recommendations backed by Supabase.',
			tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
			url: 'https://github.com/Ay981/le-restaurant',
			screenshotUrl: '/projects/restaurant.png',
		},
		{
			key: 'zeroday',
			title: 'ZeroDay API',
			description:
				'Authenticated Laravel API for bug reporting with Sanctum auth, report CRUD endpoints, user stats, and program-based workflows.',
			tech: ['Laravel', 'PHP', 'Sanctum', 'REST API'],
			url: 'https://github.com/Ay981/zeroday',
			screenshotUrl: '/projects/zerodayss.png',
		},
        
	],
};
