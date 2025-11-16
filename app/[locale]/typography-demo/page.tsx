import { Heading, BodyText } from "@/components/ui/typography";

export default function TypographyDemoPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Page Header */}
        <div>
          <Heading level={1} gutterBottom>Typography System - CVA Pattern</Heading>
          <BodyText size="lg" muted>
            Demonstrating the new class-variance-authority based typography components
            with flexible variants and composition support.
          </BodyText>
        </div>

        {/* New API Usage */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">New CVA-Based API</Heading>
          
          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <Heading level={3}>Code Examples:</Heading>
            
            <div className="space-y-2 font-mono text-sm bg-muted p-4 rounded">
              <div>&lt;Heading level=&#123;1&#125; gutterBottom&gt;Main Title&lt;/Heading&gt;</div>
              <div>&lt;Heading level=&#123;2&#125;&gt;Section Title&lt;/Heading&gt;</div>
              <div>&lt;BodyText size=&quot;lg&quot; weight=&quot;bold&quot;&gt;Bold Content&lt;/BodyText&gt;</div>
              <div>&lt;BodyText muted&gt;Muted text&lt;/BodyText&gt;</div>
              <div>&lt;Lead gutterBottom&gt;Lead paragraph&lt;/Lead&gt;</div>
              <div>&lt;Small&gt;Small text&lt;/Small&gt;</div>
            </div>
          </div>
        </section>

        {/* Legacy API */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">Legacy API (Still Works)</Heading>
          
          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <Heading level={3}>Backward Compatible:</Heading>
            
            <div className="space-y-2 font-mono text-sm bg-muted p-4 rounded">
              <div>&lt;H1&gt;Main Title&lt;/H1&gt;</div>
              <div>&lt;H2&gt;Section Title&lt;/H2&gt;</div>
              <div>&lt;BodyText size=&quot;lg&quot; weight=&quot;bold&quot;&gt;Content&lt;/BodyText&gt;</div>
              <div>&lt;Lead&gt;Lead paragraph&lt;/Lead&gt;</div>
              <div>&lt;Small&gt;Small text&lt;/Small&gt;</div>
            </div>

            <p className="text-sm text-muted-foreground">
              The old H1-H6 components still work but are now implemented using the 
              Heading component under the hood.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">Key Features</Heading>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 rounded-lg border bg-card">
              <Heading level={3} className="mb-3">Type Safety</Heading>
              <BodyText size="sm" muted>
                Full TypeScript support with strict variant typing using 
                class-variance-authority.
              </BodyText>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <Heading level={3} className="mb-3">Composition</Heading>
              <BodyText size="sm" muted>
                Use the asChild prop with Radix Slot for flexible component 
                composition.
              </BodyText>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <Heading level={3} className="mb-3">Variants</Heading>
              <BodyText size="sm" muted>
                Multiple variant options: size, weight, muted state, and 
                gutterBottom spacing.
              </BodyText>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <Heading level={3} className="mb-3">Backward Compatible</Heading>
              <BodyText size="sm" muted>
                Existing code using H1-H6 components continues to work without 
                any changes.
              </BodyText>
            </div>
          </div>
        </section>

        {/* Available Components */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">Available Components</Heading>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Heading</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Variants: level (1-6), gutterBottom
              </p>
              <div className="space-y-1 text-xs font-mono bg-muted p-3 rounded">
                <div>level: 1 | 2 | 3 | 4 | 5 | 6</div>
                <div>gutterBottom?: boolean</div>
                <div>asChild?: boolean</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">BodyText</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Variants: size (xs, sm, base, lg, xl), weight, muted, gutterBottom
              </p>
              <div className="space-y-1 text-xs font-mono bg-muted p-3 rounded">
                <div>size?: &quot;xs&quot; | &quot;sm&quot; | &quot;base&quot; | &quot;lg&quot; | &quot;xl&quot;</div>
                <div>weight?: &quot;normal&quot; | &quot;medium&quot; | &quot;semibold&quot; | &quot;bold&quot;</div>
                <div>muted?: boolean</div>
                <div>gutterBottom?: boolean</div>
                <div>asChild?: boolean</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Other Components</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <span className="font-mono">Lead</span> - Introductory paragraph style</li>
                <li>• <span className="font-mono">Large</span> - Large emphasized text</li>
                <li>• <span className="font-mono">Small</span> - Smaller text for captions</li>
                <li>• <span className="font-mono">Muted</span> - De-emphasized secondary text</li>
                <li>• <span className="font-mono">InlineCode</span> - Inline code snippets</li>
                <li>• <span className="font-mono">Blockquote</span> - Quoted text blocks</li>
                <li>• <span className="font-mono">List</span> - Styled unordered lists</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Usage Tips */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">Usage Tips</Heading>
          
          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <div>
              <h3 className="font-semibold mb-2">1. Import the components</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded">
                import &#123; Heading, BodyText, Lead &#125; from &quot;@/components/ui/typography&quot;
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Use variants for styling</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded">
                &lt;BodyText size=&quot;lg&quot; weight=&quot;bold&quot; muted&gt;...&lt;/BodyText&gt;
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Add spacing with gutterBottom</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded">
                &lt;Heading level=&#123;2&#125; gutterBottom&gt;Section&lt;/Heading&gt;
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Use asChild for composition</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded space-y-1">
                <div>&lt;BodyText asChild&gt;</div>
                <div>&nbsp;&nbsp;&lt;Link href=&quot;/&quot;&gt;Styled Link&lt;/Link&gt;</div>
                <div>&lt;/BodyText&gt;</div>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Guide */}
        <section className="space-y-6">
          <Heading level={2} className="border-b pb-2">Migration Guide</Heading>
          
          <div className="space-y-4 p-6 rounded-lg border bg-card">
            <Heading level={3}>Migrating from Old API to New API:</Heading>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Before:</div>
                <div className="text-sm font-mono bg-muted p-3 rounded mb-2">
                  &lt;H1&gt;Title&lt;/H1&gt;
                </div>
                <div className="text-sm font-semibold mb-2">After:</div>
                <div className="text-sm font-mono bg-muted p-3 rounded">
                  &lt;Heading level=&#123;1&#125;&gt;Title&lt;/Heading&gt;
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Before:</div>
                <div className="text-sm font-mono bg-muted p-3 rounded mb-2">
                  &lt;BodyText size=&quot;lg&quot; weight=&quot;bold&quot;&gt;Text&lt;/BodyText&gt;
                </div>
                <div className="text-sm font-semibold mb-2">After:</div>
                <div className="text-sm font-mono bg-muted p-3 rounded">
                  &lt;BodyText size=&quot;lg&quot; weight=&quot;bold&quot;&gt;Text&lt;/BodyText&gt;
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  (BodyText API remains the same)
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
              <strong className="text-blue-600 dark:text-blue-400">Note:</strong> Both APIs work! 
              No rush to migrate - the old H1-H6 components are just wrappers around the new 
              Heading component.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
