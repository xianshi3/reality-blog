import ProfileCard from "@/components/common/ProfileCard";
import TechStackCard from "@/components/common/TechStackCard";
import SearchCard from "@/components/common/SearchCard";
import TagCard from "@/components/article/TagCard";
import type { Article } from "@/types/article";

interface RightSidebarProps {
  articles: Article[];
  className?: string;
}

/**
 * 首页右侧栏
 * 个人资料、技术栈、搜索与标签；xl 以下不并排显示，而是排在文章列表之后。
 */
export default function RightSidebar({
  articles,
  className,
}: RightSidebarProps) {
  return (
    <aside className={`w-full xl:w-60 2xl:w-64 flex-shrink-0 space-y-6 ${className ?? ""}`}>

      <ProfileCard />

      <TechStackCard articles={articles} />

      <SearchCard articles={articles} />

      <TagCard articles={articles} />

    </aside>
  );
}