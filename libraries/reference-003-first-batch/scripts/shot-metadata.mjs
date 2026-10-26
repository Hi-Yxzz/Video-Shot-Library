export const ALLOWED_SHOT_TAGS = new Set([
  "标题", "段落", "单词", "字符", "数字", "计数器", "打字", "手写",
  "字幕", "高亮", "替换", "滚动", "组件", "卡片", "列表", "表单",
  "菜单", "对话框", "聊天", "光标", "点击", "拖动", "状态切换",
  "图表", "指标", "进度", "关系图", "推近", "拉远", "环绕", "漂移",
  "穿越", "翻页", "推页", "遮挡", "淡化", "变形", "硬切", "节拍",
  "蒙太奇", "辉光", "扫光", "粒子", "着色器", "纹理", "冲击",
  "品牌", "Logo", "开场", "收尾", "卡片墙", "批量入场", "页面展开",
]);

const CHINESE_PATTERN = /[\u3400-\u9fff]/;

export function validateShotMetadata(cards, metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new TypeError("Shot metadata must be an object");
  }

  const cardIds = new Set(cards.map((card) => card.id));
  for (const id of cardIds) {
    if (!Object.hasOwn(metadata, id)) {
      throw new TypeError(`Missing metadata for shot: ${id}`);
    }
  }
  for (const id of Object.keys(metadata)) {
    if (!cardIds.has(id)) {
      throw new TypeError(`Unknown metadata id: ${id}`);
    }
  }

  const normalized = {};
  for (const id of cardIds) {
    const entry = metadata[id];
    const titleZh = typeof entry?.titleZh === "string" ? entry.titleZh.trim() : "";
    if (!titleZh || !CHINESE_PATTERN.test(titleZh)) {
      throw new TypeError(`Chinese title is required for shot: ${id}`);
    }
    if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
      throw new TypeError(`Tags are required for shot: ${id}`);
    }
    const tags = entry.tags.map((tag) =>
      typeof tag === "string" ? tag.trim() : ""
    );
    if (new Set(tags).size !== tags.length) {
      throw new TypeError(`Shot ${id} has a duplicate tag`);
    }
    for (const tag of tags) {
      if (!ALLOWED_SHOT_TAGS.has(tag)) {
        throw new TypeError(`Shot ${id} has an unknown tag: ${tag}`);
      }
    }
    normalized[id] = { titleZh, tags };
  }
  return normalized;
}

export function applyShotMetadata(cards, metadata) {
  const normalized = validateShotMetadata(cards, metadata);
  return cards.map((card) => ({
    ...card,
    title: normalized[card.id].titleZh,
    tags: normalized[card.id].tags,
  }));
}
