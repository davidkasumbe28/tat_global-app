import faqs from "@/lib/data/raw/faq";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { Card } from "../ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export default function FAQSections({ emuted = true }: { emuted?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8">
      {faqs.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <Skeleton emuted={emuted}>
            <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
          </Skeleton>
          <div className="space-y-3">
            {section.items.map((faq, itemIndex) => {
              const globalIndex = sectionIndex * 10 + itemIndex;
              return (
                <Card
                  key={itemIndex}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    setOpenIndex(openIndex === globalIndex ? null : globalIndex)
                  }
                  emuted={emuted}
                >
                  <div className="p-6 flex items-center justify-between">
                    <Skeleton emuted={emuted}>
                      <h3 className="font-bold text-lg flex-1">{faq.q}</h3>
                    </Skeleton>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform",
                        openIndex === globalIndex && "rotate-180",
                        emuted &&
                          "bg-muted-foreground text-muted-foreground animate-pulse rounded"
                      )}
                    />
                  </div>
                  {openIndex === globalIndex && (
                    <div className="px-6 pb-6 border-t border-border text-gray-500">
                      <Skeleton emuted={emuted}>{faq.a}</Skeleton>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
