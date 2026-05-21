import React, { useState } from 'react';
import { ApiSettings } from '../types';
import { getApiSettings, saveApiSettings } from '../lib/gemini';

const DEFAULT_API_URL = "https://api.chatanywhere.tech/v1/chat/completions";
const DEEPSEEK_OFFICIAL_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "DeepSeek-v4-flash";

interface Props {
  onClose: () => void;
}

const ApiSettingsModal: React.FC<Props> = ({ onClose }) => {
  const [settings, setSettings] = useState<ApiSettings>(getApiSettings);
  const [saved, setSaved] = useState(false);

  const hasCustomApi = !!settings.apiKey.trim();

  const handleSave = () => {
    saveApiSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const empty: ApiSettings = { apiUrl: '', apiKey: '', modelName: '', customPrompt: '' };
    setSettings(empty);
    saveApiSettings(empty);
  };

  const update = (key: keyof ApiSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              <i className="fas fa-robot text-indigo-500 mr-2"></i>AI 叙事设置
            </h2>
            <p className="text-xs text-slate-400 mt-1">配置自定义 API 以使用 AI_STORY 模式</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="overflow-y-auto custom-scroll space-y-5 pr-2 flex-1">
          {/* API URL */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              <i className="fas fa-link mr-1"></i>API 地址
            </label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, apiUrl: DEEPSEEK_OFFICIAL_URL, apiKey: prev.apiKey === 'sk-8aRKD47anCMcruCDOkbvYEAz6GyjNlqG761QVs0YKkX5OCag' ? '' : prev.apiKey }))}
                className="text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-200"
              >
                <i className="fas fa-check-circle mr-1"></i>DeepSeek 官方
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, apiUrl: DEFAULT_API_URL, apiKey: 'sk-8aRKD47anCMcruCDOkbvYEAz6GyjNlqG761QVs0YKkX5OCag', modelName: 'deepseek-chat' }))}
                className="text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-200"
              >
                <i className="fas fa-check-circle mr-1"></i>ChatAnywhere 代理
              </button>
            </div>
            <input
              type="text"
              value={settings.apiUrl}
              onChange={e => update('apiUrl', e.target.value)}
              placeholder={DEEPSEEK_OFFICIAL_URL}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              用自己的 Key → 选 DeepSeek 官方。用默认 Key → 选 ChatAnywhere 代理。
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              <i className="fas fa-key mr-1"></i>API Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={e => update('apiKey', e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              使用自己的 DeepSeek API Key 以获得更稳定的体验。
            </p>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              <i className="fas fa-microchip mr-1"></i>模型名称
            </label>
            <input
              type="text"
              value={settings.modelName}
              onChange={e => update('modelName', e.target.value)}
              placeholder={DEFAULT_MODEL}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">留空使用默认模型。可用: deepseek-chat, deepseek-reasoner, DeepSeek-v4-flash 等</p>
          </div>

          {/* Custom Prompt Toggle + Editor */}
          <div className={`p-4 rounded-2xl border transition-all ${hasCustomApi ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                <i className="fas fa-edit mr-1"></i>自定义提示词
              </label>
              {!hasCustomApi && (
                <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  <i className="fas fa-lock mr-1"></i>需先配置 API Key
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
              你可以自定义 AI 生成事件的提示词。支持变量插槽：
              <code className="bg-slate-200 px-1 rounded text-[10px]">{'{{phase}} {{week}} {{talents}} {{mindset}} {{health}} {{money}} {{efficiency}} {{romance}} {{luck}} {{experience}} {{competition}} {{partner}} {{subjects}} {{statuses}} {{history}} {{recentTitles}}'}</code>
            </p>
            <textarea
              value={settings.customPrompt}
              onChange={e => update('customPrompt', e.target.value)}
              disabled={!hasCustomApi}
              placeholder={hasCustomApi ? "在此输入自定义提示词...\n\n留空则使用默认提示词。\n\n可用的变量占位符：\n{{phase}} - 当前阶段\n{{week}} - 当前周数\n{{talents}} - 天赋列表\n{{mindset}} - 心态值\n..." : "请先在上方填写 API Key"}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          {/* Info */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 leading-relaxed space-y-2">
            <p><i className="fas fa-info-circle mr-1"></i>
            <strong>注意：</strong>自定义提示词功能仅在配置了自己的 API Key 后可用。这是为了防止滥用默认 API。</p>
            <p><i className="fas fa-exclamation-triangle mr-1"></i>
            <strong>CORS 提醒：</strong>浏览器可能拦截对 API 的直接请求。如果请求失败，可以尝试使用代理地址（如默认的 chatanywhere）或浏览器插件关闭 CORS。</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={handleReset} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <i className="fas fa-undo"></i> 恢复默认
          </button>
          <button onClick={handleSave} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}>
            {saved ? <><i className="fas fa-check"></i> 已保存</> : <><i className="fas fa-save"></i> 保存设置</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiSettingsModal;
