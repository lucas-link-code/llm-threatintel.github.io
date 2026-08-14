# NullReceiver Uses Ethereum Dead Drops in DPRK-Linked npm and MCP Package Compromises

**Date:** 2026-08-14
**Tags:** supply-chain, nation-state, malware, mcp-security

## Executive Summary

Sonatype Research Labs identified six malicious npm package versions on 2026-08-10, including `@kolbo/mcp@1.57.1`, which npm registry metadata describes as an AI MCP server for Claude Code; the malicious loader uses Ethereum transactions to resolve command-and-control infrastructure and retrieve additional JavaScript stages. Sonatype linked the loader to the DPRK-associated Contagious Interview campaign through the same attacker wallet that OpenSourceMalware documented on 2026-08-02 in two earlier npm packages using the NullReceiver technique. Defenders should remove all eight exact package versions, determine whether they executed in developer or CI/CD environments, and hunt for the published wallet, stage paths, response header, and OSM-observed C2 address.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | NullReceiver blockchain-based C2 resolution in Contagious Interview npm malware (OpenSourceMalware and Sonatype) |
| Actor / Attribution | DPRK-linked Contagious Interview; Sonatype associates the broader campaign with the Lazarus APT group (confidence: high for campaign linkage based on wallet reuse across the two reports) |
| Target | Affected population: developers, build systems, and downstream users of eight npm package versions, including an AI MCP package (Sonatype, OpenSourceMalware, and npm registry metadata) |
| Vector | Three hijacked legitimate packages and three purpose-built malicious packages reported by Sonatype; two malicious Tailwind CSS plugin clones reported by OpenSourceMalware |
| Status | Sonatype's investigation remained ongoing as of 2026-08-10; neither threat-research source published a complete removal status for every affected version |
| First Observed | Publicly reported by OpenSourceMalware on 2026-08-02; Sonatype identified six additional affected versions on 2026-08-10 |

## Detailed Findings

### Sonatype's August 10 package set

Sonatype Research Labs reported that six npm packages contained the same malicious loader and used the same attacker-controlled Ethereum wallet. Sonatype classified three as legitimate packages whose malicious versions appeared to result from package hijacking under `sonatype-2026-005899`: `@kolbo/mcp@1.57.1`, `agentgui@1.0.1127`, and `godot-kit@1.0.1786316795`. npm registry metadata for version 1.57.1 describes `@kolbo/mcp` as the Kolbo AI MCP server for generating media through Claude Code, establishing the direct AI-agent supply-chain impact.

Sonatype separately tracked three packages that were published with the malware already present under `sonatype-2026-005901`: `envpack-conf@1.0.1`, `postcss-initial-provider@3.0.4`, and `tailwindcss-motion-advanced@1.0.1`. Sonatype reported that these packages retained legitimate-looking functionality while carrying the loader; the hijacked packages retained substantial legitimate code with the malicious logic appended to an existing file.

Sonatype reported that the loader queries Ethereum for an outbound transaction from the embedded wallet and reads bytes from the transaction's recipient address. The malware decodes those bytes into primary and secondary IPv4 C2 addresses, allowing the operator to rotate network infrastructure through a new blockchain transaction rather than publishing a new npm version.

Sonatype reported that this August 10 implementation can race requests across multiple Ethereum RPC providers, issue batched JSON-RPC requests, and fall back to the Blockscout API. Those providers are legitimate shared infrastructure and are not campaign-specific IOCs; they are therefore excluded from the IOC blocks below.

After resolving its C2 addresses, the Sonatype loader requests two additional stages from `/0x/cls` and `/0x/ls`. Sonatype reported that it first attempts a standard HTTP GET and can fall back to a HEAD request that carries the encoded stage in an `X-Payload-B64` response header. The loader Base64- and XOR-decodes the response; content returned from `/0x/cls` can execute through `eval()` in the current Node.js process, while downloaded stages can also run as detached Node.js child processes.

### OpenSourceMalware's August 2 samples

OpenSourceMalware separately analyzed `bianira-ui@1.27.0` and `fluid-type-ui@2.0.8`, two DPRK-linked clones of legitimate Tailwind CSS plugins. OpenSourceMalware named their blockchain C2 resolution method NullReceiver and described the payload as a Node.js RAT. The researchers stated that their findings came from static analysis of the published npm tarballs and read-only blockchain lookups; they did not execute either package.

OpenSourceMalware reported that both packages used wallet `0xa322e5f3d311d3080e6f0121063e9adc2490ef1a`. The latest outbound transaction recovered during that analysis used the recipient address `0xa658863ea658863e68656c6c6f6970626f742121`, whose encoded bytes resolved to `166.88.134.62`; OpenSourceMalware published TCP ports 80 and 443 for that C2. The trailing recipient-address bytes also decoded to the fingerprint string `helloipbot!!`, and OpenSourceMalware published `A10-npm3!` as a detection signature.

The `166.88.134.62` observation applies to OpenSourceMalware's August 2 package pair. Sonatype stated that its August 10 loader decoded two IPv4 C2 addresses but did not publish those address values, so this report does not claim that `166.88.134.62` was the live C2 for the six Sonatype samples.

### Attribution and scope

OpenSourceMalware attributed the two August 2 packages to the DPRK Contagious Interview campaign. Sonatype independently reported that all six August 10 packages used the same wallet address and described the related activity as DPRK-linked Contagious Interview, with the broader campaign associated with the Lazarus APT group. The shared wallet and matching recipient-address C2 mechanism support the campaign linkage; neither source identified the individual operator behind every affected publication.

Neither source published a SHA-256 or MD5 hash for these eight package versions. Sonatype did not publish the two IPv4 values decoded by its six samples, and neither source published an attacker-owned domain for this activity. The Ethereum RPC and explorer services used to read the wallet are shared services, not malicious infrastructure, and should not be blocked as campaign IOCs.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Supply Chain Compromise: Compromise Software Dependencies and Development Tools | T1195.001 | Sonatype reported malicious versions of three hijacked legitimate npm packages, while both sources documented malicious packages distributed through npm. |
| Web Service: Dead Drop Resolver | T1102.001 | The loader reads attacker-selected C2 bytes from the recipient field of the wallet's latest outbound Ethereum transaction. |
| Command and Scripting Interpreter: JavaScript | T1059.007 | Sonatype reported JavaScript stages that can execute through Node.js `eval()` or detached Node.js child processes. |
| Ingress Tool Transfer | T1105 | Sonatype reported retrieval of follow-on stages from the resolved C2 through `/0x/cls` and `/0x/ls`. |
| Deobfuscate/Decode Files or Information | T1140 | Sonatype reported Base64 and XOR decoding before stage execution. |
| Application Layer Protocol: Web Protocols | T1071.001 | Sonatype reported that the loader uses HTTP GET and HEAD requests to retrieve payloads from dynamically resolved C2 addresses. |

## IOCs

### Package Indicators

Sonatype samples published on 2026-08-10:

```
npm:@kolbo/mcp@1.57.1
npm:agentgui@1.0.1127
npm:envpack-conf@1.0.1
npm:godot-kit@1.0.1786316795
npm:postcss-initial-provider@3.0.4
npm:tailwindcss-motion-advanced@1.0.1
```

OpenSourceMalware samples published on 2026-08-02:

```
npm:bianira-ui@1.27.0
npm:fluid-type-ui@2.0.8
```

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No full URL IOCs published by source
```

Sonatype published the host-independent stage paths `/0x/cls` and `/0x/ls`. They are behavioral hunting patterns rather than standalone URL IOCs because the source did not disclose the associated August 10 C2 addresses.

### IP Addresses

OpenSourceMalware's August 2 samples only:

```
166.88.134[.]62
```

OpenSourceMalware published ports 80 and 443 for this address.

### Splunk Format

```
"*@kolbo/mcp@1.57.1*" OR "*agentgui@1.0.1127*" OR "*bianira-ui@1.27.0*" OR "*envpack-conf@1.0.1*" OR "*fluid-type-ui@2.0.8*" OR "*godot-kit@1.0.1786316795*" OR "*postcss-initial-provider@3.0.4*" OR "*tailwindcss-motion-advanced@1.0.1*" OR "166.88.134.62"
```

### File Hashes

```
No hash IOCs published by source
```

### Hunt-Only Blockchain Indicators

The following values are suitable for source-code, package-cache, and network-payload hunting. They are not proposed as blocklist IOC records because this repository's IOC schema has no cryptocurrency-wallet type and the recipient address represents encoded C2 state rather than a network destination.

```
Attacker wallet: 0xa322e5f3d311d3080e6f0121063e9adc2490ef1a
Encoded recipient: 0xa658863ea658863e68656c6c6f6970626f742121
Static signature: A10-npm3!
```

## Detection Recommendations

Search package-lock files, SBOMs, dependency manifests, local npm caches, artifact repositories, build logs, and deployed application inventories for all eight exact package-and-version pairs. Do not alert on the unversioned package names alone because Sonatype identified specific malicious versions of otherwise legitimate packages in the August 10 set.

Treat confirmed import or execution as a host-compromise event. Isolate affected developer workstations or CI/CD runners, preserve Node.js process and network telemetry, identify child processes and files created by Node.js, and scope credentials available to the affected process before rotating exposed developer, source-control, registry, cloud, and deployment secrets.

In proxy and EDR telemetry, correlate `node` or `node.exe` with direct HTTP connections to numeric IP addresses, requests ending in `/0x/cls` or `/0x/ls`, HEAD responses containing `X-Payload-B64`, and subsequent detached Node.js child processes. The `/0x/cls` stage can execute in-process through `eval()`, so the absence of a child process does not exclude execution.

Search source files, package caches, process memory, and captured request bodies for the wallet `0xa322e5f3d311d3080e6f0121063e9adc2490ef1a`, the recipient address `0xa658863ea658863e68656c6c6f6970626f742121`, and the string `A10-npm3!`. Monitor unexpected Node.js access to Ethereum RPC or explorer APIs only in combination with these artifacts or an affected package; do not block shared blockchain providers globally.

Alert on traffic to `166.88.134[.]62` over TCP 80 or 443, but retain the package, wallet, and stage-path hunts after that address becomes inactive because NullReceiver allows the actor to change C2 infrastructure through a new wallet transaction.

## References

- [Sonatype Research Labs] Six npm Packages Use Ethereum Transactions to Retrieve Malicious Payloads (2026-08-10) — https://www.sonatype.com/blog/six-npm-packages-use-ethereum-transactions-to-retrieve-malicious-payloads
- [OpenSourceMalware] NullReceiver's Blank Crypto Transfers Solves the Challenges of EtherHiding (2026-08-02) — https://opensourcemalware.com/blog/nullreceiver-dprk-c2-technique
- [npm Registry] @kolbo/mcp 1.57.1 package metadata (2026-08-08) — https://registry.npmjs.org/%40kolbo%2Fmcp/1.57.1
