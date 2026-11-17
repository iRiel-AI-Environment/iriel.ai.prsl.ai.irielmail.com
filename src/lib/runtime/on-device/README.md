# iRiel on-device runtime foundation

This module provides an explicit local execution boundary and a pluggable local
inference contract. It reuses the existing iRiel IndexedDB memory store and
LocalRuntimeTransport; it does not create a second memory database.

## Current behaviour

- Private chat remains on LocalRuntimeTransport.
- The orchestrator checks the local execution boundary before responding.
- A registered local model backend is preferred when available.
- If no local model backend is registered, the existing deterministic local
  responder remains in use. The runtime does not silently call a cloud provider.
- Memory search is local lexical retrieval over existing IndexedDB records.
- No model files are downloaded during bootstrap.

## Model integration boundary

A WebLLM or Transformers.js adapter can implement `LocalInferenceBackend` and
register itself with `registerLocalInferenceBackend`. Keep model loading
explicit, report download/storage requirements to the user, and do not register
a backend until it can prove that generation is local. Do not describe the
current build as local LLM inference or zero-network: no model backend or
pre-cached model assets are included in this change.

## Privacy limitation

The execution guard protects this application runtime's call path. It is not a
browser-wide firewall and cannot prevent unrelated application code, browser
extensions, or service workers from making network requests. The Private
experience must continue to bypass the server chat endpoint at the transport
selection boundary.
