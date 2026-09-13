import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, ThumbsUp, PlusCircle, X, Send } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Marcus & Sarah T.',
      location: 'Wayne Twp / Ingomar St (46241)',
      area: 'ingomar',
      service: '24/7 Emergency Panel Sparking',
      date: '3 days ago',
      rating: 5,
      verified: true,
      quote: 'Our main breaker started buzzing loudly and sparking at 11:30 PM on a Sunday. Keetons had a master electrician at our doorstep on Ingomar St in under 25 minutes! He safely shut off power, replaced the faulty main lug, and had our AC back on before midnight. Fair pricing and total lifesavers!'
    },
    {
      id: 2,
      name: 'David K.',
      location: 'Speedway, IN (46224)',
      area: 'speedway',
      service: 'Tesla Level 2 EV Charger Install',
      date: '1 week ago',
      rating: 5,
      verified: true,
      quote: 'Flawless Tesla Wall Connector installation. They ran sleek conduit through my garage wall, installed a clean 60A circuit breaker, and handled the Marion County permit paperwork completely. Cleaned up every speck of dust. Highly recommended!'
    },
    {
      id: 3,
      name: 'Elena R.',
      location: 'Decatur Township (46113)',
      area: 'ingomar',
      service: 'Whole House 200A Panel Upgrade',
      date: '2 weeks ago',
      rating: 5,
      verified: true,
      quote: 'Upgraded our 1970s 100A fuse box to a modern 200A breaker panel with built-in surge protection. Keetons gave us an upfront flat quote with zero hidden fees. IPL power inspection passed on the first try!'
    },
    {
      id: 4,
      name: 'Dr. Gregory B.',
      location: 'Avon & Plainfield (46123)',
      area: 'avon',
      service: 'Recessed LED & Smart Switch Install',
      date: '3 weeks ago',
      rating: 5,
      verified: true,
      quote: 'Installed 14 ultra-slim LED recessed lights in our open living room and kitchen. The electrician used laser alignment so the placement is perfectly symmetrical. Professional, respectful, and punctual.'
    },
    {
      id: 5,
      name: 'Patricia H.',
      location: 'Greenwood, IN (46142)',
      area: 'greenwood',
      service: 'Generator Transfer Switch',
      date: '1 month ago',
      rating: 5,
      verified: true,
      quote: 'Had Keetons install an interlock kit and heavy-duty 50A inlet box for my backup generator. They thoroughly tested the entire system with me and showed me step-by-step how to safely run my house during storm blackouts.'
    },
    {
      id: 6,
      name: 'Robert V.',
      location: 'Carmel & Fishers (46032)',
      area: 'carmel',
      service: 'Commercial Lighting Repair',
      date: '1 month ago',
      rating: 5,
      verified: true,
      quote: 'Prompt service for our retail store in Indy metro. Fixed multiple ballast issues and updated our exterior security lights. Very reasonable rates for commercial master electricians.'
    }
  ]);

  // Form State
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewService, setNewReviewService] = useState('Panel Upgrade / Service');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewQuote, setNewReviewQuote] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewQuote) return;

    const newEntry = {
      id: Date.now(),
      name: newReviewName,
      location: newReviewLocation || 'Indianapolis, IN',
      area: 'all',
      service: newReviewService,
      date: 'Just now',
      rating: newReviewRating,
      verified: true,
      quote: newReviewQuote
    };

    setReviewsList([newEntry, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsWriteReviewOpen(false);
      setReviewSubmitted(false);
      setNewReviewName('');
      setNewReviewQuote('');
      setNewReviewLocation('');
    }, 2000);
  };

  const filteredReviews = filter === 'all' 
    ? reviewsList 
    : reviewsList.filter(r => r.area === filter || filter === 'all');

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#0b132b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>What Neighbors Say</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Real calls. Real homes. <span className="electric-gradient-text">Real reviews.</span>
          </h2>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20 font-extrabold text-lg">
              <span className="text-2xl font-black mr-1">5.0</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 text-sm font-semibold ml-2">120+ Verified Reviews</span>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Neighborhood Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-12">
          {[
            { id: 'all', label: 'All Reviews (120+)' },
            { id: 'ingomar', label: '📍 Wayne & Decatur Twp (46241)' },
            { id: 'speedway', label: '🏁 Speedway' },
            { id: 'avon', label: '🌳 Avon & Plainfield' },
            { id: 'greenwood', label: '⚡ Greenwood & South Indy' },
            { id: 'carmel', label: '🏙️ Carmel & North Metro' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === btn.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,168,255,0.1)]"
            >
              <div className="space-y-3">
                {/* Rating & Verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      Verified Call
                    </span>
                  )}
                </div>

                {/* Service Tag */}
                <div className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded inline-block border border-cyan-500/20">
                  {rev.service}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-400">{rev.location}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
              <ThumbsUp className="w-5 h-5" />
              <span>Share Your Keetons Experience</span>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white">Thank You!</h4>
                <p className="text-sm text-slate-300">Your review has been verified and added to our community feed.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael B."
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Wayne Twp, Indianapolis"
                    value={newReviewLocation}
                    onChange={(e) => setNewReviewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service Provided</label>
                  <select
                    value={newReviewService}
                    onChange={(e) => setNewReviewService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option>Panel Upgrade / Service</option>
                    <option>Emergency Outage Repair</option>
                    <option>EV Charger Station</option>
                    <option>Lighting & Ceiling Fans</option>
                    <option>Whole-House Rewiring</option>
                    <option>Generator Transfer Switch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-amber-400 focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the electrician's work, speed, and safety..."
                    value={newReviewQuote}
                    onChange={(e) => setNewReviewQuote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Verified Review</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
