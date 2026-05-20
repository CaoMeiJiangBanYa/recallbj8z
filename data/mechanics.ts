
import { Talent, Item, Achievement, GameStatus, Club, WeekendActivity } from '../types';
import { modifySub, modifyOI } from './utils';

// --- Talents ---
export const TALENTS: Talent[] = [
    // --- Legendary (Cost 4) ---
    { id: 'genius', name: '天生我才', description: '全科天赋+8，效率+2，考试分数×1.05。', rarity: 'legendary', cost: 4,
      effect: (s) => {
          const newSubs = { ...s.subjects };
          (Object.keys(newSubs) as (keyof typeof newSubs)[]).forEach(k => newSubs[k].aptitude += 8);
          return { subjects: newSubs, general: { ...s.general, efficiency: s.general.efficiency + 2 } };
      },
      passive: { examScoreMultiplier: 1.05 }
    },
    { id: 'rich_kid', name: '家里有矿', description: '商店7折，金钱获取+50%，免疫讨债事件。', rarity: 'legendary', cost: 4,
      effect: (s) => ({ general: { ...s.general, money: s.general.money + 30 } }),
      passive: { shopDiscount: 0.7, moneyGainMultiplier: 1.5, noDebtEvents: true }
    },
    // --- Rare (Cost 2-3) ---
    { id: 'attractive', name: '万人迷', description: '初始魅力+10，恋爱事件触发概率×2。', rarity: 'rare', cost: 2,
      effect: (s) => ({ general: { ...s.general, romance: s.general.romance + 10 } }),
      passive: { romanceEventChanceMultiplier: 2.0 }
    },
    { id: 'oi_nerd', name: '机房幽灵', description: 'OI各项初始+5，但魅力获取减半。', rarity: 'rare', cost: 3,
      effect: (s) => ({
          oiStats: modifyOI(s, { dp: 5, ds: 5, math: 5, string: 5, graph: 5, misc: 5 }),
          general: { ...s.general, romance: Math.max(0, s.general.romance - 5) }
      }),
      passive: { romanceGainMultiplier: 0.5 }
    },
    { id: 'lucky_dog', name: '锦鲤附体', description: '运气+15，且运气不会低于30。', rarity: 'rare', cost: 2,
        effect: (s) => ({ general: { ...s.general, luck: s.general.luck + 15 } }),
        passive: { luckFloor: 30 }
    },
    // --- Common (Cost 1) ---
    { id: 'healthy', name: '体育特长', description: '体力恢复×1.5。', rarity: 'common', cost: 1,
      effect: (s) => ({ general: { ...s.general, health: s.general.health + 10 } }),
      passive: { healthRecoveryMultiplier: 1.5 }
    },
    { id: 'optimist', name: '乐天派', description: '心态+10，且心态不会低于20。', rarity: 'common', cost: 1,
        effect: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 10 } }),
        passive: { mindsetFloor: 20 }
    },
    { id: 'poor_student', name: '寒门学子', description: '初始金钱-30，效率+3，免疫讨债。', rarity: 'common', cost: 1,
        effect: (s) => ({ general: { ...s.general, money: s.general.money - 30, efficiency: s.general.efficiency + 3 } }),
        passive: { noDebtEvents: true }
    },

    // --- Cursed (Negative Cost = Gives Points) ---
    { id: 'poverty', name: '家徒四壁', description: '初始负债120，且不再获得每周固定收入。', rarity: 'cursed', cost: -2,
      effect: (s) => ({ general: { ...s.general, money: s.general.money - 140 } }),
      passive: { noWeeklyMoney: true }
    },
    { id: 'frail', name: '体弱多病', description: '体力上限锁定为50，休息恢复减半。', rarity: 'cursed', cost: -2,
      effect: (s) => ({ general: { ...s.general, health: Math.min(s.general.health, 50) } }),
      passive: { healthCap: 50, healthRecoveryMultiplier: 0.5 }
    },
    { id: 'loner', name: '孤僻', description: '魅力获取恒为0，无法触发恋爱事件。', rarity: 'cursed', cost: -1,
      effect: (s) => ({ general: { ...s.general, romance: 0 } }),
      passive: { romanceGainMultiplier: 0, romanceEventChanceMultiplier: 0 }
    },
    { id: 'dumb', name: '笨鸟先飞', description: '效率+3，但效率上限为15，且效率提升减半、降低翻倍。', rarity: 'cursed', cost: -3,
      effect: (s) => ({ general: { ...s.general, efficiency: Math.min(s.general.efficiency + 3, 15) } }),
      passive: { efficiencyChangeMod: { positiveMultiplier: 0.5, negativeMultiplier: 2 }, efficiencyCap: 15 }
    },
    { id: 'bad_luck', name: '非酋', description: '运气-15，且运气不会超过30。', rarity: 'cursed', cost: -1,
      effect: (s) => ({ general: { ...s.general, luck: Math.max(0, s.general.luck - 15) } }),
      passive: { luckCap: 30 }
    }
];

// --- Shop Items ---
export const SHOP_ITEMS: Item[] = [
    { id: 'red_bull', name: '红牛', description: '精力充沛！效率+2，健康-1。', price: 15, icon: 'fa-bolt', 
      effect: (s) => ({ general: { ...s.general, efficiency: s.general.efficiency + 2, health: s.general.health - 1, money: s.general.money - 15 } }) },
    { id: 'coffee', name: '瑞幸生椰拿铁', description: '我咖啡怎么变了？心态+3，效率+1。', price: 20, icon: 'fa-coffee',
      effect: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 3, efficiency: s.general.efficiency + 1, money: s.general.money - 20 } }) },
    { id: 'five_three', name: '五年高考三年模拟', description: '请输入文本。全科水平+4，心态-8。', price: 45, icon: 'fa-book',
      effect: (s) => ({ 
          subjects: modifySub(s, ['chinese', 'math', 'english', 'physics', 'chemistry', 'biology'], 4), 
          general: { ...s.general, mindset: s.general.mindset - 8, money: s.general.money - 45 } 
      }) },
    { id: 'game_skin', name: '不要问为啥没有648，问就是放这里你买不了', description: '虽然不能变强，但心情变好了。心态+8。', price: 68, icon: 'fa-gamepad',
      effect: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 8, money: s.general.money - 68 } }) },
    { id: 'flowers', name: '鲜花', description: '送给心仪的人。魅力+8，若有对象则大幅提升关系。', price: 50, icon: 'fa-fan',
      effect: (s) => ({ general: { ...s.general, romance: s.general.romance + 8, money: s.general.money - 50, mindset: s.general.mindset + (s.romancePartner ? 5 : 0) } }) },
    { id: 'algo_book', name: '算法导论', description: '厚得可以当枕头。OI能力全面+2。', price: 80, icon: 'fa-code',
      effect: (s) => ({ oiStats: modifyOI(s, { dp: 2, ds: 2, math: 2, graph: 2, string: 2, misc: 2 }), general: { ...s.general, money: s.general.money - 80 } }) },
    { id: 'luogu_book', name: '深入浅出程序设计竞赛', description: 'kkk亲签？', price: 56, icon: 'fa-code',
      effect: (s) => ({ oiStats: modifyOI(s, { dp: 1, ds: 2, math: 2, graph: 1, string: 1, misc: 1 }), general: { ...s.general, money: s.general.money - 56 } }) },
    { id: 'gym_card', name: '健身卡', description: '强身健体。健康+15。', price: 100, icon: 'fa-dumbbell',
      effect: (s) => ({ general: { ...s.general, health: s.general.health + 15, money: s.general.money - 100 } }) }
];

// --- Achievements ---
export const ACHIEVEMENTS: Record<string, Achievement> = {
    'first_blood': { id: 'first_blood', title: '初入八中', description: '成功开始你的高中生活。', icon: 'fa-school', rarity: 'common' },
    'nerd': { id: 'nerd', title: '卷王', description: '单科成绩达到满分。', icon: 'fa-book-reader', rarity: 'rare' },
    'romance_master': { id: 'romance_master', title: '海王', description: '虽然学校不允许……', icon: 'fa-heart', rarity: 'legendary' },
    'oi_god': { id: 'oi_god', title: '???', description: '获得五大竞赛省一。', icon: 'fa-code', rarity: 'legendary' },
    'survival': { id: 'survival', title: '极限生存', description: '在健康低于10的情况下完成一个学期。', icon: 'fa-notes-medical', rarity: 'rare' },
    'rich': { id: 'rich', title: '小金库', description: '持有金钱超过200。', icon: 'fa-coins', rarity: 'common' },
    'in_debt': { id: 'in_debt', title: '负债累累', description: '负债超过250。', icon: 'fa-file-invoice-dollar', rarity: 'common' },
    'top_rank': { id: 'top_rank', title: '一览众山小', description: '年级第一！（真的能实现！LA群里有人成功了！）', icon: 'fa-crown', rarity: 'legendary' },
    'bottom_rank': { id: 'bottom_rank', title: '旷世奇才', description: '倒数第一，也是神人。', icon: 'fa-poop', rarity: 'rare' },
    'sleep_god': { id: 'sleep_god', title: '睡神', description: '天天睡觉还考这么高，羡慕了。', icon: 'fa-bed', rarity: 'legendary' },
    'nice_person': { id: 'nice_person', title: '大好人', description: '对不起，但你人真的挺好（单局内收到5次好人卡）。', icon: 'fa-heart-broken', rarity: 'rare' },
};

// --- Statuses ---
export const STATUSES: Record<string, Omit<GameStatus, 'duration'>> = {
    'focused': { id: 'focused', name: '心流', description: '你进入了极度专注的状态。', type: 'BUFF', icon: 'fa-bolt', effectDescription: '全学科效率大幅提升' },
    'anxious': { id: 'anxious', name: '焦虑', description: '对未来的担忧让你无法平静。', type: 'DEBUFF', icon: 'fa-cloud-rain', effectDescription: '每回合心态 -2' },
    'crush': { id: 'crush', name: '暗恋', description: '那个人的身影总是在脑海挥之不去。', type: 'NEUTRAL', icon: 'fa-heart', effectDescription: '效率 -2，魅力 +2' },
    'in_love': { id: 'in_love', name: '恋爱', description: '甜，太甜了。', type: 'BUFF', icon: 'fa-heartbeat', effectDescription: '每周心态 +5' },
    'heartbroken': { id: 'heartbroken', name: '失恋', description: '心如刀绞，这就是青春的代价吗？', type: 'DEBUFF', icon: 'fa-heart-broken', effectDescription: '每周心态 -3, 效率 -1' },
    'exhausted': { id: 'exhausted', name: '透支', description: '你需要休息。', type: 'DEBUFF', icon: 'fa-bed', effectDescription: '健康无法自然恢复' },
    'crush_pending': { id: 'crush_pending', name: '恋人未满', description: '虽然还没捅破窗户纸，但这种暧昧的感觉真好。', type: 'BUFF', icon: 'fa-comments', effectDescription: '每周运气 +2，经验 +2' },
    'sleep_compulsion': { id: 'sleep_compulsion', name: '让我睡觉！', description: '每周不睡觉就会死。', type: 'DEBUFF', icon: 'fa-dizzy', effectDescription: '每周必须进行一次睡觉事件' },
    // --- Graded Debt Statuses ---
    'debt_1': { id: 'debt_1', name: '负债 I', description: '这点钱下个月就能还上……吧？', type: 'DEBUFF', icon: 'fa-file-invoice', effectDescription: '心态-5, 魅力-3 /周' },
    'debt_2': { id: 'debt_2', name: '负债 II', description: '债务像滚雪球一样变大了。', type: 'DEBUFF', icon: 'fa-file-invoice-dollar', effectDescription: '心态-10, 魅力-6 /周' },
    'debt_3': { id: 'debt_3', name: '负债 III', description: '你开始躲避任何敲门声。', type: 'DEBUFF', icon: 'fa-sack-dollar', effectDescription: '心态-20, 魅力-12 /周' },
    'debt_4': { id: 'debt_4', name: '负债 IV', description: '能欠下来这么多也是有实力的……', type: 'DEBUFF', icon: 'fa-skull', effectDescription: '心态-40, 魅力-24 /周' },
    'debt_5': { id: 'debt_5', name: '负债 V', description: '还有高手？', type: 'DEBUFF', icon: 'fa-skull', effectDescription: '心态-80, 魅力-48 /周' }
};

// --- Clubs ---
export const CLUBS: Club[] = [
    {
        id: 'rap', name: '说唱社', icon: 'fa-microphone', description: 'Real Talk, Real Life.', effectDescription: '魅力++, 英语+, 经验+',
        action: (s) => ({ general: { ...s.general, romance: s.general.romance + 3, experience: s.general.experience + 2 }, subjects: modifySub(s, ['english'], 1) })
    },
    {
        id: 'dance', name: '街舞社', icon: 'fa-child', description: '挥洒汗水，舞动青春。', effectDescription: '健康++, 魅力++, 心态+',
        action: (s) => ({ general: { ...s.general, health: s.general.health + 3, romance: s.general.romance + 3, mindset: s.general.mindset + 2 } })
    },
    {
        id: 'volleyball', name: '排球社', icon: 'fa-volleyball-ball', description: '我实在编不出来词了', effectDescription: '健康++, 魅力+, 心态+',
        action: (s) => ({ general: { ...s.general, health: s.general.health + 3, romance: s.general.romance + 2, mindset: s.general.mindset + 2 } })
    },
    {
        id: 'vocaloid', name: '天籁V家', icon: 'fa-music', description: 'Miku！', effectDescription: '魅力++, 心态+, 经验+',
        action: (s) => ({ general: { ...s.general, romance: s.general.romance + 3, mindset: s.general.mindset + 2, experience: s.general.experience + 1 } })
    },
    {
        id: 'poetry', name: '一方诗社', icon: 'fa-pen-nib', description: '诗意栖居，文采飞扬。', effectDescription: '语文++, 心态+, 历史+',
        action: (s) => ({ subjects: modifySub(s, ['chinese', 'history'], 2), general: { ...s.general, mindset: s.general.mindset + 2 } })
    },
    {
        id: 'social_science', name: '社会科学研学社', icon: 'fa-globe', description: '研究社会问题，关注人类命运。', effectDescription: '政治++, 历史++, 经验+',
        action: (s) => ({ subjects: modifySub(s, ['politics', 'history'], 2), general: { ...s.general, experience: s.general.experience + 2 } })
    },
    {
        id: 'mun', name: '模拟联合国', icon: 'fa-handshake', description: '西装革履，纵横捭阖。', effectDescription: '英语++, 政治+, 魅力+',
        action: (s) => ({ subjects: modifySub(s, ['english', 'politics'], 2), general: { ...s.general, romance: s.general.romance + 2 } })
    },
    {
        id: 'touhou', name: '东方Project社', icon: 'fa-torii-gate', description: '此生无悔入东方，来世愿生幻想乡。', effectDescription: '心态++, 运气+, 认识同好',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 4, luck: s.general.luck + 1 } })
    },
    {
        id: 'astronomy', name: '南斗天文社', icon: 'fa-star', description: 'whd:欢迎加入【数据删除】！', effectDescription: '物理++, 地理+, 心态+',
        action: (s) => ({ subjects: modifySub(s, ['physics', 'geography'], 2), general: { ...s.general, mindset: s.general.mindset + 2 } })
    },
    {
        id: 'math_research', name: '大数研究社', icon: 'fa-calculator', description: 'G(64)?', effectDescription: '数学+++, 逻辑+',
        action: (s) => ({ subjects: modifySub(s, ['math'], 4) })
    },
    {
        id: 'ttrpg', name: '跑团社', icon: 'fa-dice-d20', description: '虽然但是，我们真的约跑欸（？', effectDescription: '运气++, 心态++, 经验+',
        action: (s) => ({ general: { ...s.general, luck: s.general.luck + 3, mindset: s.general.mindset + 3, experience: s.general.experience + 1 } })
    },
    {
        id: 'literature', name: '文学社', icon: 'fa-feather-alt', description: '以文会友，激扬文字。', effectDescription: '语文++, 历史+, 心态+',
        action: (s) => ({ subjects: modifySub(s, ['chinese', 'history'], 2), general: { ...s.general, mindset: s.general.mindset + 2 } })
    },
    {
        id: 'otaku', name: '御宅社', icon: 'fa-gamepad', description: '二次元的避风港。', effectDescription: '心态+++, 宅属性+',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 5, health: s.general.health - 1 } })
    },
    {
        id: 'anime', name: '动漫社', icon: 'fa-tv', description: '一起补番，一起吐槽。', effectDescription: '心态++, 魅力+',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 4, romance: s.general.romance + 1 } })
    },
    {
        id: 'human_behavior', name: '人类行为研究社', icon: 'fa-user-secret', description: '拓宽人类行为的边界。', effectDescription: '心态+++, 健康++, 魅力-',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 5, health: s.general.health + 3, romance: s.general.romance - 2 } })
    }
];

// --- Weekend Activities (精简至12个，各有独特定位) ---
export const WEEKEND_ACTIVITIES: WeekendActivity[] = [
    // === 学习类 STUDY ===
    {
        id: 'w_library', name: '上图书馆', icon: 'fa-book', type: 'STUDY',
        description: '效率+0.5，语数外+0.5。稳扎稳打。',
        resultText: '图书馆的氛围很好，你巩固了基础，感觉效率微升。',
        action: (s) => ({ general: { ...s.general, efficiency: s.general.efficiency + 0.5 }, subjects: modifySub(s, ['chinese', 'english', 'math'], 0.5) })
    },
    {
        id: 'w_review', name: '高强度复习', icon: 'fa-pencil-alt', type: 'STUDY',
        description: '选科+1，但心态-3、效率-0.5。有代价的冲刺。',
        resultText: '你复习了一下午功课，感觉掌握得更扎实了，但脑子已经不想转了。',
        action: (s) => ({ subjects: modifySub(s, s.selectedSubjects.length > 0 ? s.selectedSubjects : ['math', 'physics'], 1), general: { ...s.general, mindset: s.general.mindset - 3, efficiency: s.general.efficiency - 0.5 } })
    },
    {
        id: 'w_mock_exam', name: '参加模拟考', icon: 'fa-file-alt', type: 'STUDY',
        description: '做一套模拟卷，检验学业水平。结果取决于实力。',
        resultText: (s) => {
            const avg = (s.subjects.math.level + s.subjects.chinese.level + s.subjects.english.level) / 3;
            if (avg > 80) return '题目太简单了！轻松拿下高分，信心倍增。';
            if (avg > 50) return '成绩不错，能排进前列。但还是有几个知识点不熟。';
            if (avg > 25) return '中规中矩，暴露了不少薄弱环节。回去好好复习。';
            return '惨不忍睹...你意识到和学霸的差距。知耻后勇！';
        },
        action: (s) => {
            const avg = (s.subjects.math.level + s.subjects.chinese.level + s.subjects.english.level) / 3;
            if (avg > 50) {
                return {
                    general: { ...s.general, mindset: s.general.mindset + 5, experience: s.general.experience + 3 },
                    subjects: modifySub(s, ['math', 'chinese', 'english'], 1)
                };
            }
            return {
                general: { ...s.general, mindset: s.general.mindset - 3, efficiency: s.general.efficiency + 2 },
                subjects: modifySub(s, ['math', 'chinese', 'english'], 0.5)
            };
        }
    },
    // === 休息类 REST ===
    {
        id: 'w_sleep', name: '补觉', icon: 'fa-bed', type: 'REST',
        description: '健康+5，心态+2。朴实无华的充电。',
        resultText: '这一觉睡得天昏地暗，醒来时已经是黄昏了。',
        action: (s) => ({ general: { ...s.general, health: s.general.health + 5, mindset: s.general.mindset + 2 }, sleepCount: (s.sleepCount || 0) + 1 })
    },
    {
        id: 'w_game', name: '打游戏', icon: 'fa-gamepad', type: 'REST',
        description: '心态+5，效率-0.5。适度放松。',
        resultText: '玩了几把游戏，放松了一下紧绷的神经。',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 5, efficiency: s.general.efficiency - 0.5 } })
    },
    {
        id: 'w_read', name: '看课外书', icon: 'fa-book-open', type: 'REST',
        description: '心态+3，经验+2。开卷有益。',
        resultText: '你沉浸在书中的世界，暂时忘却了烦恼。',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 3, experience: s.general.experience + 2 } })
    },
    {
        id: 'w_park', name: '去公园/爬山', icon: 'fa-tree', type: 'REST',
        description: '健康+3，心态+3。均衡的户外活动。',
        resultText: '呼吸着新鲜空气，你感觉身心舒畅。',
        action: (s) => ({ general: { ...s.general, health: s.general.health + 3, mindset: s.general.mindset + 3 } })
    },
    // === 社交类 SOCIAL ===
    {
        id: 'w_chat', name: '和朋友聊天', icon: 'fa-comments', type: 'SOCIAL',
        description: '心态+3，魅力+2。维护人际关系。',
        resultText: '和朋友聊了很多八卦，心情变好了。',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 3, romance: s.general.romance + 2 } })
    },
    {
        id: 'w_shop', name: '约朋友逛街', icon: 'fa-shopping-bag', type: 'SOCIAL',
        description: '心态+5，魅力+3，花费30元。效果强但有代价。',
        resultText: '你和朋友在西单逛了一下午，虽然钱包瘪了，但心情好多了。',
        action: (s) => ({ general: { ...s.general, mindset: s.general.mindset + 5, romance: s.general.romance + 3, money: s.general.money - 30 } })
    },
    {
        id: 'w_club_activity', name: '社团活动', icon: 'fa-users', type: 'SOCIAL',
        condition: (s) => !!s.club && s.week % 4 === 0,
        description: '参加社团月度活动，效果由社团决定。',
        resultText: '你参加了社团活动，大家玩得很开心。',
        action: (s) => {
             const club = CLUBS.find(c => c.id === s.club);
             return club ? club.action(s) : {};
        }
    },
    // === 恋爱专属 LOVE (仅在有伴侣时可见) ===
    {
        id: 'w_date_call', name: '煲电话粥', icon: 'fa-phone-alt', type: 'LOVE',
        condition: (s) => !!s.romancePartner,
        description: '魅力+3，心态+5。听听TA的声音。',
        resultText: (s) => `你和${s.romancePartner}聊了很久，感觉彼此的心更近了。`,
        action: (s) => ({ general: { ...s.general, romance: s.general.romance + 3, mindset: s.general.mindset + 5 } })
    },
    // === OI专属 (竞赛路线专用) ===
    {
        id: 'w_luogu', name: '刷洛谷', icon: 'fa-code', type: 'OI',
        condition: (s) => s.competition === 'OI',
        description: '基础OI能力各+0.2，经验+1。',
        resultText: '刷了几道题，感觉还可以。',
        action: (s) => ({ oiStats: modifyOI(s, { dp: 0.2, ds: 0.2, misc: 0.2 }), general: { ...s.general, experience: s.general.experience + 1 } })
    },
    {
        id: 'w_oi_wiki', name: '看 OI-Wiki', icon: 'fa-book-atlas', type: 'OI',
        condition: (s) => s.competition === 'OI',
        description: '全OI维度+0.2，经验+1。全面夯实基础。',
        resultText: '你学习了几个新的算法模板，但还需要练习。',
        action: (s) => ({ oiStats: modifyOI(s, { string: 0.2, graph: 0.2, math: 0.2, dp: 0.2, ds: 0.2 }), general: { ...s.general, experience: s.general.experience + 1 } })
    },
    {
        id: 'w_mock_oi', name: '参加模拟赛', icon: 'fa-trophy', type: 'OI',
        condition: (s) => s.competition === 'OI',
        description: '核心OI各+0.5，经验+2。检验实力。',
        resultText: (s) => {
            const total = s.oiStats.dp + s.oiStats.ds + s.oiStats.math + s.oiStats.string + s.oiStats.graph + s.oiStats.misc;
            if (total > 100) return '你碾压了全场，AK 了所有题目。同学们投来崇拜的目光。';
            if (total > 60) return '发挥稳定，做出了大部分题目。在机房属于中上水平。';
            if (total > 30) return '还行，做出来几道。但旁边大神已经在写第四题了...';
            return '题目好难...不过继续努力吧！';
        },
        action: (s) => ({
            oiStats: modifyOI(s, { dp: 0.5, ds: 0.5, math: 0.5, misc: 0.5 }),
            general: { ...s.general, experience: s.general.experience + 2 }
        })
    }
];
