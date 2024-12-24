import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-5xl font-bold text-primary mb-6">About IlmMatch</h1>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-muted-foreground mb-4">
                        IlmMatch was born from discussions among students of Al Madrasatu Al Umariyyah, an online Islamic institute. We recognized a gap in matchmaking services for students of knowledge and aimed to fill this niche, facilitating marriages among those who seek Islamic knowledge.
                    </p>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground mb-4">
                        We strive to connect students of knowledge worldwide, providing a platform for those who share a love for Islamic sciences to find compatible spouses. Our goal is to facilitate blessed unions that are built on a strong foundation of faith and knowledge.
                    </p>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
                    <ul className="text-muted-foreground mb-4 list-none">
                        <li>We adhere to the strict aqeedah of Ahle sunnah wa jaamaa, following the Manhaj of the Salaf.</li>
                        <li>We are a volunteer-led initiative with no monetary gains.</li>
                        <li>We provide a platform for connecting, but encourage individuals to perform their own due diligence.</li>
                        <li>We focus on students of Islamic knowledge, regardless of the duration of their studies.</li>
                    </ul>
                </section>

                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/rules">View Our Rules</Link>
                </Button>
            </main>
        </div>
    )
}

