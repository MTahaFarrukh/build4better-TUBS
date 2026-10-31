import { ArrowLeft } from 'lucide-react'
import { PRACTICE_PHOTOS } from '../../data/gallery'
import GuideHighlight from './GuideHighlight'

export default function GalleryGrid({ onSelectPhoto, onBack, isHighlighted }) {
  const highlight = isHighlighted('photo-grid')

  return (
    <div className="flex h-full flex-col bg-ivory">
      <div className="flex items-center gap-3 border-b border-forest/10 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="touch-target inline-flex items-center justify-center rounded-xl text-forest"
          aria-label="Go back to home screen"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-forest">Gallery</h2>
          <p className="text-xs text-forest-muted">Practice photos only</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <GuideHighlight active={highlight} className="rounded-3xl p-1">
          <div className="grid grid-cols-2 gap-3">
            {PRACTICE_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onSelectPhoto(photo.id)}
                className="group overflow-hidden rounded-2xl bg-sage text-left shadow-soft transition-transform focus-visible:outline-offset-4 active:scale-[0.99]"
                aria-label={`Open photo: ${photo.caption}`}
              >
                <img
                  src={photo.src}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="px-3 py-2.5">
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-forest">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </GuideHighlight>
      </div>
    </div>
  )
}
