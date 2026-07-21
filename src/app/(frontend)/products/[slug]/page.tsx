import { permanentRedirect } from "next/navigation";

// The old flat product catalog was replaced by bird-type solution pages
// (client brief §3/§4). These redirects keep old URLs and any
// search-engine index entries working.
const REDIRECTS: Record<string, string> = {
  "h-type-layer-pullet-systems": "/layer#layer-pullet",
  "h-type-commercial-matrix": "/layer#h-type",
  "layer": "/layer",
  "breeder": "/breeder",
  "automated-nest-boxes": "/breeder",
  "broiler": "/broiler",
  "silo-storage-matrix": "/feed-silos",
  "ventilation-system": "/environmental-control",
  "debeaking-ai-module": "/layer",
  "drinking-system": "/layer",
  "feeding-system": "/layer",
};

export default async function ProductRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(REDIRECTS[slug] ?? "/products");
}
