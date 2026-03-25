import { ReaderScreen } from "@/components/reader/ReaderScreen";
import storyData from "@/content/o-nome-do-vento/scenes.json";
import { storyBookSchema } from "@/lib/story/schema";

type HomeProps = {
  searchParams?: Promise<{ blockId?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const storyBook = storyBookSchema.parse(storyData);
  const resolvedParams = (await searchParams) ?? {};
  return (
    <ReaderScreen
      storyBook={storyBook}
      initialBlockId={resolvedParams.blockId ?? null}
    />
  );
}
