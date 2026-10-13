import Image from "@tiptap/extension-image";

const IMAGE_ALIGNMENTS = new Set(["left", "center", "right", "full"]);

const normalizeAlignment = (value) =>
  IMAGE_ALIGNMENTS.has(value) ? value : "center";

const RichTextImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: (element) => normalizeAlignment(element.dataset.align),
        renderHTML: ({ align }) => ({
          "data-align": normalizeAlignment(align),
        }),
      },
    };
  },
}).configure({
  resize: {
    enabled: true,
    directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
    minWidth: 160,
    minHeight: 90,
    alwaysPreserveAspectRatio: true,
  },
  HTMLAttributes: {
    loading: "lazy",
  },
});

export default RichTextImage;
