import { cn } from "@/lib/utils";

const escapeRegExp = (str = "") =>
  str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

export const Highlight = ({ search = "", children = "" }) => {
  const patt = new RegExp(`(${escapeRegExp(search)})`, "i");
  const parts = String(children).split(patt);

  if (search) {
    return parts.map((part, index) => (
      <span
        key={index}
        className={cn("whitespace-pre-wrap", {
          underline: patt.test(part),
        })}
      >
        {part}
      </span>
    ));
  } else {
    return children;
  }
};
