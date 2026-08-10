/**
 * The workspace a server render belongs to, from the request's own `Host`
 * header.
 *
 * Separate from `lib/host` because `next/headers` is server-only and that module
 * is not: the client shell imports `orgUrl` from it to build cross-workspace
 * links, and pulling a server API into that import graph would break the build
 * in a way whose error message names neither file.
 *
 * Every page under the shell calls this and 404s without it. A request that
 * arrived on a hostname naming no workspace is not a page with a missing
 * sidebar — it is a URL that does not exist, and the proxy has already sent the
 * hostnames that legitimately have no workspace somewhere that does.
 */

import { headers } from "next/headers"

import { orgFromHost } from "@/lib/host"
import type { Org } from "@/lib/scope"

export async function requestOrg(): Promise<Org | undefined> {
  return orgFromHost((await headers()).get("host"))
}
