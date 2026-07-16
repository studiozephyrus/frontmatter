# shared/infrastructure
Server-only adapters: db client, cache, queue, observability, security,
storage. Implements application ports. The ONLY place (with src/config) that
reads process.env. Mark files with import "server-only".
