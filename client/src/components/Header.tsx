export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/mce-logo.png" 
            alt="MCE Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">ACC Asset Extractor</h1>
            <p className="text-sm text-muted-foreground">Solar Farm Asset Management</p>
          </div>
        </div>
      </div>
    </header>
  );
}
