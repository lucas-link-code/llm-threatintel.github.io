# Are You Actually Using the Model You Selected?

Have you ever selected a specific model through an API or a model picker and wondered how you could actually prove that it was the model that processed your request?

I started thinking about this because selling tokens is already a big business, and just like with any product, where is the proof of origin? Some models cost considerably more than others. If I deliberately choose a premium model because I want its stronger reasoning capability, and I am charged the higher token rate, I want some evidence that the request really was served by that model.

At first this looks easy to verify. I send an API request containing the exact model name. The response contains the same model name. My account is billed accordingly.

But all of that information is being supplied by the service I am asking to verify, not an independent source.
That is where model provenance becomes useful.

## What the API returns is not proof

A model picker or an API response that repeats the model name is useful. It is not independent evidence.

I asked the vendor which model ran. The vendor told me which model ran. The bill used the same name. I have a consistent story from one party, not a second source.

That distinction matters because premium models and cheaper ones can sit behind the same product UI. Auto selectors, latest aliases, and silent fallbacks all make the picker look like a guarantee when it is only the first claim in the chain.

## Provenance is not the same as a BOM

Provenance is about establishing where a model came from, which version it is, what happened to it before deployment, and whether the thing being used is the thing I expected.

There is a related concept called an AI or ML Bill of Materials, usually shortened to AI BOM or ML BOM. It is similar to a software SBOM. It records the components that make up an AI system: the base model, tokenizer, datasets, adapters, frameworks, runtime and other dependencies.

The BOM tells me what the system is made from. It is a record of the components that make up an AI system: the base model, tokenizer, datasets etc.
Provenance is the ability to find out where those components came from and how they got there.

I think these two things will matter more and more as the industry matures and inevitably we may have to deal with counterfeiting or other attempts to misrepresent or missell a model.

## What I can prove if I host the model

For a model I download and run myself, I can go quite far. I can pin a repository revision, hash the model files, verify signatures, record the base model, check any fine tuning or quantisation, and control the inference runtime.

With a hosted model, most of that disappears behind the API. I cannot hash Anthropic's or OpenAI's production model weights because I never receive them. I therefore cannot independently prove that those exact weights generated my response.

What I can do is build a strong record of the transaction.
What did I ask for, and what actually handled it?

| Control | Hosted by me | Hosted API or picker |
|---------|--------------|----------------------|
| Exact model files | Hash and pin the weights | Not available to the customer |
| Publisher and revision | Repository, signature, lineage | Vendor statement |
| Fine tuning or quantisation | Recorded in the BOM and hashes | Usually opaque |
| Runtime | I choose it | Vendor chooses it |
| Identity of this request | I know what is loaded | I know what the service reports |

## OpenRouter makes the routing layer visible

OpenRouter is a useful example because the routing layer is visible.

If model identity matters, I would avoid selectors such as auto or latest and use the exact model identifier.

I would also disable fallbacks where possible. Otherwise I may request one model and allow the service to silently move to another endpoint if the first one is unavailable.

There are two layers here, and they are easy to mix up. Provider failover is on by default. That can keep the same model name while moving the request to another provider endpoint. Model fallbacks are a separate control. A models array can change which model answers. Usage is billed for the model that actually ran, not the one that errored first.

OpenRouter can expose routing metadata for a request. That lets me see the model I requested, which provider endpoint was selected, whether the request was routed directly, and whether any fallback attempts took place.

That is already much better than looking at the model name in a chat window.
For an important request I would retain the generation ID, request ID, resolved model, provider, token counts and cost.

I now have a simple evidence chain:

```text
1. What I requested
2. What the router says it selected
3. Which provider handled it
4. What usage was recorded
5. What I was charged
```

It is not cryptographic proof of the model weights, but it gives me something measurable.

## The bill is part of the evidence

Pricing gives another useful check.

If I know how many input and output tokens were used, I can estimate what I expected the request to cost based on the published rate for that model.

There can be legitimate differences because of cached tokens, provider pricing or other billing mechanics, so I would not treat a mismatch as automatic proof of substitution.

But if I select a premium model and the recorded usage looks much closer to a cheaper model, I would investigate it.

The reverse matters too. If the transaction records a cheaper model but I am charged at the premium rate, that is clearly something I would want explained.

The model attribution, usage and charge should all describe the same transaction.

## Checking a router against the provider

If I use my own upstream API key through a routing service, I can potentially compare records from both sides. OpenRouter may say that a request went to Anthropic using a particular model.

Anthropic's own account then records corresponding usage. If those records line up, I now have two separate systems agreeing on what happened.

Again, this still does not let me inspect the production weights, but it is stronger than trusting one intermediary alone.


## What browser DevTools can and cannot show

Sometimes I can inspect the network traffic.

For browser based AI tools, Developer Tools can reveal the model identifier being sent by the client, along with request IDs or other useful metadata returned by the service.

I normally submit a unique test prompt, find the corresponding Fetch or XHR, SSE or WebSocket request, and inspect the request and response. This can show me what the browser asked the application's backend to do. But there is an important limit.

The browser may talk to the product's own orchestration service, while that backend talks separately to Anthropic, OpenAI or another provider.

I cannot see a request from one server to another that never passes through my machine.
That is often exactly where the final routing decision takes place.

## Asking the model is not verification

One thing I would not rely on is simply asking:
What model are you?

The answer may come from a system prompt or product configuration. A model can identify itself as whatever the service tells it to identify itself as.

Behavioural testing is slightly more useful.
I could keep a private set of prompts and compare how a model performs over time. A significant change may indicate a new model, a different system prompt, another provider or some other change in the serving stack.

That can help detect drift but It still cannot prove identity.

## What stronger proof looks like

If I control the model myself, the assurance becomes much stronger.

I can start with a trusted publisher, verify hashes and signatures, record the model in an ML BOM, preserve its lineage, and potentially use measured or confidential computing environments to attest what is actually running.

That is much closer to technical proof.

Hosted commercial models normally do not expose that level of evidence to customers, so the practical goal is different.

I am not trying to prove something the platform does not make technically provable.
I am collecting enough independent evidence that unexpected model substitution, routing changes or billing inconsistencies become visible.

## One takeaway

A model picker or API response tells me what the service says I used.
That is useful, but it is not the same as proving the underlying model.

For models I host myself, provenance can be built from trusted sources, hashes, signatures, ML BOMs and runtime controls.

For hosted models, the practical approach is to record the exact model requested, capture the model and provider the service says handled it, retain request IDs, compare token usage against expected pricing and reconcile those records with billing or upstream provider telemetry where possible.

<p class="blog-post-byline">Author: Lucas L.</p>

