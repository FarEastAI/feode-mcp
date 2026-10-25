# FEODE MCP Server

> Machine-queryable capabilities, certifications, and a **NOV Grant Prideco drill-string engineering reference** for **FEODE — Shenzhen Far East Oil Drilling Engineering Ltd.**

A remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI agents and MCP clients query FEODE's offshore oilfield equipment & services and a curated drill-string specification & operating-guidance reference — machine to machine.

- **Endpoint (streamable-http):** `https://www.feode.com/mcp`
- **npm (stdio bridge):** [`feode-mcp`](https://www.npmjs.com/package/feode-mcp) — `npx -y feode-mcp` [![npm version](https://img.shields.io/npm/v/feode-mcp)](https://www.npmjs.com/package/feode-mcp)
- **Official MCP Registry:** `com.feode/feode-mcp`
- **Server card:** `https://www.feode.com/.well-known/mcp.json`
- **Website:** https://www.feode.com · **Contact:** enquiry@feode.com

## Tools (12)

**Precision machining & testing**
- `get_machining_services` — AI-accessible contract machining & testing capabilities (large-envelope CNC, pressure testing).
- `get_machining_terms` — intake terms & compliance requirements for machining/testing RFQs.
- `submit_machining_rfq` — submit a structured machining/testing RFQ (with lightweight compliance screen).

**Company**
- `get_company_profile` — profile (founded 1985, HQ, Huizhou manufacturing/test base, areas served).
- `list_products` — FEODE's 7 product/service lines.
- `get_product_specs` — detailed specs for one product line.
- `get_certifications` — BV + CCS classification, 8 API monogram licenses, ISO 9001/14001/45001, awards.
- `search_capabilities` — keyword search across products/specs.

**NOV Grant Prideco drill-string reference**
- `list_drill_pipe` — 16 drill pipe / HWDP / drill collar items.
- `get_drill_pipe_specs` — full performance specs for one item (pipe body new/premium torsional & tensile yield, internal pressure, collapse; tool joint OD/ID, make-up torque max/min, drift).
- `search_drill_pipe` — keyword search (e.g. "NC50", "5 S-135", "HT55").
- `get_drill_string_guidance` — operating guidance: make-up torque rules, grip/handling, care & handling, double-shoulder connections, sour-service grades, field-use practice.

## Connect

Add to an MCP client (streamable-http):

```json
{
  "mcpServers": {
    "feode": { "type": "streamable-http", "url": "https://www.feode.com/mcp" }
  }
}
```

Stdio-only client (Claude Desktop etc.)? Use the npm package — no config beyond this:

```json
{
  "mcpServers": {
    "feode": { "command": "npx", "args": ["-y", "feode-mcp"] }
  }
}
```

Or query directly via JSON-RPC:

```bash
curl -s https://www.feode.com/mcp -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Contents
- `src/worker.js` — the MCP server (dependency-free; runs as a Cloudflare Pages function at `/mcp`).
- `server.json` — official MCP Registry metadata.
- `data/drill-pipe-data.json` — 16 NOV Grant Prideco spec sheets (human-readable source).
- `data/drill-guidance.json` — operating-guidance reference (6 topics).
- `.well-known/mcp.json` — server discovery card.

## About FEODE
Shenzhen Far East Oil Drilling Engineering Ltd. (FEODE, est. 1985) — offshore well plug & abandonment, deepwater subsea wellhead systems (BV + CCS classed), continuous circulation drilling, completion, drill pipe & tool rental, fishing, and supervision. 8 API monogram licenses; in-house pressure testing to 30,000 psi.

## Note on reference data
The NOV Grant Prideco drill-string data is reference material transcribed from manufacturer performance sheets (FOR REFERENCE ONLY; per API RP7G / API 7G), curated by FEODE. Always verify against the controlling NOV document before field use.

## License
Code: MIT (see `LICENSE`). Reference data: see "Note on reference data".
