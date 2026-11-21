'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

type MediaCategory = 'Living Room' | 'TV Unit' | 'Bed Rooms' | 'Videos' | string

type PortfolioFile = {
  file: string
  width: number
  height: number
}

const portfolioFiles: PortfolioFile[] = [
  { file: 'living .jpg', width: 4672, height: 7008 },
  { file: 'living 1.jpg', width: 4672, height: 7008 },
  { file: 'living 2.jpg', width: 7008, height: 4672 },
  { file: 'living 3.jpg', width: 7008, height: 4672 },
  { file: 'living 4.jpg', width: 6931, height: 4621 },
  { file: 'living 5.jpg', width: 4672, height: 7008 },
  { file: 'living 6.jpg', width: 7008, height: 4672 },
  { file: 'tv unit 1.jpg', width: 4569, height: 6854 },
  { file: 'tv unit 2.jpg', width: 7008, height: 4672 },
  { file: 'tv unit 3.jpg', width: 4672, height: 7008 },
  { file: 'tv unit 4.jpg', width: 4595, height: 6395 },
  { file: 'bedroom 1.jpg', width: 4672, height: 7008 },
  { file: 'bedroom 2.jpg', width: 4672, height: 7008 },
  { file: 'bedroom 3.jpg', width: 4672, height: 7008 },
  { file: '1-xpYfpAsEUhlUANDaMuJ9EjL53uyWzR.mp4', width: 0, height: 0 },
]

function categoryForFile(file: string): MediaCategory {
  if (/\.(mp4|mov|webm)$/i.test(file)) return 'Videos'
  if (/\b(tv|tv unit)\b/i.test(file)) return 'TV Unit'
  if (/\b(bed|bedroom)\b/i.test(file)) return 'Bed Rooms'
  if (/living/i.test(file)) return 'Living Room'
  return file.replace(/\.[^.]+$/, '').replace(/\d+/g, '').trim().replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Other'
}

function fileNumber(file: string) {
  return Number(file.match(/\d+/)?.[0] ?? 0)
}

function categorySlug(category: MediaCategory) {
  return category.toLowerCase().replace(/\s+/g, '-')
}

const portfolio = portfolioFiles.map((item) => {
  const category = categoryForFile(item.file)
  const isVideo = category === 'Videos'

  return {
    ...item,
    category,
    isVideo,
    src: `/portfolio/${categorySlug(category)}/${encodeURIComponent(item.file)}`,
    title: isVideo ? `Video ${fileNumber(item.file) || 1}` : item.file.replace(/\.[^.]+$/, ''),
  }
})

const portfolioCategories = Array.from(new Set(portfolio.map((item) => item.category)))
  .map((name) => ({
    name,
    items: portfolio.filter((item) => item.category === name).sort((a, b) => fileNumber(a.file) - fileNumber(b.file)),
  }))

const firstPhoto = portfolio.find((item) => !item.isVideo)
const categoryGridClass = portfolioCategories.length >= 4
  ? 'xl:grid-cols-4'
  : 'xl:grid-cols-3'
const centerFinalCard = portfolioCategories.length >= 4 && portfolioCategories.length % 3 === 1

export function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const lightboxVideoRef = useRef<HTMLVideoElement>(null)

  const activeCategory = portfolioCategories.find((category) => category.name === selectedCategory)
  const activeItems = activeCategory?.items ?? []
  const lightboxItem = lightboxIndex === null ? null : activeItems[lightboxIndex]

  const openCategory = (category: MediaCategory) => {
    setSelectedCategory(category)
    setLightboxIndex(null)
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const adjacentIndexes = useMemo(() => {
    if (lightboxIndex === null || activeItems.length < 2) return null
    return {
      previous: (lightboxIndex - 1 + activeItems.length) % activeItems.length,
      next: (lightboxIndex + 1) % activeItems.length,
    }
  }, [activeItems.length, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowLeft' && activeItems.length > 1) {
        event.preventDefault()
        setLightboxIndex((current) => current === null ? null : (current - 1 + activeItems.length) % activeItems.length)
      }
      if (event.key === 'ArrowRight' && activeItems.length > 1) {
        event.preventDefault()
        setLightboxIndex((current) => current === null ? null : (current + 1) % activeItems.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeItems.length, lightboxIndex])

  useEffect(() => {
    if (lightboxItem?.isVideo && lightboxVideoRef.current) {
      lightboxVideoRef.current.currentTime = 0
    }
  }, [lightboxItem])

  return (
    <section id="work" className="px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-44">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 md:mb-16">
          <p className="eyebrow">01 / Selected work</p>
          <h2 className="section-title mt-8">Spaces, <em>stories</em> &amp; atmosphere.</h2>
          <p className="mt-6 max-w-lg text-sm leading-6 text-black/50">Choose a category to explore the photographs and films.</p>
        </div>

        <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${categoryGridClass}`}>
          {portfolioCategories.map(({ name, items }, index) => {
            const cover = items[0]
            const countLabel = name === 'Videos'
              ? items.length === 1 ? 'video' : 'videos'
              : items.length === 1 ? 'photograph' : 'photographs'

            return (
              <button
                key={name}
                type="button"
                onClick={() => openCategory(name)}
                onMouseEnter={() => cover?.isVideo && setHoveredVideo(cover.file)}
                onMouseLeave={() => cover?.isVideo && setHoveredVideo(null)}
                className={`group flex h-full flex-col border border-black/15 bg-[#f5f3ef] p-4 text-left transition-colors hover:bg-[#ebe7e0] md:p-5 ${centerFinalCard && index === portfolioCategories.length - 1 ? 'lg:col-start-2 xl:col-start-auto' : ''}`}
                aria-label={`Open ${name}, ${items.length} ${countLabel}`}
              >
                <span className="relative mb-5 block aspect-[4/3] w-full overflow-hidden bg-black/10">
                  {cover?.isVideo ? (
                    <>
                      {firstPhoto && <img src={firstPhoto.src} alt="" width={firstPhoto.width} height={firstPhoto.height} loading="lazy" className="absolute inset-0 size-full object-cover" />}
                      <video src={cover.src} poster={firstPhoto?.src} preload="metadata" muted playsInline autoPlay={hoveredVideo === cover.file} className={`absolute inset-0 size-full object-cover transition-opacity ${hoveredVideo === cover.file ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-black" aria-hidden="true"><Play size={13} fill="currentColor" /></span>
                    </>
                  ) : cover ? (
                    <img src={cover.src} alt={`${name} portfolio cover`} width={cover.width} height={cover.height} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </span>
                <span className="mt-auto block font-serif text-xl uppercase tracking-[0.08em] md:text-2xl">{name}</span>
                <span className="mt-2 block text-xs text-black/45">{items.length} {countLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeCategory && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#f5f3ef] px-5 pb-16 pt-28 md:px-10 md:pt-36" aria-label={`${activeCategory.name} portfolio`}>
          <div className="mx-auto max-w-[1440px]">
            <button type="button" onClick={() => setSelectedCategory(null)} className="mb-8 inline-flex items-center gap-3 border-b border-black/30 pb-3 text-[10px] uppercase tracking-[0.2em]">
              <ArrowLeft size={14} aria-hidden="true" /> Back to categories
            </button>
            <div className="mb-10 flex flex-col justify-between gap-6 border-b border-black/15 pb-8 md:mb-12 md:flex-row md:items-end md:pb-10">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 className="section-title mt-6">{activeCategory.name}</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-black/50">{activeItems.length} {activeCategory.name === 'Videos' ? activeItems.length === 1 ? 'video' : 'videos' : activeItems.length === 1 ? 'photograph' : 'photographs'} in this collection.</p>
            </div>

            <div className={activeItems.length === 1 ? 'mx-auto max-w-[360px]' : 'columns-2 gap-4 md:gap-5 lg:columns-3'}>
              {activeItems.map((item, index) => (
                <button
                  type="button"
                  key={item.file}
                  onClick={() => openLightbox(index)}
                  onMouseEnter={() => item.isVideo && setHoveredVideo(item.file)}
                  onMouseLeave={() => item.isVideo && setHoveredVideo(null)}
                  className="group relative mb-4 block w-full break-inside-avoid overflow-hidden text-left md:mb-5"
                  aria-label={item.isVideo ? `Play ${item.title}` : `View ${item.title}`}
                >
                  {item.isVideo ? (
                    <>
                      {firstPhoto && <img src={firstPhoto.src} alt="" width={firstPhoto.width} height={firstPhoto.height} loading="lazy" className="block aspect-[9/16] w-full object-cover" />}
                      <video
                        src={item.src}
                        poster={firstPhoto?.src}
                        preload="metadata"
                        muted
                        loop
                        playsInline
                        autoPlay={hoveredVideo === item.file}
                        className={`absolute inset-0 size-full aspect-[9/16] object-cover transition-opacity ${hoveredVideo === item.file ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {hoveredVideo !== item.file && <span className="absolute inset-0 flex items-center justify-center bg-black/10"><span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-black"><Play size={15} fill="currentColor" aria-hidden="true" /></span></span>}
                      <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] text-white drop-shadow">{item.title}</span>
                    </>
                  ) : (
                    <>
                      <img src={item.src} alt={item.title} width={item.width} height={item.height} loading="lazy" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
                      <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-10 text-[10px] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity group-hover:opacity-100">{item.title}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxItem && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-5" role="dialog" aria-modal="true" aria-label={`${activeCategory?.name} media viewer`} onClick={closeLightbox}>
          <button type="button" aria-label="Close media viewer" onClick={closeLightbox} className="absolute right-5 top-5 flex size-12 items-center justify-center text-white transition-opacity hover:opacity-60 md:right-8 md:top-8"><X size={24} /></button>
          {adjacentIndexes && <button type="button" aria-label="Previous item" onClick={(event) => { event.stopPropagation(); setLightboxIndex(adjacentIndexes.previous) }} className="absolute left-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-60 md:left-8"><ChevronLeft size={32} /></button>}
          <div className="relative flex max-h-[90vh] w-full max-w-5xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {lightboxItem.isVideo ? (
              <video ref={lightboxVideoRef} src={lightboxItem.src} poster={firstPhoto?.src} className="max-h-[85vh] w-full object-contain" controls autoPlay playsInline preload="metadata" />
            ) : (
              <img src={lightboxItem.src} alt={lightboxItem.title} width={lightboxItem.width} height={lightboxItem.height} loading="lazy" className="max-h-[85vh] w-full object-contain" />
            )}
            <p className="absolute bottom-4 left-4 text-sm text-white drop-shadow-lg">{lightboxItem.title} · {activeCategory?.name}</p>
          </div>
          {adjacentIndexes && <button type="button" aria-label="Next item" onClick={(event) => { event.stopPropagation(); setLightboxIndex(adjacentIndexes.next) }} className="absolute right-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-60 md:right-8"><ChevronRight size={32} /></button>}
        </div>
      )}
    </section>
  )
}
