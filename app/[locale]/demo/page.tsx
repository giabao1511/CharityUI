"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BodyText,
  Lead,
  Large,
  Small,
  Muted,
  InlineCode,
  Blockquote,
  List,
} from "@/components/ui/typography"
import { toast } from "sonner"
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"

export default function ComponentsDemo() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12">
        <H1 className="mb-4">Component Showcase</H1>
        <Lead>
          Explore our toast notifications and typography system with multiple levels and styles.
        </Lead>
      </div>

      {/* Toast Notifications Section */}
      <section className="mb-16">
        <H2 className="mb-6">Toast Notifications</H2>
        <Card>
          <CardHeader>
            <CardTitle>Try Different Toast Types</CardTitle>
            <CardDescription>
              Click the buttons below to see different toast notification styles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() =>
                  toast.success("Success!", {
                    description: "Your action was completed successfully.",
                    icon: <CheckCircle2 className="h-5 w-5" />,
                  })
                }
                variant="default"
              >
                Success Toast
              </Button>

              <Button
                onClick={() =>
                  toast.error("Error!", {
                    description: "Something went wrong. Please try again.",
                    icon: <AlertCircle className="h-5 w-5" />,
                  })
                }
                variant="destructive"
              >
                Error Toast
              </Button>

              <Button
                onClick={() =>
                  toast.info("Information", {
                    description: "Here's some helpful information for you.",
                    icon: <Info className="h-5 w-5" />,
                  })
                }
                variant="secondary"
              >
                Info Toast
              </Button>

              <Button
                onClick={() =>
                  toast.warning("Warning!", {
                    description: "Please be careful with this action.",
                    icon: <AlertTriangle className="h-5 w-5" />,
                  })
                }
                variant="outline"
              >
                Warning Toast
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => {
                  const promise = new Promise((resolve) =>
                    setTimeout(() => resolve({ name: "Campaign" }), 2000)
                  )
                  toast.promise(promise, {
                    loading: "Loading...",
                    success: "Data loaded successfully!",
                    error: "Failed to load data.",
                  })
                }}
                variant="outline"
              >
                Promise Toast
              </Button>

              <Button
                onClick={() =>
                  toast("Custom Toast", {
                    description: "This is a custom styled toast notification.",
                    action: {
                      label: "Undo",
                      onClick: () => toast.success("Action undone!"),
                    },
                  })
                }
                variant="outline"
              >
                Toast with Action
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography Section */}
      <section>
        <H2 className="mb-6">Typography System</H2>
        
        {/* Headings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Headings (H1 - H6)</CardTitle>
            <CardDescription>Six levels of headings with responsive sizing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <H1>Heading 1 - Main Title</H1>
              <Muted>text-4xl lg:text-5xl, font-bold</Muted>
            </div>
            <div>
              <H2>Heading 2 - Section Title</H2>
              <Muted>text-3xl lg:text-4xl, font-semibold</Muted>
            </div>
            <div>
              <H3>Heading 3 - Subsection</H3>
              <Muted>text-2xl lg:text-3xl, font-semibold</Muted>
            </div>
            <div>
              <H4>Heading 4 - Component Title</H4>
              <Muted>text-xl lg:text-2xl, font-semibold</Muted>
            </div>
            <div>
              <H5>Heading 5 - Small Section</H5>
              <Muted>text-lg lg:text-xl, font-semibold</Muted>
            </div>
            <div>
              <H6>Heading 6 - Minor Heading</H6>
              <Muted>text-base lg:text-lg, font-semibold</Muted>
            </div>
          </CardContent>
        </Card>

        {/* Body Text */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Body Text</CardTitle>
            <CardDescription>Flexible body text with multiple sizes and weights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Small className="mb-2">Extra Small (xs)</Small>
              <BodyText size="xs">
                This is extra small body text. Perfect for disclaimers and fine print.
              </BodyText>
            </div>
            <div>
              <Small className="mb-2">Small (sm)</Small>
              <BodyText size="sm">
                This is small body text. Great for secondary information and descriptions.
              </BodyText>
            </div>
            <div>
              <Small className="mb-2">Base (default)</Small>
              <BodyText size="base">
                This is base body text. The standard size for most content and paragraphs.
              </BodyText>
            </div>
            <div>
              <Small className="mb-2">Large (lg)</Small>
              <BodyText size="lg">
                This is large body text. Use for emphasis or introductory content.
              </BodyText>
            </div>
            <div>
              <Small className="mb-2">Extra Large (xl)</Small>
              <BodyText size="xl">
                This is extra large body text. Perfect for highlighting key messages.
              </BodyText>
            </div>

            <div className="pt-4 border-t">
              <Small className="mb-2">Font Weights</Small>
              <div className="space-y-2">
                <BodyText weight="normal">Normal weight text</BodyText>
                <BodyText weight="medium">Medium weight text</BodyText>
                <BodyText weight="semibold">Semibold weight text</BodyText>
                <BodyText weight="bold">Bold weight text</BodyText>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Small className="mb-2">Muted Text</Small>
              <BodyText muted>
                This is muted body text with reduced opacity for secondary content.
              </BodyText>
            </div>
          </CardContent>
        </Card>

        {/* Special Text Components */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Text Components</CardTitle>
            <CardDescription>Additional text styles for various use cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Small className="mb-2">Lead Text</Small>
              <Lead>
                This is lead text - perfect for article introductions or important opening
                statements that need extra emphasis.
              </Lead>
            </div>

            <div>
              <Small className="mb-2">Large Text</Small>
              <Large>This is large text component for prominent labels or titles.</Large>
            </div>

            <div>
              <Small className="mb-2">Small Text</Small>
              <Small>This is small text component for labels and captions.</Small>
            </div>

            <div>
              <Small className="mb-2">Muted Text</Small>
              <Muted>
                This is muted text component for de-emphasized content and helper text.
              </Muted>
            </div>

            <div>
              <Small className="mb-2">Inline Code</Small>
              <BodyText>
                Use <InlineCode>npm install</InlineCode> to install packages or run{" "}
                <InlineCode>npm run dev</InlineCode> to start the development server.
              </BodyText>
            </div>

            <div>
              <Small className="mb-2">Blockquote</Small>
              <Blockquote>
                "Design is not just what it looks like and feels like. Design is how it works."
                <footer className="mt-2 text-sm">— Steve Jobs</footer>
              </Blockquote>
            </div>

            <div>
              <Small className="mb-2">List</Small>
              <List>
                <li>First item in the list</li>
                <li>Second item with more content</li>
                <li>Third item to demonstrate spacing</li>
                <li>Fourth item showing consistency</li>
              </List>
            </div>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>Real-World Example</CardTitle>
            <CardDescription>
              How typography components work together in actual content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <H3>Creating Impactful Campaigns</H3>
            <Lead>
              Learn the essential steps to launch a successful fundraising campaign that
              resonates with your audience.
            </Lead>
            <BodyText>
              Building a successful campaign requires careful planning and execution. Start by
              defining your goals and understanding your target audience. Create compelling
              content that tells your story authentically.
            </BodyText>
            <H4>Key Success Factors</H4>
            <List>
              <li>Clear and compelling campaign goals</li>
              <li>Authentic storytelling that connects emotionally</li>
              <li>Regular updates to keep supporters engaged</li>
              <li>Transparent use of funds and milestone tracking</li>
            </List>
            <BodyText muted>
              Remember: Success comes from consistency and genuine connection with your
              supporters.
            </BodyText>
            <Blockquote>
              "The best campaigns are built on trust, transparency, and genuine passion for
              making a difference."
            </Blockquote>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
