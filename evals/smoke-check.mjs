import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const version = read("VERSION").trim();
const skill = read("SKILL.md");
const metadata = read("agents/openai.yaml");
const taskBrief = read("references/task-brief.md");
const conversation = read("references/conversation-guide.md");
const handoff = read("references/handoff-contract.md");
const tryout = read("evals/tryout.md");
const cases = JSON.parse(read("evals/cases.json"));

const required = [
  [skill, "name: find-needs"],
  [skill, "还原实际工作"],
  [skill, "对照当前系统"],
  [skill, "补找遗漏"],
  [skill, "加载验证必须在开始提问前完成"],
  [skill, "任务单必过项"],
  [skill, "不能声称已是最新版"],
  [skill, "明确要求停止或换主题"],
  [metadata, "allow_implicit_invocation: true"],
  [taskBrief, "## 可直接转发的开场"],
  [taskBrief, "Find Needs Skill 已加载，访谈现在开始"],
  [taskBrief, "## 完成前必过"],
  [conversation, "突然提出另一个功能"],
  [handoff, "需求交接.md"],
  [handoff, "对应步骤或支持结论"],
  [handoff, "## 完成前必过项"],
  [tryout, "测试 A：红人营销系统验证现有流程"],
  [tryout, "测试 B：反馈系统验证已有页面"],
  [tryout, "测试 C：开发后复看和补问"],
];

for (const [text, marker] of required) {
  if (!text.includes(marker)) throw new Error(`缺少验收约束: ${marker}`);
}
if (cases.length < 15) throw new Error(`测试情形不足: ${cases.length}`);
if (!/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(version)) throw new Error(`VERSION 格式错误: ${version}`);
if (new Set(cases.map((item) => item.id)).size !== cases.length) throw new Error("测试情形 ID 重复");
for (const file of ["VERSION", "SKILL.md", "agents/openai.yaml", "references/task-brief.md", "references/conversation-guide.md", "references/handoff-contract.md", "evals/cases.json", "evals/tryout.md"]) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`缺少文件: ${file}`);
}
console.log(`找需求 smoke check 通过：${cases.length} 个情形、3 个阶段、2 套项目任务卡`);
