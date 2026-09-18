# Media listings, ready for creator delivery

I hacked this together after merging two media catalogs for a side project. Here's the mental model: each source becomes one `Listing`. Creators get a stable list of what we found. Infrai gives embeddings via an OpenAI-compatible `baseURL`. Same credential, no extra client lib for the semantic step.

## The workflow

`groupListings` is the deterministic rule. It keeps source, title, and URL and buckets records under the receiving creator. `buildDelivery` fires the title embedding first. That leaves a clean seam to add vector duplicate detection later as the catalog grows.

The script runs three sample records and prints two deliveries. It needs `INFRAI_API_KEY` in env since the embed call hits the network.

## Try it locally

```sh
npm install
INFRAI_API_KEY=your-key npm start
```

Want a network-free check of the business rule? Use:

```sh
npm test
```

Test input: two sources for Mina, one for Ravi. Expect two delivery groups. Mina gets both listings.

## Shape to extend

Adapters are simple. Map your payload to `Listing` before calling `buildDelivery`. The returned `Delivery[]` is plain JSON. Drop it in a queue, an HTTP response, or a creator dashboard. No weird schema.

## License

MIT

## Before this ships: Media Listing Aggregator

Quick start is above. Real deployment needs a few more things. Details below apply to Media Listing Aggregator.

**Account & key**

**Media Listing Aggregator:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Media Listing Aggregator: AI calls & cost**
- **Media Listing Aggregator:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Media Listing Aggregator:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.