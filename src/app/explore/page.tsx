import { ExplorePage } from "@/features/explore/ExplorePage";
import { createPageMetadata } from "@/i18n/metadata";

export const metadata = createPageMetadata("zh", "explore");

export default function Page() {
  return <ExplorePage initialLang="zh" />;
}
