import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Image, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useTournamentStore } from '../store/tournamentStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'match', 'celebration', 'team', 'player'] as const;

export default function Gallery() {
  const { gallery, addPhoto, deletePhoto, isAdmin } = useTournamentStore();
  const [cat, setCat] = useState<typeof CATEGORIES[number]>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = cat === 'all' ? gallery : gallery.filter((g) => g.category === cat);
  const selectedItem = gallery.find((g) => g.id === selected);

  const handleUpload = () => {
    const urls = [
      'https://picsum.photos/seed/new1/400/300',
      'https://picsum.photos/seed/new2/400/300',
      'https://picsum.photos/seed/new3/400/300',
    ];
    const url = urls[Math.floor(Math.random() * urls.length)];
    addPhoto({
      photo: url,
      caption: 'New tournament moment',
      category: 'match',
      uploadedAt: new Date().toISOString(),
    });
    toast.success('📸 Photo uploaded!');
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-7 h-7 text-blue-600" />
            <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold">Gallery</h1>
          </div>
          <p className="text-gray-500 text-sm">{gallery.length} photos from Josh Tournament 2026</p>
        </div>
        {isAdmin && (
          <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold">
            <Upload className="w-4 h-4" /> Upload Photo
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              cat === c
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {c === 'all' ? `All (${gallery.length})` : c}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(item.id)}
            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden"
          >
            <img src={item.photo} alt={item.caption} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
              <div className="p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium">{item.caption}</p>
                <p className="text-white/60 text-[10px] mt-0.5 capitalize">{item.category}</p>
              </div>
            </div>
            {isAdmin && (
              <button onClick={(e) => { e.stopPropagation(); deletePhoto(item.id); toast.success('Photo deleted'); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-40" />
          <p className="text-gray-500">No photos in this category</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
            >
              <img src={selectedItem.photo} alt={selectedItem.caption} className="w-full" />
              <div className="absolute bottom-0 inset-x-0 p-4" style={{ background: 'linear-gradient(transparent,rgba(0,0,0,0.8))' }}>
                <p className="text-white font-medium">{selectedItem.caption}</p>
                <p className="text-white/60 text-sm capitalize mt-0.5">
                  {selectedItem.category} · {new Date(selectedItem.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
