import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-5xl font-bold text-primary mb-6">Contact Us</h1>

                <section className="mb-8 max-w-2xl mx-auto">
                    <p className="text-muted-foreground mb-4">
                        If you have any questions, concerns, or need support, please don't hesitate to reach out to us. We're here to help! <br /> contact for is not active right now.
                    </p>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <p className="text-muted-foreground mb-2">Email: ilmmatch.inbox@gmail.com</p>
                    <p className="text-muted-foreground mb-4">
                        Telegram: <Link href="https://t.me/ilmmatch" className="text-primary hover:underline">https://t.me/ilmmatch</Link>
                    </p>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                            <Input type="text" id="name" name="name" required className="mt-1 block w-full" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
                            <Input type="email" id="email" name="email" required className="mt-1 block w-full" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
                            <Textarea id="message" name="message" rows={4} required className="mt-1 block w-full" />
                        </div>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Send Message
                        </Button>
                    </form>
                </section>
            </main>
        </div>
    )
}

