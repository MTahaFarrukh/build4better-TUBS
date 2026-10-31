import { ArrowLeft, Share2 } from 'lucide-react'
import GuideHighlight from './GuideHighlight'

export default function PhotoPreview({ photo, onBack, onShare, isHighlighted }) {
  if (!photo) return null

  return (
    <div className="flex h-full flex-col bg-forest">
      <div className="flex items-center gap-3 px-4 py-3 text-ivory">
        <button
          type="button"
          onClick={onBack}
          className="touch-target inline-flex items-center justify-center rounded-xl"
          aria-label="Go back to gallery"
        >
          <ArrowLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">Photo</h2>
          <p className="truncate text-xs text-ivory/75">{photo.caption}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="min-h-0 flex-1 overflow-hidden rounded-3xl bg-ivory shadow-soft">
          <img
            src={photo.src}
            alt={photo.caption}
            className="h-full w-full object-contain"
          />
        </div>

        <p className="mt-3 text-center text-sm text-ivory/85" lang="ur" dir="auto">
          {photo.captionUr}
        </p>

        <div className="mt-4">
          <GuideHighlight active={isHighlighted('share-button')} className="rounded-2xl">
            <button
              type="button"
              onClick={onShare}
              className="touch-target flex w-full items-center justify-center gap-2 rounded-2xl bg-teal px-5 py-4 text-base font-semibold text-ivory shadow-soft"
              aria-label="Share this practice photo"
            >
              <Share2 className="h-5 w-5" aria-hidden="true" />
              Share
            </button>
          </GuideHighlight>
        </div>
      </div>
    </div>
  )
}
