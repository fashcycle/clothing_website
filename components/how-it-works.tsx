import { Upload, Search, CreditCard, Package } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "List Your Wardrobe",
      description: "Share your designer pieces with our community and earn money when they're rented.",
    },
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Discover & Rent",
      description: "Browse thousands of occasion-wear and rent them for a fraction of the retail price.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Secure Transactions",
      description: "Our secure payment system protects both lenders and renters.",
    },
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: "Wear & Return",
      description: "Enjoy your rented items and return them using our prepaid shipping label.",
    },
  ]

  return (
    <section className="container  md:py-10">
      <div className="text-center mb-10 ">
        <h2 className="text-2xl md:text-3xl font-serif font-medium">How It Works</h2>
        <p className="mt-4  md:text-lg max-w-3xl mx-auto">
          Join our community of fashion lovers who rent, lend, and buy occasion-wear
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center group animate-fade-in-delay hover-scale">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary/20">
                {step.icon}
              </div>
              <div className="absolute top-0 right-0 -mr-3 -mt-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

