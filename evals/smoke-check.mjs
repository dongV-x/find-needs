import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
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
  [skill, "明确要求停止或换主题"],
  [metadata, "$find-needs"],
  [metadata, "allow_implicit_invocation: false"],
  [taskBrief, "## 可直接转发的开场"],
  [conversation, "突然提出另一个功能"],
  [handoff, "需求交接.md"],
  [tryout, "测试 A：红人营销系统验证现有流程"],
  [tryout, "测试 B：反馈系统验证已有页面"],
  [tryout, "测试 C：开发后复看和补问"],
];

for (const [text, marker] of required) {
  if (!text.includes(marker)) throw new Error(`缺少验收约束: ${marker}`);
}
if (cases.length < 14) throw new Error(`测试情形不足: ${cases.length}`);
if (new Set(cases.map((item) => item.id)).size !== cases.length) throw new Error("测试情形 ID 重复");
for (const file of ["SKILL.md", "agents/openai.yaml", "references/task-brief.md", "references/conversation-guide.md", "references/handoff-contract.md", "evals/cases.json", "evals/tryout.md"]) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`缺少文件: ${file}`);
}
console.log(`找需求 smoke check 通过：${cases.length} 个情形、3 个阶段、2 套项目任务卡`);
