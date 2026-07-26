# SharedRoot Chained a Linux Kernel Flaw with Claude Cowork Design Choices to Reach the Host Mac

**Date:** 2026-07-26
**Tags:** malicious-tool

## Executive Summary

Accomplish demonstrated that code running in a local Claude Cowork session could use CVE-2026-46331 to become guest root and then read or write the host Mac through a full-filesystem VirtioFS mount. The chain does not appear to affect Cowork’s default cloud execution path, but defenders supporting local execution should validate the guest kernel, restrict namespaces and netlink access, and confirm that only explicitly approved host folders are mounted into the VM.

## Campaign Summary

| Field | Detail |
|-------|--------|
| Campaign / Malware | SharedRoot |
| Actor / Attribution | Accomplish proof of concept; no observed threat actor or in-the-wild exploitation |
| Target | macOS users running Claude Cowork with local Linux VM execution |
| Vector | Untrusted content or an agent prompt gains code execution in the VM, exploits CVE-2026-46331 for guest root, and reaches a writable host-filesystem mount |
| Status | disclosed to Anthropic and closed as Informative; cloud execution is now the default |
| First Observed | 2026-07-23 public disclosure |

## Detailed Findings

According to Accomplish, researchers connected a folder to a fresh local Claude Cowork session, sent one short message, and demonstrated code reaching the host Mac to read and write files outside the connected folder without another permission prompt. Accomplish stated that it tested the complete chain on its own machine and did not report in-the-wild exploitation.

Accomplish reported that local Cowork work executes as a throwaway unprivileged user in a Linux VM created through Apple’s Virtualization framework, with a seccomp filter and a root `coworkd` daemon brokering connected folders. Accomplish found that the VM also mounted the complete host filesystem read-write at `/mnt/.virtiofs-root`, visible to guest root.

Accomplish reported that the unprivileged session user could create a user namespace with `unshare`, obtain `CAP_NET_ADMIN` inside that namespace, open a netlink path allowed by the seccomp policy, and trigger autoloading of the unnecessary `act_pedit` kernel module. Accomplish then used CVE-2026-46331, the `pedit COW` Linux kernel flaw, to poison the page cache of a root-owned helper binary that the session could read but not modify on disk.

Accomplish reported that the root `coworkd` process later re-executed the poisoned helper from the shared filesystem view, converting the page-cache write primitive into guest-root execution. Accomplish stated that guest root could then access `/mnt/.virtiofs-root` and operate on files available to the logged-in macOS user, including SSH keys and cloud credentials.

Accomplish stated that Anthropic closed the vulnerability submission as “Informative” and that Cowork now uses cloud execution by default, where this local VM escape path does not appear to apply. Ubuntu’s CVE record, last updated 2026-07-20, classified CVE-2026-46331 as high priority and listed multiple supported Linux kernel branches as vulnerable or work in progress.

## MITRE ATT&CK Mapping

| Technique | ID | Context |
|-----------|-----|---------|
| Exploitation for Privilege Escalation | T1068 | CVE-2026-46331 converted unprivileged VM code execution into guest root |
| Escape to Host | T1611 | Guest root accessed the full host Mac through the writable VirtioFS mount |
| Data from Local System | T1005 | The proof of concept could read host files outside the folder granted to Cowork |

## IOCs

### Domains

```
No domain IOCs published by source
```

### Full URL Paths

```
No URL IOCs published by source
```

### Splunk Format

```
No IOCs available for Splunk query
```

### File Hashes

```
No hash IOCs published by source
```

## Detection Recommendations

Inventory Macs permitted to run Claude Cowork locally and record the guest kernel version and application execution mode. On local Cowork guests, disable unprivileged user namespaces where operationally possible, deny `unshare`, namespace-creating clone flags, and `AF_NETLINK` sockets through a default-deny seccomp profile, and block autoloading of unused `net/sched` modules including `act_pedit`. Validate that `/mnt/.virtiofs-root` is absent and that only explicitly granted directories are exposed through read-only mounts where possible. Alert on Cowork guest processes invoking `unshare`, creating traffic-control actions, loading `act_pedit`, modifying page-cache-backed executables, or writing host paths outside the approved shared folder. Prefer cloud execution until the local guest image and mount design are verified.

## References

- [Accomplish] SharedRoot; Escaping the Claude Cowork sandbox (2026-07-23) — https://accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/
- [Ubuntu] CVE-2026-46331 (updated 2026-07-20) — https://ubuntu.com/security/CVE-2026-46331
- [SOCRadar] SharedRoot: Sandbox Escape in Claude Cowork (2026-07-24) — https://socradar.io/blog/sharedroot-sandbox-escape-claude-cowork/
