import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { blogs, doctors } from '@/lib/data';
import {
  Clock,
  Calendar,
  ArrowRight,
  User,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Monograph Not Found | Aarogyam Ayurveda',
      description: 'The requested classical article could not be located.',
    };
  }

  return {
    title: `${post.title} | Aarogyam Ayurveda Wisdom`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogs.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find author doctor profile if available
  const authorDoctor = doctors.find((d) =>
    post.author.name.toLowerCase().includes(d.name.toLowerCase().replace('dr. ', ''))
  );

  // Related posts (excluding current)
  const relatedPosts = blogs.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Format paragraphs from content
  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Dynamic Reading Progress Bar at the top of the viewport */}
      <ReadingProgressBar />

      {/* Breadcrumbs */}
      <Container className="mb-6">
        <nav className="flex items-center gap-2 text-xs font-mono text-ink/60">
          <Link href="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-forest transition-colors">
            Wisdom
          </Link>
          <span>/</span>
          <span className="text-forest font-medium truncate max-w-xs">{post.title}</span>
        </nav>
      </Container>

      {/* Article Header */}
      <Container className="mb-12">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="turmeric">{post.category}</Badge>
            <div className="flex items-center gap-1.5 text-xs text-ink/60 font-mono">
              <Clock className="w-3.5 h-3.5 text-turmeric" />
              <span>{post.readTimeMinutes} min read</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink/60 font-mono">
              <Calendar className="w-3.5 h-3.5 text-sage" />
              <span>{post.publishedAt}</span>
            </div>
          </div>

          {post.sanskritSubheading && (
            <p className="font-sanskrit text-sm sm:text-base text-forest/80 mb-3">
              {post.sanskritSubheading}
            </p>
          )}

          <h1 className="font-display text-display-h2 text-deep-forest tracking-tight leading-[1.12] mb-6">
            {post.title}
          </h1>

          <p className="font-body text-base md:text-lg text-ink/80 leading-relaxed italic border-l-2 border-turmeric pl-4 mb-6">
            "{post.excerpt}"
          </p>

          {/* Author Strip */}
          <div className="flex items-center justify-between py-4 border-y border-forest/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest text-paper flex items-center justify-center font-display font-medium text-xs">
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <span className="font-body text-xs font-medium text-deep-forest block">
                  {post.author.name}
                </span>
                <span className="font-mono text-[11px] text-ink/60 block">
                  {post.author.role}
                </span>
              </div>
            </div>

            {authorDoctor && (
              <Link
                href={`/doctors/${authorDoctor.slug}`}
                className="text-xs text-forest hover:text-deep-forest underline underline-offset-4 font-medium"
              >
                View Physician Profile
              </Link>
            )}
          </div>
        </div>
      </Container>

      {/* Main 2-Column Editorial Layout */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8 space-y-8 bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 shadow-xs">
            {/* Render paragraphs cleanly */}
            <div className="prose prose-stone max-w-none text-ink/85 font-body leading-relaxed space-y-6">
              {paragraphs.map((p, idx) => {
                // If paragraph begins with a number (e.g. "1. Samagni") or list
                if (p.startsWith('1.') || p.startsWith('2.') || p.startsWith('3.') || p.startsWith('4.')) {
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-[3px] bg-cream border border-forest/10 my-4"
                    >
                      <p className="text-xs sm:text-sm text-ink/85 font-body leading-relaxed m-0">
                        {p}
                      </p>
                    </div>
                  );
                }

                // If paragraph begins with "Stage" or "During"
                if (p.startsWith('Stage ') || p.startsWith('Classical Ayurveda identifies')) {
                  return (
                    <div key={idx} className="my-6">
                      <h3 className="font-display text-lg sm:text-xl text-deep-forest font-medium mb-3">
                        {p.split('\n')[0]}
                      </h3>
                      {p.split('\n').slice(1).map((subP, subIdx) => (
                        <p key={subIdx} className="text-sm text-ink/80 leading-relaxed mb-3">
                          {subP}
                        </p>
                      ))}
                    </div>
                  );
                }

                return (
                  <p key={idx} className="text-sm sm:text-base text-ink/85 leading-relaxed">
                    {p}
                  </p>
                );
              })}
            </div>

            {/* Classical Clinical Caveat Box */}
            <div className="p-5 rounded-[4px] bg-mist/60 border border-forest/20 mt-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-forest" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                  Clinical Principle (सिद्धान्त)
                </h4>
              </div>
              <p className="font-body text-xs text-ink/80 leading-relaxed">
                Classical Ayurvedic formulations and dietary regimens must always be tailored to an
                individual's specific biological constitution (Prakriti), age, metabolic strength
                (Bala), and current pathology (Vikriti). Self-prescription of potent herbs without
                radial pulse assessment is not recommended.
              </p>
            </div>

            {/* Tags Strip */}
            <div className="pt-6 border-t border-forest/10 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-ink/60 uppercase">Tags:</span>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-cream px-3 py-1 rounded-full border border-forest/10 text-deep-forest"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Box */}
            <div className="p-6 bg-cream rounded-[4px] border border-forest/15 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-forest text-paper flex items-center justify-center font-display font-medium text-lg shrink-0">
                {post.author.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-medium block">
                  Authored by
                </span>
                <h3 className="font-display text-lg text-deep-forest font-medium">
                  {post.author.name}
                </h3>
                <p className="font-body text-xs text-forest/80 font-medium mb-2">
                  {post.author.role}
                </p>
                <p className="font-body text-xs text-ink/75 leading-relaxed mb-4">
                  Practicing classical physician at Aarogyam Ayurveda, Jaipur. Dedicated to reviving
                  unhurried clinical diagnosis and publishing verified patient cohort outcomes.
                </p>
                {authorDoctor ? (
                  <Button href={`/doctors/${authorDoctor.slug}`} variant="secondary" className="text-xs px-3.5 py-1.5">
                    View Doctor Profile & Timings
                  </Button>
                ) : (
                  <Button href="/doctors" variant="secondary" className="text-xs px-3.5 py-1.5">
                    View Faculty Directory
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Quick Table of Contents / Key Highlights */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-forest" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                  Monograph Outline
                </h3>
              </div>
              <ul className="space-y-2 text-xs font-body text-ink/75">
                <li className="flex items-start gap-2 py-1 border-b border-forest/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                  <span>Classical Sanskrit Foundations</span>
                </li>
                <li className="flex items-start gap-2 py-1 border-b border-forest/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                  <span>Pathological Doshic Mechanics</span>
                </li>
                <li className="flex items-start gap-2 py-1 border-b border-forest/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                  <span>Stage-by-Stage Clinical Interventions</span>
                </li>
                <li className="flex items-start gap-2 py-1 border-b border-forest/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
                  <span>Dietary Pathya & Home Protocols</span>
                </li>
              </ul>
            </div>

            {/* Direct Consultation Card */}
            <div className="bg-forest text-paper border border-deep-forest rounded-[4px] p-6 shadow-xs text-center space-y-4">
              <span className="font-mono text-[11px] text-turmeric uppercase tracking-wider block font-medium">
                Clinical Care
              </span>
              <h3 className="font-display text-xl text-paper">
                Discuss Your Symptoms with a Vaidya
              </h3>
              <p className="font-body text-xs text-paper/80 leading-relaxed">
                Suffering from chronic symptoms discussed in this monograph? Schedule an unhurried
                pulse diagnosis or video consultation with our physicians.
              </p>
              <Button
                href="/book"
                variant="primary"
                className="w-full justify-center bg-turmeric text-deep-forest hover:bg-turmeric/90"
              >
                Book Consultation
              </Button>
            </div>

            {/* Quick Link to Therapies */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs text-xs space-y-2">
              <span className="font-mono text-[11px] text-forest/70 uppercase tracking-wider block font-medium">
                Explore Therapies
              </span>
              <p className="text-ink/75 leading-relaxed">
                Discover classical Panchakarma and specialized Basti protocols in our complete therapy directory.
              </p>
              <Link
                href="/treatments"
                className="text-forest hover:text-deep-forest underline underline-offset-4 font-medium inline-flex items-center gap-1 pt-1"
              >
                Browse All 12 Therapies <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Related Posts Strip */}
      {relatedPosts.length > 0 && (
        <Container className="mt-20">
          <div className="border-t border-forest/10 pt-12">
            <h3 className="font-display text-2xl text-deep-forest mb-6">
              Continue Reading · अन्य संवादाः
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-paper border border-forest/15 rounded-[4px] p-6 hover:border-forest/30 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="sage">{rel.category}</Badge>
                    <span className="text-[11px] font-mono text-ink/60">
                      {rel.readTimeMinutes} min read
                    </span>
                  </div>
                  <h4 className="font-display text-lg text-deep-forest font-medium mb-2">
                    <Link href={`/blog/${rel.slug}`} className="hover:text-forest transition-colors">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="font-body text-xs text-ink/75 line-clamp-2 mb-4">
                    {rel.excerpt}
                  </p>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs text-forest hover:text-deep-forest underline underline-offset-4 font-medium inline-flex items-center gap-1"
                  >
                    Read Monograph <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
