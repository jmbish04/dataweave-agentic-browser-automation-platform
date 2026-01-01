# Cloudflare AI Chat Agent Template

A production-ready Cloudflare Workers template for building scalable AI-powered chat applications. Features stateful chat sessions via Durable Objects, AI Gateway integration, tool calling (web search, weather, custom MCP tools), multi-session management, streaming responses, and a modern React frontend built with shadcn/ui.

## Key Features
- **Stateful Chat Sessions**: Persistent conversations powered by Cloudflare Durable Objects
- **AI Integration**: Seamless connection to Cloudflare AI Gateway with Gemini models
- **Tool Calling**: Built-in tools for web search (SerpAPI), weather, and extensible MCP server integration
- **Multi-Session UI**: Create, switch, rename, and delete chat sessions with real-time activity tracking
- **Streaming Responses**: Real-time message streaming for responsive UX
- **Modern Frontend**: React 18, Tailwind CSS, shadcn/ui components, TanStack Query for data fetching
- **Production-Ready**: TypeScript, error handling, CORS, health checks, client error reporting
- **Session Management API**: RESTful endpoints for listing, creating, and managing sessions

[cloudflarebutton]

## Tech Stack
- **Backend**: Cloudflare Workers, Durable Objects, Hono, Agents SDK, OpenAI SDK
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack React Query, Lucide Icons
- **State Management**: Durable Objects for persistence, Zustand/Immer for local state
- **Tools & Utils**: SerpAPI for search, MCP protocol for custom tools, Framer Motion for animations
- **Dev Tools**: Bun, ESLint, Wrangler CLI

## Quick Start

1. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd data-weave-agent-554712tjaxwxrkjq1d07h
   bun install
   ```

2. **Configure Environment**
   Edit `wrangler.jsonc`:
   ```json
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
     "CF_AI_API_KEY": "{your_ai_gateway_token}",
     "SERPAPI_KEY": "{your_serpapi_key}",
     "OPENROUTER_API_KEY": "{optional_openrouter_key}"
   }
   ```
   - Get AI Gateway details from [Cloudflare Dashboard](https://dash.cloudflare.com)
   - SerpAPI key from [serpapi.com](https://serpapi.com) (optional for web search)

3. **Run Locally**
   ```bash
   bun dev
   ```
   Open `http://localhost:3000` (or `${PORT:-3000}`).

## Development

- **Start Dev Server**: `bun dev` (frontend + worker)
- **Type Generation**: `bun cf-typegen` (regenerate Worker types)
- **Lint**: `bun lint`
- **Build**: `bun build` (produces `dist/` for preview)
- **Preview**: `bun preview`
- **Hot Reload**: Vite handles frontend; Worker changes require redeploy or `wrangler dev`

**Folder Structure**:
```
├── src/          # React frontend
├── worker/       # Cloudflare Worker backend
├── shared/       # Shared types/utils (if needed)
└── public/       # Static assets
```

**Customization**:
- Add routes: `worker/userRoutes.ts`
- Extend agent: `worker/agent.ts` + `worker/chat.ts`
- UI: Edit `src/pages/HomePage.tsx` and `src/components/`
- Tools: `worker/tools.ts`
- MCP Servers: `worker/mcp-client.ts`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/:sessionId/chat` | POST | Send message (supports streaming) |
| `/api/chat/:sessionId/messages` | GET | Get session state |
| `/api/chat/:sessionId/clear` | DELETE | Clear messages |
| `/api/chat/:sessionId/model` | POST | Update model |
| `/api/sessions` | GET/POST/DELETE | List/create/clear sessions |
| `/api/sessions/:id` | DELETE | Delete session |
| `/api/sessions/:id/title` | PUT | Update title |
| `/api/health` | GET | Health check |

Body examples:
```json
// Chat
{ "message": "Hello", "model": "google-ai-studio/gemini-2.5-flash", "stream": true }

// Session
{ "title": "My Chat", "firstMessage": "Build a todo app" }
```

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun deploy
```

Or manually:
1. Ensure `wrangler login` and project bound to account
2. `bun build`
3. `wrangler deploy`

[cloudflarebutton]

**Custom Domain**: Set in Cloudflare Dashboard > Workers > Triggers.

**Observability**: Enabled by default (logs, metrics via `wrangler.jsonc`).

## Environment Variables

| Var | Required | Description |
|-----|----------|-------------|
| `CF_AI_BASE_URL` | Yes | AI Gateway OpenAI-compatible endpoint |
| `CF_AI_API_KEY` | Yes | AI Gateway token |
| `SERPAPI_KEY` | No | Web search via SerpAPI |
| `OPENROUTER_API_KEY` | No | Alternative LLM provider |

## Troubleshooting

- **Worker Types**: Run `bun cf-typegen`
- **CORS Issues**: Check `/api/*` middleware in `worker/index.ts`
- **Durable Objects**: Verify migrations in `wrangler.jsonc`
- **AI Gateway**: Ensure model supports tools (`gemini-*-exp`)
- **Bun Issues**: `rm -rf node_modules/.vite` && `bun install`

## Contributing

1. Fork & PR
2. Follow TypeScript + ESLint rules
3. Add tests for new features
4. Update README for public APIs

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with ❤️ for Cloudflare Workers. Questions? [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)