import { useState, useRef, useCallback } from 'react';
import { useTrips } from '../context/TripContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Camera, Upload, X, Download, Trash2, ChevronLeft, ChevronRight,
  ZoomIn, AlertCircle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Compress + resize image to base64 (max 1200px wide, quality 0.82)
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Photos() {
  const { activeTrip, currentUser, addPhoto, deletePhoto } = useTrips();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index into photos array
  const [pendingFiles, setPendingFiles] = useState([]); // { file, preview, caption }
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef();

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Trip Photos</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Camera className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Select a trip to view and add photos.</p>
          </div>
        </div>
      </>
    );
  }

  const photos = activeTrip.photos || [];

  // Pick files → show caption modal
  async function handleFiles(files) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    const previews = await Promise.all(
      imageFiles.map(async f => ({ file: f, preview: await compressImage(f), caption: '' }))
    );
    setPendingFiles(previews);
    setShowCaptionModal(true);
  }

  // Commit uploads — uses Supabase Storage when configured, else stores base64
  async function commitUpload() {
    setUploading(true);
    setShowCaptionModal(false);
    setUploadError(null);
    let successCount = 0;
    let lastError = null;

    try {
      for (const pf of pendingFiles) {
        let url = null;
        let storagePath = null;

        if (isSupabaseConfigured && supabase) {
          // Upload to Supabase Storage — never fall back to base64 in DB mode
          // (base64 in the trip JSON would exceed Supabase row/request limits)
          try {
            const res = await fetch(pf.preview);
            const blob = await res.blob();
            const path = `${activeTrip.id}/${Date.now()}-${pf.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const { data: uploadData, error } = await supabase.storage
              .from('trip-photos')
              .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

            if (error) {
              console.error('Supabase storage upload error:', error);
              lastError = error.message || 'Storage upload failed';
              // Common causes: bucket doesn't exist, RLS policy, size limit
              if (error.message?.includes('Bucket not found') || error.statusCode === 404) {
                lastError = 'Photo storage bucket not found. Please create a "trip-photos" bucket in Supabase Storage (Settings → Storage → New bucket) and enable public access.';
              } else if (error.statusCode === 403 || error.message?.includes('security') || error.message?.includes('policy')) {
                lastError = 'Permission denied. Check that the "trip-photos" bucket has INSERT policies for authenticated users.';
              } else if (error.statusCode === 413 || error.message?.includes('too large')) {
                lastError = 'Image too large for storage. Try a smaller photo.';
              }
              continue; // skip this file, try next
            }

            const { data: { publicUrl } } = supabase.storage
              .from('trip-photos')
              .getPublicUrl(uploadData.path);
            url = publicUrl;
            storagePath = uploadData.path;
          } catch (storageErr) {
            console.error('Storage exception:', storageErr);
            lastError = storageErr.message || 'Failed to connect to storage';
            continue;
          }
        } else {
          // Demo/local mode — safe to use base64 since it only goes to localStorage
          url = pf.preview;
        }

        if (url) {
          addPhoto(activeTrip.id, {
            url,
            storagePath,
            caption: pf.caption.trim(),
            uploadedBy: currentUser.id,
            uploaderName: currentUser.name,
            uploaderColor: currentUser.color,
            date: new Date().toISOString(),
            filename: pf.file.name,
          });
          successCount++;
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err?.name === 'QuotaExceededError') {
        lastError = 'Browser storage is full. Delete some photos before uploading more.';
      } else {
        lastError = err.message || 'Upload failed unexpectedly';
      }
    } finally {
      setPendingFiles([]);
      setUploading(false);
      if (lastError && successCount < pendingFiles.length) {
        setUploadError(
          successCount > 0
            ? `${successCount} photo(s) uploaded, but some failed: ${lastError}`
            : lastError
        );
      }
    }
  }

  // Drag-and-drop handlers
  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = e => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  // Lightbox navigation
  function lightboxNav(dir) {
    setLightbox(i => {
      const next = i + dir;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  }

  // Download photo
  function downloadPhoto(photo) {
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = photo.filename || `photo-${photo.id}.jpg`;
    a.click();
  }

  // Group photos by uploader
  const grouped = photos.reduce((acc, p, idx) => {
    const key = p.uploaderName || 'Unknown';
    if (!acc[key]) acc[key] = { color: p.uploaderColor, photos: [] };
    acc[key].photos.push({ ...p, _idx: idx });
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .photo-thumb {
          position: relative; overflow: hidden; border-radius: 10px;
          cursor: pointer; background: var(--bg-tertiary);
          aspect-ratio: 1;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .photo-thumb:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .photo-thumb .overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.2s;
          display: flex; align-items: flex-end; padding: 8px;
        }
        .photo-thumb:hover .overlay { opacity: 1; }
        .lightbox-bg {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(6px);
          display: flex; align-items: center; justifyContent: center;
        }
        .drop-zone {
          border: 2px dashed var(--border);
          border-radius: 16px; padding: 40px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 12;
          cursor: pointer; transition: border-color 0.15s, background 0.15s;
          background: var(--bg-secondary);
        }
        .drop-zone.dragging {
          border-color: var(--brand); background: var(--brand-light);
        }
        .drop-zone:hover { border-color: var(--brand); }
      `}</style>

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Trip Photos</h1>
          <p>{activeTrip.name} — {photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Uploading…</>
            : <><Upload size={15} /> Add Photos</>
          }
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      <div className="page-body">
        {/* Upload error banner */}
        {uploadError && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 16px', marginBottom: 16,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}>
            <AlertCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>Upload failed</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{uploadError}</p>
            </div>
            <button
              onClick={() => setUploadError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-tertiary)', flexShrink: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {photos.length === 0 ? (
          /* Empty drop zone */
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-light), var(--purple-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Camera size={28} style={{ color: 'var(--brand)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Drop photos here</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 320 }}>
              Upload photos from your trip. They'll be stored in the app and visible to all members.
            </p>
            <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
              <Upload size={14} /> Choose Photos
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              {isSupabaseConfigured
                ? 'Photos are uploaded to Supabase Storage and shared across all devices.'
                : 'Photos are resized to 1200px and stored locally in your browser.'}
            </p>
          </div>
        ) : (
          <>
            {/* Drop zone strip */}
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              style={{ padding: '16px 24px', flexDirection: 'row', gap: 12, marginBottom: 24 }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} style={{ color: 'var(--brand)', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {dragging ? 'Drop to upload…' : 'Drag photos here or click to add more'}
              </p>
            </div>

            {/* Grouped by member */}
            {Object.entries(grouped).map(([name, group]) => (
              <div key={name} style={{ marginBottom: 28, animation: 'fadeUp 0.25s ease' }}>
                {/* Member header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: group.color || 'var(--brand)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0,
                  }}>
                    {name[0]}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 8 }}>
                      {group.photos.length} photo{group.photos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Photo grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {group.photos.map(photo => (
                    <div
                      key={photo.id}
                      className="photo-thumb"
                      onClick={() => setLightbox(photo._idx)}
                    >
                      <img src={photo.url} alt={photo.caption || photo.filename} loading="lazy" />
                      <div className="overlay">
                        <div style={{ flex: 1 }}>
                          {photo.caption && (
                            <p style={{ fontSize: 11, color: 'white', fontWeight: 500, lineHeight: 1.3 }}>
                              {photo.caption}
                            </p>
                          )}
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                            {format(parseISO(photo.date), 'MMM d')}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={e => { e.stopPropagation(); downloadPhoto(photo); }}
                            title="Download"
                            style={{
                              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6,
                              padding: '4px 6px', cursor: 'pointer', color: 'white',
                              display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Download size={12} />
                          </button>
                          <ZoomIn size={14} style={{ color: 'rgba(255,255,255,0.8)', alignSelf: 'center' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Caption modal for pending uploads */}
      {showCaptionModal && pendingFiles.length > 0 && (
        <div className="modal-overlay" onClick={() => { setShowCaptionModal(false); setPendingFiles([]); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={18} style={{ color: 'var(--brand)' }} />
                Add {pendingFiles.length} Photo{pendingFiles.length !== 1 ? 's' : ''}
              </h2>
              <button className="btn-ghost" onClick={() => { setShowCaptionModal(false); setPendingFiles([]); }} style={{ padding: 4 }}>
                <span style={{ fontSize: 18 }}>&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pendingFiles.map((pf, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <img
                    src={pf.preview}
                    alt=""
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border-light)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, fontWeight: 500 }}>
                      {pf.file.name}
                    </p>
                    <input
                      className="form-input"
                      placeholder="Add a caption… (optional)"
                      value={pf.caption}
                      onChange={e => setPendingFiles(prev => prev.map((p, j) => j === i ? { ...p, caption: e.target.value } : p))}
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <button
                    onClick={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4, flexShrink: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowCaptionModal(false); setPendingFiles([]); }}>Cancel</button>
              <button className="btn btn-primary" onClick={commitUpload} disabled={pendingFiles.length === 0}>
                <Upload size={14} /> Upload {pendingFiles.length} Photo{pendingFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (() => {
        const photo = photos[lightbox];
        const uploader = activeTrip.members?.find(m => m.id === photo.uploadedBy);
        return (
          <div className="lightbox-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
            {/* Prev */}
            {photos.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); lightboxNav(-1); }}
                style={{
                  position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Image */}
            <div
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '88vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: 0 }}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                style={{
                  maxWidth: '88vw', maxHeight: '75vh',
                  objectFit: 'contain', borderRadius: '12px 12px 0 0',
                  display: 'block',
                }}
              />
              {/* Info bar */}
              <div style={{
                background: 'rgba(15,23,42,0.95)', borderRadius: '0 0 12px 12px',
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: uploader?.color || photo.uploaderColor || '#666',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                  {(photo.uploaderName || 'U')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
                    {photo.caption || photo.filename}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                    {photo.uploaderName} · {format(parseISO(photo.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  {lightbox + 1} / {photos.length}
                </span>
                <button
                  onClick={() => downloadPhoto(photo)}
                  title="Download"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                >
                  <Download size={15} />
                </button>
                {photo.uploadedBy === currentUser.id && (
                  <button
                    onClick={() => {
                      // Delete from Supabase Storage if applicable
                      if (isSupabaseConfigured && photo.storagePath) {
                        supabase.storage.from('trip-photos').remove([photo.storagePath]);
                      }
                      deletePhoto(activeTrip.id, photo.id);
                      setLightbox(l => photos.length > 1 ? (l > 0 ? l - 1 : 0) : null);
                    }}
                    title="Delete"
                    style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Next */}
            {photos.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); lightboxNav(1); }}
                style={{
                  position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                }}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        );
      })()}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
