# Performance Notes

- Text indexes are present on searchable product collections used by `/api/search`.
- Search responses are cached with Redis using the `search:*` namespace.
- Search queries use MongoDB `$text` with score-based sorting.

## Verification

```bash
cd api
npm run benchmark:db
npm run benchmark:cache
```

- `npm run benchmark:db`
- `npm run benchmark:cache`

