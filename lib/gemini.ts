
import { GameState, SUBJECT_NAMES, SubjectKey, ApiSettings, Phase } from '../types';

const DEFAULT_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "DeepSeek-v4-flash";

const STORAGE_KEY_API = 'bj8z_api_settings';

export const getApiSettings = (): ApiSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_API);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { apiUrl: '', apiKey: '', modelName: '', customPrompt: '' };
};

export const saveApiSettings = (settings: ApiSettings) => {
  localStorage.setItem(STORAGE_KEY_API, JSON.stringify(settings));
};

const buildSystemPrompt = (state: GameState, customPrompt?: string): string => {
  const subjectsStr = (Object.entries(state.subjects) as [SubjectKey, { level: number }][])
    .map(([k, v]) => `${SUBJECT_NAMES[k]}:Lv${Math.floor(v.level)}`)
    .join(', ');

  const statusStr = state.activeStatuses.map(s => s.name).join(', ');
  const talentsStr = state.talents.map(t => t.name).join(', ');

  const recentHistory = state.history.slice(-5).map(h =>
    `[Week ${h.week}] ${h.eventTitle}: ${h.resultSummary}`
  ).join('\n');
  const recentTitles = state.history.slice(-8).map(h => h.eventTitle).join('、');

  if (customPrompt) {
    // User custom prompt — inject state variables
    return customPrompt
      .replace(/\{\{phase\}\}/g, state.phase)
      .replace(/\{\{week\}\}/g, String(state.week))
      .replace(/\{\{talents\}\}/g, talentsStr || '无')
      .replace(/\{\{subjects\}\}/g, subjectsStr)
      .replace(/\{\{statuses\}\}/g, statusStr)
      .replace(/\{\{mindset\}\}/g, String(state.general.mindset))
      .replace(/\{\{health\}\}/g, String(state.general.health))
      .replace(/\{\{money\}\}/g, String(state.general.money))
      .replace(/\{\{efficiency\}\}/g, String(state.general.efficiency))
      .replace(/\{\{romance\}\}/g, String(state.general.romance))
      .replace(/\{\{luck\}\}/g, String(state.general.luck))
      .replace(/\{\{experience\}\}/g, String(state.general.experience))
      .replace(/\{\{competition\}\}/g, state.competition === 'OI' ? '信竞生 (OIer)' : '高考生')
      .replace(/\{\{partner\}\}/g, state.romancePartner || '单身')
      .replace(/\{\{history\}\}/g, recentHistory || '暂无')
      .replace(/\{\{recentTitles\}\}/g, recentTitles || '无');
  }

  return `你是一个 Roguelike 文字冒险游戏【北京八中重开模拟器】的事件生成引擎。玩家在高中生活中不断遭遇随机事件并做出选择，每次选择都会影响属性数值。这不是策略分析游戏——你只需要生成有趣、多样、有沉浸感的高中生活事件。

【游戏背景】
玩家是北京八中高一新生。游戏阶段：暑假(${state.phase === Phase.SUMMER ? '当前' : '已过'}) → 军训(${state.phase === Phase.MILITARY ? '当前' : '已过'}) → 高一上学期（第11周期中，第21周期末）。

【当前状态】
- 身份: ${state.competition === 'OI' ? '信竞生 (OIer)' : '高考生'}
- 阶段: ${state.phase} (第 ${state.week} 周)
- 心态${state.general.mindset} | 健康${state.general.health} | 金钱${state.general.money} | 效率${state.general.efficiency} | 魅力${state.general.romance} | 运气${state.general.luck} | 经验${state.general.experience}
- 感情: ${state.romancePartner ? `有对象:${state.romancePartner}` : '单身'}
- 状态: [${statusStr || '无'}]
- 选科: ${state.selectedSubjects.map(s => SUBJECT_NAMES[s]).join('、') || '未选'}

【最近剧情】:
${recentHistory || '暂无，新学期开始。'}

【核心生成规则 — 请严格遵守】

1. **Roguelike 选项风格（最重要）**
   这是轻小说风格的 Roguelike 游戏，选项必须像视觉小说一样直观、感性、有沉浸感。
   - **绝对禁止**生成"推理分析类"选项，如："分析局势"、"权衡利弊再做决定"、"先观察情况"、"制定策略"、"评估风险后行动"
   - 选项必须是角色当下的**直接行动或态度**，如："冲上去帮忙"、"假装没看见"、"答应TA"、"默默走开"
   - 选项之间体现的是**性格和直觉**的差异，不是智力或策略的高低
   - 参考风格：不是"调查线索找出真相"，而是"你信TA吗？信/不信"；不是"制定复习策略"，而是"熬夜肝/摆烂/抄同学的"

2. **事件多样性**
   你必须生成三个风格完全不同的事件。参考类型分布：
   - 人际关系类：暗恋/表白/友情矛盾/社团冲突/师生互动/同学八卦（约30%）
   - 学业类：考试压力/选科纠结/某一科突然开窍/被老师点名/作业危机（约25%）
   - 日常生活类：食堂/小卖部/天气/通勤/校规/手机被发现/宿舍趣事（约25%）
   - 随机奇遇类：捡到东西/迷路/被认错/谣言/校园传说（约20%）

3. **感情线必须出现**
   - 玩家单身且魅力>15：有较高概率触发暗恋、心动、暧昧、收到情书等事件
   - 玩家单身且魅力>30：必须考虑触发表白/被表白事件
   - 玩家有对象：可以触发约会、吵架、吃醋、共同进步等关系事件
   - 感情线穿插在日常中，不要等到后期才出现

4. **选项平衡性**
   - **禁止**"纯正面"或"纯负面"的选项——每个选项都应有得有失
   - "正确"的选择不应该显而易见，让玩家在快乐/健康/金钱/人际关系之间权衡

5. **数值约束**
   - 效率(efficiency)范围0-20，单次变动通常±1，极少数±2
   - 其他属性(心态/健康/魅力等)范围0-100，单次变动2-15之间
   - 金钱变动一般在10-80之间
   - 每个选项的总增益和总减益大致平衡

6. **北京八中特色**
   - 可提及：百团大战/地下场馆/实验班/竞赛/选科/小卖部/食堂/西单/北海/什刹海
   - 可偶尔使用北京方言或场景，但保持自然

7. **禁止事项**
   - 禁止与这些事件雷同: [${recentTitles || '无'}]
   - 禁止政治敏感、成人限制级、暴力霸凌详细描写
   - 禁止连续两轮生成相同类型的事件

【输出格式】
严格返回 JSON 数组，不要 Markdown 代码块。格式：
[
  {
    "title": "事件标题（口语化，10字以内）",
    "description": "事件描述（生动，带北京高中生活气息，50-100字）",
    "type": "positive/negative/neutral",
    "choices": [
      {
        "text": "选项文本（直接的动作或态度，如：硬撑 / 请假 / 求助）",
        "resultDescription": "选择后的反馈（口语化）",
        "effect": {
          "mindset": 0, "health": 0, "money": 0, "efficiency": 0,
          "romance": 0, "experience": 0, "luck": 0,
          "subjects": {"math": 0},
          "oiStats": {"dp": 0}
        }
      }
    ]
  }
]`;
};

const normalizeApiUrl = (url: string): string => {
  let trimmed = url.trim();
  // If it's just a base domain without the chat completions path, add it
  if (trimmed && !trimmed.includes('/chat/completions')) {
    // Remove trailing slash, then append path
    trimmed = trimmed.replace(/\/+$/, '');
    trimmed = trimmed + '/chat/completions';
  }
  return trimmed;
};

export const generateBatchGameEvents = async (state: GameState) => {
  const settings = getApiSettings();
  const rawUrl = settings.apiUrl.trim() || DEFAULT_API_URL;
  const apiUrl = normalizeApiUrl(rawUrl);
  const modelName = settings.modelName || DEFAULT_MODEL;

  const apiKey = settings.apiKey;

  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key is missing. 请在设置中配置 API Key。");
  }

  const systemPrompt = buildSystemPrompt(
    state,
    settings.apiKey ? settings.customPrompt : undefined // Only use custom prompt with custom API
  );

  let timeoutId: ReturnType<typeof setTimeout>;
  try {
    console.log(`[AI] Calling: ${apiUrl} with model ${modelName}`);
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "请为当前这一周生成3个随机事件。记住：三个事件类型要完全不同，选项要有真实权衡。\n\n直接输出纯JSON数组，不要用Markdown代码块包裹。" }
        ],
        temperature: 1.2
      })
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`API Error (${response.status}): ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    let jsonText = data.choices?.[0]?.message?.content || "[]";

    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      const values = Object.values(parsed);
      const foundArray = values.find(v => Array.isArray(v));
      if (foundArray) {
        parsed = foundArray;
      } else {
        parsed = [parsed];
      }
    }

    return parsed;

  } catch (error: any) {
    clearTimeout(timeoutId);
    const errMsg = error?.message || String(error);
    console.error("AI API Error:", errMsg);
    return [{
      title: "灵感枯竭",
      description: `AI 调用失败：${errMsg.slice(0, 120)}。请检查 API 地址、Key 是否正确，或网络是否通畅。`,
      type: "neutral",
      choices: [
        { text: "继续", resultDescription: "日子还得过。", effect: {} }
      ]
    }];
  }
};
