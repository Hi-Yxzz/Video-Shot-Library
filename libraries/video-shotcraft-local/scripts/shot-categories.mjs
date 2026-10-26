const GRADED_CATEGORY_MAP = new Map([
  ["3D场景", "camera"],
  ["Shader背景", "effects"],
  ["UI组件", "interaction"],
  ["产品演示", "interaction"],
  ["代码演示", "interaction"],
  ["光标交互", "interaction"],
  ["动态背景", "effects"],
  ["图片媒体", "rhythm"],
  ["品牌Logo", "opening"],
  ["数据图表", "data"],
  ["文字动效", "typography"],
  ["粒子效果", "effects"],
  ["组合场景", "rhythm"],
  ["聊天界面", "interaction"],
  ["视觉效果", "effects"],
  ["转场", "transition"],
]);

const CATEGORY_OVERRIDES = new Map([
  ["video-shotcraft/line-boil", "typography"],
  ["video-shotcraft/slam-entrance-moves", "ui-entrance"],
  ["remocn/check-list", "typography"],
  ["remocn/drift", "camera"],
  ["remocn/ecosystem-constellation", "data"],
  ["remocn/fade-through", "transition"],
  ["remocn/hand-count", "typography"],
  ["remocn/handwrite", "typography"],
  ["remocn/icon-scatter", "transition"],
  ["remocn/kinetic-center-build", "typography"],
  ["remocn/line-by-line-slide", "typography"],
  ["remocn/mask-reveal-up", "typography"],
  ["remocn/paper-sticker", "ui-entrance"],
  ["remocn/polaroid", "ui-entrance"],
  ["remocn/progress-steps", "interaction"],
  ["remocn/push-through", "transition"],
  ["remocn/ripple-zoom", "transition"],
  ["remocn/rolodex-flip", "typography"],
  ["remocn/shared-axis-y", "transition"],
  ["remocn/shared-axis-z", "transition"],
  ["remocn/simulated-cursor", "interaction"],
  ["remocn/slot-machine-roll", "typography"],
  ["remocn/spring-scale-in", "typography"],
  ["remocn/staggered-fade-up", "typography"],
  ["remocn/strikethrough-replace", "typography"],
  ["remocn/x-follow-card", "interaction"],
  ["remocn/x-followers-overview", "interaction"],
]);

function categoryKey(collection, id) {
  return `${collection}/${id}`;
}

export function categoryForGradedShot({
  collection,
  id,
  upstreamCategory,
}) {
  const mappedCategory = GRADED_CATEGORY_MAP.get(upstreamCategory);
  if (!mappedCategory) {
    throw new TypeError(
      `Unknown graded shot category "${upstreamCategory}" for ${categoryKey(collection, id)}`,
    );
  }

  return CATEGORY_OVERRIDES.get(categoryKey(collection, id)) ?? mappedCategory;
}

export function categoryForLibraryCard(card) {
  const id = card.upstreamId ?? card.id;
  return (
    CATEGORY_OVERRIDES.get(categoryKey(card.collection, id)) ?? card.category
  );
}

export function reclassifyLibraryCards(cards) {
  return cards.map((card) => ({
    ...card,
    category: categoryForLibraryCard(card),
  }));
}
