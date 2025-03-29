# GoMods

Go 模块导入路径重定向

**Example:** https://go.dsig.cn/shortener

## 初始化

1. 拉取本仓库代码

2. 安装模块
```bash
npm install
```

3. 初始化数据库

```bash
# 创建数据库
wrangler d1 create gomods
```

复制生成的数据库信息到 `wrangler.jsonc`
```bash
✅ Successfully created DB 'gomods' in region WEUR
Created your new D1 database.

{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "gomods",
      "database_id": "4791dbb8-a06b-4980-9992-f51c51c47f70"
    }
  ]
}
```

```bash
# 导入数据结构(本地测试)
wrangler d1 execute gomods --env local --local --file=./schema.sql
# 导入数据结构(远程服务)
wrangler d1 execute gomods --remote --file=./schema.sql
```

```bash
# 查询数据表(本地测试)
wrangler d1 execute gomods --local --command="SELECT * FROM GoMods"
# 查询数据表(远程服务)
wrangler d1 execute gomods --remote  --command="SELECT * FROM go_mods" 
```

```bash
# 备份数据库(本地测试)
wrangler d1 export gomods --local --file=./gomods.sql
# 备份数据库(远程服务)
wrangler d1 export gomods --remote --file=./gomods.sql
```
```

## 接口

- **接口验证，通过 `API-KEY` 进行验证。建议通过 `Dashboard` 后台设置，支持 Pages 和 Workers 方式。**  
`API_KEY` 可在 `wrangler.jsonc` 中设置。请求头中添加 `X-API-KEY` 字段即可。

### 添加模块

- URL：`POST /api/mods`
- 请求参数：
```json
{
  "slug": "shortener",
  "import_url": "go.dsig.cn/shortener",
  "repo_url": "https://github.com/idevsig/shortener"
}
```
- 返回值：
```json
{
    "id": 1,
    "slug": "shortener",
    "import_url": "go.dsig.cn/shortener",
    "repo_url": "https://github.com/idevsig/shortener"
}
```

### 删除模块

- URL：`DELETE /api/mods/{slug}`
- 返回值：
```json
{
    "message": "Data deleted"
}
```

### 修改模块

- URL：`PUT /api/mods/{slug}`
- 请求参数：
```json
{
  "import_url": "go.dsig.cn/shortener",
  "repo_url": "https://github.com/idevsig/shortener"
}
```
- 返回值：
```json
{
    "import_url": "go.dsig.cn/shortener",
    "repo_url": "https://github.com/idevsig/shortener"
}
```

### 查询模块

- URL：`GET /api/mods/{slug}`
- 返回值：
```json
{
    "id": 1,
    "slug": "shortener",
    "import_url": "go.dsig.cn/shortener",
    "repo_url": "https://github.com/idevsig/shortener"
}
```

### 查询所有模块

- URL：`GET /api/mods`
- 请求参数：
```json
{
    "page": 1,
    "limit": 10
}
```
- 返回值：
```json
{
    "data": [
        {
            "id": 1,
            "slug": "shortener",
            "import_url": "go.dsig.cn/shortener",
            "repo_url": "https://github.com/idevsig/shortener"
        },
        {
            "id": 2,
            "slug": "shortener2",
            "import_url": "go.dsig.cn/shortener2",
            "repo_url": "https://github.com/idevsig/shortener2"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 2,
        "total_pages": 1
    }
}
```

---

## 部署教程 - Workers

**可通过 Dashboard 设置 `API_TOKEN` 环境变量，以及 D1 数据库的绑定**

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/servless/gomods&paid=true)

### 通过 GitHub Actions 发布至 CloudFlare

从 CloudFlare 获取 [`CLOUDFLARE_API_TOKEN`](https://dash.cloudflare.com/profile/api-tokens) 值（`编辑 Cloudflare Workers`），并设置到项目。

> `https://github.com/<ORG>/dchere/settings/secrets/actions`

### 本地部署到 CloudFlare

1. 注册 [CloudFlare 账号](https://www.cloudflare.com/)，并且设置 **Workers** 域名 (比如：`abcd.workers.dev`)
2. 安装 [Wrangler 命令行工具](https://developers.cloudflare.com/workers/wrangler/)。
   ```bash
   npm install -g wrangler
   ```
3. 登录 `Wrangler`（可能需要扶梯）：

   ```bash
   # 登录，可能登录不成功
   # 若登录不成功，可能需要使用代理。
   wrangler login
   ```

4. 拉取本项目：

   ```bash
   git clone https://github.com/servless/gomods.git
   ```

5. 修改 `wrangler.json` 文件中的 `name`（gomods）为服务名 `mygomods`（访问域名为：`mygomods.abcd.workers.dev`）。

6. 发布

   ```bash
    wrangler deploy
   ```

   发布成功将会显示对应的网址

   ```bash
    Proxy environment variables detected. We'll use your proxy for fetch requests.
   ⛅️ wrangler 4.4.0
   	--------------------
   	Total Upload: 0.66 KiB / gzip: 0.35 KiB
   	Uploaded mygomods (1.38 sec)
   	Published mygomods (4.55 sec)
   		https://mygomods.abcd.workers.dev
   	Current Deployment ID:  xxxx.xxxx.xxxx.xxxx
   ```

   **由于某些原因，`workers.dev` 可能无法正常访问，建议绑定自有域名。**

7. 绑定域名

   在 **Compute (Workers)** -> **Workers & Pages** -> **Settings** -> **Domains & Routes** -> **Add** -> **Custom Domain**（仅支持解析在 CF 的域名），按钮以绑定域名。

## 部署教程 - Pages

**需要在 Dashboard 设置 `API_TOKEN` 环境变量，以及 D1 数据库的绑定**

### 直接连接到 `GitHub` 后,一键部署

### 本地部署到 CloudFlare

- 修改代码 [`pages/_worker.js`]

1. 登录请参考 **Workers** 中的**本地部署**的步骤 `1~4`

2. 发布

	```bash
	 wrangler pages deploy pages --project-name gomods
	```

	发布成功将会显示对应的网址

	```bash
		▲ [WARNING] Pages now has wrangler.toml support.

			We detected a configuration file at
			Ignoring configuration file for now, and proceeding with project deploy.

			To silence this warning, pass in --commit-dirty=true


		✨ Success! Uploaded 0 files (11 already uploaded) (0.38 sec)

		✨ Compiled Worker successfully
		✨ Uploading Worker bundle
		🌎 Deploying...
		✨ Deployment complete! Take a peek over at https://2e4bd9c5.dcba.pages.dev
	```

   **由于某些原因，`pages.dev` 可能无法正常访问，建议绑定自有域名。**

3. 绑定域名

   在 **Compute (Workers)** -> **Workers & Pages** -> **Custom domains** -> **Add Custom Domain**（支持解析不在 CF 的域名），按钮以绑定域名。

## 仓库镜像

- https://git.jetsung.com/servless/gomods
- https://framagit.org/servless/gomods
- https://github.com/servless/gomods
