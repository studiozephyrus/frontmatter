# modules
One folder per bounded context. Each module has domain/ application/
infrastructure/ presentation/ and a thin index.ts public API. Cross-module
imports go through index.ts only.
