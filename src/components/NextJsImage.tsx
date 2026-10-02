import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from "yet-another-react-lightbox";

type LightboxSlide = {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  blurDataURL?: string;
};

export default function NextJsImage({
  slide,
  offset,
  rect,
}: {
  slide: LightboxSlide;
  offset: number;
  rect: { width: number; height: number };
}) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();
  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  const width = !cover
    ? Math.round(
        Math.min(
          rect.width,
          (rect.height / (slide.height || 1)) * (slide.width || 1)
        )
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(
          rect.height,
          (rect.width / (slide.width || 1)) * (slide.height || 1)
        )
      )
    : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        src={slide.src || ""}
        alt={slide.alt ?? "Event gallery image"}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined}
        blurDataURL={slide.blurDataURL}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={
          typeof window !== "undefined" && window.innerWidth > 0
            ? `${Math.ceil((width / window.innerWidth) * 100)}vw`
            : "100vw"
        }
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}
