// src/components/ProjectLightbox.tsx
//
// Full-screen overlay for browsing one project's photos at full size, with
// the project's details (title, developer, type, size, year) shown
// alongside. Opened by clicking a project card on the contractor profile
// page — see that page's `openProject` state.
//
// Keyboard: Escape closes, ←/→ navigate between photos. Click the
// backdrop (outside the image/panel) to close, same as most lightboxes.

'use client';

import { useEffect, useState } from 'react';

type ProjectLightboxProps = {
  project: {
    title: string;
    developerName: string | null;
    projectType: string | null;
    completedYear: number | null;
    squareFeet: number | null;
    elevationFloors: number | null;
    committedDurationMonths: number | null;
    actualDurationMonths: number | null;
    imageUrls: string[];
  };
  onClose: () => void;
};

export default function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = project.imageUrls.length > 1;

  function goTo(newIndex: number) {
    setIndex((newIndex + project.imageUrls.length) % project.imageUrls.length);
  }

  // Keyboard navigation — Escape to close, arrow keys to browse. Attached
  // for the lifetime of the lightbox only, cleaned up on close/unmount so
  // it doesn't leak a listener onto the rest of the page.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, onClose]);

  // Lock background scroll while the lightbox is open, restore on close.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} photos`}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg flex items-center justify-center transition-colors"
      >
        ×
      </button>

      {/* Image area — stopPropagation so clicking the photo itself doesn't close the lightbox, only the backdrop does */}
      <div
        className="flex-1 flex items-center justify-center relative px-4 md:px-16 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {project.imageUrls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Blob URL, full-size lightbox view
          <img
            src={project.imageUrls[index]}
            alt={`${project.title} photo ${index + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-full max-w-md h-64 bg-gradient-to-br from-[#4A4E55] to-[#2A2D32] rounded-md" />
        )}

        {hasMultiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              aria-label="Previous photo"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              aria-label="Next photo"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Details + dot navigation, stopPropagation for the same reason as the image area */}
      <div
        className="bg-black/40 px-6 py-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <div className="flex justify-center gap-1.5 mb-3">
            {project.imageUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <h2 className="font-display font-semibold text-white text-lg">{project.title}</h2>
        {(project.developerName || project.projectType) && (
          <p className="text-white/60 text-sm mt-0.5">
            {[project.developerName && `Developer: ${project.developerName}`, project.projectType]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <div className="flex justify-center gap-4 mt-2 text-sm">
          {project.squareFeet && (
            <span className="font-mono font-semibold text-amber">
              {project.squareFeet.toLocaleString('en-IN')} sq ft
            </span>
          )}
          {project.elevationFloors && (
            <span className="text-white/50">G+{project.elevationFloors}</span>
          )}
          {project.completedYear && <span className="text-white/50">{project.completedYear}</span>}
        </div>
        {hasMultiple && (
          <p className="text-white/40 text-xs mt-2 font-mono">
            {index + 1} / {project.imageUrls.length}
          </p>
        )}
      </div>
    </div>
  );
}
