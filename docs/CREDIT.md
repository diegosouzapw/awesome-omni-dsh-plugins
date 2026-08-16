# Creator Credit and Pull Request Precedence

The catalog exists to make independent DSH work discoverable without taking ownership away from
its creators. Public entries cite the original repository and an immutable source commit.

## Precedence for the same plugin

1. A pull request opened by the plugin creator or owning organization.
2. A community pull request explicitly approved or co-authored by the creator.
3. An existing valid community pull request.
4. A catalog automation pull request.
5. A private candidate with no public pull request.

When a creator pull request appears while an automation pull request is open, the automation pull
request is superseded. The creator's branch is never overwritten or force-pushed. If an automated
entry already merged, history remains intact and the creator may claim or correct it in a new
contribution.

## Public attribution

Every catalog entry carries the creator's public GitHub handle, original repository, repository
node ID, plugin subpath and full pinned commit. The public creator profile is derived from the
single handle instead of being stored as a second identity. Catalog validation resolves the node
ID and rejects a repository URL mismatch. Pull request descriptions should say
`Created by @handle` and include source repository and source commit metadata.

A person who posts or comments on a Discussion is not automatically treated as the creator.
Ownership must be supported by the repository owner or organization, package authorship, manifest
metadata or exact pinned source history.

## Git identity

Commit authorship and pull request authorship are separate. Never guess a creator's email or use a
private address found outside an authorized public source. Add a `Co-authored-by` trailer only when
the creator supplied the exact address or it is already verifiably associated with their account.
Visible YAML attribution is required independently of Git identity mapping.

## Catalog license versus upstream license

Catalog facts and editorial YAML metadata are dedicated under CC0-1.0. That dedication does not
change the upstream plugin's license. Upstream code, documentation, screenshots, logos and other
creative material remain subject to their original licenses and owners.
