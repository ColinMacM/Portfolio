// src/components/ProjectPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import "./ProjectPage.css"; // optional styling

function ProjectPage() {
  const { projectId } = useParams();
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(`/src/markdown/${projectId}.md`)
      .then((res) => res.text())
      .then(setMarkdown)
      .catch(() => setMarkdown("# 404\nProject not found."));
  }, [projectId]);

  return (
    <motion.div
      className="project-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </motion.div>
  );
}

export default ProjectPage;

