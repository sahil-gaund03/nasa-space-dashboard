export function Footer() {
  return (
    <footer className="mt-20 pt-10 border-t border-border">
      <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent" />
            <span className="font-display font-semibold tracking-tight">Aether</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            An AI-powered space-tech analytics platform. Built for engineers, scientists and operators
            working at the frontier.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white/[0.02]">
            <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
            <span className="font-accent text-[10px] text-muted-foreground">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {[
          { h: "Platform", items: ["Dashboard", "AI Assistant", "Telemetry", "Visualizations"] },
          { h: "Missions", items: ["ISS", "Mars Rover", "Artemis", "JWST"] },
          { h: "Company", items: ["About", "Engineering", "Privacy", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <div className="font-accent text-[10px] text-muted-foreground mb-3">{col.h.toUpperCase()}</div>
            <ul className="space-y-2">
              {col.items.map((i) => (
                <li key={i}>
                  <a className="text-sm text-foreground/80 hover:text-foreground transition animate-pulse-none" href="#">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 py-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
        <div>© 2026 Aether Mission Control · Data courtesy NASA · ESA · SpaceX</div>
        <div>v4.2.7 · Build 28a91f</div>
      </div>
    </footer>
  );
}
export default Footer;
