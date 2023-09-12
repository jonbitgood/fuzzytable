import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			precompress: true,
			fallback: "404.html",
			pages: "build",
			assets: "build",
		}),
	},
	preprocess: preprocess({
		postcss: true,
		defaults: { style: "postcss" },
	}),
}

export default config;
