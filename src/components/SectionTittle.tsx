interface SectionTittleProps {
    title: string;
}

export default function SectionTittle({ title }: SectionTittleProps) {
    return (
        <>
            <h2 className="mb-12 text-center text-4xl font-bold text-white lg:text-5xl">
                {title}
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-ando-cyan" />
        </>
    );
}