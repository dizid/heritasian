import { useHead } from '@unhead/vue'
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/seo/constants'

interface SeoOptions {
  title: string
  description?: string
  path: string
  ogImage?: string
  ogType?: 'website' | 'article'
}

function buildBreadcrumbs(path: string, title: string) {
  const items: { '@type': string; position: number; name: string; item?: string }[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ]

  if (path !== '/') {
    // Add intermediate breadcrumb for hotel detail pages
    if (path.startsWith('/hotel/')) {
      items.push({ '@type': 'ListItem', position: 2, name: 'Rankings', item: `${SITE_URL}/rankings` })
      items.push({ '@type': 'ListItem', position: 3, name: title })
    } else {
      items.push({ '@type': 'ListItem', position: 2, name: title })
    }
  }

  return items
}

export function useSeo(options: SeoOptions | (() => SeoOptions)) {
  useHead(() => {
    const opts = typeof options === 'function' ? options() : options
    const fullTitle = opts.path === '/' ? `${SITE_NAME} — ${opts.title}` : `${opts.title} | ${SITE_NAME}`
    const description = opts.description ?? DEFAULT_DESCRIPTION
    const canonicalUrl = `${SITE_URL}${opts.path}`
    const ogImage = opts.ogImage ?? DEFAULT_OG_IMAGE

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:type', content: opts.ogType ?? 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: buildBreadcrumbs(opts.path, opts.title),
          }),
        },
      ],
    }
  })
}
