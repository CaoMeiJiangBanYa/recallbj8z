
import { GameState, SubjectKey, OIStats, SerializableEffect, GameEvent, TalentPassiveEffects } from '../types';

export const modifySub = (s: GameState, keys: SubjectKey[], val: number) => {
  const newSubs = { ...s.subjects };
  keys.forEach(k => {
    newSubs[k] = { ...newSubs[k], level: Math.max(0, newSubs[k].level + val) };
  });
  return newSubs;
};

export const modifyOI = (s: GameState, changes: Partial<OIStats>) => {
    const newOI = { ...s.oiStats };
    (Object.keys(changes) as (keyof OIStats)[]).forEach(k => {
        newOI[k] = Math.max(0, newOI[k] + (changes[k] || 0));
    });
    return newOI;
};

export const getEffectiveEfficiency = (state: GameState): number => {
    let eff = state.general.efficiency;
    
    // Debt King Challenge: +1 Efficiency per 15 Debt
    if (state.activeChallengeId === 'c_debt_king' && state.general.money < 0) {
        const debt = Math.abs(state.general.money);
        eff += Math.floor(debt / 15);
    }
    
    return eff;
};

// --- Talent Passive Aggregation ---
export const getActiveTalentPassives = (state: GameState): TalentPassiveEffects => {
    const result: TalentPassiveEffects = {};
    for (const talent of state.talents) {
        const p = talent.passive;
        if (!p) continue;
        if (p.shopDiscount !== undefined) result.shopDiscount = (result.shopDiscount ?? 1) * p.shopDiscount;
        if (p.moneyGainMultiplier !== undefined) result.moneyGainMultiplier = (result.moneyGainMultiplier ?? 1) * p.moneyGainMultiplier;
        if (p.efficiencyChangeMod) result.efficiencyChangeMod = p.efficiencyChangeMod;
        if (p.healthCap !== undefined) result.healthCap = Math.min(result.healthCap ?? 999, p.healthCap);
        if (p.luckCap !== undefined) result.luckCap = Math.min(result.luckCap ?? 999, p.luckCap);
        if (p.noWeeklyMoney) result.noWeeklyMoney = true;
        if (p.romanceGainMultiplier !== undefined) result.romanceGainMultiplier = (result.romanceGainMultiplier ?? 1) * p.romanceGainMultiplier;
        if (p.healthRecoveryMultiplier !== undefined) result.healthRecoveryMultiplier = (result.healthRecoveryMultiplier ?? 1) * p.healthRecoveryMultiplier;
        if (p.examScoreMultiplier !== undefined) result.examScoreMultiplier = (result.examScoreMultiplier ?? 1) * p.examScoreMultiplier;
        if (p.romanceEventChanceMultiplier !== undefined) result.romanceEventChanceMultiplier = p.romanceEventChanceMultiplier;
        if (p.noDebtEvents) result.noDebtEvents = true;
        if (p.mindsetFloor !== undefined) result.mindsetFloor = Math.max(result.mindsetFloor ?? -999, p.mindsetFloor);
        if (p.luckFloor !== undefined) result.luckFloor = Math.max(result.luckFloor ?? -999, p.luckFloor);
        if (p.efficiencyCap !== undefined) result.efficiencyCap = Math.min(result.efficiencyCap ?? 999, p.efficiencyCap);
        if (p.shopPriceMultiplier !== undefined) result.shopPriceMultiplier = (result.shopPriceMultiplier ?? 1) * p.shopPriceMultiplier;
        if (p.experienceGainMultiplier !== undefined) result.experienceGainMultiplier = (result.experienceGainMultiplier ?? 1) * p.experienceGainMultiplier;
    }
    return result;
};

export const applyEfficiencyPassive = (state: GameState, delta: number): number => {
    const passives = getActiveTalentPassives(state);
    let adjusted = delta;
    if (passives.efficiencyChangeMod) {
        const { positiveMultiplier, negativeMultiplier } = passives.efficiencyChangeMod;
        if (delta > 0) adjusted = delta * positiveMultiplier;
        if (delta < 0) adjusted = delta * negativeMultiplier;
    }
    return adjusted;
};

export const applyEfficiencyCap = (state: GameState, value: number): number => {
    const passives = getActiveTalentPassives(state);
    if (passives.efficiencyCap !== undefined) {
        return Math.min(value, passives.efficiencyCap);
    }
    return Math.max(1, value);
};

export const applyMoneyPassive = (state: GameState, delta: number): number => {
    const passives = getActiveTalentPassives(state);
    if (delta > 0 && passives.moneyGainMultiplier) {
        return delta * passives.moneyGainMultiplier;
    }
    return delta;
};

export const applyRomancePassive = (state: GameState, delta: number): number => {
    const passives = getActiveTalentPassives(state);
    if (delta > 0 && passives.romanceGainMultiplier !== undefined) {
        return delta * passives.romanceGainMultiplier;
    }
    return delta;
};

export const applyHealthRecoveryPassive = (state: GameState, delta: number): number => {
    const passives = getActiveTalentPassives(state);
    if (delta > 0 && passives.healthRecoveryMultiplier !== undefined) {
        return delta * passives.healthRecoveryMultiplier;
    }
    return delta;
};

export const applyExperiencePassive = (state: GameState, delta: number): number => {
    const passives = getActiveTalentPassives(state);
    if (delta > 0 && passives.experienceGainMultiplier !== undefined) {
        return delta * passives.experienceGainMultiplier;
    }
    return delta;
};

export const applyStatCaps = (state: GameState, updates: { general?: Partial<GameState['general']> }): void => {
    const passives = getActiveTalentPassives(state);
    if (!updates.general) return;
    const g = updates.general;
    if (passives.healthCap !== undefined && g.health !== undefined) {
        g.health = Math.min(g.health, passives.healthCap);
    }
    if (passives.luckCap !== undefined && g.luck !== undefined) {
        g.luck = Math.min(g.luck, passives.luckCap);
    }
    if (passives.luckFloor !== undefined && g.luck !== undefined) {
        g.luck = Math.max(g.luck, passives.luckFloor);
    }
    if (passives.mindsetFloor !== undefined && g.mindset !== undefined) {
        g.mindset = Math.max(g.mindset, passives.mindsetFloor);
    }
    if (passives.efficiencyCap !== undefined && g.efficiency !== undefined) {
        g.efficiency = Math.min(g.efficiency, passives.efficiencyCap);
    }
};

export const getShopPriceMultiplier = (state: GameState): number => {
    const passives = getActiveTalentPassives(state);
    const discount = passives.shopDiscount ?? 1;
    const premium = passives.shopPriceMultiplier ?? 1;
    return discount * premium;
};

export const hasNoWeeklyMoney = (state: GameState): boolean => {
    const passives = getActiveTalentPassives(state);
    return passives.noWeeklyMoney === true;
};

export const hasNoDebtEvents = (state: GameState): boolean => {
    const passives = getActiveTalentPassives(state);
    return passives.noDebtEvents === true;
};

export const getRomanceEventMultiplier = (state: GameState): number => {
    const passives = getActiveTalentPassives(state);
    return passives.romanceEventChanceMultiplier ?? 1;
};

export const getExamScoreMultiplier = (state: GameState): number => {
    const passives = getActiveTalentPassives(state);
    return passives.examScoreMultiplier ?? 1;
};

// --- Helper for AI Event Effects ---
export const applyAiEffect = (s: GameState, effect: SerializableEffect): Partial<GameState> => {
    const updates: Partial<GameState> = {
        general: { ...s.general },
        subjects: { ...s.subjects },
        oiStats: { ...s.oiStats }
    };

    if (effect.mindset) updates.general!.mindset = Math.max(0, s.general.mindset + effect.mindset);
    if (effect.health) updates.general!.health = Math.max(0, s.general.health + effect.health);
    if (effect.money) {
        updates.general!.money = s.general.money + effect.money;
    }
    if (effect.efficiency) {
        updates.general!.efficiency = Math.max(1, s.general.efficiency + effect.efficiency);
    }
    if (effect.romance) updates.general!.romance = Math.max(0, s.general.romance + effect.romance);
    if (effect.experience) updates.general!.experience = Math.max(0, s.general.experience + effect.experience);
    if (effect.luck) updates.general!.luck = Math.max(0, s.general.luck + effect.luck);

    if (effect.subjects) {
        (Object.entries(effect.subjects) as [string, number][]).forEach(([key, val]) => {
            if (!(key in updates.subjects!)) return; // skip invalid subject keys from AI
            const subKey = key as SubjectKey;
            updates.subjects![subKey] = {
                ...updates.subjects![subKey],
                level: Math.max(0, updates.subjects![subKey].level + val)
            };
        });
    }

    if (effect.oiStats) {
        Object.entries(effect.oiStats).forEach(([key, val]) => {
            const oiKey = key as keyof OIStats;
            updates.oiStats![oiKey] = Math.max(0, updates.oiStats![oiKey] + (val as number));
        });
    }

    applyStatCaps(s, updates);

    return updates;
};

export const mapAiEventToGameEvent = (aiEvent: any): GameEvent => {
    return {
        id: `ai_${Date.now()}_${Math.random()}`,
        title: aiEvent.title,
        description: aiEvent.description,
        type: aiEvent.type || 'neutral',
        triggerType: 'RANDOM',
        choices: Array.isArray(aiEvent.choices) ? aiEvent.choices.map((c: any) => ({
            text: c.text,
            resultDescription: c.resultDescription,
            action: (s: GameState) => {
                const stateUpdates = applyAiEffect(s, c.effect || {});
                return {
                    ...stateUpdates,
                    log: [...s.log, { 
                        message: c.resultDescription || `AI 事件: 你选择了 "${c.text}"`, 
                        type: aiEvent.type === 'negative' ? 'warning' : 'success', 
                        timestamp: Date.now() 
                    }]
                };
            }
        })) : []
    };
};
