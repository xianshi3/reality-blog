"use client";

export default function CategoryFilter({
  categories,
  defaultValue,
}: {
  categories: string[];
  defaultValue: string;
}) {
  return (
    <select
      name="category"
      className="admin-category-select"
      defaultValue={defaultValue}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set("category", e.target.value);
        else params.delete("category");
        params.delete("page");
        window.location.href = `/admin/articles?${params.toString()}`;
      }}
    >
      <option value="">全部分类</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}
