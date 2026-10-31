import StatusBar from './StatusBar'

export default function PhoneFrame({ children, footer }) {
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="overflow-hidden rounded-[2.4rem] border-[10px] border-forest bg-[#F4F1EA] shadow-lift">
        <div className="relative flex h-[min(680px,78vh)] min-h-[560px] flex-col">
          <StatusBar />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
          {footer}
          <div className="flex justify-center py-2" aria-hidden="true">
            <div className="h-1.5 w-28 rounded-full bg-forest/30" />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-5 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-forest/15 blur-2xl"
      />
    </div>
  )
}
