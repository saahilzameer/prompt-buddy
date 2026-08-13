import React from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Edit2, 
  Trash2, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminEvents() {
  const events = [
    { title: 'Networking Meetup', date: '12 Aug, 2026', location: 'Hyderabad, TS', registered: 124, status: 'Upcoming', image: 'bg-blue-600/20' },
    { title: 'Founder Connect', date: '20 Aug, 2026', location: 'Bangalore, KA', registered: 85, status: 'Draft', image: 'bg-indigo-600/20' },
    { title: 'AI Workshop', date: '05 Sep, 2026', location: 'Virtual', registered: 210, status: 'Upcoming', image: 'bg-sky-600/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Platform Events</h2>
          <p className="text-white/40 mt-1 uppercase text-[10px] font-bold tracking-widest italic">Curating offline & virtual experiences</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
          <Plus className="w-5 h-5" /> Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, i) => (
          <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[48px] group hover:border-blue-500/20 transition-all relative overflow-hidden">
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
              event.status === 'Draft' ? 'bg-white/5 text-white/40' : 'bg-green-500/10 text-green-400'
            }`}>
              {event.status}
            </div>

            <div className={`w-full aspect-video ${event.image} rounded-3xl mb-8 flex items-center justify-center group-hover:scale-[1.02] transition-transform`}>
              <Calendar className="w-12 h-12 text-white/10" />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-white/40 font-medium">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {event.date}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="text-lg font-bold text-white">{event.registered}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Registered</div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-blue-600 flex items-center justify-center text-[10px] font-bold">U</div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-3 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
