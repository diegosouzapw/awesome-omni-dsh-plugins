# Creator Credit and Pull Request Precedence

The catalog exists to make independent DSH work discoverable without taking ownership away from
its creators. Public entries cite the original repository and an immutable source commit.

## Precedence for the same plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. A pull request opened by the plugin creator or owning organization.
2. A community pull request explicitly approved or co-authored by the creator.
3. An existing valid community pull request.
4. A catalog automation pull request.
5. A private candidate with no public pull request.

A direct creator pull request is always preferred and supersedes any open community curation or
automation pull request for the same canonical plugin, regardless of which opened first or is
further along. The creator's pull request becomes the review vehicle; their branch is never
overwritten, force-pushed or transplanted into the curated pull request. If a curated entry already
merged, history remains intact and the creator may claim or correct it in a new contribution.

## Public attribution

Every catalog entry carries the creator's public GitHub handle, original repository, repository
node ID, plugin subpath and full pinned commit. The public creator profile is derived from the
single handle instead of being stored as a second identity. The separate maintainer provenance
gate resolves the node ID and rejects a repository URL mismatch. Pull request descriptions should say
`Created by @handle` and include source repository and source commit metadata.

A person who posts or comments on a Discussion is not automatically treated as the creator.
Ownership must be supported by the repository owner or organization, package authorship, manifest
metadata or exact pinned source history.

## Git identity

<!-- creator-first:source-bound-git-identity -->

Commit authorship and pull request authorship are separate. A creator-originated pull request keeps
the creator as pull request author, and their commits preserve authorship naturally. A maintainer
or automation account may appear as committer or as a verified co-author, but must not replace the
creator's authorship.

For a curated commit, use the creator as Git author or add a `Co-authored-by` trailer only when the
exact identity is source-bound and publicly verifiable, such as an identity already attached to
the creator's commit in the original repository. Never guess an email, manufacture a noreply
address or use a private address found outside an authorized public source.

When a verified Git identity is unavailable, the curator or automation account authors the commit
and gives explicit visible credit instead: `Created by @handle`, the matching public profile and a
link to the original repository in the entry and pull request. Visible YAML attribution is always
required independently of Git identity mapping. A later direct creator pull request replaces an
open curated pull request rather than inheriting its synthetic history.

## Respectful creator mention

A curated pull request uses one respectful public `@creator` mention in its description next to
the original repository link. It may invite review or a replacement direct pull request. Do not
repeat the mention, open promotional issues, cross-post or send unsolicited direct messages.

## Catalog license versus upstream license

Catalog facts and editorial YAML metadata are dedicated under CC0-1.0. That dedication does not
change the upstream plugin's license. Upstream code, documentation, screenshots, logos and other
creative material remain subject to their original licenses and owners.
