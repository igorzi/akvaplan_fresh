import { useState } from "preact/hooks";
import { HScroll } from "akvaplan_fresh/components/mod.ts";

type Image = {
  img: string;
  href: string;
  title: string;
};

type Props = {
  scrollerId: string;
  images: Image[];
};

type ScrollImageProps = {
  image: Image;
  onHover: () => void;
};

const ScrollImage = ({ image, onHover }: ScrollImageProps) => {
  return (
    <div
      className="scroll-image"
      onMouseEnter={() => setTimeout(onHover, 500)}
    >
      <a class="image-container" href={image.href}>
        <img alt="" width={400} height={400} loading="lazy" src={image.img} />
      </a>
    </div>
  );
};

export default function HScrollWithDynamicImage({ scrollerId, images }: Props) {
  const [bigImage, setBigImage] = useState(images.at(0));

  if (!bigImage) return null;

  return (
    <section className="dynamic-image-hscroll">
      <img className="dynamic-image-big" src={bigImage.img} />
      <div className="dynamic-scroll-details">
        <h2>{bigImage.title}</h2>
      </div>
      <div className="dynamic-scroll-container">
        <HScroll scrollerId={scrollerId} maxVisibleChildren={5}>
          {images.map((image) => (
            <ScrollImage
              image={image}
              onHover={() => setBigImage(image)}
            />
          ))}
        </HScroll>
      </div>
    </section>
  );
}
