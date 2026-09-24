import { HomePage } from "@/features/home/HomePage";
import { createPageMetadata } from "@/i18n/metadata";

export const metadata = createPageMetadata("zh", "home");

export default function Page() {
  return <HomePage initialLang="zh" />;
}
