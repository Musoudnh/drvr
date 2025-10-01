import { useState } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../UI/Button';

interface SaveForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => Promise<void>;
}

export function SaveForecastModal({ isOpen, onClose, onSave }: SaveForecastModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave(name, description);
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error saving forecast:', error);
      alert('Failed to save forecast. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Save className="w-6 h-6 text-[#3AB7BF]" />
            <h2 className="text-2xl font-semibold text-gray-900">Save Forecast</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="forecast-name" className="block text-sm font-medium text-gray-700 mb-2">
              Version Name <span className="text-red-500">*</span>
            </label>
            <input
              id="forecast-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Q1 2024 Forecast - Conservative"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="forecast-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="forecast-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add notes about this forecast version, key assumptions, or changes made..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent resize-none"
              disabled={saving}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={saving || !name.trim()}
            >
              {saving ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Forecast
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
