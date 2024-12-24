import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Shield, Heart } from 'lucide-react'
import { title } from '@/components/primitives'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <main className="container mx-auto px-4 text-center">
        {/* Improved Hero Section */}
        <section className="py-20">
          <h1 className="text-6xl font-bold text-primary mb-6">IlmMatch</h1>
          <h2 className="text-4xl font-semibold text-primary mb-4">Connecting Hearts Of Knowledge</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Facilitating blessed unions for students of Islamic knowledge worldwide.
            Find your life partner who shares your passion for 'ilm and deen.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/about">Learn More</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </section>
        <section className="py-16 max-w-5xl mx-auto">
          <h3 className="text-3xl font-semibold text-primary mb-6 text-center">Our Story</h3>
          <p className="text-lg text-muted-foreground">
            Born from discussions among students of Al Madrasatu Al Umariyyah, we recognized a gap in matchmaking services.
            IlmMatch aims to fill this niche, facilitating marriages among students of knowledge for an easy transition into married life.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="py-16">
          <h3 className="text-3xl font-semibold text-primary mb-10">Why Choose IlmMatch?</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <BookOpen className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2">For Students of Knowledge</h4>
                <p className="text-muted-foreground">Connecting those who have a love for 'ilm, regardless of their level of study.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2">Worldwide Connections</h4>
                <p className="text-muted-foreground">Bridging the gap between seekers of knowledge across the globe.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2">Adhering to Aqeedah</h4>
                <p className="text-muted-foreground">Following the Manhaj of the Salaf, based on the Quran and Sunnah.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2">Volunteer-Led Initiative</h4>
                <p className="text-muted-foreground">A volunteer-led, non-profit effort to support the Muslim community.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <h3 className="text-3xl font-semibold text-primary mb-6">Join IlmMatch Today</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey towards a blessed union with a fellow seeker of knowledge.
            Let your shared love for Islamic learning be the foundation of your future together.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Get Started</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}

