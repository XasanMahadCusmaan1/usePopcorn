import { useState } from "react";
import Button from "./Button.jsx";

function CollapsiblePanel({ title, titleClassName = "", children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="@container relative rounded-md border-2 border-accent bg-code p-3 shadow-soft">
      <div className="relative border-b border-border pb-2 pr-10">
        <h2 className={`font-heading font-bold tracking-tight ${titleClassName}`}>
          {title}
        </h2>
        <Button
          label={`${isExpanded ? "Collapse" : "Expand"} ${title}`}
          isExpanded={isExpanded}
          onCollapse={() => setIsExpanded((expanded) => !expanded)}
        />
      </div>
      {isExpanded && children}
    </section>
  );
}

export default CollapsiblePanel;
