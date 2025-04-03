/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// import { background } from '../assets/background.svg';

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#00ADD8" stroke="white" stroke-width="4"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" alignment-baseline="middle">Go</text>
</svg>`

const htmlResponse= (params = {}) => {
	const { slug, branch, import_url, repo_url } = params;
	let importMeta = '';
	// 转为全部大写
	let slugTitle = ''
	let slugBanner = '';
	if (import_url && repo_url) {
		let upperSlug = slug.toUpperCase();
		const branchName = branch || 'main';

		importMeta = `
	<meta name="go-import" content="${import_url} git ${repo_url}">
	<meta name="go-source" content="${import_url} ${repo_url} ${repo_url}/tree/${branchName}{/dir} ${repo_url}/blob/${branchName}{/dir}/{file}#L{line}">`

		slugTitle = `
				<h1>${upperSlug}</h1>`
		slugBanner = `
				<p>This is the URL of the import path for <a href="${repo_url}">${upperSlug}</a>.</p>`
	}

	const htmlContent = `
	<doctype html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<title>Go Modules Redirect</title>${importMeta}
	<head>
	<body>
	<div id="container">
		<!--<img id="background" src= alt="" fetchpriority="high" />-->
		<main>
			<section id="hero">${slugTitle}
				<h1>
					Go module import path redirection.
				</h1>${slugBanner}
				<section id="links">
					<a class="button" href="https://github.com/servless/gomods" rel="noopener noreferrer">View on GitHub</a></a>
				</section>
			</section>
		</main>
	</div>

	<style>
		#background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(100px);
		}

		#container {
			font-family: Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;
			height: 100%;
		}

		main {
			height: 100%;
			display: flex;
			justify-content: center;
		}

		#hero {
			display: flex;
			align-items: start;
			flex-direction: column;
			justify-content: center;
			padding: 16px;
			transform: translateY(-120px);
		}

		h1 {
			font-size: 2.5rem;
			margin-top: 0.25em;
		}

		#links {
			display: flex;
			gap: 16px;
		}

		#links a {
			display: flex;
			align-items: center;
			padding: 10px 12px;
			color: #111827;
			text-decoration: none;
			transition: color 0.2s;
		}

		#links a:hover {
			color: rgb(78, 80, 86);
		}

		#links a svg {
			height: 1em;
			margin-left: 8px;
		}

		#links a.button {
			color: white;
			background: linear-gradient(83.21deg, #3245ff 0%, #bc52ee 100%);
			box-shadow:
				inset 0 0 0 1px rgba(255, 255, 255, 0.12),
				inset 0 -2px 0 rgba(0, 0, 0, 0.24);
			border-radius: 10px;
		}

		#links a.button:hover {
			color: rgb(230, 230, 230);
			box-shadow: none;
		}

		pre {
			font-family:
				ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono',
				monospace;
			font-weight: normal;
			background: linear-gradient(14deg, #d83333 0%, #f041ff 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			margin: 0;
		}

		h2 {
			margin: 0 0 1em;
			font-weight: normal;
			color: #111827;
			font-size: 20px;
		}

		p {
			color: #4b5563;
			font-size: 16px;
			line-height: 24px;
			letter-spacing: -0.006em;
			margin: 0;
		}

		#hero p {
			font-weight: 300;
			color: #353841;
			margin: 0 0 20px;

			a {
				font-weight: bold;
				color: #111827;
				transition: color 0.2s;
				text-decoration: none;
			}

			a:link {
				color: #111827;
				text-decoration: none;
			}

			a:hover {
				color: rgb(226, 14, 32);
				text-decoration: none;
			}

		}

		code {
			display: inline-block;
			background:
				linear-gradient(66.77deg, #f3cddd 0%, #f5cee7 100%) padding-box,
				linear-gradient(155deg, #d83333 0%, #f041ff 18%, #f5cee7 45%) border-box;
			border-radius: 8px;
			border: 1px solid transparent;
			padding: 6px 8px;
		}

		@media screen and (max-height: 368px) {
			#news {
				display: none;
			}
		}

		@media screen and (max-width: 768px) {
			#container {
				display: flex;
				flex-direction: column;
			}

			#hero {
				display: block;
				padding-top: 10%;
			}

			#links {
				flex-wrap: wrap;
			}

			#links a.button {
				padding: 14px 18px;
			}

			#news {
				right: 16px;
				left: 16px;
				bottom: 2.5rem;
				max-width: 100%;
			}

			h1 {
				line-height: 1.5;
			}
		}
	</style>
	<body>
	</html>
	`

	return new Response(htmlContent, {
		status: 200,
		headers: {
			'content-type': 'text/html;charset=UTF-8',
		}
	});
}

// 定义一个异步函数 addData，用于向数据库中添加数据
const addData = async (db, data) => {
	const { slug, branch, import_url, repo_url } = data;

	let statusCode = 400;
	let message = "Missing required fields";
	let resp = {};

	const branchName = branch || 'main';

	if (slug && import_url && repo_url) {
		try {
			const results = await db.prepare(
				"INSERT INTO go_mods (slug, branch, import_url, repo_url) VALUES (?, ?, ?, ?)")
				.bind(slug, branchName, import_url, repo_url)
				.run();

			// console.log(results);

			if (results.meta.last_row_id > 0) {
				statusCode = 201;
				message = "Data added successfully";

				resp = {
					id: results.meta.last_row_id,
					...data,
				}
			}
		} catch (error) {
			if (error.message.includes("SQLITE_CONSTRAINT")) {
				statusCode = 409;
				message = "Data already exists";
			} else {
				statusCode = 500;
				message = error.message;
			}
		}
	}

	if (statusCode !== 201) {
		resp = {
			error: message,
		};
	}

	return {
		status: statusCode,
		data: resp,
	};
}

const delData = async  (db, slug) => {
	let statusCode = 400;
	let message = "Missing required fields";
	let resp = {};

	if (slug) {
		try {
			const results = await db.prepare(
				"DELETE FROM go_mods WHERE slug = ?")
				.bind(slug)
				.run();

			// console.log(results);

			if (results.meta.changes > 0) {
				statusCode = 200;
				resp = {
					message: 'Data deleted',
				};
			} else {
				statusCode = 404;
				message = "Data already deleted or not found";
			}
		} catch (error) {
			statusCode = 500;
			message = error.message;
		}
	}

	if (statusCode !== 200) {
		resp = {
			error: message,
		};
	}

	return {
		status: statusCode,
		data: resp,
	};
}

const updateData = async (db, slug, data) => {
	const { branch, import_url, repo_url } = data;

	let statusCode = 400;
	let message = "Missing required fields";
	let resp = {};

	if (slug && import_url && repo_url) {
		try {
			let results;

			if (branch) {
				results = await db.prepare(
					"UPDATE go_mods SET branch = ?, import_url = ?, repo_url = ? WHERE slug = ?")
					.bind(branch, import_url, repo_url, slug)
					.run();
			} else {
				results = await db.prepare(
					"UPDATE go_mods SET import_url = ?, repo_url = ? WHERE slug = ?")
					.bind(import_url, repo_url, slug)
					.run();
			}

			// console.log(results);

			if (results.meta.changes === 0) {
				statusCode = 404;
				message = "Data not found";
			} else {
				statusCode = 200;
				resp = {
				    ...data,
				}
			}
		} catch (error) {
			statusCode = 500;
			message = error.message;
		}
	}

	if (statusCode !== 200) {
		resp = {
			error: message,
		};
	}

	return {
		status: statusCode,
		data: resp,
	};
}

const getData = async (db, slug) => {
	let statusCode = 400;
	let message = "Missing required fields";
	let resp = {};

	if (slug) {
		try {
			const result = await db.prepare(
				"SELECT * FROM go_mods WHERE slug = ?")
				.bind(slug)
				.first();

			// console.log(slug, result);

			if (!result) {
				statusCode = 404;
				message = "Data not found";
			} else {
			    statusCode = 200;
				resp = {
				    ...result,
				}
			}

		} catch (error) {
			statusCode = 500;
			message = error.message;
		}
	}

	if (statusCode !== 200) {
		resp = {
			error: message,
		};
	}

	return {
		status: statusCode,
		data: resp,
	};
}

const getList = async (db, params) => {
	// 1. 解析分页参数（默认 page=1, limit=10）
	const page = parseInt(params.get('page') || '1');
	const limit = parseInt(params.get('limit') || '10');
	const offset = (page - 1) * limit;

	let statusCode = 400;
	let message = "Unknown error";
	let resp = {};

	try {
		// 2. 并行查询：数据 + 总数
		const [postsResult, totalResult] = await Promise.all([
			db.prepare('SELECT * FROM go_mods LIMIT ? OFFSET ?')
			.bind(limit, offset)
			.all(),
			db.prepare('SELECT COUNT(*) AS total FROM go_mods')
			.first(),
		]);

		// 3. 处理查询错误
		if (!postsResult.success || !totalResult) {
			message = 'Database query failed'
			statusCode = 500;
		} else {
			statusCode = 200;
			resp = {
				data: postsResult.results,
				meta: {
					page,
					limit,
					total: totalResult.total, // 数据总数
					total_pages: Math.ceil(totalResult.total / limit),
				}
			};
		}
	} catch (error) {
		statusCode = 500;
		message = error.message;
	}

	if (statusCode !== 200) {
		resp = {
			error: message,
		};
	}

	return {
		status: statusCode,
		data: resp,
	};
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// 排除静态资源
		if (request.method === "GET") {
			switch (url.pathname) {
				case "/robots.txt":
					return new Response("User-agent: *\nDisallow: /", { status: 200 });
				case "":
				case "/":
					return htmlResponse();
				case '/favicon.ico':
				case '/favicon.svg':
					return new Response(logoSvg, { status: 200, headers: { "Content-Type": "image/svg+xml" } });
				default:
					break;
			}
		}

		// API 接口
		if (url.pathname.startsWith("/api")) {
			const headers = {
				"Content-Type": "application/json"
			};

			if (!url.pathname.startsWith("/api/mods")) {
				return new Response(JSON.stringify({
					error: "Page Not found"
				}), {
					status: 404,
					headers: headers
				});
			}

			// 权限验证
			const validKey = env.API_KEY;
			// console.log(validKey);

			if (validKey) {
				const apiKey = request.headers.get("X-API-KEY");
				console.log(apiKey);
				console.log(validKey);

				if (!apiKey || apiKey !== validKey) {
					return new Response(JSON.stringify({
						error: "Invalid API KEY"
					}), {
						status: 401,
						headers: headers
					});
				}
			}

			let resp, dataJson;
			const pathCode = url.pathname.slice(10);


			switch (request.method) {
				case "POST":
					dataJson = await request.json();
					resp = await addData(env.DB, dataJson);
					if (resp.status === 201) {
						headers["Location"] = `${url.pathname}/${resp.data.id}`;
					}
					break;
				case "DELETE":
					resp = await delData(env.DB, pathCode);
					break;
				case "PUT":
					dataJson = await request.json();
					resp = await updateData(env.DB, pathCode, dataJson);
					break;
				case "GET":
					if (pathCode === "") {
						resp = await getList(env.DB, url.searchParams);
					} else {
						resp = await getData(env.DB, pathCode);
					}
					break;
				default:
					resp = {
						status: 405,
						data: "Method Not Allowed"
					}
					break;
			}

			const { status, data } = resp;
			return new Response(JSON.stringify(data), {
				status: status,
				headers: headers
			});
		}

		if (request.method !== "GET") {
			return new Response('Method Not Allowed', { status: 405 });
		}

		const slug = url.pathname.slice(1);
		const params = await getData(env.DB, slug);
		return htmlResponse(params.data);
	},
};
