import { cn } from "@/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleAs: TitleTag = "h2",
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#17618E]">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag className="font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.2] tracking-tight text-[#102A43]">
        {title}
      </TitleTag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-[16px] leading-relaxed text-[#52606D] md:text-[17px]",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
