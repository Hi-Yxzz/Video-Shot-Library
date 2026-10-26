import {copyFileSync, existsSync, mkdirSync, renameSync, statSync, writeFileSync} from "node:fs";
import {basename, dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectDir, "out", "fast-pilot");
const libraryDir = "/Users/admin/Documents/镜头库.library";
const imagesDir = join(libraryDir, "images");
const folderId = "MSYA24EG3IQC3";

const shots = [
  {
    id: "MSFP260818001",
    name: "01-案例卡片星座",
    composition: "FastCaseCardConstellation",
    frame: 150,
    duration: 5.5,
    tags: ["B-roll 信息镜头", "案例聚合", "卡片星座", "连线绘制", "2.5D视差"],
    motion: "五张案例卡分组弹入，中心节点汇总，连接线延迟绘制，整体轻微拉远。",
  },
  {
    id: "MSFP260818002",
    name: "02-提示词双列对比",
    composition: "FastPromptToComparison",
    frame: 138,
    duration: 5,
    tags: ["B-roll 信息镜头", "提示词", "双列对比", "表格", "扫描转换"],
    motion: "提示框描边与文字揭示后扫描切换为双列比较，重点结论错峰落位。",
  },
  {
    id: "MSFP260818003",
    name: "03-模型排行聚焦",
    composition: "FastRankingScrollLock",
    frame: 100,
    duration: 5,
    tags: ["B-roll 信息镜头", "排行榜", "逐行高亮", "数据聚焦"],
    motion: "排行表逐行进入，酸黄色选择条锁定首位并通过缩放模拟镜头聚焦。",
  },
  {
    id: "MSFP260818004",
    name: "04-复杂问题标题",
    composition: "FastProblemTitleCadence",
    frame: 96,
    duration: 5,
    tags: ["B-roll 信息镜头", "标题", "文字节奏", "章节过渡"],
    motion: "关键词按节奏接力入场，横向分隔线完成视觉锁定并留出阅读停顿。",
  },
  {
    id: "MSFP260818005",
    name: "05-算力倍数冲击",
    composition: "FastComputeCostSlam",
    frame: 90,
    duration: 4.5,
    tags: ["B-roll 信息镜头", "数字冲击", "指标卡", "砸入"],
    motion: "指标卡快速砸入并短促回弹，42× 数字与右侧刻度形成强信息峰值。",
  },
  {
    id: "MSFP260818006",
    name: "06-三阶段工作流",
    composition: "FastThreeStageWorkflow",
    frame: 125,
    duration: 5,
    tags: ["B-roll 信息镜头", "流程", "三阶段", "卡片接力"],
    motion: "三张流程卡依次建立，连接箭头同步绘制，最终形成完整生产链路。",
  },
  {
    id: "MSFP260818007",
    name: "07-概率卡片翻转",
    composition: "FastProbabilityCardFlip",
    frame: 95,
    duration: 4.833333,
    tags: ["B-roll 信息镜头", "数据对比", "卡片翻转", "概率"],
    motion: "三张概率卡错峰翻转到正面，数字独立弹出并保持可比较布局。",
  },
  {
    id: "MSFP260818008",
    name: "08-参数规模里程表",
    composition: "FastParameterOdometer",
    frame: 100,
    duration: 5,
    tags: ["B-roll 信息镜头", "数据", "里程表", "参数规模"],
    motion: "多位数字按不同速度滚动并依次锁定到 2800 亿，随后标签和强调线显现。",
  },
];

const metadataPath = join(libraryDir, "metadata.json");
if (!existsSync(metadataPath) || !existsSync(imagesDir)) {
  throw new Error(`镜头库结构不存在：${libraryDir}`);
}

for (const shot of shots) {
  const videoPath = join(outputDir, "mp4", `${shot.name}.mp4`);
  const thumbnailPath = join(outputDir, "qa", `${shot.composition}-${shot.frame}.png`);
  if (!existsSync(videoPath) || !existsSync(thumbnailPath)) {
    throw new Error(`缺少导出文件：${!existsSync(videoPath) ? videoPath : thumbnailPath}`);
  }
  if (existsSync(join(imagesDir, `${shot.id}.info`))) {
    throw new Error(`目标条目已存在，停止覆盖：${shot.id}`);
  }
}

const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const backupDir = join(libraryDir, "backup", `fast-pilot-${timestamp}`);
mkdirSync(backupDir, {recursive: true});
copyFileSync(metadataPath, join(backupDir, "metadata.json"));

const importedIds = [];
for (const shot of shots) {
  const videoPath = join(outputDir, "mp4", `${shot.name}.mp4`);
  const thumbnailPath = join(outputDir, "qa", `${shot.composition}-${shot.frame}.png`);
  const stagingDir = join(imagesDir, `.${shot.id}.staging`);
  const itemDir = join(imagesDir, `${shot.id}.info`);
  mkdirSync(stagingDir);
  copyFileSync(videoPath, join(stagingDir, `${shot.name}.mp4`));
  copyFileSync(thumbnailPath, join(stagingDir, `${shot.name}_thumbnail.png`));

  const now = Date.now();
  const metadata = {
    id: shot.id,
    name: shot.name,
    size: statSync(videoPath).size,
    btime: now,
    mtime: now,
    ext: "mp4",
    tags: [
      "统一镜头库",
      "快速模式首批",
      "来源-参考视频复刻",
      "16:9",
      "1080p",
      "30fps",
      "无声",
      "本地Remotion源码",
      ...shot.tags,
    ],
    folders: [folderId],
    isDeleted: false,
    url: "",
    annotation: `标题：${shot.name}｜用途：知识口播与信息可视化 B-roll。｜动画：${shot.motion}｜规格：1920×1080 · 30fps · 无声｜时长：${shot.duration.toFixed(2)}s｜源码：${projectDir}/src/fast-pilot`,
    modificationTime: now,
    width: 1920,
    height: 1080,
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    duration: shot.duration,
    lastModified: now,
    palettes: [
      {color: [5, 9, 6], ratio: 84},
      {color: [214, 255, 58], ratio: 8},
      {color: [242, 239, 230], ratio: 6},
      {color: [72, 79, 65], ratio: 2},
    ],
  };
  writeFileSync(join(stagingDir, "metadata.json"), `${JSON.stringify(metadata)}\n`);
  renameSync(stagingDir, itemDir);
  importedIds.push(shot.id);
}

writeFileSync(
  join(backupDir, "imported-items.json"),
  `${JSON.stringify({folderId, importedIds, source: outputDir}, null, 2)}\n`,
);

console.log(`已导入 ${importedIds.length} 个镜头到 ${basename(libraryDir)} / 镜头库`);
console.log(`备份：${backupDir}`);
