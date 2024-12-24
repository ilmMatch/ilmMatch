import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
            <main className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-5xl font-bold text-primary mb-6">Rules and Guidelines</h1>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">General Rules</h2>
                    <ul className="text-muted-foreground mb-4 list-none">
                        <li>This group is strictly for marriage according to Qur'an and Sunnah.</li>
                        <li>This is a FREE service (fesabil Lillah).</li>
                        <li>Marriage is a serious issue. Profiles should only be submitted by those who are ready to take a step towards getting married.</li>
                        <li>Our niche is Students of knowledge to Students of knowledge only.</li>
                        <li>There is no minimum criteria; we just want to know if you are interested in 'ilm.</li>
                    </ul>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Guidelines for Participants</h2>
                    <ul className="text-muted-foreground mb-4 list-none">
                        <li>Please be sure you are interested in the profile before you send a request.</li>
                        <li>Sisters, please make sure your wali has been informed beforehand and will reply to messages from the brother.</li>
                        <li>Brothers, if you request a sister, please follow through by contacting her wali.</li>
                        <li>If you are no longer interested after being contacted, please have common courtesy and let the brother/wali know.</li>
                    </ul>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                    <p className="text-muted-foreground mb-4">
                        IlmMatch is a post only/facilitating service. We are not a registered business/charity organization. We don't get involved with the complexity of an individual's situation. We ask everyone to make sure everything is halal and sharia compliant. The IlmMatch team is not responsible for any personal outcomes from this service. We require you to do all the due diligence yourself with potential matches.
                    </p>
                </section>

                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
                    <p className="text-muted-foreground mb-4">By using our service, you agree to the following:</p>
                    <ol className="text-muted-foreground mb-4 list-decimal list-inside">
                        <li>I understand that IlmMatch is a free service that only facilitates potential matches by posting profiles and is not a matchmaking service.</li>
                        <li>I understand that the outcome of this match is not the responsibility of IlmMatch in any shape or form, and we will carry out our own due diligence.</li>
                        <li>I understand that there are no legal liabilities towards IlmMatch with respect to any issues related to matching with a potential posted on IlmMatch.</li>
                    </ol>
                </section>

                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/contact">Contact Us</Link>
                </Button>
            </main>
        </div>
    )
}

