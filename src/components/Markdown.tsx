import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import Flow from "./Flow";
import Uml from "./Uml";

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // ```flow blocks become step-by-step charts and ```uml blocks class diagrams; everything else stays a normal code block.
        pre({ children: kids, ...props }) {
          const child = Array.isArray(kids) ? kids[0] : kids;
          const el = child as { props?: { className?: string; children?: ReactNode } } | undefined;
          if (el?.props?.className?.includes("language-flow")) {
            return <Flow source={textOf(el.props.children)} />;
          }
          if (el?.props?.className?.includes("language-uml")) {
            return <Uml source={textOf(el.props.children)} />;
          }
          return <pre {...props}>{kids}</pre>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
