<h3 align="center">Cookware</h3>
<p align="center">A recipe manager app built on the <a href="https://atproto.com">AT Protocol</a>.</p>
<p align="center">
<a href="https://github.com/hbjydev/cookware/blob/main/LICENSE"><img alt="GitHub License" src="https://img.shields.io/github/license/hbjydev/cookware?style=flat-square"></a>
<a href="https://github.com/hbjydev/cookware/issues"><img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/hbjydev/cookware?style=flat-square"></a>
<a href="https://github.com/hbjydev/cookware/actions"><img alt="GitHub branch status" src="https://img.shields.io/github/checks-status/hbjydev/cookware/main?style=flat-square"></a>
</p>

---

## Requirements

- Node.js 22.x LTS
- [pnpm](https://pnpm.io)
- A [Turso](https://turso.tech) database
- Maybe Docker?

## Services

- [`api`](./apps/api): Runs the API server and hosts the SPA in production
- [`ingester`](./apps/ingester): Ingests ATProto records from a Jetstream source independently of the API process.
- [`web`](./apps/web): React SPA, hosted by the API in production.
