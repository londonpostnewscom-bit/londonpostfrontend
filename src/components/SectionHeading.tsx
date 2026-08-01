export function SectionHeading({
  eyebrow, title, description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="text-3xl font-bold uppercase tracking-[0.35em] text-accent">
          {eyebrow}
        </p>
      )}
  
    </div>
  );
}
