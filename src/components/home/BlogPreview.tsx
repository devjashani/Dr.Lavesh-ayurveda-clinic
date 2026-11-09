'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface ArticleItem {
  slug: string;
  title: string;
  sanskrit: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  aspectRatio: string;
}

const articles: ArticleItem[] = [
  {
    slug: 'ritucharya-monsoon-sharad',
    title: 'The Sharad Transition: Pacifying Pitta as Autumn Descends',
    sanskrit: 'शरद् ऋतौ पित्त शमन विधानम्',
    excerpt: 'Classical guidance on managing aggravated internal heat, skin eruptions, and sluggish digestion during the transition from Varsha to Sharad Ritu according to Ashtanga Hridaya.',
    category: 'Ritucharya (Seasonal Living)',
    readTime: '6 min read',
    date: 'Oct 2026',
    image: '/images/treatments/herbs.jpg',
    aspectRatio: 'aspect-[4/3]', // Card 1: wide
  },
  {
    slug: 'deepana-pachana-gut-health',
    title: 'Deepana & Pachana: Rekindling Digestive Agni Without Acid Aggravation',
    sanskrit: 'अग्नि दीपन पाचन विमर्श',
    excerpt: 'Before any detoxification can succeed, metabolic fire must be cleared of stagnant endotoxins (Ama). Learn the classical spices that kindle Agni without triggering bile surge.',
    category: 'Clinical Digestion',
    readTime: '8 min read',
    date: 'Oct 2026',
    image: '/images/treatments/shirodhara.jpg',
    aspectRatio: 'aspect-[3/4]', // Card 2: tall
  },
  {
    slug: 'ashwagandha-kashayam-science',
    title: 'Pharmacognosy of Medicated Kashayams in Bronze Urulis',
    sanskrit: 'कषाय निर्माण विज्ञान',
    excerpt: 'Why classical water decoctions extracted slowly over 16-part reductions deliver water-soluble polyphenols that standardized dry capsules simply cannot replicate.',
    category: 'Botanical Pharmacognosy',
    readTime: '5 min read',
    date: 'Sep 2026',
    image: '/images/treatments/apothecary.jpg',
    aspectRatio: 'aspect-square', // Card 3: square
  },
];

export function BlogPreview() {
  return (
    <section className="py-20 sm:py-28 bg-paper border-b border-forest/15 relative overflow-hidden">
      <Container size="default">
        <SectionHeading
          eyebrow="Wisdom & Research"
          sanskritEyebrow="ज्ञान प्रबोधिनी"
          title="Clinical Monographs & Seasonal Regimens"
          subtitle="Scholarly essays, herb monographs, and clinical case observations authored by our senior Vaidyas to demystify classical texts."
          align="asymmetric"
        />

        {/* 3 Asymmetrical Cards with varied Aspect Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-10">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="bg-cream rounded-[4px] border border-forest/15 overflow-hidden flex flex-col justify-between group hover:border-forest/40 transition-all duration-300 shadow-xs"
            >
              <div>
                {/* Visual Image with distinct aspect ratio */}
                <div className={`relative w-full ${art.aspectRatio} overflow-hidden bg-forest/10 border-b border-forest/10`}>
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="cream" size="sm">
                      {art.category}
                    </Badge>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-forest/70 mb-2 font-mono">
                    <span>{art.date}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <span className="font-serif italic text-xs text-forest/80 block mb-1">
                    {art.sanskrit}
                  </span>

                  <h3 className="font-display text-xl font-normal text-deep-forest group-hover:text-forest transition-colors leading-snug">
                    <Link href={`/blog/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-ink/75 leading-relaxed mt-2.5 line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/blog/${art.slug}`}
                  className="animated-underline text-xs font-semibold text-deep-forest inline-flex items-center gap-1 group/link"
                >
                  <span>Read Full Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/blog" variant="secondary" size="md" showArrow>
            Explore All Clinical Journal Articles
          </Button>
        </div>
      </Container>
    </section>
  );
}

