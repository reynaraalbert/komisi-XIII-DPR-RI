import { Metadata } from "next";
import { readPublicCollectionSafe } from "@/lib/db-store";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  
  const berita = await readPublicCollectionSafe("berita");
  const article = berita?.find(b => b.id === id);

  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.imageUrl }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
    }
  };
}

export default function ShareRedirectPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace("/?berita=${params.id}");` }} />
      <p className="text-slate-500 font-medium animate-pulse">Mengarahkan ke berita...</p>
    </div>
  );
}
