import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";
import { FaFileExport } from "react-icons/fa";

const ReportToolSetComp = () => {
  const { reportSections } = useContext(HomePageContext);

  const exportReport = () => {
    if (!reportSections || reportSections.length === 0) {
      console.warn("No report sections to export.");
      return;
    }

    let markdownContent = "# Report\n\n";

    reportSections.forEach((section) => {
      if (section.role === "content" && section.title && section.content) {
        markdownContent += `## ${section.title}\n\n`;
        markdownContent += `${section.content}\n\n`;
      } else if (section.role === "image" && section.content && section.mimeType) {
        // Check if the content is a valid base64 string
        if (section.content.startsWith("data:") || section.content.startsWith("/")) {
          markdownContent += `![${section.title || "Image"}](${section.content})\n\n`;
        } else {
          console.warn(`Invalid image data for section: ${section.title}`);
        }
      }
    });

    const filename = "report.md";
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/markdown;charset=utf-8," + encodeURIComponent(markdownContent)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    console.log("Report exported as markdown.");
  };

  return (
    <div className="box">
      <div className="buttons">
        <button className="button" onClick={exportReport}>
          <span className="icon mr-2">
            <FaFileExport />
          </span>
          <span>导出</span>
        </button>
      </div>
    </div>
  );
};

export default ReportToolSetComp;