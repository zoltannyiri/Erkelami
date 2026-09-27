import TextSection from "./TextSection";
import ImageSection from "./ImageSection";

export default function PageSectionRenderer({ section }) {
  switch (section.type) {
    case "TEXT":
      return <TextSection content={section.content} />;

    case "IMAGE":
      return <ImageSection content={section.content} />;

    default:
      return null;
  }
}