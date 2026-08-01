import React from 'react';
import { NotificationRecord } from '../types';
import { Bell, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationRecord[];
  onMarkAllRead: () => void;
}

export default function NotificationsView({ notifications, onMarkAllRead }: NotificationsViewProps) {
  return (
    <div id="notifications-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d]">Clinical Notifications & Alerts</h2>
          <p className="text-[#434652] text-sm mt-1">Real-time alerts for missed doses, low stock warnings, and device sync events.</p>
        </div>

        {notifications.some(n => !n.read) && (
          <button 
            onClick={onMarkAllRead}
            className="px-4 py-2 border border-[#c3c6d5] bg-white rounded-lg text-xs font-bold text-[#003482] hover:bg-[#eff4ff] cursor-pointer"
          >
            Mark All Read
          </button>
        )}
      </header>

      {/* Notifications List */}
      <div className="bg-white border border-[#c3c6d5] rounded-xl shadow-sm divide-y divide-[#c3c6d5] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#737784]">
            No clinical notifications logged.
          </div>
        ) : (
          notifications.map((notif) => {
            const isMissed = notif.type === 'missed_dose';
            const isStock = notif.type === 'low_stock';
            return (
              <div 
                key={notif.id}
                className={`p-5 flex items-start gap-4 transition-all ${
                  !notif.read ? 'bg-[#f8f9ff]' : 'bg-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isMissed 
                    ? 'bg-red-100 text-[#ba1a1a]' 
                    : isStock 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-[#e6eeff] text-[#003482]'
                }`}>
                  {isMissed ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : isStock ? (
                    <Info className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f1c2d]">
                      {notif.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#737784] font-mono">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#434652] leading-relaxed">{notif.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
