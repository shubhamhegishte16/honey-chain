import React, { useState } from 'react';
import { Bell, CheckCheck, Inbox, Activity } from 'lucide-react';

export default function ProcessorNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'request', title: 'New Processing Request', text: 'Apiary Valley has requested processing for 150 kg Grade A Mustard Honey.', time: '2 hours ago', read: false },
    { id: 2, type: 'stage', title: 'Stage Completed', text: 'Micro-filtration stage for Batch HNY-MH-001 completed.', time: '5 hours ago', read: false },
    { id: 3, type: 'system', title: 'Weekly Report', text: 'Your weekly honey processing & bottling report is ready.', time: '1 day ago', read: true }
  ]);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
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

      {notifications.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primaryLight text-primary mb-3"><Bell size={28} /></span>
          <h3 className="font-bold text-base text-textPrimary">No notifications</h3>
          <p className="text-xs text-textSecondary mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => { if (!n.read) markRead(n.id); }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex gap-4 ${n.read ? 'bg-surface border-border opacity-75' : 'bg-primaryLight/20 border-primary/30 cursor-pointer shadow-sm hover:bg-primaryLight/30'}`}
            >
              <div className="mt-1">
                {n.type === 'request' ? <Inbox size={20} className="text-amber-500" /> : <Activity size={20} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${n.read ? 'font-medium text-textPrimary' : 'font-bold text-textPrimary'}`}>{n.title}</h4>
                  <span className="text-[10px] text-textMuted shrink-0 ml-2">{n.time}</span>
                </div>
                <p className={`text-xs ${n.read ? 'text-textSecondary' : 'text-textPrimary font-medium'}`}>{n.text}</p>
              </div>
              {!n.read && <div className="self-center w-2 h-2 rounded-full bg-primary shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
