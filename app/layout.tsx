import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const metadataCopy = {
  title: "Video Shotcraft｜本地镜头库",
  description: "276 个镜头、159 个 MP4 预览与 174 个本地 TSX Player 实现索引。",
} as const satisfies Metadata;

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host")
    ?? requestHeaders.get("host")
  )?.split(",")[0]?.trim();
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol = forwardedProtocol === "http" ? "http" : "https";

  let metadataBase: URL | undefined;
  if (host) {
    try {
      metadataBase = new URL(`${protocol}://${host}`);
    } catch {
      metadataBase = undefined;
    }
  }

  return {
    metadataBase,
    ...metadataCopy,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      ...metadataCopy,
      images: [
        {
          url: "/og.png",
          width: 1730,
          height: 909,
          alt: metadataCopy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      ...metadataCopy,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
