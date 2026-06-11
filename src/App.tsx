import { ChatWidget } from './components/ChatWidget';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background E-commerce Store Mockup (Context) */}
      <div className="fixed inset-0 pointer-events-none opacity-30 p-gutter">
        <div className="max-w-6xl mx-auto py-12">
          {/* Logo / Header Mock */}
          <div className="h-8 w-48 bg-outline-variant rounded mb-lg"></div>
          
          {/* Grid Layout Mock */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Left Hero Area */}
            <div className="col-span-8 aspect-video bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant/30">
              <span className="text-on-surface-variant font-geist text-sm opacity-50 uppercase tracking-widest">Storefront Hero Preview</span>
            </div>
            
            {/* Right Column Area */}
            <div className="col-span-4 space-y-md">
              <div className="h-12 bg-surface-container-high rounded-lg w-full"></div>
              <div className="h-64 bg-surface-container rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Micro-interactions Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating FAQBot Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
