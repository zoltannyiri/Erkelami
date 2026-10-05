const style = (background, width, spacing, textAlign = "left") => ({
  background,
  width,
  spacing,
  textAlign,
});

const imageStyle = ({
  aspectRatio = "16:9",
  height = "medium",
  fit = "cover",
  position = "center",
  radius = "medium",
  width = "full",
} = {}) => ({ aspectRatio, height, fit, position, radius, width });

export const PAGE_TEMPLATES = {
  EMPTY: {
    name: "Üres oldal",
    description: "Tiszta oldal, amelyhez később egyenként adhatók blokkok.",
    sections: [],
  },
  SIMPLE_INFO: {
    name: "Egyszerű információs oldal",
    description: "Szöveges információkhoz, szabályzatokhoz és általános tartalmakhoz.",
    sections: [
      {
        type: "TEXT",
        content: {
          heading: "Bevezető",
          text: "",
          style: style("white", "narrow", "normal", "left"),
        },
      },
      {
        type: "TEXT",
        content: {
          heading: "További információk",
          text: "",
          style: style("soft", "narrow", "normal"),
        },
      },
    ],
  },
  INTRODUCTION: {
    name: "Bemutatkozó oldal",
    description: "Bemutatkozáshoz, történethez és képes-szöveges tartalmakhoz.",
    sections: [
      {
        type: "TEXT",
        content: {
          heading: "Bemutatkozás",
          text: "",
          style: style("white", "narrow", "normal", "center"),
        },
      },
      {
        type: "TEXT_IMAGE",
        content: {
          heading: "Történetünk",
          text: "",
          imageUrl: "",
          imageAlt: "",
          imagePosition: "right",
          layout: "imageRight",
          imageWidth: "50",
          verticalAlign: "center",
          style: style("soft", "wide", "normal"),
          imageStyle: imageStyle({ aspectRatio: "4:3", radius: "large" }),
        },
      },
      {
        type: "TEXT_IMAGE",
        content: {
          heading: "Küldetésünk",
          text: "",
          imageUrl: "",
          imageAlt: "",
          imagePosition: "left",
          layout: "imageLeft",
          imageWidth: "40",
          verticalAlign: "center",
          style: style("accent", "wide", "normal"),
          imageStyle: imageStyle({ aspectRatio: "3:2", height: "small" }),
        },
      },
    ],
  },
  DEPARTMENT: {
    name: "Tanszak oldal",
    description: "Hangszeres tanszakok, oktatók és képzések bemutatásához.",
    sections: [
      {
        type: "TEXT",
        content: {
          heading: "A tanszakról",
          text: "",
          style: style("dark", "normal", "large", "center"),
        },
      },
      {
        type: "TEXT_IMAGE",
        content: {
          heading: "Oktatás",
          text: "",
          imageUrl: "",
          imageAlt: "",
          imagePosition: "right",
          layout: "imageRight",
          imageWidth: "50",
          verticalAlign: "top",
          style: style("white", "wide", "normal"),
          imageStyle: imageStyle({ aspectRatio: "4:3", radius: "medium" }),
        },
      },
      {
        type: "CARD_GRID",
        content: {
          heading: "Oktatóink",
          cards: [],
          columns: "3",
          cardStyle: "elevated",
          imageRatio: "1:1",
          imageStyle: imageStyle({ aspectRatio: "1:1", height: "auto", radius: "small" }),
          style: style("soft", "wide", "normal"),
        },
      },
    ],
  },
  NEWS_EVENT: {
    name: "Hír / esemény oldal",
    description: "Koncertekhez, eseményekhez, hírekhez és beszámolókhoz.",
    sections: [
      {
        type: "IMAGE",
        content: {
          imageUrl: "",
          alt: "",
          style: style("white", "wide", "compact"),
          imageStyle: imageStyle({ aspectRatio: "16:9", height: "medium", radius: "large" }),
        },
      },
      {
        type: "TEXT",
        content: {
          heading: "Esemény",
          text: "",
          style: style("white", "narrow", "compact"),
        },
      },
      {
        type: "TEXT",
        content: {
          heading: "Beszámoló",
          text: "",
          style: style("soft", "narrow", "normal"),
        },
      },
      {
        type: "GALLERY",
        content: {
          heading: "Galéria",
          images: [],
          layout: "grid",
          columns: "3",
          imageRatio: "4:3",
          gap: "normal",
          imageStyle: imageStyle({ aspectRatio: "4:3", height: "auto", radius: "small" }),
          style: style("white", "wide", "normal"),
        },
      },
    ],
  },
  LANDING: {
    name: "Kiemelt oldal",
    description: "Nagyobb, vizuálisan hangsúlyos tartalmakhoz.",
    sections: [
      {
        type: "HERO",
        content: {
          heading: "",
          subheading: "",
          imageUrl: "",
          overlay: "medium",
          textPosition: "left",
          height: "large",
          buttonText: "",
          linkUrl: "",
          imageStyle: imageStyle({ aspectRatio: "auto", height: "large", radius: "none" }),
          style: style("dark", "full", "compact"),
        },
      },
      {
        type: "TEXT",
        content: {
          heading: "Bemutatkozás",
          text: "",
          style: style("accent", "narrow", "normal", "center"),
        },
      },
      {
        type: "CARD_GRID",
        content: {
          heading: "Kiemelt tartalmak",
          cards: [],
          columns: "3",
          cardStyle: "imageOverlay",
          imageRatio: "16:9",
          imageStyle: imageStyle({ aspectRatio: "16:9", height: "auto", radius: "small" }),
          style: style("white", "wide", "normal"),
        },
      },
      {
        type: "TEXT_IMAGE",
        content: {
          heading: "",
          text: "",
          imageUrl: "",
          imageAlt: "",
          imagePosition: "left",
          layout: "imageLeft",
          imageWidth: "40",
          verticalAlign: "center",
          style: style("soft", "wide", "normal"),
          imageStyle: imageStyle({ aspectRatio: "3:2", radius: "large" }),
        },
      },
      {
        type: "CTA",
        content: {
          heading: "",
          text: "",
          buttonText: "",
          linkUrl: "",
          variant: "accent",
          alignment: "center",
          buttonStyle: "primary",
          style: style("white", "wide", "normal", "center"),
        },
      },
    ],
  },
};

export const isValidPageTemplateKey = (templateKey) =>
  Object.hasOwn(PAGE_TEMPLATES, templateKey);
