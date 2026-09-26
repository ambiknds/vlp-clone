import React from 'react'
import {
  PortableText as PortableTextReact,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react'
import { Lightbulb, Info, AlertTriangle, FileCode } from 'lucide-react'
import { urlForImage } from '@/sanity/lib/image'
import Image from 'next/image'

interface PortableTextProps {
  value?: PortableTextBlock[] | null
  className?: string
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] text-[#334155] leading-[1.75] mb-4 font-sans">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-[22px] font-serif font-bold text-[#0F172A] mt-8 mb-3 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[18px] font-serif font-semibold text-[#0F172A] mt-6 mb-2.5 tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[16px] font-sans font-semibold text-[#0F172A] mt-4 mb-2 tracking-tight">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#F97316] pl-4 py-1 my-4 italic text-[#475569] bg-[#FFF7ED]/50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 text-[15px] text-[#334155] leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 text-[15px] text-[#334155] leading-relaxed">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0F172A]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-[#F1F5F9] text-[#0F172A] px-1.5 py-0.5 rounded text-[13.5px] font-mono border border-[#E2E8F0]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const isExternal = (value?.href || '').startsWith('http')
      return (
        <a
          href={value?.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#F97316] font-medium hover:underline inline-flex items-center gap-0.5"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    codeSnippet: ({ value }) => {
      const { language, filename, code } = value || {}
      return (
        <div className="my-6 rounded-[12px] overflow-hidden border border-[#E2E8F0] bg-[#0F172A] text-[#F8FAFC] shadow-sm">
          {filename && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-[#334155] text-[12.5px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{filename}</span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#64748B]">
                {language || 'code'}
              </span>
            </div>
          )}
          <pre className="p-4 text-[13.5px] font-mono overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      )
    },

    callout: ({ value }) => {
      const { tone = 'tip', text } = value || {}
      const toneConfig = {
        tip: {
          bg: 'bg-[#FFF7ED]',
          border: 'border-[#FB923C]/50',
          text: 'text-[#9A3412]',
          label: 'Pro Tip',
          Icon: Lightbulb,
        },
        info: {
          bg: 'bg-[#F0F9FF]',
          border: 'border-[#38BDF8]/50',
          text: 'text-[#0369A1]',
          label: 'Note',
          Icon: Info,
        },
        warning: {
          bg: 'bg-[#FFFBEB]',
          border: 'border-[#FBBF24]/50',
          text: 'text-[#92400E]',
          label: 'Attention',
          Icon: AlertTriangle,
        },
      }

      const current = toneConfig[tone as keyof typeof toneConfig] || toneConfig.tip
      const { Icon } = current

      return (
        <div
          className={`my-5 p-4 rounded-[12px] border ${current.bg} ${current.border} flex items-start gap-3`}
        >
          <div className="p-1 rounded-full shrink-0 mt-0.5">
            <Icon className={`w-4 h-4 ${current.text}`} />
          </div>
          <div>
            <p className={`text-[12.5px] font-bold uppercase tracking-wider mb-1 ${current.text}`}>
              {current.label}
            </p>
            <p className="text-[14px] text-[#334155] leading-relaxed">{text}</p>
          </div>
        </div>
      )
    },

    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }

      const imageUrl = urlForImage(value).width(900).url()

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#E2E8F0]">
            <Image
              src={imageUrl}
              alt={value.alt || 'Lesson illustration'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-[12.5px] text-[#64748B] mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null
  }

  return (
    <div className={`prose-vertex ${className}`}>
      <PortableTextReact value={value} components={components} />
    </div>
  )
}
