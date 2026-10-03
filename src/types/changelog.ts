/** 「更新日志」卡片条目：GitHub 提交信息 + 服务端预格式化的日期文案 */

export interface ChangelogEntry {
  sha: string;
  /** 短 SHA，用于列表右侧展示 */
  shortSha: string;
  /** 提交信息首行 */
  message: string;
  /** 该提交的 GitHub 页面地址 */
  htmlUrl: string;
  /** 服务端格式化后的相对日期，避免客户端与服务端时区不一致导致 hydration 不匹配 */
  dateLabel: string;
}