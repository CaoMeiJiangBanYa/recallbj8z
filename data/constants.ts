
import { Difficulty, GeneralStats } from '../types';

export const CHANGELOG_DATA = [
    { version: 'v1.4', date: '2026-5-21', content: ['优化了主界面排版', '新增自定义 API 配置', '保存进度方式改为自动保存', '优化了排行榜的显示', '新增重置成就功能', '新增代理节点默认 API Key'] },
    { version: 'v1.3/beta', date: '2026-1-22', content: ['新增【无限重开 AI版】，接入 Gemini API 实现动态事件。', '优化了负债逻辑，现在负债会有分级 Debuff。'] },
    { version: 'v1.2/testing', date: '2026-1-21', content: ['实装了每日挑战','修复了已知问题'] },
    { version: 'v1.1.2/testing', date: '2026-1-15', content: ['1.2试运行','修改了主页','增加了深色模式和存档功能（可能会有若干bug）','添加了若干事件和成就'] },
    { version: 'v1.1.1', date: '2026-1-11', content: ['修bug，增加金主位，欢迎赞助','感谢大家的反馈，大更新预计在1.20左右上线（截至该版本上线，已收到来自15+省区的~50份反馈问卷，真的感谢大家的支持，给大家磕一个）'] },
    { version: 'v1.1.0', date: '2026-1-4', content: ['我们调整了很多东西，请您自行游玩体验','此版本并不足够稳定，可能存在若干Bug'] },
    { version: 'v1.0.0/稳定', date: '2026-1-3', content: ['三月七好可爱', '珂朵莉好可爱', '风堇好可爱', '广告位招租'] }
];

export const DIFFICULTY_PRESETS: Record<Exclude<Difficulty, 'CUSTOM'>, { label: string, desc: string, stats: GeneralStats, color: string }> = {
    'NORMAL': {
        label: '普通',
        desc: '体验相对轻松的高中生活。(属性大幅提升，更易获得高分)',
        color: 'bg-emerald-500',
        stats: {
            mindset: 40, // Buffed
            experience: 15,
            luck: 45,
            romance: 40,
            health: 80,
            money: 80,
            efficiency: 14 // Buffed significantly
        }
    },
    'HARD': {
        label: '困难',
        desc: '资源紧张，压力较大。',
        color: 'bg-orange-500',
        stats: {
            mindset: 35,
            experience: 10,
            luck: 40,
            romance: 10,
            health: 70,
            money: 50,
            efficiency: 10
        }
    },
    'REALITY': {
        label: '现实',
        desc: '这就是真实的人生。只有在此模式下可解锁成就。',
        color: 'bg-rose-600',
        stats: {
            mindset: 30,
            experience: 5,
            luck: 30,
            romance: 5,
            health: 60,
            money: 20,
            efficiency: 8
        }
    },
    'AI_STORY': {
        label: 'AI 叙事',
        desc: '事件由 AI 实时生成，包含更丰富的 NPC 互动。',
        color: 'bg-indigo-600',
        stats: {
            mindset: 50,
            experience: 20,
            luck: 50,
            romance: 20,
            health: 80,
            money: 100,
            efficiency: 12
        }
    }
};

// Stat description thresholds - shared between StatsPanel and RealityGuideModal
export const STAT_THRESHOLDS = [
  { label: '糟糕透顶', range: '< 20', min: 0, max: 19, color: 'rose' },
  { label: '不太妙', range: '20 - 39', min: 20, max: 39, color: 'orange' },
  { label: '平平无奇', range: '40 - 59', min: 40, max: 59, color: 'slate' },
  { label: '感觉良好', range: '60 - 79', min: 60, max: 79, color: 'emerald' },
  { label: '充满自信', range: '80 - 99', min: 80, max: 99, color: 'indigo' },
  { label: '超凡脱俗', range: '≥ 100', min: 100, max: Infinity, color: 'amber' },
];

export const EFFICIENCY_THRESHOLDS = [
  { label: '极度涣散', range: '< 0', min: -Infinity, max: -1, color: 'rose' },
  { label: '心不在焉', range: '0 - 4', min: 0, max: 4, color: 'orange' },
  { label: '普普通通', range: '5 - 9', min: 5, max: 9, color: 'slate' },
  { label: '专注', range: '10 - 14', min: 10, max: 14, color: 'indigo' },
  { label: '高效', range: '15 - 19', min: 15, max: 19, color: 'emerald' },
  { label: '心流', range: '≥ 20', min: 20, max: Infinity, color: 'amber' },
];

export const SUBJECT_THRESHOLDS = [
  { label: '一窍不通', range: '< 10', min: 0, max: 9, color: 'rose' },
  { label: '略懂皮毛', range: '10 - 24', min: 10, max: 24, color: 'orange' },
  { label: '马马虎虎', range: '25 - 44', min: 25, max: 44, color: 'slate' },
  { label: '渐入佳境', range: '45 - 64', min: 45, max: 64, color: 'indigo' },
  { label: '得心应手', range: '65 - 84', min: 65, max: 84, color: 'emerald' },
  { label: '登峰造极', range: '≥ 85', min: 85, max: Infinity, color: 'amber' },
];
