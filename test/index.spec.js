import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src';

describe('Go Mods Worker', () => {
	// 模拟 D1 数据库行为
	const mockEnv = {
		DB: {
		prepare: vi.fn(() => ({
			bind: vi.fn(() => ({
			run: vi.fn().mockResolvedValue({ success: true }),
			first: vi.fn().mockResolvedValue(null), // 默认假设数据不存在
			all: vi.fn().mockResolvedValue({ results: [] }),
			})),
		})),
		},
	};

	it('POST /api/v1/shortener - 成功添加数据', async () => {
		// 1. 模拟插入数据后的返回结果
		mockEnv.DB.prepare = vi.fn(() => ({
			bind: vi.fn(() => ({
			run: vi.fn().mockResolvedValue({ success: true }),
			first: vi.fn().mockResolvedValue({
				id: 1,
				code: 'shortener',
				import_url: 'go.dsig.cn/shortener',
				repo_url: 'https://github.com/idevsig/shortener',
			}),
			})),
		}));

		// 2. 构造 POST 请求
		const request = new Request(
			'https://127.0.0.1:8787/api/v1/shortener',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: 'shortener',
					import_url: 'go.dsig.cn/shortener',
					repo_url: 'https://github.com/idevsig/shortener',
				 }),
			}
		);

		// 3. 执行请求
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, mockEnv, ctx);
		await waitOnExecutionContext(ctx);

		// 4. 验证结果
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toEqual({
			id: 1,
			code: 'shortener',
			import_url: 'go.dsig.cn/shortener',
			repo_url: 'https://github.com/idevsig/shortener',
		});
	});
  });
