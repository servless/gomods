/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#00ADD8" stroke="white" stroke-width="4"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" alignment-baseline="middle">Go</text>
</svg>`

const htmlResponse = (params = {}) => {
	const { slug, branch, import_url, repo_url } = params;
	// const slug = 'Shortener'
	// const branch = 'main';
	// const import_url = 'go.dsig.cn/shortener';
	// const repo_url = 'https://framagit.org/idev/shortener-server';

	const defaultTitle = 'Go Modules Redirect';
	let importMeta = '';
	let uppperTitle = ''; // 标题

	if (import_url && repo_url) {
		uppperTitle = slug.toUpperCase();
		const branchName = branch || 'main';

		importMeta = `
	<meta name="go-import" content="${import_url} git ${repo_url}">
	<meta name="go-source" content="${import_url} ${repo_url} ${repo_url}/tree/${branchName}{/dir} ${repo_url}/blob/${branchName}{/dir}/{file}#L{line}">`
	}

	const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Go Modules Redirect</title>${importMeta}
    <script src="//cdn.tailwindcss.com"></script>
    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            font-family: 'Inter', 'Roboto', 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;
        }

        #hero {
            transform: translateY(-40px);
            transition: transform 0.5s ease;
        }

        .gradient-text {
            background: linear-gradient(14deg, #d83333 0%, #f041ff 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        footer {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
            #hero {
                transform: none;
                padding-top: 10%;
            }
        }

        @media (max-height: 368px) {
            #news {
                display: none;
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div id="container" class="flex flex-col min-h-screen">
        <header class="flex justify-end p-4 sm:p-6">
            <select id="language-switcher" class="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 focus:outline-none transition-colors duration-200 hover:bg-gray-200">
                <option value="en">English</option>
                <option value="zh">中文</option>
            </select>
        </header>
        <main class="flex-1 flex items-center justify-center">
            <section id="hero" class="flex flex-col max-w-2xl px-4 sm:px-6">
                <h1 id="title" class="text-4xl sm:text-5xl font-bold gradient-text mb-3 animate-fade-in"></h1>
                <h2 id="subtitle" class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-5 animate-fade-in">Go module import path redirection</h2>
                <p id="description" class="text-gray-600 text-lg mb-6 animate-fade-in"></p>
            </section>
        </main>
        <footer class="py-4 px-4 sm:px-6 text-center text-gray-600">
            <p id="copyright" class="text-sm">
                © 2025 ${uppperTitle ? uppperTitle : defaultTitle}. Powered by 
                <a id="github-link" href="https://github.com/servless/gomods" class="font-medium text-gray-900 hover:text-red-600 transition-colors" rel="noopener noreferrer">Go Modules Redirect</a>.
            </p>
        </footer>
    </div>

    <script>
        const translations = {
            en: {
                subtitle: "Go module import path redirection",
                description: "This is the import path URL for the <a href='${repo_url}' class='font-bold text-gray-900 hover:text-red-600 transition-colors'>${uppperTitle}</a> project.",
            },
            zh: {
                subtitle: "Go 模块导入路径重定向",
                description: "这是 <a href='${repo_url}' class='font-bold text-gray-900 hover:text-red-600 transition-colors'>${uppperTitle}</a> 项目的导入路径 URL。",
            }
        };

        function getSystemLanguage() {
            const lang = navigator.language || navigator.languages[0];
            return lang.startsWith('zh') ? 'zh' : 'en';
        }

        function updateContent(lang) {
			document.getElementById('title').innerHTML = '${uppperTitle ? uppperTitle : defaultTitle}';
            document.getElementById('subtitle').innerHTML = translations[lang].subtitle;
            document.getElementById('description').innerHTML = '${uppperTitle}' ? translations[lang].description : '';
            document.getElementById('language-switcher').value = lang;
            document.documentElement.lang = lang;
        }

        // Set language based on system preference on page load
        window.addEventListener('load', () => {
            const systemLang = getSystemLanguage();
            updateContent(systemLang);
        });

        // Handle manual language switch
        document.getElementById('language-switcher').addEventListener('change', (event) => {
            updateContent(event.target.value);
        });

        // Apply fade-in animation
        document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
            el.style.animation = "fadeIn 0.5s ease forwards " + index * 0.2 + "s";
        });
    </script>
</body>
</html>	`

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
