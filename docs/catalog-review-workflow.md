# Resource catalog review workflow v0.1

Candidate → URL check → source/provenance check → copyright and usage-rights review → editor review → Published → periodic recheck → Archived.

- Candidate records are not represented as verified.
- Public UI must label candidate entries as unverified until human review.
- Store a canonical URL and provider, do not reproduce third-party lessons without explicit license.
- Validate external URLs safely on the server (allow HTTPS, block local/private IPs, cap redirects and response sizes).
- Track checkedAt, reviewedAt, reviewer, content language, price status, license status and link health separately.
- Automated discovery should never auto-publish.
- The 12 category taxonomy is independent from locale and learner language.
