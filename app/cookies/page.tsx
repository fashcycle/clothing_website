"use client"
import { motion } from "framer-motion"

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen pt-24 pb-12">
             <div className="container mx-auto px-4">
             <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-m text-muted-foreground mb-6">Effective Date: 22/05/2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground text-lg">
            This Cookie Policy explains how Fashcycle ("we", "us", or "our") uses cookies and similar technologies on our website. 
            We are committed to protecting your privacy and ensuring transparency about how your personal data is collected and used 
            in accordance with the Digital Personal Data Protection Act, 2023 (DPDPA).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
          <p className="text-muted-foreground text-lg">
            Cookies are small text files placed on your device by websites you visit. They help websites remember your actions 
            and preferences (such as login, language, and other display preferences) over a period of time, so you don't have to 
            re-enter them whenever you return to the site or browse from one page to another.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <p className="text-muted-foreground text-lg">We use the following types of cookies on our platform:</p>
          <br/>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-muted-foreground text-lg"><strong>Essential Cookies:</strong> Necessary for the website to function properly. These cookies enable core functionalities such as security, network management, and accessibility.</li>
            <li className="text-muted-foreground text-lg"><strong>Preference Cookies:</strong> Allow us to remember your preferences and settings.</li>
            <li className="text-muted-foreground text-lg"><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
            <li className="text-muted-foreground text-lg"><strong>Marketing Cookies:</strong> Used to track visitors across websites to display ads that are relevant and engaging for the individual user.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Purposes of Processing</h2>
          <p className="text-muted-foreground text-lg">We use cookies for the following purposes:</p>
          <br/>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-muted-foreground text-lg">To ensure the proper functioning and security of our website.</li>
            <li className="text-muted-foreground text-lg">To remember your preferences and improve your user experience.</li>
            <li className="text-muted-foreground text-lg">To analyze website traffic and usage to enhance our services.</li>
            <li className="text-muted-foreground text-lg">To provide you with relevant marketing and advertising content.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
          <p className="text-muted-foreground text-lg">
            Some cookies may be set by third-party service providers (such as analytics and advertising partners) to help us 
            analyze usage and deliver personalized content. The data collected by these cookies may be shared with or processed 
            by these third parties in accordance with their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground text-lg mb-4">The duration for which cookies remain on your device varies:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li className="text-muted-foreground text-lg"><strong>Session Cookies:</strong> Deleted automatically when you close your browser.</li>
            <li className="text-muted-foreground text-lg"><strong>Persistent Cookies:</strong> Remain on your device until they expire or are deleted by you.</li>
          </ul>
        
          <p className="mt-4 text-lg text-gray-600">
          You can find specific retention periods for each cookie in our [Cookie Table/Settings Page].          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Consent and Control</h2>
          <p className="text-muted-foreground text-lg">
            We will request your explicit consent before placing non-essential cookies on your device. You can manage your cookie 
            preferences at any time by using our cookie settings tool or by adjusting your browser settings to block or delete cookies.
          </p>
          <p className="text-muted-foreground text-lg mt-4">
            You have the right to withdraw your consent at any time. Withdrawing consent will not affect the lawfulness of processing 
            based on consent before its withdrawal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
          <p className="text-muted-foreground text-lg">Under the DPDPA, you have the right to:</p>
          <br/>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-muted-foreground text-lg">Access your personal data processed through cookies.</li>
            <li className="text-muted-foreground text-lg">Request correction or deletion of your personal data.</li>
            <li className="text-muted-foreground text-lg">Withdraw your consent for the use of cookies at any time.</li>
          </ul>
          <br/>
          <p className="text-muted-foreground text-lg">For more details on how we process your personal data and your rights, please refer to our [Privacy Policy].</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="text-muted-foreground text-lg">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-muted-foreground text-lg">
            If you have any questions or concerns about our use of cookies or this policy, please contact us at:{' '}<br/>
            <a href="mailto:support@fashcycle.com" className="text-primary hover:underline">
              support@fashcycle.com
            </a>
          </p>
        </section>
        </motion.div>
      </div>
    </div>
  );
}