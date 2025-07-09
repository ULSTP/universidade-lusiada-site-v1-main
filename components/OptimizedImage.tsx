"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setError(false)
  }, [src])

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <Image
        src={error ? '/images/placeholder.webp' : src}
        alt={alt}
        width={width}
        height={height}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${error ? 'object-contain' : 'object-cover'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        quality={75}
      />
    </div>
  )
} 