# Can a cloud editor serve agents over MCP? Yes. Verified 18 September 2026.

This is load-bearing. If the answer were no, most of what follows would be impossible for a web
product and OpenMarkdown's desktop-only shape would be forced rather than chosen.

**Source:** the MCP specification dated 2026-07-28, the version our plan already cites.
https://modelcontextprotocol.io/specification/2026-07-28/basic/transports and
.../basic/authorization , both opened 2026-09-18.

## Z4.1 There is a remote transport, and it is standard

The spec names two standard transports, verbatim:

1. **stdio**: "newline-delimited messages over the standard streams of a client-launched subprocess."
2. **Streamable HTTP**: "each message is an HTTP POST to a single MCP endpoint; replies arrive as
   a JSON object or a request-scoped SSE stream."

And, verbatim: "Protocol semantics are identical on every transport."

So an agent on any machine can reach a server on the open web, and gets streaming back. A local
desktop editor is not the only way to give an agent a document. **We can serve one over HTTPS.**

## Z4.2 There is a standard way to log the agent in as the person

Authorization is "**OPTIONAL** for MCP implementations", but where it is used over HTTP the spec is
prescriptive: it is built on OAuth 2.1, and "A protected *MCP server* acts as an OAuth 2.1 resource
server". Servers "**MUST** implement OAuth 2.0 Protected Resource Metadata (RFC9728)", must validate
that a token was issued for them as the intended audience, and "**MUST NOT** accept or transit any
other tokens". Scopes are carried in the `WWW-Authenticate` challenge, with a documented step-up
flow when a client needs more.

Dynamic Client Registration is **not** required. The spec says clients and servers "**SHOULD**
support OAuth Client ID Metadata Documents" and "**MAY**" support RFC 7591, which is "deprecated
and retained for backwards compatibility".

## Z4.3 What this means for us, in plain terms

- We already run Firebase Auth. A remote MCP server in front of our documents is an OAuth resource
  server, and our plan's principle 9, permissions attach to the operation, is exactly the scope
  model the spec wants.
- Per-operation scopes map onto our tiers and our agent-token rule without inventing anything:
  `documents:read` costs nothing, `documents:propose` writes into the change queue,
  `documents:write` is the one we may never grant.
- This is the same reason it is a real product and not a toy: a desktop-only editor can only serve
  the agent on that laptop. A hosted one serves the agent in CI, the agent on the phone, the agent
  a teammate is running, and the agent that runs at three in the morning.

## Z4.4 A note on the fetch itself

The security hook flagged this page as containing an injection-shaped string. It was the spec's own
normative sentence about not sending tokens to the wrong server. It is a false positive of the
substring family. Nothing on the page was acted on; it was read as data.
