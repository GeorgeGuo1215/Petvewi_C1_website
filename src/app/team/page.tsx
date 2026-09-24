import { TeamPage } from "@/features/team/TeamPage";
import { createPageMetadata } from "@/i18n/metadata";

export const metadata = createPageMetadata("zh", "team");

export default function Page() {
  return <TeamPage initialLang="zh" />;
}
