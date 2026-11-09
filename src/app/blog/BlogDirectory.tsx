'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '@/lib/data/types';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, ArrowRight, ArrowUpRight, User, BookOpen, Sparkles } from 'lucide-react';

interface BlogDirectoryProps {
  posts: BlogPost[];
}

const CATEGORIES = [
  'All',
  'Clinical Cases',
  'Panchakarma Science',
  'Herbal Formulations',
  'Ritucharya',
  'Dinacharya',
] as const;

export function BlogDirectory({ posts }: BlogDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const featured = posts[0];
  const regularPosts = posts.slice(1);

  const filteredPosts =
    selectedCategory === 'All'
      ? regularPosts
      : regularPosts.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Featured Article Card */}
      {featured && selectedCategory === 'All' && (
        <Container className="mb-16">
          <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 md:p-12 shadow-sm hover:border-forest/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-forest/[0.04] select-none pointer-events-none hidden lg:block">
              <span className="font-sanskrit text-9xl">ज्ञान</span>
            </div>

            <div className="max-w-3xl relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="turmeric">Featured Clinical Monograph</Badge>
                <Badge variant="sage">{featured.category}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-ink/60 font-mono">
                  <Clock className="w-3.5 h-3.5 text-turmeric" />
                  <span>{featured.readTimeMinutes} min read</span>
                </div>
              </div>

              {featured.sanskritSubheading && (
                <p className="font-sanskrit text-sm text-forest/80 mb-2">
                  {featured.sanskritSubheading}
                </p>
              )}

              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-deep-forest font-medium tracking-tight mb-4 leading-snug">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="hover:text-forest transition-colors"
                >
                  {featured.title}
                </Link>
              </h2>

              <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed mb-6">
                {featured.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-forest/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cream border border-forest/20 flex items-center justify-center font-display text-forest font-medium text-xs">
                    {featured.author.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <span className="font-body text-xs font-medium text-deep-forest block">
                      {featured.author.name}
                    </span>
                    <span className="font-mono text-[11px] text-ink/60 block">
                      {featured.author.role} · {featured.publishedAt}
                    </span>
                  </div>
                </div>

                <Button href={`/blog/${featured.slug}`} variant="primary">
                  Read Full Monograph
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Category Filter Pills */}
      <Container className="mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium mr-2 shrink-0">
            Categories:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-body transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-paper bg-forest font-medium shadow-xs'
                    : 'text-deep-forest/80 bg-paper hover:bg-paper/80 border border-forest/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Container>

      {/* Articles Grid with Varied Rhythm and Aspect Ratios */}
      <Container className="mb-20">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredPosts.map((post, idx) => {
              // Create varied visual rhythm: alternate styles
              const isEven = idx % 2 === 0;
              const isThird = idx % 3 === 2;

              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-paper border border-forest/15 rounded-[4px] p-6 flex flex-col justify-between hover:border-turmeric/60 hover:-translate-y-1 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xs group ${
                    isThird ? 'lg:bg-cream/70' : ''
                  }`}
                >
                  {/* Arrow circle fades in at corner */}
                  <div
                    aria-hidden="true"
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-cream/90 text-deep-forest border border-forest/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-2xs pointer-events-none"
                  >
                    <ArrowUpRight className="w-4 h-4 text-turmeric" />
                  </div>

                  <div>
                    {/* Visual Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant={isEven ? 'sage' : 'clay'}>
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-ink/60">
                        <Clock className="w-3 h-3 text-turmeric" />
                        <span>{post.readTimeMinutes} min</span>
                      </div>
                    </div>

                    {/* Sanskrit Epigraph if available */}
                    {post.sanskritSubheading && (
                      <span className="font-sanskrit text-xs text-forest/75 block mb-1">
                        {post.sanskritSubheading}
                      </span>
                    )}

                    <h3 className="font-display text-lg sm:text-xl text-deep-forest font-medium leading-snug mb-3 group-hover:text-forest transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="font-body text-xs sm:text-sm text-ink/75 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                    <div>
                      <span className="font-body text-xs font-medium text-deep-forest block">
                        {post.author.name}
                      </span>
                      <span className="font-mono text-[10px] text-ink/50 block">
                        {post.publishedAt}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-body text-xs text-forest group-hover:text-deep-forest font-medium inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}

