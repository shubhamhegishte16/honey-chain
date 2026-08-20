import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Package, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../services/api';

export default function BuyerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await apiRequest('/notifications', { method: 'GET' });
      if (!res.error) setNotifications(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const markRead = async (id) => {
    await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await apiRequest('/notifications/read-all', { method: 'PATCH' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div>
          <p className="eyebrow text-primary"><Bell size={13} /> Updates</p>
          <h1 className="text-2xl font-extrabold text-textPrimary">Notifications</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primaryDark transition-colors">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : notifications.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3"><Bell size={28} /></span>
          <h3 className="font-bold text-base text-textPrimary">No notifications</h3>
          <p className="text-xs text-textSecondary mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const id = n.id || n._id;
            return (
              <div
                key={id}
                onClick={() => { if (!n.read) markRead(id); }}
                className={`p-4 rounded-2xl border shadow-sm transition-all cursor-pointer ${
                  n.read ? 'bg-surface border-border' : 'bg-primaryLight/20 border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${n.read ? 'bg-background text-textMuted' : 'bg-primary text-white'}`}>
                    {n.type === 'order' ? <Package size={16} /> : <Bell size={16} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${n.read ? 'text-textSecondary' : 'text-textPrimary'}`}>{n.title || n.message}</p>
                    {n.message && n.title && <p className="text-xs text-textSecondary mt-0.5">{n.message}</p>}
                    <p className="text-[10px] text-textMuted mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
