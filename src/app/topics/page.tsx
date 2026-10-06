// 自動配置（ss-aggregate）: 管制塔の scripts/publish.py（write_aggregate_nextjs）が置く。直接編集しない。
import type { Metadata } from "next";
import SsAggregatePage, { pageMetadata } from "../../components/SsAggregatePage";

export const metadata: Metadata = pageMetadata("topics");

export default function Page() {
  return <SsAggregatePage pageKey="topics" />;
}
