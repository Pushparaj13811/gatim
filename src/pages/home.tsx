import { Card } from '@/components/ui/card';
import { Languages, FileText, Wand2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="container py-12">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome to Gati Desk
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your documents with AI-powered translation and processing tools
          </p>
          <div className="relative w-full max-w-lg mx-auto h-40">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <img
              src="https://illustrations.popsy.co/white/graphic-design.svg"
              alt="Hero illustration"
              className="relative w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/translate">
            <Card className="group relative overflow-hidden rounded-xl border p-6 hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <Languages className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Translation</h2>
                  <p className="text-sm text-muted-foreground">
                    Translate documents with AI-powered accuracy
                  </p>
                </div>
              </div>
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/10 group-hover:ring-primary/30 transition-all" />
            </Card>
          </Link>

          <Card className="group relative overflow-hidden rounded-xl border p-6 hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3 group-hover:bg-accent/20 transition-colors">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold">Document Processing</h2>
                <p className="text-sm text-muted-foreground">
                  Process multiple document formats seamlessly
                </p>
              </div>
            </div>
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/10 group-hover:ring-accent/30 transition-all" />
          </Card>

          <Card className="group relative overflow-hidden rounded-xl border p-6 hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary/10 p-3 group-hover:bg-secondary/20 transition-colors">
                <Bot className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Get intelligent suggestions and corrections
                </p>
              </div>
            </div>
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-secondary/10 group-hover:ring-secondary/30 transition-all" />
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Upload Document",
                description: "Upload your document in any supported format"
              },
              {
                icon: <Wand2 className="h-8 w-8" />,
                title: "Process & Translate",
                description: "Our AI processes and translates your content"
              },
              {
                icon: <Bot className="h-8 w-8" />,
                title: "Get Results",
                description: "Download your translated document"
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Animation Section */}
        <div className="relative h-60 overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://illustrations.popsy.co/white/solution-mindset.svg"
              alt="Process illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}