'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronDown, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/icons'
import { AdSlot } from '@/components/AdSlot'
import { ButtonLink } from '@/components/ui/button-link'
import { cn } from '@/lib/utils'

type LinkItem = {
  label: string
  href: string
  external?: boolean
  primary?: boolean
  icon?: string
}

type StepItem = { title: string; description: string; href: string }

type TrendingCard = { tag: string; title: string; description: string; href: string }

type ExploreCard = {
  icon: string
  title: string
  description: string
  href: string
}

type FaqItem = { q: string; a: string }

export function HomePageClient() {
  const t = useTranslations('hero')
  const tSite = useTranslations('site')
  const tAnn = useTranslations('announcements')
  const tJourney = useTranslations('journey')
  const tTrending = useTranslations('trending')
  const tOverview = useTranslations('overview')
  const tExplore = useTranslations('explore')
  const tFaq = useTranslations('faq')
  const tCta = useTranslations('cta')
  const tActions = useTranslations('actions')

  const stats = t.raw('stats') as { icon: string; label: string; value: string }[]
  const buttons = t.raw('buttons') as LinkItem[]
  const updates = tAnn.raw('items') as { tag: string; title: string; date: string; href: string }[]
  const steps = tJourney.raw('steps') as StepItem[]
  const cards = tTrending.raw('cards') as TrendingCard[]
  const quickLinks = tTrending.raw('quickLinks') as LinkItem[]
  const paragraphs = tOverview.raw('paragraphs') as string[]
  const overviewStats = tOverview.raw('stats') as { label: string; value: string }[]
  const exploreCards = tExplore.raw('cards') as ExploreCard[]
  const faqItems = tFaq.raw('items') as FaqItem[]
  const ctaButtons = tCta.raw('buttons') as LinkItem[]

  const [slide, setSlide] = useState(0)
  const slides = Array.from({ length: Math.ceil(cards.length / 2) }, (_, index) =>
    cards.slice(index * 2, index * 2 + 2)
  )
  const go = (delta: number) =>
    setSlide((current) => (current + delta + slides.length) % slides.length)

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="pt-10 pb-6 text-center sm:pt-14 sm:pb-8">
        <div className="relative inline-flex items-start justify-center">
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{t('title')}</h1>
          <span className="ml-2 -translate-y-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground sm:ml-3 sm:-translate-y-1.5">
            {t('badge')}
          </span>
        </div>

        <div className="mx-auto mt-5 max-w-2xl">
          <a
            href="https://www.youtube.com/@vvrobloxgame"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('videoAlt')}
          >
            <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border shadow-lg transition-all duration-200">
              <div className="relative aspect-video w-full">
                <Image src="/images/hero.webp" alt={t('videoAlt')} fill priority sizes="(max-width: 640px) 100vw, 672px" className="object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md transition-transform duration-200 group-hover:scale-105 sm:size-24">
                  <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-transform duration-200 group-hover:scale-110 sm:size-16">
                    <Play className="size-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white">
                {t('videoLabel')}
              </span>
            </div>
          </a>
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('intro')}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {stats.map((stat) => (
            <span
              key={stat.label}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              <Icon name={stat.icon} className="size-3.5" />
              {stat.label} {stat.value}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {buttons.map((button) => (
            <ButtonLink
              key={button.label}
              href={button.href}
              external={button.external}
              variant={button.primary ? 'default' : 'outline'}
              size="lg"
              className={cn(
                button.primary
                  ? 'border border-primary/30 bg-primary/10 text-primary hover:border-primary/50'
                  : 'border border-border/60 bg-card/42 text-foreground hover:border-foreground/25 hover:text-primary'
              )}
            >
              <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                {button.label}
              </span>
            </ButtonLink>
          ))}
        </div>
      </section>

      {/* ---------------- updates + journey ---------------- */}
      <div className="grid gap-0 pb-6 sm:grid-cols-2 sm:gap-6 sm:pb-10">
        <section id="announcements" className="h-full min-w-0">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/30">
            <div className="border-b border-border/40 px-5 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/80">
                {tAnn('title')}
              </p>
            </div>
            <div className="divide-y divide-border/40">
              {updates.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-primary/5"
                >
                  <span className="mt-0.5 shrink-0 rounded-md bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {item.tag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 break-words text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1">
                      <time className="text-[11px] text-muted-foreground/70">{item.date}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-auto flex justify-end border-t border-border/40 px-5 py-2.5">
              <Link
                href={tAnn('allHref')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {tAnn('allLabel')}
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="journey">
          <div className="h-full rounded-xl border border-border/50 bg-card/30">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                    {tJourney('kicker')}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {tJourney('title')}
                  </p>
                </div>
              </div>
              <div className="relative space-y-0">
                {steps.map((step, index) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="group relative flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-primary/5"
                  >
                    <div className="flex flex-col items-center">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold text-primary transition-colors group-hover:border-primary/50">
                        {index + 1}
                      </span>
                      {index < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-border/50" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                        {step.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                        {step.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AdSlot />

      {/* ---------------- trending carousel ---------------- */}
      <section className="pt-4 pb-12 sm:pt-6 sm:pb-16">
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                {tTrending('kicker')}
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                {tTrending('title')}
              </h2>
            </div>
            <div className="mt-1 flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label={tActions('previous')}
                onClick={() => go(-1)}
                className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={tActions('next')}
                onClick={() => go(1)}
                className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
              >
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {slides.map((slideItems, index) => (
                <div key={index} className="grid min-w-full gap-5 lg:grid-cols-2">
                  {slideItems.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group overflow-hidden rounded-2xl border border-border bg-card/60 transition-all hover:border-foreground/20 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/9]">
                        <Image src="/images/hero.webp" alt={card.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                            {card.tag}
                          </span>
                          <h3 className="mt-2 line-clamp-1 text-xl font-semibold text-white">
                            {card.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-white/80">{card.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- what is it ---------------- */}
      <section id="overview" className="py-12 sm:py-16">
        <div className="space-y-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">{tOverview('title')}</h2>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-4 text-base leading-7 text-muted-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/images/hero.webp"
                  alt={tSite('name')}
                  width={400}
                  height={240}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-3.5 sm:p-4">
                <dl className="grid grid-cols-2 gap-2.5 text-sm">
                  {overviewStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="min-w-0 rounded-lg border border-border/70 bg-background/35 px-3 py-2.5"
                    >
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
                        {stat.label}
                      </dt>
                      <dd className="mt-1.5 text-[15px] font-semibold leading-tight text-foreground sm:text-base">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">{tOverview('snapshotNote')}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <ButtonLink href={tOverview('ctaHref')} variant="outline" size="sm">
              {tOverview('ctaLabel')}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------------- explore the wiki ---------------- */}
      <section id="features" className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
                {tExplore('title')}
              </h2>
              <p className="mt-5 max-w-lg text-muted-foreground">{tExplore('description')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exploreCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
                >
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground/80 transition-colors group-hover:bg-foreground group-hover:text-background">
                    <Icon name={card.icon} className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- faq ---------------- */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              {tFaq('title')}
            </h2>
            <p className="mt-5 text-muted-foreground">{tFaq('description')}</p>
          </div>
          <div className="flex w-full flex-col">
            {faqItems.map((item, index) => (
              <div key={item.q} className="not-last:border-b">
                <details className="group" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left text-base font-medium outline-none marker:hidden [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- closing cta ---------------- */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 px-6 py-12 text-center dark:bg-primary/10 sm:px-10 sm:py-16">
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              {tCta('title')}
            </h2>
            <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {tCta('description')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {ctaButtons.map((button) =>
                button.external ? (
                  <a
                    key={button.label}
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-medium transition-all outline-none hover:bg-muted hover:text-foreground"
                  >
                    {button.label}
                  </a>
                ) : (
                  <ButtonLink key={button.label} href={button.href} variant="default" size="lg">
                    {button.label}
                  </ButtonLink>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
