import React from 'react';
import imageVariants from '../../generated/imageVariants.json';

type ImageVariant = { src: string; width: number };
type ImageFormats = { avif?: ImageVariant[]; webp?: ImageVariant[] };
type ImageManifest = Record<string, ImageFormats>;

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  sizes?: string;
  priority?: boolean;
}

const manifest = imageVariants as ImageManifest;

const toSrcSet = (items?: ImageVariant[]) =>
  items?.length ? items.map((item) => `${item.src} ${item.width}w`).join(', ') : undefined;

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  sizes = '100vw',
  loading,
  priority = false,
  decoding = 'async',
  fetchPriority,
  ...props
}) => {
  const variants = manifest[src];
  const avifSet = toSrcSet(variants?.avif);
  const webpSet = toSrcSet(variants?.webp);

  return (
    <picture>
      {avifSet && <source type="image/avif" srcSet={avifSet} sizes={sizes} />}
      {webpSet && <source type="image/webp" srcSet={webpSet} sizes={sizes} />}
      <img
        src={src}
        sizes={sizes}
        loading={priority ? 'eager' : loading ?? 'lazy'}
        fetchPriority={priority ? 'high' : fetchPriority}
        decoding={priority ? 'sync' : decoding}
        {...props}
      />
    </picture>
  );
};
