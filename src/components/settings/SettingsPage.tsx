import { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getStoredApiKey, setStoredApiKey } from '../../lib/storage';
import Button from '../common/Button';

export default function SettingsPage() {
  const { dispatch } = useAppContext();
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    alert('已保存');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary-300">设置</h2>
        <button
          className="text-sm text-primary-400 hover:text-primary-300"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          返回
        </button>
      </div>

      <div>
        <label className="text-sm text-primary-300 block mb-2">DeepSeek API Key</label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-white/30 mt-1">留空则使用默认内置 Key</p>
      </div>

      <Button onClick={handleSave} className="w-full">
        保存
      </Button>
    </div>
  );
}
