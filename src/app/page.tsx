import { ReaderScreen } from "@/screens/reader/ReaderScreen";
import { storyBookData } from "@/content/o-nome-do-vento";
import { storyBookSchema } from "@/lib/story/schema";
import {
  applyGlobalCharsPerSecond,
  getConfiguredCharsPerSecond,
} from "@/lib/story/runtimeConfig";

type HomeProps = {
  searchParams?: Promise<{ blockId?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const parsedStoryBook = storyBookSchema.parse(storyBookData);
  const charsPerSecond = getConfiguredCharsPerSecond();
  const storyBook = applyGlobalCharsPerSecond(parsedStoryBook, charsPerSecond);
  const resolvedParams = (await searchParams) ?? {};
  return (
    <ReaderScreen
      storyBook={storyBook}
      initialBlockId={resolvedParams.blockId ?? null}
    />
  );
}
